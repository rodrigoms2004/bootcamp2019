// usar sucrase para suportar import
// yarn add sucrase nodemon -D
// rodar usando: yarn sucrase-node src/server.js

// para usar nodemon ver nodemon.json

import express from 'express';
import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
// module.exports = new App().server
