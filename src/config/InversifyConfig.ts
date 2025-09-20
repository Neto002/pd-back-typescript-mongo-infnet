import { Container } from "inversify";
import IBookRepository from "../domain/interfaces/IBookRepository";
import BookRepository from "../domain/repository/BookRepository";
import BookService from "../domain/service/BookService";
import UserRepository from "../domain/repository/UserRepository";
import UserService from "../domain/service/UserService";
import BookController from "../domain/controller/BookController";
import UserController from "../domain/controller/UserController";
import IUserService from "../domain/interfaces/IUserService";
import IUserRepository from "../domain/interfaces/IUserRepository";
import IBookService from "../domain/interfaces/IBookService";

const container = new Container();
container
  .bind<IBookRepository>("BookRepository")
  .to(BookRepository)
  .inRequestScope();

container.bind<IBookService>("BookService").to(BookService).inRequestScope();

container
  .bind<IUserRepository>("UserRepository")
  .to(UserRepository)
  .inRequestScope();

container.bind<IUserService>("UserService").to(UserService).inRequestScope();

container
  .bind<BookController>("BookController")
  .to(BookController)
  .inRequestScope();

container
  .bind<UserController>("UserController")
  .to(UserController)
  .inRequestScope();

export default container;
