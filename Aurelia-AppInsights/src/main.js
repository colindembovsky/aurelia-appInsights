define(["require", "exports", "aurelia-framework", "aurelia-logging-console", "resources/aurelia-appInsights"], function (require, exports, auf, aul, aai) {
    auf.LogManager.addAppender(new aul.ConsoleAppender());
    auf.LogManager.setLevel(4 /* debug */);
    // bootstrap Aurelia
    function configure(aurelia) {
        "use strict";
        aurelia.use.defaultBindingLanguage().defaultResources().router().eventAggregator().plugin("./resources/aurelia-appInsights");
        // set global ai properties
        var ai = aurelia.container.get(aai.AureliaAppInsights);
        ai.properties = {
            environment: "Testing"
        };
        // start Aurelia
        aurelia.start().then(function (a) { return a.setRoot("dist/app", document.body); });
    }
    exports.configure = configure;
});
//# sourceMappingURL=main.js.map