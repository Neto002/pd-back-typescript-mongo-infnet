import { Request, Response, Router } from "express";
import { body, param, validationResult } from "express-validator";
import DataValidationException from "../../exception/DataValidationException";
import NoDataProvidedException from "../../exception/NoDataProvidedException";
import { CreateUserDTO } from "../dto/CreateUserDTO";
import { User } from "../entity/User";
import IUserService from "../interfaces/IUserService";
import { inject, injectable } from "inversify";
import { ObjectId } from "mongodb";

@injectable()
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */
export default class UserController {
  private readonly userService: IUserService;
  public router: Router = Router();

  constructor(@inject("UserService") userService: IUserService) {
    this.userService = userService;
    this.routes();
  }

  public routes() {
    /**
     * @swagger
     * /users/{id}:
     *   get:
     *     summary: Get user by ID
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: Numeric ID of the user to get
     *     responses:
     *       200:
     *         description: User found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       400:
     *         description: Invalid ID supplied
     *       404:
     *         description: User not found
     */
    this.router.get(
      "/:id",
      [
        param("id")
          .notEmpty()
          .withMessage("ID is required")
          .custom((id) => ObjectId.isValid(id))
          .withMessage("ID must be a valid MongoDB ObjectId"),
      ],
      this.getUserById.bind(this)
    );

    /**
     * @swagger
     * /users/{id}:
     *   patch:
     *     summary: Update a user by ID
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: Numeric ID of the user to update
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/User'
     *     responses:
     *       200:
     *         description: User updated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       400:
     *         description: Invalid input
     *       404:
     *         description: User not found
     */
    this.router.patch(
      "/:id",
      [
        param("id")
          .notEmpty()
          .withMessage("ID is required")
          .custom((id) => ObjectId.isValid(id))
          .withMessage("ID must be a valid MongoDB ObjectId"),
      ],
      this.updateUser.bind(this)
    );

    /**
     * @swagger
     * /users/{id}:
     *   delete:
     *     summary: Delete a user by ID
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: Numeric ID of the user to delete
     *     responses:
     *       200:
     *         description: User deleted
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       400:
     *         description: Invalid ID supplied
     *       404:
     *         description: User not found
     */
    this.router.delete(
      "/:id",
      [
        param("id")
          .notEmpty()
          .withMessage("ID is required")
          .custom((id) => ObjectId.isValid(id))
          .withMessage("ID must be a valid MongoDB ObjectId"),
      ],
      this.deleteUser.bind(this)
    );

    /**
     * @swagger
     * /users:
     *   get:
     *     summary: Get all users
     *     tags: [Users]
     *     responses:
     *       200:
     *         description: List of users
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/User'
     */
    this.router.get("/", this.getUsers.bind(this));

    /**
     * @swagger
     * /users:
     *   post:
     *     summary: Create a new user
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateUserDTO'
     *     responses:
     *       201:
     *         description: User created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       400:
     *         description: Invalid input
     */
    this.router.post(
      "/",
      [
        body("nome")
          .exists()
          .withMessage("Field 'nome' is required")
          .isString()
          .withMessage("Field 'nome' must be a string"),
        body("ativo")
          .exists()
          .withMessage("Field 'ativo' is required")
          .isBoolean()
          .withMessage("Field 'ativo' must be a boolean"),
      ],
      this.createUser.bind(this)
    );
  }

  public async getUsers(req: Request, res: Response) {
    const users = await this.userService.getUsers();
    return res.json(users);
  }

  public async getUserById(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new DataValidationException(
        errors
          .array()
          .map((err) => err.msg)
          .join(", ")
      );
    }

    const id = req.params.id.toString();

    const user = await this.userService.getUserById(id);

    return res.json(user);
  }

  public async updateUser(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new DataValidationException(
        errors
          .array()
          .map((err) => err.msg)
          .join(", ")
      );
    }

    const id = req.params.id.toString();
    const updatedData: Partial<User> = req.body;

    if (!updatedData || Object.keys(updatedData).length === 0) {
      throw new NoDataProvidedException("No data provided for update");
    }

    const updatedUser = await this.userService.updateUser(id, updatedData);

    return res.json(updatedUser);
  }

  public async createUser(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new DataValidationException(
        errors
          .array()
          .map((err) => err.msg)
          .join(", ")
      );
    }

    const newUser: CreateUserDTO = req.body;
    return res.status(201).json(await this.userService.createUser(newUser));
  }

  public async deleteUser(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new DataValidationException(
        errors
          .array()
          .map((err) => err.msg)
          .join(", ")
      );
    }

    const id = req.params.id.toString();

    const deletedUser = await this.userService.deleteUser(id);

    return res.json(deletedUser);
  }
}
