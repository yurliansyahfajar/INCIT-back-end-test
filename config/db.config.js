var mysql = require('mysql');
var connect_db = mysql.createConnection({
  host: 'localhost', // Replace with your host name
  user: 'root',      // Replace with your database username
  password: '',      // Replace with your database password
  database: 'incit_backend' // // Replace with your database Name
}); 
 
connect_db.connect(function(err) {
  if (err) throw err;
  console.log('Database is connected successfully !');
});

module.exports = connect_db;