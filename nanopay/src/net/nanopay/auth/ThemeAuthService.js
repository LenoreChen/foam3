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
  package: 'net.nanopay.auth',
  name: 'ThemeAuthService',
  extends: 'foam.nanos.auth.ProxyAuthService',
  flags: ['java'],

  documentation: `Restrict login to the url that matches the spid of the user.`,

  imports: [
    'DAO localUserDAO'
  ],

  javaImports: [
    'foam.dao.DAO',
    'foam.nanos.auth.AccessDeniedException',
    'foam.nanos.auth.AuthenticationException',
    'foam.nanos.auth.User',
    'foam.util.Password',
    'foam.util.SafetyUtil',
    'foam.nanos.theme.Theme',

    'static foam.mlang.MLang.EQ',
    'static foam.mlang.MLang.OR',
  ],

  methods: [
    {
      name: 'login',
      javaCode: `
        return login_(x, identifier, password);
      `
    },
    {
      name: 'login_',
      documentation: 'Helper logic function to reduce code duplication.',
      type: 'User',
      args: [
        {
          name: 'x',
          type: 'Context'
        },
        {
          name: 'identifier',
          type: 'String'
        },
        {
          name: 'password',
          type: 'String'
        }
      ],
      javaCode: `
        User user = getUser(x, identifier);
        if ( user == null ) {
          throw new AuthenticationException("User not found.");
        }

        // Get theme's spid and user's spid
        Theme theme      = ((Theme) x.get("theme"));
        String themeSpid = theme.getSpid();
        String userSpid  = user.getSpid();

        // Check if theme's spid and user's spid matched.
        // if matched pass, else throw an error.
        // e.g., throws error: userSpid: "treviso", themeSpid: "intuit"
        if (
          ! SafetyUtil.isEmpty(themeSpid) &&
          ! SafetyUtil.isEmpty(userSpid) &&
          ! themeSpid.equals(userSpid)
        ) {
          throw new AccessDeniedException();
        }
        return super.login(x, identifier, password);
      `
    },
    {
      name: 'getUser',
      documentation: 'Convenience method to get a user by username or email',
      type: 'User',
      args: [
        {
          name: 'x',
          type: 'Context'
        },
        {
          name: 'identifier',
          type: 'String'
        }
      ],
      javaCode: `
        return (User) ((DAO) getLocalUserDAO())
          .find(
            OR(
              EQ(User.EMAIL, identifier.toLowerCase()),
              EQ(User.USER_NAME, identifier)
            )
          );
      `
    }
  ]
});
