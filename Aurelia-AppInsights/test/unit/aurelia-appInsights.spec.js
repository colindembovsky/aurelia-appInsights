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
    var EventAggregatorStub = (function (_super) {
        __extends(EventAggregatorStub, _super);
        function EventAggregatorStub() {
            _super.apply(this, arguments);
        }
        EventAggregatorStub.prototype.publish = function (event, data) {
        };
        EventAggregatorStub.prototype.subscribe = function (event, callback) {
        };
        return EventAggregatorStub;
    })(aue.EventAggregator);
    describe("the AppInsights plugin", function () {
        var sut;
        beforeEach(function () {
            sut = new EventAggregatorStub();
        });
        it("can be instantiated", function () {
            expect(sut).toBeDefined();
        });
        it("can set the AI key", function () {
            sut.key = "123";
            expect(appInsights.config.instrumentationKey).toBe("123");
        });
    });
    describe("the AppInsights plugin when used", function () {
        var sut;
        var eventAgg;
        beforeEach(function () {
            eventAgg = new EventAggregatorStub();
            sut = new aai.AureliaAppInsights(eventAgg);
            sut.key = "123";
        });
        it("can be instantiated", function () {
            expect(sut).toBeDefined();
        });
    });
});
//# sourceMappingURL=aurelia-appInsights.spec.js.map