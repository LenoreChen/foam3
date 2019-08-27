package foam.nanos.session.cron;

import foam.core.ContextAgent;
import foam.core.X;
import foam.dao.ArraySink;
import foam.dao.DAO;
import java.util.List;
import java.util.Date;
import foam.nanos.session.Session;

import static foam.mlang.MLang.*;

public class ExpireSessionsCron implements ContextAgent {

  private DAO localSessionDAO;

  @Override
  public void execute(X x) {

    localSessionDAO = (DAO) x.get("localSessionDAO");

    List<Session> expiredSessions = ((ArraySink) localSessionDAO.where(GT(Session.TTL, 0)).select(new ArraySink())).getArray();

    for ( Session session : expiredSessions ) {
      if ( session.getLastUsed().getTime() + session.getTtl() > (new Date()).getTime() ) {
        System.out.println("Destroyed expired session : " + (String) session.getId());
        localSessionDAO.remove(session);
      }
    }
  }
}
