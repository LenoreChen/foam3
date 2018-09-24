foam.CLASS({
  refines: 'net.nanopay.tx.model.Transaction',

  properties: [
    {
      class: 'List',
      name: 'signatures',
      documentation: 'List of signatures for a given transaction',
      javaType: 'java.util.ArrayList<net.nanopay.security.Signature>',
      includeInSignature: false,
    }
  ]
});
