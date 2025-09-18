import fs from "fs";
import path from "path";
import { DBSchema } from "../../infra/DBSchema";
import { Book } from "../entity/Book";
import { BookSchema } from "../../infra/BookSchema";
import IBookRepository from "../interfaces/IBookRepository";

export default class BookRepository implements IBookRepository {
  private readonly filePath: string;

  constructor(filePath: string = "../../infra/db.json") {
    this.filePath = path.join(__dirname, filePath);
  }

  private accessDB(): DBSchema {
    const db = fs.readFileSync(this.filePath, "utf-8");
    return JSON.parse(db);
  }

  private rewriteDB(db: DBSchema): boolean {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(db, null, 2));
      return true;
    } catch (error) {
      console.error("Error rewriting database:", error);
      return false;
    }
  }

  public getBooks() {
    const db = this.accessDB();
    return db.books;
  }

  public getBookById(id: number) {
    const books = this.getBooks();
    return books.find((book) => book.id === id);
  }

  public createBook(book: Book): BookSchema {
    const books = this.getBooks();
    books.push({ ...book });
    const db = this.accessDB();
    db.books = books;
    this.rewriteDB(db);
    return book;
  }

  public deleteBook(id: number): BookSchema | undefined {
    const book = this.getBookById(id);

    if (!book) {
      return undefined;
    }

    const books = this.getBooks();
    const bookIndex = books.findIndex((book) => book.id === id);
    books.splice(bookIndex, 1);

    const db = this.accessDB();
    db.books = books;
    this.rewriteDB(db);

    return book;
  }

  public updateBook(
    id: number,
    updatedData: Partial<Book>
  ): BookSchema | undefined {
    const books = this.getBooks();
    const bookIndex = books.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
      return undefined; // Book not found
    }

    books[bookIndex] = { ...books[bookIndex], ...updatedData, id };

    const db = this.accessDB();
    db.books = books;

    const success = this.rewriteDB(db);

    return success ? books[bookIndex] : undefined;
  }
}
