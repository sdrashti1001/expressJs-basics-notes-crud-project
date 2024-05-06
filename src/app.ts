import express, { Application } from "express";
import cors from 'cors'; // Import cors module
import Routes from "./routes";

export default class AppModule {
    corsOptions = {
        origin: '*'
    };

    bodyParser = require("body-parser");

    constructor(app: Application) {
        this.config(app);
    }

    public config(app: Application): void {
        // Use cors middleware
        app.use(cors(this.corsOptions));
        // parse requests of content-type application/json
        app.use(this.bodyParser.json());
        // parse requests of content-type application/x-www-form-urlencoded
        app.use(this.bodyParser.urlencoded({ extended: true }));
        const routes = new Routes();
        // Attach routes to the Express app
        app.use('/', routes.getRouter());
    }
}


