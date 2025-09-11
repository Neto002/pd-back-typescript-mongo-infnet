import { BookSchema } from "./BookSchema";
import { UserSchema } from "./UserSchema";

export type DBSchema = {
  users: UserSchema[];
  books: BookSchema[];
};
