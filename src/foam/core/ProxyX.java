/**
 * @license
 * Copyright 2017 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

package foam.core;

/** Proxy for X interface. **/
public class ProxyX
  extends    ContextAwareSupport
  implements X
{

  public ProxyX() {
    this(EmptyX.instance());
  }

  public ProxyX(X x) {
    setX(x);
  }

  public Object get(Object name) {
    return getX().get(this, name);
  }

  public Object get(X x, Object name) {
    return getX().get(x, name);
  }

  public int getInt(Object key) {
    return getInt(key, 0);
  }

  public int getInt(Object key, int defaultValue) {
    return getInt(this, key, defaultValue);
  }

  public int getInt(X x, Object key, int defaultValue) {
    return getX().getInt(x, key, defaultValue);
  }

  public X put(Object name, Object value) {
    setX(getX().put(name, value));

    return this;
  }

  public X putFactory(Object name, XFactory factory) {
    setX(getX().putFactory(name, factory));

    return this;
  }

  public Object getInstanceOf(Object value, Class type) {
    return ((FacetManager) getX().get("facetManager")).getInstanceOf(value, type, this);
  }

  public <T> T create(Class<T> type) {
    return ((FacetManager) getX().get("facetManager")).create(type, this);
  }
}
