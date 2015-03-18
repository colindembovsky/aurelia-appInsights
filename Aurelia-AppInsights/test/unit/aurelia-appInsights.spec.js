var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "aurelia-router", "aurelia-event-aggregator", "resources/aurelia-appInsights"], function (require, exports, aur, aue, aai) {
    var RouterStub = (function (_super) {
        __extends(RouterStub, _super);
        function RouterStub() {
            _super.apply(this, arguments);
        }
        RouterStub.prototype.configure = function (callback) {
            var _this = this;
            var config = {
                title: "",
                moduleId: "xyz",
                map: function (routeArray) {
                    _this.routes = routeArray;
                },
                mapUnknownRoutes: function (any) {
                },
                addPipelineStep: function (name, step) {
                    this.pipelineSteps.push({ name: name, step: step });
                },
                pipelineSteps: []
            };
            callback(config);
            this.config = config;
            this.title = config.title;
        };
        return RouterStub;
    })(aur.Router);
    // fake appInsights
    var aiPages = [];
    var aiErrors = [];
    appInsights = {
        config: {
            enableDebug: false,
            instrumentationKey: null
        },
        trackPageView: function (page, url) {
            aiPages.push(page);
        },
        trackEvent: function (evt) {
        },
        trackMetric: function (evt) {
        },
        trackTrace: function (message) {
        },
        trackException: function (error) {
            aiErrors.push(error);
        },
        startTrackEvent: function (eventName) {
        },
        stopTrackEvent: function (eventName) {
        }
    };
    describe("the AppInsights plugin", function () {
        var sut;
        var eventAgg;
        beforeEach(function () {
            aiPages = [];
            aiErrors = [];
            eventAgg = new aue.EventAggregator();
        });
        it("can be instantiated", function () {
            sut = new aai.AureliaAppInsights(eventAgg);
            expect(sut).toBeDefined();
        });
        it("subscribes to router events", function () {
            expect(eventAgg.eventLookup["router:navigation:complete"]).toBeUndefined();
            expect(eventAgg.eventLookup["router:navigation:error"]).toBeUndefined();
            sut = new aai.AureliaAppInsights(eventAgg);
            expect(eventAgg.eventLookup["router:navigation:complete"]).toBeDefined();
            expect(eventAgg.eventLookup["router:navigation:complete"].length).toEqual(1);
            expect(eventAgg.eventLookup["router:navigation:error"]).toBeDefined();
            expect(eventAgg.eventLookup["router:navigation:error"].length).toEqual(1);
        });
        it("can set the AI key", function () {
            sut.key = "123";
            expect(appInsights.config.instrumentationKey).toBe("123");
        });
        it("can set debug", function () {
            sut.debug = false;
            expect(appInsights.config.enableDebug).toBeFalsy();
            sut.debug = true;
            expect(appInsights.config.enableDebug).toBeTruthy();
        });
        it("handles router events with no key", function () {
            sut = new aai.AureliaAppInsights(eventAgg);
            sut.key = "123";
            eventAgg.publish("router:navigation:complete", {
                fragment: "page1"
            });
            // we should still get here successfully
        });
        it("receives router events", function () {
            sut = new aai.AureliaAppInsights(eventAgg);
            sut.key = "123";
            expect(aiPages.length).toEqual(0);
            expect(aiErrors.length).toEqual(0);
            eventAgg.publish("router:navigation:complete", {
                fragment: "page1"
            });
            expect(aiPages.length).toEqual(1);
            expect(aiErrors.length).toEqual(0);
        });
        it("handles router errors", function () {
            sut = new aai.AureliaAppInsights(eventAgg);
            sut.key = "123";
            expect(aiPages.length).toEqual(0);
            expect(aiErrors.length).toEqual(0);
            var err;
            try {
                throw "some error";
            }
            catch (e) {
                err = e;
            }
            eventAgg.publish("router:navigation:error", {
                instruction: {
                    fragment: "page1"
                },
                result: {
                    output: err
                }
            });
            expect(aiPages.length).toEqual(0);
            expect(aiErrors.length).toEqual(1);
        });
    });
});
//# sourceMappingURL=aurelia-appInsights.spec.js.map