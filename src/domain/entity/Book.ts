import { ObjectId } from "mongodb";

export class Book {
  _id: ObjectId;
  titulo: string;
  autor: string;
  ano: number;

  constructor(titulo: string, autor: string, ano: number) {
    this._id = new ObjectId();
    this.titulo = titulo;
    this.autor = autor;
    this.ano = ano;
  }
}
