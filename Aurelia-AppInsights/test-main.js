var allTestFiles = [];
var allSourceFiles = [];

var TEST_REGEXP = /(spec|test)\.js$/i;
var SRC_REGEXP = /src\/[a-zA-Z]+\/[a-zA-Z]+.js$/im;

var normalizePathToSpecFiles = function (path) {
    return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

var normalizePathToSourceFiles = function (path) {
    return path.replace(/^\/base\/src\//, '').replace(/\.js$/, '');
};

var loadSourceModulesAndStartTest = function () {
    require(["aurelia/aurelia-bundle"], function () {
        require(allSourceFiles, function () {
            require(allTestFiles, function () {
                window.__karma__.start();
            });
        });
    });
};

Object.keys(window.__karma__.files).forEach(function (file) {
    if (TEST_REGEXP.test(file)) {
        allTestFiles.push(normalizePathToSpecFiles(file));
    } else if (SRC_REGEXP.test(file)) {
        allSourceFiles.push(normalizePathToSourceFiles(file));
    }
});

require.config({
    // Karma serves files under /base, which is the basePath from your config file
    baseUrl: "/",

    paths: {
        test: "/base/test",
        src: "/base/src",
        views: "/base/src/views",
        resources: "/base/src/resources",
        aurelia: "/base/Content/scripts/aurelia",
    },

    // dynamically load all test files
    deps: ["aurelia/aurelia-bundle"],

    // we have to kickoff jasmine, as it is asynchronous
    callback: loadSourceModulesAndStartTest
});