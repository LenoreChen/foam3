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
package net.nanopay.partner.treviso;

import foam.core.X;
import foam.dao.DAO;
import foam.test.TestUtils;
import foam.nanos.auth.Address;
import foam.nanos.auth.User;
import static foam.mlang.MLang.AND;
import static foam.mlang.MLang.EQ;
import static foam.mlang.MLang.INSTANCE_OF;
import java.util.Date;
import net.nanopay.bank.BankAccountStatus;
import net.nanopay.bank.BankAccount;
import net.nanopay.bank.CABankAccount;
import net.nanopay.country.br.exchange.Exchange;
import net.nanopay.country.br.exchange.ExchangeClientMock;
import net.nanopay.country.br.exchange.ExchangeClientValues;
import net.nanopay.country.br.exchange.ExchangeService;
import net.nanopay.partner.treviso.FepWebClient;
import net.nanopay.partner.treviso.api.FepWeb;
import net.nanopay.partner.treviso.api.FepWebServiceMock;
import net.nanopay.partner.treviso.api.FepWebService;
import net.nanopay.payment.Institution;
import net.nanopay.tx.model.Transaction;

public class TrevisoServiceTest
  extends foam.nanos.test.Test {

  X x;
  protected TrevisoServiceInterface trevisoService;
  protected Exchange exchangeService;
  User user;
  BankAccount testBankAccount;

  @Override
  public void runTest(X x) {
    X y = x.put("fepWebService", new FepWebServiceMock(x));
    y = y.put("exchange", new ExchangeClientMock(y));
    this.x = y;
    trevisoService = new TrevisoService(y, "fepWebService", "exchange");
    setUpTest();
    testSaveEntity();
    testSearchCustomer();
    testCreateTrevisoTransaction();
  }

  private void setUpTest() {
    createUsers(x);
    testBankAccount = createTestBankAccount();
    ((TrevisoService) trevisoService)
      .saveFepWebClient(testBankAccount.getOwner(), "Active");

    setUpExchangeClientValues();
  }


  private void setUpExchangeClientValues() {
    ExchangeClientValues e = new ExchangeClientValues();
    e.setSpid("test");
    ((DAO) this.x.get("exchangeClientValueDAO")).put(e);
  }

  public void createUsers(X x) {
    user = (User) ((DAO)x.get("localUserDAO")).find(EQ(User.EMAIL,"trevisouser@nanopay.net" ));
    if ( user == null ) {
      user = new User();
      user.setFirstName("Treviso");
      user.setLastName("Treviso");
      Address address = new Address.Builder(x)
        .setStructured(false)
        .setAddress1("905 King St W")
        .setCity("Toronto")
        .setRegionId("CA-ON")
        .setPostalCode("M6K 3G9")
        .setCountryId("CA")
        .build();
      user.setAddress(address);
      user.setSpid("test");
      user.setEmail("trevisouser@nanopay.net");
    }
    user = (User) user.fclone();
    user.setEmailVerified(true);
    user = (User) (((DAO) x.get("localUserDAO")).put_(x, user)).fclone();
  }

  private void testSaveEntity() {
    FepWebClient client = trevisoService.createEntity(x, user.getId());
    test( client != null , "Entity Saved" );
  }

  private void testSearchCustomer() {
    FepWebClient client = trevisoService.searchCustomer(x, user.getId());
    test( client != null , "Customer found" );
  }

  private void testCreateTrevisoTransaction() {
    Transaction transaction = ((ExchangeService) trevisoService).createTransaction(
      new Transaction.Builder(x).setAmount(1000).setSourceAccount(testBankAccount.getId())
        .setDestinationAccount(testBankAccount.getId())
        .setCompletionDate(new Date()).build());
    test( transaction != null , "treviso transaction created" );
  }

  private CABankAccount createTestBankAccount() {
    DAO bankAccountDao = (DAO) x.get("accountDAO");
    CABankAccount account = (CABankAccount) bankAccountDao.find(EQ(CABankAccount.NAME, "RBC Test Account"));
    if ( account == null ) {
      BankAccount testBankAccount = new CABankAccount.Builder(x)
        .setAccountNumber("12345678")
        .setBranchId( "00002" )
        .setInstitutionNumber( "003" )
        .setOwner(1014)
        .setName("RBC Test Account")
        .setStatus(BankAccountStatus.VERIFIED)
        .build();

      return (CABankAccount) bankAccountDao.put(testBankAccount);
    } else {
      return account;
    }
  }
}
