// budo --live --open --host localhost my-first-test.js // cheers Ricky Reusser


// Jasmine broilerplate - can be put in a separate file

var jasmineReporters = require('jasmine-reporters');
jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(new jasmineReporters.TapReporter());

var gd;

function recreateGraphDiv() {

  gd = document.getElementById('graph');
  if(gd) document.body.removeChild(gd);

  gd = document.createElement('div');
  gd.id = 'graph';
  document.body.appendChild(gd);

  // force the graph to be at position 0,0 no matter what
  gd.style.position = 'fixed';
  gd.style.left = 0;
  gd.style.top = 0;
};

// Actual test file

var Plotly = require('plotly.js');
var mock = require('./mock');
var Lib = require('plotly.js/src/lib');
var d3 = require('../plotly.js/node_modules/d3');

describe('Parcoords', function() {

  beforeEach(recreateGraphDiv);

  fdescribe('final test cases to move to plotly', function() {

    it('Plotly.deleteTraces with one trace removes the plot', function(done) {

      var mockCopy = Lib.extendDeep({}, mock);

      mockCopy.data[0].line.showscale = false;

      Plotly.plot(gd, mockCopy).then(function() {

        expect(gd.data.length).toEqual(1);

        Plotly.deleteTraces(gd, 0).then(function() {
          expect(d3.selectAll('.parcoordsModel').node()).toEqual(null);
          expect(gd.data.length).toEqual(0);
          done();
        });
      });
    });

    it('Plotly.deleteTraces with two traces removes the deleted plot', function(done) {

      var mockCopy = Lib.extendDeep({}, mock);
      var mockCopy2 = Lib.extendDeep({}, mock);
      mockCopy2.data[0].dimensions.splice(3, 4);
      mockCopy.data[0].line.showscale = false;

      Plotly.plot(gd, mockCopy).then(function() {
        expect(gd.data.length).toEqual(1);
        expect(document.querySelectorAll('.panel').length).toEqual(10);
        Plotly.plot(gd, mockCopy2).then(function() {
          expect(gd.data.length).toEqual(2);
          expect(document.querySelectorAll('.panel').length).toEqual(10 + 7);
          Plotly.deleteTraces(gd, [0]).then(function() {
            expect(document.querySelectorAll('.parcoordsModel').length).toEqual(1);
            expect(document.querySelectorAll('.panel').length).toEqual(7);
            expect(gd.data.length).toEqual(1);
            Plotly.deleteTraces(gd, 0).then(function() {
              expect(document.querySelectorAll('.parcoordsModel').length).toEqual(0);
              expect(document.querySelectorAll('.panel').length).toEqual(0);
              expect(gd.data.length).toEqual(0);
              done();
            });
          });
        })
      });
    });

    fdescribe('Having two datasets', function() {

      it('Two subsequent calls to Plotly.plot should create two parcoords rows', function(done) {

        var mockCopy = Lib.extendDeep({}, mock);
        var mockCopy2 = Lib.extendDeep({}, mock);
        mockCopy2.data[0].dimensions.splice(3, 4);

        expect(document.querySelectorAll('.parcoordsModel').length).toEqual(0);

        Plotly.plot(gd, mockCopy).then(function() {

          expect(1).toEqual(1);
          expect(document.querySelectorAll('.parcoordsModel').length).toEqual(1);
          expect(gd.data.length).toEqual(1);

          Plotly.plot(gd, mockCopy2).then(function() {

            expect(1).toEqual(1);
            expect(document.querySelectorAll('.parcoordsModel').length).toEqual(2);
            expect(gd.data.length).toEqual(2);

            done();
          });
        });
      });

      it('Plotly.addTraces should add a new parcoords row', function(done) {

        var mockCopy = Lib.extendDeep({}, mock);
        var mockCopy2 = Lib.extendDeep({}, mock);
        mockCopy2.data[0].dimensions.splice(3, 4);

        expect(document.querySelectorAll('.parcoordsModel').length).toEqual(0);

        Plotly.plot(gd, mockCopy).then(function() {

          expect(document.querySelectorAll('.parcoordsModel').length).toEqual(1);
          expect(gd.data.length).toEqual(1);

          Plotly.addTraces(gd, [mockCopy2.data[0]]).then(function() {

            expect(document.querySelectorAll('.parcoordsModel').length).toEqual(2);
            expect(gd.data.length).toEqual(2);

            done();
          });
        });

      });

    })

  });

  it('', function(done) {
    var mock = {
      "data": [
        {
          "values": [
            1,
            2,
            3,
            4,
            5
          ],
          "type": "pie"
        }
      ],
      "layout": {
        "height": 300,
        "width": 400
      }
    };

    Plotly.plot(gd, mock).then(function(){
      Plotly.deleteTraces(gd, 0).then(function() {
        expect(d3.selectAll('.parcoordsModel').node()).toEqual(null);
        done();
      })
    });

  })

});
