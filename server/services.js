const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'goodhabits'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected to MySQL");
})

var services = function (app) {         /////CHANGE////
    app.post('/write-record', function (req, res) {
        var data = {
            author: req.body.author,
            publisher: req.body.publisher,
            yearPublished: req.body.yearPublished,
            isbn: req.body.isbn
        };


        connection.query("INSERT INTO books SET ?", data, function (err) {         /////CHANGE////
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error" + err }));
            } else {
                return res.status(200).send(JSON.stringify({ msg: "SUCCESS" }));
            }
        });
    });



};

module.exports = services;