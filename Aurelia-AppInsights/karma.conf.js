// Karma configuration
module.exports = function (config) {
    config.set({
        basePath: "",

        frameworks: ["jasmine", "requirejs", "sinon"],

        // list of files / patterns to load in the browser
        files: [
            // test specific files
            "test-main.js",
            "node_modules/jasmine-sinon/lib/jasmine-sinon.js",
            "node_modules/harmony-collections/harmony-collections.min.js", // provides Map for PhantomJS
            "node_modules/promise-polyfill/Promise.min.js", // provides Promise for PhantomJS

            // source files
            { pattern: "dist/**/*.js", included: false },

            // test files
            { pattern: 'test/unit/**/*.js', included: false },

            // framework and lib files
            { pattern: "Content/scripts/**/*.js", included: false },
        ],

        // list of files to exclude
        exclude: [
        ],

        preprocessors: {
            "dist/**/*.js": ["coverage"]
        },

        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ["progress", "coverage"],

        coverageReporter: {
            dir: "test/coverage/",
            reporters: [
                { type: 'lcov', subdir: 'report-lcov' },
                { type: 'text-summary', subdir: '.', file: 'coverage-summary.txt' },
                { type: 'text' },
            ]
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_ERROR,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ["PhantomJS2"],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};
