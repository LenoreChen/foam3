foam.CLASS({
  package: 'net.nanopay.account',
  name: 'EnforceOneDefaultDigitalAccountPerCurrencyDAO',
  extends: 'foam.dao.ProxyDAO',

  documentation: 'Checks default digital account with same currency already exists, if so, prevents creating another',

  javaImports: [
    'foam.dao.ArraySink',
    'foam.dao.DAO',
    'foam.dao.AbstractSink',
    'foam.core.Detachable',
    'foam.mlang.sink.Count',
    'static foam.mlang.MLang.*',

    'net.nanopay.account.DigitalAccount',

    'java.util.List'
  ],

  methods: [
    {
      name: 'put_',
      args: [
        {
          name: 'x',
          of: 'foam.core.X'
        },
        {
          name: 'obj',
          of: 'foam.core.FObject'
        }
      ],
      javaReturns: 'foam.core.FObject',
      javaCode: `
      if ( ! ( obj instanceof DigitalAccount ) ) {
        return getDelegate().put_(x, obj);
      }
      DigitalAccount account = (DigitalAccount) obj;

      if ( account.getIsDefault() && getDelegate().find(account.getId()) == null ) {
        getDelegate()
          .where(
                 AND(
                     INSTANCE_OF(DigitalAccount.class),
                     EQ(DigitalAccount.OWNER, account.getOwner()),
                     EQ(DigitalAccount.DENOMINATION, account.getDenomination()),
                     EQ(DigitalAccount.IS_DEFAULT, true)
                     )
                 )
          .select(new AbstractSink() {
            @Override
            public void put(Object obj, Detachable sub) {
              DigitalAccount oldDefaultAccount = (DigitalAccount) ((DigitalAccount) obj).deepClone();
              oldDefaultAccount.setIsDefault(false);
              getDelegate().put_(x, oldDefaultAccount); // 
            }
          });
      }

      return super.put_(x, obj);
      `
    }
  ],

  axioms: [
    {
      buildJavaClass: function(cls) {
        cls.extras.push(`
public EnforceOneDefaultDigitalAccountPerCurrencyDAO(foam.core.X x, foam.dao.DAO delegate) {
  System.err.println("Direct constructor use is deprecated. Use Builder instead.");
  setDelegate(delegate);
}
        `);
      },
    },
  ]
});
