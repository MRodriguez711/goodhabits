$(document).ready(function() {
    $('.links a').click(function() {
        $('.links a').removeClass('clicked');
        
        $(this).addClass('clicked');
    });
});

var userType = localStorage.getItem('userType');
var userId = localStorage.getItem('userId');

if(userType === 'child'){
        $('.onlyParentsContainer').hide();
        $('.parentContainer').hide();
        $("#displayChildId").append(userId)
        $('a[href="/manage-kids"]').hide();
        $('#incomplete').hide();
        $('#delete').hide();
        retrieveTasksForChild();
}else if(userType === 'guardian'){
        $("#displayChildId").hide();
        var parentId= userId;
}

$('#logout').click(function() {
        localStorage.clear();
        window.location.replace("/login");
});

$('#addTask').click(function() {
        var childId = $('#id').val();
        var title = $('#title').val();
        var points = $('#points').val();
        var description = $('#description').val();
        var due = $('#due').val();

        var jsonObj = {
            childId: childId,
            title: title,
            points: points,
            description: description,
            due: due
        }

        $.ajax({
            url: goodhabitsURL + "/addTask",
            type:"post",
            data: jsonObj,
            success: function(response) {
                var data = JSON.parse(response) 
                if (data.msg == "SUCCESS") {
                    alert("Task ["+ data.task+ "] has been successfully assigned to child" );   
                    retrieveData();
                } else {
                    console.log(data.msg);
                    // alert(data.msg);    //----not handling error if wrong child or string for points value 
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    })

function retrieveData(){
        var childId = $('#id').val();
        $.ajax({
            url: goodhabitsURL + "/getTasks",
            type: "get",
            data: {childId:childId},

            success: function(response) {
                var data = JSON.parse(response);

                if(data.msg == "SUCCESS"){
                    showTable(data.data);
                    //console.log("success");  //----
                }else{
                    //console.log(data.msg)
                    alert(data.msg);
                }
            },
            error: function(err){
                console.log(err);
            }
        });
}

function showTable(data) {
        // var userType = localStorage.getItem('userType');
        // console.log("userType:", userType);

        var htmlString = "";
            for (var i = 0; i < data.length; i++) {
                if(data[i].status != "Approved"){
                    htmlString += "<tr>";
                    htmlString += "<td>" + data[i].taskName + "</td>";
                    htmlString += "<td>" + data[i].pointsAwarded + "</td>";
                    htmlString += "<td>" + data[i].taskDescription + "</td>";
                    htmlString += "<td>" + data[i].dueDate + "</td>";

                if(data[i].status === "Complete"){
                    htmlString += "<td><button class='btnStatusClass' data-taskParent='" + data[i].idTasks + "'data-status='"+ data[i].status +"' style='background-color:#4CAF50 ' >APPROVE</button></td>"
                    htmlString += "<td><button class='btnIncStatusClass' data-taskParent='" + data[i].idTasks + "'data-status='"+ data[i].status +"' style='background-color:#FF5733 '  >INCOMPLETE</button></td>"
                }    
                if(data[i].status != "Complete"){
                    htmlString += "<td><button class='btnDeleteClass' data-id='"+ data[i].idTasks +"'>DELETE</button></td>"
                } 
                    htmlString += "</tr>"
                }
            }
        $("#tableBody").html(htmlString);  

        activateDelete();
        activateCompletedTaskParent();
        activateInCompleteTaskParent();
}

function showTableForKid(data) { //shows on tasks table on the kids account                 ////////////////
        // var userType = localStorage.getItem('userType');
        // console.log("userType:", userType);


        var htmlString = "";
            for (var i = 0; i < data.length; i++) {
                if(data[i].status != "Complete" && data[i].status != "Approved"){
                    htmlString += "<tr>";
                    htmlString += "<td>" + data[i].taskName + "</td>";
                    htmlString += "<td>" + data[i].pointsAwarded + "</td>";
                    htmlString += "<td>" + data[i].taskDescription + "</td>";
                    htmlString += "<td>" + data[i].dueDate + "</td>";
                    
                    htmlString += "<td><button class='btnStatusClassForKid' data-task='" + data[i].idTasks + "'data-statusKid='"+ data[i].status +"' style='background-color:#4CAF50'>COMPLETE</button></td>"
                }
                htmlString += "</tr>"
            }

        $("#tableBody").html(htmlString); 
        activateCompletedTask();

}

function activateDelete(){
        $('.btnDeleteClass').click(function(){
            var deleteId = this.getAttribute("data-id");

            var jsonObj={
                id:deleteId
            }
            //--console.log(jsonObj);

            $.ajax({
                url: goodhabitsURL+"/deleteTask",//start of calling
                type:"DELETE",
                data:jsonObj,   //<=sending this data to server
                //----------------------------------//
                success: function(response) { //beginning of receiving from server
                    var data = JSON.parse(response);
                    if (data.msg == "SUCCESS") {
                        retrieveData();
                        alert("Task Deleted");   
                    } else {
                        console.log(data.msg);    
                    }
                },
                error: function(err){
                    console.log(err);
                }
            });
        });
}

function retrieveTasks(){
        $('#viewChild').click(function() {
            var childId = $('#childIdInput').val();
            var userId =  localStorage.getItem('userId');
            $.ajax({
                url: goodhabitsURL + "/viewChildTasks",
                type: "get",
                data: {childId:childId,
                    userId:userId
                },

                success: function(response) {
                    var data = JSON.parse(response);

                    if(data.msg == "SUCCESS"){
                        showTable(data.data);
                        //--console.log("success");  
                    }else{
                        //console.log(data.msg)
                        alert(data.msg);

                    }
                },
                error: function(err){
                    console.log(err);
                }
            });
        });
}

function retrieveTasksForChild(){       //shows on tasks table on the kids account
        // var childId = $('#childIdInput').val();
        var userId =  localStorage.getItem('userId');
        $.ajax({
            url: goodhabitsURL + "/ChildTasks",
            type: "get",
            data: {
                userId:userId
            },
    
            success: function(response) {
                var data = JSON.parse(response);
    
                if(data.msg == "SUCCESS"){
                    showTableForKid(data.data)
                    //--console.log("success");  
                }else{
                    //console.log(data.msg)
                    alert(data.msg);
                }
            },
            error: function(err){
                console.log(err);
            }
        });
}

function activateCompletedTask(){
        $('.btnStatusClassForKid').click(function() {                           /////////////
            var taskId = this.getAttribute("data-task");
            var userType = localStorage.getItem('userType');

            //console.log("Task ID has been completed:", taskId);

            jsonObj = {
                taskId : taskId,
                userType: userType
            },

            $.ajax({
                url: goodhabitsURL + "/completingTask",
                type:"put",
                data: jsonObj,
                success: function(response) {
                    var data = JSON.parse(response) 
                    if (data.msg == "SUCCESS") {
                        retrieveTasksForChild();
                        alert("Task Marked as Complete");
                    } else {
                        //console.log(data.msg);    
                        alert(data.msg);
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            });
        })
} 

function activateCompletedTaskParent(){
    $('.btnStatusClass').click(function() {                          
        var taskId = this.getAttribute("data-taskParent");
        var userType = localStorage.getItem('userType');

        //console.log("Task ID has been approved:", taskId);

        jsonObj = {
            taskId : taskId,
            userType: userType
        },

        $.ajax({
            url: goodhabitsURL + "/ApprovingTask",
            type:"put",
            data: jsonObj,
            success: function(response) {
                var data = JSON.parse(response) 
                if (data.msg == "SUCCESS") {
                    retrieveTasks();
                    alert("Task has been approved");
                } else {
                    //console.log(data.msg);  
                    alert(data.msg);  
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
        })
} 


function activateInCompleteTaskParent(){
    $('.btnIncStatusClass').click(function() {                          
        var taskId = this.getAttribute("data-taskParent");
        var userType = localStorage.getItem('userType');

        //--console.log("Task ID has been incompleted:", taskId);

        jsonObj = {
            taskId : taskId,
            userType: userType
        },

        $.ajax({
            url: goodhabitsURL + "/IncompletingTask",
            type:"put",
            data: jsonObj,
            success: function(response) {
                var data = JSON.parse(response) 
                if (data.msg == "SUCCESS") {
                    retrieveTasks();
                    alert("Task marked as incomplete");
                } else {
                    //--console.log(data.msg);   
                    alert(data.msg); 
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
        })
} 

$("#clear").click(function(){
    $("#id").val("");   
    $("#title").val(""); 
    $("#points").val(""); 
    $("#description").val("");   
    $("#due").val("");   
});

retrieveData();
retrieveTasks();
retrieveTasksForChild();

