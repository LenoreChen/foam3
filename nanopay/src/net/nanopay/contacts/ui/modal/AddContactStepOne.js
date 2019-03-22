foam.CLASS({
  package: 'net.nanopay.contacts.ui.modal',
  name: 'AddContactStepOne',
  extends: 'net.nanopay.ui.wizardModal.WizardModalSubView',

  documentation: `
    This is the first step of the adding contact flow to allow user to add 
    business name and emails for inviting a contact.
  `,

  implements: [
    'foam.mlang.Expressions'
  ],

  requires: [
    'net.nanopay.contacts.Contact',
    'net.nanopay.contacts.ContactStatus'
  ],

  imports: [
    'closeDialog',
    'ctrl',
    'isEdit',
    'notify',
    'user'
  ],

  css: `
    ^ {
      max-height: 80vh;
      overflow-y: scroll;
      padding: 24px;
    }
    ^ .side-by-side {
      display: grid;
      grid-gap: 16px;
      grid-template-columns: 1fr 1fr;
    }
    ^invite {
      margin-top: 16px;
    }
    ^invite-explaination {
      color: #2b2b2b;
      font-size: 12px;
      margin-top: 16px;
    }

    /* Customized checkbox */
    .foam-u2-CheckBox-label {
      color: #2b2b2b !important;
      margin-left: 8px !important;
    }
    .foam-u2-CheckBox {
      margin-left: 0px !important;
    }
  `,

  messages: [
    { name: 'CREATE_TITLE', message: 'Create a personal contact' },
    { name: 'EDIT_TITLE', message: 'Edit contact' },
    { name: 'INSTRUCTION', message: `Create a new contact by entering in their business information below. If you have their banking information, you can start sending payments to the contact right away.` },
    { name: 'BUSINESS_LABEL', message: 'Business name' },
    { name: 'BUSINESS_PLACEHOLDER', message: 'Enter business name' },
    { name: 'EMAIL_PLACEHOLDER', message: 'example@domain.com' },
    { name: 'INVITE_EXPLAINATION', message: `You confirm you have a business relationship with this contact and acknowledge that notifications for the Ablii service will be sent to the email address provided above.` },
    { name: 'STEP_INDICATOR', message: 'Step 1 of 3' }
  ],

  properties: [
    {
      class: 'String',
      name: 'title',
      documentation: 'The modal title.',
      expression: function(isEdit) {
        return isEdit ? this.EDIT_TITLE : this.CREATE_TITLE;
      }
    }
  ],

  methods: [
    function initE() {
      var emailDisplayMode = this.isEdit ?
        foam.u2.DisplayMode.DISABLED : foam.u2.DisplayMode.RW;

      this.addClass(this.myClass())
        .start().addClass('title-block')
          .start()
            .addClass('contact-title')
            .addClass('popUpTitle')
            .add(this.title$)
          .end()
          .start().addClass('step-indicator')
            .add(this.STEP_INDICATOR)
          .end()
        .end()
        .start().hide(this.isEdit$)
          .addClass('instruction')
          .add(this.INSTRUCTION)
        .end()
        .startContext({ data: this.wizard.data })
          .start('p')
            .addClass('field-label')
            .add(this.BUSINESS_LABEL)
          .end()
          .tag(this.wizard.data.ORGANIZATION, {
            placeholder: this.BUSINESS_PLACEHOLDER,
            onKey: true
          })
          .start('p')
            .addClass('field-label')
            .add(this.wizard.data.EMAIL.label)
          .end()
          .start()
            .tag(this.wizard.data.EMAIL, {
              mode: emailDisplayMode,
              placeholder: this.EMAIL_PLACEHOLDER,
              onKey: true
            })
          .end()
          .start()
            .addClass('side-by-side')
            .start()
              .start('p')
                .addClass('field-label')
                .add(this.wizard.data.FIRST_NAME.label)
              .end()
              .tag(this.wizard.data.FIRST_NAME, {
                placeholder: 'Optional',
                onKey: true
              })
            .end()
            .start()
              .start('p')
                .addClass('field-label')
                .add(this.wizard.data.LAST_NAME.label)
              .end()
              .tag(this.wizard.data.LAST_NAME, {
                placeholder: 'Optional',
                onKey: true
              })
            .end()
          .end()
        .endContext()
        .startContext({ data: this.wizard })
          .start()
            .hide(this.isEdit)
            .start()
              .addClass(this.myClass('invite'))
              .add(this.wizard.SHOULD_INVITE)
            .end()
            .start()
              .addClass(this.myClass('invite-explaination'))
              .add(this.INVITE_EXPLAINATION)
            .end()
          .end()
        .endContext()
        .tag({
          class: 'net.nanopay.sme.ui.wizardModal.WizardModalNavigationBar',
          back: this.BACK,
          next: this.NEXT
        });
    }
  ],

  actions: [
    {
      name: 'back',
      label: 'Go back',
      isAvailable: function(isEdit) {
        return ! isEdit;
      },
      code: function(X) {
        if ( X.subStack.depth > 1 ) {
          // Clean up the form if user goes back to the SearchBusinessView
          this.wizard.data = net.nanopay.contacts.Contact.create({
            type: 'Contact',
            group: 'sme'
          });
          X.subStack.back();
        } else {
          X.closeDialog();
        }
      }
    },
    {
      name: 'next',
      label: 'Next',
      code: async function(X) {
        // Validate the contact fields.
        if ( this.wizard.data.errors_ ) {
          this.notify(this.wizard.data.errors_[0][1], 'error');
          return;
        }
        if ( ! this.isEdit ) {
          try {
            var contact = await this.user.contacts.where(
              this.EQ(this.Contact.EMAIL, this.wizard.data.email)
            ).select();
            if ( contact.array.length !== 0 ) {
              this.ctrl.notify(
                'Contact with same email address already exists',
                'warning'
              );
              return;
            }
          } catch (err) {
            console
              .warn('Error when checking the contact email existence: ' + err);
            return;
          }
        }
        X.pushToId('AddContactStepTwo');
      }
    }
  ]
});
