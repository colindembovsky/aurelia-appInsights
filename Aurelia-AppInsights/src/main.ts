import auf = require("aurelia-framework");
import aul = require("aurelia-logging-console");
import aai = require("resources/aurelia-appInsights");

auf.LogManager.addAppender(new aul.ConsoleAppender());
auf.LogManager.setLevel(auf.LogManager.levels.debug);

// bootstrap Aurelia
export function configure(aurelia: auf.Aurelia) {
	"use strict";

	aurelia.use
		.defaultBindingLanguage()
		.defaultResources()
		.router()
		.eventAggregator()
		.plugin("./resources/aurelia-appInsights");

	// set global ai properties
	var ai = aurelia.container.get<aai.AureliaAppInsights>(aai.AureliaAppInsights);
	ai.properties = {
		environment: "Testing"
	};

	// start Aurelia
	aurelia.start().then((a: auf.Aurelia) => a.setRoot("dist/app", document.body));
}