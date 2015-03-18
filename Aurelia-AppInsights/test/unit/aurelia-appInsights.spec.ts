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

class EventAggregatorStub extends aue.EventAggregator {
	publish<T>(event: T, data?: any) {
	}
	
	subscribe(event: string, callback: Function) {
	}
}

describe("the AppInsights plugin",() => {
	var sut;
	beforeEach(() => {
		sut = new EventAggregatorStub();
	});

	it("can be instantiated", () => {
		expect(sut).toBeDefined();
	});

	it("can set the AI key",() => {
		sut.key = "123";
		expect(appInsights.config.instrumentationKey).toBe("123");
	});
});

describe("the AppInsights plugin when used", () => {
	var sut;
	var eventAgg;
	beforeEach(() => {
		eventAgg = new EventAggregatorStub();
		sut = new aai.AureliaAppInsights(eventAgg);
		sut.key = "123";
	});

	it("can be instantiated",() => {
		expect(sut).toBeDefined();
	});
});