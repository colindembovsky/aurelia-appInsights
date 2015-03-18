import aur = require("aurelia-router");
import auf = require("aurelia-framework")

export class Welcome {
    static inject() { return [auf.Parent.of(aur.Router)]; }

    public heading: string;
    public firstName: string;
    public lastName: string;

    constructor(public theRouter: aur.Router) {
        this.heading = "Welcome to the Aurelia Navigation App";
        this.firstName = "John";
        this.lastName = "Doe";
    }

    get fullName() {
        return this.firstName + " " + this.lastName;
    }

    welcome() {
        alert("Welcome, " + this.fullName + "!");
    }
}