//SLEEP FUNCTION
function sleepFor(sleepDuration){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ 
        /* Do nothing */ 
    }
}
//LOGIN
$(document).ready(function() {
    $('#logInmsg').html('');
    $("#loginForm").bind('submit', function(e) {
        e.preventDefault();
        var email = $('#logInEmail').val();
		var pwd = $('#logInPassword').val();
        if(email != "" && pwd != "" ) {
            $.ajax({
                method: "POST",
                url: 'http://127.0.0.1:5008/api/auth/profile',
                contentType: 'application/json;charset=UTF-8',
                data: JSON.stringify({'username': email, 'password': pwd}),
                dataType: "json",
                success: function(data) {
                    if (data.status==200){
                        $('#logInmsgcnt').html(data.msg);
                        window.localStorage.setItem('content', data.id);
                        window.location = data.uri
                        console.log(window.localStorage.getItem('content', data.id));
                    }
                    if (data.status!=200){
                        $('#logInmsgcnt').html(data.msg);
                    }
                },
                statusCode: {
                    400: function(data) {
                        $('#logInmsgcnt').html(data.status);
                    }
                },
                error: function(err) {
                    console.log(err);
                }
            });
        }
    });
});
