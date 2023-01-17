var geoData               = {};
var addressPoints         = [];
var locationData          = {};
var display_position      = '';
var design_file_extension = '';
var screen_width_height   = '';
var ip_address            = 'http://127.0.0.1:5008';


//preview
function previewFile(input){
    var file = $("input[type=file]").get(0).files[0];

    var extension  = file.name.split('.').pop().toLowerCase();

    if(extension=='png'||extension=='jpg'||extension=='jpeg'){
        var reader = new FileReader();

        reader.onload = function(){
            $("#previewImg").attr("src", reader.result);
            document.getElementById('previewVid').style.display = 'none';
            document.getElementById('previewImg').style.display = 'block';
            document.getElementById('video_panel').style.display = 'none';
            document.getElementById('channel_panel').style.display = 'block';
            document.getElementById('save_design_file').style.display = 'none';
            document.getElementById('animate_design_btn').style.display = 'none';
            document.getElementById('animate_design_file').style.display = 'block';
            document.getElementById('select_animation_label').style.display = 'none';
        }

        design_file_extension = extension;
        reader.readAsDataURL(file);
    }

    if(extension=='mp4'||extension=='avi'||extension=='webm'){
        var reader = new FileReader();

        reader.onload = function(){
            $("#previewVid").attr("src", reader.result);
            document.getElementById('previewImg').style.display = 'none';
            document.getElementById('previewVid').style.display = 'block';
            document.getElementById('video_panel').style.display = 'none';
            document.getElementById('channel_panel').style.display = 'block';
            document.getElementById('save_design_file').style.display = 'none';
            document.getElementById('animate_design_btn').style.display = 'none';
            document.getElementById('animate_design_file').style.display = 'none';
            document.getElementById('select_animation_label').style.display = 'none';
        }

        design_file_extension = extension;
        reader.readAsDataURL(file);
    }
}

function onRenderSchedule(chess) {
    /*alert(chess);*/
    $('#schedule_detail').scheduler({
        data:chess
    });
    
    $('#schedule_detail').scheduler({
        footer: false
    });

    $('#schedule_detail').scheduler({
        disabled: true
    });
    
}

function today() {
    let d = new Date();
    let currDate = d.getDate();
    let currMonth = d.getMonth()+1;
    let currYear = d.getFullYear();
    return currYear + "-" + ((currMonth<10) ? '0'+currMonth : currMonth )+ "-" + ((currDate<10) ? '0'+currDate : currDate );
}

$(document).ready(function() {
    
    var uid = window.localStorage.getItem('content');
    document.getElementById('video_panel').style.display = 'none';

    $('#end_date').val(today());
    $('#end_date').attr('min', today());
    $('#start_date').val(today());
    $('#start_date').attr('min', today());

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

    $("#load-billboards").bind('click', function(e) {
        e.preventDefault();
        var result = '';
        $('#layout1-chart-2').empty();
        $.ajax({
            method: "POST",
            url: ip_address+'/api/billboard/query/all',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify({'query': 'all' , 'limit': '50'}),
            dataType: "json",
            success: function(data) {
                document.getElementById('c_r_m').style.display = 'block';
                if (data.status==200){
                    for(i in data.msg){
                        _addressPoints=[data.msg[i].billboard_latitude, data.msg[i].billboard_longitude,data.msg[i].billboard_image,data.msg[i].billboard_id];
                        addressPoints.push(_addressPoints);
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
    
                            +'<div id="'+data.msg[i].billboard_id+'" onclick="saveMap(this)" class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:108px;margin-top:-50px;" title="Select Billboard">'
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
                    $('#layout1-chart-2').html(result);
                    document.getElementById('c_r_m').style.display = 'none';
                    geoData = {id:'q', data:addressPoints};
                    loadMap(geoData);
                }
                if (data.status!=200){
                    document.getElementById('c_r_m').style.display = 'none';
                    console.log(data.msg);
                }
            },
            statusCode: {
                400: function(data) {
                    document.getElementById('c_r_m').style.display = 'none';
                    console.log(data.status);
                }
            },
            error: function(err) {
                console.log(err);
            }
        });
    });
    
    $("#admin-autocomplete").keyup(function(e) {
        // prevent page refresh
        e.preventDefault();
        
        var result = '';
        var query = this.value;
        $('#admin-autocomplete-results').html('');
        
        $.ajax({
            method: "POST",
            url: ip_address+'/api/billboard/query/autocomplete',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify({'query': query , 'limit': '3'}),
            dataType: "json",
            success: function(data) {
                console.log(data.msg);
                if (data.status==200){
                    for(i in data.msg){
                        result +='<li><a href="#"><div class="item">'+data.msg[i].names+'</div></a></li>';
                        $('#admin-autocomplete-results').html(result);
                    }
                    //$('#admin-autocomplete-results').html(result);
                }
                if (data.status!=200){
                    //$('#layout1-chart-2').html(data.msg);
                    console.log(data.msg);
                }
            },
            statusCode: {
                400: function(data) {
                    //document.getElementById('logInmsg').style.display = 'block';
                    console.log(data.status);
                }
            },
            error: function(err) {
                console.log(err);
            }
        });
    });

    $("#select_media_pos").bind('submit', function(e) {
        e.preventDefault();
        display_position            = $(document.activeElement).attr('id');
        screen_width_height         = $(document.activeElement).attr('value');

        if(design_file_extension=='png'||design_file_extension=='jpg'||design_file_extension=='jpeg'){
            document.getElementById('save_design_file').style.display = 'none';
            document.getElementById('animate_design_btn').style.display = 'block';
        }
        
        if(design_file_extension=='mp4'||design_file_extension=='avi'||design_file_extension=='webm'){
            document.getElementById('save_design_file').style.display = 'block';
            document.getElementById('animate_design_btn').style.display = 'none';
        }
    });

    $("#load-review").bind('click', function(e) {
        e.preventDefault();
        result    = '';
        popup     = '';
        chess     = {};
        campaign  = '';
        $.ajax({
            method: "POST",
            url: ip_address+'/api/campaign/review',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify({'uid':window.localStorage.getItem('content'),'campaign_id':window.localStorage.getItem('cid')}),
            dataType: "json",
            cache: false,
            processData: false,
            success: function(pkt) {
                document.getElementById('r_s_c').style.display = 'block';
                if (pkt.status==200){
                    for(i in pkt.location){

                    result +='<div class="p-1">'

                        +'<div id="'+pkt.location[i].billboard_id+'" onclick="saveMap(this)" >'
                            +'<p style="font-size:20px;margin-top:-25px;font-weight:bolder;text-transform:capitalize;color:black;">'+pkt.campaign[i].name+' - '+pkt.campaign[i].category+'</p>'
                        +'</div>'

                        +'<img id="'+pkt.location[i].billboard_name+'" onclick="queryMap(this)" style="border-radius:50%;" alt="check" height="40" width="40" src="'+pkt.location[i].billboard_image+'" >'
                            +'<path fill-rule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" clip-rule="evenodd" />'
                        +'</svg>'

                        +'<div style="margin-left:55px;margin-top:-40px;">'
                            +'<h4 id="'+pkt.location[i].billboard_id+'" style="text-transform:capitalize;overflow: hidden;font-size:15px;font-weight:bolder;color:black;">'
                            +pkt.location[i].billboard_name+'</h4>'
                            +'<h5 style="font-size:12px;margin-top:5px;">'+pkt.campaign[i].magnate+'</h5>'
                        +'</div>'
                    
                    +'</div>';

                    popup +='<div class="p-1">'
                        +'<div>'
                            +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="width:80px;" title="Billboard Daily Views">'
                            +'<i class="las la-eye" style="font-size:24px;"></i>'
                            +'<p style="font-size:12px;margin-top:-25px;color:green;">'+pkt.location[i].billboard_daily_views+'</p>'
                            +'</div>'
                        
                            +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="width:80px;" title="Billboard Channels">'
                            +'<i class="las la-border-none" style="font-size:24px;"></i>'
                            +'<p style="font-size:12px;margin-top:-25px;color:green;">'+pkt.location[i].billboard_screen_count+'</p>'
                            +'</div>'
                        
                            +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="width:80px;" title="Billboard Traffic Direction">'
                            +'<i class="las la-compass" style="font-size:24px;"></i>'
                            +'<p style="font-size:12px;margin-top:-25px;color:green;">'+pkt.location[i].billboard_traffic_direction+'</p>'
                            +'</div>'
                        
                            +'<div id="'+pkt.location[i].billboard_id+'" onclick="saveMap(this)" class="icon iq-icon-box-2 edit-button bg-white  rounded" style="width:80px;" title="Billboard Status">'
                            +'<i class="las la-power-off" style="font-size:24px;color:blue;"></i>'
                            +'<p style="font-size:12px;margin-top:-25px;color:green;">'+pkt.location[i].billboard_status+'</p>'
                            +'</div>'
                        
                            +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="width:80px;" title="Billboard Availability">'
                            +'<i class="las la-check-double" style="font-size:24px;"></i>'
                            +'<p style="font-size:12px;margin-top:-25px;color:green;">'+pkt.location[i].billboard_availability+'</p>'
                            +'</div>'
                        
                            +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded"   style="width:80px;" title="Billboard Size" >'
                            +'<i class="las la-border-style" style="font-size:24px;"></i>'
                            +'<p style="font-size:12px;margin-top:-25px;color:green;">'+pkt.location[i].billboard_width+'x'+pkt.location[i].billboard_height+'</p>'
                            +'</div>'
                        
                            +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded"  style="width:80px;" title="Advert Daily Budget">'
                            +'<i class="las la-eye" style="font-size:24px;"></i>'
                            +'<p style="font-size:12px;margin-top:-25px;color:green;">'+pkt.budget[i].daily_budget+'</p>'
                            +'</div>'
                        
                            +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded"  style="width:80px;" title="Advert Start Date">'
                            +'<i class="las la-border-none" style="font-size:24px;"></i>'
                            +'<p style="font-size:12px;margin-top:-25px;color:green;">'+pkt.budget[i].start_date+'</p>'
                            +'</div>'
                        
                            +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded"   style="width:80px;" title="Advert End Date">'
                            +'<i class="las la-compass" style="font-size:24px;"></i>'
                            +'<p style="font-size:12px;margin-top:-25px;color:green;">'+pkt.budget[i].end_date+'</p>'
                            +'</div>'
                        
                            +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="width:80px;" title="Advert Status" >'
                            +'<i class="las la-border-style" style="font-size:24px;"></i>'
                            +'<p style="font-size:12px;margin-top:-25px;color:green;">'+pkt.campaign[i].status+'</p>'
                            +'</div>'
                        +'</div>'
                    +'</div>';
                    }
                    $('#popup').html(popup);
                    $('#locations_detail').html(result);

                    for(i in pkt.design){
                        $("#design_detail").attr("poster", pkt.design[i].poster);
                        $("#design_detail").attr("src", pkt.design[i].source_file);
                        document.getElementById('design_detail').style.display = 'block';
                        console.log(pkt.design[i].poster);
                    }

                    for(i in pkt.schedule){
                        chess =pkt.schedule[i];
                        onRenderSchedule(chess);
                      
                    }
                    document.getElementById('r_s_c').style.display = 'none';
                }
                if (pkt.status!=200){
                    
                    document.getElementById('r_s_c').style.display = 'none';
                }
            },
            statusCode: {
                400: function(pkt) {
                    console.log(pkt.status);
                }
            },
            error: function(err) {
                console.log(err);
            }
        });
    });

    $("#save_review").bind('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: ip_address+'/api/campaign/submit',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify({'uid':window.localStorage.getItem('content'),'campaign_id':window.localStorage.getItem('cid'),'status':'PENDING'}),
            dataType: "json",
            cache: false,
            processData: false,
            success: function(data) {
                document.getElementById('r_s_c').style.display = 'block';
                if (data.status==200){
                    var n = '';
                    n +='<div   class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin:20px;" title="'+data.msg+'">'
                    +'<i class="las la-check-circle" style="font-size:64px;color:green;font-weight:bold;"></i>'
                    +'<p style="font-size:12px;color:green;font-weight:bold;width:100px;margin-left:-20px;">Success</p>'
                    +'</div>'
                    document.getElementById('r_s_c').style.display = 'none';
                    if($(document.activeElement).attr('id')=='review_continue'){
                        $("#status_success").attr("data-message", n);
                        $('#status_success').click();
                        $('.scheduler-reset').click();
                        $('#save_budget')[0].reset();
                        $('#save_design')[0].reset();
                        $('#save_schedule')[0].reset();
                        window.location = data.uri;
                    }
                    if($(document.activeElement).attr('id')=='review_save_and_close'){
                        $("#status_success").attr("data-message", n);
                        $('#status_success').click();
                    }
                }
                if (data.status!=200){
                    var n = '';
                    n +='<div   class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin:20px;">'
                    +'<i class="las la-exclamation-triangle" style="font-size:64px;color:red;font-weight:bold;"></i>'
                    +'<p style="font-size:12px;color:red;font-weight:bold;width:200px;margin-left:-75px;">Error</p>'
                    +'</div>';
                    $("#status_success").attr("data-message", n);
                    $('#status_success').click();
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

    $("#animate_design_file").bind('click', function(e) {
        e.preventDefault();
        var adverts                    = '';
        var reader                     = new FileReader();
        var form_data                  = $('#file').get(0);
        var input_file                 = form_data.files[0];
        var extension                  = input_file.name.split('.').pop().toLowerCase();
        var media_display_position     = display_position;
        var media_screen_width_height  = screen_width_height;
    
        reader.readAsDataURL(input_file);
        document.getElementById('b-loader').style.display = 'block';
        $(reader).on('load', function(e){
            data_line = e.target.result
            const base64String = data_line
                .replace('data:', '')
                .replace(/^.+,/, '');
            $.ajax({
                method: "POST",
                url: ip_address+'/api/campaign/animate',
                contentType: 'application/json;charset=UTF-8',
                data: JSON.stringify({'media_position':media_display_position, 'file': base64String ,'extension': extension ,'uid':window.localStorage.getItem('content'),'campaign_id':window.localStorage.getItem('cid'),'screen':media_screen_width_height.split(':')[0],'width':media_screen_width_height.split(':')[1],'height':media_screen_width_height.split(':')[2]}),
                dataType: "json",
                cache: false,
                processData: false,
                success: function(data) {
                    if (data.status==200){
                        console.log(data);
                        document.getElementById('b-loader').style.display = 'none';
                        for(var i = 0; i < data.videos.length; i++){
                        adverts +='<div class="card p-1" style="height:140px;">'
                                    +'<video controls muted  class="crm-profile-pic rounded avatar-100 playlist" >'
                                    +'<source src="'+data.videos[i]+'" type="video/mp4">'
                                    +'</video>'
                                    +'<ul class="navbar-nav ml-auto navbar-list align-items-center" style="margin-left:100%;margin-top:-25px;">'  
                                        +'<li class="nav-item nav-icon dropdown caption-content pl-2 ml-2">'
                                            +'<a href="#"  id="dropdownMenuButton4" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
                                                +'<div class="d-flex align-items-center">'
                                                    +'<i class="las la-ellipsis-v" style="font-size:24px;color:#062B78;"></i>'
                                                +'</div>'
                                            +'</a>'
                                            +'<button type="submit"  class="iq-sub-dropdown dropdown-menu btn-outline-success" aria-labelledby="dropdownMenuButton" style="margin-left: -65px;"><i class="las la-check" id="'+data.v[i]+':'+data.p[i]+':'+data.xpos+':'+data.ypos+':'+data.h+':'+data.w+':'+data.mpos+'" style="font-size:12px;color:green;" onclick="savePanel(this)" title="Select Video">Save & Continue</i></button>'
                                        +'</li>'
                                    +'</ul>'
                                +'</div>';
                        }
                        var n = '';
                        n +='<div   class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin:20px;" title="'+data.msg+'">'
                        +'<i class="las la-check-circle" style="font-size:64px;color:green;font-weight:bold;"></i>'
                        +'<p style="font-size:12px;color:green;font-weight:bold;width:100px;margin-left:-20px;">Success</p>'
                        +'</div>'
                        $("#status_success").attr("data-message", n);
                        $('#status_success').click();
                        $('#videos').html(adverts);
                        $("video:first").click();
                        document.getElementById('video_panel').style.display = 'block';
                        document.getElementById('animate_design_btn').style.display = 'none';
                        document.getElementById('select_animation_label').style.display = 'block';
                    }
                    if (data.status!=200){
                        document.getElementById('b-loader').style.display = 'none';
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
    });

    $("#save_location").bind('submit', function(e) {
        var notify = '';
        e.preventDefault();
        if(Object.keys(locationData).length==3){
            $.ajax({
                method: "POST",
                url: ip_address+'/api/campaign/locations',
                contentType: 'application/json;charset=UTF-8',
                data: JSON.stringify(locationData),
                dataType: "json",
                cache: false,
                processData: false,
                success: function(data) {
                    document.getElementById('l_s_c').style.display = 'block';
                    if (data.status==200){
                        var n = '';
                        n +='<div   class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin:20px;">'
                        +'<i class="las la-exclamation-triangle" style="font-size:64px;color:red;font-weight:bold;"></i>'
                        +'<p style="font-size:12px;color:red;font-weight:bold;width:200px;margin-left:-75px;">Select Your Daily Budget</p>'
                        +'</div>';
                        document.getElementById('l_s_c').style.display = 'none';
                        if($(document.activeElement).attr('id')=='location_continue'){
                            $("#status_success").attr("data-message", n);
                            $('#status_success').click();
                            $('#load-budget').click();
                        }
                        if($(document.activeElement).attr('id')=='location_save_and_close'){
                            $("#status_success").attr("data-message", n);
                            $('#status_success').click();
                            $('#client-home').click();
                        }
                    }
                    if (data.status!=200){
                        document.getElementById('l_s_c').style.display = 'none';
                        document.getElementById('b-loader').style.display = 'none';
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
        }

        if(Object.keys(locationData).length<3){
            var n = '';
            n +='<div   class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin:20px;">'
            +'<i class="las la-exclamation-triangle" style="font-size:64px;color:red;font-weight:bold;"></i>'
            +'<p style="font-size:12px;color:red;font-weight:bold;width:200px;margin-left:-75px;">Select A billboard First</p>'
            +'</div>'
            $("#status_success").attr("data-message", n);
            $('#status_success').click();
        }

        return false;
    });

    $("#save_budget").bind('submit', function(e) {
        e.preventDefault();
        var end_date                      = $('#end_date').val();
        var start_date                    = $('#start_date').val();
        var daily_budget                  = $('#daily_budget').val();
        document.getElementById('b-loader').style.display = 'block';
        $.ajax({
            method: "POST",
            url: ip_address+'/api/campaign/budget',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify({'budget': daily_budget ,'start': start_date,'end': end_date,'uid':window.localStorage.getItem('content'),'campaign_id':window.localStorage.getItem('cid')}),
            dataType: "json",
            cache: false,
            processData: false,
            success: function(data) {
                document.getElementById('b_s_c').style.display = 'block';
                if (data.status==200){
                    var n = '';
                    n +='<div   class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin:20px;">'
                    +'<i class="las la-exclamation-triangle" style="font-size:64px;color:red;font-weight:bold;"></i>'
                    +'<p style="font-size:12px;color:red;font-weight:bold;width:200px;margin-left:-75px;">Select Your Add Schedule</p>'
                    +'</div>';
                    document.getElementById('b_s_c').style.display = 'none';
                    if($(document.activeElement).attr('id')=='budget_continue'){
                        
                        $("#status_success").attr("data-message", n);
                        $('#status_success').click();
                        $('#load-schedule').click();
                    }
                    if($(document.activeElement).attr('id')=='budget_save_and_close'){
                        
                        $("#status_success").attr("data-message", n);
                        $('#status_success').click();
                        $('#client-home').click();
                    }
                }
                if (data.status!=200){
                    var n = '';
                    document.getElementById('b_s_c').style.display = 'none';
                    n +='<div   class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin:20px;">'
                    +'<i class="las la-exclamation-triangle" style="font-size:64px;color:red;font-weight:bold;"></i>'
                    +'<p style="font-size:12px;color:red;font-weight:bold;width:200px;margin-left:-75px;">Failure</p>'
                    +'</div>';
                    $("#status_success").attr("data-message", n);
                    $('#status_success').click();
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

    $("#save_schedule").bind('submit', function(e) {
        e.preventDefault();
        options = '';
        var n = '';
        n +='<div   class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin:20px;">'
        +'<i class="las la-exclamation-triangle" style="font-size:64px;color:red;font-weight:bold;"></i>'
        +'<p style="font-size:12px;color:red;font-weight:bold;width:200px;margin-left:-75px;">Schedule not Selected</p>'
        +'</div>';
        if($('#log').html()==""){
            $("#status_success").attr("data-message",n);
            $('#status_success').click();
        }
        if($('#log').html()!=""){
            $.ajax({
                method: "POST",
                url: ip_address+'/api/campaign/schedule',
                contentType: 'application/json;charset=UTF-8',
                data: JSON.stringify({'uid':window.localStorage.getItem('content'),'campaign_id':window.localStorage.getItem('cid'),'schedule':[$('#log').html()]}),
                dataType: "json",
                cache: false,
                processData: false,
                success: function(data) {
                    document.getElementById('s_s_c').style.display = 'block';
                    if (data.status==200){
                        var n = '';
                        n +='<div   class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin:20px;">'
                        +'<i class="las la-exclamation-triangle" style="font-size:64px;color:red;font-weight:bold;"></i>'
                        +'<p style="font-size:12px;color:red;font-weight:bold;width:200px;margin-left:-75px;">Submit Your Advert Media</p>'
                        +'</div>';
                        document.getElementById('s_s_c').style.display = 'none';
                        if($(document.activeElement).attr('id')=='schedule_continue'){
                            $("#status_success").attr("data-message",n);
                            $('#status_success').click();
                            $('.scheduler-reset').click();
                            $('#load-design').click();
                        }
                        if($(document.activeElement).attr('id')=='schedule_save_and_close'){
                            $("#status_success").attr("data-message",n);
                            $('#status_success').click();
                            $('.scheduler-reset').click();
                            $('#client-home').click();
                        }
                    }
                    if (data.status!=200){
                        var n = '';
                        n +='<div   class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin:20px;">'
                        +'<i class="las la-exclamation-triangle" style="font-size:64px;color:red;font-weight:bold;"></i>'
                        +'<p style="font-size:12px;color:red;font-weight:bold;width:200px;margin-left:-75px;">SCHEDULE ERROR</p>'
                        +'</div>';
                        document.getElementById('s_s_c').style.display = 'none';
                        $("#status_success").attr("data-message", n);
                        $('#status_success').click();
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
        }
        
    });

    $("#save_design_video").bind('submit', function(e) {
        e.preventDefault();

        var result                  = '';
        var reader                  = new FileReader();
        var form_data               = $('#file').get(0);
        var input_file              = form_data.files[0];
        var extension               = input_file.name.split('.').pop().toLowerCase();
        var media_display_position  = '';
        media_display_position      = display_position;

        reader.readAsDataURL(input_file);
        document.getElementById('b-loader').style.display = 'block';
        $(reader).on('load', function(e){
            data_line = e.target.result
            const base64String = data_line
                .replace('data:', '')
                .replace(/^.+,/, '');
            $.ajax({
                method: "POST",
                url: ip_address+'/api/campaign/design',
                contentType: 'application/json;charset=UTF-8',
                data: JSON.stringify({'media_position':media_display_position , 'file': base64String ,'extension': extension ,'uid':window.localStorage.getItem('content'),'campaign_id':window.localStorage.getItem('cid'),'screen':screen_width_height.split(':')[0],'width':screen_width_height.split(':')[1],'height':screen_width_height.split(':')[2]}),
                dataType: "json",
                cache: false,
                processData: false,
                success: function(data) {
                    console.log(data);
                    result +='<div class="card p-1" style="height:140px;">'
                                    +'<video controls muted poster="'+data.videos[0]+'" class="crm-profile-pic rounded avatar-100 playlist"  >'
                                    +'<source src="'+data.videos[1]+'" type="video/mp4">'
                                    +'</video>'
                                    +'<ul class="navbar-nav ml-auto navbar-list align-items-center" style="margin-left:100%;margin-top:-25px;">'  
                                        +'<li class="nav-item nav-icon dropdown caption-content pl-2 ml-2">'
                                            +'<a href="#"  id="dropdownMenuButton4" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
                                                +'<div class="d-flex align-items-center">'
                                                    +'<i class="las la-ellipsis-v" style="font-size:24px;color:#062B78;"></i>'
                                                +'</div>'
                                            +'</a>'
                                            +'<button type="submit"  class="iq-sub-dropdown dropdown-menu btn-outline-success" aria-labelledby="dropdownMenuButton" style="margin-left: -65px;"><i class="las la-check" style="font-size:12px;color:green;" onclick="saveVideo(this)" id="Save_Continue_Video" title="Select Video">Save & Continue</i></button>'
                                        +'</li>'
                                    +'</ul>'
                                +'</div>';
                    
                    var n  = '';
                    n +='<div   class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin:20px;" title="'+data.msg+'">'
                    +'<i class="las la-check-circle" style="font-size:64px;color:green;font-weight:bold;"></i>'
                    +'<p style="font-size:12px;color:green;font-weight:bold;width:100px;margin-left:-20px;">Success</p>'
                    +'</div>';

                    $("#status_success").attr("data-message", n);
                    
                    $('#videos').html(result);
                    $('#videos').click();

                    document.getElementById('b-loader').style.display                = 'none';
                    document.getElementById('save_design_file').style.display        = 'none';
                    document.getElementById('animate_design_btn').style.display      = 'none';
                    document.getElementById('video_panel').style.display             = 'block';
                    document.getElementById('select_animation_label').style.display  = 'block';

                    if (data.status!=200){
                        document.getElementById('b-loader').style.display = 'none';
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
    });


    function log(msg) {
        $('#log').prepend(msg);
    }

    log.line = 0;
    $('#timetable').scheduler({
        onSelect: function (d) {
        $('#log').empty();
        log(JSON.stringify(d));     
        }
    });

    $(document).on('mouseover', 'video', function() { 
        $(this).get(0).play(); 
    }); 

    $(document).on('mouseleave', 'video', function() { 
        $(this).get(0).pause(); 
    });
});     

var map = null;
function loadMap(addressPoints) {
    L.mapquest.key = 'adbz7u0V62KD94zjALluS1A2FIPers3j';
    var baseLayer = L.mapquest.tileLayer('dark');
    map = L.mapquest.map('map', {
        center: L.latLng(-1.257226699999981,36.80320739999999),
        layers: baseLayer,
        maxZoom: 17, minZoom:7, zoom: 14
    });

    var markers = L.markerClusterGroup();

    for(var i = 0; i < addressPoints.data.length; i++){
        var title = addressPoints.data[i][2];
        var marker = L.marker(new L.LatLng(addressPoints.data[i][0], addressPoints.data[i][1]), {
        title: title,
        icon: L.mapquest.icons.marker()
        });
        marker.bindPopup( L.popup({ closeButton: false }) .setContent('<img src="' +  addressPoints.data[i][2] + '" width="150" height="100" />'));
        markers.addLayer(marker);
    }
    map.addLayer(markers);
    addressPoints.data = [];
    return false;
}

function queryMap(addressPoints) {
    var id = $(addressPoints).attr("id");
    L.mapquest.geocoding().geocode(id);
    return false;
}

function saveMap(addressPoints) {
    locationData={};
    $('#divisiondrp').empty();
    $.ajax({
        method: "POST",
        url: ip_address+'/api/campaign/query',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({'uid':window.localStorage.getItem('content'),'campaign_id':window.localStorage.getItem('cid'),'billboard_id': $(addressPoints).attr("id")}),
        dataType: "json",
        cache: false,
        processData: false,
        success: function(data) {
            if (data.status==200){
                /*
                var inputElement = '<select id="design-dropdown" class="form-control"  data-style="py-0">';  
                for(var i = 0; i < data.display.length; i++){
                    for(var j = 0; j < data.display[i].length; j++){
                        inputElement += '<option value="' + data.swh + '">' + data.display[i][j] + '</option>';
                    }
                }
                inputElement += '</select>';  
                $('#divisiondrp').append(inputElement);
                
                $("#design-dropdown").each(function () {  
                    $('option', this).each(function () {  
      
                        if ($(this).text() == 'Select') {  
                            $(this).attr('selected', 'selected')  
                        };  
                    });  
                });
                */
                var inputElement  = '';
                for(var i = 0; i < data.display.length; i++){
                    for(var j = 0; j < data.display[i].length; j++){
                        inputElement += '<button type="submit" class="btn btn-outline-success mt-2" style="margin-right:10px;" id="' + data.display[i][j] + '" value="' + data.swh + '">' + data.display[i][j] + '</button>';
                    }
                }

                $('#divisiondrp').append(inputElement);

                var n = '';
                n +='<div   class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin:20px;" title="'+data.msg+'">'
                +'<i class="las la-check-circle" style="font-size:64px;color:green;font-weight:bold;"></i>'
                +'<p style="font-size:12px;color:green;font-weight:bold;width:100px;margin-left:-20px;">Success</p>'
                +'</div>'

                $("#status_success").attr("data-message", n);
                $('#status_success').click();
                $("#select_"+$(addressPoints).attr("id")).css({"color": "blue","font-weight": "bolder"});
                locationData={'billboard_id': $(addressPoints).attr("id"),'uid':window.localStorage.getItem('content'),'campaign_id':window.localStorage.getItem('cid')};
            }
            if (data.status!=200){
                
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
}

function savePanel(metrics) {
    document.getElementById('b-loader').style.display = 'block';
    $.ajax({
        method: "POST",
        url: ip_address+'/api/campaign/save/animate',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({'media_content':$(metrics).attr("id").split(':')[0],'uid':window.localStorage.getItem('content'),'campaign_id':window.localStorage.getItem('cid'),'media_poster':$(metrics).attr("id").split(':')[1],'media_position':$(metrics).attr("id").split(':')[6],'media_xpos':$(metrics).attr("id").split(':')[2],'media_ypos':$(metrics).attr("id").split(':')[3],'media_height':$(metrics).attr("id").split(':')[4],'media_width':$(metrics).attr("id").split(':')[5]}),
        dataType: "json",
        cache: false,
        processData: false,
        success: function(data) {
            if (data.status==200){
                var n = '';
                n +='<div   class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin:20px;" title="'+data.msg+'">'
                +'<i class="las la-check-circle" style="font-size:64px;color:green;font-weight:bold;"></i>'
                +'<p style="font-size:12px;color:green;font-weight:bold;width:100px;margin-left:-20px;">Success</p>'
                +'</div>'
                $("#status_success").attr("data-message", n);
                $('#status_success').click();
                document.getElementById('b-loader').style.display = 'none';
                $('#load-review').click();
            }
            if (data.status!=200){
                document.getElementById('b-loader').style.display = 'none';
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
}

function saveVideo(metrics){
    if($(metrics).attr("id")=='Save_Continue_Video'){
        var n  = '';
        n +='<div   class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin:20px;">'
        +'<i class="las la-check-circle" style="font-size:64px;color:green;font-weight:bold;"></i>'
        +'<p style="font-size:12px;color:green;font-weight:bold;width:100px;margin-left:-20px;">Success</p>'
        +'</div>';
        $("#status_success").attr("data-message", n);
        $('#status_success').click();
        $('#load-review').click();
    }
}
