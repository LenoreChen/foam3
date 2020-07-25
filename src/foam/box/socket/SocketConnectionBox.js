/**
 * @license
 * Copyright 2020 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */
foam.CLASS({
  package: 'foam.box.socket',
  name: 'SocketConnectionBox',

  implements: [
    'foam.box.Box',
    'foam.core.ContextAgent'
  ],

  javaImports: [
    'foam.box.Box',
    'foam.box.Message',
    'foam.box.ReplyBox',
    'foam.core.ContextAgent',
    'foam.core.FObject',
    'foam.core.X',
    'foam.lib.json.JSONParser',
    'foam.nanos.logger.PrefixLogger',
    'foam.nanos.logger.Logger',
    'foam.nanos.pm.PM',
    'java.net.Socket',
    'java.io.BufferedOutputStream',
    'java.io.DataInputStream',
    'java.io.DataOutputStream',
    'java.io.InputStream',
    'java.io.InputStreamReader',
    'java.io.IOException',
    'java.io.OutputStream',
    'java.io.OutputStreamWriter',
    'java.nio.ByteBuffer',
    'java.nio.charset.StandardCharsets',
    'java.util.Map',
    'java.util.HashMap',
    'java.util.Collections',
    'java.util.concurrent.atomic.AtomicLong'
  ],
    
  constants: [
    {
      name: 'REPLY_BOX_ID',
      value: 'REPLY_BOX_ID',
      type: 'String'
    }
  ],

  properties: [
    {
      documentation: 'managed by SocketConnectionBoxManager',
      name: 'key',
      class: 'String'
    },
    {
      name: 'host',
      class: 'String'
    },
    {
      name: 'port',
      class: 'Int'
    },
    {
      name: 'socket',
      class: 'Object',
      visibility: 'HIDDEN'
    },
    {
      documentation: 'Set to false when send exits, triggering execute to exit',
      name: 'valid',
      class: 'Boolean',
      value: true,
      visibility: 'HIDDEN'
    },
    {
      name: 'replyBoxes',
      class: 'Map',
      javaFactory: `return new HashMap();`,
      visibility: 'HIDDEN',
    },
    {
      name: 'logger',
      class: 'FObjectProperty',
      of: 'foam.nanos.logger.Logger',
      visibility: 'HIDDEN',
      javaFactory: `
        return new PrefixLogger(new Object[] {
          this.getClass().getSimpleName(),
          getHost(),
          getPort()
        }, (Logger) getX().get("logger"));
      `
    }
  ],

  axioms: [
    {
      name: 'javaExtras',
      buildJavaClass: function(cls) {
        cls.extras.push(foam.java.Code.create({
          data: `
  public SocketConnectionBox(X x, String key, Socket socket, String host, int port)
    throws IOException
  {
    setX(x);
    setKey(key);
    setHost(host);
    setPort(port);
    setSocket(socket);

    out_ = new DataOutputStream(new BufferedOutputStream(socket.getOutputStream()));
    in_ = new DataInputStream(socket.getInputStream());
  }

  protected DataInputStream in_;
  protected DataOutputStream out_;
  private static AtomicLong replyBoxId_ = new AtomicLong(0);
  private static AtomicLong flushId_ = new AtomicLong(0);

  protected static final ThreadLocal<foam.lib.formatter.FObjectFormatter> formatter_ = new ThreadLocal<foam.lib.formatter.FObjectFormatter>() {
    @Override
    protected foam.lib.formatter.JSONFObjectFormatter initialValue() {
      foam.lib.formatter.JSONFObjectFormatter formatter = new foam.lib.formatter.JSONFObjectFormatter();
      formatter.setQuoteKeys(true);
      formatter.setPropertyPredicate(new foam.lib.ClusterPropertyPredicate());
      return formatter;
    }

    @Override
    public foam.lib.formatter.FObjectFormatter get() {
      foam.lib.formatter.FObjectFormatter formatter = super.get();
      formatter.reset();
      return formatter;
    }
  };
        `
        }));
      }
    }
  ],

  methods: [
    {
      name: 'send',
      javaCode: `
      Long flushId = flushId_.incrementAndGet();
      Box replyBox = (Box) msg.getAttributes().get("replyBox");
      if ( replyBox != null ) {
        Long replyBoxId = replyBoxId_.incrementAndGet();
        getReplyBoxes().put(replyBoxId, new BoxHolder(replyBox, PM.create(getX(), this.getOwnClassInfo(), getHost()+":"+getPort()+":roundtrip")));
        SocketClientReplyBox box = new SocketClientReplyBox(replyBoxId);
        if ( replyBox instanceof ReplyBox ) {
          ((ReplyBox)replyBox).setDelegate(box);
          getLogger().debug("send", "replyBox.setDelegate");
        } else {
          replyBox = box;
        }
        msg.getAttributes().put("replyBox", replyBox);
      }
      String message = null;
      try {
        foam.lib.formatter.FObjectFormatter formatter = formatter_.get();
        formatter.setX(getX());
        formatter.output(msg);
        message = formatter.builder().toString();
        byte[] messageBytes = message.getBytes(StandardCharsets.UTF_8);
        synchronized (out_) {
          out_.writeLong(System.currentTimeMillis());
          out_.writeInt(messageBytes.length);
          out_.write(messageBytes);
          out_.flush();
          // REVIEW: this does not work.
          // if ( flushId == flushId_.get() ) {
          //   getLogger().debug("flush");
          //   out_.flush();
          // } else {
          //   getLogger().info("flush", "skip", flushId, flushId_.get());
          // }
        }
      } catch ( Exception e ) {
        // TODO: perhaps report last exception on host port via manager.
        getLogger().error(e.getMessage(), "message", message, e);
        setValid(false);
        throw new RuntimeException(e);
      }
      `
    },
    {
      name: 'execute',
      args: [
        {
          name: 'x',
          type: 'Context'
        }
      ],
      javaCode: `
      try {
        while ( getValid() ) {
          try {
            long sent = in_.readLong();
            PM pm = PM.create(getX(), this.getOwnClassInfo(), getHost()+":"+getPort()+":network");
            pm.setStartTime(new java.util.Date(sent));
            pm.log(x);

            int length = in_.readInt();
            byte[] bytes = new byte[length];
            StringBuilder data = new StringBuilder();
            int total = 0;
            while ( true ) {
              int bytesRead = 0;
              try {
                bytesRead = in_.read(bytes, 0, length - total);
                if ( bytesRead == -1 ) {
                  getLogger().debug("eof,-1");
                  break;
                }
              } catch ( java.io.EOFException | java.net.SocketException e ) {
                getLogger().debug(e.getMessage());
                break;
              }
              data.append(new String(bytes, 0, bytesRead, StandardCharsets.UTF_8));
              total += bytesRead;
              if ( total == length ) {
                break;
              }
              if ( total > length ) {
                // REVIEW: can this happen?
                getLogger().error("read too much", length, total);
                break;
              }
            }
            String message = data.toString();
            if ( foam.util.SafetyUtil.isEmpty(message) ) {
              Socket socket = (Socket) x.get("socket");
              getLogger().error("Received empty message from", socket != null ? socket.getRemoteSocketAddress() : "NA");
              throw new RuntimeException("Received empty message.");
            }
            // getLogger().debug("receive", "message", message);
            Message msg = (Message) x.create(JSONParser.class).parseString(message);
            if ( msg == null ) {
              getLogger().warning("Failed to parse", "message", message);
              throw new RuntimeException("Failed to parse.");
            }
            Long replyBoxId = (Long) msg.getAttributes().get(REPLY_BOX_ID);
            BoxHolder holder = (BoxHolder) getReplyBoxes().get(replyBoxId);
            if ( holder != null ) {
              Box replyBox = holder.getBox();
              pm = holder.getPm();
              pm.log(x);
              getReplyBoxes().remove(replyBoxId);
              replyBox.send(msg);
            } else {
              getLogger().error("ReplyBox not found", replyBoxId);
              throw new RuntimeException("ReplyBox not found.");
            }
          } catch ( java.net.SocketTimeoutException e ) {
            // getLogger().debug("SocketTimeoutException");

            // REVIEW: The flush logic in 'send' in buggy and stalling.  This
            // will periodically flush the 'send' output stream.
            synchronized ( out_ ) {
              try {
                out_.flush();
              } catch ( IOException ioe ) {
                // nop
              }
            }
            continue;
          } catch ( java.io.IOException e ) {
            getLogger().debug(e.getMessage());
            break;
          } catch ( Throwable t ) {
            // REVIEW: remove this catch when understand all exceptions
            getLogger().error(t);
            break;
          }
        }
      } finally {
        ((SocketConnectionBoxManager) getX().get("socketConnectionBoxManager")).remove(this);
      }
      `
    }
  ]
});
