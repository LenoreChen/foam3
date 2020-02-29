foam.CLASS({
    package: 'net.nanopay.account.ui.addAccountModal.transactionLimit',
    name: 'AccountTransactionLimit',

    documentation: `
      A view model for the maximum transaction size for an account being created in Liquid
    `,

    properties: [
      {
        class: 'UnitValue',
        name: 'maxTransactionSize',
        label: 'The maximum transaction size allowed from this account is...',
        documentation: `
            The currency value of the maximum transaction size
        `,
        validateObj: function(maxTransactionSize) {
          if ( ! maxTransactionSize || maxTransactionSize <= 0 ) {
            return 'Please set a transaction limit before proceeding.';
          }
        }
      },
    ],
});
