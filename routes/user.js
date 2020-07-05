// will contain all of our user related routes
const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const bcrypt = require('bcryptjs');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.testHost,
    user: 'altesting',
    password: process.env.testPass,
    database: 'altesting'
})

function getConnection() {
    return pool;
}

router.get('/users', (req,res) => {
    const connection = getConnection();
    const queryString = 'SELECT * FROM sampletable';

    connection.query(queryString, (err, rows, fields) => {
        if (!!err) {
            console.log('failed to query for users: ' + err);
            res.sendStatus(500);
            return
        }
        res.json(rows);
    });
});

router.get('/user/:id', (req,res) => {
    const connection = getConnection();
    const userId = req.params.id;
    const queryString = 'SELECT * FROM sampletable WHERE id = ?';

    connection.query(queryString, [userId], (err, rows, fields) => {
        if(!!err) {
            console.log('Failed to query: ' + err);
            res.sendStatus(500);
            // res.end();
            return
        }

        const peeps = rows.map((row) => {
            return {peep: row.first_name}
        })

        res.json(peeps);
    });
});

router.get('/crew', function(req, res) {
    const connection = getConnection();

    connection.query('SELECT * FROM sampletable', function(err, rows, fields) {
        if(!!err) {
            console.log('Error ' + err);
        } else {
            console.log(rows[0].id + ' ' + rows[0].name);
            console.log(rows[1].id + ' ' + rows[1].name);
            
            let people = [];
            for (let i=0; i < rows.length; i++) {
                let fullName = rows[i].id + ' ' + rows[i].first_name;
                people.push(fullName);
            }
            res.send(people);
        }
    });
});

router.get('/numerical', (req,res) => {
    const connection = getConnection();

    connection.query('SELECT * FROM sampletable ORDER BY id', function(err, rows, fields) {
        if(!!err) {
            console.log(err)
        } else {
            res.send(rows);
        }
    });
});

router.post('/user_create', (req,res) => {
    const connection = getConnection();
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
        res.end();
    });

    res.end();
})

router.post('/create_account', (req,res) => {
    const connection = getConnection();
    const email = req.body.create_email;
    const password = req.body.create_password;

    // const queryString = 'SELECT * FROM user_accounts WHERE email = ?';

    const queryString = 'SELECT * FROM user_accounts WHERE email = ?';

    connection.query(queryString, [email], (err, results, fields) => {
        console.log(results);
        if (!!err) {
            console.log('Failed to insert user ' + err);
            res.sendStatus(500);
            return

        } else if (results.length) {
            console.log('email already exists');
        } else {
            let hash = bcrypt.hashSync(password, 8);

            const createAccountString = 'INSERT INTO user_accounts (email, password) VALUES (?, ?)';
            connection.query(createAccountString, [email, hash], (err, results, fields) => {
                if (!!err) {
                    console.log('Failed to insert user ' + err);
                    res.sendStatus(500);
                    return
                }
        
                console.log('Inserted a new account with id: ' + results.insertId + ' and email: ' + email);

                res.end();
            })
        }
    })
})

router.get('/', (req,res) => {
    res.send('Try using a pathname!');
});


// this was from when getCOnnection returned the mysql.createConnection obj with the DB object

// function checkConnection() {
//     const connection = getConnection();
    
//     connection.connect(function(error) {
//         if(!!error) {
//             console.log('ERROR');
//         } else {
//             console.log('CONNECTED');
//         }
//     });
// }
// checkConnection();

module.exports = router;