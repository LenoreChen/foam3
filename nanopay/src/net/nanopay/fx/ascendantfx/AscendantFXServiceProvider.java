package net.nanopay.fx.ascendantfx;

import foam.core.Detachable;
import foam.core.X;
import foam.dao.AbstractSink;
import foam.dao.DAO;
import foam.mlang.MLang;
import foam.nanos.auth.User;
import foam.util.SafetyUtil;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import net.nanopay.bank.BankAccount;
import net.nanopay.fx.ascendantfx.model.AcceptQuoteRequest;
import net.nanopay.fx.ascendantfx.model.AcceptQuoteResult;
import net.nanopay.fx.ascendantfx.model.Deal;
import net.nanopay.fx.ascendantfx.model.DealDetail;
import net.nanopay.fx.ascendantfx.model.Direction;
import net.nanopay.fx.ascendantfx.model.GetQuoteRequest;
import net.nanopay.fx.ascendantfx.model.GetQuoteResult;
import net.nanopay.fx.ascendantfx.model.Payee;
import net.nanopay.fx.ascendantfx.model.PayeeDetail;
import net.nanopay.fx.ascendantfx.model.PayeeOperationRequest;
import net.nanopay.fx.ascendantfx.model.PayeeOperationResult;
import net.nanopay.fx.ascendantfx.model.SubmitDealResult;
import net.nanopay.fx.ascendantfx.model.SubmitDealRequest;
import net.nanopay.fx.ExchangeRateStatus;
import net.nanopay.fx.FXDirection;
import net.nanopay.fx.FXQuote;
import net.nanopay.fx.FXService;
import net.nanopay.fx.ascendantfx.model.AcceptAndSubmitDealTBAResult;
import net.nanopay.fx.ascendantfx.model.GetQuoteTBARequest;
import net.nanopay.fx.ascendantfx.model.GetQuoteTBAResult;
import net.nanopay.model.Currency;
import net.nanopay.payment.Institution;
import net.nanopay.payment.PaymentService;
import net.nanopay.tx.model.Transaction;
import net.nanopay.model.Branch;
import foam.nanos.auth.Region;
import net.nanopay.fx.ascendantfx.model.GetPayeeInfoResult;
import net.nanopay.fx.ascendantfx.model.GetPayeeInfoRequest;

public class AscendantFXServiceProvider implements FXService, PaymentService {

  public static final Long AFX_SUCCESS_CODE = 200l;
  private final AscendantFX ascendantFX;
  protected DAO fxQuoteDAO_;
  private final X x;

  public AscendantFXServiceProvider(X x, final AscendantFX ascendantFX) {
    this.ascendantFX = ascendantFX;
    fxQuoteDAO_ = (DAO) x.get("fxQuoteDAO");
    this.x = x;
  }

  public FXQuote getFXRate(String sourceCurrency, String targetCurrency, Long sourceAmount,  Long destinationAmount,
      String fxDirection, String valueDate, long user, String fxProvider) throws RuntimeException {
    FXQuote fxQuote = new FXQuote();

    try {
      // Get orgId
      String orgId = getUserAscendantFXOrgId(user);
      if ( SafetyUtil.isEmpty(orgId) ) throw new RuntimeException("Unable to find Ascendant Organization ID for User: " + user);
      //Convert to AscendantFx Request
      GetQuoteRequest getQuoteRequest = new GetQuoteRequest();
      getQuoteRequest.setMethodID("AFXEWSGQ");
      getQuoteRequest.setOrgID(orgId);
      getQuoteRequest.setTotalNumberOfPayment(1);

      Deal deal = new Deal();
      Direction direction = Direction.valueOf(fxDirection);
      deal.setDirection(direction);
      deal.setFxAmount(toDecimal(destinationAmount));
      deal.setSettlementAmount(toDecimal(sourceAmount));
      deal.setFxCurrencyID(targetCurrency);
      deal.setSettlementCurrencyID(sourceCurrency);
      deal.setPaymentMethod("Wire");
      deal.setPaymentSequenceNo(1);

      List<Deal> deals = new ArrayList<Deal>();
      deals.add(deal);
      Deal[] dealArr = new Deal[deals.size()];
      getQuoteRequest.setPayment(deals.toArray(dealArr));

      GetQuoteResult getQuoteResult = this.ascendantFX.getQuote(getQuoteRequest);
      if ( null == getQuoteResult ) throw new RuntimeException("No response from AscendantFX");

      if ( getQuoteResult.getErrorCode() != 0 ) throw new RuntimeException("Unable to get FX Quote from AscendantFX " + getQuoteResult.getErrorMessage());

      //Convert to FXQUote
      fxQuote.setExternalId(String.valueOf(getQuoteResult.getQuote().getID()));
      fxQuote.setSourceCurrency(sourceCurrency);
      fxQuote.setTargetCurrency(targetCurrency);
      fxQuote.setStatus(ExchangeRateStatus.QUOTED.getName());

      Deal[] dealResult = getQuoteResult.getPayment();
      if ( dealResult.length > 0 ) {
        Deal aDeal = dealResult[0];

        fxQuote.setRate(aDeal.getRate());
        fxQuote.setExpiryTime(getQuoteResult.getQuote().getExpiryTime());
        fxQuote.setTargetAmount(fromDecimal(aDeal.getFxAmount()));
        fxQuote.setSourceAmount(fromDecimal(aDeal.getSettlementAmount()));
        fxQuote.setFee(fromDecimal(aDeal.getFee()));
        fxQuote.setFeeCurrency(aDeal.getSettlementCurrencyID());
      }

      fxQuote = (FXQuote) fxQuoteDAO_.put_(x, fxQuote);
    } catch (Exception e) {
      throw new RuntimeException(e);
    }

    return fxQuote;

  }

  public Boolean acceptFXRate(String quoteId, long user) throws RuntimeException {
    Boolean result = false;
    FXQuote quote = (FXQuote) fxQuoteDAO_.find(Long.parseLong(quoteId));
    if  ( null == quote ) throw new RuntimeException("FXQuote not found with Quote ID:  " + quoteId);
    // Get orgId
    String orgId = getUserAscendantFXOrgId(user);
    if ( SafetyUtil.isEmpty(orgId) ) throw new RuntimeException("Unable to find Ascendant Organization ID for User: " + user);
    //Build Ascendant Request
    AcceptQuoteRequest request = new AcceptQuoteRequest();
    request.setMethodID("AFXEWSAQ");
    request.setOrgID(orgId);
    request.setQuoteID(Long.parseLong(quote.getExternalId()));

    AcceptQuoteResult acceptQuoteResult = this.ascendantFX.acceptQuote(request);
    if ( null != acceptQuoteResult && acceptQuoteResult.getErrorCode() == 0 ) {
      quote.setStatus(ExchangeRateStatus.ACCEPTED.getName());
      fxQuoteDAO_.put_(x, quote);
      result = true;
    }

    return result;
  }

  public void addPayee(long userId, long bankAccount, long sourceUser) throws RuntimeException{
    DAO userDAO = (DAO) x.get("localUserDAO");
    User user = (User) userDAO.find_(x, userId);
    if ( null == user ) throw new RuntimeException("Unable to find User " + userId);

    String orgId = getUserAscendantFXOrgId(sourceUser);
    if ( SafetyUtil.isEmpty(orgId) ) throw new RuntimeException("Unable to find Ascendant Organization ID for User: " + sourceUser);

    PayeeOperationRequest ascendantRequest = new PayeeOperationRequest();
    ascendantRequest.setMethodID("AFXEWSPOA");
    ascendantRequest.setOrgID(orgId);

    PayeeDetail ascendantPayee = getPayeeDetail(user, bankAccount, orgId);
    PayeeDetail[] ascendantPayeeArr = new PayeeDetail[1];
    ascendantPayeeArr[0] = ascendantPayee;
    ascendantRequest.setPayeeDetail(ascendantPayeeArr);

    PayeeOperationResult ascendantResult = this.ascendantFX.addPayee(ascendantRequest);
    if ( null == ascendantResult ) throw new RuntimeException("No response from AscendantFX");
    if ( ascendantResult.getErrorCode() == 0 ) {
      DAO ascendantUserPayeeJunctionDAO = (DAO) x.get("ascendantUserPayeeJunctionDAO");
      AscendantUserPayeeJunction userPayeeJunction = new AscendantUserPayeeJunction.Builder(x).build();
      userPayeeJunction.setUser(userId);
      userPayeeJunction.setAscendantPayeeId(ascendantResult.getPayeeId());
      userPayeeJunction.setOrgId(orgId);
      ascendantUserPayeeJunctionDAO.put(userPayeeJunction);
    }else{
      throw new RuntimeException("Unable to Add Payee to AscendantFX Organization: " + ascendantResult.getErrorMessage() );
    }

  }

  public void deletePayee(long payeeUserId, long payerUserId) throws RuntimeException {
    String orgId = getUserAscendantFXOrgId(payerUserId);
    if ( SafetyUtil.isEmpty(orgId) ) throw new RuntimeException("Unable to find Ascendant Organization ID for User: " + payerUserId);
    DAO userDAO = (DAO) x.get("localUserDAO");
    User user = (User) userDAO.find_(x, payeeUserId);
    if ( null == user ) throw new RuntimeException("Unable to find User " + payeeUserId);

    AscendantUserPayeeJunction userPayeeJunction = getAscendantUserPayeeJunction(orgId, payeeUserId);
    if ( ! SafetyUtil.isEmpty(userPayeeJunction.getAscendantPayeeId()) ) {
      PayeeOperationRequest ascendantRequest = new PayeeOperationRequest();
      ascendantRequest.setMethodID("AFXEWSPOD");
      ascendantRequest.setOrgID(orgId);

      PayeeDetail ascendantPayee = new PayeeDetail();
      ascendantPayee.setPaymentMethod("Wire");
      ascendantPayee.setOriginatorID(orgId);
      ascendantPayee.setPayeeID(Integer.parseInt(userPayeeJunction.getAscendantPayeeId()));
      ascendantPayee.setPayeeInternalReference(String.valueOf(payeeUserId));
      PayeeDetail[] ascendantPayeeArr = new PayeeDetail[1];
      ascendantPayeeArr[0] = ascendantPayee;
      ascendantRequest.setPayeeDetail(ascendantPayeeArr);

      PayeeOperationResult ascendantResult = this.ascendantFX.deletePayee(ascendantRequest);

      if ( null == ascendantResult ) throw new RuntimeException("No response from AscendantFX");
      if ( ascendantResult.getErrorCode() != 0 )
        throw new RuntimeException("Unable to Delete Payee from AscendantFX Organization: " + ascendantResult.getErrorMessage());

      DAO ascendantUserPayeeJunctionDAO = (DAO) x.get("ascendantUserPayeeJunctionDAO");
      ascendantUserPayeeJunctionDAO.remove_(x, userPayeeJunction);

    }

  }

  public void submitPayment(Transaction transaction) throws RuntimeException {
    try {
      if ( (transaction instanceof AscendantFXTransaction) ) {
        AscendantFXTransaction ascendantTransaction = (AscendantFXTransaction) transaction;
        FXQuote quote = (FXQuote) fxQuoteDAO_.find(Long.parseLong(ascendantTransaction.getFxQuoteId()));
        if  ( null == quote ) throw new RuntimeException("FXQuote not found with Quote ID:  " + ascendantTransaction.getFxQuoteId());

        String orgId = getUserAscendantFXOrgId(ascendantTransaction.getPayerId());
        if ( SafetyUtil.isEmpty(orgId) ) throw new RuntimeException("Unable to find Ascendant Organization ID for User: " + ascendantTransaction.getPayerId());

        AscendantUserPayeeJunction userPayeeJunction = getAscendantUserPayeeJunction(orgId, ascendantTransaction.getPayeeId());

        // Check FXDeal has not expired
        if ( dealHasExpired(ascendantTransaction.getFxExpiry()) )
          throw new RuntimeException("FX Transaction has expired");

        boolean payerHasHoldingAccount = getUserAscendantFXUserHoldingAccount(ascendantTransaction.getPayerId(),ascendantTransaction.getDestinationCurrency()).isPresent();

        //Build Ascendant Request
        SubmitDealRequest ascendantRequest = new SubmitDealRequest();
        ascendantRequest.setMethodID("AFXEWSSD");
        ascendantRequest.setOrgID(orgId);
        ascendantRequest.setQuoteID(Long.parseLong(quote.getExternalId()));
        ascendantRequest.setTotalNumberOfPayment(1);

        String fxDirection = payerHasHoldingAccount ? FXDirection.Sell.getName() :  FXDirection.Buy.getName();

        DealDetail[] dealArr = new DealDetail[1];
        DealDetail dealDetail = new DealDetail();
        dealDetail.setDirection(Direction.valueOf(fxDirection));

        dealDetail.setFee(0);
        dealDetail.setFxAmount(toDecimal(ascendantTransaction.getDestinationAmount()));
        dealDetail.setFxCurrencyID(ascendantTransaction.getDestinationCurrency());
        dealDetail.setPaymentMethod("wire"); // REVEIW: Wire ?
        dealDetail.setPaymentSequenceNo(1);
        dealDetail.setRate(ascendantTransaction.getFxRate());
        dealDetail.setSettlementAmount(toDecimal(ascendantTransaction.getAmount()));
        dealDetail.setSettlementCurrencyID(ascendantTransaction.getSourceCurrency());
        dealDetail.setInternalNotes("");

        // We won't send Payee if Payer has holding account
        if ( ! payerHasHoldingAccount ) {
          // If Payee is not already linked to Payer, then Add Payee
          if ( null == userPayeeJunction || SafetyUtil.isEmpty(userPayeeJunction.getAscendantPayeeId()) ) {

            User payee = (User)  ((DAO) x.get("localUserDAO")).find_(x, ascendantTransaction.getPayeeId());
            if ( null == payee ) throw new RuntimeException("Unable to find User for Payee " + ascendantTransaction.getPayeeId());

            BankAccount bankAccount = BankAccount.findDefault(x, payee, ascendantTransaction.getDestinationCurrency());
            if ( null == bankAccount ) throw new RuntimeException("Unable to find Bank account: " + payee.getId() );

            addPayee(payee.getId(), bankAccount.getId(), ascendantTransaction.getPayerId());
            userPayeeJunction = getAscendantUserPayeeJunction(orgId, ascendantTransaction.getPayeeId()); // REVEIW: Don't like to look-up twice
          }

          Payee payee = new Payee();
          payee.setPayeeID(Integer.parseInt(userPayeeJunction.getAscendantPayeeId()));
          dealDetail.setPayee(payee);

        }

        dealArr[0] = dealDetail;
        ascendantRequest.setPaymentDetail(dealArr);

        SubmitDealResult submittedDealResult = this.ascendantFX.submitDeal(ascendantRequest);
        if ( null == submittedDealResult ) throw new RuntimeException("No response from AscendantFX");

        if ( submittedDealResult.getErrorCode() != 0 )
          throw new RuntimeException(submittedDealResult.getErrorMessage());

      }
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  public FXQuote getQuoteTBA(Transaction transaction) throws RuntimeException {
    FXQuote fxQuote = new FXQuote();
    try {
      if ( (transaction instanceof AscendantFXTransaction) ) {
        AscendantFXTransaction ascendantTransaction = (AscendantFXTransaction) transaction;
        FXQuote quote = (FXQuote) fxQuoteDAO_.find(Long.parseLong(ascendantTransaction.getFxQuoteId()));
        if (null == quote) throw new RuntimeException("FXQuote not found with Quote ID:  " + ascendantTransaction.getFxQuoteId());

        Optional<AscendantFXHoldingAccount> holdingAccount = getUserAscendantFXUserHoldingAccount(ascendantTransaction.getPayerId(),ascendantTransaction.getDestinationCurrency());
        if ( ! holdingAccount.isPresent() ) throw new RuntimeException("Ascendant Holding Account not found for Payer:  " + ascendantTransaction.getPayerId() + " with currency: " + ascendantTransaction.getDestinationCurrency());

        AscendantUserPayeeJunction userPayeeJunction = getAscendantUserPayeeJunction(holdingAccount.get().getOrgId(), ascendantTransaction.getPayeeId());
        // If Payee is not already linked to Payer, then Add Payee
        if ( null == userPayeeJunction || SafetyUtil.isEmpty(userPayeeJunction.getAscendantPayeeId()) ) {
          User payee = (User)  ((DAO) x.get("localUserDAO")).find_(x, ascendantTransaction.getPayeeId());
          if ( null == payee ) throw new RuntimeException("Unable to find User for Payee " + ascendantTransaction.getPayeeId());

          BankAccount bankAccount = BankAccount.findDefault(x, payee, ascendantTransaction.getDestinationCurrency());
          if ( null == bankAccount ) throw new RuntimeException("Unable to find Bank account: " + payee.getId() );

          addPayee(payee.getId(), bankAccount.getId(), ascendantTransaction.getPayerId());
          userPayeeJunction = getAscendantUserPayeeJunction(holdingAccount.get().getOrgId(), ascendantTransaction.getPayeeId()); // REVEIW: Don't like to look-up twice
        }

        GetQuoteTBARequest ascendantRequest = new GetQuoteTBARequest();
        ascendantRequest.setFromAccountNumber(holdingAccount.get().getAccountNumber());
        ascendantRequest.setFxAmount(toDecimal(quote.getSourceAmount()));
        ascendantRequest.setMethodID("AFXWSVIFSQ");
        ascendantRequest.setOrgID(holdingAccount.get().getOrgId());
        ascendantRequest.setToAccountNumber(userPayeeJunction.getAscendantPayeeId());
        ascendantRequest.setSettlementAmount(toDecimal(quote.getTargetAmount()));

        GetQuoteTBAResult result = this.ascendantFX.getQuoteTBA(ascendantRequest);
        if ( null == result ) throw new RuntimeException("No response from AscendantFX");
        if ( result.getErrorCode() != 0 ) throw new RuntimeException(result.getErrorMessage());

        fxQuote.setExternalId(String.valueOf(result.getQuote().getID()));
        fxQuote.setSourceAmount(fromDecimal(result.getFxAmount()));
        fxQuote.setTargetAmount(fromDecimal(result.getSettlementAmount()));
        fxQuote.setFee(fromDecimal(result.getFee()));
        fxQuote.setSourceCurrency(result.getFxCurrencyID());
        fxQuote.setTargetCurrency(result.getSettlementCurrencyID());
      }
    } catch (Exception e) {
      throw new RuntimeException(e);
    }

    return fxQuote;
  }


   public String submitQuoteTBA(Long payerId, Long quoteId ) throws RuntimeException {
    try {

        String orgId = getUserAscendantFXOrgId(payerId);
        if ( SafetyUtil.isEmpty(orgId) ) throw new RuntimeException("Unable to find Ascendant Organization ID for User: " + payerId);

        AcceptQuoteRequest ascendantRequest = new AcceptQuoteRequest();
        ascendantRequest.setMethodID("AFXWSVIFSAS");
        ascendantRequest.setOrgID(orgId);
        ascendantRequest.setQuoteID(quoteId);

        AcceptAndSubmitDealTBAResult result = this.ascendantFX.acceptAndSubmitDealTBA(ascendantRequest);
        if ( null == result ) throw new RuntimeException("No response from AscendantFX");
        if ( result.getErrorCode() != 0 ) throw new RuntimeException(result.getErrorMessage());

        return result.getDealNumber();

    } catch (Exception e) {
      throw new RuntimeException(e);
    }

  }

  private AscendantUserPayeeJunction getAscendantUserPayeeJunction(String orgId, long userId) {
    DAO userPayeeJunctionDAO = (DAO) x.get("ascendantUserPayeeJunctionDAO");
    final AscendantUserPayeeJunction userPayeeJunction = (AscendantUserPayeeJunction) userPayeeJunctionDAO.find(
        MLang.AND(
            MLang.EQ(AscendantUserPayeeJunction.ORG_ID, orgId),
            MLang.EQ(AscendantUserPayeeJunction.USER, userId)
        )
    );
    return userPayeeJunction;
  }

  private PayeeDetail getPayeeDetail(User user, long bankAccountId, String orgId) {
    PayeeDetail payee = new PayeeDetail();
    payee.setPayeeID(0);
    payee.setPaymentMethod("Wire");

    BankAccount bankAccount = (BankAccount) ((DAO) x.get("localAccountDAO")).find(bankAccountId);
    if ( null == bankAccount ) throw new RuntimeException("Unable to find Bank account: " + user.getId() );

    if ( null != user ) {
      payee.setPayeeReference(String.valueOf(user.getId()));
      payee.setCurrencyID(bankAccount.getDenomination());
      payee.setPayeeCountryID(user.getAddress().getCountryId());
      payee.setPayeeInternalReference(String.valueOf(user.getId()));
      DAO institutionDAO = (DAO) x.get("institutionDAO");
      Institution institution = (Institution) institutionDAO.find_(x, bankAccount.getInstitution());
      Branch branch = bankAccount.findBranch(x);
      final Region userRegion = (Region) ((DAO) x.get("regionDAO")).find(MLang.AND(
                  MLang.EQ(Region.COUNTRY_ID, user.getAddress().getCountryId()),
                  MLang.EQ(Region.CODE, user.getAddress().getRegionId())
              ));

      if ( null != institution && null != branch && null != branch.getAddress() ) {
        payee.setOriginatorID(orgId);
        payee.setPayeeAddress1(user.getAddress().getAddress1());
        payee.setPayeeName(user.getFirstName() + " " + user.getLastName());
        payee.setPayeeEmail(user.getEmail());
        payee.setPayeeCity(user.getAddress().getCity());
        payee.setPayeeProvince(userRegion.getName());
        payee.setPayeeCountryID(user.getAddress().getCountryId());
        payee.setPayeePostalCode(user.getAddress().getPostalCode());
        payee.setPayeeReference(String.valueOf(user.getId()));
        payee.setPayeeBankName(institution.getName());
        payee.setPayeeBankAddress1(branch.getAddress().getAddress1());
        payee.setPayeeBankCity(branch.getAddress().getCity());
        payee.setPayeeBankProvince(branch.getAddress().getCity());
        payee.setPayeeBankPostalCode(branch.getAddress().getPostalCode());
        payee.setPayeeBankCountryID(institution.getCountryId());
        payee.setPayeeBankSwiftCode(institution.getSwiftCode());
        payee.setPayeeAccountIBANNumber(bankAccount.getAccountNumber());
        payee.setPayeeBankRoutingCode(institution.getInstitutionNumber()); //TODO:
        payee.setPayeeBankRoutingType("Wire"); //TODO
        payee.setPayeeInterBankRoutingCodeType(""); // TODO

      }

    }

    return payee;
  }

  private String getUserAscendantFXOrgId(long userId){
    String orgId = null;
    DAO ascendantFXUserDAO = (DAO) x.get("ascendantFXUserDAO");
    final AscendantFXUser ascendantFXUser = new AscendantFXUser.Builder(x).build();
    ascendantFXUserDAO.where(
                  MLang.EQ(AscendantFXUser.USER, userId)
          ).select(new AbstractSink() {
            @Override
            public void put(Object obj, Detachable sub) {
              ascendantFXUser.setOrgId(((AscendantFXUser) obj).getOrgId());
            }
          });

    if ( ! SafetyUtil.isEmpty(ascendantFXUser.getOrgId()) ) orgId = ascendantFXUser.getOrgId();

    return orgId;
  }

  private Optional<AscendantFXHoldingAccount> getUserAscendantFXUserHoldingAccount(long userId, String currency){
    if ( null == currency ) return Optional.empty();
    final AscendantFXUser ascendantFXUser = new AscendantFXUser.Builder(x).build();
    DAO ascendantFXUserDAO = (DAO) x.get("ascendantFXUserDAO");
    ascendantFXUserDAO.where(
                  MLang.EQ(AscendantFXUser.USER, userId)
          ).select(new AbstractSink() {
            @Override
            public void put(Object obj, Detachable sub) {
              ascendantFXUser.setOrgId(((AscendantFXUser) obj).getOrgId());
            }
          });

    for ( AscendantFXHoldingAccount holdingAccount : ascendantFXUser.getHoldingAccounts() ) {
      if ( currency.equalsIgnoreCase(holdingAccount.getCurrency()) ) return Optional.ofNullable(holdingAccount);
    }

    return Optional.empty();
  }

  private boolean dealHasExpired(Date expiryDate) {
    int bufferMinutes = 5;
    Calendar today = Calendar.getInstance();
    today.add(Calendar.MINUTE, bufferMinutes);

    Calendar expiry = Calendar.getInstance();
    expiry.setTime(expiryDate);

    return (today.after(expiry));
  }

  private Double toDecimal(Long amount) {
    BigDecimal x100 = new BigDecimal(100);
    BigDecimal val = BigDecimal.valueOf(amount).setScale(2);
    return val.divide(x100).setScale(2).doubleValue();
  }

  private Long fromDecimal(Double amount) {
    BigDecimal x100 = new BigDecimal(100);
    BigDecimal val = BigDecimal.valueOf(amount).setScale(2);
    return val.multiply(x100).longValueExact();
  }

}
