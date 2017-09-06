foam.CLASS({
  package: 'net.nanopay.interac.ui.etransfer',
  name: 'TransferComplete',
  extends: 'net.nanopay.interac.ui.etransfer.TransferView',

  documentation: 'Interac transfer completion and loading screen.',

  properties: [
    {
      name: 'time',
      value: 0
    }
  ], 

  axioms: [
    foam.u2.CSS.create({
      code: function CSS() {/*
        ^ p{
          width: 464px;
          font-family: Roboto;
          font-size: 12px;
          line-height: 1.45;
          letter-spacing: 0.3px;
          color: #093649;
        }
        ^ h3{
          font-family: Roboto;
          font-size: 12px;
          letter-spacing: 0.2px;
          color: #093649;
        }
        ^ h2{
          width: 300px;
          font-size: 14px;
          letter-spacing: 0.4px;
          color: #093649;
        }
        ^ .foam-u2-ActionView-exportModal{
          position: absolute;
          width: 75px;
          height: 35px;
          opacity: 0.01;
          cursor: pointer;
          z-index: 100;
        }
        ^status-check p {
          display: inline-block;
          margin-left: 10px;
          font-size: 12px;
          letter-spacing: 0.2px;
          color: grey;
          margin-top: 5px;
        }
        ^status-check img {
          position: relative;
          top: 5;
          display: none;
        }
        ^status-check-container{
          margin-top: 35px;
          margin-bottom: 35px;
        }
        ^ .show-yes{
          display: inline-block;
        }
        ^ .show-green{
          color: #2cab70;
        }
        ^status-check-container{
          height: 170px;
        }
        ^status-check{
          height: 32px;
        }
      */}
    })
  ],

  methods: [
    function init() {
      this.tick()

      this.SUPER();
      this
        .addClass(this.myClass())
        .start().style({ display: 'inline-block'})
          .start('h2').add('360 Design has received CAD 200.00.').end()
          .start('h3').add('Reference No. CAxxx723').end()
          .start()
            .start('p')
              .add('The transaction is successfully finished, you can check the status of the payment from home screen at any time.')
            .end()
          .end()
        .end()
        .start().style({ float: 'right'})
          .start({class: 'net.nanopay.retail.ui.shared.ActionButton', data: {image: 'images/ic-export.png', text: 'Export'}}).addClass('import-button').add(this.EXPORT_MODAL).end()
        .end()
        .start().addClass(this.myClass('status-check-container'))
          .start().addClass(this.myClass('status-check'))
            .start({ class: 'foam.u2.tag.Image', data:'images/c-yes.png'}).enableClass('show-yes', this.time$.map(function (value) { return value > 0 }))
            .start('p').add('Sending Bank Compliance Checks...').enableClass('show-green', this.time$.map(function (value) { return value > 0 })).end()
          .end()
          .start().addClass(this.myClass('status-check'))
            .start({ class: 'foam.u2.tag.Image', data:'images/c-yes.png'}).enableClass('show-yes', this.time$.map(function (value) { return value >  2}))
            .start('p').add('Receiving Bank Compliance Checks...').enableClass('show-green', this.time$.map(function (value) { return value > 2 })).end().end()
          .end()
          .start().addClass(this.myClass('status-check'))
            .start({ class: 'foam.u2.tag.Image', data:'images/c-yes.png'}).enableClass('show-yes', this.time$.map(function (value) { return value > 3 }))
            .start('p').add('Booking FX Rate...').enableClass('show-green', this.time$.map(function (value) { return value > 3 })).end().end()
          .end()
          .start().addClass(this.myClass('status-check'))
            .start({ class: 'foam.u2.tag.Image', data:'images/c-yes.png'}).enableClass('show-yes', this.time$.map(function (value) { return value > 4 }))
            .start('p').add('Generating IMPS Transaction...').enableClass('show-green', this.time$.map(function (value) { return value > 4 })).end().end()
          .end()
          .start().addClass(this.myClass('status-check'))
            .start({ class: 'foam.u2.tag.Image', data:'images/c-yes.png'}).enableClass('show-yes', this.time$.map(function (value) { return value > 5 }))
            .start('p').add('Payment Successful...').enableClass('show-green', this.time$.map(function (value) { return value > 5 })).end().end()
          .end()
        .end()
    }
  ],

  actions: [
    {
      name: 'exportModal',
      code: function(X){
        X.ctrl.add(foam.u2.dialog.Popup.create().tag({class: 'net.nanopay.interac.ui.modals.ExportModal'}));
      }
    },
  ],

  listeners: [
    {
      name: 'tick',
      isMerged: true,
      mergeDelay: 200,
      code: function () {
        this.time += 1;
        this.tick();
      }
    }
  ]
});
