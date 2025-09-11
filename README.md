# pd-back-typescript-infnet

## Descrição

Este projeto é uma API REST para gerenciamento de usuários e livros, desenvolvida em TypeScript com Express. Ele simula um banco de dados utilizando um arquivo JSON e implementa autenticação via header `api-key`. O sistema possui camadas bem definidas para controller, serviço, repositório, DTOs, entidades, mapeamento, exceções e middlewares.

## Estrutura do Projeto

- **src/**: Código-fonte principal
  - **main.ts**: Ponto de entrada da aplicação
  - **routes.ts**: Definição das rotas da API
  - **domain/**: Camada de domínio
    - **controller/**: Controladores (ex: UserController)
    - **dto/**: Data Transfer Objects (ex: CreateUserDTO, ViewUserDTO)
    - **entity/**: Entidades (ex: User)
    - **repository/**: Repositórios para acesso a dados (ex: UserRepository)
    - **service/**: Serviços de negócio (ex: UserService)
  - **exception/**: Classes de exceção personalizadas
  - **infra/**: Infraestrutura (ex: db.json para simular o banco de dados)
  - **mapper/**: Mapeamento entre entidades e DTOs
  - **middleware/**: Middlewares (logger, autenticação, tratamento de exceções)
  - **\_\_tests\_\_/**: Testes automatizados com Jest e Supertest

## Tecnologias Utilizadas

- **TypeScript**: Tipagem estática para JavaScript
- **Express**: Framework para APIs REST
- **express-validator**: Validação de dados das requisições
- **Jest**: Testes automatizados
- **Supertest**: Testes de integração para APIs
- **ts-node / ts-node-dev**: Execução e desenvolvimento com TypeScript
- **fs**: Manipulação de arquivos para persistência dos dados

## Autenticação

Todas as requisições protegidas exigem o header:

```
api-key: chaveSuperSecreta
```

## Como Executar

1. **Instale as dependências**

   ```fish
   npm install
   ```

2. **Execute em modo desenvolvimento**

   ```fish
   npm run dev
   ```

3. **Execute em modo produção**

   ```fish
   npm run build
   npm start
   ```

4. **Execute os testes**

   ```fish
   npm test
   ```

5. **Acesse a API**
   O servidor estará disponível em:
   ```
   http://localhost:3000/api
   ```

## Observações

- O banco de dados é simulado via arquivo db.json.
- As rotas principais estão em `/api/users` e `/api/books`.
- Para modificar ou adicionar entidades, utilize a estrutura de DTOs, entidades e serviços.
- Os testes automatizados garantem o funcionamento dos endpoints e da autenticação.

## Autor

Antonio Neto
