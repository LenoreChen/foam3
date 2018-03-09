foam.CLASS({
  package: 'net.nanopay.invite.ui',
  name: 'InvitationStatusHistoryItemView',
  extends: 'foam.u2.View',

  implements: [
    'foam.u2.history.HistoryItemView'
  ],

  requires: [
    'net.nanopay.invite.model.InvitationStatus'
  ],

  documentation: 'View for displaying history for invitation status',

  css: `
    ^ .iconPosition {
      margin-left: -6px;
    }
    ^ .messageBox {
      width: 513px;
      border-radius: 2px;
      background-color: #ffffff;
      border: solid 0.5px #a4b3b8;
      margin: 10px 0px 0px 31px;
      padding: 10px;
    }
    ^ .messageText {
      opacity: 0.7;
      font-family: Roboto;
      font-size: 12px;
      line-height: 1.33;
      letter-spacing: 0.2px;
      color: #093649;
      position: relative;
    }
    ^ .statusBox {
      margin-top: -20px;
      padding-bottom: 22px;
    }
    ^ .statusContent {
      padding-left: 40px;
    }
    ^ .statusDate {
      font-family: Roboto;
      font-size: 8px;
      line-height: 1.33;
      letter-spacing: 0.1px;
      color: #a4b3b8;
      top: 5px;
      position: relative;
    }
    ^ .statusTitle {
      font-family: Roboto;
      font-size: 12px;
      line-height: 1.33;
      letter-spacing: 0.2px;
      color: #093649;
    }
    ^ .Invite-Status-Pending {
      margin-left: 5px;
      width: 65px;
      height: 20px;
      border-radius: 100px;
      background-color: #a4b3b8;
      display: inline-block;
    }
    ^ .Invite-Status-Pending span {
      width: 45px;
      height: 20px;
      font-size: 12px;
      line-height: 1.67;
      letter-spacing: 0.2px;
      color: #ffffff;
      padding: 0 10px 0 10px;
    }

    ^ .Invite-Status-Submitted {
      margin-left: 5px;
      width: 77px;
      height: 20px;
      border-radius: 100px;
      border: solid 1px #2cab70;
      display: inline-block;
    }
    ^ .Invite-Status-Submitted span {
      width: 57px;
      height: 20px;
      font-size: 12px;
      line-height: 1.67;
      letter-spacing: 0.2px;
      color: #2cab70;
      padding: 0 10px 0 10px;
    }

    ^ .Invite-Status-Active {
      margin-left: 5px;
      width: 55px;
      height: 20px;
      border-radius: 100px;
      background-color: #2cab70;
      display: inline-block;
    }
    ^ .Invite-Status-Active span {
      width: 35px;
      height: 20px;
      font-size: 12px;
      line-height: 1.67;
      letter-spacing: 0.2px;
      color: #ffffff;
      padding: 0 10px 0 10px;
    }

    ^ .Invite-Status-Disabled {
      margin-left: 5px;
      width: 68px;
      height: 20px;
      border-radius: 100px;
      background-color: #093649;
      display: inline-block;
    }
    ^ .Invite-Status-Disabled span {
      width: 48px;
      height: 20px;
      font-size: 12px;
      line-height: 1.67;
      letter-spacing: 0.2px;
      color: #ffffff;
      padding: 0 10px 0 10px;
    }
  `,

  methods: [
    function getAttributes(record) {
      var status = record.updates.find(u => u.name == 'inviteStatus') ||
        { newValue: this.InvitationStatus.PENDING.ordinal };

      switch ( status.newValue ) {
        case this.InvitationStatus.PENDING.ordinal:
          return {
            title: 'Account was created',
            labelText: 'Pending',
            labelDecoration: 'Invite-Status-Pending',
            icon: 'images/ic-created.svg'
          };

        case this.InvitationStatus.SUBMITTED.ordinal:
          return {
            title: 'Registration',
            labelText: 'Submitted',
            labelDecoration: 'Invite-Status-Submitted',
            icon: 'images/ic-received.svg'
          };

        case this.InvitationStatus.ACTIVE.ordinal:
          return {
            title: 'Account activated',
            labelText: 'Active',
            labelDecoration: 'Invite-Status-Active',
            icon: 'images/ic-approve.svg'
          };

        case this.InvitationStatus.DISABLED.ordinal:
          return {
            title: 'Account',
            labelText: 'Disabled',
            labelDecoration: 'Invite-Status-Disabled',
            icon: 'images/ic-void.svg'
          };
      }
    },

    function formatDate(timestamp) {
      var locale = 'en-US';
      return timestamp.toLocaleTimeString(locale, { hour12: false }) +
        ' ' + timestamp.toLocaleString(locale, { month: 'short' }) +
        ' ' + timestamp.getDate() +
        ' ' + timestamp.getFullYear();
    },

    function outputRecord(parentView, record) {
      var attributes = this.getAttributes(record);

      return parentView
        .addClass(this.myClass())
        .style({' padding-left': '20px' })
        .start('div').addClass('iconPosition')
          .tag({ class: 'foam.u2.tag.Image', data: attributes.icon })
        .end()
        .start('div').addClass('statusBox')
          .start('div')
            .style({ 'padding-left': '30px' })
            .start('span').addClass('statusTitle')
              .add(attributes.title)
            .end()
            .start('div').addClass(attributes.labelDecoration)
              .start('span').add(attributes.labelText).end()
            .end()
          .end()
          .start('div')
            .style({ 'padding-left': '30px' })
            .start('span').addClass('statusDate')
              .add(this.formatDate(record.timestamp))
            .end()
          .end()
        .end()
    }
  ]
});