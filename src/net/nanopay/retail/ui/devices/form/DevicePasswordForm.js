foam.CLASS({
  package: 'net.nanopay.retail.ui.devices.form',
  name: 'DevicePasswordForm',
  extends: 'foam.u2.View',

  documentation: 'Form to display device password.',

  axioms: [
    foam.u2.CSS.create({
      code: function CSS() {/*
        ^{

        }

        ^ .stepBottomMargin {
          margin-bottom: 30px;
        }

        ^ .passwordLabel {
          font-size: 45px;
          letter-spacing: 24px;
          color: #093649;
        }
      */}
    })
  ],

  requires: [
    'net.nanopay.retail.model.Device'
  ],

  messages: [
    { name: 'Step',         message: 'Step 4: Use the following code.' },
    { name: 'Instructions', message: 'Please input the following code on the device you want to provision and follow the instructions on your device to finish the process.' }
  ],

  methods: [
    function initE() {
      this.SUPER();
      this
        .addClass(this.myClass())

        .start('div').addClass('row').addClass('rowTopMarginOverride')
          .start('p').addClass('pDefault').add(this.Step).end()
        .end()
        .start('p').addClass('pDefault').add(this.Instructions).addClass('stepBottomMargin').end()
        .start('p').addClass('passwordLabel').add('012345').end()
    }
  ]
});
