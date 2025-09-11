import NotFoundException from "../../exception/NotFoundException";
import { userSchemaToViewUserDTO } from "../../mapper/UserMapper";
import { CreateUserDTO } from "../dto/CreateUserDTO";
import { User } from "../entity/User";
import UserRepository from "../repository/UserRepository";
import { ViewUserDTO } from "./../dto/ViewUserDTO";

export default class UserService {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  getUsers(): ViewUserDTO[] {
    return this.userRepository
      .getUsers()
      .map((user) => userSchemaToViewUserDTO(user));
  }

  getUserById(id: number): ViewUserDTO | undefined {
    if (typeof id !== "number") {
      throw new Error("Id must be a number");
    }

    const user = this.userRepository.getUserById(id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return userSchemaToViewUserDTO(user);
  }

  createUser(user: CreateUserDTO): ViewUserDTO {
    const users = this.userRepository.getUsers();

    const maxId = users.reduce(
      (prevUser, currUser) => (currUser.id > prevUser.id ? currUser : prevUser),
      { id: 0 }
    ).id;
    const userId = maxId + 1;

    const createdUser = this.userRepository.createUser(
      new User(userId ?? 0, user.nome, user.ativo, user.saldo)
    );

    return userSchemaToViewUserDTO(createdUser);
  }

  deleteUser(id: number): ViewUserDTO | undefined {
    const deletedUser = this.userRepository.deleteUser(id);

    if (!deletedUser) {
      throw new NotFoundException("User not found");
    }

    return deletedUser ? userSchemaToViewUserDTO(deletedUser) : undefined;
  }

  updateUser(id: number, updatedData: Partial<User>): ViewUserDTO | undefined {
    const updatedUser = this.userRepository.updateUser(id, updatedData);

    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }

    return updatedUser ? userSchemaToViewUserDTO(updatedUser) : undefined;
  }
}
