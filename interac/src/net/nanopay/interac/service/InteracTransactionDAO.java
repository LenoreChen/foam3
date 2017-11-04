package net.nanopay.interac.service;

import foam.core.FObject;
import foam.core.X;
import foam.dao.DAO;
import foam.dao.ProxyDAO;
import java.util.Random;
import java.util.UUID;
import net.nanopay.tx.model.Transaction;

public class InteracTransactionDAO
  extends ProxyDAO
{
  public InteracTransactionDAO(X x) {
    this.setX(x);
    this.setOf(net.nanopay.tx.model.Transaction.getOwnClassInfo());
  }

  @Override
  public FObject put_(X x, FObject obj) throws RuntimeException {
    DAO transactionDAO          = (DAO) getX().get("transactionDAO");
    DAO canadianTransactionDAO  = (DAO) getX().get("canadaTransactionDAO");
    DAO indiaTransactionDAO     = (DAO) getX().get("indiaTransactionDAO");

    Transaction transaction = (Transaction) obj;
    if ( transaction.getPayerId() <= 0 ) {
      throw new RuntimeException("Invalid Payer id");
    }

    if ( transaction.getPayeeId() <= 0 ) {
      throw new RuntimeException("Invalid Payee id");
    }

    if ( transaction.getAmount() < 0 ) {
      throw new RuntimeException("Invalid amount");
    }

    if ( transaction.getRate() <= 0 ) {
      throw new RuntimeException("Invalid rate");
    }

    if ( transaction.getPurpose() == null ) {
      throw new RuntimeException("Invalid purpose");
    }

    try {
      Transaction completedTransaction = (Transaction) transactionDAO.put(transaction);

      /**
       * Generate 3 random digits to append to CAXxxx, this will be the
       * Canadian reference number for the demo
       * */
      String referenceNumber = "CAxxx" + UUID.randomUUID().toString().substring(0, 3).toUpperCase();
      completedTransaction.setReferenceNumber(referenceNumber);
      canadianTransactionDAO.put(completedTransaction);

      /**
       * Generate 13 digit random number for IMPS reference number
       * */
      Random random = new Random();
      char[] digits = new char[13];
      digits[0] = (char) (random.nextInt(9) + '1');
      for ( int i = 1; i < 13; i++ ) {
        digits[i] = (char) (random.nextInt(10) + '0');
      }

      completedTransaction.setReferenceNumber(new String(digits));
      indiaTransactionDAO.put(completedTransaction);

      return completedTransaction;

    } catch (RuntimeException e) {
      throw e;
    }
  }
}
