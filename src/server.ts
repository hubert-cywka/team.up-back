import App from './app';
import SportController from './controllers/sport/Sport.controller';
import AuthenticationController from './controllers/authentication/Authentication.controller';
import ApplicationConfig from './config/ApplicationConfig';

const app = new App(
  [new SportController(), new AuthenticationController()],
  ApplicationConfig.port
);

app.listen();
