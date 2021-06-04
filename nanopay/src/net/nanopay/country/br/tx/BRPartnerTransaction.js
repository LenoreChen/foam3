/**
 * NANOPAY CONFIDENTIAL
 *
 * [2021] nanopay Corporation
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

foam.CLASS({
  package: 'net.nanopay.country.br.tx',
  name: 'BRPartnerTransaction',
  extends: 'net.nanopay.fx.FXTransaction',

  documentation: `BR Partner Transaction`,


  properties: [
    {
      name: 'clearingTimes',
      javaFactory: 'return new java.util.HashMap<>();'
    },
    {
      name: 'estimatedCompletionDate',
      javaFactory: 'return null;'
    },
    {
      name: 'processDate',
      javaFactory: 'return null;'
    },
    {
      class: 'DateTime',
      name: 'completionDate',
      storageTransient: false
    }
  ]
});