import auf = require("aurelia-framework");
import aur = require("aurelia-router");
import aue = require("aurelia-event-aggregator");
import aai = require("resources/aurelia-appInsights");

class RouterStub extends aur.Router {
	config: aur.IRouterConfig;

	configure(callback: (config: aur.IRouterConfig | aur.Router) => void) {
		var config = {
			title: "",
			moduleId: "xyz",
			map: (routeArray: Array<aur.IRoute>) => {
				this.routes = routeArray;
			},
			mapUnknownRoutes: (any) => { },
			addPipelineStep: function(name: string, step: any) {
				this.pipelineSteps.push({ name: name, step: step });
			},
			pipelineSteps: []
		};
		callback(config);
		this.config = config;
		this.title = config.title;
	}
}

// fake appInsights
var aiPages = [];
var aiErrors = [];

appInsights = {
	config: {
		enableDebug: false,
		instrumentationKey: null
	},

	trackPageView: (page: string, url?: string) => {
		aiPages.push(page);
	},

	trackEvent: (evt: string) => {
	},

	trackMetric: (evt: string) => {
	},

	trackTrace: (message: string) => {
	},

	trackException: (error: Error | string) => {
		aiErrors.push(error);
	},

	startTrackEvent: (eventName: string) => {
	},

	stopTrackEvent: (eventName: string) => {
	}
};

describe("the AppInsights plugin",() => {
	var sut: aai.AureliaAppInsights;
	var eventAgg;
	
	beforeEach(() => {
		aiPages = [];
		aiErrors = [];
		eventAgg = new aue.EventAggregator();
	});

	it("can be instantiated",() => {
		sut = new aai.AureliaAppInsights(eventAgg);
		expect(sut).toBeDefined();
	});

	it("subscribes to router events",() => {
		expect(eventAgg.eventLookup["router:navigation:complete"]).toBeUndefined();
		expect(eventAgg.eventLookup["router:navigation:error"]).toBeUndefined();

		sut = new aai.AureliaAppInsights(eventAgg);

		expect(eventAgg.eventLookup["router:navigation:complete"]).toBeDefined();
		expect(eventAgg.eventLookup["router:navigation:complete"].length).toEqual(1);

		expect(eventAgg.eventLookup["router:navigation:error"]).toBeDefined();
		expect(eventAgg.eventLookup["router:navigation:error"].length).toEqual(1);
	});

	it("can set the AI key",() => {
		sut.key = "123";
		expect(appInsights.config.instrumentationKey).toBe("123");
	});

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

		// we should still get here successfully
	});

	it("receives router events",() => {
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

	it("handles router errors",() => {
		sut = new aai.AureliaAppInsights(eventAgg);
		sut.key = "123";

		expect(aiPages.length).toEqual(0);
		expect(aiErrors.length).toEqual(0);

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

		expect(aiPages.length).toEqual(0);
		expect(aiErrors.length).toEqual(1);
	});
});