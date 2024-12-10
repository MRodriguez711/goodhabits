var userType = localStorage.getItem('userType');
var userId = localStorage.getItem('userId');

if(userType === 'child'){
    $('a[href="/manage-kids"]').hide();
    $('.parentContainer').hide();
}
if(userType === 'guardian'){
    $('#displayChildIdForKids').hide();
}
$('#logout').click(function() {
    localStorage.clear();
    window.location.replace("/login");
});


function retrievePoints(){
    $('#viewChild').click(function() {     
        var childId = $('#childIdInput').val();
        $.ajax({
            url: goodhabitsURL + "/getPoints",
            type: "get",
            data: {childId:childId},

            success: function(response) {
                var data = JSON.parse(response);

                if(data.msg == "SUCCESS"){
                    $("#displayChildId").text("TOTAL POINTS:" + data.data);
                    console.log("success");  //----
                }else{
                    console.log(data.msg)
                }
            },
            error: function(err){
                console.log(err);
            }
        });
    })
}

function retrievePointsForKids(){
    var userId =  localStorage.getItem('userId');
    var userType = localStorage.getItem('userType');

        $.ajax({
            url: goodhabitsURL + "/getPointsForKids",
            type: "get",
            data: {userId:userId,
                userType:userType 
            },

            success: function(response) {
                var data = JSON.parse(response);

                if(data.msg == "SUCCESS"){
                    $("#displayChildIdForKids").append(data.data);
                }else{
                    console.log(data.msg)
                }
            },
            error: function(err){
                console.log(err);
            }
        });
}

retrievePoints();
retrievePointsForKids();
