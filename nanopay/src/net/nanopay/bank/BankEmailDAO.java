package net.nanopay.bank;

import foam.core.FObject;
import foam.core.X;
import foam.dao.DAO;
import foam.dao.ProxyDAO;
import foam.nanos.app.AppConfig;
import foam.nanos.auth.User;
import foam.nanos.logger.Logger;
import foam.nanos.notification.email.EmailMessage;
import foam.nanos.notification.email.EmailService;
import java.util.HashMap;
import net.nanopay.model.BankAccount;

// Sends an email when a Bank account is created
public class BankEmailDAO
  extends ProxyDAO
{
  protected DAO userDAO_;

  public BankEmailDAO(X x, DAO delegate) {
    super(x, delegate);
    userDAO_ = (DAO) x.get("localUserDAO");
  }

  @Override
  public FObject put_(X x, FObject obj) {

    BankAccount account = (BankAccount) obj;
    User        user    = (User) userDAO_.find_(x, account.getOwner());

    // Don't send an email if the account already exists
    if ( find(account.getId()) != null )
      return getDelegate().put_(x, obj);

    account = (BankAccount) super.put_(x, obj);
    EmailService email   = (EmailService) x.get("email");
    EmailMessage message = new EmailMessage();
    AppConfig     config = (AppConfig) x.get("appConfig");
    message.setTo(new String[]{user.getEmail()});
    HashMap<String, Object> args = new HashMap<>();
    args.put("name", user.getFirstName());
    args.put("account", account.getAccountNumber().substring(account.getAccountNumber().length() - 4));
    args.put("link", config.getUrl());

    try {
      email.sendEmailFromTemplate(user, message, "addBank", args);
    } catch(Throwable t) {
      ((Logger) x.get(Logger.class)).error("Error sending bank account created email.", t);
    }
    return account;
  }
}
