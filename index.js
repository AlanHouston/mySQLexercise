var express = require('express');
var mysql = require('mysql');
var app = express();
const dotenv = require("dotenv");
dotenv.config();

var connection = mysql.createConnection({
    host: process.env.testHost,
    user: 'altesting',
    password: process.env.testPass,
    database: 'altesting'
});

connection.connect(function(error) {
    if(!!error) {
        console.log('ERROR');
    } else {
        console.log('CONNECTED');
    }
});

app.get('/', function(req, res) {
    connection.query('SELECT * FROM sampletable', function(error, rows, fields) {
        if(!!error) {
            console.log('Error ' + error);
        } else {
            // console.log(rows[0].id + ' ' + rows[0].name);
            // console.log(rows[1].id + ' ' + rows[1].name);
            for (let i=0; i < rows.length; i++) {
                console.log(rows[i].id + ' ' + rows[i].name);
            }
        }
    });
});

app.listen(3306)