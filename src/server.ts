import App from './app';
import SportController from './controllers/sport/Sport.controller';
import AuthenticationController from './controllers/authentication/Authentication.controller';
import ApplicationConfig from './config/ApplicationConfig';
import UserController from './controllers/user/User.controller';
import UserService from './services/user/User.service';
import AuthenticationService from './services/authentication/Authentication.service';
import SportService from './services/sport/Sport.service';
import UserRepository from './repositories/user/User.repository';
import SportRepository from './repositories/sport/Sport.repository';

require('express-async-errors');

const userRepository = new UserRepository();
const sportRepository = new SportRepository();

const userService = new UserService(userRepository);
const authenticationService = new AuthenticationService(userRepository);
const sportService = new SportService(sportRepository);

const app = new App(
  [
    new SportController(sportService, sportRepository),
    new AuthenticationController(authenticationService, userService),
    new UserController(userService)
  ],
  ApplicationConfig.port
);

app.listen();
