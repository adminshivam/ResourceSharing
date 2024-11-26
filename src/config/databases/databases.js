const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'smartserv@123',
  database: 'resource_sharing',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database.');
});

module.exports = connection;
