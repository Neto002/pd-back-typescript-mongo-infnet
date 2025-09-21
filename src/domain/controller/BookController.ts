import { Request, Response, Router } from "express";
import { body, param, validationResult } from "express-validator";
import NoDataProvidedException from "../../exception/NoDataProvidedException";
import DataValidationException from "../../exception/DataValidationException";
import { Book } from "../entity/Book";
import { BookDTO } from "../dto/BookDTO";
import IBookService from "../interfaces/IBookService";
import { inject } from "inversify";

export default class BookController {
  private readonly bookService: IBookService;
  public router: Router = Router();

  constructor(@inject("BookService") bookService: IBookService) {
    this.bookService = bookService;
    this.routes();
  }

  public routes() {
    this.router.get(
      "/:id",
      [
        param("id")
          .notEmpty()
          .isAlphanumeric()
          .withMessage("ID must be alphanumeric"),
      ],
      this.getBookById.bind(this)
    );
    this.router.patch(
      "/:id",
      [
        param("id")
          .notEmpty()
          .isAlphanumeric()
          .withMessage("ID must be alphanumeric"),
      ],
      this.updateBook.bind(this)
    );
    this.router.delete(
      "/:id",
      [
        param("id")
          .notEmpty()
          .isAlphanumeric()
          .withMessage("ID must be alphanumeric"),
      ],
      this.deleteBook.bind(this)
    );

    this.router.get("/", this.getBooks.bind(this));
    this.router.post(
      "/",
      [
        body("titulo")
          .exists()
          .withMessage("Field 'titulo' is required")
          .isString()
          .withMessage("Field 'titulo' must be a string"),
        body("autor")
          .exists()
          .withMessage("Field 'autor' is required")
          .isString()
          .withMessage("Field 'autor' must be a string"),
        body("ano")
          .exists()
          .withMessage("Field 'ano' is required")
          .isNumeric()
          .withMessage("Field 'ano' must be a number"),
      ],
      this.createBook.bind(this)
    );
  }

  public async getBooks(req: Request, res: Response) {
    const books = await this.bookService.getBooks();
    return res.json(books);
  }

  public async getBookById(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new DataValidationException(
        errors
          .array()
          .map((err) => err.msg)
          .join(", ")
      );
    }

    const id = req.params.id.toString();

    const book = await this.bookService.getBookById(id);

    return res.json(book);
  }

  public async updateBook(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new DataValidationException(
        errors
          .array()
          .map((err) => err.msg)
          .join(", ")
      );
    }

    const id = req.params.id.toString();
    const updatedData: Partial<Book> = req.body;

    if (!updatedData || Object.keys(updatedData).length === 0) {
      throw new NoDataProvidedException("No data provided for update");
    }

    const updatedBook = await this.bookService.updateBook(id, updatedData);

    return res.json(updatedBook);
  }

  public async createBook(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new DataValidationException(
        errors
          .array()
          .map((err) => err.msg)
          .join(", ")
      );
    }

    const newBook: BookDTO = req.body;
    return res.status(201).json(await this.bookService.createBook(newBook));
  }

  public async deleteBook(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new DataValidationException(
        errors
          .array()
          .map((err) => err.msg)
          .join(", ")
      );
    }

    const id = req.params.id.toString();

    const deletedBook = await this.bookService.deleteBook(id);

    return res.json(deletedBook);
  }
}
