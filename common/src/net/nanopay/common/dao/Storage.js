foam.CLASS({
  package: 'net.nanopay.common.dao',
  name: 'Storage',

  documentation: 'Creates all common DAO\'s.',

  requires: [
    'foam.dao.DecoratedDAO',
    'foam.dao.EasyDAO',
    'foam.dao.history.HistoryRecord',
    'net.nanopay.transactionservice.model.Transaction'
  ],

  exports: [
    'transactionDAO'
  ],

  properties: [
    {
      name: 'transactionDAO',
      factory: function() {
        return this.createDAO({
          of: this.Transaction,
          seqNo: true,
          testData: [
              {
                referenceNumber: 'CAxxxJZ7', date: '2017 Aug 22', payerId: 1, payeeId: 2, amount: 2300.00, rate: 52.51, fees: 20.00
              },
              {
                referenceNumber: 'CAxxxJZ7', date: '2017 Aug 22', payerId: 1, payeeId: 2, amount: 3200.00, rate: 52.51, fees: 20.00
              }
          ]
        })
        .addPropertyIndex(this.Transaction.REFERENCE_NUMBER)
        .addPropertyIndex(this.Transaction.DATE)
        .addPropertyIndex(this.Transaction.PAYEE_ID)
        .addPropertyIndex(this.Transaction.AMOUNT)
        .addPropertyIndex(this.Transaction.RATE)
        .addPropertyIndex(this.Transaction.FEES)
      }
    }
  ],

  methods: [
    function createDAO(config) {
      config.daoType = 'MDAO'; // 'IDB';
      config.cache   = true;

      return this.EasyDAO.create(config);
    }
  ]
});