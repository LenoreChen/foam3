/**
 * @license
 * Copyright 2017 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  refines: 'foam.core.AbstractEnum',
  flags: ['swift'],
  axioms: [
    {
      installInClass: function(cls) {
        var toSwiftValue = function(v) {
          var type = foam.typeOf(v);

          if ( type == foam.Number ) {
            return `${v}`;
          } else if ( type == foam.String ) {
            return `"${v}"`;
          } else {
            console.log('Encountered unexpected type while outputting enum');
            debugger;
          }
        }
        var toSwiftClass = cls.toSwiftClass;
        cls.toSwiftClass =  function() {
          var self = this;
          var cls = toSwiftClass.bind(self)()
          self.VALUES.forEach(function(v) {
            cls.field(foam.swift.Field.create({
              name: v.name,
              static: true,
              visibility: 'public',
              defaultValue: `Context.GLOBAL.create(
                ${self.model_.swiftName}.self, args: [
                  ${v.cls_.getAxiomsByClass(foam.core.Property)
                      .filter(function(p) {
                        return toSwiftValue(p.get(v));
                      })
                      .map(function(p) {
                        return `"${p.name}": ${toSwiftValue(p.get(v))}`
                      }).join(',')}
                ])!`,
            }));
          });
          if ( this.model_.id != 'foam.core.AbstractEnum' ) {
            cls.method(foam.swift.Method.create({
              static: true,
              name: 'fromOrdinal',
              args: [
                foam.swift.Argument.create({
                  localName: 'o',
                  type: 'Int',
                })
              ],
              body: `
                switch o {
                  ${self.VALUES.map(function(v) {
                    return `case ${v.ordinal}: return ${v.name}`;
                  }).join('\n')}
                  default: fatalError()
                }
              `,
              returnType: self.model_.swiftName,
            }));
          }
          return cls
        };
      }
    }
  ]
});

foam.CLASS({
  refines: 'foam.core.Enum',
  properties: [
    {
      name: 'swiftToJSON',
      value: 'outputter.output(&out, (value as? AbstractEnum)?.ordinal ?? nil)'
    }
  ]
});
