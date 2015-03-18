define(["require", "exports", "aurelia-framework", "aurelia-event-aggregator"], function (require, exports, auf, aue) {
    function install(aurelia) {
        // add the log appender to add tracing
        auf.LogManager.addAppender(new AppInsightsLogAppender());
        // bootstrap the ai plugin
        var eventAggregator = aurelia.container.get(aue.EventAggregator);
        aurelia.container.registerInstance(AureliaAppInsights, new AureliaAppInsights(eventAggregator));
    }
    exports.install = install;
    var AppInsightsLogAppender = (function () {
        function AppInsightsLogAppender() {
        }
        AppInsightsLogAppender.prototype.debug = function (logger, message) {
            appInsights.trackTrace(`DEBUG [${logger.id}] ${message}`);
        };
        AppInsightsLogAppender.prototype.info = function (logger, message) {
            appInsights.trackTrace(`INFO [${logger.id}] ${message}`);
        };
        AppInsightsLogAppender.prototype.warn = function (logger, message) {
            appInsights.trackTrace(`WARN [${logger.id}] ${message}`);
        };
        AppInsightsLogAppender.prototype.error = function (logger, message) {
            appInsights.trackException(`ERROR [${logger.id}] ${message}`);
        };
        return AppInsightsLogAppender;
    })();
    exports.AppInsightsLogAppender = AppInsightsLogAppender;
    var AureliaAppInsights = (function () {
        function AureliaAppInsights(eventAgg) {
            var _this = this;
            this.eventAgg = eventAgg;
            this._key = null;
            this.navCompleted = function (instruction) {
                try {
                    _this.guardKey();
                    appInsights.trackPageView(instruction.fragment, window.location.href);
                }
                catch (e) {
                    console.debug("Error sending AI trackPageView: " + e.message);
                }
            };
            this.navError = function (navError) {
                try {
                    _this.guardKey();
                    appInsights.trackException(navError.result.output);
                }
                catch (e) {
                    console.debug("Error sending AI trackException");
                }
            };
            this.subscribeToNavEvents();
            this.addLogAppender();
        }
        Object.defineProperty(AureliaAppInsights.prototype, "key", {
            set: function (aiKey) {
                this._key = aiKey;
                appInsights.config.instrumentationKey = aiKey;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AureliaAppInsights.prototype, "debug", {
            set: function (value) {
                appInsights.config.enableDebug = value;
            },
            enumerable: true,
            configurable: true
        });
        AureliaAppInsights.prototype.subscribeToNavEvents = function () {
            this.eventAgg.subscribe("router:navigation:complete", this.navCompleted);
            this.eventAgg.subscribe("router:navigation:error", this.navError);
        };
        AureliaAppInsights.prototype.addLogAppender = function () {
            auf.LogManager.addAppender(new AppInsightsLogAppender());
        };
        AureliaAppInsights.prototype.guardKey = function () {
            if (this._key === null) {
                throw "AppInsights key has not been set. Use 'AureliaAppInsights.key = aiKey;' to set it.";
            }
        };
        AureliaAppInsights.inject = [aue.EventAggregator];
        return AureliaAppInsights;
    })();
    exports.AureliaAppInsights = AureliaAppInsights;
});
//# sourceMappingURL=aurelia-appInsights.js.map