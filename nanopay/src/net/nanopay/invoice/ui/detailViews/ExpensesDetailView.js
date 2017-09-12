foam.CLASS({
  package: 'net.nanopay.invoice.ui.detailViews',
  name: 'ExpensesDetailView',
  extends: 'foam.u2.View',

  requires: [ 
    // 'net.nanopay.b2b.HistoryInvoiceItemView',
    'foam.u2.dialog.Popup' 
  ],

  imports: [ 
    'stack', 
    'hideSaleSummary', 
    'expensesDAO', 
    'historyDAO',
    'ctrl'
  ],
  
  implements: [
    'foam.mlang.Expressions', 
  ],

  axioms: [
    foam.u2.CSS.create({
      code: function CSS() {/*
        ^ h5{
          opacity: 0.6;
          font-size: 20px;
          font-weight: 300;
          line-height: 1;
          letter-spacing: 0.3px;
          color: #093649;
          padding-top: 70px;
        }
        ^ .foam-u2-history-HistoryView{
          width: 920px;
          margin-top: 20px;
        }
        */
      }
    })
  ],


  methods: [
    function initE() {
      this.SUPER();

      this.hideSaleSummary = true;
      this
        .addClass(this.myClass())
        .tag({ 
          class: 'net.nanopay.b2b.ui.DetailButtons', 
          invoice: this.data,
          detailActions: { 
            invoice: this.invoice,
            buttonLabel: 'Pay Now', 
            buttonAction: this.payNowPopUp, 
            subMenu1: 'Schedule a Payment', 
            subMenuAction1: this.schedulePopUp, 
            subMenu2: 'Dispute', subMenuAction2: 
            this.disputePopUp 
          }
        })
        .start('h5').add('Invoice from ', this.data.toBusinessName).end()
        .tag({ class: 'net.nanopay.b2b.ui.RowTableView', item: this.data })
        .tag({ 
          class: 'foam.u2.history.HistoryView',
          data: this.historyDAO,
          historyItemView: this.HistoryInvoiceItemView.create()
        });
    }
  ],

  listeners: [
    function payNowPopUp(){
      this.ctrl.add(this.Popup.create().tag({class: 'net.nanopay.b2b.ui.modals.PayNowModal'}));
    },

    function disputePopUp(){
      this.ctrl.add(this.Popup.create().tag({class: 'net.nanopay.b2b.ui.modals.DisputeModal'}));
    },

    function schedulePopUp(){
      this.ctrl.add(this.Popup.create().tag({class: 'net.nanopay.b2b.ui.modals.ScheduleModal'}));
    }
  ]

});