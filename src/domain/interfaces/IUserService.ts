import { CreateUserDTO } from "../dto/CreateUserDTO";
import { User } from "../entity/User";
import { ViewUserDTO } from "./../dto/ViewUserDTO";

export default interface IUserService {
  getUsers(): ViewUserDTO[];
  getUserById(id: number): ViewUserDTO | undefined;
  createUser(user: CreateUserDTO): ViewUserDTO;
  deleteUser(id: number): ViewUserDTO | undefined;
  updateUser(id: number, updatedData: Partial<User>): ViewUserDTO | undefined;
}
