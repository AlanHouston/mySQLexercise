var express = require('express');
var mysql = require('mysql');
var app = express();

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'new'
});

connection.connect(function(error) {
    if(!!error) {
        console.log('ERROR');
    } else {
        console.log('CONNECTED');
    }
});

app.get('/', function(req, res) {
    connection.query('SELECT * FROM theTable', function(error, rows, fields) {
        if(!!error) {
            console.log('Query Error');
        } else {
            console.log('Query sucessful');
            // do shit
        }
    });
});

app.listen(3000)