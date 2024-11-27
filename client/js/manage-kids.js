var userType = localStorage.getItem('userType');
var userId = localStorage.getItem('userId');

if(userType === 'guardian'){
    var parentId= userType;
}
$('#logout').click(function() {
    localStorage.clear();
    window.location.replace("/login");
});

$('#addChild').click(function() {
    var childId = $('#childId').val();
    var parentId;

    var jsonObj = {
        childId: childId,
        parentId: parentId
    }
    console.log(childId);
    $.ajax({
        url: goodhabitsURL + "/addChild",
        type:"post",
        data: jsonObj,
        success: function(response) {
            var data = JSON.parse(response) 
            if (data.msg == "SUCCESS") {
                alert("Successful: Child has been addded ");   
            } else {
                console.log(data.msg);    
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}); //addChild