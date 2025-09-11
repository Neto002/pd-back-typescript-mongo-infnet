import { Router } from "express";
import UserController from "./domain/controller/UserController";
import UserService from "./domain/service/UserService";
import UserRepository from "./domain/repository/UserRepository";
import BookRepository from "./domain/repository/BookRepository";
import BookService from "./domain/service/BookService";
import BookController from "./domain/controller/BookController";

const routes = Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const bookRepository = new BookRepository();
const bookService = new BookService(bookRepository);
const bookController = new BookController(bookService);

routes.use("/users", userController.router);
routes.use("/books", bookController.router);

export default routes;
