import { BookDTO } from "../domain/dto/BookDTO";
import { BookSchema } from "../infra/BookSchema";

export function bookSchemaToBookDTO(book: BookSchema): BookDTO {
  return {
    id: book.id,
    titulo: book.titulo,
    autor: book.autor,
    ano: book.ano,
  } as BookDTO;
}
