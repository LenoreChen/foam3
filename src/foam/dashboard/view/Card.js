foam.CLASS({
  package: 'foam.dashboard.view',
  name: 'Card',
  extends: 'foam.u2.View',
  requires: [
    'foam.u2.view.SimpleAltView'
  ],
  imports: [
    'dashboardController'
  ],
  css: `
^ {
  border: 2px solid #dae1e9;
  border-radius: 2px;
  background: white;
}

^header {
  padding: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #ccc;
  font-weight: bold;
  height: 21px;
}

^display^tiny ^content {
  height: 106px;
}

^display^small ^content {
  height: 106px;
}

^display^medium ^content {
  height: 282px;
}

^display^large ^content {
  height: 458px;
}

^display^tiny {
  width: 176px;
}

^display^small {
  width: 312px;
}

^display^medium {
  width: 624px;
}

^display^large {
  width: 936px;
}
`,
  methods: [
    function initE() {
      this.onDetach(this.dashboardController.sub('dashboard', 'update', function() {
        this.data.update();
      }.bind(this)));
      this.data.update();

      var view = this;

      this.
        addClass(this.myClass()).
        addClass(this.dot('data').dot('mode').map(function(m){
          return m == 'config' ?
            view.myClass('config') :
            view.myClass('display');
        })).
        addClass(this.dot('data').dot('size').map(function(s) {
          return view.myClass(s.name);
        })).
        start('div').
        addClass(this.myClass('header')).
        add(this.data.label$).
        add(this.data.CURRENT_VIEW).
        end('div').
        start('div').
        addClass(this.myClass('content')).
        tag(this.slot(function(data$currentView) {
          return foam.u2.ViewSpec.createView(data$currentView, null, this, this.__subSubContext__);
        })).
        end('div');
//        tag(this.SimpleAltView, {
//          choices$: this.dot('data').dot('views'),
//        });
    }
  ]
});
