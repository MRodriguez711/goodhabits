$('#signIn').click(function() {
    //capture what account was selected .. into JSON obj
    var emailAddress = $('#emailAddress').val();
    var password = $('#password').val();
    var accountType = $("[name='accountType']:checked").val();


    var jsonObj = {
        emailAddress : emailAddress,
        password : password,
        accountType : accountType
    };

    console.log("Email:", emailAddress, "Password:", password, "Account Type:", accountType);

    $.ajax({
    url: goodhabitsURL + "/validate",
    type:"get",
    data: jsonObj,
    success: function(response) {
        var data = JSON.parse(response) 
        if (data.msg == "SUCCESS") {
            alert("Login Successful");   // if the msg returned by the server in terminal is SUCCESS then on the clients screen it shows this msg
                if(accountType === 'child'){
                    localStorage.setItem('userType', 'child');
                    localStorage.setItem('userId', data.data.idChildAccount);
                
                    var userType = localStorage.getItem('userType');
                    var userId = localStorage.getItem('userId');

                    console.log("user type: " + userType);
                    console.log("user id: "+ userId);
                    // $('.onlyParentsContainer').hide();
                    window.location.replace("/tasks");
                

                }else if(accountType === 'guardian'){
                    localStorage.setItem('userType', 'guardian');
                    localStorage.setItem('userId', data.data.idGuardianAccount);
                
                    var userType = localStorage.getItem('userType');
                    var userId = localStorage.getItem('userId');

                    console.log("user type: " + userType);
                    console.log("user id: "+ userId);
                    window.location.replace("/manage-kids");

                }

        } else {
            console.log(data.msg);    
        }
    },
    error: function (err) {
        console.log(err);
    }
}); ///validate

    return false;      
});

