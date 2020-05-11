foam.CLASS({
  package: 'net.nanopay.msp',
  name: 'MspSetupDAO',
  extends: 'foam.dao.ProxyDAO',

  documentation: 'A decorator to create msp groups and admin',

  javaImports: [
    'foam.core.X',
    'foam.dao.DAO',
    'foam.nanos.auth.Group',
    'foam.nanos.auth.ServiceProvider',
    'foam.nanos.auth.User'
  ],

  methods: [
    {
      name: 'put_',
      javaCode: `
        MspInfo mspInfo = (MspInfo) obj;

        ServiceProvider spid = new ServiceProvider.Builder(x)
          .setEnabled(true)
          .setId(mspInfo.getSpid())
          .setDescription(mspInfo.getSpid() + " spid")
          .build();

        DAO spidDAO = (DAO) x.get("serviceProviderDAO");
        spidDAO.put(spid);

        DAO groupDAO = (DAO) x.get("localGroupDAO");
        DAO userDAO = (DAO) x.get("localUserDAO");

        // Create spid-admin group
        Group adminGroup = new Group();
        adminGroup.setId(mspInfo.getSpid() + "-admin");
        adminGroup.setParent("msp-admin");
        adminGroup.setDefaultMenu("users");
        adminGroup.setDescription(mspInfo.getSpid() +" admin");
        groupDAO.put(adminGroup);

        // Create spid-admin user
        User adminUser = new User();
        adminUser.setEmail(mspInfo.getAdminUserEmail());
        adminUser.setDesiredPassword(mspInfo.getAdminUserPassword());
        adminUser.setFirstName(mspInfo.getAdminUserFirstname());
        adminUser.setLastName(mspInfo.getAdminUserLastname());
        adminUser.setGroup(mspInfo.getSpid() + "-admin");
        adminUser.setSpid(mspInfo.getSpid());
        adminUser.setEmailVerified(true);
        userDAO.put(adminUser);

        // Create spid-fraud-ops group
        Group fraudOpsGroup = new Group();
        fraudOpsGroup.setId(mspInfo.getSpid() + "-fraud-ops");
        fraudOpsGroup.setParent("fraud-ops");
        fraudOpsGroup.setDefaultMenu("accounts");
        fraudOpsGroup.setDescription(mspInfo.getSpid() + " fraud-ops group");
        groupDAO.put(fraudOpsGroup);

        // Create spid-payment-ops group
        Group paymentOpsGroup = new Group();
        paymentOpsGroup.setId(mspInfo.getSpid() + "-payment-ops");
        paymentOpsGroup.setParent("payment-ops");
        paymentOpsGroup.setDefaultMenu("accounts");
        paymentOpsGroup.setDescription(mspInfo.getSpid() + " payment-ops group");
        groupDAO.put(paymentOpsGroup);

        // Create spid-support group
        Group supportGroup = new Group();
        supportGroup.setId(mspInfo.getSpid() + "-support");
        supportGroup.setParent("support");
        supportGroup.setDefaultMenu("contacts");
        supportGroup.setDescription(mspInfo.getSpid() + " support group");
        groupDAO.put(supportGroup);

        return super.put_(x, obj);
      `
    }
  ]
});
