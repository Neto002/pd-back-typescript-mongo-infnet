import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Usuários",
      version: "1.0.0",
      description:
        "API REST para gerenciamento de usuários desenvolvida com Express e TypeScript",
      contact: {
        name: "Desenvolvedor",
        email: "renan.torres@prof.infnet.edu.br",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Servidor de Desenvolvimento",
      },
      {
        url: "https://api.exemplo.com",
        description: "Servidor de Produção",
      },
    ],
    components: {
      securitySchemes: {
        basicAuth: {
          type: "http",
          scheme: "basic",
          description: "Autenticação básica usando usuário e senha",
        },
      },
    },
    security: [
      {
        basicAuth: [],
      },
    ],
  },
  apis: [
    "./src/domain/controller/*.ts", // Caminho para seus controllers
    "./src/routes/*.ts", // Caminho para suas rotas (se houver)
    //'./src/Enities/models/*.ts',       // Caminho para seus models (se houver)
  ],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Application): void => {
  // Middleware para servir a documentação Swagger
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "API de Usuários - Documentação",
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
      },
    })
  );

  // Endpoint para obter a especificação OpenAPI em JSON
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(specs);
  });

  console.log(
    "📚 Documentação Swagger disponível em: http://localhost:3000/api-docs"
  );
};

export default setupSwagger;
