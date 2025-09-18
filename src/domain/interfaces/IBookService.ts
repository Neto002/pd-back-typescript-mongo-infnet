import { BookDTO } from "../dto/BookDTO";
import { Book } from "../entity/Book";

export default interface IBookService {
  getBooks(): BookDTO[];
  getBookById(id: number): BookDTO | undefined;
  createBook(book: BookDTO): BookDTO;
  deleteBook(id: number): BookDTO | undefined;
  updateBook(id: number, updatedData: Partial<Book>): BookDTO | undefined;
}
