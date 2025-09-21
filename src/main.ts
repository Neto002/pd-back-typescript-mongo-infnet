import express from "express";
import routes from "./routes";
import logger from "./middleware/logger";
import auth from "./middleware/auth";
import exceptionHandler from "./middleware/exceptionHandler";
import setupSwagger from "./config/Swagger";

const app = express();
const port = 3000;

setupSwagger(app);
app.use(express.json());

app.use(logger);
app.use(auth);

app.use("/api", routes);

app.use(exceptionHandler);
app.listen(port, () => {
  console.info(`Server is running at http://localhost:${port}`);
});
