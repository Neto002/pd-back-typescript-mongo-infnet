import { Router } from "express";
import UserController from "./domain/controller/UserController";
import BookController from "./domain/controller/BookController";
import container from "./config/InversifyConfig";

const routes = Router();

const userController = container.get<UserController>("UserController");
const bookController = container.get<BookController>("BookController");

routes.use("/users", userController.router);
routes.use("/books", bookController.router);

export default routes;
