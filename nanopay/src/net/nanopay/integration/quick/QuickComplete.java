package net.nanopay.integration.quick;

import static foam.mlang.MLang.*;

import com.intuit.ipp.security.OAuth2Authorizer;
import com.intuit.oauth2.client.OAuth2PlatformClient;
import foam.core.X;
import foam.dao.ArraySink;
import foam.dao.DAO;
import foam.dao.Sink;
import foam.lib.json.JSONParser;
import foam.lib.json.Outputter;
import foam.nanos.auth.User;
import foam.nanos.http.WebAgent;
import foam.nanos.notification.Notification;
import net.nanopay.integration.quick.model.*;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.client.HttpClient;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

public class QuickComplete
  implements WebAgent {

  QuickClientFactory factory;
  User  user;
  X x_;
  private QuickTokenStorage isValidToken(X x) {
    /*
    Info:   Function to check if the User has used Xero before
    Input:  x: The context to allow access to the tokenStorageDAO to view if there's an entry for the user
    Output: Returns the Class that contains the users Tokens to properly access Xero. If using Xero for the first time will create an empty Class to load the data in
    */
    DAO          store        = (DAO)  x.get("quickTokenStorageDAO");
                 user         = (User) x.get("user");

    QuickTokenStorage tokenStorage = (QuickTokenStorage) store.find(user.getId());

    // If the user has never tried logging in to Xero before
    if ( tokenStorage == null ) {
      tokenStorage = new QuickTokenStorage();
      tokenStorage.setId(user.getId());
      tokenStorage.setAccessToken(" ");
      tokenStorage.setCsrf(" ");
      tokenStorage.setRealmId(" ");
    }
    return tokenStorage;
  }

  public void execute(X x) {
                        x_           =  x;
    HttpServletRequest  req          = (HttpServletRequest) x.get(HttpServletRequest.class);
    HttpServletResponse resp         = (HttpServletResponse) x.get(HttpServletResponse.class);
    DAO                 store        = (DAO) x.get("quickTokenStorageDAO");
    QuickConfig         config       = (QuickConfig) x.get("quickConfig");
    QuickTokenStorage   tokenStorage = isValidToken(x);
    QuickOauth          auth         = (QuickOauth) x.get("quickAuth");
    String              code         = req.getParameter("code");
    String              state        = req.getParameter("state");
    String              realm        = req.getParameter("realmId");
    try {
      OAuth2PlatformClient client = (OAuth2PlatformClient) auth.getOAuth();
      OAuth2Authorizer oauth = new OAuth2Authorizer(tokenStorage.getAccessToken()); //set access token obtained from BearerTokenResponse
      QuickQueryCustomer[] customer = getCustomers ( tokenStorage,config);
      QuickQueryInvoice[] invoice = getInvoices(tokenStorage,config);
      QuickQueryBill[] bill = getBills(tokenStorage,config);

      System.out.println(invoice.length);
      System.out.println(bill.length);
      System.out.println(customer.length);
      resp.sendRedirect("/");
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
  public QuickQueryBill[] getBills(QuickTokenStorage ts, QuickConfig config){
    try {
      DAO        invoiceDAO   = (DAO) x_.get("invoiceDAO");
      DAO        contactDAO   = (DAO) x_.get("bareUserDAO");
      Sink       sink         = new ArraySink();
      HttpClient httpclient   = HttpClients.createDefault();
      DAO        notification = (DAO) x_.get("notificationDAO");

      System.out.println(ts.getAccessToken());
      HttpGet httpget =  new HttpGet(config.getIntuitAccountingAPIHost()+"/v3/company/"+ts.getRealmId()+"/query?query=select%20*%20from%20bill");
      httpget.setHeader("Authorization", "Bearer "+ts.getAccessToken());
      httpget.setHeader("Content-Type","application/json");
      httpget.setHeader("Api-Version","alpha");
      httpget.setHeader("Accept","application/json");
      HttpResponse response = httpclient.execute(httpget);
      BufferedReader  rd = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
      String line;
      line = rd.readLine();
      System.out.println(line);
      JSONParser parser = new JSONParser();
      System.out.println("*************************");
      QuickQueryBillResponse quick = (QuickQueryBillResponse) parser.parseString(line, QuickQueryBillResponse.getOwnClassInfo().getObjClass());
      QuickQueryBills billList = quick.getQueryResponse();
      QuickQueryBill[] bills = billList.getBill();
      for (int i = 0; i<bills.length; i++) {
        QuickQueryBill invoice = bills[i];
        QuickInvoice portal = new QuickInvoice();
        contactDAO   = contactDAO.where(AND(
          INSTANCE_OF(QuickContact.class),
          EQ(
            QuickContact.QUICK_ID,
            invoice.getVendorRef().getValue())))
          .limit(1);
        contactDAO.select(sink);
        List list = ((ArraySink) sink).getArray();
        if ( list.size() == 0 ) {
          Notification notify = new Notification();
          notify.setBody("Quick Bill #" +
            invoice.getId() +
            "can not be sync'd because Quick Contact #" +
            invoice.getVendorRef().getValue() +
            "is not in this system");
          notification.put(notify);
          continue;
        } else {
          portal.setPayerId( ( (QuickInvoice) list.get(0) ).getId());
        }
        portal.setPayeeId(user.getId());
        portal.setInvoiceNumber(invoice.getDocNumber());
        portal.setQuickId(invoice.getId());
        portal.setDestinationCurrency(invoice.getCurrencyRef().getValue());
        portal.setIssueDate( getDate(invoice.getTxnDate()));
        portal.setDueDate(getDate(invoice.getDueDate()));
        portal.setAmount(new BigDecimal(invoice.getTotalAmt()).movePointRight(2).longValue());
        portal.setDesync(false);
        System.out.println(portal);
        invoiceDAO.put(portal);
      }
      return bills;

    } catch (Exception e) {
      e.printStackTrace();
    }
    return null;
  }

  public QuickQueryInvoice[] getInvoices(QuickTokenStorage ts, QuickConfig config){
    try {
      DAO        invoiceDAO   = (DAO) x_.get("invoiceDAO");
      DAO        contactDAO   = (DAO) x_.get("bareUserDAO");
      Sink       sink         = new ArraySink();
      HttpClient httpclient   = HttpClients.createDefault();
      DAO        notification = (DAO) x_.get("notificationDAO");

      System.out.println(ts.getAccessToken());
      HttpGet httpget =  new HttpGet(config.getIntuitAccountingAPIHost()+"/v3/company/"+ts.getRealmId()+"/query?query=select%20*%20from%20invoice");
      httpget.setHeader("Authorization", "Bearer "+ts.getAccessToken());
      httpget.setHeader("Content-Type","application/json");
      httpget.setHeader("Api-Version","alpha");
      httpget.setHeader("Accept","application/json");
      HttpResponse response = httpclient.execute(httpget);
      BufferedReader  rd = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
      String line;
      line = rd.readLine();
      System.out.println(line);
      JSONParser parser = new JSONParser();
      System.out.println("*************************");
      QuickQueryInvoiceResponse quick = (QuickQueryInvoiceResponse) parser.parseString(line, QuickQueryInvoiceResponse.getOwnClassInfo().getObjClass());
      QuickQueryInvoices invoiceList = quick.getQueryResponse();
      QuickQueryInvoice[] invoices = invoiceList.getInvoice();
      for (int i = 0; i<invoices.length; i++) {
        QuickQueryInvoice invoice = invoices[i];
        QuickInvoice portal = new QuickInvoice();
        contactDAO   = contactDAO.where(AND(
          INSTANCE_OF(QuickContact.class),
          EQ(
            QuickContact.QUICK_ID,
            invoice.getCustomerRef().getValue())))
          .limit(1);
        contactDAO.select(sink);
        List list = ((ArraySink) sink).getArray();
        if ( list.size() == 0 ) {
          Notification notify = new Notification();
          notify.setBody("Quick Invoice #" +
            invoice.getId() +
            "can not be sync'd because Quick Contact #" +
            invoice.getCustomerRef().getValue() +
            "is not in this system");
          notification.put(notify);
          continue;
        } else {
          portal.setPayeeId( ( (QuickInvoice) list.get(0) ).getId());
        }
        portal.setPayerId(user.getId());
        portal.setStatus(net.nanopay.invoice.model.InvoiceStatus.UNPAID);
        portal.setInvoiceNumber(invoice.getDocNumber());
        portal.setQuickId(invoice.getId());
        portal.setDestinationCurrency(invoice.getCurrencyRef().getValue());
        portal.setIssueDate( getDate(invoice.getTxnDate()));
        portal.setDueDate(getDate(invoice.getDueDate()));
        portal.setAmount(new BigDecimal(invoice.getTotalAmt()).movePointRight(2).longValue());
        portal.setDesync(false);
        System.out.println(portal);
        invoiceDAO.put(portal);

      }
      return invoices;

    } catch (Exception e) {
      e.printStackTrace();
    }
    return null;
  }
  public QuickQueryCustomer[] getCustomers(QuickTokenStorage ts, QuickConfig config){
    try {
      DAO        contactDAO   = (DAO) x_.get("contactDAO");
      DAO        notification = (DAO) x_.get("notificationDAO");
      HttpClient httpclient = HttpClients.createDefault();
      Outputter jout = new Outputter();
      System.out.println(ts.getAccessToken());
      HttpGet httpget =  new HttpGet(config.getIntuitAccountingAPIHost()+"/v3/company/"+ts.getRealmId()+"/query?query=select%20*%20from%20Customer");
      httpget.setHeader("Authorization", "Bearer "+ts.getAccessToken());
      httpget.setHeader("Content-Type","application/json");
      httpget.setHeader("Api-Version","alpha");
      httpget.setHeader("Accept","application/json");
      HttpResponse response = httpclient.execute(httpget);
      BufferedReader  rd = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
      String line;
      line = rd.readLine();
      System.out.println(line);
      JSONParser parser = new JSONParser();

      QuickQueryCustomerResponse quick = new QuickQueryCustomerResponse();
      quick = (QuickQueryCustomerResponse) parser.parseString(line,quick.getClassInfo().getObjClass());
      QuickQueryCustomers customersList = quick.getQueryResponse();
      QuickQueryCustomer[] customers = customersList.getCustomer();
      System.out.println(jout.stringify(customers[0]));
      for (int i = 0; i<customers.length; i++) {
        QuickQueryCustomer customer = customers[i];
        QuickQueryEMail email = customer.getPrimaryEmailAddr();
        QuickContact portal = new QuickContact();
        System.out.println(customer.toJSON());
        System.out.println(customer);
        portal.setQuickId(customer.getId());
        if (email == null){
          Notification notify = new Notification();
          notify.setBody("Quick Contact #" +
            customer.getId() +
            "can not be added because Email is needed");
          notification.put(notify);
          continue;
        }
        portal.setOrganization( customer.getCompanyName() );
        portal.setFirstName( "".equals(customer.getGivenName() ) ? "" : customer.getGivenName());
        portal.setLastName( "".equals(customer.getFamilyName() ) ? "" : customer.getFamilyName() );
        System.out.println(portal);
        contactDAO.put(portal);
      }
      return customers;

    } catch (Exception e) {
      e.printStackTrace();
    }
    return null;
  }
  public Date getDate(String str){
    try {
      Date date=new SimpleDateFormat("yyyy-MM-dd").parse(str);
      return date;
    } catch ( Exception e ) {
      return null;
    }
  }
}
