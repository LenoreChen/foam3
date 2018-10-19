/**
 * @license
 * Copyright 2018 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'net.nanopay.tx',
  name: 'SplitTransactionPlanDAO',
  extends: 'foam.dao.ProxyDAO',

  documentation: ``,

  javaImports: [
    'foam.nanos.auth.User',
    'foam.nanos.logger.Logger',

    'java.util.ArrayList',
    'java.util.List',

    'net.nanopay.account.Account',
    'net.nanopay.account.DigitalAccount',
    'net.nanopay.account.TrustAccount',
    'net.nanopay.bank.INBankAccount',
    'net.nanopay.bank.CABankAccount',
    'net.nanopay.tx.CompositeTransaction',
    'net.nanopay.tx.TransactionPlan',
    'net.nanopay.tx.TransactionQuote',
    'net.nanopay.tx.Transfer',
    'net.nanopay.tx.model.Transaction',
    'net.nanopay.fx.CurrencyFXService',
    'net.nanopay.model.Broker',
    'foam.dao.DAO'
  ],

  constants: [
     {
       type: 'long',
       name: 'NANOPAY_BROKER_ID',
       value: 1
     },
     {
       type: 'String',
       name: 'NANOPAY_FX_SERVICE_NSPEC_ID',
       value: 'localFXService'
     }
   ],

  properties: [
  ],

  methods: [
    {
      name: 'put_',
      args: [
        {
          name: 'x',
          of: 'foam.core.X'
        },
        {
          name: 'obj',
          of: 'foam.core.FObject'
        }
      ],
      javaReturns: 'foam.core.FObject',
      javaCode: `
      if ( ! (obj instanceof TransactionQuote) ) {
          return getDelegate().put_(x, obj);
        }

        Logger logger = (Logger) x.get("logger");

        TransactionQuote quote = (TransactionQuote) obj;
        Transaction request = quote.getRequestTransaction();
        TransactionPlan plan = new TransactionPlan.Builder(x).build();
        List<Transaction> tranasctions = new ArrayList<Transaction>();

        logger.debug(this.getClass().getSimpleName(), "put", quote);

        Account sourceAccount = request.findSourceAccount(x);
        Account destinationAccount = request.findDestinationAccount(x);

        if ( sourceAccount instanceof CABankAccount &&
          destinationAccount instanceof INBankAccount ) {

          // Split 1: CABank -> CADigital. AlternaCI
          TransactionQuote q1 = new TransactionQuote.Builder(x).build();
          q1.copyFrom(quote);
          Transaction t1 = new Transaction.Builder(x).build();
          t1.copyFrom(request);
          // Get Payer Digital Account to fufil CASH-IN
          DigitalAccount sourceDigitalaccount = DigitalAccount.findDefault(getX(), sourceAccount.findOwner(x), sourceAccount.getDenomination());
          t1.setDestinationAccount(sourceDigitalaccount.getId());
          q1.setRequestTransaction(t1);
          TransactionQuote c1 = (TransactionQuote) ((DAO) x.get("localTransactionQuotePlanDAO")).put_(x, q1);
          if ( null != c1.getPlan() && null != c1.getPlan().getTransaction() ) tranasctions.add((Transaction) c1.getPlan().getTransaction());


          // Split 2: CADigital -> INDIgital
          Broker broker = (Broker) ((DAO) getX().get("brokerDAO")).find_(x, NANOPAY_BROKER_ID);
          User brokerUser = (User) ((DAO) getX().get("localUserDAO")).find_(x, broker.getUserId());
          Account brokerAccount = DigitalAccount.findDefault(x, brokerUser, destinationAccount.getDenomination());
          Long destinationCurrencyAmount = 0l;

          // Check we can handle currency pair
          if ( null != CurrencyFXService.getFXServiceByNSpecId(x, sourceDigitalaccount.getDenomination(),
            brokerAccount.getDenomination(), NANOPAY_FX_SERVICE_NSPEC_ID)) {
            // CADigital -> INDIgital.
            TransactionQuote q2 = new TransactionQuote.Builder(x).build();
            q2.copyFrom(quote);

            Transaction t2 = new Transaction.Builder(x).build();
            t2.copyFrom(request);
            t2.setSourceAccount(sourceDigitalaccount.getId());
            t2.setDestinationAccount(brokerAccount.getId());
            q2.setRequestTransaction(t2);
            TransactionQuote c2 = (TransactionQuote) ((DAO) x.get("localTransactionQuotePlanDAO")).put_(x, q2);
            if ( null != c2.getPlan() && null != c2.getPlan().getTransaction() ) {
              destinationCurrencyAmount = ((Transaction) c2.getPlan().getTransaction()).getAmount();
              tranasctions.add((Transaction) c2.getPlan().getTransaction());
             }
          }
          else{
            // CADigital -> USDIgital. Check if supported first
            Account brokerUSDAccount = DigitalAccount.findDefault(x, brokerUser, "USD");
            if ( null != CurrencyFXService.getFXServiceByNSpecId(x, sourceDigitalaccount.getDenomination(),
            brokerUSDAccount.getDenomination(), NANOPAY_FX_SERVICE_NSPEC_ID)){

              TransactionQuote q3 = new TransactionQuote.Builder(x).build();
              q3.copyFrom(quote);
              Transaction t3 = new Transaction.Builder(x).build();
              t3.copyFrom(request);
              t3.setSourceAccount(sourceDigitalaccount.getId());
              t3.setDestinationAccount(brokerUSDAccount.getId());
              q3.setRequestTransaction(t3);
              TransactionQuote c3 = (TransactionQuote) ((DAO) x.get("localTransactionQuotePlanDAO")).put_(x, q3);
              if ( null != c3.getPlan().getTransaction() ) {
                tranasctions.add((Transaction) c3.getPlan().getTransaction());
                // USDigital -> INDIgital.
                TransactionQuote q4 = new TransactionQuote.Builder(x).build();
                q4.copyFrom(quote);

                Transaction t4 = new Transaction.Builder(x).build();
                t4.copyFrom(request);
                t4.setAmount(((Transaction)c3.getPlan().getTransaction()).getAmount());
                t4.setSourceAccount(brokerUSDAccount.getId());
                t4.setDestinationAccount(brokerAccount.getId());
                q4.setRequestTransaction(t4);
                TransactionQuote c4 = (TransactionQuote) ((DAO) x.get("localTransactionQuotePlanDAO")).put_(x, q4);
                if ( null != c4.getPlan().getTransaction() ) {
                  destinationCurrencyAmount = ((Transaction) c4.getPlan().getTransaction()).getAmount();
                  tranasctions.add((Transaction) c4.getPlan().getTransaction());
                }
                else{
                  // No possible route to destination currency
                  return super.put_(x, quote);
                }
              }

            }else{
              // No possible route to destination currency
              return super.put_(x, quote);
            }

          }

          // Split 3: INDigital -> INBank.
          TransactionQuote q5 = new TransactionQuote.Builder(x).build();
          q5.copyFrom(quote);
          Transaction t5 = new Transaction.Builder(x).build();
          t5.copyFrom(request);
          t5.setSourceAccount(brokerAccount.getId());
          t5.setDestinationAccount(destinationAccount.getId());
          t5.setAmount(destinationCurrencyAmount);
          q5.setRequestTransaction(t5);
          TransactionQuote c5 = (TransactionQuote) ((DAO) x.get("localTransactionQuotePlanDAO")).put_(x, q5);
          if ( null != c5.getPlan().getTransaction() ) tranasctions.add((Transaction) c5.getPlan().getTransaction());

          // Create composite transactios
          CompositeTransaction compositeTransaction =  new CompositeTransaction.Builder(x).build();
          for ( Transaction transaction : tranasctions ) {
            compositeTransaction.add(x, transaction);
          }

          plan.setTransaction(compositeTransaction);

          quote.addPlan(plan);

        }

        return super.put_(x, quote);
    `
    },
  ]
});
