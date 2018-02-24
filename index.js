// budo --live --open --host localhost index.js // cheers Ricky Reusser


// Jasmine broilerplate - can be put in a separate file

var jasmineReporters = require('jasmine-reporters');
jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(new jasmineReporters.TapReporter());

var Plotly = require('plotly.js');
var Lib = require('plotly.js/src/lib');
var d3 = require('../plotly.js/node_modules/d3');
var Plots = require('plotly.js/src/plots/plots');
var Parcoords = require('plotly.js/src/traces/parcoords');
var attributes = require('plotly.js/src/traces/parcoords/attributes');

function createGraphDiv() {
  var gd = document.createElement('div');
  gd.id = 'graph';
  document.body.appendChild(gd);

  // force the graph to be at position 0,0 no matter what
  gd.style.position = 'fixed';
  gd.style.left = 0;
  gd.style.top = 0;

  return gd;
}
function destroyGraphDiv() { return
  var gd = document.getElementById('graph');

  if(gd) document.body.removeChild(gd);
}var mouseEvent = function(type, x, y, opts) {
  var fullOpts = {
    bubbles: true,
    clientX: x,
    clientY: y
  };

  // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
  if(opts && opts.buttons) {
    fullOpts.buttons = opts.buttons;
  }
  if(opts && opts.altKey) {
    fullOpts.altKey = opts.altKey;
  }
  if(opts && opts.ctrlKey) {
    fullOpts.ctrlKey = opts.ctrlKey;
  }
  if(opts && opts.metaKey) {
    fullOpts.metaKey = opts.metaKey;
  }
  if(opts && opts.shiftKey) {
    fullOpts.shiftKey = opts.shiftKey;
  }

  var el = (opts && opts.element) || document.elementFromPoint(x, y),
      ev;

  if(type === 'scroll') {
    ev = new window.WheelEvent('wheel', Lib.extendFlat({}, fullOpts, opts));
  } else {
    ev = new window.MouseEvent(type, fullOpts);
  }

  el.dispatchEvent(ev);

  return el;
};

// mock with one dimension (zero panels); special case, as no panel can be rendered
var mock1 = require('plotly.js/test/image/mocks/gl2d_parcoords_1.json');

// mock with two dimensions (one panel); special case, e.g. left and right panel is obv. the same
var mock2 = require('plotly.js/test/image/mocks/gl2d_parcoords_2.json');

// mock with zero dimensions; special case, as no dimension can be rendered
var mock0 = Lib.extendDeep({}, mock1);
mock0.data[0].dimensions = [];

var mock = require('plotly.js/test/image/mocks/gl2d_parcoords_large.json');

var lineStart = 0;
var lineCount = Infinity;

describe('@noCI parcoords', function() {

  beforeAll(function() {
    mock.data[0].dimensions.forEach(function(d) {
      d.values = d.values.slice(lineStart, lineStart + lineCount);
    });
    mock.data[0].line.color = mock.data[0].line.color.slice(lineStart, lineStart + lineCount);
  });

  afterEach(destroyGraphDiv);

  describe('basic use', function() {
    var mockCopy,
        gd;

    beforeEach(function(done) {
      mockCopy = Lib.extendDeep({}, mock);
      mockCopy.data[0].domain = {
        x: [0.1, 0.9],
        y: [0.05, 0.85]
      };
      gd = createGraphDiv();
      mockCopy.layout.font = {size: 10/*color: 'green', style: 'italic'*/}
      //mockCopy.data[0].labelfont = {color: 'cyan', size: 16}
      //mockCopy.data[0].dimensions[3].constraintrange = [0.9, 2.2];
      mockCopy.data.forEach(function(d) {
        d.dimensions.forEach(function(dd) {
          if(dd.constraintrange) {
            dd.constraintrange = [dd.constraintrange];
          }
        })
      })
      mockCopy.data[0].dimensions[0].constraintrange = [[75000, 100000], [150000, 175000]]
      Plotly.plot(gd, mockCopy.data, mockCopy.layout)
        //.then(function() {Plotly.restyle(gd, 'dimensions[1].constraintrange', [[[100000, 200000], [400000, 500000]]])})
        .then(function() {Plotly.restyle(gd, 'dimensions[3].constraintrange', [[[0.9, 2.2]]])})
        .then(done);
    });

    fit('`Plotly.plot` should have proper fields on `gd.data` on initial rendering', function() {

      expect(gd.data.length).toEqual(1);
      expect(gd.data[0].dimensions.length).toEqual(11);
      expect(document.querySelectorAll('.axis').length).toEqual(10); // one dimension is `visible: false`
      expect(gd.data[0].line.cmin).toEqual(-4000);
      expect(gd.data[0].dimensions[0].visible).not.toBeDefined();
      expect(gd.data[0].dimensions[4].visible).toEqual(true);
      expect(gd.data[0].dimensions[5].visible).toEqual(false);
      expect(gd.data[0].dimensions[0].range).not.toBeDefined();
      expect(gd.data[0].dimensions[0].constraintrange).toBeDefined();
      expect(gd.data[0].dimensions[0].constraintrange).toEqual([100000, 150000]);
      expect(gd.data[0].dimensions[1].range).toBeDefined();
      expect(gd.data[0].dimensions[1].range).toEqual([0, 700000]);
      expect(gd.data[0].dimensions[1].constraintrange).not.toBeDefined();

    });

  });

  ;
});
