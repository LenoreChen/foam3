package net.nanopay.integration.quick;


import com.intuit.oauth2.client.OAuth2PlatformClient;
import com.intuit.oauth2.config.Environment;
import com.intuit.oauth2.config.OAuth2Config;
import com.intuit.oauth2.config.Scope;
import com.intuit.oauth2.data.BearerTokenResponse;
import com.sun.xml.bind.v2.model.annotation.Quick;
import foam.core.X;
import foam.dao.DAO;
import foam.nanos.auth.User;
import foam.nanos.http.WebAgent;
import net.nanopay.integration.xero.TokenStorage;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;


public class QuickService
  implements WebAgent {
  QuickClientFactory factory;
  private QuickTokenStorage isValidToken(X x) {
    /*
    Info:   Function to check if the User has used Xero before
    Input:  x: The context to allow access to the tokenStorageDAO to view if there's an entry for the user
    Output: Returns the Class that contains the users Tokens to properly access Xero. If using Xero for the first time will create an empty Class to load the data in
    */
    DAO          store        = (DAO)  x.get("quickTokenStorageDAO");
    User         user         = (User) x.get("user");
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
    /*
    Info:   Function to access the Xero API to sign in and valid user information in Xero
    Input:  x: The context to allow access to services that will store the information obtained when contacting Xero
    */
    factory = new QuickClientFactory();
    factory.init(x);
    try {
      HttpServletRequest  req          = (HttpServletRequest) x.get(HttpServletRequest.class);
      HttpServletResponse resp         = (HttpServletResponse) x.get(HttpServletResponse.class);
      DAO                 store        = (DAO) x.get("quickTokenStorageDAO");
      QuickConfig         config       = (QuickConfig) x.get("quickConfig");
      QuickTokenStorage   tokenStorage = isValidToken(x);
      QuickOauth          auth         = (QuickOauth) x.get("quickAuth");
      String              code         = req.getParameter("code");
      String              state        = req.getParameter("state");
      String              realm        = req.getParameter("realmId");
      if(code == null) {
        System.out.println(config.getClientId());
        OAuth2Config oauth2Config = factory.getOAuth2Config();
        tokenStorage.setPortalRedirect(config.getAppRedirect());
        tokenStorage.setCsrf(oauth2Config.generateCSRFToken());
        List<Scope> scopes = new ArrayList<>();
        scopes.add(Scope.Accounting);
        store.put(tokenStorage);
        resp.sendRedirect(oauth2Config.prepareUrl(scopes, tokenStorage.getPortalRedirect(), tokenStorage.getCsrf()));
      } else {
        if (tokenStorage.getCsrf().equals(state)) {
          OAuth2PlatformClient client = (OAuth2PlatformClient) auth.getOAuth();
          tokenStorage.setAuthCode(code);
          BearerTokenResponse bearerTokenResponse = client.retrieveBearerTokens(tokenStorage.getAuthCode(), tokenStorage.getPortalRedirect());
          tokenStorage.setAccessToken(bearerTokenResponse.getAccessToken());
          tokenStorage.setRefreshToken(bearerTokenResponse.getRefreshToken());
          System.out.println(bearerTokenResponse.getExpiresIn());
          tokenStorage.setRealmId(realm);
          store.put(tokenStorage);
          resp.sendRedirect("/service/quickComplete");
        }
      }
    } catch ( Exception e ) {
      e.printStackTrace();
    }
  }
}
