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
  package: 'net.nanopay.country.br',
  name: 'CPF',
  mixins: ['foam.u2.wizard.AbstractWizardletAware'],
  documentation: `
    The Cadastro de Pessoas Físicas (CPF; Portuguese for "Natural Persons Register") is the Brazilian individual taxpayer registry identification, a permanent number attributed by the Brazilian Federal Revenue to both Brazilians and resident aliens who pay taxes or take part, directly or indirectly. It is canceled after some time after the person's death.
  `,

  implements: [
    'foam.core.Validatable'
  ],

  javaImports: [
    'foam.nanos.auth.Subject',
    'foam.nanos.auth.User',
    'foam.nanos.logger.Logger',
  ],

  imports: [
    'brazilVerificationService',
    'subject'
  ],

  messages: [
    { name: 'INVALID_CPF', message: 'Valid CPF number required' },
    { name: 'INVALID_CPF_CHECKED', message: 'Unable to validate CPF number and birthdate combination. Please update and try again.' },
    { name: 'INVALID_NAME', message: 'Click to verify name' },
    { name: 'INVALID_DATE_ERROR', message: 'Valid date of birth required' },
    { name: 'UNGER_AGE_LIMIT_ERROR', message: 'Must be at least 18 years old' },
    { name: 'OVER_AGE_LIMIT_ERROR', message: 'Must be under the age of 125 years old' }
  ],

  sections: [
    {
      name: 'collectCpf',
      title: 'Enter your Date of Birth and Cadastro de Pessoas Físicas(CPF)',
      navTitle: 'Signing officer\’s CPF number',
      help: 'Require your CPF'
    }
  ],

  properties: [
    foam.nanos.auth.User.BIRTHDAY.clone().copyFrom({
      section: 'collectCpf',
      label: 'Date of birth',
      visibility: 'RW',
      validationPredicates: [
        {
          args: ['birthday'],
          predicateFactory: function(e) {
            return e.NEQ(net.nanopay.country.br.CPF.BIRTHDAY, null);
          },
          errorMessage: 'INVALID_DATE_ERROR'
        },
        {
          args: ['birthday'],
          predicateFactory: function(e) {
            var limit = new Date();
            limit.setDate(limit.getDate() - ( 18 * 365 ));
            return e.LT(net.nanopay.country.br.CPF.BIRTHDAY, limit);
          },
          errorMessage: 'UNGER_AGE_LIMIT_ERROR'
        },
        {
          args: ['birthday'],
          predicateFactory: function(e) {
            var limit = new Date();
            limit.setDate(limit.getDate() - ( 125 * 365 ));
            return e.GT(net.nanopay.country.br.CPF.BIRTHDAY, limit);
          },
          errorMessage: 'OVER_AGE_LIMIT_ERROR'
        }
      ]
    }),
    {
      class: 'String',
      name: 'data',
      label: 'Cadastro de Pessoas Físicas (CPF)',
      section: 'collectCpf',
      help: `The CPF (Cadastro de Pessoas Físicas or Natural Persons Register) is a number assigned by the Brazilian revenue agency to both Brazilians and resident aliens who are subject to taxes in Brazil.`,
      validationPredicates: [
        {
          args: ['data', 'cpfName'],
          predicateFactory: function(e) {
            return e.EQ(
                foam.mlang.StringLength.create({
                  arg1: net.nanopay.country.br.CPF.DATA
                }), 11);
          },
          errorMessage: 'INVALID_CPF'
        },
        {
          args: ['data', 'cpfName'],
          predicateFactory: function(e) {
            return e.AND(
              e.GT(net.nanopay.country.br.CPF
                .CPF_NAME, 0),
              e.EQ(
                foam.mlang.StringLength.create({
                  arg1: net.nanopay.country.br.CPF.DATA
                }), 11)
              );
          },
          errorMessage: 'INVALID_CPF_CHECKED'
        }
      ],
      tableCellFormatter: function(val) {
        return foam.String.applyFormat(val, 'xxx.xxx.xxx-xx');
      },
      postSet: function(_,n) {
        if ( n.length == 11 && this.verifyName !== true ) {
          this.cpfName = "";
          this.getCpfName(n).then((v) => {
            this.cpfName = v;
          });
        }
      },
      view: function(_, X) {
        return foam.u2.FragmentedTextField.create({
          delegates: [
            foam.u2.FragmentedTextFieldFragment.create({
              data: X.data.data.slice(0,3),
              maxLength: 3
            }),
            '.',
            foam.u2.FragmentedTextFieldFragment.create({
              data: X.data.data.slice(3,6),
              maxLength: 3
            }),
            '.',
            foam.u2.FragmentedTextFieldFragment.create({
              data: X.data.data.slice(6,9),
              maxLength: 3
            }),
            '-',
            foam.u2.FragmentedTextFieldFragment.create({
              data: X.data.data.slice(9,11),
              maxLength: 2
            })
          ]
        }, X)
      }
    },
    {
      class: 'String',
      name: 'cpfName',
      label: '',
      section: 'collectCpf',
      hidden: true
    },
    {
      class: 'Boolean',
      name: 'verifyName',
      label: 'Is this you?',
      section: 'collectCpf',
      view: function(n, X) {
        var self = X.data$;
        return foam.u2.CheckBox.create({
          labelFormatter: function() {
            this.start('span')
              .add(self.dot('cpfName'))
            .end();
          }
        });
      },
      visibility: function(cpfName) {
        return cpfName.length > 0 ? foam.u2.DisplayMode.RW : foam.u2.DisplayMode.HIDDEN;
      },
      validationPredicates: [
        {
          args: ['verifyName'],
          predicateFactory: function(e) {
            return e.EQ(net.nanopay.country.br.CPF.VERIFY_NAME, true);
          },
          errorMessage: 'INVALID_NAME'
        }
      ]
    },
    {
      class: 'Reference',
      of: 'foam.nanos.auth.User',
      name: 'user',
      hidden: true,
      factory: function() {
        return this.subject.realUser;
      }
      // depricated but leaving for data migration - script to do this needed - then delete
    }
  ],

  methods: [
    function installInWizardlet(w) {
      // CPF takes longer to save, so re-load may clear new inputs
      w.reloadAfterSave = false;
    },
    {
      name: 'getCpfName',
      code: async function(cpf) {
        if ( ! this.birthday ) // goes with user deprication
          return await this.brazilVerificationService.getCPFName(this.__subContext__, cpf, this.user);
        return await this.brazilVerificationService
          .getCPFNameWithBirthDate(this.__subContext__, cpf, this.birthday);
      }
    },
    {
      name: 'validate',
      javaCode: `
      if ( ! getVerifyName() )
          throw new foam.core.ValidationException(INVALID_CPF);

      foam.core.FObject.super.validate(x);
      `
    }
  ]
});