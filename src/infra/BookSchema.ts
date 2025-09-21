import { ObjectId } from "mongodb";

export type BookSchema = {
  _id: ObjectId;
  titulo: string;
  autor: string;
  ano: number;
};
