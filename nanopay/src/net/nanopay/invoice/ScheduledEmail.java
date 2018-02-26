package net.nanopay.invoice;

import foam.core.*;
import foam.dao.DAO;
import foam.dao.ListSink;
import foam.nanos.app.AppConfig;
import foam.nanos.auth.User;
import foam.nanos.notification.email.EmailMessage;
import foam.nanos.notification.email.EmailService;

import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import net.nanopay.invoice.model.Invoice;
import static foam.mlang.MLang.*;



public class ScheduledEmail
  implements ContextAgent {
  Calendar today = Calendar.getInstance();
  Calendar startTime = Calendar.getInstance();
  Calendar endTime = Calendar.getInstance();
  Calendar dueDate = Calendar.getInstance();

  public void execute(X x) {

    today.setTime(new Date());
    startTime.setTimeInMillis(today.getTimeInMillis() + (1000*60*60*24) );
    endTime.setTimeInMillis(startTime.getTimeInMillis() + ((1000*60*60*24)-1) );
    DAO   invoiceDAO = (DAO) x.get("invoiceDAO");
    DAO      userDAO = (DAO) x.get("userDAO");

    invoiceDAO = invoiceDAO.where(
      AND(
        GTE(Invoice.PAYMENT_DATE,startTime.getTime()),
        LTE(Invoice.PAYMENT_DATE,endTime.getTime())
      )
    );
    List<Invoice> invoicesList = (List)((ListSink)invoiceDAO.select(new ListSink())).getData();
    EmailService           email = (EmailService) x.get("email");
    AppConfig             config = (AppConfig) x.get("appConfig");
    NumberFormat       formatter = NumberFormat.getCurrencyInstance();
    SimpleDateFormat  dateFormat = new SimpleDateFormat("dd-MMM-YYYY");

    EmailMessage       message;
    HashMap<String, Object> args;
    User user;
    User payee;
    for (Invoice invoice: invoicesList){
      args    = new HashMap<>();
      message = new EmailMessage();
      user    = (User) userDAO.find(invoice.getPayerId());
      payee   = (User) userDAO.find(invoice.getPayeeId());
      message.setTo(new String[]{user.getEmail()});
      dueDate.setTime(invoice.getPaymentDate());
      args.put("account", invoice.getId());
      args.put("amount", formatter.format(invoice.getAmount()/100.00));
      args.put("date", dateFormat.format(invoice.getPaymentDate()));
      args.put("link", config.getUrl());
      args.put("name", user.getFirstName());
      args.put("toEmail", payee.getEmail());
      email.sendEmailFromTemplate(user, message, "schedule-paid", args);
    }
  }
}