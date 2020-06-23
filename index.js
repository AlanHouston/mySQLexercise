const express = require('express');
const mysql = require('mysql');
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const connection = mysql.createConnection({
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

app.get('/', (req,res) => {
    res.send('Try using a pathname!');
});

app.get('/crew/:id', (req,res) => {
        const userId = req.params.id;
        const querystring = 'SELECT * FROM sampletable WHERE id = ?';
        connection.query(querystring, [userId], (err, rows, fields) => {
            if(!!err) {
                console.log(err);
                res.end();
            } else {
                res.json(rows);
            }
        });
})

app.get('/numerical', (req,res) => {
    connection.query('SELECT * FROM sampletable ORDER BY id', function(err, rows, fields) {
        if(!!err) {
            console.log(err)
        } else {
            res.send(rows);
        }
    });
});

app.get('/crew', function(req, res) {
    connection.query('SELECT * FROM sampletable', function(err, rows, fields) {
        if(!!err) {
            console.log('Error ' + err);
        } else {
            // console.log(rows[0].id + ' ' + rows[0].name);
            // console.log(rows[1].id + ' ' + rows[1].name);
            
            // let people = [];
            // for (let i=0; i < rows.length; i++) {
            //     let fullName = rows[i].id + ' ' + rows[i].name;
            //     people.push(fullName);
            // }
            // res.send(people);
            res.json(rows);
        }
    });
});

app.listen(3306)