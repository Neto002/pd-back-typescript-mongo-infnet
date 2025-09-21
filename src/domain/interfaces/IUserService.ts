import { CreateUserDTO } from "../dto/CreateUserDTO";
import { User } from "../entity/User";
import { ViewUserDTO } from "./../dto/ViewUserDTO";

export default interface IUserService {
  getUsers(): Promise<ViewUserDTO[]>;
  getUserById(id: string): Promise<ViewUserDTO | undefined>;
  createUser(user: CreateUserDTO): Promise<ViewUserDTO>;
  deleteUser(id: string): Promise<ViewUserDTO | undefined>;
  updateUser(
    id: string,
    updatedData: Partial<User>
  ): Promise<ViewUserDTO | undefined>;
}
