import request from "supertest";
import express from "express";
import routes from "../routes";
import auth from "../middleware/auth";
import exceptionHandler from "../middleware/exceptionHandler";

const API_KEY = "chaveSuperSecreta";

describe("User Endpoints", () => {
  const app = express();
  app.use(express.json());
  app.use(auth);
  app.use("/api", routes);
  app.use(exceptionHandler);

  let createdUserId: number;

  it("should fail authentication with wrong api-key", async () => {
    const res = await request(app).get("/api/users").set("api-key", "invalida");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("should create a user", async () => {
    const res = await request(app)
      .post("/api/users")
      .set("api-key", API_KEY)
      .send({ nome: "João", ativo: true });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.nome).toBe("João");
    createdUserId = res.body.id;
  });

  it("should get all users", async () => {
    const res = await request(app).get("/api/users").set("api-key", API_KEY);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get user by id", async () => {
    const res = await request(app)
      .get(`/api/users/${createdUserId}`)
      .set("api-key", API_KEY);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", createdUserId);
  });

  it("should return 404 for non-existent user", async () => {
    const res = await request(app)
      .get(`/api/users/99999`)
      .set("api-key", API_KEY);
    expect(res.status).toBe(404); // NotFoundException handled as 404
    expect(res.body).toHaveProperty("error");
  });

  it("should update user", async () => {
    const res = await request(app)
      .patch(`/api/users/${createdUserId}`)
      .set("api-key", API_KEY)
      .send({ nome: "Maria" });
    expect(res.status).toBe(200);
    expect(res.body.nome).toBe("Maria");
  });

  it("should return error for update with no data", async () => {
    const res = await request(app)
      .patch(`/api/users/${createdUserId}`)
      .set("api-key", API_KEY)
      .send({});
    expect(res.status).toBe(400); // NoDataProvidedException handled as 400
    expect(res.body).toHaveProperty("error");
  });

  it("should delete user", async () => {
    const res = await request(app)
      .delete(`/api/users/${createdUserId}`)
      .set("api-key", API_KEY);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", createdUserId);
  });

  it("should return 404 for delete non-existent user", async () => {
    const res = await request(app)
      .delete(`/api/users/99999`)
      .set("api-key", API_KEY);
    expect(res.status).toBe(404); // NotFoundException handled as 404
    expect(res.body).toHaveProperty("error");
  });

  it("should return validation error for invalid id", async () => {
    const res = await request(app)
      .get(`/api/users/abc`)
      .set("api-key", API_KEY);
    expect(res.status).toBe(400); // DataValidationException handled as 400
    expect(res.body).toHaveProperty("error");
  });

  it("should return validation error for missing nome on create", async () => {
    const res = await request(app)
      .post("/api/users")
      .set("api-key", API_KEY)
      .send({ ativo: true });
    expect(res.status).toBe(400); // DataValidationException handled as 400
    expect(res.body).toHaveProperty("error");
  });
});
