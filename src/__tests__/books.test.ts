import request from "supertest";
import express from "express";
import routes from "../routes";
import auth from "../middleware/auth";
import exceptionHandler from "../middleware/exceptionHandler";
import { ObjectId } from "mongodb";

const API_KEY = "chaveSuperSecreta";

describe("Book Endpoints", () => {
  const app = express();
  app.use(express.json());
  app.use(auth);
  app.use("/api", routes);
  app.use(exceptionHandler);

  let createdBookId: string;

  it("should fail authentication with wrong api-key", async () => {
    const res = await request(app).get("/api/books").set("api-key", "invalida");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("should create a book", async () => {
    const res = await request(app)
      .post("/api/books")
      .set("api-key", API_KEY)
      .send({ titulo: "teste", autor: "João", ano: 2025 });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.titulo).toBe("teste");
    createdBookId = res.body._id.toString();
  });

  it("should get all books", async () => {
    const res = await request(app).get("/api/books").set("api-key", API_KEY);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get book by id", async () => {
    const res = await request(app)
      .get(`/api/books/${createdBookId}`)
      .set("api-key", API_KEY);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("_id", createdBookId);
  });

  it("should return 404 for non-existent book", async () => {
    const res = await request(app)
      .get(`/api/books/${new ObjectId().toString()}`)
      .set("api-key", API_KEY);
    expect(res.status).toBe(404); // NotFoundException handled as 404
    expect(res.body).toHaveProperty("error");
  });

  it("should update book", async () => {
    const res = await request(app)
      .patch(`/api/books/${createdBookId}`)
      .set("api-key", API_KEY)
      .send({ titulo: "teste" });
    expect(res.status).toBe(200);
    expect(res.body.titulo).toBe("teste");
  });

  it("should return error for update with no data", async () => {
    const res = await request(app)
      .patch(`/api/books/${createdBookId}`)
      .set("api-key", API_KEY)
      .send({});
    expect(res.status).toBe(400); // NoDataProvidedException handled as 400
    expect(res.body).toHaveProperty("error");
  });

  it("should delete book", async () => {
    const res = await request(app)
      .delete(`/api/books/${createdBookId}`)
      .set("api-key", API_KEY);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("_id", createdBookId);
  });

  it("should return 404 for delete non-existent book", async () => {
    const res = await request(app)
      .delete(`/api/books/${new ObjectId().toString()}`)
      .set("api-key", API_KEY);
    expect(res.status).toBe(404); // NotFoundException handled as 404
    expect(res.body).toHaveProperty("error");
  });

  it("should return validation error for invalid id", async () => {
    const res = await request(app)
      .get(`/api/books/abc`)
      .set("api-key", API_KEY);
    expect(res.status).toBe(400); // DataValidationException handled as 400
    expect(res.body).toHaveProperty("error");
  });

  it("should return validation error for missing titulo on create", async () => {
    const res = await request(app)
      .post("/api/books")
      .set("api-key", API_KEY)
      .send({ autor: "João", ano: 2025 });
    expect(res.status).toBe(400); // DataValidationException handled as 400
    expect(res.body).toHaveProperty("error");
  });
});
