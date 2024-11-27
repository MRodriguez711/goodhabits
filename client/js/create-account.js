
$('#data-submit').click(function () {
    var accountType = $("input[name='accountType']:checked").val();
    console.log("Selected account type:", accountType);
    var firstName = $('#firstName').val(); 
    var lastName = $('#lastName').val();
    var emailAddress = $('#emailAddress').val();
    var inputPassword = $('#inputPassword').val();      

    var jsonString = {      // the jsonString obj holds the data hat will be sent to the server . 
        accountType : accountType,
        firstName: firstName,   //the right side of each key value pair holds the values extracted from the html form
        lastName: lastName,
        emailAddress: emailAddress,
        inputPassword: inputPassword
    };
    console.log(jsonString);

    $.ajax({    
        url: goodhabitsURL + "/create-account",     //config + server //Sent to the endpoint goodhabitsURL + "/create-account
        type: "post",
        data: jsonString,
        success: function (response) {
            var data = JSON.parse(response) 
            if (data.msg == "SUCCESS") {
                alert("Data Saved");   
            } else {
                console.log(data.msg);    
            }
        },
        error: function (err) {
            console.log(err);
        }
    });




    
    return false;       //just do what i want you to do
});

