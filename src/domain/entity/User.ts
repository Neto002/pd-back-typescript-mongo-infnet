export class User {
  id: number;
  nome: string;
  ativo: boolean;
  saldo?: number;

  constructor(id: number, nome: string, ativo: boolean = true, saldo?: number) {
    this.id = id;
    this.nome = nome;
    this.ativo = ativo;
    this.saldo = saldo;
  }
}
