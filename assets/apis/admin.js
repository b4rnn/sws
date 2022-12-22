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
            console.log(data.msg);
            if (data.status==200){
                for(i in data.msg){
                    result +='<div class="p-1">'
                    +'<img id="'+data.msg[i].billboard_name+'" title="See On Map" onclick="queryMap(this)" alt="check" class="svg-icon" height="100" width="150" src="'+data.msg[i].billboard_image+'" >'
                    +'<path fill-rule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" clip-rule="evenodd" />'
                    +'</svg>'
                    
                    +'<div style="margin-left:-10px;margin-top:100px;">'
                        +'<h4  style="text-transform:capitalize;margin-left:10px;margin-top:-90px;overflow: hidden;font-size:15px;font-weight:bold;">'
                        +'<a class="loadEdge" onclick="loadEdge(this)" id="'+data.msg[i].billboard_id+'" href="#" style="text-transform: capitalize;">'+data.msg[i].billboard_name+'</a></h4>'
                    +'</div>'
                    
                    +'<div style="margin-left:155px;margin-top:-140px;">'
                        +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-top:0px;" title="Daily Views">'
                        +'<i class="las la-eye" style="font-size:24px;"></i>'
                        +'<p style="font-size:12px;margin-top:-25px;color:green;">'+data.msg[i].billboard_daily_views+'</p>'
                        +'</div>'
                    
                        +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:0px;margin-top:-5px;" title="Channels">'
                        +'<i class="las la-border-none" style="font-size:24px;"></i>'
                        +'<p style="font-size:12px;margin-top:-25px;color:green;">'+data.msg[i].billboard_screen_count+'</p>'
                        +'</div>'
                    
                        +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:0px;margin-top:-5px;" title="Traffic Direction">'
                        +'<i class="las la-compass" style="font-size:24px;"></i>'
                        +'<p style="font-size:12px;margin-top:-25px;color:green;">'+data.msg[i].billboard_traffic_direction+'</p>'
                        +'</div>'
                    +'</div>'
                    +'<div style="margin-left:-120px;margin-top:50px;">'
                        +'<div id="'+data.msg[i].billboard_id+'" onclick="saveMap(this)" class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:108px;margin-top:-50px;" title="Save Billboard">'
                        +'<i class="las la-save" style="font-size:24px;"></i>'
                        +'<p style="font-size:12px;margin-top:-25px;color:green;">Save</p>'
                        +'</div>'
                        +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:165px;margin-top:-50px;width:52px;" title="Status">'
                        +'<i class="las la-check-double" style="font-size:24px;"></i>'
                        +'<p style="font-size:12px;margin-top:-25px;color:green;">'+data.msg[i].billboard_availability+'</p>'
                        +'</div>'
                        +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:235px;margin-top:-50px;width:42px;" title="Billboard Size" >'
                        +'<i class="las la-border-style" style="font-size:24px;"></i>'
                        +'<p style="font-size:12px;margin-top:-25px;color:green;">'+data.msg[i].billboard_width+'x'+data.msg[i].billboard_height+'</p>'
                        +'</div>'
                    +'</div>'
                    
                    +'</div>';
                }
                $('#load-billboards-results').html(result);
                $(".loadEdge:first").click();
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

    $('#customRange1').on('change', function(){
        screen_count = $(this).val();
        $('#edge_cpus').html($(this).val());
    });
    
    $('#customRange2').on('change', function(){
        screen_count = $(this).val();
        $('#edge_screen_count').html($(this).val());
    });
    
    $("#customSwitch-11").on('change', function(){
        var switchStatus = '';
        if ($(this).is(':checked')) {
            switchStatus = $(this).is(':checked');
            switchStatus = 'ON';
            document.getElementById('b-loader').style.display = 'block';
        }
        else {
           switchStatus = $(this).is(':checked');
           switchStatus = 'OFF';
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
                            $('#edge_status').html('ON');
                            $("#edge_status").attr("data-message", data.msg);
                            $('#edge_status').click();
                            document.getElementById('b-loader').style.display = 'none';
                        }
                        if(data.mode=='OFF'){
                            $('#edge_status').html('OFF');
                            $("#edge_status").attr("data-message", data.msg);
                            $('#edge_status').click();
                            document.getElementById('b-loader').style.display = 'none';
                        }
                    }
                    if (data.status!=200){
                        $("#edge_status").attr("data-message", data.msg);
                        $('#edge_status').click();
                        document.getElementById('b-loader').style.display = 'none';
                    }
                },
                statusCode: {
                    400: function(data) {
                        console.log(data.status);
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

                    $("#edge_cpus").html(data.msg[0].billboard_vcpus);
                    $("#edge_status").html(data.msg[0].billboard_status);
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
                    $("#availability").html(data.msg[0].billboard_availability);
                    $("#sign_placement").html(data.msg[0].billboard_sign_placement);
                    $("#traffic_direction").html(data.msg[0].billboard_traffic_direction);
                    
                    $('#billboard-pic').attr({src: data.msg[0].billboard_image});
                }
                $('#locations').click();
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
    return false;
}
