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
  package: 'net.nanopay.sme',
  name: 'OnboardingPaymentOpsNotification',
  extends: 'foam.nanos.notification.Notification',

  properties: [
    {
      name: 'groupId',
      value: 'payment-ops',
      javaValue: '"payment-ops"'
    },
    ['emailName', 'user-signup'],
    ['notificationType', 'UserSignup'],
    {
      name: 'body',
      expression: function() {
        return `A new user has been add to the platform.\n userId:${userId}\n userEmail: ${userEmail}`;
      }
    },
  ]
});
