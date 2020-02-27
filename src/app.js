require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { CLIENT_ORIGIN }= require('./config');
const { NODE_ENV } = require('./config');
const errorHandler = require('../src/middleware/error_handler');

const AuthRouter = require('../src/auth/AuthRouter');
const SongsRouter = require('../src/songs/SongsRouter');
const UserRouter = require('../src/users/UserRouter');
const TagsRouter =  require('../src/tags/TagsRouter');

const app = express();

app.use(cors({origin: CLIENT_ORIGIN}));
app.options('*', cors());
const morganSetting = NODE_ENV === 'production' ? 'tiny' : 'common';



app.use(morgan(morganSetting));


app.use(helmet());

app.use(express.json());




app.use('/api/auth', AuthRouter);
app.use('/api/songs', SongsRouter);
app.use('/api/users', UserRouter);
app.use('/api/tags', TagsRouter);

app.use(errorHandler);


module.exports = app;