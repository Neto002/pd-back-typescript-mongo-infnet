import { inject, injectable } from "inversify";
import NotFoundException from "../../exception/NotFoundException";
import { userSchemaToViewUserDTO } from "../../mapper/UserMapper";
import { CreateUserDTO } from "../dto/CreateUserDTO";
import { User } from "../entity/User";
import IUserRepository from "../interfaces/IUserRepository";
import IUserService from "../interfaces/IUserService";
import { ViewUserDTO } from "./../dto/ViewUserDTO";

@injectable()
export default class UserService implements IUserService {
  private readonly userRepository: IUserRepository;

  constructor(@inject("UserRepository") userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async getUsers(): Promise<ViewUserDTO[]> {
    return this.userRepository
      .getUsers()
      .then((users) => users.map((user) => userSchemaToViewUserDTO(user)));
  }

  async getUserById(id: string): Promise<ViewUserDTO | undefined> {
    if (typeof id !== "string") {
      throw new Error("Id must be a string");
    }

    const user = await this.userRepository.getUserById(id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return userSchemaToViewUserDTO(user);
  }

  async createUser(user: CreateUserDTO): Promise<ViewUserDTO> {
    const createdUser = await this.userRepository.createUser(
      new User(user.nome, user.ativo, user.saldo)
    );

    return userSchemaToViewUserDTO(createdUser);
  }

  async deleteUser(id: string): Promise<ViewUserDTO | undefined> {
    const deletedUser = await this.userRepository.deleteUser(id);

    if (!deletedUser) {
      throw new NotFoundException("User not found");
    }

    return deletedUser ? userSchemaToViewUserDTO(deletedUser) : undefined;
  }

  async updateUser(
    id: string,
    updatedData: Partial<User>
  ): Promise<ViewUserDTO | undefined> {
    const updatedUser = await this.userRepository.updateUser(id, updatedData);

    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }

    return updatedUser ? userSchemaToViewUserDTO(updatedUser) : undefined;
  }
}
