foam.CLASS({
  package: 'net.nanopay.tx.gs',
  name: 'ProgressBarData',
  plural: 'PBDs',
  properties: [
    {
      class: 'String',
      name: 'id',
    },
    {
      class: 'String',
      name: 'name'
    },
    {
      class: 'Long',
      name: 'value'
    },
    {
      class: 'Long',
      name: 'maxValue',
      value: 100
    },
    {
      class: 'Long',
      name: 'state',
      expression: function(value, maxValue){
        return Math.floor(( (value / maxValue) * 100))
      }
    },
    {
      class: 'String',
      name: 'status'
    }
  ]

})
