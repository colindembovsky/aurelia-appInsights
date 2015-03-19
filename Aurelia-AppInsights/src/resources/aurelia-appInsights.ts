import auf = require("aurelia-framework");
import aur = require("aurelia-router");
import aue = require("aurelia-event-aggregator");

export function install(aurelia: auf.Aurelia) {
	// add the log appender to add tracing
	auf.LogManager.addAppender(new AppInsightsLogAppender());

	// bootstrap the ai plugin
	var eventAggregator = aurelia.container.get<aue.EventAggregator>(aue.EventAggregator);
	aurelia.container.registerInstance(AureliaAppInsights, new AureliaAppInsights(eventAggregator));
}

export class AppInsightsLogAppender implements auf.LogAppender {
	debug(logger: auf.Logger, message: string) {
		appInsights.trackTrace(`DEBUG [${logger.id}] ${message}`);
	}

	info(logger: auf.Logger, message: string) {
		appInsights.trackTrace(`INFO [${logger.id}] ${message}`);
	}

	warn(logger: auf.Logger, message: string) {
		appInsights.trackTrace(`WARN [${logger.id}] ${message}`);
	}

	error(logger: auf.Logger, message: string) {
		appInsights.trackException(`ERROR [${logger.id}] ${message}`);
	}
}

export class AureliaAppInsights {
	static inject = [aue.EventAggregator];
	private _key: string = null;
	private _properties = {};

	/**
	 * Set the AI key
	 */
	public set key(aiKey: string) {
		this._key = aiKey;
		appInsights.config.instrumentationKey = aiKey;
	}

	/**
	 * Set debugging
	 */
	public set debug(value: boolean) {
		appInsights.config.enableDebug = value;
	}

	/**
	 * Set 'global' properties - these will be sent with each AI log
	 */
	public set properties(value: {}) {
		this._properties = value;
	}

	constructor(private eventAgg: aue.EventAggregator) {
		this._key = appInsights.config.instrumentationKey;
		this.subscribeToNavEvents();
		this.addLogAppender();
	}

	subscribeToNavEvents() {
		this.eventAgg.subscribe("router:navigation:complete", this.navCompleted);
		this.eventAgg.subscribe("router:navigation:error", this.navError);
	}

	navCompleted = (instruction: aur.INavigationInstruction) => {
		try {
			this.guardKey();
			appInsights.trackPageView(instruction.fragment, window.location.href, this._properties);
		} catch (e) {
			console.debug("Error sending AI trackPageView: %O", e);
		}
	}

	navError = (navError: aur.INavigationError) => {
		try {
			this.guardKey();
			appInsights.trackException(navError.result.output);
		} catch (e) {
			console.debug("Error sending AI trackPageView: %O", e);
		}
	}

	addLogAppender() {
		auf.LogManager.addAppender(new AppInsightsLogAppender());
	}

	guardKey() {
		if (this._key === null) {
			throw "AppInsights key has not been set. Use 'AureliaAppInsights.key = aiKey;' to set it.";
		}
	}
}