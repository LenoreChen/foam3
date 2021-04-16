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
package net.nanopay.partner.soawebservices;

import foam.core.ContextAwareSupport;
import foam.core.X;
import foam.nanos.app.AppConfig;
import foam.nanos.logger.Logger;

public class SoaWebServiceClientMock extends ContextAwareSupport implements SoaWebService {

  private Logger logger;
  private AppConfig appConfig;

  public SoaWebServiceClientMock(X x) {
    setX(x);
    logger = (Logger) x.get("logger");
    appConfig = (AppConfig) x.get("appConfig");
  }

  @Override
  public PessoaResponse pessoaFisicaNFe(PessoaFisicaNFe request) {
    if ( appConfig.getMode() != foam.nanos.app.Mode.PRODUCTION ) {
      if ( "10786348070".equals(request.getDocumento()) && "01/01/1970".equals(request.getDataNascimento()) ) {
        PessoaResponse res = new PessoaResponse();
        res.setNome("Mock Legal User");
        res.setStatus(true);
        res.setSituacaoRFB("REGULAR");
        res.setMensagemObito("");
        res.setAnoObito("0000");
        res.setResponseString("Response string here");
        return res;
      } else {
        PessoaResponse res = new PessoaResponse();
        res.setNome("");
        res.setStatus(true);
        res.setSituacaoRFB("REGULAR");
        res.setMensagemObito("");
        res.setAnoObito("0000");
        res.setResponseString("Response string here");
        return res;
      }
    } else {
      return new SoaWebServiceClient(getX()).pessoaFisicaNFe(request);
    }
  }

  @Override
  public PessoaResponse pessoaJuridicaNFe(PessoaJuridicaNFe request) {
    if ( appConfig.getMode() != foam.nanos.app.Mode.PRODUCTION  ) {
      if ( "06990590000123".equals(request.getDocumento()) ) {
        PessoaResponse res = new PessoaResponse();
        res.setNome("Mock Legal User");
        res.setSituacaoRFB("ativa");
        res.setResponseString("Response string here");
        res.setRazaoSocial("Mock Legal User");
        res.setStatus(true);
        return res;
      } else {
        PessoaResponse res = new PessoaResponse();
        res.setNome("");
        res.setSituacaoRFB("ativa");
        res.setResponseString("Response string here");
        res.setRazaoSocial("");
        res.setStatus(true);
        return res;
      }
    } else {
      return new SoaWebServiceClient(getX()).pessoaJuridicaNFe(request);
    }
  }
}