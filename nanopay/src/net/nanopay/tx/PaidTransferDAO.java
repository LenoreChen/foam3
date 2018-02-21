package net.nanopay.tx;

import foam.core.FObject;
import foam.core.X;
import foam.dao.DAO;
import foam.dao.ProxyDAO;
import foam.nanos.app.AppConfig;
import foam.nanos.auth.Group;
import foam.nanos.auth.User;
import foam.nanos.notification.email.EmailMessage;
import foam.nanos.notification.email.EmailService;
import net.nanopay.tx.model.Transaction;
import java.text.NumberFormat;
import java.util.HashMap;

public class PaidTransferDAO
  extends ProxyDAO
{
  protected DAO userDAO_;

  public PaidTransferDAO(X x, DAO delegate) {
    super(x, delegate);
    userDAO_ = (DAO) x.get("localUserDAO");
  }

  @Override
  public FObject put_(X x, FObject obj) {
    Transaction transaction = (Transaction) super.put_(x, obj);
    User user = (User) userDAO_.find_(x, transaction.getPayeeId());
    User sender = (User) userDAO_.find_(x, transaction.getPayerId());
    if (transaction.getInvoiceId() != 0) {
      return transaction;
    }
    if ( transaction.getPayeeId() == transaction.getPayerId() ) {
      return transaction;
    }
    if (sender.getGroup().equals("ccShopper") && user.getGroup().equals("ccMerchant")) {
      return transaction;
    }
    AppConfig config = (AppConfig) x.get("appConfig");
    NumberFormat formatter = NumberFormat.getCurrencyInstance();

    EmailService email = (EmailService) x.get("email");
    EmailMessage message = new EmailMessage();
    message.setTo(new String[]{user.getEmail()});
    HashMap<String, Object> args = new HashMap<>();
    args.put("amount", formatter.format(transaction.getAmount()/100));
    args.put("name", user.getFirstName());
    args.put("email", user.getEmail());
    args.put("link" , config.getUrl());
    args.put("applink" , config.getAppLink());
    args.put("playlink" , config.getPlayLink());
    try {
      email.sendEmailFromTemplate(user, message, "transfer-paid", args);
    } catch(Throwable t) {
      t.printStackTrace();
    }
    return transaction;
  }
}