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
    var gd = document.body;

    Plotly.plot(gd, mockCopy).then(function() {

      expect(1).toEqual(1);
      expect(gd.data.length).toEqual(1);

      done();
    });
  });
});
