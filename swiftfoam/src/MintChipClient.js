foam.CLASS({
  name: 'MintChipClient',
  extends: 'foam.box.Context',
  requires: [
    'foam.box.HTTPBox',
    'foam.box.LogBox',
    'foam.box.Message',
    'foam.box.SessionClientBox',
    'foam.box.swift.FileBox',
    'foam.dao.ClientDAO',
    'foam.dao.DAOSink',
    'foam.nanos.auth.ClientAuthService',
    'foam.swift.dao.ArrayDAO',
    'foam.swift.dao.CachingDAO',
    'foam.swift.parse.json.FObjectParser',
    'foam.nanos.auth.token.ClientTokenService',
    'net.nanopay.tx.client.ClientUserTransactionLimitService'
  ],
  exports: [
    'userDAO',
    'currentUser',
    'invoiceDAO',
    'refreshTransactionDAO',
    'transactionDAO',
    'userUserJunctionDAO'
  ],
  properties: [
    {
      class: 'FObjectProperty',
      of: 'foam.nanos.auth.User',
      name: 'currentUser',
      swiftExpressionArgs: ['clientAuthService'],
      swiftExpression: `
return (try? clientAuthService.getCurrentUser(self.__subContext__)) ?? nil
      `,
    },
    {
      swiftType: 'ServiceURLs.Host',
      name: 'httpBoxUrlRoot',
      swiftFactory: `
return ServiceURLs.hostRoute
      `,
    },
    {
      class: 'FObjectProperty',
      of: 'foam.nanos.auth.ClientAuthService',
      name: 'clientAuthService',
      required: true,
      swiftFactory: `
return ClientAuthService_create([
  "serviceName": "\\(self.httpBoxUrlRoot.rawValue)auth"
])
      `,
    },
    {
      class: 'foam.dao.DAOProperty',
      name: 'userDAO',
      swiftFactory: `
return CachingDAO_create([
  "of": User.classInfo(),
  "src": ClientDAO_create([
    "delegate": SessionClientBox_create([
      "delegate": HTTPBox_create([
        "url": "\\(self.httpBoxUrlRoot.rawValue)userDAO"
      ])
    ])
  ]),
  "cache": ArrayDAO_create(["of": User.classInfo()]),
])
      `,
    },
    {
      class: 'foam.dao.DAOProperty',
      name: 'shopperRegistrationDAO',
      swiftFactory: `
return CachingDAO_create([
  "of": User.classInfo(),
  "src": ClientDAO_create([
    "delegate": HTTPBox_create([
      "url": "\\(self.httpBoxUrlRoot.rawValue)shopperRegistrationDAO"
    ])
  ]),
  "cache": ArrayDAO_create(["of": User.classInfo()]),
])
      `,
    },
    {
      class: 'foam.dao.DAOProperty',
      name: 'transactionDAO',
      swiftFactory: `
return CachingDAO_create([
  "of": Transaction.classInfo(),
  "src": ClientDAO_create([
    "delegate": LogBox_create([
      "delegate": SessionClientBox_create([
        "delegate": HTTPBox_create([
          "url": "\\(self.httpBoxUrlRoot.rawValue)transactionDAO"
        ])
      ])
    ])
  ]),
  "cache": ArrayDAO_create(["of": Transaction.classInfo()]),
])
      `,
    },
    {
      class: 'foam.dao.DAOProperty',
      name: 'transactionLimitDAO',
      swiftFactory: `
return CachingDAO_create([
  "of": TransactionLimit.classInfo(),
  "src": ClientDAO_create([
    "delegate": LogBox_create([
      "delegate": HTTPBox_create([
        "url": "\\(self.httpBoxUrlRoot.rawValue)transactionLimitDAO"
      ])
    ])
  ]),
  "cache": ArrayDAO_create(["of": TransactionLimit.classInfo()]),
])
      `,
    },
    {
      class: 'FObjectProperty',
      of: 'net.nanopay.tx.client.ClientUserTransactionLimitService',
      name: 'userTransactionLimitService',
      swiftFactory: `
return ClientUserTransactionLimitService_create([
  "delegate": SessionClientBox_create([
    "delegate": HTTPBox_create([
      "url": "\\(self.httpBoxUrlRoot.rawValue)userTransactionLimit"
    ])
  ])
])
      `,
    },
    {
      class: 'foam.dao.DAOProperty',
      name: 'accountDAO',
      swiftFactory: `
return ClientDAO_create([
  "of": Account.classInfo(),
  "delegate": LogBox_create([
    "delegate": SessionClientBox_create([
      "delegate": HTTPBox_create([
        "url": "\\(self.httpBoxUrlRoot.rawValue)accountDAO"
      ])
    ])
  ])
])
      `,
    },
    {
      class: 'foam.dao.DAOProperty',
      name: 'bankAccountDAO',
      swiftFactory: `
return ClientDAO_create([
  "of": BankAccount.classInfo(),
  "delegate": LogBox_create([
    "delegate": SessionClientBox_create([
      "delegate": HTTPBox_create([
        "url": "\\(self.httpBoxUrlRoot.rawValue)bankAccountDAO"
      ])
    ])
  ])
])
      `,
    },
    {
      class: 'foam.dao.DAOProperty',
      name: 'standardCICOTransactionDAO',
      swiftFactory: `
return ClientDAO_create([
  "of": Transaction.classInfo(),
  "delegate": LogBox_create([
    "delegate": SessionClientBox_create([
      "delegate": HTTPBox_create([
        "url": "\\(self.httpBoxUrlRoot.rawValue)standardCICOTransactionDAO"
      ])
    ])
  ])
])
      `,
    },
    {
      class: 'FObjectProperty',
      of: 'foam.nanos.auth.token.ClientTokenService',
      name: 'smsService',
      swiftFactory: `
return ClientTokenService_create([
  "delegate": SessionClientBox_create([
    "delegate": HTTPBox_create([
      "url": "\\(self.httpBoxUrlRoot.rawValue)smsToken"
    ])
  ])
])
      `,
    },
    {
      class: 'FObjectProperty',
      of: 'foam.nanos.auth.token.ClientTokenService',
      name: 'emailService',
      swiftFactory: `
return ClientTokenService_create([
  "delegate": SessionClientBox_create([
    "delegate": HTTPBox_create([
      "url": "\\(self.httpBoxUrlRoot.rawValue)emailToken"
    ])
  ])
])
      `,
    },
    {
      class: 'FObjectProperty',
      of: 'foam.nanos.auth.token.ClientTokenService',
      name: 'resetPasswordService',
      swiftFactory: `
return ClientTokenService_create([
  "delegate": HTTPBox_create([
    "url": "\\(self.httpBoxUrlRoot.rawValue)resetPasswordToken"
  ])
])
      `,
    },
    {
      class: 'foam.dao.DAOProperty',
      name: 'countryDAO',
      swiftFactory: `
return ClientDAO_create([
  "of": Country.classInfo(),
  "delegate": HTTPBox_create([
    "url": "\\(self.httpBoxUrlRoot.rawValue)countryDAO"
  ])
])
      `,
    },
    {
      class: 'foam.dao.DAOProperty',
      name: 'regionDAO',
      swiftFactory: `
return ClientDAO_create([
  "of": Region.classInfo(),
  "delegate": HTTPBox_create([
    "url": "\\(self.httpBoxUrlRoot.rawValue)regionDAO"
  ])
])
      `,
    },
    {
      class: 'foam.dao.DAOProperty',
      name: 'userUserJunctionDAO',
      swiftFactory: `
return CachingDAO_create([
  "of": UserUserJunction.classInfo(),
  "src": ClientDAO_create([
    "delegate": SessionClientBox_create([
      "delegate": HTTPBox_create([
        "url": "\\(self.httpBoxUrlRoot.rawValue)userUserJunctionDAO"
      ])
    ])
  ]),
  "cache": ArrayDAO_create(["of": UserUserJunction.classInfo()])
])
      `
    },
    {
      name: 'invoiceDAO',
      swiftFactory: `
return CachingDAO_create([
  "of": Invoice.classInfo(),
  "src": ClientDAO_create([
    "delegate": SessionClientBox_create([
      "delegate": HTTPBox_create([
        "url": "\\(self.httpBoxUrlRoot.rawValue)invoiceDAO"
      ])
    ])
  ]),
  "cache": ArrayDAO_create(["of": Invoice.classInfo()]),
])
      `,
    }
  ],
  axioms: [
    foam.pattern.Singleton.create(),
  ],
  methods: [
    {
      name: 'refreshTransactionDAO',
      swiftCode: `
let dao = self.transactionDAO as! CachingDAO
_ = try? dao.src.select(DAOSink_create(["dao": dao.cache]))
      `,
    },
  ],
});
