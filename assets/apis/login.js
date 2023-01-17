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
                        window.location = data.uri;
                        var n  = '';
                        n +='<div   class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin:20px;" title="'+data.msg+'">'
                        +'<i class="las la-check-circle" style="font-size:64px;color:green;font-weight:bold;"></i>'
                        +'<p style="font-size:12px;color:green;font-weight:bold;width:100px;margin-left:-20px;">Success</p>'
                        +'</div>';
                        $("#logInmsgcnt").attr("data-message", n);
                        $('#logInmsgcnt').click();
           
                    }
                    if (data.status!=200){
                        var n = '';
                        n +='<div   class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin:20px;">'
                        +'<i class="las la-exclamation-triangle" style="font-size:64px;color:red;font-weight:bold;"></i>'
                        +'<p style="font-size:12px;color:red;font-weight:bold;width:200px;margin-left:-75px;">Failure</p>'
                        +'</div>'
                        $("#logInmsgcnt").attr("data-message", n);
                        $('#logInmsgcnt').click();
                    }
                },
                statusCode: {
                    400: function(data) {
                        var n = '';
                        n +='<div   class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin:20px;">'
                        +'<i class="las la-exclamation-triangle" style="font-size:64px;color:red;font-weight:bold;"></i>'
                        +'<p style="font-size:12px;color:red;font-weight:bold;width:200px;margin-left:-75px;">Failure</p>'
                        +'</div>'
                        $("#logInmsgcnt").attr("data-message", n);
                        $('#logInmsgcnt').click();
                    }
                },
                error: function(err) {
                    console.log(err);
                }
            });
        }
    });
});
