import { Book } from "../entity/Book";
import { BookSchema } from "../../infra/BookSchema";

export default interface IBookRepository {
  getBooks(): Promise<BookSchema[]>;
  getBookById(id: string): Promise<BookSchema | undefined>;
  createBook(book: Book): Promise<BookSchema>;
  deleteBook(id: string): Promise<BookSchema | undefined>;
  updateBook(
    id: string,
    updatedData: Partial<Book>
  ): Promise<BookSchema | undefined>;
}
