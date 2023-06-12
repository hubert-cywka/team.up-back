import App from './app';
import SportController from './controllers/sport/Sport.controller';
import AuthenticationController from './controllers/authentication/Authentication.controller';
import ApplicationConfig from './config/ApplicationConfig';
import UserController from './controllers/user/User.controller';

require('express-async-errors');

const app = new App(
  [new SportController(), new AuthenticationController(), new UserController()],
  ApplicationConfig.port
);

app.listen();
