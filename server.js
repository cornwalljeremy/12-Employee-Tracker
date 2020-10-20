const mysql = require('mysql');
const express = require('express');

const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3001,
    user: 'root',
    password: 'password',
    database: 'employee_DB'
});
connection.connect(err => {
    if(err) throw err;
    console.log('connected as id ' + connection.threadId + '\n');
    afterConnection();
});

app.get('/employee_DB', (req, res) => {
    const sql = 'SELECT * FROM employee';

    connection.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

afterConnection = () => {
    connection.query('SELECT * FROM employee ', function(err, res){
        if(err) throw err;
        console.log(res);
        connection.end();
    });
};

app.listen(3001, ()=> console.log('server started'));