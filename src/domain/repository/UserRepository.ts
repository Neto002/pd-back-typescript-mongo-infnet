import { UserSchema } from "../../infra/UserSchema";
import { User } from "../entity/User";
import IUserRepository from "../interfaces/IUserRepository";
import { injectable } from "inversify";
import dotenv from "dotenv";
import { Collection, MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import DbException from "../../exception/DbException";
import { userToUserSchema } from "../../mapper/UserMapper";

dotenv.config();

@injectable()
export default class UserRepository implements IUserRepository {
  private readonly mongoUri: string;
  private readonly dbName: string;
  private readonly collectionName: string;

  constructor() {
    this.mongoUri = process.env.MONGO_DB_KEY ?? "";
    this.dbName = process.env.DB_NAME ?? "";
    this.collectionName = "users";
  }

  private async getClientAndCollection(): Promise<{
    client: MongoClient;
    collection: Collection<UserSchema>;
  }> {
    const client = new MongoClient(this.mongoUri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      const db = client.db(this.dbName);
      const collection = db.collection<UserSchema>(this.collectionName);
      return { client, collection };
    } catch (e) {
      if (e instanceof Error) {
        throw new DbException("Error connecting to database.");
      }
      throw e;
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }

  public async getUsers(): Promise<UserSchema[]> {
    const db = await this.getClientAndCollection();
    try {
      await db.client.connect();
      return await db.collection.find().toArray();
    } catch (e) {
      if (e instanceof Error) {
        throw new DbException("Error fetching users from database.");
      }
      throw e;
    } finally {
      await db.client.close();
    }
  }

  public async getUserById(id: string): Promise<UserSchema | undefined> {
    const db = await this.getClientAndCollection();
    try {
      await db.client.connect();
      return await db.collection
        .findOne({ _id: new ObjectId(id) })
        .then((user) => user ?? undefined);
    } catch (e) {
      if (e instanceof Error) {
        throw new DbException("Error fetching user from database.");
      }
      throw e;
    } finally {
      await db.client.close();
    }
  }

  public async createUser(user: User): Promise<UserSchema> {
    const db = await this.getClientAndCollection();
    try {
      await db.client.connect();
      const insertedId = await db.collection
        .insertOne(user)
        .then((result) => result.insertedId);

      user._id = insertedId;

      return userToUserSchema(user);
    } catch (e) {
      if (e instanceof Error) {
        throw new DbException("Error creating user.");
      }
      throw e;
    } finally {
      await db.client.close();
    }
  }

  public async deleteUser(id: string): Promise<UserSchema | undefined> {
    const user = await this.getUserById(id);

    if (!user) {
      return undefined;
    }

    const db = await this.getClientAndCollection();
    try {
      await db.client.connect();
      await db.collection.deleteOne({ _id: new ObjectId(id) });
      return user;
    } catch (e) {
      if (e instanceof Error) {
        throw new DbException("Error deleting user from database.");
      }
      throw e;
    } finally {
      await db.client.close();
    }
  }

  public async updateUser(
    id: string,
    updatedData: Partial<User>
  ): Promise<UserSchema | undefined> {
    const user = await this.getUserById(id);

    if (!user) {
      return undefined;
    }

    const db = await this.getClientAndCollection();
    try {
      await db.client.connect();
      await db.collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );
      return this.getUserById(id);
    } catch (e) {
      if (e instanceof Error) {
        throw new DbException("Error updating user in database.");
      }
      throw e;
    } finally {
      await db.client.close();
    }
  }
}
