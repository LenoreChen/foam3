/**
 * @license
 * Copyright 2018 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.INTERFACE({
  package: 'net.nanopay.payment',
  name: 'PaymentService',

  methods: [
    {
      name: 'addPayee',
      args: [
        {
          class: 'Reference',
          of: 'foam.nanos.auth.User',
          name: 'user',
          documentation: 'User to be added as Payee'
        },
        {
          class: 'Reference',
          of: 'foam.nanos.auth.User',
          name: 'sourceUser',
          documentation: 'User that is adding a Payee'
        }
      ]
    },
    {
      name: 'submitPayment',
      args: [
        {
          class: 'Reference',
          of: 'foam.nanos.auth.User',
          name: 'user'
        },
      ]
    }
  ]
});
