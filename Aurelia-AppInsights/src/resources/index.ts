import auf = require("aurelia-framework");
import aue = require("aurelia-event-aggregator");
import aai = require("resources/aurelia-appInsights");

export function install(aurelia: auf.Aurelia) {
	// add the log appender to add tracing
	auf.LogManager.addAppender(new aai.AppInsightsLogAppender());

	// bootstrap the ai plugin
	var eventAggregator = aurelia.container.get<aue.EventAggregator>(aue.EventAggregator);
	aurelia.container.registerInstance(aai.AureliaAppInsights, new aai.AureliaAppInsights(eventAggregator));
}