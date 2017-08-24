
foam.CLASS({
  package: 'net.nanopay.admin.ui.user',
  name: 'SendMoneyView',
  extends: 'foam.u2.View',

  documentation: 'Send Money View',

  methods: [
    function initE() {
      this.SUPER();

      this
        .tag({
          class: 'net.nanopay.common.ui.PopUpView',
          title: 'Send Money',
          messageView: this.SendMoneyMessageView
        });
    }
  ],

  classes: [
    {
      name: 'SendMoneyMessageView',
      extends: 'foam.u2.View',
      
      requires: [ 
        'foam.nanos.auth.User',
        'foam.u2.search.GroupAutocompleteSearchView',
        'foam.u2.view.TextField'
      ],

      imports: [ 'userDAO' ],

      exports: [
        'removeChip'
      ],

      properties: [ 
        {
          class: 'foam.dao.DAOProperty',
          name: 'data',
          factory: function() { return this.userDAO; }
        },
        {
          name: 'labels',
          value: []
        },
        'autocompleteView'
      ],

      axioms: [
        foam.u2.CSS.create({
          code:
          `
          ^ .balance {
            padding: 10px 74px 0px 20px;
            font-family: Roboto;
            font-size: 14px;
            font-weight: bold;
            letter-spacing: 0.2px;
            text-align: left;
            color: #093649;
          }

          ^ .tag-container {
            margin: 5px 0px 20px 15px;
            display: inline-block;
          }

          ^ .foam-u2-ActionView-closeButton {
            width: 24px;
            height: 24px;
            margin: 0;
            margin-top: -10px;
            margin-right: 20px;
            cursor: pointer;
            display: inline-block;
            float: right;
            border: none;
            background: transparent;
            outline: none;
          }

          ^ .foam-u2-ActionView-closeButton:hover {
            outline: none;
            border: none;
            background: transparent;
          }
      `})],

      methods: [
        function initE() {
          this.SUPER();
          var self = this;

          this
            .addClass(this.myClass())
            .start('div')
              .start('p').addClass('balance').add('Balance').end()
              .start('p').addClass('pDefault').add('$ 30000.22').end()
            .end()
            .start().addClass('input-container')
              .start('p').addClass('pDefault').add('Send To').end()
            .end()
            .add(this.slot(function(labels) {
              return this.E('div')
                .addClass('tag-container')
                .forEach(labels, function(label) {
                    this.tag({
                      class: 'net.nanopay.admin.ui.shared.ChipView',
                      data: label
                    })
                });
            }))
            .tag({
              class: 'foam.u2.search.GroupAutocompleteSearchView',
              property: foam.nanos.auth.User.EMAIL,
              dao: self.data,
              view$: self.autocompleteView$
            }).on('input', elem => self.verifyTag(elem))
            .start().addClass('input-container')
              .start('p').addClass('pDefault').add('Amount').end()
              .start('input').addClass('input-Box').end()
            .end()
            .start().addClass('Button-Container')
              .start().addClass('Button').add('Next').end()
            .end();
        },

        function removeChip(data) {
          var labels = this.labels.filter(l => l != data);
          this.labels = labels;
        }
      ],

      listeners: [
        function verifyTag(elem) {
          var dataOptions = elem.target.list.options;

          for ( var i = 0 ; i < dataOptions.length ; i++ ) {
            if ( dataOptions[i].value == this.autocompleteView.data ) {
              var labels = foam.Array.clone(this.labels);
              labels.push(this.autocompleteView.data);
              this.labels = labels;

              this.autocompleteView.data = '';
              break;
            }
          }
        }
      ]
    }
  ]
})
