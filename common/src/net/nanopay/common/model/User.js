foam.CLASS({
  package: 'net.nanopay.common.model',
  name: 'User',
  extends: 'foam.nanos.auth.User',

  properties: [
    {
      class: 'String',
      name: 'type'
    },
    {
      class: 'Date',
      name:  'birthday'
    },
    {
      class: 'String',
      name:  'profilePicture'
    },
    {
      class: 'FObjectProperty',
      of: 'Transaction',
      name:  'transactions'
    },
    {
      class: 'String',
      name: 'xeroId'
    }
  ]
})
foam.RELATIONSHIP({
  sourceModel: 'foam.nanos.auth.User',
  targetModel: 'net.nanopay.common.model.Address',
  forwardName: 'address',
  inverseName: 'resident'
});
foam.RELATIONSHIP({
  sourceModel: 'foam.nanos.auth.User',
  targetModel: 'net.nanopay.common.model.Account',
  forwardName: 'accounts',
  inverseName: 'owner'
});
foam.RELATIONSHIP({
  sourceModel: 'foam.nanos.auth.User',
  targetModel: 'net.nanopay.common.model.Phone',
  forwardName: 'phones',
  inverseName: 'owner'
});
foam.RELATIONSHIP({
  sourceModel: 'net.nanopay.common.model.User',
  targetModel: 'net.nanopay.common.model.User',
  forwardName: 'payees',
  inverseName: 'payer'
});