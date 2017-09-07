/**
 * @license
 * Copyright 2017 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.INTERFACE({
  package: 'net.nanopay.exchangerate',
  name: 'ExchangeRateInterface',
  extends: 'foam.nanos.NanoService',
  methods: [
    {
      name: 'getRate',
      javaReturns: 'net.nanopay.exchangerate.model.ExchangeRateQuote',
      javaThrows: [ 'java.lang.RuntimeException' ],
      args: [
        {
          name: 'from',
          javaType: 'String'
        },
        {
          name: 'to',
          javaType: 'String'
        },
        {
          name: 'amount',
          javaType: 'Long'
        }
      ]
    }, {
      name: 'fetchRates',
      javaReturns: 'void',
      javaThrows: [ 'java.lang.RuntimeException' ],
      args: []
    }
  ]
});
