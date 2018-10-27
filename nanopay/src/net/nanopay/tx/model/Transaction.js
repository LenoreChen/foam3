foam.CLASS({
  package: 'net.nanopay.tx.model',
  name: 'Transaction',

  tableColumns: [
    'id',
    'status',
    'payer',
    'payee',
    'amount',
    'displayType',
    'created',
    'processDate',
    'completionDate'
  ],

  implements: [
    'foam.core.Validatable',
    'foam.nanos.auth.CreatedAware',
    'foam.nanos.auth.CreatedByAware',
    'foam.nanos.auth.LastModifiedAware',
    'foam.nanos.auth.LastModifiedByAware'
  ],

  imports: [
    'addCommas',
    'userDAO'
  ],

  javaImports: [
    'foam.core.FObject',
    'foam.core.PropertyInfo',
    'foam.core.X',
    'foam.dao.DAO',
    'foam.dao.ProxyDAO',
    'foam.dao.Sink',
    'foam.mlang.MLang',
    'foam.nanos.auth.AuthorizationException',
    'foam.nanos.auth.User',
    'java.util.*',
    'java.util.Arrays',
    'java.util.Date',
    'java.util.List',
    'net.nanopay.account.Account',
    'net.nanopay.account.Balance',
    'net.nanopay.admin.model.ComplianceStatus',
    'net.nanopay.bank.BankAccount',
    'net.nanopay.invoice.model.Invoice',
    'net.nanopay.invoice.model.PaymentStatus',
    'net.nanopay.model.Business',
    'net.nanopay.tx.ETALineItem',
    'net.nanopay.tx.FeeLineItem',
    'net.nanopay.tx.TransactionLineItem',
    'net.nanopay.tx.Transfer',
    'net.nanopay.tx.model.TransactionStatus'
  ],

  constants: [
    {
      name: 'STATUS_BLACKLIST',
      type: 'Set<TransactionStatus>',
      value: `Collections.unmodifiableSet(new HashSet<TransactionStatus>() {{
        add(TransactionStatus.REFUNDED);
        add(TransactionStatus.PENDING);
      }});`
    }
  ],

  searchColumns: [
    'name', 'id', 'status'
  ],

  // relationships: parent, children

  properties: [
    {
      name: 'name',
      class: 'String',
      visibility: 'RO',
      factory: function() {
        return this.cls_.name;
      },
      javaFactory: 'return getClass().getSimpleName();'
    },
    {
      name: 'isQuoted',
      class: 'Boolean',
      hidden: true
    },
    {
      name: 'transfers',
      class: 'FObjectArray',
      of: 'net.nanopay.tx.Transfer',
      javaFactory: 'return new Transfer[0];',
      hidden: true
    },
    {
      name: 'reverseTransfers',
      class: 'FObjectArray',
      of: 'net.nanopay.tx.Transfer',
      javaFactory: 'return new Transfer[0];',
      hidden: true
    },
    {
      class: 'String',
      name: 'id',
      label: 'Transaction ID',
      visibility: 'RO',
      javaJSONParser: `new foam.lib.parse.Alt(new foam.lib.json.LongParser(), new foam.lib.json.StringParser())`,
      javaCSVParser: `new foam.lib.parse.Alt(new foam.lib.json.LongParser(), new foam.lib.csv.CSVStringParser())`

    },
    {
      class: 'DateTime',
      name: 'created',
      documentation: `The date the transaction was created.`,
    },
    {
      class: 'Reference',
      of: 'foam.nanos.auth.User',
      name: 'createdBy',
      documentation: `The id of the user who created the transaction.`,
    },
    {
      class: 'DateTime',
      name: 'lastModified',
      documentation: `The date the transaction was last modified.`,
    },
    {
      class: 'Reference',
      of: 'foam.nanos.auth.User',
      name: 'lastModifiedBy',
      documentation: `The id of the user who last modified the transaction.`,
    },
    {
      class: 'Reference',
      of: 'net.nanopay.invoice.model.Invoice',
      name: 'invoiceId',
      flags: ['js'],
      view: { class: 'foam.u2.view.ReferenceView', placeholder: 'select invoice' }
    },
    {
      class: 'foam.core.Enum',
      of: 'net.nanopay.tx.model.TransactionStatus',
      name: 'status',
      value: 'PENDING',
      javaFactory: 'return TransactionStatus.PENDING;'
    },
    {
      class: 'String',
      name: 'referenceNumber',
      visibility: 'RO'
    },
    {
      // FIXME: move to a ViewTransaction used on the client
      class: 'FObjectProperty',
      of: 'net.nanopay.tx.model.TransactionEntity',
      name: 'payee',
      label: 'Receiver',
      storageTransient: true,
      tableCellFormatter: function(value) {
        this.start()
          .start('p').style({ 'margin-bottom': 0 })
            .add(value ? value.fullName : 'na')
          .end()
        .end();
      }
    },
    {
      // FIXME: move to a ViewTransaction used on the client
      class: 'FObjectProperty',
      of: 'net.nanopay.tx.model.TransactionEntity',
      name: 'payer',
      label: 'Sender',
      storageTransient: true,
      tableCellFormatter: function(value) {
        this.start()
          .start('p').style({ 'margin-bottom': 0 })
            .add(value ? value.fullName : 'na')
          .end()
        .end();
      }
    },
    {
      class: 'Reference',
      of: 'net.nanopay.account.Account',
      name: 'sourceAccount',
      targetDAOKey: 'localAccountDAO',
    },
    {
      class: 'Long',
      name: 'payeeId',
      storageTransient: true,
    },
    {
      class: 'Long',
      name: 'payerId',
      storageTransient: true,
    },
    {
      class: 'Reference',
      of: 'net.nanopay.account.Account',
      name: 'destinationAccount',
      targetDAOKey: 'localAccountDAO',
    },
    {
      class: 'Currency',
      name: 'amount',
      label: 'Amount',
      visibility: 'RO',
      tableCellFormatter: function(amount, X) {
        var formattedAmount = amount/100;
        this
          .start()
            .add('$', X.addCommas(formattedAmount.toFixed(2)))
          .end();
      }
    },
    {
      class: 'Currency',
      name: 'total',
      visibility: 'RO',
      label: 'Total Amount',
      transient: true,
      expression: function(amount) {
        return amount;
      },
      javaGetter: `
        return getAmount();
      `,
      tableCellFormatter: function(total, X) {
        var formattedAmount = total / 100;
        this
          .start()
          .addClass('amount-Color-Green')
            .add('$', X.addCommas(formattedAmount.toFixed(2)))
          .end();
      }
    },
    {
      class: 'Currency',
      name: 'destinationAmount',
      label: 'Destination Amount',
      description: 'Amount in Receiver Currency',
      visibility: 'RO',
      tableCellFormatter: function(destinationAmount, X) {
        var formattedAmount = destinationAmount/100;
        this
          .start()
            .add('$', X.addCommas(formattedAmount.toFixed(2)))
          .end();
      }
    },
    {
      class: 'DateTime',
      name: 'processDate'
    },
    {
      class: 'DateTime',
      name: 'completionDate'
    },
    {
      documentation: `Defined by ISO 20220 (Pacs008)`,
      class: 'String',
      name: 'messageId'
    },
    {
      class: 'String',
      name: 'sourceCurrency',
      value: 'CAD'
    },
    {
      documentation: `referenceData holds entities such as the pacs008 message.`,
      name: 'referenceData',
      class: 'FObjectArray',
      of: 'foam.core.FObject',
      storageTransient: true
    },
    {
      class: 'String',
      name: 'destinationCurrency',
      value: 'CAD'
    },
    {
      class: 'List',
      name: 'updatableProps',
      javaType: 'java.util.ArrayList<foam.core.PropertyInfo>'
    },
    {
      name: 'prev',
      class: 'FObjectProperty',
      of: 'net.nanopay.tx.model.Transaction',
      storageTransient: true
    },
    {
      name: 'next',
      class: 'FObjectProperty',
      of: 'net.nanopay.tx.model.Transaction',
      storageTransient: true
    },
    // schedule TODO: future
    {
      name: 'scheduled',
      class: 'DateTime'
    },
    {
      name: 'lineItems',
      class: 'FObjectArray',
      of: 'net.nanopay.tx.TransactionLineItem',
      javaValue: 'new TransactionLineItem[] {}'
    },
    {
      name: 'reverseLineItems',
      class: 'FObjectArray',
      of: 'net.nanopay.tx.TransactionLineItem',
      javaValue: 'new TransactionLineItem[] {}'
    }
  ],

  methods: [
    {
      name: 'checkUpdatableProps',
      javaReturns: 'Transaction',
      args: [
        {
          name: 'x',
          javaType: 'foam.core.X'
        },
      ],
      javaCode: `
        if ( "".equals(getId()) ) {
          return this;
        }

        Transaction oldTx = (Transaction) ((DAO) x.get("localTransactionDAO")).find(getId());
        java.util.List<foam.core.PropertyInfo> updatables = getUpdatableProps();
        Transaction newTx = (Transaction) oldTx.fclone();
        for ( PropertyInfo prop: updatables ) {
          prop.set(newTx, prop.get(this));
        }
        return newTx;
      `
    },
    {
      name: 'isActive',
      javaReturns: 'boolean',
      javaCode: `
         return false;
      `
    },
    {
      name: 'add',
      code: function add(transferArr) {
        this.transfers = this.transfers.concat(transferArr);
      },
      args: [
        {
          name: 'transferArr',
          javaType: 'Transfer[]'
        }
      ],
      javaCode: `
        Transfer[] queued = getTransfers();
        synchronized (queued) {
          Transfer[] replacement = Arrays.copyOf(queued, queued.length + transferArr.length);
          System.arraycopy(transferArr, 0, replacement, queued.length, transferArr.length);
          setTransfers(replacement);
        }
      `
    },
    {
      name: 'createTransfers',
      args: [
        {
          name: 'x',
          javaType: 'foam.core.X'
        },
        {
          name: 'oldTxn',
          javaType: 'Transaction'
        }
      ],
      javaReturns: 'Transfer[]',
      javaCode: `
        List all = new ArrayList();
        TransactionLineItem[] lineItems = getLineItems();
        for ( int i = 0; i < lineItems.length; i++ ) {
          TransactionLineItem lineItem = lineItems[i];
          Transfer[] transfers = lineItem.createTransfers(x, oldTxn, this);
          for ( int j = 0; j < transfers.length; j++ ) {
            all.add(transfers[j]);
          }
        }

        // all.add(new Transfer.Builder(x).setAccount(getSourceAccount()).setAmount(-getTotal()).build());
        // all.add(new Transfer.Builder(x).setAccount(getDestinationAccount()).setAmount(getTotal()).build());

        Transfer[] transfers = getTransfers();
        for ( int i = 0; i < transfers.length; i++ ) {
          all.add(transfers[i]);
        }
        return (Transfer[]) all.toArray(new Transfer[0]);
      `
    },
    {
      name: 'toString',
      javaReturns: 'String',
      javaCode: `
        StringBuilder sb = new StringBuilder();
        sb.append(this.getClass().getSimpleName());
        sb.append("(");
        sb.append("name: ");
        sb.append(getName());
        sb.append(", ");
        sb.append("id: ");
        sb.append(getId());
        sb.append(", ");
        sb.append("status: ");
        sb.append(getState(getX()));
        sb.append(")");
        return sb.toString();
      `
    },
    {
      name: `validate`,
      args: [
        { name: 'x', javaType: 'foam.core.X' }
      ],
      javaReturns: 'void',
      javaCode: `
      DAO userDAO = (DAO) x.get("bareUserDAO");
      if ( getSourceAccount() == 0 ) {
        throw new RuntimeException("sourceAccount must be set");
      }

      if ( getDestinationAccount() == 0 ) {
        throw new RuntimeException("destinationAccount must be set");
      }

      if ( getPayerId() != 0 ) {
        if ( findSourceAccount(x).getOwner() != getPayerId() ) {
          throw new RuntimeException("sourceAccount doesn't belong to payer");
        }
      }

      if ( getPayeeId() != 0 ) {
        if ( findDestinationAccount(x).getOwner() != getPayeeId() ) {
          throw new RuntimeException("destinationAccount doesn't belong to payee");
        }
      }

      User sourceOwner = (User) userDAO.find(findSourceAccount(x).getOwner());
      if ( sourceOwner == null ) {
        throw new RuntimeException("Payer user with id " + findSourceAccount(x).getOwner() + " doesn't exist");
      }

      if ( sourceOwner instanceof Business && sourceOwner.getCompliance() != ComplianceStatus.PASSED ) {
        throw new RuntimeException("Sender needs to pass business compliance.");
      }

      User destinationOwner = (User) userDAO.find(findDestinationAccount(x).getOwner());
      if ( destinationOwner == null ) {
        throw new RuntimeException("Payee user with id "+ findDestinationAccount(x).getOwner() + " doesn't exist");
      }

      if ( ! sourceOwner.getEmailVerified() ) {
        throw new AuthorizationException("You must verify email to send money.");
      }

      if ( ! destinationOwner.getEmailVerified() ) {
        throw new AuthorizationException("Receiver must verify email to receive money.");
      }

      if ( getAmount() < 0) {
        throw new RuntimeException("Amount cannot be negative");
      }

      if ( getAmount() == 0) {
        throw new RuntimeException("Amount cannot be zero");
      }

      if ( ((DAO)x.get("currencyDAO")).find(getSourceCurrency()) == null ) {
        throw new RuntimeException("Source currency is not supported");
      }

      if ( ((DAO)x.get("currencyDAO")).find(getDestinationCurrency()) == null ) {
        throw new RuntimeException("Destination currency is not supported");
      }

      if ( getTotal() > 7500000 ) {
        throw new AuthorizationException("Transaction limit exceeded.");
      }
      `
    },
    {
      name: 'sendCompletedNotification',
      args: [
        { name: 'x', javaType: 'foam.core.X' },
        { name: 'oldTxn', javaType: 'net.nanopay.tx.model.Transaction' }
      ],
      javaCode: `
      `
    },
    {
      name: 'sendReverseNotification',
      args: [
        { name: 'x', javaType: 'foam.core.X' },
        { name: 'oldTxn', javaType: 'net.nanopay.tx.model.Transaction' }
      ],
      javaCode: `
      `
    },

    {
      documentation: 'Return own status when parent status is COMPLETED.',
      name: 'getState',
      args: [
        { name: 'x', javaType: 'foam.core.X' }
      ],
      javaReturns: 'net.nanopay.tx.model.TransactionStatus',
      javaCode: `
    Transaction parent = this.findParent(x);
    if ( parent != null ) {
      TransactionStatus state = parent.getState(x);
      if ( state != TransactionStatus.COMPLETED ) {
        return state;
      }
    }
    return this.getStatus();
`
    },
    {
      name: 'addPrev',
      args: [
        { name: 'x', javaType: 'foam.core.X' },
        { name: 'txn', javaType: 'net.nanopay.tx.model.Transaction' }
      ],
      javaCode: `
    if ( this.getPrev() != null ) {
      txn.setPrev(this.getPrev());
    }
    this.setPrev(txn);
`
    },
    {
      name: 'addNext',
      args: [
        { name: 'x', javaType: 'foam.core.X' },
        { name: 'txn', javaType: 'net.nanopay.tx.model.Transaction' }
      ],
      javaCode: `
    if ( this.getNext() != null ) {
      this.getNext().addNext(x, txn);
    } else {
      this.setNext(txn);
    }
`
    },
    {
      name: 'addLineItems',
      args: [
        { name: 'x', javaType: 'foam.core.X' },
        { name: 'forward', javaType: 'net.nanopay.tx.TransactionLineItem[]' },
        { name: 'reverse', javaType: 'net.nanopay.tx.TransactionLineItem[]' }
      ],
      javaCode: `
    if ( forward != null && forward.length > 0 ) {
      setLineItems(copyLineItems(x, forward, getLineItems()));
    }
    if ( reverse != null && reverse.length > 0 ) {
      setReverseLineItems(copyLineItems(x, forward, getReverseLineItems()));
    }
`
    },
    {
      name: 'copyLineItems',
      args: [
        { name: 'x', javaType: 'foam.core.X' },
        { name: 'from', javaType: 'net.nanopay.tx.TransactionLineItem[]' },
        { name: 'to', javaType: 'net.nanopay.tx.TransactionLineItem[]' },
     ],
      javaReturns: 'net.nanopay.tx.TransactionLineItem[]',
      javaCode: `
      if ( from.length > 0 ) {
        TransactionLineItem[] replacement = new TransactionLineItem[to.length + from.length];
        System.arraycopy(to, 0, replacement, 0, to.length);
        for ( int i = 0, j = to.length; i < to.length; i++, j++ ) {
          replacement[j] = from[i];
        }
        return replacement;
      }
      return to;
    `
    },
    {
      name: 'getCost',
      javaReturns: 'Long',
      javaCode: `
        TransactionLineItem[] lineItems = getLineItems();
        Long value = 0L;
        for ( int i = 0; i < lineItems.length; i++ ) {
          TransactionLineItem lineItem = lineItems[i];
          if ( lineItem instanceof FeeLineItem ) {
            value += (Long) lineItem.getAmount();
          }
        }
        return value;
`
    },
    {
      name: 'getEta',
      javaReturns: 'Long',
      javaCode: `
        TransactionLineItem[] lineItems = getLineItems();
        Long value = 0L;
        for ( int i = 0; i < lineItems.length; i++ ) {
          TransactionLineItem lineItem = lineItems[i];
          if ( lineItem instanceof ETALineItem ) {
            value += (Long) lineItem.getAmount();
          }
        }
        return value;
`
    }
]
});
