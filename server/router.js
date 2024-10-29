//focuses on routing the pages to the client 
const path = require("path");

//Page listener--listening for requests to send a page
var router = function (app) { 
    app.get("/", function (req, res) {      
        res.status(200).sendFile(path.join(__dirname + "/../client/login.html"))    //landing page
    });
    app.get("/create-account", function (req, res) {
        res.status(200).sendFile(path.join(__dirname + "/../client/create-account.html"))
    });
    app.get("/manage-kids", function (req, res) {
        res.status(200).sendFile(path.join(__dirname + "/../client/manage-kids.html"))
    });
    app.get("/parents-home", function (req, res) {
        res.status(200).sendFile(path.join(__dirname + "/../client/parents-home.html"))
    });
    app.get("/shop", function (req, res) {
        res.status(200).sendFile(path.join(__dirname + "/../client/shop.html"))
    });
    app.get("/tasks", function (req, res) {
        res.status(200).sendFile(path.join(__dirname + "/../client/tasks.html"))
    });
};

module.exports = router;