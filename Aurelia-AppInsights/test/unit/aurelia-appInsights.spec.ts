import auf = require("aurelia-framework");
import aur = require("aurelia-router");
import aue = require("aurelia-event-aggregator");
import aai = require("resources/aurelia-appInsights");

function stubAppInsights() {
	appInsights = <any>sinon.stub({
		trackPageView: function () { },
		trackException: function () { }
	});
	appInsights.config = {
		enableDebug: false,
		instrumentationKey: null
	};
}

describe("the AppInsights plugin",() => {
	var sut: aai.AureliaAppInsights;

	var sandbox: SinonSandbox;
	var eventAggPublishSpy: SinonSpy;
	var eventAggSubscribeSpy: SinonSpy;
	var eventAgg: aue.EventAggregator;
	var aiStub: any;
	
	beforeEach(() => {
		stubAppInsights();

		eventAgg = new aue.EventAggregator();
		eventAggPublishSpy = sinon.spy(eventAgg, "publish");
		eventAggSubscribeSpy = sinon.spy(eventAgg, "subscribe");
	});

	it("can be instantiated",() => {
		sut = new aai.AureliaAppInsights(eventAgg);
		expect(sut).toBeDefined();
	});

	it("subscribes to router events",() => {
		sinon.assert.notCalled(eventAggPublishSpy);
		sinon.assert.notCalled(eventAggSubscribeSpy);

		sut = new aai.AureliaAppInsights(eventAgg);

		sinon.assert.calledTwice(eventAggSubscribeSpy);
		sinon.assert.calledWith(eventAggSubscribeSpy, "router:navigation:complete");
		sinon.assert.calledWith(eventAggSubscribeSpy, "router:navigation:error");
	});

	it("can set the AI key", sinon.test(() => {
		sut.key = "123";
		expect(appInsights.config.instrumentationKey).toBe("123");
	}));

	it("can set debug",() => {
		sut.debug = false;
		expect(appInsights.config.enableDebug).toBeFalsy();

		sut.debug = true;
		expect(appInsights.config.enableDebug).toBeTruthy();
	});

	it("handles router events with no key",() => {
		sut = new aai.AureliaAppInsights(eventAgg);
		sut.key = "123";

		eventAgg.publish("router:navigation:complete", {
			fragment: "page1"
		});

		// we should still get here successfully, and trackPageView should not have been called
		expect((<SinonSpy>appInsights.trackPageView).calledOnce).toBeTruthy();
	});

	it("receives router events",() => {
		sut = new aai.AureliaAppInsights(eventAgg);
		sut.key = "123";

		sinon.assert.notCalled(eventAggPublishSpy);
		sinon.assert.calledTwice(eventAggSubscribeSpy);

		eventAgg.publish("router:navigation:complete", {
			fragment: "page1"
		});

		expect(<SinonSpy>appInsights.trackPageView).toHaveBeenCalledWith("page1");
		expect(<SinonSpy>appInsights.trackException).not.toHaveBeenCalled();
	});

	it("handles router errors",() => {
		sut = new aai.AureliaAppInsights(eventAgg);
		sut.key = "123";

		sinon.assert.notCalled(eventAggPublishSpy);
		sinon.assert.calledTwice(eventAggSubscribeSpy);

		var err;
		try {
			throw "some error";
		} catch (e) {
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