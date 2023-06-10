import * as dotenv from 'dotenv';
import App from './app';
import SportController from './controllers/Sport.controller';
import AuthenticationController from './controllers/Authentication.controller';
import * as process from 'process';

dotenv.config();

const { JWT_TIME, JWT_SECRET, PORT } = process.env;

if (!PORT || !JWT_SECRET || !JWT_TIME) {
  process.exit(1);
}

const timeToExpire = parseInt(JWT_TIME);
const port = parseInt(PORT);

const app = new App(
  [new SportController(), new AuthenticationController(timeToExpire, JWT_SECRET)],
  port
);

app.listen();
