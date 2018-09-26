foam.CLASS({
  package: 'net.nanopay.tx',
  name: 'Transfer',

  javaImports: [
    'net.nanopay.account.Account',
    'net.nanopay.account.Balance'
  ],

  properties: [
    {
      name: 'description',
      class: 'String'
    },
    {
      name: 'amount',
      class: 'Long'
    },
    {
      name: 'account',
      class: 'Reference',
      of: 'net.nanopay.account.Account'
    },
    {
      documentation: 'Control which Transfers are visible in customer facing views.  Some transfers such as Reversals, or internal Digital account transfers are not meant to be visible to the customer.',
      name: 'visible',
      class: 'Boolean',
      value: false,
      hidden: true
    }
  ],

  methods: [

    {
      name: 'validate',
      javaReturns: 'void',
      javaCode: `
        if ( getAmount() == 0 ) throw new RuntimeException("Zero transfer disallowed.");
      `
    },
    {
      name: 'execute',
      args: [
        {
          name: 'balance',
          of: 'Balance'
        }
      ],
      javaReturns: 'void',
      javaCode: `
      balance.setBalance(balance.getBalance() + getAmount());
      `
    },
    {
      name: 'getLock',
      javaReturns: 'Object',
      javaCode: `
        return String.valueOf(getAccount()).intern();
      `
    }
  ]
});
