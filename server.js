const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employee_DB'
});
connection.connect(err => {
    if(err) throw err;
    console.log('connected as id ' + connection.threadId + '\n');
    afterConnection();
});

afterConnection = () => {
    connection.query('SELECT * FROM employees ', function(err, res){
        if(err) throw err;
        console.log(res);
        connection.end();
    });
};

