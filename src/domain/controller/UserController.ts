import { Request, Response, Router } from "express";
import UserService from "../service/UserService";
import { CreateUserDTO } from "../dto/CreateUserDTO";
import { User } from "../entity/User";
import { body, param, validationResult } from "express-validator";
import NoDataProvidedException from "../../exception/NoDataProvidedException";
import DataValidationException from "../../exception/DataValidationException";

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nome
 *         - ativo
 *       properties:
 *         id:
 *           type: number
 *           description: ID único do usuário
 *           example: 1
 *         nome:
 *           type: string
 *           description: Nome do usuário
 *           example: "João Silva"
 *         ativo:
 *           type: boolean
 *           description: Status de ativação do usuário
 *           example: true
 *         saldo:
 *           type: number
 *           description: Saldo do usuário
 *           example: 100.50
 *         NumeroDoc:
 *           type: string
 *           description: Número do documento (KAMV)
 *           example: "12345678"
 *
 *     CriarUsuarioDTO:
 *       type: object
 *       required:
 *         - nome
 *         - ativo
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome do usuário
 *           example: "Maria Santos"
 *         ativo:
 *           type: boolean
 *           description: Status de ativação do usuário
 *           example: true
 *         saldo:
 *           type: number
 *           description: Saldo inicial do usuário
 *           example: 0
 *
 *     AtualizarUsuarioDTO:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome do usuário
 *           example: "João Santos"
 *         ativo:
 *           type: boolean
 *           description: Status de ativação do usuário
 *           example: false
 *         saldo:
 *           type: number
 *           description: Saldo do usuário
 *           example: 250.75
 *
 *     ViewUsuarioDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: ID único do usuário
 *           example: 1
 *         nome:
 *           type: string
 *           description: Nome do usuário
 *           example: "João Silva"
 *         ativo:
 *           type: boolean
 *           description: Status de ativação do usuário
 *           example: true
 *         NumeroDoc:
 *           type: string
 *           description: Número do documento (KAMV)
 *           example: "12345678"
 *
 *     Error:
 *       type: object
 *       properties:
 *         erro:
 *           type: string
 *           example: "Mensagem de erro"
 *         erros:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               msg:
 *                 type: string
 *               param:
 *                 type: string
 *               location:
 *                 type: string
 *
 *   responses:
 *     BadRequest:
 *       description: Erro de validação
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *     NotFound:
 *       description: Usuário não encontrado
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *
 * tags:
 *   - name: Usuários
 *     description: Operações relacionadas aos usuários
 */
export default class UserController {
  private readonly userService: UserService;
  public router: Router = Router();

  constructor(userService: UserService = new UserService()) {
    this.userService = userService;
    this.routes();
  }

  public routes() {
    this.router.get(
      "/:id",
      [param("id").notEmpty().isNumeric().withMessage("ID must be numeric")],
      this.getUserById.bind(this)
    );
    this.router.patch(
      "/:id",
      [param("id").notEmpty().isNumeric().withMessage("ID must be numeric")],
      this.updateUser.bind(this)
    );
    this.router.delete(
      "/:id",
      [param("id").notEmpty().isNumeric().withMessage("ID must be numeric")],
      this.deleteUser.bind(this)
    );

    this.router.get("/", this.getUsers.bind(this));
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
  /**
   * @swagger
   * /usuarios:
   *   get:
   *     summary: Busca todos os usuários
   *     tags: [Usuários]
   *     description: Retorna uma lista com todos os usuários cadastrados
   *     security:
   *       - basicAuth: []
   *     responses:
   *       200:
   *         description: Lista de usuários retornada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/ViewUsuarioDTO'
   *             example:
   *               - id: 1
   *                 nome: "João Silva"
   *                 ativo: true
   *                 NumeroDoc: "12345678"
   *               - id: 2
   *                 nome: "Maria Santos"
   *                 ativo: false
   *                 NumeroDoc: "87654321"
   *       401:
   *         description: Não autorizado - Credenciais inválidas
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Credenciais inválidas"
   */
  public getUsers(req: Request, res: Response) {
    const users = this.userService.getUsers();
    return res.json(users);
  }

  public getUserById(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new DataValidationException(
        errors
          .array()
          .map((err) => err.msg)
          .join(", ")
      );
    }

    const id = Number(req.params.id);

    const user = this.userService.getUserById(id);

    return res.json(user);
  }

  public updateUser(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new DataValidationException(
        errors
          .array()
          .map((err) => err.msg)
          .join(", ")
      );
    }

    const id = Number(req.params.id);
    const updatedData: Partial<User> = req.body;

    if (!updatedData || Object.keys(updatedData).length === 0) {
      throw new NoDataProvidedException("No data provided for update");
    }

    const updatedUser = this.userService.updateUser(id, updatedData);

    return res.json(updatedUser);
  }

  public createUser(req: Request, res: Response) {
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
    return res.status(201).json(this.userService.createUser(newUser));
  }

  public deleteUser(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new DataValidationException(
        errors
          .array()
          .map((err) => err.msg)
          .join(", ")
      );
    }

    const id = Number(req.params.id);

    const deletedUser = this.userService.deleteUser(id);

    return res.json(deletedUser);
  }
}
