# aurelia-appInsights

This plugin allows you to add page [Application Insights](http://azure.microsoft.com/en-us/documentation/articles/app-insights-web-track-usage-custom-events-metrics/) tracking and tracing for your [Aurelia](http://www.aurelia.io/) applications.

> The solution was developed using Visual Studio 2015 and [TypeScript](http://www.typescriptlang.org/). If you're using TypeScript, you can inlcude the .ts files. If not, then just include the .js files to add the plugin.

## Installing the Plugin

1. Include Application Insights. You can do this in your main page (where you specify ```aurelia-app``` or ```aurelia-main```). Copy the JavaScript Application Insights snippet from the Azure portal and paste it into the ```<head>``` of the page:
```html
<script>
    var appInsights = window.appInsights || function (config) {
        function s(config) { t[config] = function () { var i = arguments; t.queue.push(function () { t[config].apply(t, i) }) } } var t = { config: config }, r = document, f = window, e = "script", o = r.createElement(e), i, u; for (o.src = config.url || "//az416426.vo.msecnd.net/scripts/a/ai.0.js", r.getElementsByTagName(e)[0].parentNode.appendChild(o), t.cookie = r.cookie, t.queue = [], i = ["Event", "Exception", "Metric", "PageView", "Trace"]; i.length;) s("track" + i.pop()); return config.disableExceptionTracking || (i = "onerror", s("_" + i), u = f[i], f[i] = function (config, r, f, e, o) { var s = u && u(config, r, f, e, o); return s !== !0 && t["_" + i](config, r, f, e, o), s }), t
    }({
        instrumentationKey: "your-ai-key"
    });

    window.appInsights = appInsights;
</script>
```
2. Include the src\resources folder in your project (make sure you have the aurelia-appInsights.js (or ts) files). The plugin assumes that you are manually inserting the AI script using the snippet from the Portal.
3. Include the plugin in main.js using ```.plugin("./resources/aurelia-appInsights")```. You can set 'global properties' if you want to.
```typescript
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

	// optional: set global ai properties
    // these properties will be sent with every event
	var ai = aurelia.container.get<aai.AureliaAppInsights>(aai.AureliaAppInsights);
	ai.properties = {
		environment: "Testing"
	};

	// start Aurelia
	aurelia.start().then((a: auf.Aurelia) => a.setRoot("dist/app", document.body));
}
```
4. You can set the key programatically too. Just inject AureliaAppInsights into your class constructor and set the key on the object (or set it in main.js using container.get() as above):
```typescript
import aur = require("aurelia-router");
import aai = require("resources/aurelia-appInsights");

export class App {
    static inject = [aur.Router, aai.AureliaAppInsights];

    constructor(private router: aur.Router, appInsightsPlugin: aai.AureliaAppInsights) {
		appInsightsPlugin.key = "my-app-insights-key";

        this.router.configure((config: aur.IRouterConfig) => {
        ...
    }
}
```

## Running The App from Visual Studio

To run the app, follow these steps.

1. Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.
2. From the _project folder_ (cd into Aurelia-AppInsights off the main root), execute the following command:

  ```shell
  npm install
  ```
3. Ensure that [Gulp](http://gulpjs.com/) is installed. If you need to install it, use the following command:

  ```shell
  npm install -g gulp
  ```
4. Ensure that [jspm](http://jspm.io/) is installed. If you need to install it, use the following command:

  ```shell
  npm install -g jspm
  ```
  > **Note:** jspm queries GitHub to install semver packages, but GitHub has a rate limit on anonymous API requests. It is advised that you configure jspm with your GitHub credentials in order to avoid problems. You can do this by executing `jspm endpoint config github` and following the prompts.
5. Install the client-side dependencies with jspm:

  ```shell
  jspm install -y
  ```
  >**Note:** Windows users, if you experience an error of "unknown command unzip" you can solve this problem by doing `npm install -g unzip` and then re-running `jspm install`.
6. Open the solution in Visual Studio. Locate the "ApplicationInsights.config" file in the solution. Right-click and select "Configure Application Insights". Configure your subscription keys etc. If you change subscription key, then make sure you update the key in the ```<appSettings>``` section of the Web.config file as well.
7. Build the solution. This should perform the package restore to get all [NuGet](https://www.nuget.org/) dependencies (for the [Nancy](http://nancyfx.org/) backend).

## Running The App from Gulp
1. Do steps 1 - 6 from the above section.
2. To run the app using Gulp, execute the following command:

  ```shell
  gulp watch
  ```
3. Browse to [http://localhost:9000](http://localhost:9000) to see the app. You can make changes in the code found under `src` and the browser should auto-refresh itself as you save files.

> Note: At present there is a bug in the HTMLImports polyfill which only occurs on IE. The Aurelia team have submitted a pull request to the team with the fix. In the mean time, if you want to test on IE, you can work around the issue by explicitly adding a script tag before you load system.js. The script tag should look something like this (be sure to confirm the version number):

```html
<script src="jspm_packages/github/webcomponents/webcomponentsjs@0.5.2/HTMLImports.js"></script>
```

## Running The Unit Tests

To run the unit tests, first ensure that you have followed the steps above in order to install all dependencies and successfully build the library. Once you have done that, proceed with these additional steps:

1. Ensure that the [Karma](http://karma-runner.github.io/) CLI is installed. If you need to install it, use the following command:

  ```shell
  npm install -g karma-cli
  ```
2. Install Aurelia libs for test visibility:

```shell
jspm install aurelia-framework
jspm install aurelia-http-client
jspm install aurelia-router
```
3. You can now run the tests with this command:

  ```shell
  karma start
  ```