define(["require", "exports", "aurelia-framework", "aurelia-router"], function (require, exports, auf, aur) {
    var App = (function () {
        function App(router) {
            var _this = this;
            this.router = router;
            this.logger = auf.LogManager.getLogger("App");
            this.logger.info("Constructing app");
            this.router.configure(function (config) {
                _this.logger.debug("Configuring router");
                config.title = "Aurelia VS/TS";
                config.map([
                    { route: ["", "welcome"], moduleId: "./views/welcome", nav: true, title: "Welcome to VS/TS" },
                    { route: "flickr", moduleId: "./views/flickr", nav: true },
                    { route: "child-router", moduleId: "./views/child-router", nav: true, title: "Child Router" }
                ]);
            });
        }
        App.inject = [aur.Router];
        return App;
    })();
    exports.App = App;
});
//# sourceMappingURL=app.js.map