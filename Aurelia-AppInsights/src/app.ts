import auf = require("aurelia-framework");
import aur = require("aurelia-router");

export class App {
	private logger: auf.Logger = auf.LogManager.getLogger("App");

    static inject = [aur.Router];

    constructor(private router: aur.Router) {
		this.logger.info("Constructing app");

        this.router.configure((config: aur.IRouterConfig) => {
			this.logger.debug("Configuring router");
            config.title = "Aurelia VS/TS";
            config.map([
                { route: ["", "welcome"], moduleId: "views/welcome", nav: true, title: "Welcome to VS/TS" },
                { route: "flickr", moduleId: "views/flickr", nav: true },
                { route: "child-router", moduleId: "views/child-router", nav: true, title: "Child Router" }
            ]);
        });
    }
}