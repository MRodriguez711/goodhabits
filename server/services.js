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

var services = function (app) {             //this function is called when the clients sends a request to this endpoint
    app.post('/create-account', function (req, res) {       //server name is app?
        var data = {    //server extracts the JSON data sent from the client and stores it in data
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            emailAddress: req.body.emailAddress,
            password: req.body.inputPassword       //variable on right matches sql table
        };
        console.log("Data:", data);
//console.log(JSON.stringify(data));
    if (req.body.accountType === 'guardian') {
        connection.query("INSERT INTO guardianaccount SET ?", data, function (err) {    
        //connection.query("INSERT INTO guardianaccount SET ?", data, function (err,results,fields) {     
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error" + err }));
            } else {
                console.log("Account creation successful");
                //console.log(results.insertId);
                return res.status(200).send(JSON.stringify({ msg: "SUCCESS" }));
            }
        }); 
    }else if(req.body.accountType === 'child'){
        connection.query("INSERT INTO childaccount SET ?", data, function (err) {    
            //connection.query("INSERT INTO guardianaccount SET ?", data, function (err,results,fields) {     
                if (err) {
                    console.log("Error inserting into childaccount:", err);
                    return res.status(200).send(JSON.stringify({ msg: "Error" + err }));
                } else {
                    console.log("Account creation successful");
                    //console.log(results.insertId);
                    return res.status(200).send(JSON.stringify({ msg: "SUCCESS" }));
                }
            }); 
    }        
    });

//LOGIN 
    app.get('/validate', function (req, res) {       //server name is app?
            const emailAddress = req.query.emailAddress;        //.get-> req.query //dont need to match the names in the SQL Database but the ones in line 45 have to
            const password = req.query.password;    //extracting the password value from the query string in the URL of an incoming request 
           // console.log("Email:", emailAddress, "Password:", password);
          //if for selecting type of account
            connection.query(
                "SELECT * FROM guardianaccount WHERE emailAddress = ? AND password = ?",
                [emailAddress,password], function(err,results){ //[emailAddress,password] the variables in line 38 & 39
                    if (err) {      //only on server side if theres an error 
                        //console.log(err);
                        return res.status(200).send(JSON.stringify({ msg: "Error" + err }));
                    }if (results.length > 0){
                        console.log("Login successful for user:", results[0]);      //shows in terminal
                        return res.status(200).send(JSON.stringify({ msg: "SUCCESS", data: results[0] }));
                    }else{
                        return res.status(200).send(JSON.stringify({ msg: "Incorrect Email or Password"})); //shows in web console
                    }
                }
            )
    }); //post

};  //END VAR SERVICES 


module.exports = services;
//this exports the services function allowing it to be imported into other files where app(an instance of the Express application) is defined 