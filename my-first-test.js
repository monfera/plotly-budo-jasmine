// budo --live --open --host localhost my-first-test.js

require('plotly.js').plot(document.body, require('./mock'));

describe("whatever", function() {
  it('haha', function(done) {
    expect(1).toEqual(2);
    console.log('test executed')
    done();
  })
});