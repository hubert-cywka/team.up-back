import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import mongoose from 'mongoose';
import errorMiddleware from './middleware/error-handling/Error.middleware';
import cookieParser from 'cookie-parser';
import requestLogger from './middleware/logging/RequestLogger.middleware';
import Logger from './shared/helpers/Logger';
import DatabaseConfig from './shared/config/DatabaseConfig';
import cors from 'cors';
import ResourceNotFoundResponse from './shared/helpers/ResourceNotFoundResponse';
import ApplicationConfig from './shared/config/ApplicationConfig';
import 'reflect-metadata';
import rateLimiter from 'express-rate-limit';
import { Controller } from './shared/types/Controller';

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: Controller[], port: number) {
    const { NODE_ENV } = process.env;

    this.app = express();
    this.port = NODE_ENV === 'test' ? 0 : port;

    this.initializeDatabaseConnection();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(this.initializeRateLimiter());
    this.app.use(requestLogger);
    this.app.use(cors(this.getCorsSettings()));
    this.app.use(helmet());
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller: Controller) => {
      this.app.use('/app/', controller.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use((req, res, next) => {
      next(new ResourceNotFoundResponse());
    });
    this.app.use(errorMiddleware);
  }

  private initializeRateLimiter() {
    return rateLimiter({ windowMs: ApplicationConfig.rateLimitTimespan, max: ApplicationConfig.rateLimit });
  }

  private initializeDatabaseConnection() {
    const { NODE_ENV } = process.env;
    if (NODE_ENV === 'test') {
      mongoose.connect(DatabaseConfig.testConnectionPath);
    } else {
      mongoose.connect(DatabaseConfig.connectionPath);
    }
  }

  private getCorsSettings() {
    return {
      origin: ApplicationConfig.frontendUrl.split(','),
      credentials: true,
      optionsSuccessStatus: 200,
      methods: ['POST', 'PUT', 'OPTIONS', 'DELETE', 'GET', 'PATCH'],
      allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
    };
  }

  public listen() {
    this.app.listen(this.port, () => {
      Logger.info(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
