import { User } from "../entity/User";
import { UserSchema } from "../../infra/UserSchema";

export default interface IUserRepository {
  getUsers(): Promise<UserSchema[]>;
  getUserById(id: string): Promise<UserSchema | undefined>;
  createUser(user: User): Promise<UserSchema>;
  deleteUser(id: string): Promise<UserSchema | undefined>;
  updateUser(
    id: string,
    updatedData: Partial<User>
  ): Promise<UserSchema | undefined>;
}
