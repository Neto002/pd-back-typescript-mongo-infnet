import { inject, injectable } from "inversify";
import NotFoundException from "../../exception/NotFoundException";
import { bookSchemaToBookDTO } from "../../mapper/BookMapper";
import { BookDTO } from "../dto/BookDTO";
import { Book } from "../entity/Book";
import IBookRepository from "../interfaces/IBookRepository";
import IBookService from "../interfaces/IBookService";

@injectable()
export default class BookService implements IBookService {
  private readonly bookRepository: IBookRepository;

  constructor(@inject("BookRepository") bookRepository: IBookRepository) {
    this.bookRepository = bookRepository;
  }

  async getBooks(): Promise<BookDTO[]> {
    return this.bookRepository
      .getBooks()
      .then((books) => books.map((book) => bookSchemaToBookDTO(book)));
  }

  async getBookById(id: string): Promise<BookDTO | undefined> {
    if (typeof id !== "string") {
      throw new Error("Id must be a string");
    }

    const book = await this.bookRepository.getBookById(id);

    if (!book) {
      throw new NotFoundException("Book not found");
    }

    return bookSchemaToBookDTO(book);
  }

  async createBook(book: BookDTO): Promise<BookDTO> {
    const createdBook = await this.bookRepository.createBook(
      new Book(book.titulo, book.autor, book.ano)
    );

    return bookSchemaToBookDTO(createdBook);
  }

  async deleteBook(id: string): Promise<BookDTO | undefined> {
    const deletedBook = await this.bookRepository.deleteBook(id);

    if (!deletedBook) {
      throw new NotFoundException("Book not found");
    }

    return deletedBook ? bookSchemaToBookDTO(deletedBook) : undefined;
  }

  async updateBook(
    id: string,
    updatedData: Partial<Book>
  ): Promise<BookDTO | undefined> {
    const updatedBook = await this.bookRepository.updateBook(id, updatedData);

    if (!updatedBook) {
      throw new NotFoundException("Book not found");
    }

    return updatedBook ? bookSchemaToBookDTO(updatedBook) : undefined;
  }
}
