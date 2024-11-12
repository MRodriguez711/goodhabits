const express = require('express');
const cors = require('cors');
const path = require("path");
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use((req, res, next) => {       
    res.header('Access-Control-Allow-Origin', '*'); 
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/client", express.static(path.resolve(__dirname + "/../client/")))

// console.log(path.resolve(__dirname + "/../client/"));

//make the server
var server;
var port = 3000;

//Page listeners  
var router = require("./router.js");
router(app);

//Service Listeners 
var services = require("./services.js")
services(app);

//Listen
server = app.listen(port, function (err) {
    if (err) throw err;
    console.log("listening on port: " + port);
});