/**
 * @license
 * Copyright 2022 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.nanos.ruler.predicate',
  name: 'PropertyImplements',

  documentation: 'Returns true if property propName is instanceof of',

  extends: 'foam.mlang.predicate.AbstractPredicate',
  implements: ['foam.core.Serializable'],

  javaImports: [
    'foam.core.FObject',
    'static foam.mlang.MLang.*'
  ],
  properties: [
    {
      class: 'String',
      name: 'propName'
    },
    {
      class: 'String',
      name: 'interfaceClass',
      documentation: 'interface that we want to check if the object implements'
    },
    {
      class: 'Boolean',
      name: 'isNew',
      value: true
    }
  ],
  methods: [
    {
      name: 'f',
      javaCode: `
      Boolean b = false;
      if ( getIsNew() ) {
        FObject nu  = (FObject) NEW_OBJ.f(obj);
        try {
          b = Class.forName(getInterfaceClass()).isInstance(nu.getProperty(getPropName()));
          return b;
        }
        catch(Exception e) {}
      }
      FObject old = (FObject) OLD_OBJ.f(obj);
      if ( old != null ) {
        try {
          return Class.forName(getInterfaceClass()).isInstance(old.getProperty(getPropName()));
        }
        catch(Exception E) {}
      }
      return b;
      `
    }
  ]
});
