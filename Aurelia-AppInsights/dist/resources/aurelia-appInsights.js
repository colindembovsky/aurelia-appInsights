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
            appInsights.trackTrace("DEBUG [" + logger.id + "] " + message);
        };
        AppInsightsLogAppender.prototype.info = function (logger, message) {
            appInsights.trackTrace("INFO [" + logger.id + "] " + message);
        };
        AppInsightsLogAppender.prototype.warn = function (logger, message) {
            appInsights.trackTrace("WARN [" + logger.id + "] " + message);
        };
        AppInsightsLogAppender.prototype.error = function (logger, message) {
            appInsights.trackException("ERROR [" + logger.id + "] " + message);
        };
        return AppInsightsLogAppender;
    })();
    exports.AppInsightsLogAppender = AppInsightsLogAppender;
    var AureliaAppInsights = (function () {
        function AureliaAppInsights(eventAgg) {
            var _this = this;
            this.eventAgg = eventAgg;
            this._key = null;
            this._properties = {};
            this.navCompleted = function (instruction) {
                try {
                    console.log("-- in nav complete");
                    _this.guardKey();
                    appInsights.trackPageView(instruction.fragment, window.location.href, _this._properties);
                    console.log("Tracked AI nav completion event");
                }
                catch (e) {
                    console.debug("Error sending AI trackPageView: %O", e);
                }
            };
            this.navError = function (navError) {
                try {
                    console.log("-- in nav err");
                    _this.guardKey();
                    appInsights.trackException(navError.result.output);
                    console.log("Tracked AI nav error event");
                }
                catch (e) {
                    console.debug("Error sending AI trackPageView: %O", e);
                }
            };
            this._key = appInsights.config.instrumentationKey;
            this.subscribeToNavEvents();
            this.addLogAppender();
        }
        Object.defineProperty(AureliaAppInsights.prototype, "key", {
            /**
             * Set the AI key
             */
            set: function (aiKey) {
                this._key = aiKey;
                appInsights.config.instrumentationKey = aiKey;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AureliaAppInsights.prototype, "debug", {
            /**
             * Set debugging
             */
            set: function (value) {
                appInsights.config.enableDebug = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AureliaAppInsights.prototype, "properties", {
            /**
             * Set 'global' properties - these will be sent with each AI log
             */
            set: function (value) {
                this._properties = value;
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

//# sourceMappingURL=../resources/aurelia-appInsights.js.map