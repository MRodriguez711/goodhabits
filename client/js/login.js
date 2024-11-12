$('#signIn').click(function() {
    //capture what account was selected .. into JSON obj
    var emailAddress = $('#emailAddress').val();
    var password = $('#password').val();

    var jsonObj = {
        emailAddress : emailAddress,
        password : password
    };

    console.log("Email:", emailAddress, "Password:", password);

    $.ajax({
    url: goodhabitsURL + "/validate",
    type:"get",
    data: jsonObj,
    success: function(response) {
        var data = JSON.parse(response) 
        if (data.msg == "SUCCESS") {
            alert("Login Successful");   // if the msg returned by the server in terminal is SUCCESS then on the clients screen it shows this msg
        } else {
            console.log(data.msg);    
        }
    },
    error: function (err) {
        console.log(err);
    }
});

    return false;      
});

