/**
 * NANOPAY CONFIDENTIAL
 *
 * [2020] nanopay Corporation
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of nanopay Corporation.
 * The intellectual and technical concepts contained
 * herein are proprietary to nanopay Corporation
 * and may be covered by Canadian and Foreign Patents, patents
 * in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from nanopay Corporation.
 */

foam.CLASS({
  package: 'net.nanopay.bank',
  name: 'BankAccountController',
  extends: 'foam.comics.DAOController',

  documentation: 'A custom DAOController to work with bank accounts.',

  requires: [
    'foam.core.Action',
    'foam.log.LogLevel',
    'foam.u2.ControllerMode',
    'foam.u2.dialog.Popup',
    'net.nanopay.account.Account',
    'net.nanopay.bank.BankAccount',
    'net.nanopay.bank.BankAccountStatus',
    'net.nanopay.bank.BRBankAccount',
    'net.nanopay.bank.CABankAccount',
    'net.nanopay.bank.USBankAccount',
    'net.nanopay.sme.ui.SMEModal'
  ],

  implements: [
    'foam.mlang.Expressions',
  ],

  imports: [
    'ctrl',
    'notify',
    'stack',
    'subject',
    'auth'
  ],

  exports: [
    'selectedAccount'
  ],

  messages: [
    { name: 'DELETE_DEFAULT', message: 'Unable to delete default accounts. Please select a new default account if one exists.' },
    { name: 'UNABLE_TO_DELETE', message: 'Error deleting account: ' },
    { name: 'SUCCESSFULLY_DELETED', message: 'Bank account deleted' },
    { name: 'IS_DEFAULT', message: 'is now your default bank account. Funds will be automatically transferred to and from this account.' },
    { name: 'UNABLE_TO_DEFAULT', message: 'Unable to set non verified bank accounts as default' },
    { name: 'ALREADY_DEFAULT', message: 'is already a default bank account' },
    { name: 'BANK_ACCOUNT_LABEL', message: 'Bank Account' }
  ],

  css: `
  .bank-account-popup .net-nanopay-sme-ui-SMEModal-inner {
    width: 515px;
    height: 500px;
  }
  .bank-account-popup .net-nanopay-sme-ui-SMEModal-content {
    overflow: scroll !important;
    padding: 30px;
  }
  .bank-account-detail-popup .net-nanopay-sme-ui-SMEModal-inner {
    max-height: 100vh;
    overflow: scroll;
  }
  `,

  properties: [
    {
      class: 'foam.dao.DAOProperty',
      name: 'data',
      factory: function() {
        var dao = this.subject.user.accounts.where(
          this.OR(
            this.INSTANCE_OF(this.CABankAccount),
            this.INSTANCE_OF(this.USBankAccount),
            this.INSTANCE_OF(this.BRBankAccount)
          )
        );
        dao.of = this.BankAccount;
        return dao;
      }
    },
    {
      class: 'FObjectProperty',
      name: 'bankAccount',
      factory: function() {
        return (foam.lookup(`net.nanopay.bank.${ this.subject.user.address.countryId }BankAccount`)).create({}, this);
      }
    },
    {
      class: 'foam.u2.ViewSpec',
      name: 'summaryView',
      factory: function() {
        var self = this;
        return {
          class: 'foam.u2.view.ScrollTableView',
          editColumnsEnabled: false,
          columns: [
            this.BankAccount.NAME.clone().copyFrom({
              tableWidth: 168
            }),
            'summary',
            'flagImage',
            'denomination',
            'status',
            'isDefault'
          ],
          dblClickListenerAction: async function dblClick(account, id) {
            if ( ! account ) account = await self.__subContext__.accountDAO.find(id);

            var popupView = account.status === self.BankAccountStatus.UNVERIFIED && self.CABankAccount.isInstance(account) ?
              self.Popup.create().tag({
                class: 'net.nanopay.cico.ui.bankAccount.modalForm.CABankMicroForm',
                bank: account
              }) :
              self.SMEModal.create().addClass('bank-account-popup')
                .startContext({ controllerMode: self.ControllerMode.EDIT })
                  .tag({
                    class: 'net.nanopay.account.ui.BankAccountWizard',
                    data: account,
                    useSections: ['accountInformation', 'pad']
                  })
                .endContext();
            self.ctrl.add(popupView);
          },
          contextMenuActions: [
            this.VERIFY_ACCOUNT,
            this.EDIT_MENU,
            this.SET_AS_DEFAULT,
            this.DELETE
          ]
        };
      }
    },
    {
      name: 'primaryAction',
      factory: function() { return this.ADD_BANK; }
    },
    {
      class: 'FObjectProperty',
      of: 'net.nanopay.bank.BankAccount',
      name: 'selectedAccount',
      documentation: `
        The account that the user wants to verify. Exported so that BankForm
        can use it.
      `
    },
    {
      class: 'Boolean',
      name: 'available',
      value: false,
      documentation: `used for disabling the button for adding a Bank Account when User has one of each currency (CAD && USD)`
    }
  ],

  methods: [
    function init() {
      this.SUPER();
    },

    function purgeCachedDAOs() {
      this.__subContext__.accountDAO.cmd_(this, foam.dao.CachingDAO.PURGE);
      this.__subContext__.accountDAO.cmd_(this, foam.dao.AbstractDAO.RESET_CMD);
    }
  ],

  actions: [
    {
      name: 'verifyAccount',
      isAvailable: function() {
        var self = this.__subContext__.data;
        return this.cls_.name == self.CABankAccount.name;
      },
      isEnabled: function() {
        var self = this.__subContext__.data;
        return this.status === self.BankAccountStatus.UNVERIFIED;
      },
      code: function(X) {
        var self = this.__subContext__.data;
        self.selectedAccount = this;
        self.ctrl.add(self.Popup.create().tag({
          class: 'net.nanopay.cico.ui.bankAccount.modalForm.CABankMicroForm',
          bank: self.selectedAccount
        }));
      }
    },
    {
      name: 'EditMenu',
      isAvailable: function() {
        return ! this.verifiedBy
      },
      code: async function(X) {
        var self = this.__subContext__.data;
        var account = await self.__subContext__.accountDAO.find(this.id);
        self.ctrl.add(self.SMEModal.create().addClass('bank-account-popup')
          .startContext({ controllerMode: self.ControllerMode.EDIT })
            .tag({
              class: 'net.nanopay.account.ui.BankAccountWizard',
              data: account,
              useSections: ['accountInformation', 'pad']
            })
          .endContext()
          );
      }
    },
    {
      name: 'setAsDefault',
      code: function(X) {
        var self = this.__subContext__.data;
        if ( this.isDefault ) {
          self.notify(`${ this.name } ${ self.ALREADY_DEFAULT }`, '', self.LogLevel.WARN, true);
          return;
        } else {
          this.isDefault = true;
          self.subject.user.accounts.put(this).then(() =>{
            self.notify(`${ this.name } ${ self.IS_DEFAULT }`, '', self.LogLevel.INFO, true);
          }).catch((err) => {
            this.isDefault = false;
            self.notify(self.UNABLE_TO_DEFAULT, '', self.LogLevel.ERROR, true);
          });

          self.purgeCachedDAOs();
        }
      }
    },
    {
      name: 'delete',
      code: function(X) {
        var self = this.__subContext__.data;
        if ( this.isDefault ) {
          this.notify(self.DELETE_DEFAULT, '', this.LogLevel.ERROR, true);
          return;
        }

        this.deleted = true;
        this.status = self.BankAccountStatus.DISABLED;

        self.ctrl.add(self.Popup.create().tag({
          class: 'foam.u2.DeleteModal',
          dao: self.subject.user.accounts,
          data: this
        }));
      }
    },
    {
      name: 'addBank',
      label: 'Add account',
      code: async function(X) {
        let permission = await this.auth.check(null, 'multi-currency.read');
        if ( permission ) {
          X.controllerView.stack.push({
            class: 'net.nanopay.bank.ui.BankPickCurrencyView'
          }, this);
        } else {
          this.ctrl.add(this.SMEModal.create({
            onClose : function() { this.__subContext__.data.clearProperty('bankAccount'); }
          }).addClass('bank-account-popup').tag({
            class: 'net.nanopay.account.ui.BankAccountWizard',
            data: this.bankAccount,
            useSections: ['accountInformation', 'pad']
          }));
        }
      }
    }
  ]
});
