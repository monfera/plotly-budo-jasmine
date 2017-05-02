// budo --live --open --host localhost index.js // cheers Ricky Reusser


// Jasmine broilerplate - can be put in a separate file

var jasmineReporters = require('jasmine-reporters');
jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(new jasmineReporters.TapReporter());

var Plotly = require('plotly.js');
var Lib = require('plotly.js/src/lib');
var d3 = require('../plotly.js/node_modules/d3');
var Plots = require('plotly.js/src/plots/plots');
var Sankey = require('plotly.js/src/traces/sankey');
var attributes = require('plotly.js/src/traces/sankey/attributes');

var createGraphDiv = function createGraphDiv() {
  var gd = document.createElement('div');
  gd.id = 'graph';
  document.body.appendChild(gd);

  // force the graph to be at position 0,0 no matter what
  gd.style.position = 'fixed';
  gd.style.left = 0;
  gd.style.top = 0;

  return gd;
};
;
//var destroyGraphDiv = require('plotly.js/test/jasmine/assets/destroy_graph_div');
//var mouseEvent = require('plotly.js/test/jasmine/assets/mouse_event');

// mock with one dimension (zero panels); special case, as no panel can be rendered
//var mock1 = require('plotly.js/test/image/mocks/sankey_1.json');

// mock with two dimensions (one panel); special case, e.g. left and right panel is obv. the same
//var mock2 = require('plotly.js/test/image/mocks/sankey_2.json');

// mock with zero dimensions; special case, as no dimension can be rendered
//var mock0 = Lib.extendDeep({}, mock1);
//mock0.data[0].dimensions = [];

//var mock = require('plotly.js/test/image/mocks/sankey_large.json');

var lineStart = 30;
var lineCount = 10;


describe('sankey', function() {


/*
  beforeAll(function() {
    mock.data[0].dimensions.forEach(function(d) {
      d.values = d.values.slice(lineStart, lineStart + lineCount);
    });
    mock.data[0].line.color = mock.data[0].line.color.slice(lineStart, lineStart + lineCount);
  });
*/

  //afterEach(destroyGraphDiv);


  describe('sankey basic', function() {

    //var mock = require('plotly.js/test/image/mocks/sankey_new.json');

    //mock.data[0].nodepad = 7;

    function breakToLines(n, s) {
      var words = s.split(/\s+/);
      var lines = [];
      for(var w = 0; w < words.length; ) {
        for(var l = 0, line = []; w < words.length && l + words[w].length <= n; w++) {
          l += words[w].length + 1;
          line.push(words[w]);
        }
        lines.push(line.join(' '));
      }
      return lines.join('<br>');
    }

    function makeMock(skip) {


      var newMock = JSON.parse(JSON.stringify(mock));

      newMock.data[0].domain = {x: [0, 1], y: [0, 1]};
      var nodes = [];
      newMock.data[0].nodes = [];
      var links = [];
      newMock.data[0].links = [];

      var dims = newMock.data[0].dimensions.slice(3, 7).reverse();

      var dim, i, j, s, t;

      for(j = 0; j < dims.length; j++) {
        dim = dims[j];
        for(i = 0; i < dim.ticktext.length; i++) {
          nodes.push({
            label: dim.ticktext[i],
            visible: true
          });
        }
      }

      // sort nodes however
      if("sort")
        nodes.sort(function(a, b) {
          return a.label < b.label
            ? -1
            : a.label > b.label
              ? 1
              : 0
        })

      var nodeLabels = nodes.map(function(d) {return d.label;});
      var narrativeDim = newMock.data[0].dimensions[0];
      var damageDim = newMock.data[0].dimensions[7];

      for(i = 0; i < dims[0].values.length; i++) {
        if(skip[i] < 0) continue;
        for(j = 1; j < dims.length; j++) {
          s = dims[j - 1];
          t = dims[j];

          links.push({
            source: nodeLabels.indexOf(s.ticktext[s.values[i]]),
            target: nodeLabels.indexOf(t.ticktext[t.values[i]]),
            value: 1,
            // label: s.ticktext[s.values[i]] + ' --> ' + t.ticktext[t.values[i]]
            label: breakToLines(50, narrativeDim.ticktext[narrativeDim.values[i]]) + '<br>'//.replace(/(.{50})/g,"$1<br>") + '<br>'
            + '<br>' + 'Damage: ' + (damageDim.values[i] ? '$' + d3.format(',.0f')(damageDim.values[i]) : 'unknown') + '<br>'
          });
        }
      }

      var aggregate = true;

      if(aggregate) {

        var agg = {}, link;
        for (i = 0; i < links.length; i++) {
          link = links[i];
          if (agg[link.source] === undefined) {
            agg[link.source] = {};
          }
          if (agg[link.source][link.target] === undefined) {
            agg[link.source][link.target] = 0;
          }
          agg[link.source][link.target] += link.value;
        }

        for (var ii in agg) {
          i = parseInt(ii);
          for (var jj in agg[i]) {
            j = parseInt(jj)
            newMock.data[0].links.push({
              visible: true,
              source: i,
              target: j,
              value: agg[i][j],
              label: s.ticktext[s.values[i]] + ' --> ' + t.ticktext[t.values[i]]
            });
          }
        }
      } else {
        for (i = 0; i < links.length; i++) {
          link = links[i];
          newMock.data[0].links.push(link);
        }
        newMock.data[0].links.sort(function(a, b) {
          return a.source < b.source
            ? -1
            : a.source > b.source
              ? 1
              : a.target < b.target
                ? -1
                : a.target > b.target
                  ? 1
                  : 0
        })
      }

      newMock.data[0].nodes = nodes;

/*
      newMock.data[0].links = newMock.data[0].links.filter(function(d) {return d.visible && d.value !== 0});
      var tmpSources = newMock.data[0].links.map(function(d) {return d.source})
      var tmpTargets = newMock.data[0].links.map(function(d) {return d.target})
      var tmpLinkedNodes = tmpSources.concat(tmpTargets).filter(function(d,i,a) {return i === a.indexOf(d)})
      newMock.data[0].nodes = newMock.data[0].nodes.filter(function(d, i) {return d.visible && tmpLinkedNodes.indexOf(i) !== -1})
*/

      delete newMock.data[0].dimensions;
      delete newMock.data[0].line;

      return newMock
    }

    fit('', function() {

      var gd = createGraphDiv();



      //mock = require('./drones.json')

      //var skip = mock.data[0].dimensions[0].values.map(function(d, i, a) {return i < a.length / 2 ? 1 : -1})

      //var newMock = makeMock(skip)
      var newMock = require('plotly.js/test/image/mocks/energy.json');

/*
      newMock.data[0].nodes = [{label: "in1"}, {label: "in2"}, {label: "out"}]
      newMock.data[0].links = [{source: 0, target: 2, value: 42, label: 'ze linq'}]
      newMock.layout.width = 300;
      newMock.layout.height = 300;
*/

      Plotly.newPlot(gd, newMock.data, newMock.layout).then(function() {
return;
        skip = mock.data[0].dimensions[0].values.map(function(d, i, a) {return  1;})
        window.setTimeout(function() {
          return
          var newThing = makeMock(skip);
          //Plotly.restyle(gd, 'nodes', [[{label: "in_1"}, {label: "out_"}]])
          Plotly.restyle(gd, 'links', [
            [
              {source: 0, target: 2, value: 42, label: 'ze linq'},
              {source: 1, target: 2, value: 42 * 0.618, label: 'ze linq'},
            ]
          ])
        }, 1000)



      });

      var s = 0;
      if(0)
      var loop = window.setInterval(function() {
/*
        for(s = 0; s < 1; s++) {
          skip[Math.floor(Math.random() * skip.length)] = 1;
        }
*/
        //skip[s++] = 1;
        if(true || s === skip.length) {
          window.clearInterval(loop);
        }
        newMock = makeMock(skip);
        Plotly.restyle(gd, 'links', [newMock.data[0].links])
      }, 1000)


      //debugger

    });

  });

  ;

  ;
});
