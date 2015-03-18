// Karma configuration
module.exports = function (config) {
    config.set({
        basePath: "",

        frameworks: ["jspm", "jasmine"],

        jspm: {
            loadFiles: ['test/unit/**/*.js', 'dist/**/*.js']
        },

        // list of files / patterns to load in the browser
        files: [
            // this is just here for the VS Karma adapter
            { pattern: 'test/unit/**/*.js', included: false }
        ],

        // list of files to exclude
        exclude: [
        ],

        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ["progress"],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ["Chrome"],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};
