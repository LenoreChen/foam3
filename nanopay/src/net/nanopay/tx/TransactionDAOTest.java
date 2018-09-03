package net.nanopay.tx;

import foam.core.X;
import foam.dao.DAO;
import foam.nanos.auth.AuthorizationException;
import foam.nanos.auth.User;
import foam.test.TestUtils;
import net.nanopay.account.DigitalAccount;
import net.nanopay.bank.BankAccountStatus;
import net.nanopay.bank.CABankAccount;
import net.nanopay.tx.model.Transaction;
import net.nanopay.tx.model.TransactionStatus;
import net.nanopay.tx.QuoteTransaction;

import static foam.mlang.MLang.*;

public class TransactionDAOTest
  extends foam.nanos.test.Test
{
  User sender_, receiver_;
  X x_;
  CABankAccount senderBankAccount_;
  DAO txnDAO;
  public void runTest(X x) {
    txnDAO = (DAO) x.get("localTransactionDAO");
    // x = TestUtils.mockDAO(x, "localTransactionDAO");
    //x = TestUtils.mockDAO(x, "localAccountDAO");
    //x = addUsers(x);
    x_ = x;
    testEmailVerified();
    testNoneTxn();
    //testCashIn();
    //testCashOut();
  }

  public X addUsers() {
    //x = TestUtils.mockDAO(x, "localUserDAO");

    sender_ = (User) ((DAO)x_.get("localUserDAO")).find(EQ(User.EMAIL,"testuser1@nanopay.net" ));
    if ( sender_ == null ) {
      sender_ = new User();
      sender_.setGroup("admin");
      sender_.setEmail("testUser1@nanopay.net");
    }
    sender_ = (User) sender_.fclone();
    sender_.setEmailVerified(true);
    sender_ = (User) (((DAO) x_.get("localUserDAO")).put_(x_, sender_)).fclone();

    receiver_ = (User) ((DAO)x_.get("localUserDAO")).find(EQ(User.EMAIL,"testuser2@nanopay.net" ));
    if ( receiver_ == null ) {
      receiver_ = new User();
      receiver_.setGroup("business");
      receiver_.setEmail("testUser2@nanopay.net");
    }
    receiver_ = (User) receiver_.fclone();
    receiver_.setEmailVerified(true);
    receiver_ = (User) (((DAO) x_.get("localUserDAO")).put_(x_, receiver_)).fclone();

    return x_;
  }


  public void testEmailVerified() {
    addUsers();

    Transaction txn = new Transaction();
    //txn.setId(1);
    txn.setPayerId(sender_.getId());
    txn.setPayeeId(receiver_.getId());
    txn.setAmount(100L);

    //testUser2 = (User) testUser2.fclone();
    //testUser1 = (User) testUser1.fclone();

    receiver_.setEmailVerified(false);

    sender_.setEmailVerified(false);

    sender_ = (User) ((DAO) x_.get("localUserDAO")).put_(x_, sender_);
    receiver_ = (User) ((DAO) x_.get("localUserDAO")).put_(x_, receiver_);


    QuoteTransaction quote = (QuoteTransaction) ((DAO) x_.get("localTransactionQuotePlanDAO")).put_(x_, new net.nanopay.tx.QuoteTransaction.Builder(x_).setRequestTransaction(txn).build());
    test(TestUtils.testThrows(
      () -> txnDAO.put_(x_, quote.getPlan()),
      "You must verify your email to send money.",
      AuthorizationException.class
      ),
      "Exception: email must be verified");

    /*testUser1 = (User) testUser1.fclone();
    testUser2 = (User) testUser2.fclone();

    testUser2.setEmailVerified(true);
    testUser1.setEmailVerified(false);

    testUser1 = (User) ((DAO) x.get("localUserDAO")).put_(x, testUser1);
    testUser2 = (User) ((DAO) x.get("localUserDAO")).put_(x, testUser2);

    test(TestUtils.testThrows(
      () -> txnDAO.put_(x, txn),
      "You must verify your email to send money",
      RuntimeException.class
      ),
      "thrown an exception");*/
  }

  public void testNoneTxn() {
    addUsers();
    Transaction txn = new Transaction();

    txn.setPayerId(sender_.getId());
    txn.setPayeeId(receiver_.getId());
    txn.setAmount(0L);


    receiver_.setEmailVerified(true);
    sender_.setEmailVerified(true);

    sender_ = (User) ((DAO) x_.get("localUserDAO")).put_(x_, sender_);
    receiver_ = (User) ((DAO) x_.get("localUserDAO")).put_(x_, receiver_);


    // Test amount cannot be zero
    QuoteTransaction quote = (QuoteTransaction) ((DAO) x_.get("localTransactionQuotePlanDAO")).put_(x_, new net.nanopay.tx.QuoteTransaction.Builder(x_).setRequestTransaction(txn).build());
    test(TestUtils.testThrows(
      () -> txnDAO.put_(x_, quote.getPlan()),
      "Zero transfer disallowed.",
      RuntimeException.class), "Exception: Txn amount cannot be zero");

    // Test payer user exists
    txn.setAmount(1L);
    txn.setPayerId(3L);
    QuoteTransaction quote2 = (QuoteTransaction) ((DAO) x_.get("localTransactionQuotePlanDAO")).put_(x_, new net.nanopay.tx.QuoteTransaction.Builder(x_).setRequestTransaction(txn).build());
    test(TestUtils.testThrows(
      () -> txnDAO.put_(x_, quote2.getPlan()),
      "Payer not found",
      RuntimeException.class), "Exception: Payer user must exist");

    // Test payee user exists
    txn.setAmount(1L);
    txn.setPayerId(sender_.getId());
    txn.setPayeeId(3L);
    QuoteTransaction quote3 = (QuoteTransaction) ((DAO) x_.get("localTransactionQuotePlanDAO")).put_(x_, new net.nanopay.tx.QuoteTransaction.Builder(x_).setRequestTransaction(txn).build());
    test(TestUtils.testThrows(
      () -> txnDAO.put_(x_, quote3.getPlan()),
      "Payee not found",
      RuntimeException.class), "Exception: Payee user must exist");


    // Test amount cannot be negative
    txn.setAmount(-1L);
    txn.setPayeeId(receiver_.getId());
    QuoteTransaction quote4 = (QuoteTransaction) ((DAO) x_.get("localTransactionQuotePlanDAO")).put_(x_, new net.nanopay.tx.QuoteTransaction.Builder(x_).setRequestTransaction(txn).build());
    test(TestUtils.testThrows(
      () -> txnDAO.put_(x_, quote4.getPlan()),
      "Amount cannot be negative",
      RuntimeException.class), "Exception: Txn amount cannot be negative");


    txn.setAmount((DigitalAccount.findDefault(x_, sender_, "CAD").findBalance(x_) == null ? 1 : (Long) DigitalAccount.findDefault(x_, sender_, "CAD").findBalance(x_))+ 1);
    txn.setPayeeId(receiver_.getId());
    QuoteTransaction quote5 = (QuoteTransaction) ((DAO) x_.get("localTransactionQuotePlanDAO")).put_(x_, new net.nanopay.tx.QuoteTransaction.Builder(x_).setRequestTransaction(txn).build());
    test(TestUtils.testThrows(
      () -> txnDAO.put_(x_, quote5.getPlan()),
      "Insufficient balance in account " + DigitalAccount.findDefault(x_, sender_, "CAD").getId(),
      RuntimeException.class), "Exception: Insufficient balance");

    // Test return transactionStatus
    cashIn();
    long initialBalanceSender = DigitalAccount.findDefault(x_, sender_, "CAD").findBalance(x_) == null ? 0 : (Long) DigitalAccount.findDefault(x_, sender_, "CAD").findBalance(x_);
    long initialBalanceReceiver = DigitalAccount.findDefault(x_, receiver_, "CAD").findBalance(x_) == null ? 0 : (Long) DigitalAccount.findDefault(x_, receiver_, "CAD").findBalance(x_);
    QuoteTransaction quote6 = (QuoteTransaction) ((DAO) x_.get("localTransactionQuotePlanDAO")).put_(x_, new net.nanopay.tx.QuoteTransaction.Builder(x_).setRequestTransaction(txn).build());
    Transaction transaction = (Transaction) txnDAO.put_(x_, quote6.getPlan()).fclone();
    test(transaction.getStatus() == TransactionStatus.COMPLETED, "transaction is completed");
    test(transaction.getType() == TransactionType.NONE, "transaction is NONE type");
    test(transaction.findSourceAccount(x_) instanceof DigitalAccount, "Source account is digital Account");
    test(transaction.findDestinationAccount(x_) instanceof DigitalAccount, "Destination account is digital Account");
    test(transaction.findDestinationAccount(x_).getOwner() == receiver_.getId(), "Destination account belongs to receiver");
    test(transaction.findSourceAccount(x_).getOwner() == sender_.getId(), "Source account belongs to receiver");
    Long receiverBalance = (Long) transaction.findDestinationAccount(x_).findBalance(x_);
    Long senderBalance = (Long) transaction.findSourceAccount(x_).findBalance(x_);
    test(senderBalance == initialBalanceSender - transaction.getAmount(), "Sender balance is correct");
    test(receiverBalance == initialBalanceReceiver + transaction.getAmount(), "Receiver balance is correct");
    transaction.setStatus((TransactionStatus.PAUSED));
    QuoteTransaction quote7 = (QuoteTransaction) ((DAO) x_.get("localTransactionQuotePlanDAO")).put_(x_, new net.nanopay.tx.QuoteTransaction.Builder(x_).setRequestTransaction(transaction).build());
    test(TestUtils.testThrows(
      () -> txnDAO.put_(x_, quote7.getPlan()),
      "Unable to update Alterna CICOTransaction, if transaction status is accepted or declined. Transaction id: " + transaction.getId(),
      RuntimeException.class), "Exception: If txn is completed or declined it cannot be updated");
  }

  /*public void testCashIn() {
    Transaction txn = new Transaction();
    txn.setType(TransactionType.CASHIN);
    setBankAccount(BankAccountStatus.UNVERIFIED);
    txn.setPayeeId(sender_.getId());
    txn.setSourceAccount(senderBankAccount_.getId());
    txn.setAmount(1l);
    test(TestUtils.testThrows(
      () -> txnDAO.put_(x_, txn),
      "Bank account must be verified",
      RuntimeException.class), "Exception: Bank account must be verified");
    setBankAccount(BankAccountStatus.VERIFIED);
    long senderInitialBalance = (long) DigitalAccount.findDefault(x_, sender_, "CAD").findBalance(x_);
    Transaction tx = (Transaction) txnDAO.put_(x_, txn).fclone();
    test(tx.getType() == TransactionType.CASHIN, "Transaction type is CASHIN" );
    test(tx.getStatus() == TransactionStatus.PENDING, "CashIn transaction has status pending" );
    test( senderInitialBalance ==  (long) DigitalAccount.findDefault(x_, sender_, "CAD").findBalance(x_), "While cash in is pending balance remains the same" );
    tx.setStatus(TransactionStatus.COMPLETED);
    tx = (Transaction) txnDAO.put_(x_, tx).fclone();
    test(tx.getStatus() == TransactionStatus.COMPLETED, "CashIn transaction has status completed" );
    test( senderInitialBalance + tx.getAmount() ==  (Long) DigitalAccount.findDefault(x_, sender_, "CAD").findBalance(x_), "After transaction is completed balance is updated" );
    tx.setStatus(TransactionStatus.DECLINED);
    tx = (Transaction) txnDAO.put_(x_, tx).fclone();
    test(tx.getStatus() == TransactionStatus.DECLINED, "CashIn transaction has status declined" );
    test( senderInitialBalance  ==  (Long) DigitalAccount.findDefault(x_, sender_, "CAD").findBalance(x_), "After transaction is declined balance is reverted" );

 *//*   Balance balance = (Balance)(((LocalBalanceDAO)x_.get("localBalanceDAO")).getWritableBalanceDAO(x_)).find(1L).fclone();
    balance.setBalance(666666666);
    (((LocalBalanceDAO)x_.get("localBalanceDAO")).getWritableBalanceDAO(x_)).put(balance);
*//*
  }

  public void testCashOut() {Transaction txn = new Transaction();
    txn.setType(TransactionType.CASHOUT);
    setBankAccount(BankAccountStatus.UNVERIFIED);
    txn.setPayerId(sender_.getId());
    txn.setDestinationAccount(senderBankAccount_.getId());
    txn.setAmount(1l);
    test(TestUtils.testThrows(
      () -> txnDAO.put_(x_, txn),
      "Bank account must be verified",
      RuntimeException.class), "Exception: Bank account must be verified");
    setBankAccount(BankAccountStatus.VERIFIED);
    long senderInitialBalance = (long) DigitalAccount.findDefault(x_, sender_, "CAD").findBalance(x_);
    Transaction tx = (Transaction) txnDAO.put_(x_, txn).fclone();
    test(tx.getType() == TransactionType.CASHOUT, "Transaction type is CASHOUT" );
    test(tx.getStatus() == TransactionStatus.PENDING, "CashOUT transaction has status pending" );
    test( senderInitialBalance - tx.getAmount() ==  (long) DigitalAccount.findDefault(x_, sender_, "CAD").findBalance(x_), "For cashout transaction balance updated immediately" );
    tx.setStatus(TransactionStatus.COMPLETED);
    txnDAO.put_(x_, tx);
    test(tx.getStatus() == TransactionStatus.COMPLETED, "CashOut transaction has status completed" );
    test( senderInitialBalance - txn.getAmount() ==  (Long) DigitalAccount.findDefault(x_, sender_, "CAD").findBalance(x_), "After cashout transaction is completed balance remains the same" );


  }
*/
  public void setBankAccount(BankAccountStatus status) {
    senderBankAccount_ = (CABankAccount) ((DAO)x_.get("localAccountDAO")).find(AND(EQ(CABankAccount.OWNER, sender_.getId()), INSTANCE_OF(CABankAccount.class)));
    if ( senderBankAccount_ == null ) {
      senderBankAccount_ = new CABankAccount();
      senderBankAccount_.setAccountNumber("2131412443534534");
      senderBankAccount_.setOwner(sender_.getId());
    } else {
      senderBankAccount_ = (CABankAccount)senderBankAccount_.fclone();
    }
    senderBankAccount_.setStatus(status);
    senderBankAccount_ = (CABankAccount) ((DAO)x_.get("localAccountDAO")).put_(x_, senderBankAccount_).fclone();
  }

  public void cashIn() {
    setBankAccount(BankAccountStatus.VERIFIED);
    Transaction txn = new Transaction();
    txn.setAmount(100000L);
    txn.setSourceAccount(senderBankAccount_.getId());
    txn.setPayeeId(sender_.getId());
    txn.setType(TransactionType.CASHIN);
   // txn = (Transaction) (((DAO) x_.get("localTransactionDAO")).put_(x_, txn)).fclone();
    txn.setStatus(TransactionStatus.COMPLETED);
    QuoteTransaction quote = (QuoteTransaction) ((DAO) x_.get("localTransactionQuotePlanDAO")).put_(x_, new net.nanopay.tx.QuoteTransaction.Builder(x_).setRequestTransaction(txn).build());
    ((DAO) x_.get("localTransactionDAO")).put_(x_, quote.getPlan());
  }

}
