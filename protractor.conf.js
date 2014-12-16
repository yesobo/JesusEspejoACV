exports.config = {
  // Remove seleniumAddress if want protractur to start the server
  //seleniumAddress: 'http://localhost:4444/wd/hub',

  specs: ['test/e2e/protractor/**/*.js'],

  baseUrl: 'http://localhost:9000', //default test port with Yeoman

  jasmineNodeOpts: {
    showColors: true
  }
}
