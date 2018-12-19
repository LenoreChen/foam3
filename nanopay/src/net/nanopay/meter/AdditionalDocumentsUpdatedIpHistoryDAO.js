foam.CLASS({
  package: 'net.nanopay.meter',
  name: 'AdditionalDocumentsUpdatedIpHistoryDAO',
  extends: 'foam.dao.ProxyDAO',

  documentation: `Decorating DAO for capturing user IP address when
      additional documents is updated.`,

  javaImports: [
    'foam.dao.DAO',
    'foam.nanos.auth.User',
    'foam.nanos.fs.File',
    'net.nanopay.model.Business',
    'javax.servlet.http.HttpServletRequest',
    'java.util.Arrays'
  ],

  methods: [
    {
      name: 'put_',
      javaCode: `
        User newUser = (User) obj;
        User oldUser = (User) getDelegate().find(newUser.getId());

        File[] newFiles = newUser.getAdditionalDocuments();
        File[] oldFiles = null;
        if (oldUser != null) {
          oldFiles = oldUser.getAdditionalDocuments();
        }

        if (oldUser != null && !Arrays.deepEquals(oldFiles, newFiles)) {
          HttpServletRequest request = x.get(HttpServletRequest.class);
          String ipAddress = request.getRemoteAddr();
          String description = String.format("Upload:%s additional documents",
            getUploadAction(oldFiles.length, newFiles.length));

          IpHistory record = new IpHistory.Builder(x)
            .setUser(newUser.getId())
            .setIpAddress(ipAddress)
            .setDescription(description).build();

          Object business = x.get("user");
          if (business instanceof Business) {
            record.setBusiness(((Business) business).getId());
          }
          ((DAO) x.get("ipHistoryDAO")).put(record);
        }

        return super.put_(x, obj);
      `
    },
    {
      name: 'getUploadAction',
      javaReturns: 'String',
      args: [
        { of: 'int', name: 'o' },
        { of: 'int', name: 'n' }
      ],
      javaCode: `
        if (n > o) return "add";
        else if (o > n) return "delete";
        return "update";
      `
    }
  ]
});
