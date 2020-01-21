package net.nanopay.fx.afex;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.apache.http.NameValuePair;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.NoConnectionReuseStrategy;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

import foam.core.ContextAwareSupport;
import foam.core.X;
import foam.lib.NetworkPropertyPredicate;
import foam.lib.json.JSONParser;
import foam.lib.json.Outputter;
import foam.nanos.logger.Logger;
import foam.nanos.logger.PrefixLogger;
import foam.nanos.om.OMLogger;
import foam.util.SafetyUtil;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class AFEXService extends ContextAwareSupport implements AFEX {

  AFEXCredentials credentials;
  private CloseableHttpClient httpClient;
  private JSONParser jsonParser;
  private Logger logger;
  private String valueDate;
  private OMLogger omLogger;

  public AFEXService(X x) {
    setX(x);
    logger = (Logger) x.get("logger");
    logger = new PrefixLogger(new Object[]{this.getClass().getSimpleName()}, logger);
    omLogger = (OMLogger) x.get("OMLogger");

    jsonParser = new JSONParser();
    jsonParser.setX(x);
  }

  protected AFEXCredentials getCredentials() {
    if ( credentials == null ) {
      credentials = (AFEXCredentials) getX().get("AFEXCredentials");
      if ( ! isCredientialsValid() ) { 
        credentials = null;
        logger.error(this.getClass().getSimpleName(), "invalid credentials");
      }
    }
    return credentials;
  }

  protected boolean isCredientialsValid() {
    return credentials != null &&
      ! SafetyUtil.isEmpty(credentials.getApiKey()) &&
      ! SafetyUtil.isEmpty(credentials.getApiPassword()) &&
      ! SafetyUtil.isEmpty(credentials.getPartnerApi()) &&
      ! SafetyUtil.isEmpty(credentials.getAFEXApi());
  }

  protected CloseableHttpClient getHttpClient() {
    if ( httpClient == null ) {
      RequestConfig requestConfig = RequestConfig.custom().setConnectionRequestTimeout(5000).build();
      httpClient = HttpClientBuilder.create().setDefaultRequestConfig(requestConfig)
        .setConnectionReuseStrategy(new NoConnectionReuseStrategy()).build(); // Untill we figure out how to handle stale connections
    }
    return httpClient;
  }

  @Override
  public Token getToken() {
    try {

      credentials = getCredentials();
      HttpPost httpPost = new HttpPost(credentials.getPartnerApi() + "token");

      httpPost.addHeader("Content-Type", "application/x-www-form-urlencoded");

      List<NameValuePair> nvps = new ArrayList<>();
      nvps.add(new BasicNameValuePair("Grant_Type", "password"));
      nvps.add(new BasicNameValuePair("Username", credentials.getApiKey()));
      nvps.add(new BasicNameValuePair("Password", credentials.getApiPassword()));

      httpPost.setEntity(new UrlEncodedFormEntity(nvps, "utf-8"));

      logger.debug("{ apiKey: " + credentials.getApiKey() + ", name: getToken " + "Request : " + EntityUtils.toString(httpPost.getEntity()));
      omLogger.log("AFEX getToken starting");

      CloseableHttpResponse httpResponse = getHttpClient().execute(httpPost);

      omLogger.log("AFEX getToken complete");

      try {
        if ( httpResponse.getStatusLine().getStatusCode() / 100 != 2 ) {
          String response = EntityUtils.toString(httpResponse.getEntity(), "UTF-8");
          String errorMsg = "AFEX get token failed: " + httpResponse.getStatusLine().getStatusCode() + " - "
            + httpResponse.getStatusLine().getReasonPhrase() + " " + response;

          logger.debug("{ apiKey: " + credentials.getApiKey() + ", name: getToken " + "response : " + response);
          logger.error(errorMsg);
          throw new RuntimeException(errorMsg);
        }

        String response = new BasicResponseHandler().handleResponse(httpResponse);
        logger.debug("{ apiKey: " + credentials.getApiKey() + ", name: getToken " + "response : " + response);
        return (Token) jsonParser.parseString(response, Token.class);
      } finally {
        httpResponse.close();
      }

    } catch (IOException e) {
      omLogger.log("AFEX getToken timeout");
      logger.error(e);
    }

    return null;
  }

  @Override
  public OnboardCorporateClientResponse onboardCorporateClient(OnboardCorporateClientRequest request) {
    try {
      credentials = getCredentials();
      HttpPost httpPost = new HttpPost(credentials.getPartnerApi() + "api/v1/corporateClient");

      httpPost.addHeader("API-Key", credentials.getApiKey());
      httpPost.addHeader("Content-Type", "application/json");
      httpPost.addHeader("Authorization", "bearer " + getToken().getAccess_token());
      
      StringEntity params = null;

      try(Outputter jsonOutputter = new Outputter(getX()).setPropertyPredicate(new NetworkPropertyPredicate()).setOutputClassNames(false)) {
    	  String requestJson = jsonOutputter.stringify(request);
          params = new StringEntity(requestJson); 
      }
      

      httpPost.setEntity(params);

      logger.debug("{ apiKey: " + credentials.getApiKey() + ", name: onboardCorporateClient " + "Request : " + EntityUtils.toString(httpPost.getEntity()));

      omLogger.log("AFEX onboardCorpateClient starting");

      logger.debug(params);

      CloseableHttpResponse httpResponse = getHttpClient().execute(httpPost);

      omLogger.log("AFEX onboardCorpateClient complete");


      try {
        if ( httpResponse.getStatusLine().getStatusCode() / 100 != 2 ) {
          String response = EntityUtils.toString(httpResponse.getEntity(), "UTF-8");
          String errorMsg = "Onboard AFEX corporate client failed: " + httpResponse.getStatusLine().getStatusCode() + " - "
            + httpResponse.getStatusLine().getReasonPhrase() + " " + response;

          logger.error(errorMsg);
          logger.debug("{ apiKey: " + credentials.getApiKey() + ", name: onboardCorporateClient " + "response : " + response);
          throw new RuntimeException(errorMsg);
        }

        String response = new BasicResponseHandler().handleResponse(httpResponse);
        logger.debug("{ apiKey: " + credentials.getApiKey() + ", name: onboardCorporateClient " + "response : " + response);
        return (OnboardCorporateClientResponse) jsonParser.parseString(response, OnboardCorporateClientResponse.class);
      } finally {
        httpResponse.close();
      }

    } catch (IOException e) {
      omLogger.log("AFEX onboardCorpateClient timeout");
      logger.error(e);
    }

    return null;
  }

  @Override
  public GetClientAccountStatusResponse getClientAccountStatus(String clientAPIKey) {
    try {
      credentials = getCredentials();
      URIBuilder uriBuilder = new URIBuilder(credentials.getPartnerApi() + "api/v1/clientstatus");
      uriBuilder.setParameter("ApiKey", clientAPIKey);

      HttpGet httpGet = new HttpGet(uriBuilder.build());

      httpGet.addHeader("API-Key", credentials.getApiKey());
      httpGet.addHeader("Content-Type", "application/x-www-form-urlencoded");
      httpGet.addHeader("Authorization", "bearer " + getToken().getAccess_token());

      logger.debug("{ apiKey: " + credentials.getApiKey() + ", name: getClientAccountStatus " + "Request : " + httpGet.toString());

      omLogger.log("AFEX getClientAccountStatus starting");

      CloseableHttpResponse httpResponse = getHttpClient().execute(httpGet);

      omLogger.log("AFEX getClientAccountStatus complete");

      try {
        if ( httpResponse.getStatusLine().getStatusCode() / 100 != 2 ) {
          String response = EntityUtils.toString(httpResponse.getEntity(), "UTF-8");
          String errorMsg = "Get AFEX Client Account Status failed: " + httpResponse.getStatusLine().getStatusCode() + " - "
            + httpResponse.getStatusLine().getReasonPhrase() + " " + response;

          logger.error(errorMsg);
          logger.debug("{ apiKey: " + credentials.getApiKey() + ", name: getClientAccountStatus " + "response : " + response);
          throw new RuntimeException(errorMsg);
        }

        String response = new BasicResponseHandler().handleResponse(httpResponse);
        logger.debug("{ apiKey: " + credentials.getApiKey() + ", name: getClientAccountStatus " + "response : " + response);

        return (GetClientAccountStatusResponse) jsonParser.parseString(response, GetClientAccountStatusResponse.class);
      } finally {
        httpResponse.close();
      }

    } catch (IOException e ) {
      omLogger.log("AFEX getClientAccountStatus timeout");
      logger.error(e);
    } catch (URISyntaxException e) {
      logger.error(e);
    }

    return null;
  }

  @Override
  public RetrieveClientAccountDetailsResponse retrieveClientAccountDetails(String clientAPIKey) {

    try {
      credentials = getCredentials();
      URIBuilder uriBuilder = new URIBuilder(credentials.getPartnerApi() + "api/v1/privateclient");
      uriBuilder.setParameter("ApiKey", clientAPIKey);

      HttpGet httpGet = new HttpGet(uriBuilder.build());

      httpGet.addHeader("API-Key", credentials.getApiKey());
      httpGet.addHeader("Content-Type", "application/x-www-form-urlencoded");
      httpGet.addHeader("Authorization", "bearer " + getToken().getAccess_token());

      logger.debug("{ apiKey: " + credentials.getApiKey() + ", name: retrieveClientAccountDetails " + "Request : " + httpGet.toString());

      omLogger.log("AFEX retrieveClientAccountDetails starting");

      CloseableHttpResponse httpResponse = getHttpClient().execute(httpGet);

      omLogger.log("AFEX retrieveClientAccountDetails complete");


      try {
        if ( httpResponse.getStatusLine().getStatusCode() / 100 != 2 ) {
          String response = EntityUtils.toString(httpResponse.getEntity(), "UTF-8");
          String errorMsg = "Retrieve AFEX client account details failed: " + httpResponse.getStatusLine().getStatusCode() + " - "
            + httpResponse.getStatusLine().getReasonPhrase() + " " + response;

          logger.error(errorMsg);
          logger.debug("{ apiKey: " + credentials.getApiKey() + ", name: retrieveClientAccountDetails " + "response : " + response);
          throw new RuntimeException(errorMsg);
        }

        String response = new BasicResponseHandler().handleResponse(httpResponse);
        logger.debug("{ apiKey: " + credentials.getApiKey() + ", name: retrieveClientAccountDetails " + "response : " + response);
        return (RetrieveClientAccountDetailsResponse) jsonParser.parseString(response, RetrieveClientAccountDetailsResponse.class);
      } finally {
        httpResponse.close();
      }

    } catch (IOException e ) {
      omLogger.log("AFEX retrieveClientAccountDetails timeout");
      logger.error(e);
    } catch (URISyntaxException e) {
      logger.error(e);
    }

    return null;
  }

  @Override
  public CreateBeneficiaryResponse createBeneficiary(CreateBeneficiaryRequest request) {
    try {
      credentials = getCredentials();
      HttpPost httpPost = new HttpPost(credentials.getAFEXApi() + "api/beneficiaryCreate");

      httpPost.addHeader("API-Key", request.getClientAPIKey());
      httpPost.addHeader("Content-Type", "application/x-www-form-urlencoded");

      List<NameValuePair> nvps = new ArrayList<>();
      nvps.add(new BasicNameValuePair("BankAccountNumber", request.getBankAccountNumber()));
      nvps.add(new BasicNameValuePair("BankCountryCode", request.getBankCountryCode()));
      nvps.add(new BasicNameValuePair("BankName", request.getBankName()));
      nvps.add(new BasicNameValuePair("BankRoutingCode", request.getBankRoutingCode()));
      nvps.add(new BasicNameValuePair("BeneficiaryAddressLine1", request.getBeneficiaryAddressLine1()));
      nvps.add(new BasicNameValuePair("BeneficiaryCity", request.getBeneficiaryCity()));
      nvps.add(new BasicNameValuePair("BeneficiaryCountryCode", request.getBeneficiaryCountryCode()));
      nvps.add(new BasicNameValuePair("BeneficiaryName", request.getBeneficiaryName()));
      nvps.add(new BasicNameValuePair("BeneficiaryPostalCode", request.getBeneficiaryPostalCode()));
      nvps.add(new BasicNameValuePair("BeneficiaryRegion", request.getBeneficiaryRegion()));
      nvps.add(new BasicNameValuePair("Currency", request.getCurrency()));
      if ( !request.getVendorId().equals("") ) nvps.add(new BasicNameValuePair("VendorId", request.getVendorId()));

      httpPost.setEntity(new UrlEncodedFormEntity(nvps, "utf-8"));


      logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: createBeneficiary " + "Request : " + EntityUtils.toString(httpPost.getEntity()));

      omLogger.log("AFEX createBeneficiary starting");

      CloseableHttpResponse httpResponse = getHttpClient().execute(httpPost);

      omLogger.log("AFEX createBeneficiary completed");


      try {
        if ( httpResponse.getStatusLine().getStatusCode() / 100 != 2 ) {
          String response = EntityUtils.toString(httpResponse.getEntity(), "UTF-8");
          String errorMsg = "Create AFEX beneficiary failed: " + httpResponse.getStatusLine().getStatusCode() + " - "
            + httpResponse.getStatusLine().getReasonPhrase() + " " + response;

          logger.error(errorMsg);
          logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: createBeneficiary " + "response : " + response);
          throw new RuntimeException(errorMsg);
        }

        String response = new BasicResponseHandler().handleResponse(httpResponse);
        logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: createBeneficiary " + "response : " + response);
        Object[] respArr = jsonParser.parseStringForArray(response, CreateBeneficiaryResponse.class);
        if ( respArr.length != 0 ) {
          return (CreateBeneficiaryResponse) respArr[0];
        }
      } finally {
        httpResponse.close();
      }

    } catch (IOException e) {
      omLogger.log("AFEX createBeneficiary timeout");
      logger.error(e);
    }

    return null;
  }

  @Override
  public UpdateBeneficiaryResponse updateBeneficiary(UpdateBeneficiaryRequest request) {

    try {
      credentials = getCredentials();
      HttpPost httpPost = new HttpPost(credentials.getAFEXApi()  + "api/beneficiaryUpdate");

      httpPost.addHeader("API-Key", request.getClientAPIKey());
      httpPost.addHeader("Content-Type", "application/x-www-form-urlencoded");

      List<NameValuePair> nvps = new ArrayList<>();
      nvps.add(new BasicNameValuePair("BankAccountNumber", request.getBankAccountNumber()));
      nvps.add(new BasicNameValuePair("BankCountryCode", request.getBankCountryCode()));
      nvps.add(new BasicNameValuePair("BankName", request.getBankName()));
      nvps.add(new BasicNameValuePair("BankRoutingCode", request.getBankRoutingCode()));
      nvps.add(new BasicNameValuePair("BeneficiaryAddressLine1", request.getBeneficiaryAddressLine1()));
      nvps.add(new BasicNameValuePair("BeneficiaryCity", request.getBeneficiaryCity()));
      nvps.add(new BasicNameValuePair("BeneficiaryCountryCode", request.getBeneficiaryCountryCode()));
      nvps.add(new BasicNameValuePair("BeneficiaryName", request.getBeneficiaryName()));
      nvps.add(new BasicNameValuePair("BeneficiaryPostalCode", request.getBeneficiaryPostalCode()));
      nvps.add(new BasicNameValuePair("BeneficiaryRegion", request.getBeneficiaryRegion()));
      nvps.add(new BasicNameValuePair("Currency", request.getCurrency()));
      nvps.add(new BasicNameValuePair("VendorId",  request.getVendorId()));

      httpPost.setEntity(new UrlEncodedFormEntity(nvps, "utf-8"));

      logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: updateBeneficiary " + "Request : " + EntityUtils.toString(httpPost.getEntity()));

      omLogger.log("AFEX updateBeneficiary starting");

      CloseableHttpResponse httpResponse = getHttpClient().execute(httpPost);

      omLogger.log("AFEX updateBeneficiary completed");

      try {
        if ( httpResponse.getStatusLine().getStatusCode() / 100 != 2 ) {
          String response = EntityUtils.toString(httpResponse.getEntity(), "UTF-8");
          String errorMsg = "Update AFEX beneficiary failed: " + httpResponse.getStatusLine().getStatusCode() + " - "
            + httpResponse.getStatusLine().getReasonPhrase() + " " + response;

          logger.error(errorMsg);
          logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: updateBeneficiary " + "response : " + response);
          throw new RuntimeException(errorMsg);
        }

        String response = new BasicResponseHandler().handleResponse(httpResponse);
        logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: updateBeneficiary " + "response : " + response);
        Object[] respArr = jsonParser.parseStringForArray(response, UpdateBeneficiaryResponse.class);
        if ( respArr.length != 0 ) {
          for ( Object resp : respArr) {
            UpdateBeneficiaryResponse updateBeneficiaryResponse = (UpdateBeneficiaryResponse) resp;
            if ( updateBeneficiaryResponse.getName().equals("Beneficiary has been updated") ) {
              return updateBeneficiaryResponse;
            }
          }
        }
      } finally {
        httpResponse.close();
      }

    } catch (IOException e) {
      omLogger.log("AFEX updateBeneficiary timeout");
      logger.error(e);
    }

    return null;
  }

  @Override
  public String disableBeneficiary(DisableBeneficiaryRequest request) {
    try {
      credentials = getCredentials();
      URIBuilder uriBuilder = new URIBuilder(credentials.getAFEXApi()  + "api/beneficiaryDisable");
      uriBuilder.setParameter("VendorId", request.getVendorId());

      HttpPost httpPost = new HttpPost(uriBuilder.build());

      httpPost.addHeader("API-Key", request.getClientAPIKey());
      httpPost.addHeader("Content-Type", "application/x-www-form-urlencoded");

      logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: disableBeneficiary " + "Request : " + EntityUtils.toString(httpPost.getEntity()));

      omLogger.log("AFEX disableBeneficiary starting");

      CloseableHttpResponse httpResponse = getHttpClient().execute(httpPost);

      omLogger.log("AFEX disableBeneficiary completed");

      try {
        if ( httpResponse.getStatusLine().getStatusCode() / 100 != 2 ) {
          String response = EntityUtils.toString(httpResponse.getEntity(), "UTF-8");
          String errorMsg = "Disable AFEX beneficiary failed: " + httpResponse.getStatusLine().getStatusCode() + " - "
            + httpResponse.getStatusLine().getReasonPhrase() + " " + response;

          logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: disableBeneficiary " + "response : " + response);
          throw new RuntimeException(errorMsg);
        }

        String response = new BasicResponseHandler().handleResponse(httpResponse);
        logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: disableBeneficiary " + "response : " + response);
        return response.substring(1, response.length() - 1);
      } finally {
        httpResponse.close();
      }

    } catch (IOException e ) {
      omLogger.log("AFEX disableBeneficiary timeout");
      logger.error(e);
    } catch (URISyntaxException e) {
      logger.error(e);
    }

    return null;
  }

  @Override
  public FindBeneficiaryResponse findBeneficiary(FindBeneficiaryRequest request) {
    try {
      credentials = getCredentials();
      URIBuilder uriBuilder = new URIBuilder(credentials.getAFEXApi()  + "api/beneficiary/find");
      uriBuilder.setParameter("VendorId", request.getVendorId());

      HttpGet httpGet = new HttpGet(uriBuilder.build());

      httpGet.addHeader("API-Key", request.getClientAPIKey());
      httpGet.addHeader("Content-Type", "application/json");

      logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: findBeneficiary " + "Request : " + httpGet.toString());

      omLogger.log("AFEX findBeneficiary starting");
      CloseableHttpResponse httpResponse = getHttpClient().execute(httpGet);
      omLogger.log("AFEX findBeneficiary completed");

      try {
        if ( httpResponse.getStatusLine().getStatusCode() / 100 != 2 ) {
          String response = EntityUtils.toString(httpResponse.getEntity(), "UTF-8");
          String errorMsg = "Get AFEX payee information failed: " + httpResponse.getStatusLine().getStatusCode() + " - "
            + httpResponse.getStatusLine().getReasonPhrase() + " " + response;

          logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: findBeneficiary " + "response : " + response);
          throw new RuntimeException(errorMsg);
        }

        String response = new BasicResponseHandler().handleResponse(httpResponse);
        logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: findBeneficiary " + "response : " + response);
        return (FindBeneficiaryResponse) jsonParser.parseString(response, FindBeneficiaryResponse.class);
      } finally {
        httpResponse.close();
      }

    } catch (IOException e  ) {
      omLogger.log("AFEX findBeneficiary timeout");
      logger.error(e);
    } catch (URISyntaxException e) {
      logger.error(e);
    }
    return null;
  }

  @Override
  public FindBankByNationalIDResponse findBankByNationalID(FindBankByNationalIDRequest request) {
    try {
      credentials = getCredentials();
      HttpPost httpPost = new HttpPost(credentials.getAFEXApi()  + "api/nationalid/find");

      httpPost.addHeader("API-Key", request.getClientAPIKey());
      httpPost.addHeader("Content-Type", "application/x-www-form-urlencoded");

      List<NameValuePair> nvps = new ArrayList<>();
      nvps.add(new BasicNameValuePair("CountryCode", request.getCountryCode()));
      nvps.add(new BasicNameValuePair("NationalID", request.getNationalID()));

      httpPost.setEntity(new UrlEncodedFormEntity(nvps, "utf-8"));

      logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: findBankByNationalID " + "Request : " + EntityUtils.toString(httpPost.getEntity()));

      omLogger.log("AFEX findBankByNationalID starting");

      CloseableHttpResponse httpResponse = getHttpClient().execute(httpPost);

      omLogger.log("AFEX findBankByNationalID completed");

      try {
        if ( httpResponse.getStatusLine().getStatusCode() / 100 != 2 ) {
          String response = EntityUtils.toString(httpResponse.getEntity(), "UTF-8");
          String errorMsg = "Find bank by national ID failed: " + httpResponse.getStatusLine().getStatusCode() + " - "
            + httpResponse.getStatusLine().getReasonPhrase() + " " + response;

          logger.error(errorMsg);
          logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: findBankByNationalID " + "response : " + response);
          throw new RuntimeException(errorMsg);
        }

        String response = new BasicResponseHandler().handleResponse(httpResponse);
        logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: findBankByNationalID " + "response : " + response);
        Object[] respArr = jsonParser.parseStringForArray(response, FindBankByNationalIDResponse.class);

        if ( respArr.length != 0 ) {
          return (FindBankByNationalIDResponse) respArr[0];
        }
      } finally {
        httpResponse.close();
      }

    } catch (IOException e) {
      omLogger.log("AFEX findBankByNationalID timeout");
      logger.error(e);
    }

    return null;
  }

  @Override
  public String getValueDate(String currencyPair, String valueType,  String businessApiKey) {
    try {
      credentials = getCredentials();
      URIBuilder uriBuilder = new URIBuilder(credentials.getAFEXApi()  + "api/valuedates");
      uriBuilder.setParameter("CurrencyPair", currencyPair)
                .setParameter("ValueType", valueType);

      HttpGet httpGet = new HttpGet(uriBuilder.build());

      httpGet.addHeader("API-Key", businessApiKey);
      httpGet.addHeader("Content-Type", "application/json");

      logger.debug("{ apiKey: " + businessApiKey + ", name: getValueDate " + "Request : " + httpGet.toString());

      omLogger.log("AFEX getValueDate starting");

      CloseableHttpResponse httpResponse = getHttpClient().execute(httpGet);

      omLogger.log("AFEX getValueDate completed");


      try {
        if ( httpResponse.getStatusLine().getStatusCode() / 100 != 2 ) {
          String response = EntityUtils.toString(httpResponse.getEntity(), "UTF-8");
          String errorMsg = "Get AFEX value date information failed: " + httpResponse.getStatusLine().getStatusCode() + " - "
            + httpResponse.getStatusLine().getReasonPhrase() + " " + response;

          logger.error(errorMsg);
          logger.debug("{ apiKey: " + businessApiKey + ", name: getValueDate " + "Request : " + response);
          throw new RuntimeException(errorMsg);
        }

        String response = new BasicResponseHandler().handleResponse(httpResponse);
        logger.debug("{ apiKey: " + businessApiKey + ", name: getValueDate " + "Request : " + response);
        return response.substring(1, response.length() - 1);
      } finally {
        httpResponse.close();
      }

    } catch (IOException e ) {
      omLogger.log("AFEX getValueDate timeout");
      logger.error(e);
    } catch (URISyntaxException e) {
      logger.error(e);
    }

    return null;
  }

  @Override
  public GetRateResponse getRate(GetRateRequest request) {
    try {
      credentials = getCredentials();
      URIBuilder uriBuilder = new URIBuilder(credentials.getAFEXApi()  + "api/rates");
      uriBuilder.setParameter("CurrencyPair", request.getCurrencyPair());
      if ( !request.getValueType().equals("") ) uriBuilder.setParameter("ValueType", request.getValueType());

      HttpGet httpGet = new HttpGet(uriBuilder.build());
      httpGet.addHeader("API-Key", request.getClientAPIKey());
      httpGet.addHeader("Content-Type", "application/json");

      logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: getRate " + "Request : " + httpGet.toString());

      omLogger.log("AFEX getRate starting");

      CloseableHttpResponse httpResponse = getHttpClient().execute(httpGet);

      omLogger.log("AFEX getRate completed");


      try {
        if ( httpResponse.getStatusLine().getStatusCode() / 100 != 2 ) {
          String response = EntityUtils.toString(httpResponse.getEntity(), "UTF-8");
          String errorMsg = "Get AFEX rate failed: " + httpResponse.getStatusLine().getStatusCode() + " - "
            + httpResponse.getStatusLine().getReasonPhrase() + " " + response;

          logger.error(errorMsg);
          logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: getRate " + "response : " + response);
          throw new RuntimeException(errorMsg);
        }

        String response = new BasicResponseHandler().handleResponse(httpResponse);
        logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: getRate " + "response : " + response);
        return (GetRateResponse) jsonParser.parseString(response, GetRateResponse.class);
      } finally {
        httpResponse.close();
      }

    } catch (IOException e) {
      omLogger.log("AFEX getRate timeout");
      logger.error(e);
    } catch (URISyntaxException e) {
      logger.error(e);
    }

    return null;
  }

  @Override
  public Quote getQuote(GetQuoteRequest request) {
    logger.debug("Entered getquote", request);
    try {
      credentials = getCredentials();
      URIBuilder uriBuilder = new URIBuilder(credentials.getAFEXApi()  + "api/quote");
      uriBuilder.setParameter("CurrencyPair", request.getCurrencyPair())
        .setParameter("ValueDate", request.getValueDate())
        .setParameter("Amount", request.getAmount());
      if ( !request.getOptionDate().equals("") ) uriBuilder.setParameter("OptionDate", request.getOptionDate());

      HttpGet httpGet = new HttpGet(uriBuilder.build());
      httpGet.addHeader("API-Key", request.getClientAPIKey());
      httpGet.addHeader("Content-Type", "application/json");

      omLogger.log("AFEX getQuote starting");

      logger.debug("before execute");

      logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: getQuote " + "Request : " + httpGet.toString());
      CloseableHttpResponse httpResponse = getHttpClient().execute(httpGet);

      omLogger.log("AFEX getQuote complete");
      logger.debug("after execute", httpResponse);

      try {
        if ( httpResponse.getStatusLine().getStatusCode() / 100 != 2 ) {
          String response = EntityUtils.toString(httpResponse.getEntity(), "UTF-8");
          String errorMsg = "Get AFEX quote failed: " + httpResponse.getStatusLine().getStatusCode() + " - "
            + httpResponse.getStatusLine().getReasonPhrase() + " " + response;

          logger.error(errorMsg);
          logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: getQuote " + "Request : " + response);
          throw new RuntimeException(errorMsg);
        }
        String response = new BasicResponseHandler().handleResponse(httpResponse);
        logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: getQuote " + "Request : " + response);
        return (Quote) jsonParser.parseString(response, Quote.class);
      } finally {
        httpResponse.close();
      }

    } catch (IOException e ) {
      omLogger.log("AFEX getQuote timeout");
      logger.error("AFEX GetQoute failed",e);
    } catch (URISyntaxException e) {
      logger.error("AFEX GetQoute failed",e);
    }

    return null;
  }

  @Override
  public CreateTradeResponse createTrade(CreateTradeRequest request) {
    try {
      HttpPost httpPost = new HttpPost(getCredentials().getAFEXApi()  + "api/trades/create");

      httpPost.addHeader("API-Key", request.getClientAPIKey());
      httpPost.addHeader("Content-Type", "application/x-www-form-urlencoded");

      BasicNameValuePair accountNumber = new BasicNameValuePair("AccountNumber", request.getAccountNumber());
      List<NameValuePair> nvps = new ArrayList<>();
      nvps.add(new BasicNameValuePair("Amount", request.getAmount()));
      nvps.add(new BasicNameValuePair("QuoteID", request.getQuoteID()));
      nvps.add(new BasicNameValuePair("SettlementCcy", request.getSettlementCcy()));
      nvps.add(new BasicNameValuePair("TradeCcy", request.getTradeCcy()));
      nvps.add(new BasicNameValuePair("ValueDate", request.getValueDate()));
      nvps.add(accountNumber);
      nvps.add(new BasicNameValuePair("IsAmountSettlement", request.getIsAmountSettlement()));

      httpPost.setEntity(new UrlEncodedFormEntity(nvps, "utf-8"));

      logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: createTrade1 " + "Request : " + EntityUtils.toString(httpPost.getEntity()));

      omLogger.log("AFEX createTrade starting");

      CloseableHttpResponse httpResponse = getHttpClient().execute(httpPost);

      omLogger.log("AFEX createTrade completed");

      CloseableHttpResponse httpResponse2 = null;

      try {
        if ( httpResponse.getStatusLine().getStatusCode() / 100 != 2 ) {
          String response = EntityUtils.toString(httpResponse.getEntity(), "UTF-8");
          String errorMsg = "Create AFEX trade with account number failed: " + httpResponse.getStatusLine().getStatusCode() + " - "
            + httpResponse.getStatusLine().getReasonPhrase() + " " + response;
          logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: createTrade1 non 200 " + "Response : " + response);

          // try again without account number
          if ( response.toLowerCase().contains("account number") ) {
            nvps.remove(accountNumber);
            nvps.add(new BasicNameValuePair("Note", request.getNote()));
            httpPost.setEntity(new UrlEncodedFormEntity(nvps, "utf-8"));

            logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: createTrade2 " + "Request : " + EntityUtils.toString(httpPost.getEntity()));
            omLogger.log("AFEX createTrade starting");

            httpResponse2 = getHttpClient().execute(httpPost);

            omLogger.log("AFEX createTrade completed");

            if (httpResponse2.getStatusLine().getStatusCode() / 100 != 2) {
              String response2 = EntityUtils.toString(httpResponse2.getEntity(), "UTF-8");
              String errorMsg2 = "Create AFEX trade failed: " + httpResponse2.getStatusLine().getStatusCode() + " - "
                + httpResponse2.getStatusLine().getReasonPhrase() + " " + response2;
              logger.error(errorMsg2);
              logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: createTrade2 non 200 " + "Response : " + response2);
              throw new RuntimeException(errorMsg2);
            }
            httpResponse = httpResponse2;
          } else {
            logger.error(errorMsg);
            throw new RuntimeException(errorMsg);
          }
        }
        String response = new BasicResponseHandler().handleResponse(httpResponse);
        logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: createTrade" + "Response : " + response);
        return (CreateTradeResponse) jsonParser.parseString(response, CreateTradeResponse.class);
      } finally {
        httpResponse.close();
        if ( httpResponse2 != null ) {
          httpResponse2.close();
        }
      }

    } catch (IOException e) {
      omLogger.log("AFEX createTrade timeout");
      logger.error(e);
    }

    return null;
  }

  @Override
  public CheckTradeStatusResponse checkTradeStatus(CheckTradeStatusRequest request) {
    try {
      URIBuilder uriBuilder = new URIBuilder(getCredentials().getAFEXApi()  + "api/trades");
      uriBuilder.setParameter("Id", request.getId());

      HttpGet httpGet = new HttpGet(uriBuilder.build());
      httpGet.addHeader("API-Key", request.getClientAPIKey());
      httpGet.addHeader("Content-Type", "application/json");

      logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: checkTradeStatus " + "Request : " + httpGet.toString());

      omLogger.log("AFEX checkTradeStatus starting");

      CloseableHttpResponse httpResponse = getHttpClient().execute(httpGet);

      omLogger.log("AFEX checkTradeStatus completed");


      try {
        if ( httpResponse.getStatusLine().getStatusCode() / 100 != 2 ) {
          String response = EntityUtils.toString(httpResponse.getEntity(), "UTF-8");
          String errorMsg = "Check AFEX trade status failed: " + httpResponse.getStatusLine().getStatusCode() + " - "
            + httpResponse.getStatusLine().getReasonPhrase() + " " + response;

          logger.error(errorMsg);
          logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: checkTradeStatus " + "Response : " + response);
          throw new RuntimeException(errorMsg);
        }

        String response = new BasicResponseHandler().handleResponse(httpResponse);
        logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: checkTradeStatus " + "Response : " + response);
        return (CheckTradeStatusResponse) jsonParser.parseString(response, CheckTradeStatusResponse.class);
      } finally {
        httpResponse.close();
      }

    } catch (IOException e) {
      omLogger.log("AFEX checkTradeStatus timeout");
      logger.error(e);
    } catch (URISyntaxException e) {
      logger.error(e);
    }

    return null;
  }

  @Override
  public CreatePaymentResponse createPayment(CreatePaymentRequest request) {
    try {
      HttpPost httpPost = new HttpPost(getCredentials().getAFEXApi()  + "api/payments/create");

      httpPost.addHeader("API-Key", request.getClientAPIKey());
      httpPost.addHeader("Content-Type", "application/x-www-form-urlencoded");

      List<NameValuePair> nvps = new ArrayList<>();
      nvps.add(new BasicNameValuePair("Amount", request.getAmount()));
      nvps.add(new BasicNameValuePair("Currency", request.getCurrency()));
      nvps.add(new BasicNameValuePair("PaymentDate", request.getPaymentDate()));
      nvps.add(new BasicNameValuePair("VendorId", request.getVendorId()));

      httpPost.setEntity(new UrlEncodedFormEntity(nvps, "utf-8"));

      logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: createPayment " + "Request : " + EntityUtils.toString(httpPost.getEntity()));

      omLogger.log("AFEX createPayment starting");

      CloseableHttpResponse httpResponse = getHttpClient().execute(httpPost);

      omLogger.log("AFEX createPayment completed");


      try {
        if ( httpResponse.getStatusLine().getStatusCode() / 100 != 2 ) {
          String response = EntityUtils.toString(httpResponse.getEntity(), "UTF-8");
          String errorMsg = "Create AFEX payment failed: " + httpResponse.getStatusLine().getStatusCode() + " - "
            + httpResponse.getStatusLine().getReasonPhrase() + " " + response;

          logger.error(errorMsg);
          logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: createPayment " + "Response : " + response);
          throw new RuntimeException(errorMsg);
        }

        String response = new BasicResponseHandler().handleResponse(httpResponse);
        logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: createPayment " + "Response : " + response);
        return (CreatePaymentResponse) jsonParser.parseString(response, CreatePaymentResponse.class);
      } finally {
        httpResponse.close();
      }

    } catch (IOException e) {
      omLogger.log("AFEX createPayment timeout");
      logger.error(e);
    }

    return null;
  }

  @Override
  public CheckPaymentStatusResponse checkPaymentStatus(CheckPaymentStatusRequest request) {
    try {
      URIBuilder uriBuilder = new URIBuilder(getCredentials().getAFEXApi()  + "api/payments");
      uriBuilder.setParameter("Id", request.getId());

      HttpGet httpGet = new HttpGet(uriBuilder.build());
      httpGet.addHeader("API-Key", request.getClientAPIKey());
      httpGet.addHeader("Content-Type", "application/json");

      logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: checkPaymentStatus " + "Request : " + httpGet.toString());

      omLogger.log("AFEX checkPaymentStatus starting");

      CloseableHttpResponse httpResponse = getHttpClient().execute(httpGet);

      omLogger.log("AFEX checkPaymentStatus completed");


      try {
        if ( httpResponse.getStatusLine().getStatusCode() / 100 != 2 ) {
          String response = EntityUtils.toString(httpResponse.getEntity(), "UTF-8");
          String errorMsg = "Check AFEX payment status failed: " + httpResponse.getStatusLine().getStatusCode() + " - "
            + httpResponse.getStatusLine().getReasonPhrase() + " " + response;

          logger.error(errorMsg);
          logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: checkPaymentStatus " + "Response : " + response);
          throw new RuntimeException(errorMsg);
        }

        String response = new BasicResponseHandler().handleResponse(httpResponse);
        logger.debug("{ apiKey: " + request.getClientAPIKey() + ", name: checkPaymentStatus " + "Response : " + response);
        return (CheckPaymentStatusResponse) jsonParser.parseString(response, CheckPaymentStatusResponse.class);
      } finally {
        httpResponse.close();
      }

    } catch (IOException e ) {
      omLogger.log("AFEX checkPaymentStatus timeout");
      logger.error(e);
    } catch (URISyntaxException e) {
      logger.error(e);
    }

    return null;
  }

  @Override
  public byte[] getTradeConfirmation(GetConfirmationPDFRequest confirmationPDFRequest) {

    OkHttpClient client = new OkHttpClient.Builder()
      .connectTimeout(15, TimeUnit.SECONDS)
      .writeTimeout(15, TimeUnit.SECONDS)
      .readTimeout(30, TimeUnit.SECONDS)
    .build();
    Response response = null;

    Request request = new Request.Builder()
      .header("Content-Type", "application/json")
      .header("API-Key", confirmationPDFRequest.getClientAPIKey())
      .url(getCredentials().getAFEXApi()  + "api/confirmations?TradeNumber=" + confirmationPDFRequest.getTradeNumber())
      .build();

    logger.debug("{ apiKey: " + confirmationPDFRequest.getClientAPIKey() + ", name: getTradeConfirmation " + "Request : " + request.toString());

    try {
      response = client.newCall(request).execute();
      byte[] bytes = response.body().bytes();

      logger.debug("{ apiKey: " + confirmationPDFRequest.getClientAPIKey() + ", name: getTradeConfirmation " + "Response recieved" );
      return bytes;

    } catch (IOException e) {
      omLogger.log("AFEX checkPaymentStatus timeout");
      logger.error(e);
    } 
    catch ( Throwable t ) {
      logger.error(t);

    } finally {
      if ( response != null ) {
        response.close();
      }
    }

    return null;
  }

  @Override
  public String directDebitEnrollment(DirectDebitEnrollmentRequest directDebitRequest) {
    try {
      credentials = getCredentials();
      HttpPost httpPost = new HttpPost(credentials.getPartnerApi() + "api/v1/DirectDebitEnroll");

      httpPost.addHeader("API-Key", credentials.getApiKey());
      httpPost.addHeader("Content-Type", "application/json");
      httpPost.addHeader("Authorization", "bearer " + getToken().getAccess_token());

      StringEntity params = null;

      try(Outputter jsonOutputter = new Outputter(getX()).setPropertyPredicate(new NetworkPropertyPredicate()).setOutputClassNames(false)) {
        String requestJson = jsonOutputter.stringify(directDebitRequest);
        params =new StringEntity(requestJson);
      } catch(Exception e) {
        logger.error(e);
      }

      httpPost.setEntity(params);

      logger.debug("{ apiKey: " + credentials.getApiKey() + ", name: directDebitEnrollment " + "Request : " + EntityUtils.toString(httpPost.getEntity()));

      omLogger.log("AFEX directDebitEnrollment starting");

      logger.debug(params);

      CloseableHttpResponse httpResponse = getHttpClient().execute(httpPost);

      omLogger.log("AFEX directDebitEnrollment complete");


      try {
        if ( httpResponse.getStatusLine().getStatusCode() / 100 != 2 ) {
          String response = EntityUtils.toString(httpResponse.getEntity(), "UTF-8");
          String errorMsg = "AFEX directDebitEnrollment  failed: " + httpResponse.getStatusLine().getStatusCode() + " - "
            + httpResponse.getStatusLine().getReasonPhrase() + " " + response;

          logger.error(errorMsg);
          logger.debug("{ apiKey: " + credentials.getApiKey() + ", name: directDebitEnrollment " + "response : " + response);
          throw new RuntimeException(errorMsg);
        }

        String response = new BasicResponseHandler().handleResponse(httpResponse);
        logger.debug("{ apiKey: " + credentials.getApiKey() + ", name: directDebitEnrollment " + "response : " + response);
        return response;
      } finally {
        httpResponse.close();
      }
    } catch (IOException e) {
      omLogger.log("AFEX directDebitEnrollment timeout");
      logger.error(e);
    }

    return null;
  }

  @Override
  public String directDebitUnenrollment(DirectDebitUnenrollmentRequest directDebitUnenrollmentRequest) {
    try {
      credentials = getCredentials();
      HttpPost httpPost = new HttpPost(credentials.getPartnerApi() + "api/v1/DirectDebitUnequicnroll");

      httpPost.addHeader("API-Key", credentials.getApiKey());
      httpPost.addHeader("Content-Type", "application/json");
      httpPost.addHeader("Authorization", "bearer " + getToken().getAccess_token());

      StringEntity params = null;
      
      try(Outputter jsonOutputter = new Outputter(getX()).setPropertyPredicate(new NetworkPropertyPredicate()).setOutputClassNames(false)) {
        String requestJson = jsonOutputter.stringify(directDebitUnenrollmentRequest);
        params = new StringEntity(requestJson);
      } catch (Exception e) {
        logger.error(e);
      }

      httpPost.setEntity(params);

      logger.debug("{ apiKey: " + credentials.getApiKey() + ", name: directDebitUnenrollmentRequest " + "Request : " + EntityUtils.toString(httpPost.getEntity()));

      omLogger.log("AFEX directDebitUnenrollmentRequest starting");

      logger.debug(params);

      CloseableHttpResponse httpResponse = getHttpClient().execute(httpPost);

      omLogger.log("AFEX directDebitUnenrollmentRequest complete");


      try {
        if ( httpResponse.getStatusLine().getStatusCode() / 100 != 2 ) {
          String response = EntityUtils.toString(httpResponse.getEntity(), "UTF-8");
          String errorMsg = "AFEX directDebitEnrollment  failed: " + httpResponse.getStatusLine().getStatusCode() + " - "
            + httpResponse.getStatusLine().getReasonPhrase() + " " + response;

          logger.error(errorMsg);
          logger.debug("{ apiKey: " + credentials.getApiKey() + ", name: directDebitUnenrollmentRequest " + "response : " + response);
          throw new RuntimeException(errorMsg);
        }

        String response = new BasicResponseHandler().handleResponse(httpResponse);
        logger.debug("{ apiKey: " + credentials.getApiKey() + ", name: directDebitUnenrollmentRequest " + "response : " + response);
        return response;
      } finally {
        httpResponse.close();
      }

    } catch (IOException e) {
      omLogger.log("AFEX directDebitUnenrollmentRequest timeout");
      logger.error(e);
    }

    return null;
  }
}
