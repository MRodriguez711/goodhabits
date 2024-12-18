var userType = localStorage.getItem('userType');
var userId = localStorage.getItem('userId');

// var parentId;
if(userType === 'guardian'){
        var parentId= userId;
}
$('#logout').click(function() {
        localStorage.clear();
        window.location.replace("/login");
});

$('#addChild').click(function() {
        var childId = $('#childIdInput').val();
        // var parentId;

        var jsonObj = {
            childId: childId,
            parentId: parentId
        }  
        console.log(childId +" has been linked");
        $.ajax({
            url: goodhabitsURL + "/addChild",
            type:"post",
            data: jsonObj,
            success: function(response) {
                var data = JSON.parse(response) 
                if (data.msg == "SUCCESS") {
                    alert( "You’ve successfully added a child with ID: "+data.childId + " to your account");   
                    // showTable(data)
                    retrieveData();
                    // console.log(parentId, childId)
                } else {
                    //console.log(data.msg);    
                    alert(data.msg);
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
}); //addChild


//--------------------------------------------------------------------------------------------------------    

function retrieveData(){
        // var parentId=localStorage.getItem('userId');
        // if(userType === 'guardian'){
        //     var parentId= userId;
        // }
        $.ajax({
            url: goodhabitsURL + "/getChildren",
            type: "get",
            data: {parentId:parentId},

            success: function(response) {
                var data = JSON.parse(response);

                if(data.msg == "SUCCESS"){
                    showTable(data.data)
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
        var htmlString = "";
            for (var i = 0; i < data.length; i++) {
                htmlString += "<tr>";
                htmlString += "<td>" + data[i].ChildAccount_idChildAccount + "</td>";
                htmlString += "<td>" + data[i].firstName + "</td>";
                htmlString += "<td><button class='btnDeleteClass' data-id='"+ data[i].ChildAccount_idChildAccount +"'>DELETE</button></td>"
                    
                htmlString += "</tr>"
            }

        $("#tableBody").html(htmlString);  
        activateDelete();
}

function activateDelete(){
        $('.btnDeleteClass').click(function(){
            var deleteId = this.getAttribute("data-id");

            var jsonObj={
                id:deleteId
            }
            //--console.log(jsonObj);

            $.ajax({
                url: goodhabitsURL+"/delete",//start of calling
                type:"DELETE",
                data:jsonObj,   //<=sending this data to server
                //----------------------------------//
                success: function(response) { //beginning of receiving from server
                    var data = JSON.parse(response);
                    if (data.msg == "SUCCESS") {
                        retrieveData();
                        alert("Child has been successfully removed");   
                    } else {
                        //console.log(data.msg);  
                        alert(data.msg);  
                    }
                },
                error: function(err){
                    console.log(err);
                }
            });
        });
}



retrieveData();