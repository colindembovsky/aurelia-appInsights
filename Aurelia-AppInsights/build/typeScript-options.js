var paths = require('./paths');

module.exports = {
    //sortOutput: true, // use for concatenating
    target: "ES5",
    module: "amd",
    declarationFiles: false,
    noExternalResolve: true,
    sourceRoot: paths.root
};
