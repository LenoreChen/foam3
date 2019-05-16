foam.CLASS({
  package: 'net.nanopay.tx',
  name: 'DebtTransaction',
  extends: 'net.nanopay.tx.model.Transaction',

  documentation: ``,

  javaImports: [
    'net.nanopay.account.Account',
    'net.nanopay.account.Debtable',
    'net.nanopay.tx.model.Transaction',
    'java.util.List',
    'java.util.ArrayList',
  ],

  methods: [
    {
      name: 'createTransfers',
      args: [
        {
          name: 'x',
          type: 'Context'
        },
        {
          name: 'oldTxn',
          type: 'net.nanopay.tx.model.Transaction'
        }
      ],
      type: 'net.nanopay.tx.Transfer[]',
      javaCode: `
        // If Detable/Overdraft account does not have sufficient balance
        // then incur debt.

        List transfers = new ArrayList();
        Long amount = getTotal();

        Long balance = getDestinationAccount().findBalance(x);
        if ( balance < amount ) {
          Long delta = amount;
          if ( balance > 0 ) {
            delta = amount - balance;
          }
          transfers.add(new Transfer.Builder(x).setAccount(getSourceAccount()).setAmount(-delta).build());
          transfers.add(new Transfer.Builder(x).setAccount(getDestinationAccount()).setAmount(delta).build());

          DebtAccount debtAccount = DebtAccount.findDebtAccount(x, /*owner*/ getDestinationAccount(), /*creditor*/ d.findCreditorAccount(x));
          transfers.add(new Transfer.Builder(x).setAccount(debtAccount.setAmount(-delta).build());
        }
        return (Transfer[]) all.toArray(new Transfer[0]);
      `
    }
  ]
});
