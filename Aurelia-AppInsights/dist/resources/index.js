define(["require", "exports", "aurelia-framework", "aurelia-event-aggregator", "resources/aurelia-appInsights"], function (require, exports, auf, aue, aai) {
    function install(aurelia) {
        // add the log appender to add tracing
        auf.LogManager.addAppender(new aai.AppInsightsLogAppender());
        // bootstrap the ai plugin
        var eventAggregator = aurelia.container.get(aue.EventAggregator);
        aurelia.container.registerInstance(aai.AureliaAppInsights, new aai.AureliaAppInsights(eventAggregator));
    }
    exports.install = install;
});

//# sourceMappingURL=../resources/index.js.map