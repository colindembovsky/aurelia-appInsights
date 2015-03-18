define(["require", "exports", "aurelia-framework", "aurelia-logging-console"], function (require, exports, auf, aul) {
    auf.LogManager.addAppender(new aul.ConsoleAppender());
    auf.LogManager.setLevel(4 /* debug */);
    // bootstrap Aurelia
    function configure(aurelia) {
        "use strict";
        aurelia.use.defaultBindingLanguage().defaultResources().router().eventAggregator().plugin("./resources/aurelia-appInsights");
        // start Aurelia
        aurelia.start().then(function (a) { return a.setRoot("dist/app", document.body); });
    }
    exports.configure = configure;
});
//# sourceMappingURL=main.js.map