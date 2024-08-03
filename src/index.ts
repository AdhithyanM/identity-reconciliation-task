import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import config from "config";

import routes from "./setup/routes";

const app = express();
const port = config.get("app.port");

(async () => {
  app.use(express.json({ limit: "10mb" })); // Parse incoming JSON payloads with a size limit of 10MB
  app.use(helmet()); // Use Helmet for security
  app.use(morgan("tiny")); // Use Morgan for logging request
  app.use(cors()); // Enable CORS

  app.use(routes);

  // resource not found handler
  app.use(() => {
    throw new Error(`Resouce not found`);
  });

  // error handling middleware
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send({
      error: {
        message: error.message,
      },
    });
  });

  // start the server at specified port
  app.listen(port, () => {
    console.log(`---- Server started at port ${port} ----`);
  });
})();
