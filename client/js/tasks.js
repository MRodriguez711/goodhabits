var userType = localStorage.getItem('userType');
var userId = localStorage.getItem('userId');

if(userType === 'child'){
    $('.onlyParentsContainer').hide();
    $("#displayChildId").append(userId)
    $('a[href="/manage-kids"]').hide();
}else if(userType === 'guardian'){
    $("#displayChildId").hide();
}

$('#logout').click(function() {
    localStorage.clear();
    window.location.replace("/login");
});