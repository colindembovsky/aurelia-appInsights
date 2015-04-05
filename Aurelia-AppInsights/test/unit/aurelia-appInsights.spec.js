define(["require", "exports", "aurelia-event-aggregator", "resources/aurelia-appInsights"], function (require, exports, aue, aai) {
    function stubAppInsights() {
        appInsights = sinon.stub({
            trackPageView: function () {
            },
            trackException: function () {
            }
        });
        appInsights.config = {
            enableDebug: false,
            instrumentationKey: null
        };
    }
    describe("the AppInsights plugin", function () {
        var sut;
        var sandbox;
        var eventAggPublishSpy;
        var eventAggSubscribeSpy;
        var eventAgg;
        var aiStub;
        beforeEach(function () {
            stubAppInsights();
            eventAgg = new aue.EventAggregator();
            eventAggPublishSpy = sinon.spy(eventAgg, "publish");
            eventAggSubscribeSpy = sinon.spy(eventAgg, "subscribe");
        });
        it("can be instantiated", function () {
            sut = new aai.AureliaAppInsights(eventAgg);
            expect(sut).toBeDefined();
        });
        it("subscribes to router events", function () {
            sinon.assert.notCalled(eventAggPublishSpy);
            sinon.assert.notCalled(eventAggSubscribeSpy);
            sut = new aai.AureliaAppInsights(eventAgg);
            sinon.assert.calledTwice(eventAggSubscribeSpy);
            sinon.assert.calledWith(eventAggSubscribeSpy, "router:navigation:complete");
            sinon.assert.calledWith(eventAggSubscribeSpy, "router:navigation:error");
        });
        it("can set the AI key", sinon.test(function () {
            sut.key = "123";
            expect(appInsights.config.instrumentationKey).toBe("123");
        }));
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
            // we should still get here successfully, and trackPageView should not have been called
            expect(appInsights.trackPageView.calledOnce).toBeTruthy();
        });
        it("receives router events", function () {
            sut = new aai.AureliaAppInsights(eventAgg);
            sut.key = "123";
            sinon.assert.notCalled(eventAggPublishSpy);
            sinon.assert.calledTwice(eventAggSubscribeSpy);
            eventAgg.publish("router:navigation:complete", {
                fragment: "page1"
            });
            expect(appInsights.trackPageView).toHaveBeenCalledWith("page1");
            expect(appInsights.trackException).not.toHaveBeenCalled();
        });
        it("handles router errors", function () {
            sut = new aai.AureliaAppInsights(eventAgg);
            sut.key = "123";
            sinon.assert.notCalled(eventAggPublishSpy);
            sinon.assert.calledTwice(eventAggSubscribeSpy);
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
            expect(appInsights.trackException).toHaveBeenCalledWith(err);
            expect(appInsights.trackPageView).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=aurelia-appInsights.spec.js.map