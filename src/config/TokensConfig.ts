import process from 'process';
import Logger from '../helpers/Logger';

require('dotenv').config();
const { JWT_EXPIRATION_TIME, JWT_SECRET, REFRESH_TOKEN_EXPIRATION_TIME, REFRESH_TOKEN_SECRET } = process.env;

if (!JWT_EXPIRATION_TIME || !JWT_SECRET || !REFRESH_TOKEN_EXPIRATION_TIME || !REFRESH_TOKEN_SECRET) {
  Logger.error('Failed to initialize tokens env variables.');
  process.exit(1);
}

export default {
  timeToExpire: parseInt(JWT_EXPIRATION_TIME),
  refreshTokenTimeToExpire: parseInt(REFRESH_TOKEN_EXPIRATION_TIME),
  jwtSecret: JWT_SECRET,
  refreshTokenSecret: REFRESH_TOKEN_SECRET
};
