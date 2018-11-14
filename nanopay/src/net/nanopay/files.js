FOAM_FILES([
  // Payment
  { name: 'net/nanopay/tx/TxnProcessor' },
  { name: 'net/nanopay/tx/FeeTransfer' },
  { name: 'net/nanopay/tx/DigitalTransaction' },
  { name: 'net/nanopay/tx/TxnProcessorUserReference' },
  { name: 'net/nanopay/payment/Institution' },
  { name: 'net/nanopay/payment/InstitutionPurposeCode' },
  { name: 'net/nanopay/account/Account' },
  { name: 'net/nanopay/account/Balance' },
  { name: 'net/nanopay/account/DigitalAccount' },
  { name: 'net/nanopay/account/DigitalAccountInfo' },
  { name: 'net/nanopay/account/DigitalAccountServiceInterface' },
  { name: 'net/nanopay/account/ClientDigitalAccountService' },
  { name: 'net/nanopay/account/ZeroAccount' },
  { name: 'net/nanopay/account/ZeroAccountUserAssociation' },
  { name: 'net/nanopay/account/TrustAccount' },
  { name: 'net/nanopay/account/LossesAccount' },
  { name: 'net/nanopay/account/HoldingAccount' },
  { name: 'net/nanopay/account/AuthenticatedAccountDAOTest' },
  { name: 'net/nanopay/tx/BalanceAdapterAccountDAO' },
  { name: 'net/nanopay/model/Branch' },
  { name: 'net/nanopay/model/ClientUserJunction' },
  { name: 'net/nanopay/tx/Transfer' },
  { name: 'net/nanopay/tx/AcceptAware' },
  { name: 'net/nanopay/bank/BankAccount' },
  { name: 'net/nanopay/bank/CABankAccount' },
  { name: 'net/nanopay/bank/USBankAccount' },
  { name: 'net/nanopay/bank/INBankAccount' },
  { name: 'net/nanopay/bank/BankAccountStatus' },
  { name: 'net/nanopay/bank/BankAccountController', flags: ['web'] },
  { name: 'net/nanopay/bank/CanReceiveCurrency' },
  { name: 'net/nanopay/bank/ui/BankAccountSelectionView', flags: ['web'] },
  { name: 'net/nanopay/bank/ui/BankAccountCitationView', flags: ['web'] },
  { name: 'net/nanopay/model/Currency' },
  { name: 'net/nanopay/model/BusinessSector' },
  { name: 'net/nanopay/model/BusinessType' },
  { name: 'net/nanopay/model/PadAccount' },
  { name: 'net/nanopay/model/PadCapture' },
  { name: 'net/nanopay/model/DateAndPlaceOfBirth' },
  { name: 'net/nanopay/model/Identification' },
  { name: 'net/nanopay/model/Invitation' },
  { name: 'net/nanopay/model/InvitationStatus' },
  { name: 'net/nanopay/bank/BankHoliday' },
  { name: 'net/nanopay/admin/model/ComplianceStatus' },
  { name: 'net/nanopay/admin/model/AccountStatus' },
  { name: 'net/nanopay/model/User' },
  { name: 'net/nanopay/model/AppConfig' },
  { name: 'net/nanopay/ui/wizard/WizardCssAxiom', flags: ['web'] },
  { name: 'net/nanopay/ui/wizard/WizardView', flags: ['web'] },
  { name: 'net/nanopay/auth/ClientAuthService', flags: ['web'] },
  { name: 'net/nanopay/auth/AuthServiceClientBox', flags: ['web'] },
  { name: 'net/nanopay/auth/email/EmailTokenService' },
  { name: 'net/nanopay/auth/ExternalInvoiceTokenService' },
  { name: 'net/nanopay/auth/sms/PhoneVerificationTokenService', flags: ['web'] },
  { name: 'net/nanopay/auth/ui/SignUpView', flags: ['web'] },
  { name: 'net/nanopay/auth/ui/SignInView', flags: ['web'] },
  { name: 'net/nanopay/auth/ui/UserDetailView', flags: ['web'] },
  { name: 'net/nanopay/auth/ui/UserTableView', flags: ['web'] },
  { name: 'net/nanopay/auth/ui/UserCitationView', flags: ['web'] },
  { name: 'net/nanopay/auth/ui/UserSelectionView', flags: ['web'] },
  { name: 'net/nanopay/auth/ProxyAgentAuthService', flags: ['web'] },
  { name: 'net/nanopay/auth/BusinessAgentAuthService', flags: ['web'] },
  { name: 'net/nanopay/auth/BusinessAuthService', flags: ['web'] },
  { name: 'net/nanopay/ui/wizard/WizardOverview', flags: ['web'] },
  { name: 'net/nanopay/ui/wizard/WizardSubView', flags: ['web'] },
  { name: 'net/nanopay/ui/NotificationActionCard', flags: ['web'] },
  { name: 'net/nanopay/ui/ContentCard', flags: ['web'] },
  { name: 'net/nanopay/ui/BusinessCard', flags: ['web'] },
  { name: 'net/nanopay/ui/RadioView', flags: ['web'] },
  { name: 'net/nanopay/ui/ToggleSwitch', flags: ['web'] },
  { name: 'net/nanopay/ui/LoadingSpinner', flags: ['web'] },
  { name: 'net/nanopay/ui/PostalCodeFormat', flags: ['web'] },
  { name: 'net/nanopay/ui/BalanceView', flags: ['web'] },
  { name: 'net/nanopay/ui/ExpandContainer', flags: ['web'] },

  // onboarding
  { name: 'net/nanopay/onboarding/b2b/ui/B2BOnboardingWizard', flags: ['web'] },
  { name: 'net/nanopay/onboarding/b2b/ui/SaveAndLogOutModal', flags: ['web'] },
  { name: 'net/nanopay/onboarding/b2b/ui/BusinessProfileForm', flags: ['web'] },
  { name: 'net/nanopay/onboarding/b2b/ui/AddPrincipalOwnersForm', flags: ['web'] },
  { name: 'net/nanopay/onboarding/b2b/ui/QuestionnaireForm', flags: ['web'] },
  { name: 'net/nanopay/onboarding/b2b/ui/ConfirmAdminInfoForm', flags: ['web'] },
  { name: 'net/nanopay/onboarding/b2b/ui/NextStepView', flags: ['web'] },
  { name: 'net/nanopay/onboarding/b2b/ui/ProfileSubmittedForm', flags: ['web'] },
  { name: 'net/nanopay/onboarding/b2b/ui/ReviewAndSubmitForm', flags: ['web'] },
  { name: 'net/nanopay/onboarding/b2b/ui/UploadAdditionalDocumentsView', flags: ['web'] },
  { name: 'net/nanopay/onboarding/b2b/ui/ViewSubmittedProfileView', flags: ['web'] },
  { name: 'net/nanopay/onboarding/b2b/ui/ViewSubmittedRegistrationView', flags: ['web'] },
  { name: 'net/nanopay/onboarding/b2b/ui/AdditionalDocumentsUploadView', flags: ['web'] },
  { name: 'net/nanopay/onboarding/b2b/ui/PasswordChangeForm', flags: ['web'] },
  { name: 'net/nanopay/onboarding/model/Question' },
  { name: 'net/nanopay/onboarding/model/Questionnaire' },
  { name: 'net/nanopay/onboarding/InvitationTokenService' },
  { name: 'net/nanopay/onboarding/FirebaseInvitationTokenService' },

  // fx
  { name: 'net/nanopay/fx/ExchangeRateStatus' },
  { name: 'net/nanopay/fx/ExchangeRate' },
  { name: 'net/nanopay/fx/DeliveryTimeFields' },
  { name: 'net/nanopay/fx/ExchangeRateFields' },
  { name: 'net/nanopay/fx/FeesFields' },
  { name: 'net/nanopay/fx/ExchangeRateQuote' },
  { name: 'net/nanopay/fx/FixerIOExchangeRate' },
  { name: 'net/nanopay/fx/ExchangeRateInterface' },

  { name: 'net/nanopay/fx/client/ClientFXService' },
  { name: 'net/nanopay/fx/FXService' },
  { name: 'net/nanopay/fx/FXAccepted' },
  { name: 'net/nanopay/fx/FXDirection' },
  { name: 'net/nanopay/fx/GetFXQuote' },
  { name: 'net/nanopay/fx/AcceptFXRate' },
  { name: 'net/nanopay/fx/FXQuote' },
  { name: 'net/nanopay/fx/FXTransaction' },
  { name: 'net/nanopay/fx/FXTransfer' },
  { name: 'net/nanopay/fx/Corridor' },
  { name: 'net/nanopay/fx/FXProvider' },

  // ascendant fx
  { name: 'net/nanopay/fx/ascendantfx/AscendantFX' },
  { name: 'net/nanopay/fx/ascendantfx/AscendantFXUser' },
  { name: 'net/nanopay/fx/ascendantfx/AscendantFXTransaction' },
  { name: 'net/nanopay/fx/ascendantfx/AscendantFXTransactionPlanDAO' },
  { name: 'net/nanopay/fx/ascendantfx/AscendantFXCOTransaction' },

  // interac
  //{ name: 'net/nanopay/fx/interac/model/PayoutOptions' },
  { name: 'net/nanopay/fx/interac/model/RequiredAccountFields' },
  { name: 'net/nanopay/fx/interac/model/RequiredAddressFields' },
  { name: 'net/nanopay/fx/interac/model/RequiredAgentFields' },
  { name: 'net/nanopay/fx/interac/model/RequiredDocumentFields' },
  { name: 'net/nanopay/fx/interac/model/RequiredIdentificationFields' },
  { name: 'net/nanopay/fx/interac/model/RequiredUserFields' },

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

  // sps
  { name: 'net/nanopay/sps/SPSConfig' },

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
  { name: 'net/nanopay/tx/model/TransactionFee' },
  { name: 'net/nanopay/tx/model/TransactionStatus' },
  { name: 'net/nanopay/tx/model/TransactionEntity' },
  { name: 'net/nanopay/tx/model/Transaction' },
  { name: 'net/nanopay/tx/RefundTransaction' },
  { name: 'net/nanopay/tx/RetailTransaction' },
  { name: 'net/nanopay/tx/model/TransactionLimit' },
  { name: 'net/nanopay/tx/model/TransactionLimitTimeFrame' },
  { name: 'net/nanopay/tx/model/TransactionLimitType' },
  { name: 'net/nanopay/tx/TransactionPurpose' },
  { name: 'net/nanopay/tx/UserTransactionLimit' },
  { name: 'net/nanopay/tx/model/LiquidityAuth' },
  { name: 'net/nanopay/tx/PayeeTransactionDAO' },
  { name: 'net/nanopay/tx/ErrorTransaction' },
  { name: 'net/nanopay/tx/TransactionQuote' },
  { name: 'net/nanopay/tx/TransactionQuotes' },
  { name: 'net/nanopay/tx/TransactionQuoteDAO' },

  // tx tests
  { name: 'net/nanopay/tx/model/TransactionParseTest' },

  { name: 'net/nanopay/model/Broker' },

  { name: 'net/nanopay/tx/ui/TransactionsView', flags: ['web'] },
  { name: 'net/nanopay/tx/ui/TransactionDetailView', flags: ['web'] },
  { name: 'net/nanopay/tx/ui/SingleItemView', flags: ['web'] },
  { name: 'net/nanopay/tx/ui/CurrencyChoice', flags: ['web'] },

  { name: 'net/nanopay/util/ChallengeGenerator' },

  // retail
  { name: 'net/nanopay/retail/model/DeviceType' },
  { name: 'net/nanopay/retail/model/DeviceStatus' },
  { name: 'net/nanopay/retail/model/Device' },
  { name: 'net/nanopay/retail/model/P2PTxnRequestStatus' },
  { name: 'net/nanopay/retail/model/P2PTxnRequest' },

  { name: 'net/nanopay/retail/ui/devices/DeviceCTACard', flags: ['web'] },
  { name: 'net/nanopay/retail/ui/devices/DevicesView', flags: ['web'] },
  { name: 'net/nanopay/retail/ui/devices/ManageDeviceModal', flags: ['web'] },
  { name: 'net/nanopay/retail/ui/devices/form/DeviceForm', flags: ['web'] },
  { name: 'net/nanopay/retail/ui/devices/form/DeviceNameForm', flags: ['web'] },
  { name: 'net/nanopay/retail/ui/devices/form/DeviceTypeForm', flags: ['web'] },
  { name: 'net/nanopay/retail/ui/devices/form/DeviceSerialForm', flags: ['web'] },
  { name: 'net/nanopay/retail/ui/devices/form/DevicePasswordForm', flags: ['web'] },

  // merchant
  { name: 'net/nanopay/merchant/ui/AboutView', flags: ['web'] },
  { name: 'net/nanopay/merchant/ui/AppStyles', flags: ['web'] },
  { name: 'net/nanopay/merchant/ui/Controller', flags: ['web'] },
  { name: 'net/nanopay/merchant/ui/ErrorMessage', flags: ['web'] },
  { name: 'net/nanopay/merchant/ui/ErrorView', flags: ['web'] },
  { name: 'net/nanopay/merchant/ui/HomeView', flags: ['web'] },
  { name: 'net/nanopay/merchant/ui/KeyboardView', flags: ['web'] },
  { name: 'net/nanopay/merchant/ui/QRCodeView', flags: ['web'] },
  { name: 'net/nanopay/merchant/ui/RefundView', flags: ['web'] },
  { name: 'net/nanopay/merchant/ui/SuccessView', flags: ['web'] },
  { name: 'net/nanopay/merchant/ui/ToolbarView', flags: ['web'] },
  { name: 'net/nanopay/merchant/ui/setup/SetupInputView', flags: ['web'] },
  { name: 'net/nanopay/merchant/ui/setup/SetupSuccessView', flags: ['web'] },
  { name: 'net/nanopay/merchant/ui/setup/SetupView', flags: ['web'] },
  { name: 'net/nanopay/merchant/ui/transaction/EmptyTransactionListView', flags: ['web'] },
  { name: 'net/nanopay/merchant/ui/transaction/TransactionDetailView', flags: ['web'] },
  { name: 'net/nanopay/merchant/ui/transaction/TransactionListView', flags: ['web'] },
  { name: 'net/nanopay/merchant/ui/transaction/TransactionRowView', flags: ['web'] },

  // admin
  { name: 'net/nanopay/admin/ui/AccountRevokedView', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/ActivateProfileModal', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/AddBusinessView', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/AddMerchantView', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/AddCompanyView', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/AddShopperView', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/DisableProfileModal', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/EditBusinessView', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/ResendInviteModal', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/ReviewProfileView', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/RevokeInviteModal', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/SendMoneyView', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/SubMenu', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/TransactionView', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/UserDetailView', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/UserItemView', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/UserView', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/ApiBrowser', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/OverviewView', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/SampleRequestView', flags: ['web'] },
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
  { name: 'net/nanopay/admin/ui/history/UserHistoryItemView', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/history/UserHistoryView', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/history/AccountStatusHistoryItemView', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/history/ComplianceStatusHistoryItemView', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/history/DocumentStatusHistoryItemView', flags: ['web'] },
  { name: 'net/nanopay/admin/ui/history/InviteAttemptsHistoryItemView', flags: ['web'] },

  { name: 'net/nanopay/cico/model/EFTReturnFileCredentials' },
  { name: 'net/nanopay/cico/service/BankAccountVerifier' },
  { name: 'net/nanopay/cico/service/ClientBankAccountVerifierService' },
  { name: 'net/nanopay/cico/ui/bankAccount/AddBankView', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/bankAccount/BankAccountsView', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/bankAccount/BankCTACard', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/bankAccount/form/BankCashoutForm', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/bankAccount/form/BankDoneForm', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/bankAccount/form/BankForm', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/bankAccount/form/BankInfoForm', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/bankAccount/form/BankPadAuthorization', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/bankAccount/form/BankVerificationForm', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/bankAccount/ManageAccountModal', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/CicoView', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/AlternaEFTDownload', flags: ['web'] },
  { name: 'net/nanopay/tx/cico/CITransaction' },
  { name: 'net/nanopay/tx/ETALineItem' },
  { name: 'net/nanopay/tx/ExpiryLineItem' },
  { name: 'net/nanopay/tx/FeeLineItem' },
  { name: 'net/nanopay/tx/InfoLineItem' },
  { name: 'net/nanopay/tx/TransactionLineItem' },
  { name: 'net/nanopay/fx/FXLineItem' },
  { name: 'net/nanopay/fx/ascendantfx/AscendantFXFeeLineItem' },
  { name: 'net/nanopay/tx/BalanceHistory' },
  { name: 'net/nanopay/tx/cico/VerificationTransaction' },
  { name: 'net/nanopay/tx/cico/COTransaction' },
  { name: 'net/nanopay/tx/alterna/AlternaFormat' },
  { name: 'net/nanopay/tx/alterna/SFTPService' },
  { name: 'net/nanopay/tx/alterna/AlternaSFTPService' },
  { name: 'net/nanopay/tx/alterna/client/ClientAlternaSFTPService' },
  { name: 'net/nanopay/tx/alterna/AlternaCOTransaction' },
  { name: 'net/nanopay/tx/alterna/AlternaCITransaction' },
  { name: 'net/nanopay/tx/alterna/AlternaVerificationTransaction' },
  { name: 'net/nanopay/tx/alterna/AlternaTransactionPlanDAO' },
  { name: 'net/nanopay/tx/realex/RealexTransaction' },
  { name: 'net/nanopay/tx/stripe/StripeTransaction' },

  { name: 'net/nanopay/cico/paymentCard/model/PaymentCardNetwork' },
  { name: 'net/nanopay/cico/paymentCard/model/PaymentCardType' },
  { name: 'net/nanopay/cico/paymentCard/model/PaymentCard' },
  { name: 'net/nanopay/cico/paymentCard/model/RealexPaymentCard' },
  { name: 'net/nanopay/cico/paymentCard/model/StripePaymentCard' },
  { name: 'net/nanopay/cico/CICOPaymentType' },
  { name: 'net/nanopay/cico/model/PaymentAccountInfo' },
  { name: 'net/nanopay/cico/model/RealexPaymentAccountInfo' },
  { name: 'net/nanopay/cico/model/MobileWallet' },

  // invoice
  { name: 'net/nanopay/invoice/model/PaymentStatus' },
  { name: 'net/nanopay/invoice/model/InvoiceStatus' },
  { name: 'net/nanopay/invoice/model/Invoice' },
  { name: 'net/nanopay/invoice/model/RecurringInvoice' },
  { name: 'net/nanopay/invoice/ui/ExpensesView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/SalesView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/InvoiceDashboardView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/InvoiceSummaryView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/MentionsView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/SummaryCard', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/shared/ActionInterfaceButton', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/shared/SingleItemView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/shared/ForeignSingleItemView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/shared/SingleSubscriptionView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/InvoiceDetailView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/ExpensesDetailView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/SalesDetailView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/InvoiceRateView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/SubscriptionView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/SubscriptionEditView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/SubscriptionDetailView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/SubscriptionInvoiceView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/InvoiceFileView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/InvoiceFileUploadView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/PayableController', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/ReceivableController', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/history/InvoiceHistoryView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/history/InvoiceHistoryItemView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/history/InvoiceStatusHistoryItemView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/history/InvoiceReceivedHistoryItemView', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/history/InvoiceCreatedHistoryItemView', flags: ['web'] },
  { name: 'net/nanopay/invoice/notification/NewInvoiceNotification' },
  { name: 'net/nanopay/invoice/notification/NewInvoiceNotificationNotificationView', flags: ['web'] },
  { name: 'net/nanopay/invoice/notification/InvoicePaymentNotification' },
  { name: 'net/nanopay/invoice/notification/InvoicePaymentNotificationNotificationView', flags: ['web'] },

  // settings
  { name: 'net/nanopay/settings/autoCashout/AutoCashoutSettingsView', flags: ['web'] },
  { name: 'net/nanopay/settings/business/BusinessHoursView', flags: ['web'] },
  { name: 'net/nanopay/settings/business/EditPrincipalOwnersView', flags: ['web'] },
  { name: 'net/nanopay/settings/business/BusinessProfileView', flags: ['web'] },
  { name: 'net/nanopay/settings/business/PrincipalOwnersDetailView', flags: ['web'] },
  { name: 'net/nanopay/settings/business/EditBusinessView', flags: ['web'] },
  { name: 'net/nanopay/settings/business/EditBusinessProfileView', flags: ['web'] },
  { name: 'net/nanopay/settings/business/UserManagementView', flags: ['web'] },
  { name: 'net/nanopay/settings/PersonalProfileView', flags: ['web'] },
  { name: 'net/nanopay/settings/MultiUserManagementView', flags: ['web'] },
  { name: 'net/nanopay/settings/IntegrationView', flags: ['web'] },

  // auth
  { name: 'net/nanopay/security/auth/LoginAttemptAuthService' },

  // PII
  { name: 'net/nanopay/security/pii/PII' },
  { name: 'net/nanopay/security/pii/PIIReportGenerator' },
  { name: 'net/nanopay/security/pii/ViewPIIRequest' },
  { name: 'net/nanopay/security/pii/PIIRequestStatus' },
  { name: 'net/nanopay/security/pii/PIIDisplayStatus' },
  { name: 'net/nanopay/security/pii/PIIReportDownload' },
  { name: 'net/nanopay/security/pii/ApprovedPIIRequestDAO' },
  { name: 'net/nanopay/security/pii/PreventDuplicatePIIRequestsDAO' },
  { name: 'net/nanopay/security/pii/FreezeApprovedPIIRequestsDAO' },

  // security
  { name: 'net/nanopay/security/HexString' },
  { name: 'net/nanopay/security/HexStringArray' },
  { name: 'net/nanopay/security/EncryptedObject' },
  { name: 'net/nanopay/security/KeyStoreManager' },
  { name: 'net/nanopay/security/AbstractKeyStoreManager' },
  { name: 'net/nanopay/security/AbstractFileKeyStoreManager' },
  { name: 'net/nanopay/security/BKSKeyStoreManager' },
  { name: 'net/nanopay/security/JCEKSKeyStoreManager' },
  { name: 'net/nanopay/security/JKSKeyStoreManager' },
  { name: 'net/nanopay/security/PKCS11KeyStoreManager' },
  { name: 'net/nanopay/security/PKCS12KeyStoreManager' },
  { name: 'net/nanopay/security/csp/CSPViolation' },
  { name: 'net/nanopay/security/KeyPairEntry' },
  { name: 'net/nanopay/security/PublicKeyEntry' },
  { name: 'net/nanopay/security/PrivateKeyEntry' },
  { name: 'net/nanopay/security/KeyPairDAO' },
  { name: 'net/nanopay/security/PublicKeyDAO' },
  { name: 'net/nanopay/security/PrivateKeyDAO' },
  { name: 'net/nanopay/security/UserKeyPairGenerationDAO' },
  { name: 'net/nanopay/security/RandomNonceDAO' },
  { name: 'net/nanopay/security/KeyRight' },
  { name: 'net/nanopay/security/RightCondition' },
  { name: 'net/nanopay/security/Signature' },
  { name: 'net/nanopay/security/refinements' },
  { name: 'net/nanopay/security/PayerAssentTransactionDAO' },

  // receipt
  { name: 'net/nanopay/security/receipt/Receipt' },
  { name: 'net/nanopay/security/receipt/ReceiptGenerator' },
  { name: 'net/nanopay/security/receipt/TimedBasedReceiptGenerator' },
  { name: 'net/nanopay/security/receipt/ReceiptGeneratingDAO' },

  // security tests
  { name: 'net/nanopay/security/test/HashedJSONParserTest' },
  { name: 'net/nanopay/security/test/HashingJournalTest' },
  { name: 'net/nanopay/security/test/HashingOutputterTest' },
  { name: 'net/nanopay/security/test/HashingWriterTest' },
  { name: 'net/nanopay/security/test/LoginAttemptAuthServiceTest' },
  { name: 'net/nanopay/security/test/MerkleTreeHelperTest' },
  { name: 'net/nanopay/security/test/MerkleTreeTest' },
  { name: 'net/nanopay/security/test/PayerAssentTransactionDAOTest' },
  { name: 'net/nanopay/security/test/PKCS11KeyStoreManagerTest' },
  { name: 'net/nanopay/security/test/PKCS12KeyStoreManagerTest' },
  { name: 'net/nanopay/security/test/ReceiptGeneratingDAOTest' },
  { name: 'net/nanopay/security/test/ReceiptSerializationTest' },
  { name: 'net/nanopay/security/test/UserKeyPairGenerationDAOTest' },
  { name: 'net/nanopay/security/test/ViewPIIRequestDAOTest' },

  // password entropy
  { name: 'net/nanopay/sme/passwordutil/ClientPasswordEntropy' },
  { name: 'net/nanopay/sme/passwordutil/PasswordEntropy' },
  { name: 'net/nanopay/sme/passwordutil/PasswordStrengthCalculator' },

  // style
  { name: 'net/nanopay/invoice/ui/styles/InvoiceStyles', flags: ['web'] },
  { name: 'net/nanopay/ui/modal/ModalStyling', flags: ['web'] },
  { name: 'net/nanopay/ui/modal/ExportModal', flags: ['web'] },
  { name: 'net/nanopay/ui/styles/AppStyles', flags: ['web'] },

  // modal
  { name: 'net/nanopay/invoice/ui/modal/DisputeModal', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/modal/ScheduleModal', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/modal/RecordPaymentModal', flags: ['web'] },
  { name: 'net/nanopay/invoice/ui/modal/IntegrationModal', flags: ['web'] },
  { name: 'net/nanopay/ui/modal/EmailModal', flags: ['web'] },
  { name: 'net/nanopay/ui/modal/UploadModal', flags: ['web'] },
  { name: 'net/nanopay/ui/modal/ModalHeader', flags: ['web'] },
  { name: 'net/nanopay/ui/modal/TandCModal', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/ci/ConfirmCashInModal', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/co/ConfirmCashOutModal', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/ci/CashInModal', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/co/CashOutModal', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/ci/CashInSuccessModal', flags: ['web'] },
  { name: 'net/nanopay/cico/ui/co/CashOutSuccessModal', flags: ['web'] },
  { name: 'net/nanopay/partners/ui/modal/PartnerInviteModal', flags: ['web'] },

  // util
  { name: 'net/nanopay/util/AddCommaFormatter' },
  { name: 'net/nanopay/util/FormValidation' },
  { name: 'net/nanopay/util/CurrencyFormatter' },
  { name: 'net/nanopay/util/Iso20022' },

  // transfer
  { name: 'net/nanopay/ui/transfer/TransferWizard', flags: ['web'] },
  { name: 'net/nanopay/ui/transfer/TransferReview', flags: ['web'] },
  { name: 'net/nanopay/ui/transfer/TransferDetails', flags: ['web'] },
  { name: 'net/nanopay/ui/transfer/TransferAmount', flags: ['web'] },
  { name: 'net/nanopay/ui/transfer/TransferComplete', flags: ['web'] },
  { name: 'net/nanopay/ui/transfer/TransferView', flags: ['web'] },
  { name: 'net/nanopay/ui/transfer/TransferUserCard', flags: ['web'] },
  { name: 'net/nanopay/ui/transfer/FixedFloatView', flags: ['web'] },
  { name: 'net/nanopay/ui/transfer/PlanSelectionWizard', flags: ['web'] },

  // ui
  { name: 'net/nanopay/ui/topNavigation/BusinessLogoView', flags: ['web'] },
  { name: 'net/nanopay/ui/topNavigation/CurrencyChoiceView', flags: ['web'] },
  { name: 'net/nanopay/ui/topNavigation/NoMenuTopNav', flags: ['web'] },
  { name: 'net/nanopay/ui/topNavigation/SubMenuBar', flags: ['web'] },
  { name: 'net/nanopay/ui/topNavigation/TopNav', flags: ['web'] },
  { name: 'net/nanopay/ui/topNavigation/UserTopNavView', flags: ['web'] },
  { name: 'net/nanopay/ui/topNavigation/UserView', flags: ['web'] },
  { name: 'net/nanopay/ui/ActionButton', flags: ['web'] },
  { name: 'net/nanopay/ui/Placeholder', flags: ['web'] },
  { name: 'net/nanopay/ui/TransferView', flags: ['web'] },
  { name: 'net/nanopay/ui/CCTransferView', flags: ['web'] },
  { name: 'net/nanopay/ui/ActionView', flags: ['web'] },
  { name: 'net/nanopay/ui/Controller', flags: ['web'] },
  { name: 'net/nanopay/ui/CountdownView', flags: ['web'] },
  { name: 'net/nanopay/ui/AccountBalanceDashboard', flags: ['web'] },
  { name: 'net/nanopay/ui/NewPasswordView', flags: ['web'] },

  // partners
  { name: 'net/nanopay/partners/ui/PartnersView', flags: ['web'] },
  { name: 'net/nanopay/partners/ui/ContactCard', flags: ['web'] },
  { name: 'net/nanopay/partners/ui/ContactCardView', flags: ['web'] },
  { name: 'net/nanopay/partners/ui/PartnerInvitationNotification', flags: ['web'] },
  { name: 'net/nanopay/partners/ui/PartnerInvitationNotificationNotificationView', flags: ['web'] },
  { name: 'net/nanopay/auth/PublicUserInfo' },

  // contacts
  { name: 'net/nanopay/contacts/Contact' },
  { name: 'net/nanopay/contacts/ui/modal/ContactModal', flags: ['web'] },

  // sme
  { name: 'net/nanopay/model/Business' },
  { name: 'net/nanopay/sme/ui/MoneyFlowSuccessView', flags: ['web'] },
  { name: 'net/nanopay/sme/ui/dashboard/ActionObject' },
  { name: 'net/nanopay/sme/ui/dashboard/Dashboard', flags: ['web'] },
  { name: 'net/nanopay/sme/ui/dashboard/DashboardBorder', flags: ['web'] },
  { name: 'net/nanopay/sme/ui/dashboard/NotificationDashboardView' },
  { name: 'net/nanopay/sme/ui/dashboard/RequireActionView' },
  { name: 'net/nanopay/sme/ui/BalanceCard', flags: ['web'] },
  { name: 'net/nanopay/sme/ui/BalanceView', flags: ['web'] },
  { name: 'net/nanopay/sme/ui/dashboard/DynamicSixButtons', flags: ['web'] },
  { name: 'net/nanopay/sme/SMEController', flags: ['web'] },
  { name: 'net/nanopay/sme/ui/SignInView', flags: ['web'] },
  { name: 'net/nanopay/sme/ui/SignUpView', flags: ['web'] },
  { name: 'net/nanopay/sme/ui/SplitBorder', flags: ['web'] },
  { name: 'net/nanopay/sme/ui/SMEStyles', flags: ['web'] },
  { name: 'net/nanopay/sme/ui/DeleteBankAccountModal', flags: ['web'] },
  { name: 'net/nanopay/contacts/ContactController', flags: ['web'] },
  { name: 'net/nanopay/sme/ui/InvoiceOverview', flags: ['web'] },
  { name: 'net/nanopay/sme/ui/InvoiceRowView', flags: ['web'] },
  { name: 'net/nanopay/sme/ui/SendRequestMoney', flags: ['web'] },
  { name: 'net/nanopay/sme/ui/SendRequestMoneyDetails', flags: ['web'] },
  { name: 'net/nanopay/sme/ui/SendRequestMoneyReview', flags: ['web'] },
  { name: 'net/nanopay/sme/ui/Payment', flags: ['web'] },
  { name: 'net/nanopay/sme/ui/UploadFileModal', flags: ['web'] },
  { name: 'net/nanopay/sme/ui/NewInvoiceForm', flags: ['web'] },
  { name: 'net/nanopay/sme/ui/InvoiceDetails', flags: ['web'] },
  { name: 'net/nanopay/sme/ui/CurrencyChoice', flags: ['web'] },
  { name: 'net/nanopay/sme/ui/AddressView', flags: ['web'] },
  { name: 'net/nanopay/sme/ui/BusinessSettingsView', flags: ['web'] },
  { name: 'net/nanopay/sme/ui/CompanyInformationView', flags: ['web'] },

  // relationships
  { name: 'net/nanopay/model/Relationships' },
  { name: 'net/nanopay/security/Relationships' },

  // tests
  { name: 'net/nanopay/test/DateAndPlaceOfBirthDAOTest' },
  { name: 'net/nanopay/test/BranchDAOTest' },
  { name: 'net/nanopay/test/BusinessSectorDAOTest' },

  { name: 'net/nanopay/test/ModelledTest' },
  { name: 'net/nanopay/auth/PublicUserInfoDAOTest' },
  { name: 'net/nanopay/auth/ExternalInvoiceTokenTest' },
  { name: 'net/nanopay/invoice/AuthenticatedInvoiceDAOTest' },
  { name: 'net/nanopay/invoice/model/InvoiceTest' },
  { name: 'net/nanopay/test/TestsReporter' },
  { name: 'net/nanopay/test/TestReport' },
  { name: 'net/nanopay/tx/alterna/test/EFTTest' },

  // iso20022
  { name: 'net/nanopay/iso20022/ISODateTest' },
  { name: 'net/nanopay/iso20022/ISODateTimeTest' },
  { name: 'net/nanopay/iso20022/ISOTimeTest' },

  // sme
  { name: 'net/nanopay/sme/ui/NavigationView', flags: ['web'] },
  { name: 'net/nanopay/sme/ui/SideNavigationView', flags: ['web'] },
  { name: 'net/nanopay/sme/ui/TopNavigationView', flags: ['web'] },
  { name: 'net/nanopay/sme/ui/AccountProfileView', flags: ['web'] },
  { name: 'net/nanopay/sme/ui/QuickActionView', flags: ['web'] },

  // xero
  { name: 'net/nanopay/integration/xero/TokenStorage' },
  { name: 'net/nanopay/integration/xero/XeroConfig' },
  { name: 'net/nanopay/integration/xero/model/XeroInvoice' },
  { name: 'net/nanopay/integration/xero/model/XeroContact' },

  // integration stub
  { name: 'net/nanopay/integration/ResultResponse' },
  { name: 'net/nanopay/integration/IntegrationService' },
  { name: 'net/nanopay/integration/ClientIntegrationService' },
  { name: 'net/nanopay/integration/xero/XeroIntegrationService' },
  { name: 'net/nanopay/integration/AccountingIntegrationTrait' }

]);
