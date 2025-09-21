import { ObjectId } from "mongodb";

export class User {
  _id: ObjectId;
  nome: string;
  ativo: boolean;
  saldo?: number;

  constructor(nome: string, ativo: boolean = true, saldo?: number) {
    this._id = new ObjectId();
    this.nome = nome;
    this.ativo = ativo;
    this.saldo = saldo;
  }
}
