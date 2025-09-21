import { BookDTO } from "../dto/BookDTO";
import { Book } from "../entity/Book";

export default interface IBookService {
  getBooks(): Promise<BookDTO[]>;
  getBookById(id: string): Promise<BookDTO | undefined>;
  createBook(book: BookDTO): Promise<BookDTO>;
  deleteBook(id: string): Promise<BookDTO | undefined>;
  updateBook(
    id: string,
    updatedData: Partial<Book>
  ): Promise<BookDTO | undefined>;
}
