function previewFile(input){
    var file = $("input[type=file]").get(0).files[0];

    var extension  = file.name.split('.').pop().toLowerCase();

    if(extension=='png'||extension=='jpg'||extension=='jpeg'){
        var reader = new FileReader();

        reader.onload = function(){
            $("#previewImg").attr("src", reader.result);
            document.getElementById('previewImg').style.display = 'block';
        }

        reader.readAsDataURL(file);
    }
}

var ip_address    = 'http://127.0.0.1:5008';
$(document).ready(function() {
    var uid = window.localStorage.getItem('content');
    $.ajax({
        method: "POST",
        url: ip_address+'/api/profile/query',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({'query': uid , 'limit': '1'}),
        dataType: "json",
        success: function(data) {
            localStorage.setItem('loggedin', 1);
            if (data.status==200){
                if(data.msg[0].user_id==uid){
                    $('#admin-email').html(data.msg[0].user_email);
                    $('#admin-profile-image').attr({src: data.msg[0].user_image});
                    $('#admin-creation-date').html(data.msg[0].user_registration_date);
                    $('#admin-usernames').html(data.msg[0].first_name + " " + data.msg[0].last_name);
                }
                $("#load-billboards").click();
            }
            if (data.status!=200){
                console.log(data.msg);
            }
        },
        statusCode: {
            400: function(data) {
                console.log(data.status);
            }
        },
        error: function(err) {
            console.log(err);
        }
    });
 
    document.getElementById('b-loader').style.display = 'block';
    var result = '';
    $('#load-billboards-results').empty();
    $.ajax({
        method: "POST",
        url: ip_address+'/api/billboard/query/all',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({'query': 'all' , 'limit': '50'}),
        dataType: "json",
        success: function(data) {
            if (data.status==200){
                for(i in data.msg){
                    result +='<div class="p-1">'
                    +'<img id="'+data.msg[i].billboard_name+'"  title="'+data.msg[i].billboard_owner_name+'" onclick="queryMap(this)" class="svg-icon" height="120" width="240" src="'+data.msg[i].billboard_image+'" >'
                    +'<path fill-rule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" clip-rule="evenodd" />'
                    +'</svg>'

                    +'<div style="margin-left:-10px;margin-top:10px;">'
                    +'<h4 id="'+data.msg[i].billboard_id+'" class="loadEdge" onclick="loadEdge(this)" style="text-transform:capitalize;margin-left:10px;margin-top:0px;overflow: hidden;font-size:15px;font-weight:bold;">'
                    +data.msg[i].billboard_name+'</h4>'
                    +'<ul class="navbar-nav ml-auto navbar-list align-items-center" style="margin-left:100%;margin-top:-15px;">'  
                        +'<li class="nav-item nav-icon dropdown caption-content pl-2 ml-2">'
                            +'<a href="#"  id="dropdownMenuButton4" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
                                +'<div class="d-flex align-items-center">'
                                    +'<i class="las la-ellipsis-v" style="font-size:24px;color:#062B78;"></i>'
                                +'</div>'
                            +'</a>'
                            +'<div class="iq-sub-dropdown dropdown-menu" aria-labelledby="dropdownMenuButton" style="margin-left: -65px;">'
                                +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-top:0px;width:100px;" title="Daily Views">'
                                    +'<i class="las la-eye" style="font-size:24px;"></i>'
                                    +'<p style="font-size:12px;margin-top:-25px;color:green;">'+data.msg[i].billboard_daily_views+'</p>'
                                +'</div>'

                                +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="width:100px;" title="Billboard Provider">'
                                 +'<i class="las la-border-style" style="font-size:24px;"></i>'
                                    +'<p style="font-size:12px;margin-top:-25px;color:green;">'+data.msg[i].billboard_owner_name+'</p>'
                                +'</div>'
                            
                            +'</div>'
                        +'</li>'
                    +'</ul>'
                    +'</div>'

                    +'<div style="margin-left:-120px;margin-top:65px;">'

                        +'<div id="'+data.msg[i].billboard_id+'" onclick="loadEdge(this)" class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:108px;margin-top:-50px;" title="Select Billboard">'
                        +'<i id="select_'+data.msg[i].billboard_id+'" class="las la-check-circle" style="font-size:24px;color:green;"></i>'
                        +'<p style="font-size:12px;margin-top:-25px;color:green;">Select</p>'
                        +'</div>'

                        +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:150px;margin-top:-50px;width:72px;" title="Status">'
                        +'<i class="las la-check-double" style="font-size:24px;"></i>'
                        +'<p style="font-size:12px;margin-top:-25px;color:green;">'+data.msg[i].billboard_availability+'</p>'
                        +'</div>'

                        +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:205px;margin-top:-50px;width:84px;" title="Billboard Size" >'
                        +'<i class="las la-border-style" style="font-size:24px;"></i>'
                        +'<p style="font-size:12px;margin-top:-25px;color:green;">'+data.msg[i].billboard_width+'x'+data.msg[i].billboard_height+'</p>'
                        +'</div>'

                        +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:280px;margin-top:-50px;" title="Traffic Direction" >'
                        +'<i class="las la-compass" style="font-size:24px;"></i>'
                        +'<p style="font-size:12px;margin-top:-25px;color:green;">'+data.msg[i].billboard_traffic_direction+'</p>'
                        +'</div>'

                        +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:320px;margin-top:-50px;" title="Channels">'
                        +'<i class="las la-border-none" style="font-size:24px;"></i>'
                        +'<p style="font-size:12px;margin-top:-25px;color:green;">'+data.msg[i].billboard_screen_count+'</p>'
                        +'</div>'
                        
                    +'</div>'
                    
                    +'</div>';
                }
                
                $('#load-billboards-results').html(result);
                $(".loadEdge:last").click();
                document.getElementById('b-loader').style.display = 'none';
            }
            if (data.status!=200){
                document.getElementById('b-loader').style.display = 'none';
                console.log(data.msg);
            }
        },
        statusCode: {
            400: function(data) {
                document.getElementById('b-loader').style.display = 'none';
                console.log(data.status);
            }
        },
        error: function(err) {
            console.log(err);
        }
    });

    $("#admin-autocomplete").keyup(function(e) {
        e.preventDefault();
        
        var result = '';
        var query = this.value;
        $('#admin-autocomplete-results').html('');
        
        $.ajax({
            method: "POST",
            url: ip_address+'/api/billboard/query/autocomplete',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify({'query': query , 'limit': '10'}),
            dataType: "json",
            success: function(data) {
                console.log(data.msg);
                if (data.status==200){
                    for(i in data.msg){
                        result +='<li><a href="#"><div class="item">'+data.msg[i].names+'</div></a></li>';
                        $('#admin-autocomplete-results').html(result);
                    }
                }
                if (data.status!=200){
                    console.log(data.msg);
                }
            },
            statusCode: {
                400: function(data) {
                    console.log(data.status);
                }
            },
            error: function(err) {
                console.log(err);
            }
        });
    });

    $('#customRange2').on('change', function(){
        screen_count = $(this).val();
        $('#edge_screen_count').html($(this).val());
        $.ajax({
            method: "POST",
            url: ip_address+'/api/billboard/device/status',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify({'bid':  window.localStorage.getItem('dvd') , 'baid' : uid ,'screen':$(this).val()}),
            dataType: "json",
            success: function(data) {
                if (data.status==200){
                    var n  = '';
                    n +='<div   class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin:20px;" title="'+data.msg+'">'
                    +'<i class="las la-check-circle" style="font-size:64px;color:green;font-weight:bold;"></i>'
                    +'<p style="font-size:12px;color:green;font-weight:bold;width:100px;margin-left:-20px;">Success</p>'
                    +'</div>';
                    $("#edge_status").attr("data-message", n);
                    $('#edge_status').click();
                    document.getElementById('b-loader').style.display = 'none';
                }
            },
            statusCode: {
                400: function(data) {
                    var n = '';
                    n +='<div   class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin:20px;">'
                    +'<i class="las la-exclamation-triangle" style="font-size:64px;color:red;font-weight:bold;"></i>'
                    +'<p style="font-size:12px;color:red;font-weight:bold;width:200px;margin-left:-75px;">Failure</p>'
                    +'</div>'
                    $("#edge_status").attr("data-message", n);
                    $('#edge_status').click();
                    document.getElementById('b-loader').style.display = 'none';
                }
            },
            error: function(err) {
                console.log(err);
            }
        });
        //UPDATE SCREEN COUNT
    });
    
    $("#customSwitch-11").on('change', function(){
        var result = '';
        var switchStatus = '';
        if ($(this).is(':checked')) {
            switchStatus = $(this).is(':checked');
            switchStatus = 'ON';
            $("#customSwitch-11" ).prop( "checked", true );
            document.getElementById('b-loader').style.display = 'block';
        }
        else {
           switchStatus = $(this).is(':checked');
           switchStatus = 'OFF';
           $("#customSwitch-11" ).prop( "checked", false);
           document.getElementById('b-loader').style.display = 'block';
        }
        if(switchStatus != ''){
            $.ajax({
                method: "POST",
                url: ip_address+'/api/billboard/controls/start',
                contentType: 'application/json;charset=UTF-8',
                data: JSON.stringify({'id':  window.localStorage.getItem('dvd') , 'status' : switchStatus ,'screen':$('#edge_screen_count').html()}),
                dataType: "json",
                success: function(data) {
                    if (data.status==200){
                        if(data.mode=='ON'){
                            result +='<div class="p-1">'
                            +'<div style="margin-left:-40px;">'
                                +'<img id="'+data.banner[0].billboard_name+'" title="See On Map" alt="check" class="svg-icon" height="100" width="150" src="'+data.banner[0].billboard_image+'" >'
                                +'<path fill-rule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" clip-rule="evenodd" />'
                                +'</svg>'
                            +'</div>'
                                +'<div style="margin-left:205px;margin-top:-140px;">'
                                    +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-top:0px;" title="Daily Views">'
                                    +'<i class="las la-eye" style="font-size:24px;"></i>'
                                    +'<p style="font-size:12px;margin-top:-25px;color:green;">'+data.banner[0].billboard_daily_views+'</p>'
                                    +'</div>'
                            
                                    +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:0px;margin-top:-5px;" title="Channels">'
                                    +'<i class="las la-border-none" style="font-size:24px;"></i>'
                                    +'<p style="font-size:12px;margin-top:-25px;color:green;">'+data.banner[0].billboard_screen_count+'</p>'
                                    +'</div>'
                            
                                    +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:0px;margin-top:-5px;" title="Traffic Direction">'
                                    +'<i class="las la-compass" style="font-size:24px;"></i>'
                                    +'<p style="font-size:12px;margin-top:-25px;color:green;">'+data.banner[0].billboard_traffic_direction+'</p>'
                                    +'</div>'
                                +'</div>'
    
                                +'<div style="margin-left:-10px;margin-top:100px;">'
                                    +'<h4  style="text-transform:capitalize;margin-left:0px;margin-top:-90px;overflow: hidden;font-size:15px;font-weight:bold;">'
                                    +'<a href="#" style="text-transform: capitalize;">'+data.banner[0].billboard_name+'</a></h4>'
                                +'</div>'
    
                                +'<div style="margin-left:-75px;margin-top:50px;">'
                                    +'<div   class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:108px;margin-top:-50px;" title="'+data.msg+'">'
                                    +'<i class="las la-power-off" style="font-size:24px;color:green;font-weight:bold;"></i>'
                                    +'<p style="font-size:12px;margin-top:-25px;color:green;font-weight:bold;">On</p>'
                                    +'</div>'
                                    +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:165px;margin-top:-50px;width:72px;" title="Status">'
                                    +'<i class="las la-check-double" style="font-size:24px;"></i>'
                                    +'<p style="font-size:12px;margin-top:-25px;color:green;">'+data.banner[0].billboard_availability+'</p>'
                                    +'</div>'
                                    +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:235px;margin-top:-50px;width:84px;" title="Billboard Size" >'
                                    +'<i class="las la-border-style" style="font-size:24px;"></i>'
                                    +'<p style="font-size:12px;margin-top:-25px;color:green;">'+data.banner[0].billboard_width+'x'+data.banner[0].billboard_height+'</p>'
                                    +'</div>'
                                +'</div>'
                            
                            +'</div>';
                            $('#edge_status_label').html('ON');
                            $("#edge_status_label").css({"background-color": "green","border-color": "green"});
                            $("#edge_status").attr("data-message", result);
                            $('#edge_status').click();
                            document.getElementById('b-loader').style.display = 'none';
                        }
                        if(data.mode=='OFF'){
                            result +='<div class="p-1">'
                            +'<div style="margin-left:-40px;">'
                                +'<img id="'+data.banner[0].billboard_name+'" title="See On Map" alt="check" class="svg-icon" height="100" width="150" src="'+data.banner[0].billboard_image+'" >'
                                +'<path fill-rule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" clip-rule="evenodd" />'
                                +'</svg>'
                            +'</div>'
                                +'<div style="margin-left:205px;margin-top:-140px;">'
                                    +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-top:0px;" title="Daily Views">'
                                    +'<i class="las la-eye" style="font-size:24px;"></i>'
                                    +'<p style="font-size:12px;margin-top:-25px;color:green;">'+data.banner[0].billboard_daily_views+'</p>'
                                    +'</div>'
                            
                                    +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:0px;margin-top:-5px;" title="Channels">'
                                    +'<i class="las la-border-none" style="font-size:24px;"></i>'
                                    +'<p style="font-size:12px;margin-top:-25px;color:green;">'+data.banner[0].billboard_screen_count+'</p>'
                                    +'</div>'
                            
                                    +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:0px;margin-top:-5px;" title="Traffic Direction">'
                                    +'<i class="las la-compass" style="font-size:24px;"></i>'
                                    +'<p style="font-size:12px;margin-top:-25px;color:green;">'+data.banner[0].billboard_traffic_direction+'</p>'
                                    +'</div>'
                                +'</div>'
    
                                +'<div style="margin-left:-10px;margin-top:100px;">'
                                    +'<h4  style="text-transform:capitalize;margin-left:0px;margin-top:-90px;overflow: hidden;font-size:15px;font-weight:bold;">'
                                    +'<a href="#" style="text-transform: capitalize;">'+data.banner[0].billboard_name+'</a></h4>'
                                +'</div>'
    
                                +'<div style="margin-left:-75px;margin-top:50px;">'
                                    +'<div   class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:108px;margin-top:-50px;" title="'+data.msg+'">'
                                    +'<i class="las la-power-off" style="font-size:24px;color:red;font-weight:bold;"></i>'
                                    +'<p style="font-size:12px;margin-top:-25px;color:red;font-weight:bold;">Off</p>'
                                    +'</div>'
                                    +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:165px;margin-top:-50px;width:72px;" title="Status">'
                                    +'<i class="las la-check-double" style="font-size:24px;"></i>'
                                    +'<p style="font-size:12px;margin-top:-25px;color:green;">'+data.banner[0].billboard_availability+'</p>'
                                    +'</div>'
                                    +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:235px;margin-top:-50px;width:84px;" title="Billboard Size" >'
                                    +'<i class="las la-border-style" style="font-size:24px;"></i>'
                                    +'<p style="font-size:12px;margin-top:-25px;color:green;">'+data.banner[0].billboard_width+'x'+data.banner[0].billboard_height+'</p>'
                                    +'</div>'
                                +'</div>'
                            
                            +'</div>';
                            $('#edge_status_label').html('OFF');
                            $("#edge_status_label").css({"background-color": "red","border-color": "red"});
                            $("#edge_status").attr("data-message", result);
                            $('#edge_status').click();
                            document.getElementById('b-loader').style.display = 'none';
                        }
                    }
                    if (data.status!=200){
                        result +='<div class="p-1">'
                        +'<div style="margin-left:-40px;">'
                            +'<img id="'+data.banner[0].billboard_name+'" title="See On Map" alt="check" class="svg-icon" height="100" width="150" src="'+data.banner[0].billboard_image+'" >'
                            +'<path fill-rule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" clip-rule="evenodd" />'
                            +'</svg>'
                        +'</div>'
                            +'<div style="margin-left:205px;margin-top:-140px;">'
                                +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-top:0px;" title="Daily Views">'
                                +'<i class="las la-eye" style="font-size:24px;"></i>'
                                +'<p style="font-size:12px;margin-top:-25px;color:green;">'+data.banner[0].billboard_daily_views+'</p>'
                                +'</div>'
                        
                                +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:0px;margin-top:-5px;" title="Channels">'
                                +'<i class="las la-border-none" style="font-size:24px;"></i>'
                                +'<p style="font-size:12px;margin-top:-25px;color:green;">'+data.banner[0].billboard_screen_count+'</p>'
                                +'</div>'
                        
                                +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:0px;margin-top:-5px;" title="Traffic Direction">'
                                +'<i class="las la-compass" style="font-size:24px;"></i>'
                                +'<p style="font-size:12px;margin-top:-25px;color:green;">'+data.banner[0].billboard_traffic_direction+'</p>'
                                +'</div>'
                            +'</div>'

                            +'<div style="margin-left:-10px;margin-top:100px;">'
                                +'<h4  style="text-transform:capitalize;margin-left:0px;margin-top:-90px;overflow: hidden;font-size:15px;font-weight:bold;">'
                                +'<a href="#" style="text-transform: capitalize;">'+data.banner[0].billboard_name+'</a></h4>'
                            +'</div>'

                            +'<div style="margin-left:-75px;margin-top:50px;">'
                                +'<div   class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:108px;margin-top:-50px;" title="'+data.msg+'">'
                                +'<i class="las la-exclamation-triangle" style="font-size:24px;color:red;font-weight:bold;"></i>'
                                +'<p style="font-size:12px;margin-top:-25px;color:red;font-weight:bold;">Error</p>'
                                +'</div>'
                                +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:165px;margin-top:-50px;width:72px;" title="Status">'
                                +'<i class="las la-check-double" style="font-size:24px;"></i>'
                                +'<p style="font-size:12px;margin-top:-25px;color:green;">'+data.banner[0].billboard_availability+'</p>'
                                +'</div>'
                                +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:235px;margin-top:-50px;width:84px;" title="Billboard Size" >'
                                +'<i class="las la-border-style" style="font-size:24px;"></i>'
                                +'<p style="font-size:12px;margin-top:-25px;color:green;">'+data.banner[0].billboard_width+'x'+data.banner[0].billboard_height+'</p>'
                                +'</div>'
                            +'</div>'
                        
                            +'</div>';
                        $("#edge_status_label").css({"background-color": "red","border-color": "red"});
                        $('#edge_status_label').html('<i class="las la-exclamation-triangle" style="font-size:16px;color:white;font-weight:bold;"></i>');
                        $("#edge_status").attr("data-message", result);
                        $('#edge_status').click();
                        document.getElementById('b-loader').style.display = 'none';
                    }
                },
                statusCode: {
                    400: function(data) {
                        $("#edge_status_label").css({"background-color": "red","border-color": "red"});
                        $('#edge_status_label').html('<i class="las la-exclamation-triangle" style="font-size:16px;color:white;font-weight:bold;"></i>');
                        $("#edge_status").attr("data-message", result);
                        document.getElementById('b-loader').style.display = 'none';
                    }
                },
                error: function(err) {
                    console.log(err);
                }
            });
        }
    });
});     

function loadEdge(addressPoints) {
    var id = $(addressPoints).attr("id");
    window.localStorage.setItem('dvd', id);
    $.ajax({
        method: "POST",
        url: ip_address+'/api/billboard/select',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({'query': id , 'limit': '1'}),
        dataType: "json",
        success: function(data) {
            if (data.status==200){
                if(data.msg[0].billboard_id == id){

                    var edge_id= window.localStorage.getItem('edge_id');
                    if(edge_id != "#select_"+id){
                        $(edge_id).css({"color": "green","font-weight": "bolder"});
                        $("#select_"+id).css({"color": "#062B78","font-weight": "bolder"});
                        window.localStorage.setItem('edge_id', "#select_"+id);
                    }

                    if(edge_id == "#select_"+id){
                        $("#select_"+id).css({"color": "#062B78","font-weight": "bolder"});
                        window.localStorage.setItem('edge_id', "#select_"+id);
                    }

                    if(edge_id == ""){
                        $("#select_"+id).css({"color": "#062B78","font-weight": "bolder"});
                        window.localStorage.setItem('edge_id', "#select_"+id);
                    }
                    
                    if(data.msg[0].billboard_status == 'ON'){
                        $("#customSwitch-11" ).prop( "checked", true);
                        $("#edge_status_label").css({"background-color": "green","border-color": "green"});
                    }

                    if(data.msg[0].billboard_status == 'OFF'){
                        $("#customSwitch-11" ).prop( "checked", false);
                        $("#edge_status_label").css({"background-color": "red","border-color": "red"});
                    }

                    $("#edge_cpus").html(data.msg[0].billboard_vcpus);
                    $("#edge_status_label").html(data.msg[0].billboard_status);
                    $("#edge_ip_address").html(data.msg[0].billboard_ip_address);
                    $("#edge_availability").html(data.msg[0].billboard_availability);
                    $("#edge_screen_count").html(data.msg[0].billboard_screen_count);

                    $("#zip").html(data.msg[0].billboard_zip);
                    $("#city").html(data.msg[0].billboard_city);
                    $("#state").html(data.msg[0].billboard_state);
                    $("#county").html(data.msg[0].billboard_county);
                    $("#height").html(data.msg[0].billboard_height);
                    $("#width").html(data.msg[0].billboard_width);
                    $("#views").html(data.msg[0].billboard_daily_views);
                    $("#duration").html(data.msg[0].billboard_duration);
                    $("#name").html(data.msg[0].billboard_name);
                    $("#agency_name").html(data.msg[0].billboard_owner_name);
                    $("#availability").html(data.msg[0].billboard_availability);
                    $("#sign_placement").html(data.msg[0].billboard_sign_placement);
                    $("#traffic_direction").html(data.msg[0].billboard_traffic_direction);
                    $('#customRange2').attr('max',data.msg[0].billboard_vcpus);
                    $('#billboard-pic').attr({src: data.msg[0].billboard_image});
                    $('#customRangem2').val(data.msg[0].billboard_screen_count);
                }
                var n  = '';
                n +='<div   class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin:20px;" title="'+data.msg+'">'
                +'<i class="las la-check-circle" style="font-size:64px;color:green;font-weight:bold;"></i>'
                +'<p style="font-size:12px;color:green;font-weight:bold;width:100px;margin-left:-20px;">Success</p>'
                +'</div>';
                $("#edge_status").attr("data-message", n);
                $('#edge_status').click();
                $('#locations').click();
            }
            if (data.status!=200){
                var n = '';
                n +='<div   class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin:20px;">'
                +'<i class="las la-exclamation-triangle" style="font-size:64px;color:red;font-weight:bold;"></i>'
                +'<p style="font-size:12px;color:red;font-weight:bold;width:200px;margin-left:-75px;">Failure</p>'
                +'</div>'
                $("#edge_status").attr("data-message", n);
                $('#edge_status').click();
            }
        },
        statusCode: {
            400: function(data) {
                console.log(data.status);
            }
        },
        error: function(err) {
            console.log(err);
        }
    });
    return false;
}
