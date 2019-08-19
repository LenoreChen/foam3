foam.CLASS({
  package: 'net.nanopay.fx.afex',
  name: 'AFEXAddCurrencyPermissionRule',

  implements: [
    'foam.nanos.ruler.RuleAction'
  ],

  documentation: `Adds currency.read.FX_CURRENCY permissions to a business when AFEXBUsiness is created.`,

  javaImports: [
    'foam.core.ContextAgent',
    'foam.core.X',
    'foam.dao.DAO',
    'foam.nanos.app.AppConfig',
    'foam.nanos.auth.Address',
    'foam.nanos.auth.Group',
    'foam.nanos.auth.Permission',
    'foam.nanos.logger.Logger',
    'foam.util.SafetyUtil',
    'javax.security.auth.AuthPermission',
    'net.nanopay.model.Business',
    'static foam.mlang.MLang.EQ'    

  ],

  methods: [
    {
      name: 'applyAction',
      javaCode: `
      agency.submit(x, new ContextAgent() {
        @Override
        public void execute(X x) {

          Logger logger = (Logger) x.get("logger");
          
          if ( ! (obj instanceof AFEXBusiness) ) {
            return;
          }
          
          AFEXBusiness afexBusiness = (AFEXBusiness) obj;
          DAO localBusinessDAO = (DAO) x.get("localBusinessDAO");
          DAO localGroupDAO = (DAO) x.get("localGroupDAO");
          
          Business business = (Business) localBusinessDAO.find(EQ(Business.ID, afexBusiness.getUser())); 
          if ( null != business ) {
            Address businessAddress = business.getBusinessAddress();
            if ( null != businessAddress && ! SafetyUtil.isEmpty(businessAddress.getCountryId()) ) {
              String permissionString = "currency.read.";
              permissionString = businessAddress.getCountryId().equals("CA") ? permissionString + "USD" : permissionString + "CAD";
              Permission permission = new Permission.Builder(x).setId(permissionString).build();
              Group group = (Group) localGroupDAO.find(business.getGroup());
              while ( group != null ) {
                group = (Group) group.findParent(x);
                if ( group != null && group.getId().endsWith("employee") ) break;
              }
              if ( null != group && ! group.implies(x, new AuthPermission(permissionString)) ) {
                try {
                  group.getPermissions(x).add(permission);  
                } catch(Throwable t) {
                    logger.error("Error applying AFEXBusinessComplianceTransactionRule.", t);
                  }
                } 
              }
            }
        }

      }, "Adds currency.read.FX_CURRENCY permissions to business when AFEXBUsiness is created.");
      `
    }
  ]

});
