import morgan, { StreamOptions } from 'morgan';
import Logger from '../../shared/helpers/Logger';

const stream: StreamOptions = {
  write: (message) => Logger.http(message)
};

const skip = () => {
  const env = process.env.NODE_ENV || 'development';
  return env !== 'development';
};

const requestLogger = morgan(
  'METHOD: :method | PATH: :url | STATUS: :status | CONTENT-LENGTH: :res[content-length] | RESPONSE_TIME: :response-time ms',
  { stream, skip }
);

export default requestLogger;
