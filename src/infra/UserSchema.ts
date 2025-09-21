import { ObjectId } from "mongodb";

export type UserSchema = {
  _id: ObjectId;
  nome: string;
  saldo?: number;
  ativo: boolean;
};
