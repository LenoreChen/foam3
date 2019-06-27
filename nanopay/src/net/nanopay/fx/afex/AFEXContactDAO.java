package net.nanopay.fx.afex;

import foam.core.FObject;
import foam.core.X;
import foam.dao.DAO;
import foam.dao.ProxyDAO;
import foam.nanos.auth.AuthService;
import foam.nanos.auth.User;
import foam.nanos.logger.Logger;
import foam.nanos.notification.Notification;
import static foam.mlang.MLang.*;

import net.nanopay.bank.BankAccount;
import net.nanopay.contacts.Contact;
import net.nanopay.fx.ascendantfx.AscendantFXUser;
import net.nanopay.fx.FXUserStatus;
import net.nanopay.model.Business;

/**
 * This DAO would create Beneficiary on AFEX API
 */
public class AFEXContactDAO
    extends ProxyDAO {

  public AFEXContactDAO(X x, DAO delegate) {
    setX(x);
    setDelegate(delegate);
  }

  @Override
  public FObject put_(X x, FObject obj) {
    if ( ! (obj instanceof Contact) ) {
      return getDelegate().put_(x, obj);
    }
    System.out.println("AFEXContactDAO run first");

    DAO localBusinessDAO = ((DAO) x.get("localBusinessDAO")).inX(x);
    DAO localAccountDAO = ((DAO) x.get("localAccountDAO")).inX(x);
    AFEXServiceProvider afexServiceProvider = (AFEXServiceProvider) x.get("afexServiceProvider");
    
    Contact contact = (Contact) obj;
    Business business = (Business) localBusinessDAO.find(contact.getBusinessId());
    // Check if contact has a bank account
    BankAccount contactBankAccount = contact.getBankAccount() < 1 ? 
      ((BankAccount) localAccountDAO.find(AND(EQ(BankAccount.OWNER, contact.getId()), INSTANCE_OF(BankAccount.class)))) 
      : ((BankAccount) localAccountDAO.find(contact.getBankAccount()));
    if ( contactBankAccount != null ) {
      System.out.println("Contact has bank account");
      // Check if beneficiary already added
      if ( ! afexBeneficiaryExists(x, contact.getId(), contact.getOwner()) ) {
        System.out.println("Contact has not being linked on AFEX");
        createAFEXBeneficiary(x, contact.getId(), contactBankAccount.getId(),  contact.getOwner());
      } else {
        // Check if this is an update
        if ( contactNeedsUpdateChanged(contact) ) {
          try {
            System.out.println("Contact details has changed");
            afexServiceProvider.updatePayee(contact.getId(), contactBankAccount.getId(),  contact.getOwner());
          } catch(Throwable t) {
            ((Logger) x.get("logger")).error("Error creating AFEX beneficiary.", t);
          } 
        }        
      }
    }

    // Check If Contact has business and create AFEX beneficiary for business also
    if ( business != null ) {
      BankAccount businessBankAccount = ((BankAccount) localAccountDAO.find(AND(EQ(BankAccount.OWNER, business.getId()), INSTANCE_OF(BankAccount.class))));
      if ( null != businessBankAccount ) {
        System.out.println("Business Contact has a bank account");
        if ( ! afexBeneficiaryExists(x, business.getId(), contact.getOwner()) ) {
          System.out.println("Business Contact not yet creates");
          createAFEXBeneficiary(x, business.getId(), businessBankAccount.getId(),  contact.getOwner());
        } else {
          // Check if this is an update
          if ( businessNeedsUpdateChanged(business) ) {
            System.out.println("Business Contact details has changed");
            try {
              afexServiceProvider.updatePayee(business.getId(), businessBankAccount.getId(),  contact.getOwner());
            } catch(Throwable t) {
              ((Logger) x.get("logger")).error("Error creating AFEX beneficiary.", t);
            } 
          }
        }
      }
    }

    return super.put_(x, obj);
  }

  protected boolean contactNeedsUpdateChanged(Contact contact) {
    // TODO: Logic to check if we are updating contact
    return false;
  }

  protected boolean businessNeedsUpdateChanged(Business business) {
    // TODO: Logic to check if we are updating contact
    return false;
  }

  protected boolean afexBeneficiaryExists(X x, Long contactId, Long ownerId) {
    boolean beneficiaryExists = false;
    DAO afexBeneficiaryDAO = ((DAO) x.get("afexBeneficiaryDAO")).inX(x);
    AFEXServiceProvider afexServiceProvider = (AFEXServiceProvider) x.get("afexServiceProvider");
    AFEXBeneficiary afexBeneficiary = (AFEXBeneficiary) afexBeneficiaryDAO.find(
      AND(
        EQ(AFEXBeneficiary.CONTACT, contactId),
        EQ(AFEXBeneficiary.OWNER, ownerId)
      )
    );
    if ( null != afexBeneficiary ) return true;
    try {
      FindBeneficiaryResponse existingBeneficiary = afexServiceProvider.getPayeeInfo(String.valueOf(contactId), ownerId);
      if ( existingBeneficiary != null ) {
        beneficiaryExists = true;
        afexBeneficiary = new AFEXBeneficiary();
        afexBeneficiary.setContact(contactId);
        afexBeneficiary.setOwner(ownerId);
        afexBeneficiary.setStatus(existingBeneficiary.getStatus());
        afexBeneficiaryDAO.put(afexBeneficiary);
      } else {
        beneficiaryExists = false;
      }
    } catch(Throwable t) {
      // TODO: Log
    } 

    return beneficiaryExists;
  }

  protected void createAFEXBeneficiary(X x, long beneficiaryId, long bankAccountId, long beneficiaryOwnerId) {
    AFEXServiceProvider afexServiceProvider = (AFEXServiceProvider) x.get("afexServiceProvider");
    try {
      afexServiceProvider.addPayee(beneficiaryId, bankAccountId,  beneficiaryOwnerId);
    } catch(Throwable t) {
      ((Logger) x.get("logger")).error("Error creating AFEX beneficiary.", t);
    }  
  }
}
