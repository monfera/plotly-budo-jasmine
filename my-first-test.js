// budo --live --open --host localhost my-first-test.js // cheers Ricky Reusser


// Jasmine broilerplate - can be put in a separate file

var jasmineReporters = require('jasmine-reporters');
jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(new jasmineReporters.TapReporter());


// Actual test file

var Plotly = require('plotly.js');
var mock = require('./mock');
var Lib = require('plotly.js/src/lib');

describe('Parcoords', function() {

  it('renders fine', function(done) {

    var mockCopy = Lib.extendDeep({}, mock);
    var mockCopy2 = Lib.extendDeep({}, mock);
    var gd = document.body;

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
});
