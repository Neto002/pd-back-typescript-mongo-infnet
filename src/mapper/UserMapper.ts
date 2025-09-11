import { ViewUserDTO } from "../domain/dto/ViewUserDTO";
import { UserSchema } from "../infra/UserSchema";

export function userSchemaToViewUserDTO(user: UserSchema): ViewUserDTO {
  return {
    id: user.id,
    nome: user.nome,
    ativo: user.ativo,
  } as ViewUserDTO;
}
