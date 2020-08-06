import express, { request } from "express";
import ClassesController from "./controller/ClassesController";
import ConnectionsController from "./controller/ConnectionsController";

const routes = express.Router();
const classesController = new ClassesController();
const connectionsController = new ConnectionsController();

routes.get("/classes", classesController.index);
routes.post("/classes", classesController.store);

routes.get("/connections", connectionsController.index);
routes.post("/connections", connectionsController.store);

export default routes;
