import { Request, Response, Router } from "express";
import { body, param, validationResult } from "express-validator";
import NoDataProvidedException from "../../exception/NoDataProvidedException";
import DataValidationException from "../../exception/DataValidationException";
import BookService from "../service/BookService";
import { Book } from "../entity/Book";
import { BookDTO } from "../dto/BookDTO";

export default class BookController {
  private readonly bookService: BookService;
  public router: Router = Router();

  constructor(bookService: BookService = new BookService()) {
    this.bookService = bookService;
    this.routes();
  }

  public routes() {
    this.router.get(
      "/:id",
      [param("id").notEmpty().isNumeric().withMessage("ID must be numeric")],
      this.getBookById.bind(this)
    );
    this.router.patch(
      "/:id",
      [param("id").notEmpty().isNumeric().withMessage("ID must be numeric")],
      this.updateBook.bind(this)
    );
    this.router.delete(
      "/:id",
      [param("id").notEmpty().isNumeric().withMessage("ID must be numeric")],
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

  public getBooks(req: Request, res: Response) {
    const books = this.bookService.getBooks();
    return res.json(books);
  }

  public getBookById(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new DataValidationException(
        errors
          .array()
          .map((err) => err.msg)
          .join(", ")
      );
    }

    const id = Number(req.params.id);

    const book = this.bookService.getBookById(id);

    return res.json(book);
  }

  public updateBook(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new DataValidationException(
        errors
          .array()
          .map((err) => err.msg)
          .join(", ")
      );
    }

    const id = Number(req.params.id);
    const updatedData: Partial<Book> = req.body;

    if (!updatedData || Object.keys(updatedData).length === 0) {
      throw new NoDataProvidedException("No data provided for update");
    }

    const updatedBook = this.bookService.updateBook(id, updatedData);

    return res.json(updatedBook);
  }

  public createBook(req: Request, res: Response) {
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
    return res.status(201).json(this.bookService.createBook(newBook));
  }

  public deleteBook(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new DataValidationException(
        errors
          .array()
          .map((err) => err.msg)
          .join(", ")
      );
    }

    const id = Number(req.params.id);

    const deletedBook = this.bookService.deleteBook(id);

    return res.json(deletedBook);
  }
}
