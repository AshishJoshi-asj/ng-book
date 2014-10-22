module.exports = function(config) {
  config.set({
    basePath: '..',
    frameworks: ['jasmine'],
    files: [
      'app/lib/angular.js',
      'app/lib/angular-route.js',
      'test/lib/angular-mocks.js',
      'app/js/**/*.js',
      'test/unit/**/*.js'
    ],
    exclude: [],
    port: 8080,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Safari'],
    singleRun: false
  });
};