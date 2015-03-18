var gulp = require('gulp');
var karma = require("karma").server;

gulp.task("unit-test", ["build-system"], function () {
    return karma.start({
        configFile: __dirname + "/../../karma.conf.js",
        singleRun: true
    });
});