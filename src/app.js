require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const { CLIENT_ORIGIN }= require('./config');
const { NODE_ENV } = require('./config');
const errorHandler = require('../src/middleware/error_handler');

const AuthRouter = require('./auth/auth-router');
const SongsRouter = require('./songs/songs-router');
const UserRouter = require('./users/users-router');


const app = express();


const morganSetting = NODE_ENV === 'production' ? 'tiny' : 'common';
app.use(morgan(morganSetting));
app.use(helmet());
/*
* Enable cross origin resource sharing including preflight checks via an options request
* */
app.use(cors());
app.options('*', cors());



/*
* Instruct the server to direct appropriate requests to their respective routes
* */
app.use('/api/auth', AuthRouter);
app.use('/api/songs', SongsRouter);
app.use('/api/users', UserRouter);


app.use(errorHandler);


module.exports = app;