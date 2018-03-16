FOAM_FILES([
  { name: 'net/nanopay/blob/AmazonS3BlobStore' },
  { name: 'net/nanopay/dao/crypto/EncryptedObject' },
  { name: 'net/nanopay/model/Account' },
  { name: 'net/nanopay/model/Branch' },
  { name: 'net/nanopay/model/BankAccount' },
  { name: 'net/nanopay/model/Currency' },
  { name: 'net/nanopay/model/BusinessSector' },
  { name: 'net/nanopay/model/BusinessType' },
  { name: 'net/nanopay/model/PadAccount' },
  { name: 'net/nanopay/model/DateAndPlaceOfBirth' },
  { name: 'net/nanopay/model/Identification' },
  { name: 'net/nanopay/admin/model/ComplianceStatus' },
  { name: 'net/nanopay/admin/model/AccountStatus' },
  { name: 'net/nanopay/model/User' },

  // onboarding
  { name: 'net/nanopay/onboarding/b2b/ui/AddPrincipleOwnersForm', flags: ['web'] },


  { name: 'net/nanopay/liquidity/model/Threshold' },
  { name: 'net/nanopay/liquidity/model/Liquidity' },
  { name: 'net/nanopay/liquidity/model/ThresholdResolve' },
  { name: 'net/nanopay/liquidity/model/BalanceAlert' },
  { name: 'net/nanopay/ui/wizard/WizardView', flags: ['web'] },
  { name: 'net/nanopay/auth/email/EmailTokenService'},
  { name: 'net/nanopay/auth/sms/AuthyTokenService', flags: ['web'] },
  { name: 'net/nanopay/ui/wizard/WizardOverview', flags: ['web'] },
  { name: 'net/nanopay/ui/wizard/WizardSubView', flags: ['web'] },
  { name: 'net/nanopay/ui/NotificationActionCard', flags: ['web'] },
  { name: 'net/nanopay/ui/ContentCard', flags: ['web'] },
  { name: 'net/nanopay/ui/RadioView', flags: ['web'] },
  { name: 'net/nanopay/ui/ToggleSwitch', flags: ['web'] },
  { name: 'net/nanopay/ui/LoadingSpinner', flags: ['web'] },
  { name: 'net/nanopay/ui/PostalCodeFormat', flags: ['web'] },
  { name: 'net/nanopay/ui/BalanceView', flags: ['web'] },
  { name: 'net/nanopay/ui/ExpandContainer', flags: ['web'] },

  // fx
  { name: 'net/nanopay/fx/model/ExchangeRate' },
  { name: 'net/nanopay/fx/model/ExchangeRateQuote' },
  { name: 'net/nanopay/fx/ExchangeRateInterface' },
  { name: 'net/nanopay/fx/client/ClientExchangeRateService' },

  // ascendant fx
  { name: 'net/nanopay/fx/ascendantfx/AscendantFX'},

  // interac
  { name: 'net/nanopay/fx/interac/model/PayoutOptions'},
  { name: 'net/nanopay/fx/interac/model/Corridor'},
  { name: 'net/nanopay/fx/interac/model/RequiredUserFields'},

  // lianlian pay
  { name: 'net/nanopay/fx/lianlianpay/LianLianPay' },
  { name: 'net/nanopay/fx/lianlianpay/model/ResultCode' },
  { name: 'net/nanopay/fx/lianlianpay/model/DistributionMode' },
  { name: 'net/nanopay/fx/lianlianpay/model/InstructionType' },
  { name: 'net/nanopay/fx/lianlianpay/model/CurrencyBalanceRecord' },
  { name: 'net/nanopay/fx/lianlianpay/model/InstructionCombined' },
  { name: 'net/nanopay/fx/lianlianpay/model/InstructionCombinedRequest' },
  { name: 'net/nanopay/fx/lianlianpay/model/InstructionCombinedSummary' },
  { name: 'net/nanopay/fx/lianlianpay/model/PreProcessResult' },
  { name: 'net/nanopay/fx/lianlianpay/model/PreProcessResultResponse' },
  { name: 'net/nanopay/fx/lianlianpay/model/PreProcessResultSummary' },
  { name: 'net/nanopay/fx/lianlianpay/model/Reconciliation' },
  { name: 'net/nanopay/fx/lianlianpay/model/ReconciliationRecord' },
  { name: 'net/nanopay/fx/lianlianpay/model/Statement' },
  { name: 'net/nanopay/fx/lianlianpay/model/StatementRecord' },

  // tx
  { name: 'net/nanopay/tx/client/ClientUserTransactionLimitService' },
  { name: 'net/nanopay/tx/model/CashOutFrequency' },
  { name: 'net/nanopay/tx/model/Fee' },
  { name: 'net/nanopay/tx/model/FeeInterface' },
  { name: 'net/nanopay/tx/model/FeeType' },
  { name: 'net/nanopay/tx/model/FixedFee' },
  { name: 'net/nanopay/tx/model/InformationalFee' },
  { name: 'net/nanopay/tx/model/LiquiditySettings' },
  { name: 'net/nanopay/tx/model/PercentageFee' },
  { name: 'net/nanopay/tx/model/Transaction' },
  { name: 'net/nanopay/tx/model/TransactionLimit' },
  { name: 'net/nanopay/tx/model/TransactionLimitTimeFrame' },
  { name: 'net/nanopay/tx/model/TransactionLimitType' },
  { name: 'net/nanopay/tx/model/TransactionPurpose' },
  { name: 'net/nanopay/tx/UserTransactionLimit' },

  { name: 'net/nanopay/model/Broker' },

  { name: 'net/nanopay/tx/ui/TransactionsView', flags: ['web'] },
  { name: 'net/nanopay/tx/ui/TransactionDetailView', flags: ['web'] },
  { name: 'net/nanopay/tx/ui/SingleItemView', flags: ['web'] },

  { name: 'net/nanopay/util/ChallengeGenerator' },

  // retail
  { name: 'net/nanopay/retail/model/DeviceType' },
  { name: 'net/nanopay/retail/model/DeviceStatus' },
  { name: 'net/nanopay/retail/model/Device' },
  { name: 'net/nanopay/retail/model/Transaction' },

  { name: 'net/nanopay/retail/ui/devices/DeviceCTACard', flags: ['web'] },
  { name: 'net/nanopay/retail/ui/devices/DevicesView', flags: ['web'] },
  { name: 'net/nanopay/retail/ui/devices/ManageDeviceModal', flags: ['web'] },
  { name: 'net/nanopay/retail/ui/devices/form/DeviceForm', flags: ['web'] },
  { name: 'net/nanopay/retail/ui/devices/form/DeviceNameForm', flags: ['web'] },
  { name: 'net/nanopay/retail/ui/devices/form/DeviceTypeForm', flags: ['web'] },
  { name: 'net/nanopay/retail/ui/devices/form/DeviceSerialForm', flags: ['web'] },
  { name: 'net/nanopay/retail/ui/devices/form/DevicePasswordForm', flags: ['web'] },

  // admin
  { name: 'net/nanopay/admin/ui/AddBusinessView', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/AddMerchantView', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/AddCompanyView', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/AddShopperView', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/SendMoneyView', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/SubMenu', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/TransactionView', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/UserView', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/form/merchant/AddMerchantForm', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/form/merchant/AddMerchantInfoForm', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/form/merchant/AddMerchantProfileForm', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/form/merchant/AddMerchantSendMoneyForm', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/form/merchant/AddMerchantReviewForm', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/form/shopper/AddShopperForm', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/form/shopper/AddShopperInfoForm', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/form/shopper/AddShopperSendMoneyForm', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/form/shopper/AddShopperReviewForm', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/form/company/AddCompanyForm', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/form/company/AddCompanyProfileForm', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/form/company/AddCompanyInfoForm', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/form/company/AddCompanyReviewForm', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/form/shared/AddUserDoneForm', flags: ['web'] },
  // cico
  { name: 'net/nanopay/cico/model/ServiceProvider' },
  { name: 'net/nanopay/cico/model/TransactionStatus' },
  { name: 'net/nanopay/cico/model/TransactionType' },
  { name: 'net/nanopay/cico/model/Transaction' },
  { name: 'net/nanopay/cico/service/BankAccountVerifier' },
  { name: 'net/nanopay/cico/service/ClientBankAccountVerifierService' },
  { name: 'net/nanopay/cico/ui/bankAccount/AddBankView', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/bankAccount/BankAccountsView', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/bankAccount/BankCTACard', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/bankAccount/form/BankCashoutForm', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/bankAccount/form/BankDoneForm', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/bankAccount/form/BankForm', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/bankAccount/form/BankInfoForm', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/bankAccount/form/BankVerificationForm', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/bankAccount/ManageAccountModal', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/CicoView', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/AlternaEFTDownload', flags: ['web'] },
  { name: 'net/nanopay/cico/spi/alterna/AlternaFormat' },
  { name: 'net/nanopay/cico/spi/alterna/SFTPService' },
  { name: 'net/nanopay/cico/spi/alterna/AlternaSFTPService' },
  { name: 'net/nanopay/cico/spi/alterna/client/ClientAlternaSFTPService' },

  // invite
  { name: 'net/nanopay/admin/model/Question' },
  { name: 'net/nanopay/admin/model/Questionnaire' },
  { name: 'net/nanopay/invite/ui/InvitationDetailView', flags: ['web'] },
  { name: 'net/nanopay/invite/ui/InvitationHistoryItemView', flags: ['web'] },
  { name: 'net/nanopay/invite/ui/InvitationHistoryView', flags: ['web'] },
  { name: 'net/nanopay/invite/ui/InvitationItemView', flags: ['web'] },
  { name: 'net/nanopay/invite/ui/AccountStatusHistoryItemView', flags: ['web']},
  { name: 'net/nanopay/invite/ui/ComplianceStatusHistoryItemView', flags: ['web']},
  { name: 'net/nanopay/invite/ui/DocumentStatusHistoryItemView', flags: ['web'] },
  { name: 'net/nanopay/invite/ui/QuestionView', flags: ['web'] },
  { name: 'net/nanopay/invite/ui/QuestionnaireView', flags: ['web'] },
  { name: 'net/nanopay/invite/InvitationTokenService' },

  // invoice
  { name: 'net/nanopay/invoice/model/Invoice'},
  { name: 'net/nanopay/invoice/model/RecurringInvoice'},
  { name: 'net/nanopay/invoice/ui/ExpensesView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/SalesView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/InvoiceDashboardView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/PayableSummaryView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/ReceivableSummaryView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/MentionsView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/SummaryCard', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/shared/ActionInterfaceButton', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/shared/SingleItemView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/shared/SingleSubscriptionView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/BillDetailView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/InvoiceDetailView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/ExpensesDetailView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/SalesDetailView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/SubscriptionView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/SubscriptionEditView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/SubscriptionDetailView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/SubscriptionInvoiceView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/InvoiceFileView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/InvoiceFileUploadView', flags: ['web'] },

  // settings
  { name: 'net/nanopay/settings/autoCashout/AutoCashoutSettingsView', flags: ['web'] },
  // { name: 'net/nanopay/settings/business/BusinessSettingsView', flags: ['web'] },
  { name: 'net/nanopay/settings/business/BusinessHoursView', flags: ['web'] },
  { name: 'net/nanopay/settings/business/BusinessSettingsCard', flags: ['web'] },
  { name: 'net/nanopay/settings/business/BusinessProfileView', flags: ['web'] },
  { name: 'net/nanopay/settings/business/EditBusinessView', flags: ['web'] },
  { name: 'net/nanopay/settings/PersonalProfileView', flags: ['web'] },
  { name: 'net/nanopay/settings/PreferenceView', flags: ['web'] },
  { name: 'net/nanopay/settings/MultiUserManagementView', flags: ['web'] },
  { name: 'net/nanopay/settings/IntegrationView', flags: ['web'] },

  // bank
  { name: 'net/nanopay/bank/ui/BankView', flags: ['web'] },
  { name: 'net/nanopay/bank/ui/BankDetailView', flags: ['web'] },
  { name: 'net/nanopay/bank/ui/BalanceAlertView', flags: ['web'] },
  { name: 'net/nanopay/bank/ui/DashboardView', flags: ['web'] },

  // style
  { name: 'net/nanopay/invoice/ui/styles/InvoiceStyles', flags: ['web'] },
  { name: 'net/nanopay/ui/modal/ModalStyling', flags: ['web'] },
  { name: 'net/nanopay/ui/modal/ExportModal', flags: ['web'] },
  { name: 'net/nanopay/ui/styles/AppStyles', flags: ['web'] },

  // history
  { name: 'net/nanopay/ui/history/InvoiceHistoryView', flags: [ 'web' ] },
  { name: 'net/nanopay/ui/history/InvoiceHistoryItemView', flags: [ 'web' ] },

  // modal
  { name: 'net/nanopay/invoice/ui/modal/ApproveModal', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/modal/DisputeModal', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/modal/PayNowModal', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/modal/ScheduleModal', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/modal/RecordPaymentModal', flags: ['web'] },
  { name: 'net/nanopay/ui/modal/EmailModal', flags: ['web'] },
  { name: 'net/nanopay/ui/modal/ModalHeader', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/ci/ConfirmCashInModal', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/co/ConfirmCashOutModal', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/ci/CashInModal', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/co/CashOutModal', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/ci/CashInSuccessModal', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/co/CashOutSuccessModal', flags: ['web'] },

  //util
  { name: 'net/nanopay/util/AddCommaFormatter' },
  { name: 'net/nanopay/util/FormValidation' },
  { name: 'net/nanopay/util/CurrencyFormatter' },
  { name: 'net/nanopay/util/Iso20022' },

  //transfer
  { name: 'net/nanopay/ui/transfer/TransferWizard', flags: ['web'] },
  { name: 'net/nanopay/ui/transfer/TransferReview', flags: ['web'] },
  { name: 'net/nanopay/ui/transfer/TransferDetails', flags: ['web'] },
  { name: 'net/nanopay/ui/transfer/TransferAmount', flags: ['web'] },
  { name: 'net/nanopay/ui/transfer/TransferComplete', flags: ['web'] },
  { name: 'net/nanopay/ui/transfer/TransferView', flags: ['web'] },
  { name: 'net/nanopay/ui/transfer/TransferUserCard', flags: ['web'] },
  { name: 'net/nanopay/ui/transfer/FixedFloatView', flags: ['web'] },

  //ui
  { name: 'net/nanopay/ui/topNavigation/BusinessLogoView', flags: ['web'] },
  { name: 'net/nanopay/ui/topNavigation/NoMenuTopNav', flags: ['web'] },
  { name: 'net/nanopay/ui/topNavigation/SubMenuBar', flags: ['web'] },
  { name: 'net/nanopay/ui/topNavigation/TopNav', flags: ['web'] },
  { name: 'net/nanopay/ui/topNavigation/UserTopNavView', flags: ['web'] },
  { name: 'net/nanopay/ui/FooterView', flags: ['web'] },
  { name: 'net/nanopay/ui/ActionButton', flags: ['web'] },
  { name: 'net/nanopay/ui/Placeholder', flags: ['web'] },
  { name: 'net/nanopay/ui/TransferView', flags: ['web'] },
  { name: 'net/nanopay/ui/CCTransferView', flags: ['web'] },
  { name: 'net/nanopay/ui/ActionView', flags: ['web'] },
  { name: 'net/nanopay/ui/Controller', flags: ['web'] },
  { name: 'net/nanopay/model/Relationships'},
  { name: 'net/nanopay/ui/CountdownView', flags: ['web'] },
  //s2h
  { name: 'net/nanopay/s2h/model/S2HInvoice'},
  //Institution
  { name: 'net/nanopay/model/Institution' }
]);
