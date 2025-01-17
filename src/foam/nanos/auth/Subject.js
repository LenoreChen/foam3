/**
 * @license
 * Copyright 2020 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.nanos.auth',
  name: 'Subject',

  javaImports: [
    'foam.nanos.auth.User',
    'java.util.ArrayList',
    'java.util.Stack'
  ],

  properties: [
    {
      class: 'FObjectProperty',
      of: 'foam.nanos.auth.User',
      name: 'realUser',
      documentation: 'Authenticated logged in user',
      javaSetter: `
        throw new RuntimeException("You cannot set real user");
      `
    },
    {
      class: 'FObjectProperty',
      of: 'foam.nanos.auth.User',
      name: 'user',
      documentation: 'Current user role(acts as user)',
      javaSetter: `
      if ( val == null ) return;
      if ( getRealUser() == null ) {
        realUser_      = val;
        realUserIsSet_ = true;
      }
      ArrayList userPath = getUserPath();
      if ( userPath.size() < 2 || val != (User) userPath.get(userPath.size() - 1) ) {
        userPath.add(val);
      } else {
        userPath.remove(userPath.size() - 1);
      }
      userIsSet_ = true;
      user_      = val;
      `
    },
    {
      class: 'List',
      javaType: 'java.util.ArrayList<User>',
      name: 'userPath',
      documentation: 'path from realUser to current user',
      javaFactory: 'return new ArrayList();'
    }
  ],

  javaCode: `
    public Subject(User user) {
      setUser(user);
    }
  `,

  methods: [
    {
      name: 'isUserInSubject',
      documentation: 'Function to check if a given user is in the context. Prior to a user or business being set into the context i wanted to know if that user was already represented. On user create',
      type: 'Boolean',
      args: [
        'Long idCheck'
      ],
      javaCode: `
      for ( User user : getUserPath() ) {
        if ( foam.util.SafetyUtil.equals(user.getId(), idCheck) ) return true;
      }
      return false;
      `,
      code: function() {
        return !! this.userPath.find(u => u.id == idCheck);
      }
    },
    {
      name: 'toString',
      type: 'String',
      javaCode: `
      String ret = "user path";
      for ( User user : getUserPath() ) {
        ret += " >> " + user.toSummary();
      }
      return ret;
      `,
      code: function() {
        // Question: should we use u.toSummary() instead?
        return ['user path', ...this.userPath.map(u => u.toSummary())].join(' >> ');
      }
    },
    {
      name: 'isAgent',
      type: 'Boolean',
      javaCode: `
        return getUser().getId() != getRealUser().getId();
      `
    },
    {
      name: 'toSummary',
      type: 'String',
      javaCode: `
        return isAgent() ?
            getUser().toSummary() + "(" + getRealUser().toSummary() + ")" :
            getUser().toSummary();
      `
    }
  ]
})
