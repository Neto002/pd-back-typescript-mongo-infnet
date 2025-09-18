import fs from "fs";
import path from "path";
import { DBSchema } from "../../infra/DBSchema";
import { UserSchema } from "../../infra/UserSchema";
import { User } from "../entity/User";
import IUserRepository from "../interfaces/IUserRepository";

export default class UserRepository implements IUserRepository {
  private readonly filePath: string;

  constructor(filePath: string = "../../infra/db.json") {
    this.filePath = path.join(__dirname, filePath);
  }

  private accessDB(): DBSchema {
    const db = fs.readFileSync(this.filePath, "utf-8");
    return JSON.parse(db);
  }

  private rewriteDB(db: DBSchema): boolean {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(db, null, 2));
      return true;
    } catch (error) {
      console.error("Error rewriting database:", error);
      return false;
    }
  }

  public getUsers() {
    const db = this.accessDB();
    return db.users;
  }

  public getUserById(id: number) {
    const users = this.getUsers();
    return users.find((user) => user.id === id);
  }

  public createUser(user: User): UserSchema {
    const users = this.getUsers();
    users.push({ ...user });
    const db = this.accessDB();
    db.users = users;
    this.rewriteDB(db);
    return user;
  }

  public deleteUser(id: number): UserSchema | undefined {
    const user = this.getUserById(id);

    if (!user) {
      return undefined;
    }

    const users = this.getUsers();
    const userIndex = users.findIndex((user) => user.id === id);

    users.splice(userIndex, 1);

    const db = this.accessDB();
    db.users = users;
    this.rewriteDB(db);

    return user;
  }

  public updateUser(
    id: number,
    updatedData: Partial<User>
  ): UserSchema | undefined {
    const users = this.getUsers();
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return undefined; // User not found
    }

    users[userIndex] = { ...users[userIndex], ...updatedData, id };

    const db = this.accessDB();
    db.users = users;

    const success = this.rewriteDB(db);

    return success ? users[userIndex] : undefined;
  }
}
