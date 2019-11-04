foam.CLASS({
  package: 'net.nanopay.tx.model',
  name: 'TransactionFee',

  documentation: 'Holds Fee for Transactions.',

  tableColumns: [
    'id',
    'name',
    'transactionName',
    'transactionType',
    'denomination',
    'sourcePaysFees'
  ],

  properties: [
    {
      class: 'Long',
      name: 'id'
    },
    {
      class: 'String',
      name: 'name',
      required: true,
      documentation: 'Name to identify transaction fee.'
    },
    {
      class: 'String',
      name: 'transactionName',
      documentation: 'Describes which Transaction subclass fee should be applied to.'
    },
    {
      class: 'String',
      name: 'transactionType',
      documentation: 'Describes a Transaction class subclass fee should be applied to. All transactions which are an instanceOf this transactionClass'
    },
    {
      class: 'UnitValue',
      name: 'minAmount',
      documentation: 'Describes minimum amount this fee can be applied to.'
    },
    {
      class: 'UnitValue',
      name: 'maxAmount',
      documentation: 'Describes maximum amount this fee can be applied to.'
    },
    {
      class: 'Reference',
      of: 'net.nanopay.account.Account',
      name: 'feeAccount'
    },
    {
      class: 'FObjectProperty',
      of: 'net.nanopay.tx.model.Fee',
      name: 'fee',
      documentation: 'Fee class that should be applied to transaction.',
    },
    {
      class: 'String',
      name: 'denomination',
      value: 'CAD'
    },
    {
      name: 'sourcePaysFees',
      class: 'Boolean',
      hidden: true
    }
  ]
 });
