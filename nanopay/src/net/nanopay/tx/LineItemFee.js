/**
 * @license
 * Copyright 2019 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'net.nanopay.tx',
  name: 'LineItemFee',

  implements: ['foam.nanos.auth.EnabledAware'],

  properties: [
    {
      class: 'String',
      name: 'id',
      visibility: foam.u2.Visibility.RO
    },
    {
      class: 'Boolean',
      name: 'enabled',
      value: true
    },
    {
      class: 'Reference',
      of: 'net.nanopay.tx.LineItemType',
      name: 'forType'
    },
    {
      class: 'FObjectProperty',
      of: 'net.nanopay.tx.LineItemAmount',
      name: 'amount',
      factory: function() {
        return net.nanopay.tx.LineItemAmount.create();
      },
      javaFactory: `
      return new net.nanopay.tx.LineItemAmount();
      `
    },
    {
      class: 'Reference',
      of: 'net.nanopay.tx.LineItemType',
      name: 'feeType'
    },
    {
      class: 'Boolean',
      name: 'refundable',
      value: false
    }
  ],

  methods: [
    {
      name: 'getFeeAmount',
      args: [
        {
          name: 'transactionAmount',
          javaType: 'long',
          swiftType: 'Int',
        }
      ],
      javaReturns: 'long',
      swiftReturns: 'Int',
      javaCode: `
      if ( this.getAmount().getType() == LineItemAmountType.TOTAL ) {
        return this.getAmount().getValue();
      } else {
        return ((Double) (this.getAmount().getValue()/100.0 * transactionAmount)).longValue();
      }
      `,
      // swiftCode: ' return fixedFee ',
      code: function() {
        if ( this.amount.type == LineItemAmountType.TOTAL ) {
          return this.amount.value;
        } else {
          return this.amount.value/100 * transactionAmount;
        }
      }
    }
  ]
});
