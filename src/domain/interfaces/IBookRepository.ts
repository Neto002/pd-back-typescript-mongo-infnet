import { Book } from "../entity/Book";
import { BookSchema } from "../../infra/BookSchema";

export default interface IBookRepository {
  getBooks(): BookSchema[];
  getBookById(id: number): BookSchema | undefined;
  createBook(book: Book): BookSchema;
  deleteBook(id: number): BookSchema | undefined;
  updateBook(id: number, updatedData: Partial<Book>): BookSchema | undefined;
}
