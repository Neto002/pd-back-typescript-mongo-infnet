export class Book {
  id: number;
  titulo: string;
  autor: string;
  ano: number;

  constructor(id: number, titulo: string, autor: string, ano: number) {
    this.id = id;
    this.titulo = titulo;
    this.autor = autor;
    this.ano = ano;
  }
}
