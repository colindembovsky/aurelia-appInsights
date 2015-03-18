interface AppInsightsConfig {
	enableDebug: boolean;
	instrumentationKey: string;
}

interface AppInsightsStatic {
	config: AppInsightsConfig;

	// simple methods

	/**
	 * Used for tracking trace messages
	 * 
	 * @param message String trace message to track
	 */
	trackTrace(message: string): void;

	/**
	 * Track an exception
	 * 
	 * @param error The exception to track - can be an Error or a string
	 */
	trackException(error: Error | string): void;

	/**
	 * Track a page view
	 * 
	 * @param pageName name of the page
	 * @param url url of the page
	 */
	trackPageView(pageName: string, url: string): void;

	/**
	 * Start timing an event. Must have a corresponding stopTrackEvent(eventName) call.
	 * 
	 * @param eventName Name of the event to time
	 */
	startTrackEvent(eventName: string): void;

	/**
	 * Stop timing an event. Must have had a corresponding startTrackEvent(eventName) call.
	 * 
	 * @param eventName Name of the event to stop timing
	 */
	stopTrackEvent(eventName: string): void;

	// complex methods

	/**
	 * Track an event (optionally with metrics / properties)
	 * 
	 * @param eventName Name of the event
	 * @param url Url of the page
	 * @param properties String properties (e.g. { Game: currentGame.name, Difficulty: currentGame.difficulty })
	 * @param metrics Numeric metrics (e.g. { Score: currentGame.score, Opponents: currentGame.opponentCount })
	 */
	trackPageView(pageName: string, url: string, properties?: {}, metrics?: {}): void;

	/**
	 * Track an event (optionally with metrics / properties)
	 * 
	 * @param eventName Name of the event
	 * @param properties String properties (e.g. { Game: currentGame.name, Difficulty: currentGame.difficulty })
	 * @param metrics Numeric metrics (e.g. { Score: currentGame.score, Opponents: currentGame.opponentCount })
	 */
	trackEvent(eventName: string, properties?: {}, metrics?: {}): void;

	/**
	 * Stop timing an event.
	 * 
	 * @param eventName Name of the event - must match the name of the startTrackEvent call
	 * @param properties String properties (e.g. { Game: currentGame.name, Difficulty: currentGame.difficulty })
	 * @param metrics Numeric metrics (e.g. { Score: currentGame.score, Opponents: currentGame.opponentCount })
	 * @example
	 *    appInsights.trackEvent("WinGame", 
	 *		 // String properties:
     *       {Game: currentGame.name, Difficulty: currentGame.difficulty},
     *       // Numeric metrics:
     *       {Score: currentGame.score, Opponents: currentGame.opponentCount}
     *    ); 
	 */
	stopTrackEvent(eventName: string, properties?: {}, metrics?: {}): void;

	/**
	 * Track metrics
	 * 
	 * @param metricName name of the metric
	 * @param measure numeric value for the metric
	 */
	trackMetric(metricName: string, measure: number): void;

	/**
	 * Track aggregated metrics - used to conserve bandwidth
	 * 
	 * @param metricName name of the metric
	 * @param average numeric average for the metric
	 * @param count number of metrics
	 * @param min minimum value of metric
	 * @param max maximum value of metric
	 * @param properties String properties (e.g. { Game: currentGame.name, Difficulty: currentGame.difficulty })
	 */
	trackMetric(metricName: string, average: number, count: number, min: number, max: number, properties?: {}): void;
} 

declare var appInsights: AppInsightsStatic;