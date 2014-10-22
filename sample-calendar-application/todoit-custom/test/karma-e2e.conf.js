module.exports = function(config) {
  config.set({
    basePath: '..',
    frameworks: ['ng-scenario'],
    files: [
      'test/lib/angular-mocks.js',
      'test/lib/helpers.js',
      'test/e2e/**/*.js'
    ],
    exclude: [],
    port: 9001,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Safari'],
    singleRun: false,
    urlRoot: '/_karma_/',
    proxies: {
      '/': 'http://localhost:9000/'
    }
  });
};