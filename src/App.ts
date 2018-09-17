import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as logger from 'morgan';
import * as path from 'path';
import config from './config/config';
import WordpressRouter from './routes/wordpress';

// Auth0
import jwt = require('express-jwt');
import jwks = require('jwks-rsa');

const Config = config();
const jwtCheck = jwt({
  algorithms: ['RS256'],
  audience: 'https://api.clubebossa',
  issuer: 'https://regularswitch.auth0.com/',
  secret: jwks.expressJwtSecret({
      cache: true,
      jwksRequestsPerMinute: 5,
      jwksUri: 'https://regularswitch.auth0.com/.well-known/jwks.json',
      rateLimit: true,
  }),
});

// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public express: express.Application;

  // Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: true }));

    console.log('Env: ' + process.env.NODE_ENV);
    if (process.env.NODE_ENV !== 'development') {
      // console.log('setting up jwt');
      this.express.use(jwtCheck);
      this.express.use((err, req, res, next) => {
          if (err.name === 'UnauthorizedError') {
              res.status(401).json({message: 'Missing or invalid token'});
          }
      });
    }

    this.express.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, id, Authorization, x-access-token, username, password');
      next();
    });

  }

  // Configure API endpoints.
  private routes(): void {
    const wordpressRouter = new WordpressRouter(Config.base.wordpress);
    wordpressRouter.init()
      .then(() => {
        console.log('API ready');
        this.express.use(wordpressRouter.path, wordpressRouter.router);
        this.express.get('/authorized', (req, res) => {
          res.send('Secured Resource');
      });
      });
    // wordpressRouter.init()
    // .then(() => {
    //   this.express.use(wordpressRouter.path, wordpressRouter.router);
    // });

    /* This is just to get up and running, and to make sure what we've got is
     * working so far. This function will change when we start to add more
     * API endpoints */

     // const router = express.Router();

    // // placeholder route handler
    // router.get('/', (req, res, next) => {
    //   res.json({
    //     message: 'Hello World!',
    //   });
    // });
  }

}

export default new App().express;
