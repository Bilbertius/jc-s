require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { API_BASE_URL }= require('./config');
const { NODE_ENV } = require('./config');
const errorHandler = require('../src/middleware/error_handler');

const AuthRouter = require('../src/auth/AuthRouter');
const SongsRouter = require('../src/songs/SongsRouter');
const UserRouter = require('../src/users/UserRouter');
const TagsRouter =  require('../src/tags/TagsRouter');

const app = express();

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';



app.use(morgan('common'));


app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());
app.use('/api/auth', AuthRouter);
app.use('/api/songs', SongsRouter);
app.use('/api/users', UserRouter);
app.use('/api/tags', TagsRouter);

app.use(errorHandler);


module.exports = app;