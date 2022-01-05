/**
 * @license
 * Copyright 2021 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

package foam.nanos.app;

import foam.core.X;
import foam.dao.DAO;
import foam.nanos.http.WebAgent;
import foam.nanos.http.Format;
import foam.nanos.http.HttpParameters;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;
import foam.lib.json.OutputterMode;
import foam.lib.xml.Outputter;

/**
   Report most current Health
 */
public class HealthWebAgent
  implements WebAgent
{
  @Override
  public void execute(X x) {
    PrintWriter         out      = x.get(PrintWriter.class);
    HttpServletResponse response = x.get(HttpServletResponse.class);
    HttpParameters      p       = x.get(HttpParameters.class);
    Format              format  = (Format) p.get(Format.class);

    Health health = (Health) x.get("Health");
    if ( health.getStatus() == HealthStatus.UP ) {
      response.setStatus(HttpServletResponse.SC_OK);
    } else {
      response.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
    }

    if ( format == Format.JSON ) {
      foam.lib.json.Outputter outputterJson = new foam.lib.json.Outputter(x)
        .setPropertyPredicate(
                              new foam.lib.AndPropertyPredicate(x,
                                                                new foam.lib.PropertyPredicate[] {
                                                                  new foam.lib.ExternalPropertyPredicate(),
                                                                  new foam.lib.NetworkPropertyPredicate(),
                                                                  new foam.lib.PermissionedPropertyPredicate()}));

      outputterJson.setOutputDefaultValues(true);
      outputterJson.setOutputClassNames(false);
      outputterJson.setOutputDefaultClassNames(false);
      outputterJson.setMultiLine(true);

      outputterJson.output(health);

      response.setContentType("application/json");
      out.println(outputterJson.toString());
    } else if( format == Format.XML ) {
      response.setContentType("application/xml");
      Outputter outputter = new Outputter(out, OutputterMode.NETWORK);
      out.println(outputter.stringify(health));
    } else {
      response.setContentType("text/plain");
      out.println(health.getStatus().getLabel());
    }
  }
}
