package net.nanopay.invoice.test;

import foam.core.X;
import foam.dao.*;
import foam.nanos.auth.Address;
import foam.nanos.auth.User;
import foam.nanos.test.Test;
import net.nanopay.account.Account;
import net.nanopay.account.DigitalAccount;
import net.nanopay.fx.ascendantfx.AscendantFXUser;
import net.nanopay.invoice.AbliiBillingCron;
import net.nanopay.invoice.model.Invoice;
import net.nanopay.invoice.model.InvoiceStatus;
import net.nanopay.model.Business;
import net.nanopay.tx.InvoicedFeeLineItem;
import net.nanopay.tx.TransactionLineItem;
import net.nanopay.tx.model.Transaction;
import net.nanopay.tx.model.TransactionStatus;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.Date;

import static foam.mlang.MLang.*;

public class AbliiBillingCronTest extends Test {
  private Business owner, payer, payee;
  private Account feeAccount, payerAccount, payeeAccount, payeeUSDAccount;
  private DAO invoiceDAO, localAccountDAO, localBusinessDAO, localTransactionDAO, ascendantFXUserDAO;

  public void runTest(X x) {
    x = setUpDAOs(x);
    setUpBusinesses(x);
    setUpAccounts(x);

    resetTransactions(x);
    Test_BusinessCreatedBeforeFeb2019(x);

    resetTransactions(x);
    Test_BusinessCreatedBeforeJuly2019(x);

    resetTransactions(x);
    Test_BusinessCreatedBeforeSept2019(x);

    resetTransactions(x);
    Test_BusinessCreatedBeforeSept162019(x);

    resetTransactions(x);
    Test_BusinessCreatedAfterSept152019(x);
  }

  private X setUpDAOs(X x) {
    x = x.put("localUserDAO", new SequenceNumberDAO(new MDAO(User.getOwnClassInfo())));
    x = x.put("invoiceDAO", new SequenceNumberDAO(new MDAO(Invoice.getOwnClassInfo())));
    x = x.put("localAccountDAO", new SequenceNumberDAO(new MDAO(Account.getOwnClassInfo())));
    x = x.put("localTransactionDAO", new GUIDDAO(new MDAO(Transaction.getOwnClassInfo())));
    x = x.put("ascendantFXUserDAO", new SequenceNumberDAO(new MDAO(AscendantFXUser.getOwnClassInfo())));

    invoiceDAO          = (DAO) x.get("invoiceDAO");
    localAccountDAO     = (DAO) x.get("localAccountDAO");
    localBusinessDAO    = (DAO) x.get("localBusinessDAO");
    localTransactionDAO = (DAO) x.get("localTransactionDAO");
    ascendantFXUserDAO  = (DAO) x.get("ascendantFXUserDAO");
    return x;
  }

  private void setUpBusinesses(X x) {
    owner = createBusiness(x, "Fee owner");
    payer = createBusiness(x, "Payer business");
    payee = createBusiness(x, "Payee business");
  }

  private void setUpAccounts(X x) {
    feeAccount = createAccount(x, owner, "CAD");
    payerAccount = createAccount(x, payer, "CAD");
    payeeAccount = createAccount(x, payee, "CAD");
    payeeUSDAccount = createAccount(x, payee, "USD");
  }

  private void resetTransactions(X x) {
    localTransactionDAO.removeAll();
    createTransaction(x, LocalDate.of(2019, 9, 15), payeeAccount, 75);
    createTransaction(x, LocalDate.of(2019, 9, 16), payeeAccount, 75);
    createTransaction(x, LocalDate.of(2019, 10, 1), payeeAccount, 75);
    createTransaction(x, LocalDate.of(2019, 12, 1), payeeAccount, 75);
    createTransaction(x, LocalDate.of(2020, 1, 1), payeeAccount, 75);
  }

  private void Test_BusinessCreatedBeforeFeb2019(X x) {
    print("Business created before Feb 2019");
    updatePayerCreated(x, LocalDate.of(2019, 1, 1));

    test(true, "Billing for September 2019");
    YearMonth sept_2019 = YearMonth.of(2019, 9);
    Invoice invoice = generateMonthlyBillingInvoice(x, sept_2019);
    test(invoice.getAmount() == 0
      && invoice.getStatus() == InvoiceStatus.PAID
      , "No fee charge for domestic payments");

    createTransaction(x, LocalDate.of(2019, 9, 16), payeeUSDAccount, 500);
    invoice = generateMonthlyBillingInvoice(x, sept_2019);
    test(invoice.getAmount() == 500
      && invoice.getStatus() == InvoiceStatus.SCHEDULED
      , "Charge fee for international payment");

    // AscendantFX user
    ascendantFXUserDAO.put(
      new AscendantFXUser.Builder(x)
        .setUser(payer.getId())
        .build()
    );
    invoice = generateMonthlyBillingInvoice(x, sept_2019);
    test(invoice.getAmount() == 0, "No fee charge (domestic + international) for AscendantFX user");

    test(true, "Billing after promotion");
    LocalDate oct1_2019 = LocalDate.of(2019, 10, 1);
    LocalDate jan1_2020 = LocalDate.of(2020, 1, 1);
    createTransaction(x, oct1_2019, payeeUSDAccount, 500);
    invoice = generateBillingInvoice(x, oct1_2019, jan1_2020);
    test(invoice.getAmount() == 500 + 75 + 75 + 75
        && invoice.getStatus() == InvoiceStatus.SCHEDULED
      , "Charge both domestic and international fees");
  }

  private void Test_BusinessCreatedBeforeJuly2019(X x) {
    print("Business created before July 2019");
    updatePayerCreated(x, LocalDate.of(2019, 6, 1));

    test(true, "Billing for September 2019");
    YearMonth sept_2019 = YearMonth.of(2019, 9);
    Invoice invoice = generateMonthlyBillingInvoice(x, sept_2019);
    test(invoice.getAmount() == 0
        && invoice.getStatus() == InvoiceStatus.PAID
      , "No fee charge for domestic payments");

    createTransaction(x, LocalDate.of(2019, 9, 16), payeeUSDAccount, 500);
    invoice = generateMonthlyBillingInvoice(x, sept_2019);
    test(invoice.getAmount() == 0
        && invoice.getStatus() == InvoiceStatus.PAID
      , "No fee charge for international payment");

    // AscendantFX user
    ascendantFXUserDAO.put(
      new AscendantFXUser.Builder(x)
        .setUser(payer.getId())
        .build()
    );
    invoice = generateMonthlyBillingInvoice(x, sept_2019);
    test(invoice.getAmount() == 0, "No fee charge (domestic + international) for AscendantFX user");

    test(true, "Billing after promotion");
    LocalDate oct1_2019 = LocalDate.of(2019, 10, 1);
    LocalDate jan1_2020 = LocalDate.of(2020, 1, 1);
    createTransaction(x, oct1_2019, payeeUSDAccount, 500);
    invoice = generateBillingInvoice(x, oct1_2019, jan1_2020);
    test(invoice.getAmount() == 500 + 75 + 75 + 75
        && invoice.getStatus() == InvoiceStatus.SCHEDULED
      , "Charge both domestic and international fees");
  }

  private void Test_BusinessCreatedBeforeSept2019(X x) {
    print("Business created before September 2019");
    updatePayerCreated(x, LocalDate.of(2019, 8, 15));

    test(true, "Billing for September 2019");
    YearMonth sept_2019 = YearMonth.of(2019, 9);
    Invoice invoice = generateMonthlyBillingInvoice(x, sept_2019);
    test(invoice.getAmount() == 0
        && invoice.getStatus() == InvoiceStatus.PAID
      , "No fee charge for domestic payments");

    createTransaction(x, LocalDate.of(2019, 9, 16), payeeUSDAccount, 500);
    invoice = generateMonthlyBillingInvoice(x, sept_2019);
    test(invoice.getAmount() == 0
        && invoice.getStatus() == InvoiceStatus.PAID
      , "No fee charge for international payment");

    // AscendantFX user
    ascendantFXUserDAO.put(
      new AscendantFXUser.Builder(x)
        .setUser(payer.getId())
        .build()
    );
    invoice = generateMonthlyBillingInvoice(x, sept_2019);
    test(invoice.getAmount() == 0, "No fee charge (domestic + international) for AscendantFX user");

    test(true, "Billing after promotion");
    LocalDate oct1_2019 = LocalDate.of(2019, 10, 1);
    LocalDate jan1_2020 = LocalDate.of(2020, 1, 1);
    createTransaction(x, oct1_2019, payeeUSDAccount, 500);
    invoice = generateBillingInvoice(x, oct1_2019, jan1_2020);
    test(invoice.getAmount() == 500 + 0 + 75 + 75
        && invoice.getStatus() == InvoiceStatus.SCHEDULED
      , "Charge both domestic and international fees");
  }

  private void Test_BusinessCreatedBeforeSept162019(X x) {
    print("Business created before September 2019");
    updatePayerCreated(x, LocalDate.of(2019, 9, 12));

    test(true, "Billing for September 2019");
    YearMonth sept_2019 = YearMonth.of(2019, 9);
    Invoice invoice = generateMonthlyBillingInvoice(x, sept_2019);
    test(invoice.getAmount() == 0
        && invoice.getStatus() == InvoiceStatus.PAID
      , "No fee charge for domestic payments");

    createTransaction(x, LocalDate.of(2019, 9, 16), payeeUSDAccount, 500);
    invoice = generateMonthlyBillingInvoice(x, sept_2019);
    test(invoice.getAmount() == 0
        && invoice.getStatus() == InvoiceStatus.PAID
      , "No fee charge for international payment");

    // AscendantFX user
    ascendantFXUserDAO.put(
      new AscendantFXUser.Builder(x)
        .setUser(payer.getId())
        .build()
    );
    invoice = generateMonthlyBillingInvoice(x, sept_2019);
    test(invoice.getAmount() == 0, "No fee charge (domestic + international) for AscendantFX user");

    test(true, "Billing after promotion");
    LocalDate oct1_2019 = LocalDate.of(2019, 10, 1);
    LocalDate jan1_2020 = LocalDate.of(2020, 1, 1);
    createTransaction(x, oct1_2019, payeeUSDAccount, 500);
    invoice = generateBillingInvoice(x, oct1_2019, jan1_2020);
    test(invoice.getAmount() == 500 + 0 + 0 + 75
        && invoice.getStatus() == InvoiceStatus.SCHEDULED
      , "Charge both domestic and international fees");
  }

  private void Test_BusinessCreatedAfterSept152019(X x) {
    print("Business created before September 2019");
    updatePayerCreated(x, LocalDate.of(2019, 9, 16));

    test(true, "Billing for September 2019");
    YearMonth sept_2019 = YearMonth.of(2019, 9);
    Invoice invoice = generateMonthlyBillingInvoice(x, sept_2019);
    test(invoice.getAmount() == 150
        && invoice.getStatus() == InvoiceStatus.SCHEDULED
      , "Charge fee for domestic payments");

    createTransaction(x, LocalDate.of(2019, 9, 16), payeeUSDAccount, 500);
    invoice = generateMonthlyBillingInvoice(x, sept_2019);
    test(invoice.getAmount() == 650
        && invoice.getStatus() == InvoiceStatus.SCHEDULED
      , "Charge fee for international payment");

    // AscendantFX user
    ascendantFXUserDAO.put(
      new AscendantFXUser.Builder(x)
        .setUser(payer.getId())
        .build()
    );
    invoice = generateMonthlyBillingInvoice(x, sept_2019);
    test(invoice.getAmount() == 650, "Charge fee (domestic + international) for AscendantFX user");

    test(true, "Billing after promotion");
    LocalDate oct1_2019 = LocalDate.of(2019, 10, 1);
    LocalDate jan1_2020 = LocalDate.of(2020, 1, 1);
    createTransaction(x, oct1_2019, payeeUSDAccount, 500);
    invoice = generateBillingInvoice(x, oct1_2019, jan1_2020);
    test(invoice.getAmount() == 500 + 75 + 75 + 75
        && invoice.getStatus() == InvoiceStatus.SCHEDULED
      , "Charge both domestic and international fees");
  }

  private Invoice generateMonthlyBillingInvoice(X x, YearMonth billingMonth) {
    LocalDate startDate = billingMonth.atDay(1);
    LocalDate endDate = billingMonth.atEndOfMonth();
    return generateBillingInvoice(x, startDate, endDate);
  }

  private Invoice generateBillingInvoice(X x, LocalDate startDate, LocalDate endDate) {
    AbliiBillingCron cron = new AbliiBillingCron(feeAccount, startDate, endDate);
    cron.execute(x);
    return cron.getInvoiceByPayer().get(payer.getId());
  }

  private void createTransaction(X x, LocalDate created, Account payeeAccount, long feeAmount) {
    localTransactionDAO.put_(x,
      new Transaction.Builder(x)
        .setSourceAccount(payerAccount.getId())
        .setSourceCurrency(payerAccount.getDenomination())
        .setDestinationAccount(payeeAccount.getId())
        .setDestinationCurrency(payeeAccount.getDenomination())
        .setAmount(1000L)
        .setCreated(getDate(created))
        .setLineItems(new TransactionLineItem[] {
          new InvoicedFeeLineItem.Builder(x)
            .setAmount(feeAmount)
            .setCurrency(payerAccount.getDenomination())
            .build() })
        .setStatus(TransactionStatus.COMPLETED)
        .build()
    );
  }

  private void updatePayerCreated(X x, LocalDate localDate) {
    payer.setCreated(getDate(localDate));
    payer = (Business) localBusinessDAO.put(payer).fclone();
  }

  private Business createBusiness(X x, String businessName) {
    return (Business) localBusinessDAO.put(
      new Business.Builder(x)
        .setBusinessName(businessName)
        .setAddress(new Address())
        .build()
    ).fclone();
  }

  private Account createAccount(X x, Business business, String denomination) {
    return (Account) localAccountDAO.put(
      new DigitalAccount.Builder(x)
        .setOwner(business.getId())
        .setDenomination(denomination)
        .build()
    ).fclone();
  }

  private Date getDate(LocalDate localDate) {
    return Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
  }
}
