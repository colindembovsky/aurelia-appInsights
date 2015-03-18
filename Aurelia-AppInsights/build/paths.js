var path = require('path');

var appRoot = 'src/';

module.exports = {
    root: appRoot,
    source: appRoot + '**/*.ts',
    typings: 'Scripts/typings/**/*.d.ts',
    html: appRoot + '**/*.html',
    style: 'Content/styles/**/*.css',
    output: 'dist/',
    doc:'./doc',
};
