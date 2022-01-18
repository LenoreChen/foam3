/**
 * @license
 * Copyright 2022 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.box.sf',
  name: 'SFManager',
  
  implements: [
    'foam.nanos.NanoService',
  ],

  javaImports: [
    'foam.dao.DAO',
    'foam.box.Box',
    'foam.box.ReplyBox',
    'foam.core.Agency',
    'foam.dao.AbstractSink',
    'foam.core.Detachable',
    'foam.core.ContextAgent',
    'foam.core.X',
    'foam.core.FObject',
    'foam.nanos.logger.PrefixLogger',
    'foam.nanos.logger.Logger',
    'foam.util.concurrent.AssemblyLine',
    'foam.nanos.medusa.ClusterConfig',
    'foam.nanos.medusa.ClusterConfigSupport',
    'foam.nanos.medusa.MedusaType',
    'foam.nanos.medusa.Status',
    'foam.util.retry.RetryStrategy',
    'foam.util.retry.RetryForeverStrategy',
    'java.util.PriorityQueue',
    'java.util.concurrent.TimeUnit',
    'java.util.concurrent.locks.ReentrantLock',
    'java.util.concurrent.locks.Condition',
  ],

  properties: [
    {
      class: 'Object',
      javaType: 'PriorityQueue',
      name: 'prorityQueue',
      javaFactory: `
        return new PriorityQueue<SFEntry>(16, (n, p) -> {
          if ( n.getScheduledTime() < p.getScheduledTime() ) {
            return -1;
          }
          if ( n.getScheduledTime() > p.getScheduledTime() ) {
            return 1;
          }
          return 0;
        });
      `
    },
    {
      name: 'cluster',
      class: 'Boolean',
      javaFactory: `
      return foam.util.SafetyUtil.equals("true", System.getProperty("CLUSTER", "false"));
      `
    },
    {
      class: 'Int',
      name: 'medusaTimeWindow',
      units: 's',
      value: -1
    },
    {
      name: 'medusaRetryStrategy',
      class: 'FObjectProperty',
      of: 'foam.util.retry.RetryStrategy',
      javaFactory: `
        return (new RetryForeverStrategy.Builder(null))
          .setRetryDelay(1000)
          .build();
      `
    },
    {
      class: 'Int',
      name: 'medusaFileCapacity',
      value: 4096
    },
    {
      class: 'String',
      name: 'SFBroadcastReceiverService',
      value: 'SFBroadcastReceiverDAO'
    },
    {
      name: 'sfs',
      class: 'Map',
      javaFactory: `return new java.util.concurrent.ConcurrentHashMap();`
    },
    {
      class: 'String',
      name: 'threadPoolName',
      value: 'threadPool'
    },
    {
      name: 'logger',
      class: 'FObjectProperty',
      of: 'foam.nanos.logger.Logger',
      visibility: 'HIDDEN',
      transient: true,
      javaCloneProperty: '//noop',
      javaFactory: `
        return new PrefixLogger(new Object[] {
          this.getClass().getSimpleName()
        }, (Logger) getX().get("logger"));
      `
    }
  ],
  
  methods: [
    {
      name: 'enqueue',
      args: 'SFEntry e',
      documentation: 'add entry into process queue, initForwarder method will take over the rest of job',
      javaCode: `
        PriorityQueue<SFEntry> queue = (PriorityQueue) getProrityQueue();
        lock_.lock();
        try {
          queue.offer(e);
          notAvailable_.signal();
        } finally {
          lock_.unlock();
        }
      `
    },
    {
      name: 'initForwarder',
      args: 'Context x',
      javaThrows: [],
      documentation: 'processor that polling entries from queue and try delegate.put when there are available entries',
      javaCode: `
        PriorityQueue<SFEntry> queue = (PriorityQueue) getProrityQueue();
        Agency pool = (Agency) x.get(getThreadPoolName());

        //TODO: use below code after finish testing.
        // final AssemblyLine assemblyLine = x.get("threadPool") == null ?
        //   new foam.util.concurrent.SyncAssemblyLine()   :
        //   new foam.util.concurrent.AsyncAssemblyLine(x) ;

        final AssemblyLine assemblyLine = new foam.util.concurrent.SyncAssemblyLine();

        pool.submit(x, new ContextAgent() {
          volatile long count = 0;
          @Override
          public void execute(X x) {
            lock_.lock();
            while ( true ) {
              getLogger().info("$$$$ SF running: " + count++ + " queue size: " + queue.size());
              if ( queue.size() > 0 ) {
                if ( queue.peek().getScheduledTime() <= System.currentTimeMillis() ) {
                  SFEntry e = queue.poll();
                  assemblyLine.enqueue(new foam.util.concurrent.AbstractAssembly() { 
                    public void executeJob() {
                      try {
                        e.getSf().submit(x, e);
                        e.getSf().successForward(e);
                      } catch ( Throwable t ) {
                        getLogger().warning(t.getMessage());
                        e.getSf().failForward(e, t);
                      }
                    }
                  });
                } 

                if ( queue.size() > 0 ) {
                  long waitTime = queue.peek().getScheduledTime() - System.currentTimeMillis();
                  if ( waitTime > 0 ) {
                    try {
                      getLogger().info("$$$ waitTime: " + waitTime);
                      notAvailable_.await(waitTime, TimeUnit.MILLISECONDS);
                    } catch ( InterruptedException e ) {
                      getLogger().info("SFManager interrupt: " + waitTime);
                    }
                  }
                } else {
                  try {
                    notAvailable_.await();
                  } catch ( InterruptedException e ) {
                    getLogger().info("SFManager interrupt");
  
                  }
                }
              } else {
                try {
                  notAvailable_.await();
                } catch ( InterruptedException e ) {
                  getLogger().info("SFManager interrupt");

                }
              }
            }
          }
        }, "SFManager");
      `
    },
    {
      name: 'start',
      documentation: 'Initial each SF',
      javaCode: `
        X context = getX();
        initForwarder(x_);
        final SFManager manager = this;
        DAO internalSFDAO = (DAO) getX().get("internalSFDAO");
        internalSFDAO.select(new AbstractSink() {
          @Override
          public void put(Object obj, Detachable sub) {
            try {
              SF sf = (SF) ((FObject) obj).fclone();
              sf.setX(context);
              sf.setManager(manager);
              sf.initial(context);
              sf.setReady(true);
              getSfs().put(sf.getId(), sf);
              getLogger().info("Initialize successfully: " + sf.getId());
            } catch ( Throwable t ) {
              getLogger().error(t);
            }
          }
        });

        if ( getCluster() ) {
          ClusterConfigSupport support = (ClusterConfigSupport) getX().get("clusterConfigSupport");
          ClusterConfig myConfig = support.getConfig(getX(), support.getConfigId());
          if ( myConfig.getType() == MedusaType.MEDIATOR ) {
            for ( ClusterConfig config : support.getSfBroadcastMediators() ) {
              try {
                getLogger().info("findMediator: " + config.getId());
                if ( config.getId().equals(myConfig.getId()) ) continue;
    
                SF sf = new SFMedusaClientDAO.Builder(context)
                          .setId(config.getId())
                          .setFileName(config.getId())
                          .setTimeWindow(getMedusaTimeWindow())
                          .setFileCapacity(getMedusaFileCapacity())
                          .setRetryStrategy(getMedusaRetryStrategy())
                          .setMyConfig(myConfig)
                          .setToConfig(config)
                          .setManager(manager)
                          .build();
                sf.setX(context);
                sf.initial(context);
                sf.setReady(true);
                getSfs().put(sf.getId(), sf);
                getLogger().info("Initialize successfully: " + sf.getId());
              } catch ( Throwable t ) {
                getLogger().warning(t.getMessage());
              }
            }
          }
        }
        getLogger().info("SFManager Start");

      `
    }
  ],

  axioms: [
    {
      name: 'javaExtras',
      buildJavaClass: function(cls) {
        cls.extras.push(foam.java.Code.create({
          data: `
            private final ReentrantLock lock_ = new ReentrantLock();
            private final Condition notAvailable_ = lock_.newCondition();
        
          `
        }));
      }
    }
  ]
})