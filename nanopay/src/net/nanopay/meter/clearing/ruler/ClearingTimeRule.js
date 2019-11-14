foam.CLASS({
  package: 'net.nanopay.meter.clearing.ruler',
  name: 'ClearingTimeRule',
  extends: 'foam.nanos.ruler.Rule',
  abstract: true,

  javaImports: [
    'net.nanopay.meter.clearing.ClearingTimesTrait',
    'net.nanopay.meter.clearing.ruler.predicate.DefaultClearingTimeRulePredicate',
    'net.nanopay.tx.cico.COTransaction'
  ],

  tableColumns: [
    'id',
    'description',
    'duration',
    'enabled'
  ],

  properties: [
    {
      class: 'String',
      name: 'description',
      tableWidth: 600,
      section: 'basicInfo'
    },
    {
      name: 'daoKey',
      value: 'localTransactionDAO'
    },
    {
      name: 'ruleGroup',
      value: 'ClearingTime'
    },
    {
      name: 'operation',
      value: 'UPDATE'
    },
    {
      name: 'predicate',
      javaFactory: 'return new DefaultClearingTimeRulePredicate();'
    },
    {
      name: 'action',
      transient: true
    },
    {
      class: 'Int',
      name: 'duration',
      value: 2,
      validationPredicates:  [
        {
          args: ['duration'],
          predicateFactory: function(e) {
            return e.GTE(net.nanopay.meter.clearing.ruler.ClearingTimeRule.DURATION, 0);
          },
          errorString: 'Clearing time duration must be zero or greater'
        }
      ],
      section: 'basicInfo'
    },
    {
      name: 'enabled',
      section: 'basicInfo'
    }
  ],

  methods: [
    {
      name: 'findAccount',
      type: 'net.nanopay.account.Account',
      args: [
        {
          name: 'x',
          type: 'Context'
        },
        {
          name: 'transaction',
          type: 'net.nanopay.tx.model.Transaction'
        }
      ],
      javaCode: `
        return transaction instanceof COTransaction
          ? transaction.findDestinationAccount(x)
          : transaction.findSourceAccount(x);
      `
    },
    {
      name: 'incrClearingTime',
      args: [
        {
          name: 'transaction',
          type: 'net.nanopay.tx.model.Transaction'
        }
      ],
      javaCode: `
        if ( transaction instanceof ClearingTimesTrait ) {
          ((ClearingTimesTrait) transaction).getClearingTimes()
            .put(getClass().getSimpleName(), getDuration());
        }
      `
    }
  ]
});
