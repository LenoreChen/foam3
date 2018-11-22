var classes = [
  'net.nanopay.plaid.PlaidService',
  'net.nanopay.plaid.ClientPlaidService',

  // model
  'net.nanopay.plaid.model.PlaidAccessToken',
  'net.nanopay.plaid.model.PlaidPublicToken',
  'net.nanopay.plaid.model.PlaidAccountDetail',
  'net.nanopay.plaid.model.ACH',
  'net.nanopay.plaid.model.EFT',
  'net.nanopay.plaid.model.PlaidBalances'
];

var abstractClasses = [];
var skeletons = [
  'net.nanopay.plaid.PlaidService'
];
var proxies = [];
var blacklist = [];

module.exports = {
  classes: classes,
  abstractClasses: abstractClasses,
  skeletons: skeletons,
  proxies: proxies,
  blacklist: blacklist
};
