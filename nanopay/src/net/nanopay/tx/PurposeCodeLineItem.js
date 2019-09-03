foam.CLASS({
  package: 'net.nanopay.tx',
  name: 'PurposeCodeLineItem',
  extends: 'net.nanopay.tx.InfoLineItem',

  properties: [
    {
      class: 'Reference',
      of: 'net.nanopay.tx.PurposeCode',
      name: 'purposeCode',
      view: { class: 'net.nanopay.tx.PurposeCodeSelectionView' }
    }
  ]
});
