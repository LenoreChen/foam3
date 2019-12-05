/**
 * @license
 * Copyright 2018 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'net.nanopay.tx',
  name: 'GenericCIPlanner',
  extends: 'foam.dao.ProxyDAO',

  documentation: ``,

  implements: [
    'foam.nanos.auth.EnabledAware'
  ],

  javaImports: [
    'net.nanopay.tx.model.Transaction',
    'net.nanopay.tx.TransactionQuote',
    'net.nanopay.account.Account',
    'net.nanopay.account.DigitalAccount',
    'net.nanopay.bank.BankAccount',
    'net.nanopay.tx.cico.CITransaction',
    'net.nanopay.tx.cico.COTransaction',
    'foam.nanos.app.Mode',
    'foam.nanos.app.AppConfig'

  ],

  properties: [
    {
      name: 'enabled',
      class: 'Boolean',
      value: true
    }
  ],

  methods: [
    {
      name: 'put_',
      javaCode: `

    TransactionQuote quote = (TransactionQuote) obj;

    if ( ((AppConfig) x.get("appConfig")).getMode() == Mode.PRODUCTION  || getEnabled() == false )
      return getDelegate().put_(x, quote);

    Transaction request = (Transaction) quote.getRequestTransaction().fclone();

    Account sourceAccount = request.findSourceAccount(x);
    Account destinationAccount = request.findDestinationAccount(x);

    if ( sourceAccount instanceof BankAccount &&
      destinationAccount instanceof DigitalAccount ) {

      CITransaction t = new CITransaction.Builder(x).build();
      t.copyFrom(request);
      t.setIsQuoted(true);
      t.setStatus(net.nanopay.tx.model.TransactionStatus.COMPLETED);
      quote.setPlan(t);

      Transaction[] plans = quote.getPlans();
      if ( plans != null && plans.length > 0 ) {
        int planLength = plans.length;
        Transaction[] newPlans = new Transaction[planLength + 1];
        System.arraycopy(plans, 0, newPlans, 0, planLength + 1);
        newPlans[planLength] = t;
        quote.setPlans(newPlans);
      } else {
        quote.setPlans(new Transaction[] {t});      }

      return quote;
    }
    if ( destinationAccount instanceof BankAccount &&
       sourceAccount instanceof DigitalAccount ) {

      COTransaction t = new COTransaction.Builder(x).build();
      t.copyFrom(request);
      t.setIsQuoted(true);
      t.setStatus(net.nanopay.tx.model.TransactionStatus.COMPLETED);
      quote.setPlan(t);

      Transaction[] plans = quote.getPlans();
      if ( plans != null && plans.length > 0 ) {
        int planLength = plans.length;
        Transaction[] newPlans = new Transaction[planLength + 1];
        System.arraycopy(plans, 0, newPlans, 0, planLength + 1);
        newPlans[planLength] = t;
        quote.setPlans(newPlans);
      } else {
        quote.setPlans(new Transaction[] {t});
      }
      return quote;
    }
    return getDelegate().put_(x, quote);
    `
    },
  ]
});
