import { ViewUserDTO } from "../domain/dto/ViewUserDTO";
import { User } from "../domain/entity/User";
import { UserSchema } from "../infra/UserSchema";

export function userSchemaToViewUserDTO(user: UserSchema): ViewUserDTO {
  return {
    _id: user._id.toString(),
    nome: user.nome,
    ativo: user.ativo,
    saldo: user.saldo,
  } as ViewUserDTO;
}

export function userToUserSchema(user: User): UserSchema {
  return {
    _id: user._id ? user._id : undefined,
    nome: user.nome,
    ativo: user.ativo,
    saldo: user.saldo,
  } as UserSchema;
}
