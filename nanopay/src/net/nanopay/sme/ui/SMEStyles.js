foam.CLASS({
  package: 'net.nanopay.sme.ui',
  name: 'SMEStyles',
  extends: 'foam.u2.View',

  documentation: 'SME CSS that is used through out',

  css: `
    .label, .infoLabel {
      font-size: 12px !important;
      color: /*%BLACK%*/ #1e1f21 !important;
      padding-bottom: 6px !important;
      font-weight: 400 !important;
      display: block !important;
    }
    .sme-inputContainer {
      margin-top: 1%;
    }
    body {
      font-family: 'Lato', sans-serif;
    }
    .stack-wrapper {
      height: 100%;
      padding: 0;
    }
    .full-screen {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh !important;
      width: 100vw !important;
      z-index: 950;
      margin: 0 !important;
      padding: 0 !important;
    }
    .app-link {
      margin-left: 5px;
      color: #604aff;
      cursor: pointer;
    }
    .cover-img-block {
      margin: 50px;
      margin-left: 0px;
      margin-top: 0px;
      width: 38vw;
    }
    .sme-image {
      display: inline-block;
      width: 100%;
      margin-top: 20vh;
    }
    .sme-text-block {
      top: 20%;
      left: 25%;
      position: absolute;
    }
    .forgot-link {
      margin-left: 0px;
      color: #604aff;
      cursor: pointer;
      text-align: center;
    }
    .sme-noselect {
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none; /* Non-prefixed version, currently
                            supported by Chrome and Opera */
    }
    .foam-u2-search-TextSearchView input {
      background-image: url("images/ic-search.svg");
      background-repeat: no-repeat;
      background-position: 8px;
      border-radius: 2px;
      border: 1px solid #dce0e7;
      color: /*%BLACK%*/ #1e1f21;
      font-size: 14px;
      height: 40px;
      padding: 0 21px 0 38px;
    }
    .foam-u2-stack-StackView {
      height: 100%;
      width: 100%;
    }

    input {
      border: solid 1px #8e9090;
      border-radius: 3px;
      padding: 12px;
      font-size: 14px;
      font-family: 'Lato', sans-serif;
    }

    input:focus {
      border: solid 1px #604aff;
    }

    /* Modal windows */

    .foam-u2-dialog-Popup-inner {
      box-shadow: 0 24px 24px 0 rgba(0, 0, 0, 0.12), 0 0 24px 0 rgba(0, 0, 0, 0.15);
      border-radius: 3px;
      overflow: hidden;
    }

    .container {
      width: 510px !important;
    }

    .innerContainer {
      padding: 24px;
      margin: 0px !important;
      width: auto !important;
    }

    .popUpHeader {
      background: #fff !important;
      color: /*%BLACK%*/ #1e1f21 !important;
      padding: 24px 24px 16px 24px !important;
      width: auto !important;
      height: auto !important;
    }

    .popUpTitle {
      font-weight: 900 !important;
      font-size: 24px !important;
      color: /*%BLACK%*/ #1e1f21 !important;
      margin: 0px !important;
    }

    .styleMargin {
      background: #fafafa;
      overflow: hidden;
      margin-top: 0 !important;
      padding: 24px !important;
    }

    .foam-u2-ActionView-addButton,
    .foam-u2-ActionView-saveButton {
      float: right;
      margin-bottom: 0px !important;
      width: 135px !important;
    }

    .foam-u2-ActionView-closeButton {
      margin-right: 0px !important;
    }

    .checkbox-label {
      font-size: 16px;
    }

    /* Sidebar */

    .sme-sidenav-item-wrapper,
    .sme-quick-action-wrapper {
      border-left: 4px solid #fff;
      font-weight: normal;
    }

    .sme-sidenav-item-wrapper:hover,
    .sme-quick-action-wrapper:hover,
    .active-menu {
      background: #f3f2ff;
      cursor: pointer;
      border-left: 4px solid #604aff;
      color: #604aff;
      font-weight: 600;
    }

    /* Styles related to rich choice view */
    .net-nanopay-sme-SMEController .foam-u2-view-RichChoiceView {
      display: block;
    }

    .net-nanopay-sme-SMEController .foam-u2-view-RichChoiceView-container {
      border-radius: 4px;
      width: 100%;
      z-index: 1;
      -webkit-appearance: none;
    }

    .net-nanopay-sme-SMEController .foam-u2-view-RichChoiceView-heading {
      font-weight: bold;
      border-bottom: 1px solid #f4f4f9;
      line-height: 24px;
      font-size: 14px;
      color: #333;
      font-weight: 900;
      padding: 6px 16px;
    }

    .carrot {
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 5px solid white;
      display: inline-block;
      position: relative;
      top: -2;
      left: 5;
    }

    .net-nanopay-sme-SMEController .foam-u2-view-RichChoiceView-selection-view {
      min-height: 40px;
      width: 100%;
      border-radius: 4px;
      background-color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 8px;
      font-size: 14px;
      box-sizing: border-box;
      margin-bottom: 4px;
      -webkit-appearance: none;
      cursor: pointer;
    }

    .net-nanopay-sme-SMEController .foam-u2-view-RichChoiceView-chevron::before {
      color: #bdbdbd;
      font-size: 17px;
      padding-left: 8px;
    }

    h1 {
      font-weight: 900;
      font-size: 32px;
    }

    h2 {
      font-weight: 700;
      font-size: 24px;
      line-height: 36px;
    }

    /* Containers */

    .half-container {
      width: 47%;
      display: inline-block;
    }
    .left-of-container {
      margin-right: 29px;
    }

    /* Inputs */

    .input-label {
      padding-bottom: 8px;
      font-weight: 400;
      font-size: 12px;
    }

    .input-wrapper {
      margin-top: 16px;
    }

    .input-field-wrapper {
      position: relative;
    }

    .input-double-left {
      display: inline-block;
      width: calc((100% - 2%) / 2);
    }
    .input-double-right {
      display: inline-block;
      width: calc((100% - 2%) / 2);
      margin-left: 2%;
    }

    .foam.u2.tag.TextArea {
      width: 100%;
      font-size: 14px;
      height: 40px;
      border: solid 1px #8e9090;
      border-radius: 3px;
      padding: 12px;
    }

    .sme-half-field {
      height: 40px;
      width: 100%;
      font-size: 14px;
      border-radius: 4px;
    }
    .sme-full-field {
      height: 40px;
      width: 100%;
      font-size: 14px;
      border-radius: 4px;
    }

    .block {
      width: 100% !important;
    }
    .login {
      margin-top: 24px !important;
    }
    /* specifically overriding the action but intenet is only for SignIn/Up: TODO remove AbliiActionView*/
    .net-nanopay-sme-ui-AbliiActionView-login {
      width: 100%;
    }
    .sme-title {
      font-size: 32px;
      line-height: 1.5;
      letter-spacing: 0.5px;
      text-align: left;
      color: #353535;
      margin-bottom: 24px;
      font-weight: 900;
    }
    .sme-subTitle {
      font-size: 14px;
      letter-spacing: 0.5px;
      text-align: center;
      color: #093400;
      font-weight: 300;
      margin-bottom: 15px;
      margin-top: 16px;
      line-height: 24px;
    }

    /* Buttons Reference the following component style guide: https://app.zeplin.io/project/5bea24519befb87e8387dec8/screen/5bea260ad4ba093cf835ae49 */
    /*
     * FIXME: This should have been its own component, not a global CSS style.
     * Then we wouldn't have needed all of these !importants to override the
     * default ActionView styles.
     */
    .white-radio {
      /* The line below is required as a side effect of the radios being Actions. They shouldn't be actions. */
      justify-content: flex-start !important;
      text-align: left !important;
      text-indent: 50px;
      width: 225px !important;
      height: 44px !important;
      border: 1px solid #8e9090 !important;
      border-radius: 4px !important;
      box-shadow: 0 1px 0 0 rgba(22, 29, 37, 0.05) !important;
      background-repeat: no-repeat;
      background-position-x: 25px;
      background-position-y: 13px;
      background-image: url(images/ablii/radio-resting.svg);
      color: /*%BLACK%*/ #1e1f21 !important;
      background-color: white !important;
      font-size: 16px !important;
      font-family: 'Lato', sans-serif;
    }
    .white-radio.selected {
      border: 1px solid /*%PRIMARY3%*/ #406dea !important;
      background-image: url(images/ablii/radio-active.svg);
    }
    .white-radio:disabled {
      border: 1px solid #e2e2e3 !important;
      color: #8e9090 !important;
    }

    /* Link */

    .sme.link {
      font-size: 16px;
      font-weight: 500;
      color: #604aff;
      cursor: pointer;
      font-family: 'Lato', sans-serif !important;
      background: none;
      line-height: 16px;
      padding: 0px;
      height: auto;
      width: auto;
      margin-right: 30px;
    }

    .sme.link:hover {
      color: #604aff;
    }

    .sme.link:hover .icon {
      display: none;
    }

    .sme.link:hover .icon.hover {
      display: inline-block;
    }

    .sme.link .icon {
      margin-right: 8px;
    }

    .sme.link .icon.hover {
      display: none;
    }

    /* Link Button */

    .sme.link-button {
      font-size: 16px;
      font-weight: 500;
      color: var(--blue-grey);
      cursor: pointer;
      font-family: 'Lato', sans-serif !important;
      background: none;
      line-height: 16px;
      padding: 0px;
      height: auto;
      width: auto;
      margin-right: 30px;
    }

    .sme.link-button:hover {
      color: #604aff;
    }

    .sme.link-button:hover .icon {
      display: none;
    }

    .sme.link-button:hover .icon.hover {
      display: inline-block;
    }

    .sme.link-button .icon {
      margin-right: 8px;
    }

    .sme.link-button .icon.hover {
      display: none;
    }

    /* Text Reference the following component style guide: https://app.zeplin.io/project/5bea24519befb87e8387dec8/screen/5bea26293d02ff3d04f8892d */

    .x-large-header {
      /* InvoiceOverview Header format length */
      font-size: 32px;
      font-weight: 900;
      line-height: 1.5;
      max-width: 600px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .large-header {
      font-size: 32px;
      line-height: 48px;
      font-weight: 900;
    }

    .medium-header {
      font-size: 24px;
      line-height: 36px;
      font-weight: 900;
    }

    .medium-intro {
      font-size: 24px;
      line-height: 36px;
      font-weight: 400;
    }

    .sub-heading {
      font-size: 16px;
      line-height: 24px;
      font-weight: 700;
    }

    .body-paragraph {
      font-size: 16px;
      line-height: 24px;
      font-weight: 400;
    }

    .table-heading {
      font-size: 14px;
      font-weight: 700;
      line-height: 21px;
    }

    .table-content {
      font-size: 14px;
      line-height: 21px;
      font-weight: 400;
      color: /*%BLACK%*/ #1e1f21;
    }

    .table-heading {
      font-size: 14px;
      line-height: 15px;
      font-weight: 900;
    }

    .bold-label {
      font-size: 14px;
      font-weight: 900;
      line-height: 15px;
    }

    .form-label {
      font-size: 12px;
      font-weight: 700;
      line-height: 15px;
    }

    .subdued-text {
      color: #8e9090;
    }

    .caption {
      font-size: 10px;
      line-height: 14px;
      font-weight: normal;
    }

    .subdued-text {
      color: #8e9090;
      opacity: 0.7;
    }

    /* Card Styles Reference the following component style guide: https://app.zeplin.io/project/5bea24519befb87e8387dec8/screen/5bea260a9befb87e8387e650 */

    .card {
      border-radius: 2px;
      box-shadow: 0 1px 1px 0 #dae1e9;
      border: solid 1px /*%GREY5%*/ #f5f7fa;
      background-color: #ffffff;
    }

    .card:hover {
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.16);
      border: solid 1px #e2e2e3;
    }

    .floating-card {
      border-radius: 2px;
      box-shadow: 0 24px 24px 0 rgba(0, 0, 0, 0.12), 0 0 24px 0 rgba(0, 0, 0, 0.15);
      border: solid 1px #e2e2e3;
      background-color: #ffffff;
    }

    .invoice-list-wrapper {
      border-radius: 4px;
      border: 1px solid #e2e2e3;
      overflow: hidden;
    }

    .invoice-list-wrapper > div:last-child > .net-nanopay-sme-ui-InvoiceRowView {
      border: 0;
    }

    .purple-checkmark {
      display: inline-block;
      transform: rotate(45deg);
      height: 20px;
      width: 14px;
      border-bottom: 2px solid #604aff;
      border-right: 2px solid #604aff;
    }

    /*  Radio buttons */
    input[type='radio']:checked:after {
      width: 3px;
      height: 3px;
      border-radius: 15px;
      top: -1px;
      left: -2px;
      position: relative;
      background-color: white;
      content: '';
      display: inline-block;
      visibility: visible;
      border: 6px solid #604aff;
      -webkit-border-before-width: 8px;
      -webkit-border-end-width: 8px;
      -webkit-border-start-width: 8px;
      -webkit-border-after-width: 8px;
    }

    input[type='checkbox']:checked:after {
      width: 14px;
      height: 14px;
      margin-right: 2px;
      padding-left: 2px;
      position: relative;
      left: -4px;
      top: -2px;
      background-color: white;
      content: '\\2713';
      display: inline-block;
      visibility: visible;
      color: #604aff;
      border-radius: 2px;
      box-shadow: inset 0 1px 1px 0 rgba(32, 46, 120, 0.54);
    }

    .label {
      font-size: 12px !important;
      font-weight: 700 !important;
      line-height: 15px !important;
    }

    /* DAO controller */

    .foam-comics-DAOControllerView-top-row .foam-u2-ActionView {
      width: 158px !important;
      height: 48px !important;
      box-shadow: 0 1px 0 0 rgba(22, 29, 37, 0.05);
      border: solid 1px #4a33f4 !important;
      font-family: lato;
      font-size: 16px;
      background: #604aff !important;
    }

    .foam-comics-DAOControllerView .actions .foam-u2-ActionView {
      display: flex;
      align-items: center;
      background: none !important;
      border: none !important;
      box-shadow: none;
      font-size: 16px;
      font-weight: 500;
      font-family: lato;
      color: #8e9090;
      cursor: pointer;
      line-height: 24px;
      width: auto !important;
      height: 40px;
      margin-left: 28px;
      display: inline-block;
    }

    .foam-comics-DAOControllerView .actions .foam-u2-ActionView img + span {
      margin-left: 12px;
    }

    .foam-comics-DAOControllerView .actions .foam-u2-ActionView:hover {
      /* Change the color of the icon to purple */
      filter: hue-rotate(67deg) saturate(100000000) opacity(65%);
    }

    .net-nanopay-sme-SMEController .foam-comics-DAOControllerView-top-row {
      margin-bottom: 36px;
    }

    .foam-comics-DAOControllerView-title-container span {
      color: #8e9090;
      height: 24px;
      font-family: 'Lato', sans-serif;
      font-size: 16px;
    }

    .foam-comics-DAOControllerView-title-container h1 span {
      font-size: 32px;
      line-height: 48px;
      font-weight: 900;
      color: /*%BLACK%*/ #1e1f21;
    }

    .foam-u2-search-TextSearchView input {
      box-shadow: inset 0 1px 2px 0 rgba(116, 122, 130, 0.21);
      border: solid 1px #e2e2e3;
      border-radius: 3px;
      width: 330px;
    }

    .net-nanopay-sme-SMEController .foam-u2-view-TableView-selected {
      background: initial;
    }

    .foam-u2-md-overlaydropdown {
      border-radius: 3px;
      padding: 8px 0px;
      box-shadow: 0 24px 24px 0 rgba(0, 0, 0, 0.12), 0 0 24px 0 rgba(0, 0, 0, 0.15) !important;
      width: 200px;
    }

    .foam-u2-md-overlaydropdown::before {
      content: ' ';
      position: absolute;
      height: 0;
      width: 0;
      border: 8px solid transparent;
      border-bottom-color: black;
      -ms-transform: translate(110px, -16px);
      transform: translate(50px, -202px);
    }

    .foam-u2-view-SimpleSearch p {
      opacity: 0;
      margin: 0px;
    }

    /* user status styles */

    .user-status-Active {
      color: #07941f;
      display: inline-block;
    }

    .user-status-circle-Active {
      height: 7px;
      width: 7px;
      margin-bottom: 2px;
      margin-right: 4px;
      background-color: #07941f;
      border-radius: 50%;
      display: inline-block;
    }

    .user-status-Disabled {
      color: #424242;
      display: inline-block;
    }

    .user-status-circle-Disabled {
      height: 7px;
      width: 7px;
      margin-bottom: 2px;
      margin-right: 4px;
      background-color: #424242;
      border-radius: 50%;
      display: inline-block;
    }

    .user-status-Invited {
      color: #545d87;
      display: inline-block;
    }

    .user-status-circle-Invited {
      height: 7px;
      width: 7px;
      margin-bottom: 2px;
      margin-right: 4px;
      background-color: #545d87;
      border-radius: 50%;
      display: inline-block;
    }

    /* contact status styles */

    [class*="contact-status"] {
      display: inline-block;
      font-size: 11px;
    }

    [class*="contact-status-circle"] {
      height: 6px;
      width: 6px;
      margin-bottom: 1px;
      margin-right: 8px;
      border-radius: 50%;
    }

    .contact-status-Active {
      color: #07941f;
    }

    .contact-status-circle-Ready {
      background-color: /*%APPROVAL3%*/ #32bf5e;
    }
    .contact-status-circle-Pending {
      background-color: /*%GREY3%*/ #cbcfd4;
    }

    /* Styles for ResetPassword/SigninView/SignupView */

    .top-bar {
      width: 100%;
      border-bottom: solid 1px #e2e2e3;
      background: #fff;
    }
    .top-bar-inner {
      max-width: 1024px;
      margin: auto;
      height: 64px;
    }
    .top-bar img {
      height: 25px;
      margin-top: 20px;
    }
    .top-bar-message {
      background: #b3d8ff;
      text-align: center;
      padding: 14px;
      color: /*%BLACK%*/ #1e1f21;
      opacity: 0.8;
    }
    .horizontal-flip {
      -moz-transform: scale(-1, 1);
      -webkit-transform: scale(-1, 1);
      -o-transform: scale(-1, 1);
      -ms-transform: scale(-1, 1);
      transform: scale(-1, 1);
      margin-right: 10px;
    }
    .inline-block {
      display: inline-block;
    }
    .strenght-indicator {
      margin-top: 4px;
    }
    .strenght-indicator .text0 {
      color: #8e9090 !important;
      margin-left: 11px !important;
      font-weight: 400 !important;
    }
    .strenght-indicator .outer {
      background-color: #e2e2e3 !important;
    }

    /* Invoice statuses */

    .generic-status-circle {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 4px;
      margin-bottom: 2px;
    }

    .invoice-status-container {
      display: inline-flex;
      align-items: center;
    }

    .Invoice-Status {
      background: none !important;
      font-weight: 400 !important;
      font-size: 11px !important;
      line-height: 22px;
      display: inline-block;
    }

    .generic-status-circle.Scheduled {
      background: #406dea;
    }

    .Invoice-Status.Scheduled {
      color: #406dea !important;
    }

    .generic-status-circle.Complete {
      background: #07941f;
    }

    .generic-status-circle.Pending-acceptance {
      background: #cf6f0a;
    }

    .Invoice-Status.Pending-acceptance {
      color: #cf6f0a !important;
    }

    .Invoice-Status.Processing {
      color: #cf6f0a !important;
    }

    .generic-status-circle.Processing {
      background: #cf6f0a;
    }

    .Invoice-Status.Complete {
      color: #07941f !important;
    }

    .generic-status-circle.Unpaid {
      background: #545d87;
    }

    .Invoice-Status.Unpaid {
      color: #545d87 !important;
    }

    .generic-status-circle.Overdue {
      background: #d42035;
    }

    .Invoice-Status.Overdue {
      color: #d42035 !important;
    }

    .generic-status-circle.draft {
      border-color: #8b90a6;
      border-style: solid;
      border-width: 1.5px;
      height: 4px;
      width: 4px;
    }

    .Invoice-Status.draft {
      color: #8b90a6 !important;
    }

    .generic-status-circle.pending-approval {
      border-color: #545d87;
      border-style: solid;
      border-width: 1.5px;
      height: 4px;
      width: 4px;
    }

    .Invoice-Status.pending-approval {
      color: #545d87 !important;
    }

    .generic-status-circle.depositing-money {
      background: #cf6f0a;
    }

    .Invoice-Status.depositing-money {
      color: #cf6f0a !important;
    }

    .generic-status-circle.pending {
      background: #cf6f0a;
    }

    .Invoice-Status.pending {
      color: #cf6f0a !important;
    }

    .generic-status-circle.void {
      background: #424242;
    }

    .Invoice-Status.void {
      color: #424242 !important;
    }

    /* BankForm Override */
    .net-nanopay-cico-ui-bankAccount-form-BankForm  {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh !important;
      width: 100vw !important;
      z-index: 950;
      margin: 0 !important;
      padding: 0 !important;
    }

    .net-nanopay-cico-ui-bankAccount-form-BankForm input {
      background-color: white;
    }

    .net-nanopay-cico-ui-bankAccount-form-BankForm .title {
      margin-top: 16px !important;
    }

    /* Wizards */
    .foam-u2-ActionView-save {
      color: #525455 !important;
      background: none !important;
      font-size: 16px !important;
      font-family: lato !important;
      height: 48px !important;
    }

    .foam-u2-ActionView-exit {
      color: #525455 !important;
      background: none !important;
      font-size: 16px !important;
      font-family: lato !important;
      height: 48px !important;
      border: none !important;
      box-shadow: none !important;
    }

    .foam-u2-ActionView-goNext {
      width: 158px !important;
      height: 48px !important;
      border-radius: 4px !important;
      box-shadow: 0 1px 0 0 rgba(22, 29, 37, 0.05) !important;
      background-color: #604aff !important;
      border: 1px solid #4a33f4 !important;
      font-size: 16px !important;
      font-weight: 400 !important;
      font-family: lato !important;
    }

    .foam-u2-ActionView-goBack,
    .net-nanopay-sme-ui-SendRequestMoney .foam-u2-ActionView-save {
      width: 158px !important;
      height: 48px !important;
      border-radius: 4px !important;
      box-shadow: 0 1px 0 0 rgba(22, 29, 37, 0.05) !important;
      background-color: #fff !important;
      border: 1px solid #604aff !important;
      font-size: 16px !important;
      font-weight: 400 !important;
      font-family: lato !important;
      color: #604aff !important;
    }

    .navigationContainer {
      padding: 12px 0 !important;
    }

    .navigationBar {
      height: 72px !important;
      box-shadow: 0 1px 1px 0 #dae1e9 !important;
      border-top: 1px solid /*%GREY5%*/ #f5f7fa !important;
    }

    .foam-u2-ActionView-unavailable {
      display: none !important;
    }

    .net-nanopay-ui-banner-Banner .foam-u2-stack-StackView {
      height: calc(100% - 36px);
    }

    .net-nanopay-sme-SMEController .foam-u2-md-OverlayDropdown {
      transform: translate(-100%, 16px);
    }

    /* signIn & signUp */
    .foam-u2-view-LoginView .foam-u2-detail-VerticalDetailView {
      width: 78%;
    }
    .title-top {
      padding-bottom: 2vh;
    }
    .center-footer {
      width: 78%;
    }
    .foam-u2-view-LoginView .foam-u2-borders-SplitScreenBorder {
      padding-top: 75px;
    }
    .foam-u2-filter-FilterSearch-container-search {
      width: 857px;
      margin-left: 7px;
    }
    .DAOBrowser-query-bar {
      align-items: center !important;
    }
  `
});
