/**
 * @license
 * Copyright 2019 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.nanos.doc',
  name: 'DocumentationView',
  extends: 'foam.u2.View',

  imports: [
    'memento'
  ],

  requires: [
    'foam.nanos.controller.Memento'
  ],

  css: `
    ^ table { width: 100%; }
    ^ td , ^ th {
      text-align: left;
      padding: 8pt;
    }
    ^ th {
      font-weight: bold;
      background-color: #E0E0E0;
    }
    ^ tr:nth-child(even) td:nth-child(odd) {
      background-color: #F5F5F5;
    }
    ^ tr:nth-child(even) td:nth-child(even) {
      background-color: #F0F0F0;
    }
    ^ tr:nth-child(odd) td:nth-child(even) {
      background-color: #F7F7F7;
    }
  `,

  properties: [
    {
      class: 'String',
      name: 'docKey',
      documentation: 'ID of the document to render.',
      postSet: function(o, n) {
        if ( o != n ) this.data = undefined;
      }
    },
    {
      class: 'String',
      name: 'daoKey',
      value: 'documentDAO'
    },
    {
      class: 'String',
      name: 'anchor'
    },
    {
      name: 'data'
    },
    'error'
  ],

  methods: [
    function init() {
      this.launchDoc();
    },
    function render() {
      this.onDetach(this.memento.tail$.sub(this.launchDoc));
      var dao = this.__context__[this.daoKey];
      this.addClass();
      if ( ! dao ) {
        this.add('No DAO found for key: ', this.daoKey);
      } else this.add(this.slot(function(data, error, docKey) {
        if ( ! data && ! error) {
          dao.find(this.docKey).then(function(doc) {
            if ( doc ) this.data = doc;
            else this.error = 'Not found.';
          }.bind(this), function(e) {
            this.error = e.message ? e.message : '' + e;
          }.bind(this));
          return this.E('span').add('Loading...');
        }
        if ( ! data ) {
          return this.E('span').add(this.error);
        }
        return data.toE(null, this.__subSubContext__);
      }));
    }
  ],
  listeners: [
    function launchDoc() {
      var tmp = this.memento.value.split(this.Memento.SEPARATOR);
      this.docKey = tmp.length > 1 && tmp[1];
    }
  ]
});
