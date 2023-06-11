import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import Controller from 'types/controllers/Controller.interface';
import mongoose from 'mongoose';
import errorMiddleware from './middleware/error-handling/Error.middleware';
import cookieParser from 'cookie-parser';
import requestLogger from './middleware/logging/RequestLogger.middleware';
import Logger from './helpers/Logger';
import DatabaseConfig from './config/DatabaseConfig';

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: Controller[], port: number) {
    this.app = express();
    this.port = port;

    this.initializeDatabaseConnection();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
    this.app.use(requestLogger);
    this.app.use(helmet());
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller: Controller) => {
      this.app.use('/', controller.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeDatabaseConnection() {
    mongoose.connect(DatabaseConfig.connectionPath);
  }

  public listen() {
    this.app.listen(this.port, () => {
      Logger.info(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
