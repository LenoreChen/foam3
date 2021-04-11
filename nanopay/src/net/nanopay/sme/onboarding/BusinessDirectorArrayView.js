/**
 * NANOPAY CONFIDENTIAL
 *
 * [2020] nanopay Corporation
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of nanopay Corporation.
 * The intellectual and technical concepts contained
 * herein are proprietary to nanopay Corporation
 * and may be covered by Canadian and Foreign Patents, patents
 * in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from nanopay Corporation.
 */

/**
 * @license
 * Copyright 2020 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'net.nanopay.sme.onboarding',
  name: 'BusinessDirectorArrayView',
  extends: 'foam.u2.view.FObjectArrayView',

  messages: [
    { name: 'ADD_MSG', message: '+ Add' }
  ],

  properties: [
    {
     name: 'name'
    }
  ],

  methods: [
    {
      name: 'init',
      code: function() {
        this.SUPER();
        this.ADD_ROW.label = this.ADD_MSG + ' ' +this.name;
      }
    }
  ],
});