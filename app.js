const express = require('express');
const mysql = require('mysql');
const app = express();
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
dotenv.config();

app.use(bodyParser.urlencoded({extended: false}));
// looks at request, can get data from the form

app.use(express.static('./public'));

app.use(morgan('short'));
//can use different string to get more exlpaination of bugs or whatever

const router = require('./routes/user.js');

app.use(router);

app.listen(3306)