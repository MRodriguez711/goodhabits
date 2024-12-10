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
      //  console.log("Data:", data);
//console.log(JSON.stringify(data));
    if (req.body.accountType === 'guardian') {
        connection.query("INSERT INTO guardianaccount SET ?", data, function (err) {    
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
    });//post

//--------------------------  LOGIN  --------------------------  //coming from html values
    app.get('/validate', function (req, res) {       //server name is app?
            const emailAddress = req.query.emailAddress;        //.get-> req.query //dont need to match the names in the SQL Database but the ones in line 45 have to
            const password = req.query.password;    //extracting the password value from the query string in the URL of an incoming request 
            const accountType = req.query.accountType;
            console.log("Email:", emailAddress, "Password:", password, "Account Type:", accountType);
          //if for selecting type of account
          if (accountType === 'guardian') {
            connection.query(
                "SELECT * FROM guardianaccount WHERE emailAddress = ? AND password = ?",
                [emailAddress,password], function(err,results){ //[emailAddress,password] the variables in line 38 & 39
                    if (err) {      //only on server side if theres an error 
                      //  console.log(err);
                        return res.status(200).send(JSON.stringify({ msg: "Error" + err }));
                    }if (results.length > 0){
                        console.log("Login successful for user:", results[0]);      //shows in terminal
                        return res.status(200).send(JSON.stringify({ msg: "SUCCESS", data: results[0] }));
                    }else{
                        return res.status(200).send(JSON.stringify({ msg: "Incorrect Email or Password"})); //shows in web console
                    }
                }
            ); 
        }else if (accountType === 'child') {
            connection.query(
                "SELECT * FROM childaccount WHERE emailAddress = ? AND password = ?",
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
            );
        }
    }); //get

// --------------------------  START OF MANAGE-KIDS  -------------------------- 

    app.post("/addChild", function (req, res) {
        var data = {
         GuardianAccount_idGuardianAccount : req.body.parentId,
         ChildAccount_idChildAccount: req.body.childId
        }
        // console.log('Parent ID:', GuardianAccount_idGuardianAccount);
        // console.log('Added child ID:', ChildAccount_idChildAccount);
        // console.log("Data:", data);

        connection.query("INSERT INTO guardianaccount_has_childaccount SET ?", data, function (err) {
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error inserting child account" + err }));
            } else {
                console.log("Guardian", data.GuardianAccount_idGuardianAccount+ " is now linked to child " + data.ChildAccount_idChildAccount);
                return res.status(200).send(JSON.stringify({ msg: "SUCCESS",parentId: data.GuardianAccount_idGuardianAccount, childId: data.ChildAccount_idChildAccount   }));
            }
        }); 
            
    });

app.get("/getChildren", function (req, res) {        //listener
        
        const parentId = req.query.parentId;
        console.log("Parent Id that is retrieving child: " + parentId);

        connection.query("SELECT firstName, ChildAccount_idChildAccount FROM guardianaccount_has_childaccount INNER JOIN childaccount ON guardianaccount_has_childaccount.ChildAccount_idChildAccount = childaccount.idChildAccount WHERE GuardianAccount_idGuardianAccount = ?",[parentId]
            ,function(err,results){
                if (err) {
                    return res.status(200).send(JSON.stringify({ msg: "Error" + err }));
                } else {
                    console.log("The children are: " + JSON.stringify(results));
                    return res.status(200).send(JSON.stringify({ msg: "SUCCESS", data: results }));
                }
            }
        );
    });//getChildren

app.delete("/delete", function (req, res) {

    var deleteId = req.body.id;
    console.log('Deleted ID:', deleteId);


    connection.query("DELETE FROM goodhabits.guardianaccount_has_childaccount WHERE ChildAccount_idChildAccount = ?", [deleteId], function (err, data) {
            if (err) {
                res.send(JSON.stringify({ msg: err }))
            } else {
                res.send(JSON.stringify({ msg: "SUCCESS" }));
            }
        }
    );
});

// --------------------------  END OF MANAGE-KIDS  --------------------------  

// --------------------------  START OF TASKS  -------------------------- 

app.post("/addTask", function (req, res) {
    
    var data = {
     childaccount_idChildAccount : req.body.childId,     ///
     taskName: req.body.title,
     pointsAwarded : req.body.points,
     taskDescription: req.body.description,
     dueDate : req.body.due
    };

var myPromise = new Promise(function(resolve, reject){
    connection.query("INSERT INTO tasks(taskName,taskDescription,pointsAwarded,dueDate) VALUES (?, ?, ?, ?)",[data.taskName, data.taskDescription, data.pointsAwarded, data.dueDate], function (err,result) {
        if (err) {
            // return res.status(200).send(JSON.stringify({ msg: "Error adding task" + err }));
            reject(err);
        } else {
            // console.log("Task ", data.taskName+ " has been created ");
            // return res.status(200).send(JSON.stringify({ msg: "SUCCESS", taskId: result.insertId, childId: data.childaccount_idChildAccount, task: data.taskName, points: data.pointsAwarded, description: data.taskDescription, due: data.dueDate}));
            resolve(result.insertId);
        }
    } 
    );
});
    myPromise.then(function(insertId){
        connection.query("INSERT INTO childaccount_has_tasks(childaccount_idChildAccount, tasks_idTasks) VALUES (?, ?)", [data.childaccount_idChildAccount,insertId],function(err) {
            if (err) {
                    return res.status(200).send(JSON.stringify({ msg: "Error adding task" + err }));
            } else {
                    console.log("Task ", data.taskName+ "has been added to " +  data.childaccount_idChildAccount);
                    return res.status(200).send(JSON.stringify({ msg: "SUCCESS", taskId:insertId, childId: data.childaccount_idChildAccount, task: data.taskName, points: data.pointsAwarded, description: data.taskDescription, due: data.dueDate}));
        
            }
        }
        );
    });
});//END ADDTASK

app.get("/getTasks", function (req, res) {        //listener
        
    const childId = req.query.childId;
    //console.log("Parent Id that is retrieving child: " + childId);

    connection.query("SELECT tasks.idTasks, tasks.taskName, tasks.taskDescription, tasks.pointsAwarded, tasks.dueDate, tasks.status FROM goodhabits.tasks INNER JOIN childaccount_has_tasks on childaccount_has_tasks.tasks_idTasks = tasks.idTasks WHERE childaccount_idChildAccount= ?",[childId]
        ,function(err,results){
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error" + err }));
            } else {
                console.log("The tasks are: " + JSON.stringify(results));
                return res.status(200).send(JSON.stringify({ msg: "SUCCESS", data: results }));
            }
        }
    );
});//getChildren

app.delete("/deleteTask", function (req, res) {

var deleteId = req.body.id;
console.log('Deleted ID:', deleteId);


var myPromise = new Promise(function(resolve, reject){
        connection.query("DELETE FROM childaccount_has_tasks WHERE tasks_idTasks = ?", [deleteId], function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    res.send(JSON.stringify({ msg: "SUCCESS" }));
                }
            }
);
});
myPromise.then(function(deleteId){
        connection.query("DELETE FROM tasks WHERE idTasks = ?",[deleteId], function (err, data) {
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error deleting task" + err }));
            } else {
                console.log("Task " + deleteId + "has been deleted");
                return res.status(200).send(JSON.stringify({ msg: "SUCCESS"}));
            }
        }
        );
    });
});


app.get("/ChildTasks", function (req, res) {        //listener
        
    // const childId = req.query.childId;
    const userId = req.query.userId;
    //console.log("Parent Id that is retrieving child: " + childId);

    connection.query("SELECT tasks.idTasks, tasks.taskName, tasks.taskDescription, tasks.pointsAwarded, tasks.dueDate, tasks.status FROM goodhabits.tasks INNER JOIN childaccount_has_tasks on childaccount_has_tasks.tasks_idTasks = tasks.idTasks WHERE childaccount_idChildAccount= ?",[userId]
        ,function(err,results){
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error" + err }));
            } else {
                console.log("The tasks are: " + JSON.stringify(results));
                return res.status(200).send(JSON.stringify({ msg: "SUCCESS", data: results }));
            }
        }
    );
});

app.get("/viewChildTasks", function (req, res) {        //listener
        
    const childId = req.query.childId;
    //console.log("Parent Id that is retrieving child: " + childId);

    connection.query("SELECT tasks.idTasks, tasks.taskName, tasks.taskDescription, tasks.pointsAwarded, tasks.dueDate, tasks.status FROM goodhabits.tasks INNER JOIN childaccount_has_tasks on childaccount_has_tasks.tasks_idTasks = tasks.idTasks WHERE childaccount_idChildAccount= ?",[childId]
        ,function(err,results){
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error" + err }));
            } else {
                console.log("The tasks are: " + JSON.stringify(results));
                return res.status(200).send(JSON.stringify({ msg: "SUCCESS", data: results }));
            }
        }
    );
});

app.put("/completingTask", function (req,res) {
    const taskId =  req.body.taskId;;
    const userType = req.body.userType;
    //console.log("Task ID: " + taskId);
    //console.log("User Type: " + userType);
    console.log("In /completingTask");

        if(userType== "child"){
            connection.query("UPDATE goodhabits.tasks SET tasks.status = 'Complete' WHERE tasks.idTasks IN (SELECT tasks_idTasks FROM childaccount_has_tasks WHERE tasks.idTasks= ?)",[taskId]
                ,function(err,results){
                    if (err) {
                        return res.status(200).send(JSON.stringify({ msg: "Error" + err }));
                    } else {
                        console.log("Task " +taskId+ " has been completed");
                        return res.status(200).send(JSON.stringify({ msg: "SUCCESS"}));
                    }
                }
            ); 
        }
    });

    
app.put("/ApprovingTask", function (req,res) {
    const taskId =  req.body.taskId;;
    const userType = req.body.userType;
    //console.log("Task ID: " + taskId);
    //console.log("User Type: " + userType);
    console.log("In /ApprovingTask");

        if(userType== "guardian"){
            connection.query("UPDATE goodhabits.tasks SET tasks.status = 'Approved' WHERE tasks.idTasks IN (SELECT tasks_idTasks FROM childaccount_has_tasks WHERE tasks.idTasks= ?)",[taskId]
                ,function(err,results){
                    if (err) {
                        return res.status(200).send(JSON.stringify({ msg: "Error" + err }));
                    } else {
                        console.log("Task " +taskId+ " has been approved");
                        return res.status(200).send(JSON.stringify({ msg: "SUCCESS"}));
                    }
                }
            ); 
        }
    });

app.put("/IncompletingTask", function (req,res) {
    const taskId =  req.body.taskId;;
    const userType = req.body.userType;
    // console.log("Task ID: " + taskId);
    // console.log("User Type: " + userType);
    console.log("In /IncompletingTask");

        if(userType== "guardian"){
            connection.query("UPDATE goodhabits.tasks SET tasks.status = 'null' WHERE tasks.idTasks IN (SELECT tasks_idTasks FROM childaccount_has_tasks WHERE tasks.idTasks= ?)",[taskId]
                ,function(err,results){
                    if (err) {
                        return res.status(200).send(JSON.stringify({ msg: "Error" + err }));
                    } else {
                        console.log("Task " +taskId+ " has been incompleted");
                        return res.status(200).send(JSON.stringify({ msg: "SUCCESS"}));
                    }
                }
            ); 
        }
    });


// --------------------------  END OF TASKS  --------------------------  

// --------------------------  START OF SHOP  -------------------------- 

app.get("/getPoints", function (req, res) {        //listener
        
    const childId = req.query.childId;
    console.log(childId);

    connection.query("SELECT SUM(pointsAwarded) AS totalPoints FROM tasks WHERE tasks.idTasks IN (SELECT tasks_idTasks FROM childaccount_has_tasks WHERE status='Approved' AND childaccount_idChildAccount=?);",[childId]
        ,function(err,results){
            if (err) {
                return res.status(200).send(JSON.stringify({ msg: "Error" + err }));
            } else {
                console.log("Total points are" + JSON.stringify(results[0].totalPoints));
                return res.status(200).send(JSON.stringify({ msg: "SUCCESS", data: results[0].totalPoints}));
            }
        }
    );
});//getChildren


app.get("/getPointsForKids", function (req, res) {        //listener
        
    const userId = req.query.userId;
    const userType = req.query.userType;

    //console.log(childId);

    if(userType== "child"){
        connection.query("SELECT SUM(pointsAwarded) AS totalPoints FROM tasks WHERE tasks.idTasks IN (SELECT tasks_idTasks FROM childaccount_has_tasks WHERE status='Approved' AND childaccount_idChildAccount=?);",[userId]
            ,function(err,results){
                if (err) {
                    return res.status(200).send(JSON.stringify({ msg: "Error" + err }));
                } else {
                    console.log("Total points are" + JSON.stringify(results[0].totalPoints));
                    return res.status(200).send(JSON.stringify({ msg: "SUCCESS", data: results[0].totalPoints}));
                }
            }
        );
    }
});//getChildren






// --------------------------  END OF SHOP  --------------------------  



};  //END VAR SERVICES 


module.exports = services;
//this exports the services function allowing it to be imported into other files where app(an instance of the Express application) is defined 