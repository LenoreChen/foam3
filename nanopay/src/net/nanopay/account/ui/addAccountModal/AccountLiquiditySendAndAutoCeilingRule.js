foam.CLASS({
  package: 'net.nanopay.account.ui.addAccountModal',
  name: 'AccountLiquiditySendAndAutoCeilingRule',
    implements: [
    'foam.mlang.Expressions'
  ],

  documentation: `
    A view model for the account liquidity send and auto transactions ceiling rule
  `,

  exports: [
    'otherAccountsPredicatedAccountDAO'
  ],
  imports: [
    'currencyDAO',
    'accountDAO',
    'user'
  ],

  requires: [
    'net.nanopay.account.Account',
  ],
  
  properties: [
    {
      name: 'otherAccountsPredicatedAccountDAO',
      hidden: true,
      expression: function(user$id, accountDAO) {
        // only return other accounts in the business group
        // ! uncomment the line below once we figure this out
        // return accountDAO.where(this.EQ(this.Account.OWNER, user$id));
        return accountDAO // ! comment this later on
      }
    },
    {
      class: 'Currency',
      name: 'accountBalanceCeiling',
      label: 'If the balance of this account reaches',
      documentation: `
        The upper bound of the rule enforcement for liquidity settings
      `,
      validateObj: function(accountBalanceCeiling, accountBalanceFloor) {
        if ( ( accountBalanceCeiling && accountBalanceFloor ) && accountBalanceFloor > 0  && accountBalanceCeiling <= accountBalanceFloor ) {
          return 'Please define a maximum balance threshold greater than the minimum balance threshold.';
        }
      }
    },
    {
      class: 'Currency',
      name: 'resetAccountBalanceCeiling',
      label: 'Reset account balance to',
      documentation: `
        The amount to reset the account balance upon hitting the ceiling
      `
    },
    {
      class: 'Reference',
      of: 'net.nanopay.account.Account',
      name: 'ceilingMoveFundsTo',
      label: 'by moving the excess funds into',
      targetDAOKey: 'otherAccountsPredicatedAccountDAO',
      documentation: `
        A picker to choose which account will excess funds be moved to
        upon hitting the upper bound liquidity threshold
      `,
    },
  ]
});
