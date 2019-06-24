// karma.conf.ts
module.exports = (config) => {
    config.set({
      basePath: './src',
        frameworks: ['jasmine', 'karma-typescript'],
        files: [
          {
            pattern: '**/*.ts'
          }          
        ],
        exclude: [
        ],
        preprocessors: {
          '**/*.ts': 'karma-typescript',
          '**/*.js': 'karma-typescript'
        },
        reporters: ['dots', 'karma-typescript'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: true,
        karmaTypescriptConfig: {
          bundlerOptions: {
            transforms: [
                require("karma-typescript-es6-transform")()
            ]
        }
      }
    });
}