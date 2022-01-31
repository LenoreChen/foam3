/**
 * @license
 * Copyright 2021 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.parse',
  name: 'Test',
  properties: [
    'id',
    'firstName',
    'lastName',
    { class: 'FObjectProperty', of: 'foam.parse.Address', name: 'address' }
  ]
});


foam.CLASS({
  package: 'foam.parse',
  name: 'Address',
  properties: [
    'city', 'province'
  ]
});


foam.CLASS({
  package: 'foam.parse',
  name: 'FScript',

  documentation: 'A simple scripting language.',

  static: [
    function test__() {
//      var fs = foam.parse.FScript.create({of: foam.nanos.auth.User});
      var fs = foam.parse.FScript.create({of: foam.parse.Test});

      var data = foam.parse.Test.create({
        id: 42,
        firstName: 'Kevin',
        lastName: 'Greer',
        address: { city: 'Toronto', province: 'ON' }
      });

      function test(s) {
        try {
          var p = fs.parseString(s).partialEval();
          console.log(s, '->', p.toString(), '=', p.f(data));
        } catch (x) {
          console.log('ERROR: ', x);
        }
      }

      test('address.city=="Toronto"');
      test('address.city==address.province');
      test('address.city!=address.province');
      test('id==42');
      test('"Kevin"=="Kevin"');
      test('firstName=="Kevin"');
      test('firstName=="Kevin"&&lastName=="Greer"');
      test('firstName=="Kevin"||id==42');
    },

    function test2__() {
      var fs = foam.parse.FScript.create({of: foam.util.Timer});

      function test(s) {
        try {
          var p = fs.parseString(s);
          console.log(p.cls_.name, p.partialEval().toString());
        } catch (x) {
          console.log('ERROR: ', x);
        }
      }

      test('address.city=="Toronto"');
      test('address.city==address.province');
      test('id==42');
      test('"Kevin"=="Kevin"');
      test('firstName=="Kevin"');
      test('firstName=="Kevin"&&lastName=="Greer"');
      test('firstName=="Kevin"||id==42');
    }
  ],

  axioms: [
    // Reuse parsers if created for same 'of' class.
    foam.pattern.Multiton.create({property: 'of'})
  ],

  mixins: [ 'foam.mlang.Expressions' ],

  requires: [
    'foam.mlang.predicate.NamedProperty',
    'foam.parse.Alternate',
    'foam.parse.ImperativeGrammar',
    'foam.parse.Literal',
    'foam.parse.Parsers',
    'foam.parse.StringPStream'
  ],

  properties: [
    'thisValue',
    {
      class: 'Class',
      name: 'of'
    },
    {
      // The core query parser. Needs a fieldname symbol added to function
      // properly.
      name: 'baseGrammar_',
      value: function(alt, anyChar, eof, join, literal, literalIC, not, notChars, optional, range,
        repeat, repeat0, seq, seq1, str, sym, until) {
        return {
          START: sym('expr'), //seq1(0, sym('expr'), repeat0(' '), eof()),

          expr: sym('or'),

          or: repeat(sym('and'), literal('||'), 1),

          and: repeat(sym('simpleexpr'), literal('&&'), 1),

          simpleexpr: alt(
            sym('paren'),
            sym('negate'),
            sym('unary'),
            sym('comparison')
          ),

          paren: seq1(1, '(', sym('expr'), ')'),

          negate: seq(literal('!'), sym('expr')),

          subQuery: alt(sym('compoundSubQuery'), sym('simpleSubQuery')),

          comparison: seq(
            sym('value'),
            alt(
              literal('==', this.EQ),
              literal('!=', this.NEQ),
              literal('<=', this.LTE),
              literal('>=', this.GTE),
              literal('<',  this.LT),
              literal('>',  this.GT),
              literal('~',  this.REG_EXP)
            ),
            sym('value')),

          unary: seq(
            sym('value'),
            repeat0(" "),
            alt(
              literal('exists', this.HAS)
            )
          ),

          value: alt(
            sym('regex'),
            sym('date'),
            sym('string'),
            sym('number'),
            sym('fieldLen'),
            sym('field'),
          ),

          date: alt(
            // YYYY-MM-DDTHH:MM
            seq(sym('number'), '-', sym('number'), '-', sym('number'), 'T',
                sym('number'), ':', sym('number')),
            // YYYY-MM-DDTHH
            seq(sym('number'), '-', sym('number'), '-', sym('number'), 'T',
                sym('number')),
            // YYYY-MM-DD
            seq(sym('number'), '-', sym('number'), '-', sym('number')),
            // YYYY-MM
            seq(sym('number'), '-', sym('number'))
          ),

          regex:
            seq1(1,
              '/',
              str(repeat(notChars('/'))),
              '/'
            ),

          fieldLen: seq(
            sym('field'),'_len'),

          field: seq(
            sym('fieldname'),
            optional(seq('.', repeat(sym('word'), '.')))),

          string: str(seq1(1, '"',
            repeat(alt(literal('\\"', '"'), notChars('"'))),
            '"')),

          word: str(repeat(sym('char'), null, 1)),

          char: alt(
            range('a', 'z'),
            range('A', 'Z'),
            range('0', '9'),
            '-', '^', '_', '@', '%', '.'),

          number: repeat(range('0', '9'), null, 1)
        };
      }
    },
    {
      name: 'grammar_',
      factory: function() {
        const self       = this;
        const cls        = this.of;
        const fields     = [];
        const properties = cls.getAxiomsByClass(foam.core.Property);

        if ( this.thisValue !== undefined ) {
          fields.push(this.Literal.create({
            s: 'thisValue',
            value: this.thisValue
          }));
        }

        for ( var i = 0 ; i < properties.length ; i++ ) {
          var prop = properties[i];
          fields.push(this.Literal.create({
            s: prop.name,
            value: prop
          }));
        }

        // order by -length, name
        fields.sort(function(a, b) {
          var c = foam.util.compare(b.s.length, a.s.length);
          if ( c ) return c;
          return foam.util.compare(a.s, b.s);
        });

        var base = foam.Function.withArgs(
          this.baseGrammar_,
          this.Parsers.create(), this);

        var grammar = {
          __proto__: base,
          fieldname: this.Alternate.create({args: fields})
        };

        var compactToString = function(v) {
          return v.join('');
        };

        var actions = {
          negate: function(v) {
            return self.Not.create({ arg1: v[1] });
          },

          number: function(v) {
            return parseInt(compactToString(v));
          },

          comparison: function(v) {
            var lhs = v[0];
            var op  = v[1];
            var rhs = v[2];
            debugger;
            return op.call(self, lhs, rhs);
          },

          unary: function(v) {
            var lhs = v[0];
            var op  = v[2];
            debugger;
            return op.call(self, lhs);
          },

          or: function(v) { return self.OR.apply(self, v); },

          and: function(v) { return self.AND.apply(self, v); },

          field: function(v) {
            var expr = v[0];
            debugger;
            if ( v[1] && v[1][1][0] != 'len' ) {
              var parts = v[1][1];
              for ( var i = 0 ; i < parts.length ; i++ ) {
                expr = self.DOT(expr, self.NamedProperty.create({propName: parts[i]}));
              }
            }
            return expr;
          },

          fieldLen: function(v) {
          debugger;
            return foam.mlang.StringLength.create({
              arg1: v[0]
            })
          },

          regex: function(v) {
            console.log(v);
            return new RegExp(v);
          },

          date: function(v) {
          var args = [];
            for (var i = 0; i < v.length; i ++ ) {
              if ( i == 0 || i % 2 === 0 ) {
                // we assume that the input for month is human readable(january is 1 but should be 0 when creating new date)
                args.push( i == 2 ? v[i] - 1 : v[i]);
              }
            }
            console.log(args);
            debugger;
            return new Date(...args);
          }
        };

        var g = this.ImperativeGrammar.create({
          symbols: grammar
        });

        g.addActions(actions);
        return g;
      }
    }
  ],

  methods: [
    function parseString(str, opt_name) {
      var query = this.grammar_.parseString(str, opt_name);
      query = query && query.partialEval ? query.partialEval() : query;
      return query;
    }
  ]
});
