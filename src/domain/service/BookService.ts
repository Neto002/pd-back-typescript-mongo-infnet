import NotFoundException from "../../exception/NotFoundException";
import { bookSchemaToBookDTO } from "../../mapper/BookMapper";
import { BookDTO } from "../dto/BookDTO";
import { Book } from "../entity/Book";
import IBookRepository from "../interfaces/IBookRepository";

export default class BookService implements IBookRepository {
  private readonly bookRepository: IBookRepository;

  constructor(bookRepository: IBookRepository) {
    this.bookRepository = bookRepository;
  }

  getBooks(): BookDTO[] {
    return this.bookRepository
      .getBooks()
      .map((book) => bookSchemaToBookDTO(book));
  }

  getBookById(id: number): BookDTO | undefined {
    if (typeof id !== "number") {
      throw new Error("Id must be a number");
    }

    const book = this.bookRepository.getBookById(id);

    if (!book) {
      throw new NotFoundException("Book not found");
    }

    return bookSchemaToBookDTO(book);
  }

  createBook(book: BookDTO): BookDTO {
    const books = this.bookRepository.getBooks();

    const maxId = books.reduce(
      (prevBook, currBook) => (currBook.id > prevBook.id ? currBook : prevBook),
      { id: 0 }
    ).id;
    const bookId = maxId + 1;

    const createdBook = this.bookRepository.createBook(
      new Book(bookId ?? 0, book.titulo, book.autor, book.ano)
    );

    return bookSchemaToBookDTO(createdBook);
  }

  deleteBook(id: number): BookDTO | undefined {
    const deletedBook = this.bookRepository.deleteBook(id);

    if (!deletedBook) {
      throw new NotFoundException("Book not found");
    }

    return deletedBook ? bookSchemaToBookDTO(deletedBook) : undefined;
  }

  updateBook(id: number, updatedData: Partial<Book>): BookDTO | undefined {
    const updatedBook = this.bookRepository.updateBook(id, updatedData);

    if (!updatedBook) {
      throw new NotFoundException("Book not found");
    }

    return updatedBook ? bookSchemaToBookDTO(updatedBook) : undefined;
  }
}
