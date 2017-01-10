// budo --live --open --host localhost my-first-test.js // cheers Ricky Reusser


// Jasmine broilerplate - can be put in a separate file

var jasmineReporters = require('jasmine-reporters');
jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(new jasmineReporters.TapReporter());


// Actual test file

var Plotly = require('plotly.js');
var mock = require('./mock');
var Lib = require('plotly.js/src/lib');
var d3 = require('../plotly.js/node_modules/d3');

describe('Parcoords', function() {

  var gd = document.body;

  describe('final test cases to move to plotly', function() {

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
        Plotly.plot(gd, mockCopy2).then(function() {
          expect(gd.data.length).toEqual(2);
          Plotly.deleteTraces(gd, [0]).then(function() {
            expect(document.querySelectorAll('.parcoordsModel').length).toEqual(1);
            expect(gd.data.length).toEqual(1);
            Plotly.deleteTraces(gd, 0).then(function() {
              expect(document.querySelectorAll('.parcoordsModel').length).toEqual(0);
              expect(gd.data.length).toEqual(0);
              done();
            });
          });
        })
      });
    });
  });

  it('renders fine', function(done) {

    var mockCopy = Lib.extendDeep({}, mock);
    var mockCopy2 = Lib.extendDeep({}, mock);

    delete mockCopy.data[0].dimensions[0].constraintrange;
    delete mockCopy2.data[0].dimensions[0].constraintrange;
    mockCopy.data[0].dimensions[2].constraintrange = [0, 1];
    mockCopy2.data[0].dimensions[2].constraintrange = [0, 2];
    mockCopy2.layout.width = 300;

    Plotly.plot(gd, mockCopy).then(function() {

      expect(1).toEqual(1);
      expect(gd.data.length).toEqual(1);

     Plotly.plot(gd, mockCopy2).then(function() {

        expect(1).toEqual(1);
        expect(gd.data.length).toEqual(1);

        done();
      });
    });
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
