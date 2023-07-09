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
import EventRepository from './repositories/event/Event.repository';
import EventService from './services/event/Event.service';
import EventController from './controllers/event/Event.controller';
import TokenRepository from './repositories/token/Token.repository';

require('express-async-errors');

const userRepository = new UserRepository();
const sportRepository = new SportRepository();
const eventRepository = new EventRepository();
const tokenRepository = new TokenRepository();

const userService = new UserService(userRepository);
export const authenticationService = new AuthenticationService(userRepository, tokenRepository);
const sportService = new SportService(sportRepository);
const eventService = new EventService(eventRepository);

const app = new App(
  [
    new SportController(sportService, sportRepository),
    new AuthenticationController(authenticationService, userService),
    new UserController(userService),
    new EventController(eventService, sportService)
  ],
  ApplicationConfig.port
);

if (process.env.NODE_ENV !== 'test') {
  app.listen();
}

module.exports = app.app;
