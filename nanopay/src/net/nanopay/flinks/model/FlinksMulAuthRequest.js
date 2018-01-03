foam.CLASS({
  package: 'net.nanopay.flinks.model',
  name: 'FlinksMulAuthRequest',
  extends: 'net.nanopay.flinks.model.FlinksCall',

  documentation: 'model for Flinks multiple authrize request',

  properties: [
    {
      class: 'Array',
      of: 'String',
      name: 'LoginIds'
    }
  ]
});