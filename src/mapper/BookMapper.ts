import { BookDTO } from "../domain/dto/BookDTO";
import { Book } from "../domain/entity/Book";
import { BookSchema } from "../infra/BookSchema";

export function bookSchemaToBookDTO(book: BookSchema): BookDTO {
  return {
    _id: book._id.toString(),
    titulo: book.titulo,
    autor: book.autor,
    ano: book.ano,
  } as BookDTO;
}

export function bookToBookSchema(book: Book): BookSchema {
  return {
    _id: book._id ? book._id : undefined,
    titulo: book.titulo,
    autor: book.autor,
    ano: book.ano,
  } as BookSchema;
}
