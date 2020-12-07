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

foam.CLASS({
  package: 'net.nanopay.accounting',
  name: 'UserRefine',
  refines: 'foam.nanos.auth.User',
  properties: [
    {
      class: 'foam.core.Enum',
      of: 'net.nanopay.accounting.IntegrationCode',
      name: 'integrationCode',
      documentation: 'The code that determines which Accounting system is currently active with the user.',
      visibility: 'RO',
      value: 'NONE',
      label: 'Accounting Integration',
      section: 'systemInformation',
      gridColumns: 6
    },
    {
      class: 'Boolean',
      name: 'hasIntegrated',
      section: 'systemInformation',
      gridColumns: 6,
      value: false
    },
  ]
});
