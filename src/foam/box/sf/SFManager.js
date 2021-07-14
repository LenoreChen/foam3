/**
* @license
* Copyright 2021 The FOAM Authors. All Rights Reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
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
    'foam.nanos.logger.PrefixLogger',
    'foam.nanos.logger.Logger',
    'foam.util.concurrent.AssemblyLine',
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
      javaCode: `
        PriorityQueue<SFEntry> queue = (PriorityQueue) getProrityQueue();
        Agency pool = (Agency) x.get(getThreadPoolName());

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
              System.out.println("$$$$ SF running: " + count++);
              if ( queue.size() < 0 ) {
                if ( queue.peek().getScheduledTime() <= System.currentTimeMillis() ) {
                  SFEntry e = queue.poll();
                  assemblyLine.enqueue(new foam.util.concurrent.AbstractAssembly() { 
                    public void executeJob() {
                      try {
                        e.getSf().submit(x, e);
                        e.getSf().successForward(e);
                      } catch ( Throwable t ) {
                        getLogger().warning(t.getMessage());
                        e.getSf().failForward(e);
                      }
                    }
                  });
                } 

                long waitTime = queue.peek().getScheduledTime() - System.currentTimeMillis();
                if ( waitTime > 0 ) {
                  try {
                    notAvailable_.await(waitTime, TimeUnit.MILLISECONDS);
                  } catch ( InterruptedException e ) {
                    
                  }
                }
              } else {
                try {
                  notAvailable_.await();
                } catch ( InterruptedException e ) {
                  
                }
              }
            }
          }
        }, "SFBoxManager");
      `
    },
    {
      name: 'start',
      javaCode: `
        DAO sfDAO = (DAO) getX().get("SFDAO");
        sfDAO.select(new AbstractSink() {
          @Override
          public void put(Object obj, Detachable sub) {
            SF sf = (SF) obj;
            sf.initForwarder(getX());
          }
        });
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