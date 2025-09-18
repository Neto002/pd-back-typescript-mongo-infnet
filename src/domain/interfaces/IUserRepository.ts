import { User } from "../entity/User";
import { UserSchema } from "../../infra/UserSchema";

export default interface IUserRepository {
  getUsers(): UserSchema[];
  getUserById(id: number): UserSchema | undefined;
  createUser(user: User): UserSchema;
  deleteUser(id: number): UserSchema | undefined;
  updateUser(id: number, updatedData: Partial<User>): UserSchema | undefined;
}
