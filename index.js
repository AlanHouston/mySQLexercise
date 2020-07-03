const express = require('express');
const mysql = require('mysql');
const app = express();
const dotenv = require('dotenv');
const morgan = require('morgan')
dotenv.config();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
// looks at request, can get data from the form

app.use(express.static('./public'));

app.use(morgan('short'));
//can use different string to get more exlpaination of bugs or whatever

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
                console.log('Failed to query: ' + err);
                res.sendStatus(500);
                // res.end();
                return
            }

            const peeps = rows.map((row) => {
                return {peep: row.name}
            })

            res.json(peeps);
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

app.post('/user_create', (req,res) => {
    const firstName = req.body.create_first_name;
    const lastName = req.body.create_last_name;
    const salary = req.body.create_salary;

    const queryString = 'INSERT INTO sampletable (first_name, last_name, salary) VALUES (?, ?, ?)'
    // thse are the column namse from the DB

    connection.query(queryString, [firstName, lastName, salary], (err, results, fields) => {
        if (!!err) {
            console.log('Failed to insert user ' + err);
            res.sendStatus(500);
            return
        }

        console.log('Inserted a new user with id: ' + results.insertId);
        res.end
    });

    res.end();
})

app.listen(3306)