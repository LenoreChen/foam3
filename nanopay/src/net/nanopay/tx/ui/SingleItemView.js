foam.CLASS({
  package: 'net.nanopay.tx.ui',
  name: 'SingleItemView',
  extends: 'foam.u2.View',

  properties: [
    'data',
    {
      name: 'payeeName',
      expression: function(){

      }
    },
    {
      name: 'payerName',
      expression: function(){
        
      }
    }
  ],

  axioms: [
    foam.u2.CSS.create({
      code: function CSS() {/*
        ^table-header{
          width: 960px;
          height: 40px;
          background-color: rgba(110, 174, 195, 0.2);
          padding-bottom: 10px;
        }
        ^ h3{
          width: 120px;
          display: inline-block;
          font-size: 12px;
          line-height: 1;
          font-weight: 500;
          text-align: center;
          color: #093649;
        }
        ^table-body{
          width: 960px;
          height: auto;
          background: white;
          padding: 10px 0;
        }
        ^ p{
          display: inline-block;
          width: 90px;
        }
        ^table-body h3{
          font-weight: 300;
          font-size: 12px;
          margin-top: 25px;
        }
        ^table-body h4{
          font-weight: 300;
          font-size: 12px;
          margin-top: 25px;
        }
        */
      }
    })
  ],

  methods: [
    function initE(){
      var self = this;
      debugger;
      this
        .addClass(this.myClass())
        .start('div').addClass('invoice-detail')
          .start().addClass(this.myClass('table-header'))
            .start('h3').add('Transaction ID').end()
            .start('h3').add('Date').end()
            .start('h3').add('Sending Bank').end()
            .start('h3').add('Sender ID').end()
            .start('h3').add('Amount').end()
            .start('h3').add('Recieving Bank').end()
            .start('h3').add('Recieving ID').end()
            .start('h3').add('Status').end()
          .end()
          .start().addClass(this.myClass('table-body'))
            .start('h3').add(this.data.id).end()
            .start('h3').add(this.data.date.toISOString().substring(0,10)).end()
            .start('h3').add(this.payerName).end()
            .start('h3').add(this.data.payerId).end()
            .start('h3').add('$', this.data.amount.toFixed(2)).end()
            .start('h3').add(this.payeeName).end()
            .start('h3').add(this.data.payeeId).end()
            .start('h3').add(this.data.status).end()
            // .start('h3')
            //   .add(this.data$.dot('status').map(function(a){                    
            //     return self.E().add(a).addClass('generic-status Invoice-Status-' + a);
            //   }))
          .end()
        .end()
    }
  ]
});