import logging from './logging';
import routes from './routes';
import db from './db';
import config from './config';
import validation from './validation';
import prod from './prod';

export default app => {
  logging();
  routes(app);
  db();
  config();
  validation();
  prod(app);
};
