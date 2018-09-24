const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();
const puppetRouter = require('./routes/puppet');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static(__dirname + '/public'));
app.use(cookieParser());
app.use( '/', puppetRouter );

module.exports = app;
