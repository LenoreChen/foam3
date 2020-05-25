foam.CLASS({
  package: 'net.nanopay.tx.planner',
  name: 'BmoCITransactionPlanner',
  extends: 'net.nanopay.tx.planner.AbstractTransactionPlanner',

  javaImports: [
    'java.time.Duration',
    'net.nanopay.account.TrustAccount',
    'net.nanopay.payment.PADTypeLineItem',
    'net.nanopay.tx.ETALineItem',
    'net.nanopay.tx.TransactionLineItem',
    'net.nanopay.tx.bmo.cico.BmoCITransaction'
  ],

  constants: [
    {
      name: 'INSTITUTION_NUMBER',
      type: 'String',
      value: '001'
    },
  ],

  methods: [
    {
      name: 'plan',
      javaCode: `
        TrustAccount trustAccount = TrustAccount.find(x, quote.getSourceAccount(), INSTITUTION_NUMBER);
        BmoCITransaction t = new BmoCITransaction();
        t.copyFrom(requestTxn);
        t.setStatus(net.nanopay.tx.model.TransactionStatus.PENDING);
        t.setInstitutionNumber(INSTITUTION_NUMBER);
        quote.addTransfer(trustAccount.getId(), -t.getAmount());
        quote.addTransfer(quote.getDestinationAccount().getId(), t.getAmount());

        t.addLineItems(new TransactionLineItem[] {
          new ETALineItem.Builder(x).setEta(Duration.ofDays(1).toMillis()).build()
        });
        if ( PADTypeLineItem.getPADTypeFrom(x, t) == null ) {
          PADTypeLineItem.addEmptyLineTo(t);
        }
        return t;
    `
    }
  ]
});
