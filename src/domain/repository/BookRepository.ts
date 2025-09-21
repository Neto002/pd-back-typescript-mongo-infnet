import { Book } from "../entity/Book";
import { BookSchema } from "../../infra/BookSchema";
import IBookRepository from "../interfaces/IBookRepository";
import { injectable } from "inversify";
import { Collection, MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import DbException from "../../exception/DbException";
import { bookToBookSchema } from "../../mapper/BookMapper";

@injectable()
export default class BookRepository implements IBookRepository {
  private readonly mongoUri: string;
  private readonly dbName: string;
  private readonly collectionName: string;

  constructor() {
    this.mongoUri = process.env.MONGO_DB_KEY ?? "";
    this.dbName = process.env.DB_NAME ?? "";
    this.collectionName = "books";
  }

  private async getClientAndCollection(): Promise<{
    client: MongoClient;
    collection: Collection<BookSchema>;
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
      const collection = db.collection<BookSchema>(this.collectionName);
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

  public async getBooks(): Promise<BookSchema[]> {
    const db = await this.getClientAndCollection();
    try {
      await db.client.connect();
      return await db.collection.find().toArray();
    } catch (e) {
      if (e instanceof Error) {
        throw new DbException("Error fetching books from database.");
      }
      throw e;
    } finally {
      await db.client.close();
    }
  }

  public async getBookById(id: string): Promise<BookSchema | undefined> {
    const db = await this.getClientAndCollection();
    try {
      await db.client.connect();
      return await db.collection
        .findOne({ _id: new ObjectId(id) })
        .then((book) => book ?? undefined);
    } catch (e) {
      if (e instanceof Error) {
        throw new DbException("Error fetching book from database.");
      }
      throw e;
    } finally {
      await db.client.close();
    }
  }

  public async createBook(book: Book): Promise<BookSchema> {
    const db = await this.getClientAndCollection();
    try {
      await db.client.connect();
      const insertedId = await db.collection
        .insertOne(book)
        .then((result) => result.insertedId);

      book._id = insertedId;

      return bookToBookSchema(book);
    } catch (e) {
      if (e instanceof Error) {
        throw new DbException("Error creating book.");
      }
      throw e;
    } finally {
      await db.client.close();
    }
  }

  public async deleteBook(id: string): Promise<BookSchema | undefined> {
    const book = await this.getBookById(id);

    if (!book) {
      return undefined;
    }

    const db = await this.getClientAndCollection();
    try {
      await db.client.connect();
      await db.collection.deleteOne({ _id: new ObjectId(id) });
      return book;
    } catch (e) {
      if (e instanceof Error) {
        throw new DbException("Error deleting book from database.");
      }
      throw e;
    } finally {
      await db.client.close();
    }
  }

  public async updateBook(
    id: string,
    updatedData: Partial<Book>
  ): Promise<BookSchema | undefined> {
    const book = await this.getBookById(id);

    if (!book) {
      return undefined;
    }

    const db = await this.getClientAndCollection();
    try {
      await db.client.connect();
      await db.collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );
      return this.getBookById(id);
    } catch (e) {
      if (e instanceof Error) {
        throw new DbException("Error updating book in database.");
      }
      throw e;
    } finally {
      await db.client.close();
    }
  }
}
