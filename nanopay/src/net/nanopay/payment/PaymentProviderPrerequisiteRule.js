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
  package: 'net.nanopay.payment',
  name: 'PaymentProviderPrerequisiteRule',

  implements: [
    'foam.nanos.ruler.RuleAction'
  ],

  documentation: `Adds payment provider capability as prerequisite on payment provider corridor capabilities on create`,

  javaImports: [
    'foam.core.ContextAgent',
    'foam.core.X',
    'foam.dao.DAO',
    'foam.nanos.crunch.CapabilityCapabilityJunction',
    'foam.nanos.logger.Logger',
    'net.nanopay.payment.PaymentProviderCapability',
    'net.nanopay.payment.PaymentProviderCorridorCapability',
    'net.nanopay.payment.PaymentProviderCorridorJunctionId',
    'static foam.mlang.MLang.EQ'
  ],

  messages: [
    {
      name: 'MISSING_PROVIDER',
      message: `WARNING: Missing associated payment provider capability. Verify whether payment provider 
          capability exists or junction references the correct id `
    },
    {
      name: 'UNABLE_TO_CREATE_PREREQUISITE',
      message: 'ERROR: Unable to create prerequisite for payment provider corridor '
    }
  ],

  methods: [
    {
      name: 'applyAction',
      javaCode: `
        DAO capabilityDAO = (DAO) x.get("capabilityDAO");
        Logger logger = (Logger) x.get("logger");

        PaymentProviderCorridorCapability ppcc = (PaymentProviderCorridorCapability) obj;
        PaymentProviderCorridorJunctionId ppcjId = (PaymentProviderCorridorJunctionId) ppcc.getPaymentProviderCorridorId();

        PaymentProviderCapability ppc = (PaymentProviderCapability) capabilityDAO.find(
          EQ(PaymentProviderCapability.PAYMENT_PROVIDER, ppcjId.getSourceId())
        );

        if ( ppc == null ) {
          logger.warning(MISSING_PROVIDER + ppcjId.getSourceId());
        } else {
          agency.submit(x, new ContextAgent() {
            @Override
            public void execute(X x) {
              DAO prerequisiteDAO = (DAO) x.get("prerequisiteCapabilityJunctionDAO");
              CapabilityCapabilityJunction ccj = new CapabilityCapabilityJunction();
              ccj.setSourceId(ppc.getId());
              ccj.setTargetId(ppcc.getId());
              ccj.setPriority(1);

              try {
                prerequisiteDAO.put(ccj);
              } catch (Exception e) {
                logger.error(UNABLE_TO_CREATE_PREREQUISITE, ppcc.getId());
              }
            }
          }, "Create payment provider prerequisites on payment provider corridor capability create");
        }
      `
    }
  ]
});
