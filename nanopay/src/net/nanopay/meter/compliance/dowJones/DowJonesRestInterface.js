foam.INTERFACE({
  package: 'net.nanopay.meter.compliance.dowJones',
  name: 'DowJonesRestInterface',

  methods: [
    {
      name: 'serve',
      type: 'net.nanopay.meter.compliance.dowJones.DowJonesResponseMsg',
      args: [
        {
          name: 'msg',
          type: 'net.nanopay.meter.compliance.dowJones.DowJonesRequestMsg'
        },
        {
          name: 'requestInfo',
          type: 'String'
        }
      ]
    }
  ]
});
