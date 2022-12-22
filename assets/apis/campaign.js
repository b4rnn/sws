var geoData       = {};
var addressPoints = [];
var ip_address    = 'http://127.0.0.1:5008';

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
            document.getElementById('save_design_file').style.display = 'none';
            document.getElementById('animate_design_file').style.display = 'block';
            
        }

        reader.readAsDataURL(file);
    }

    if(extension=='mp4'||extension=='avi'||extension=='webm'){
        var reader = new FileReader();

        reader.onload = function(){
            $("#previewVid").attr("src", reader.result);
            document.getElementById('previewImg').style.display = 'none';
            document.getElementById('previewVid').style.display = 'block';
            document.getElementById('video_panel').style.display = 'none';
            document.getElementById('save_design_file').style.display = 'block';
            document.getElementById('animate_design_file').style.display = 'none';
        }

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

$(document).ready(function() {
    
    var uid = window.localStorage.getItem('content');
    document.getElementById('video_panel').style.display = 'none';

    $.ajax({
        method: "POST",
        url: ip_address+'/api/profile/query',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({'query': uid , 'limit': '1'}),
        dataType: "json",
        success: function(data) {
            localStorage.setItem('loggedin', 1);
            console.log(data.msg);
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
        document.getElementById('b-loader').style.display = 'block';
        var result = '';
        $('#layout1-chart-2').empty();
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

                        _addressPoints=[data.msg[i].billboard_latitude, data.msg[i].billboard_longitude,data.msg[i].billboard_image,data.msg[i].billboard_id];
                        addressPoints.push(_addressPoints);
                        result +='<div class="p-1">'
                        +'<img id="'+data.msg[i].billboard_name+'" title="See On Map" onclick="queryMap(this)" alt="check" class="svg-icon" height="100" width="150" src="'+data.msg[i].billboard_image+'" >'
                        +'<path fill-rule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" clip-rule="evenodd" />'
                        +'</svg>'
                       
                        +'<div style="margin-left:-10px;margin-top:100px;">'
                            +'<h4 id="'+data.msg[i].billboard_id+'" style="text-transform:capitalize;margin-left:10px;margin-top:-90px;overflow: hidden;font-size:15px;font-weight:bold;">'
                            +data.msg[i].billboard_name+'</h4>'
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
                            +'<i class="las la-check" style="font-size:24px;color:red;"></i>'
                            +'<p style="font-size:12px;margin-top:-25px;color:green;">Select</p>'
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
                    $('#layout1-chart-2').html(result);
                    document.getElementById('b-loader').style.display = 'none';
                    geoData = {id:'q', data:addressPoints};
                    loadMap(geoData);
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
                if (data.status==200){
                    document.getElementById('b-loader').style.display = 'none';
                    $('#billboard_status').click();
                }
                if (data.status!=200){
                    document.getElementById('b-loader').style.display = 'none';
                    $('#billboard_status').click();
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

    $("#save_design").bind('submit', function(e) {
        e.preventDefault();
        var reader                  = new FileReader();
        var form_data               = $('#file').get(0);
        var input_file              = form_data.files[0];
        var extension               = input_file.name.split('.').pop().toLowerCase();
        var media_display_position          = $('select[name=design-dropdown] option').filter(':selected').val();

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
                data: JSON.stringify({'media_position':'noop', 'file': base64String ,'extension': extension ,'uid':window.localStorage.getItem('content'),'campaign_id':window.localStorage.getItem('cid')}),
                dataType: "json",
                cache: false,
                processData: false,
                success: function(data) {
                    if (data.status==200){
                        $('#billboard_status').click();
                        document.getElementById('b-loader').style.display = 'none';
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

    $("#load-design").bind('click', function(e) {
        e.preventDefault();
        $('#divisiondrp').empty();
        $.ajax({
            method: "POST",
            url: ip_address+'/api/campaign/query',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify({'uid':window.localStorage.getItem('content'),'campaign_id':window.localStorage.getItem('cid')}),
            dataType: "json",
            cache: false,
            processData: false,
            success: function(data) {
                if (data.status==200){
                    var inputElement = '<select id="design-dropdown" class="form-control"  data-style="py-0">';  
                    for(var i = 0; i < data.display.length; i++){
                        for(var j = 0; j < data.display[i].length; j++){
                            inputElement += '<option value="' + data.display[i][j] + '">' + data.display[i][j] + '</option>';
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
    });

    $("#save_schedule").bind('submit', function(e) {
        e.preventDefault();
        options = '';
        if($('#log').html()==""){
            $("#billboard_status").attr("data-message", "SCHEDULE NOT SELECTED");
            $('#billboard_status').click();
        }
        if($('#log').html()!=""){
            document.getElementById('b-loader').style.display = 'block';
            $.ajax({
                method: "POST",
                url: ip_address+'/api/campaign/schedule',
                contentType: 'application/json;charset=UTF-8',
                data: JSON.stringify({'uid':window.localStorage.getItem('content'),'campaign_id':window.localStorage.getItem('cid'),'schedule':[$('#log').html()]}),
                dataType: "json",
                cache: false,
                processData: false,
                success: function(data) {
                    if (data.status==200){
                        document.getElementById('b-loader').style.display = 'none';
                        $('#billboard_status').click();
                        $('.scheduler-reset').click();
                    }
                    if (data.status!=200){
                        document.getElementById('b-loader').style.display = 'none';
                        $('#billboard_status').click();
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

    $("#load-review").bind('click', function(e) {
        e.preventDefault();
        result    = '';
        budget    = '';
        chess     = {};
        campaign  = '';
        document.getElementById('b-loader').style.display = 'block';
        $.ajax({
            method: "POST",
            url: ip_address+'/api/campaign/review',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify({'uid':window.localStorage.getItem('content'),'campaign_id':window.localStorage.getItem('cid')}),
            dataType: "json",
            cache: false,
            processData: false,
            success: function(pkt) {
                if (pkt.status==200){
                    for(i in pkt.location){
                        result +='<div class="p-1">'
                        +'<img id="'+pkt.location[i].billboard_name+'" title="See On Map" onclick="queryMap(this)" alt="check" class="svg-icon" height="100" width="150" src="'+pkt.location[i].billboard_image+'" >'
                        +'<path fill-rule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" clip-rule="evenodd" />'
                        +'</svg>'

                        +'<div style="margin-left:155px;margin-top:-120px;">'
                            +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-top:0px;" title="Daily Views">'
                            +'<i class="las la-eye" style="font-size:24px;"></i>'
                            +'<p style="font-size:12px;margin-top:-25px;color:green;">'+pkt.location[i].billboard_daily_views+'</p>'
                            +'</div>'

                            +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:0px;margin-top:-5px;" title="Channels">'
                            +'<i class="las la-border-none" style="font-size:24px;"></i>'
                            +'<p style="font-size:12px;margin-top:-25px;color:green;">'+pkt.location[i].billboard_screen_count+'</p>'
                            +'</div>'

                            +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:0px;margin-top:-5px;" title="Traffic Direction">'
                            +'<i class="las la-compass" style="font-size:24px;"></i>'
                            +'<p style="font-size:12px;margin-top:-25px;color:green;">'+pkt.location[i].billboard_traffic_direction+'</p>'
                            +'</div>'
                        +'</div>'

                        +'<div style="margin-left:-10px;margin-top:100px;">'
                            +'<h4 id="'+pkt.location[i].billboard_id+'" style="text-transform:capitalize;margin-left:10px;margin-top:-90px;overflow: hidden;font-size:15px;font-weight:bold;">'
                            +pkt.location[i].billboard_name+'</h4>'
                        +'</div>'

                        +'<div style="margin-left:-120px;margin-top:50px;">'
                            +'<div id="'+pkt.location[i].billboard_id+'" onclick="saveMap(this)" class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:108px;margin-top:-50px;" title="Save Billboard">'
                            +'<i class="las la-check" style="font-size:24px;color:red;"></i>'
                            +'<p style="font-size:12px;margin-top:-25px;color:green;">Select</p>'
                            +'</div>'
                            +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:165px;margin-top:-50px;width:52px;" title="Status">'
                            +'<i class="las la-check-double" style="font-size:24px;"></i>'
                            +'<p style="font-size:12px;margin-top:-25px;color:green;">'+pkt.location[i].billboard_availability+'</p>'
                            +'</div>'
                            +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:235px;margin-top:-50px;width:80px;" title="Billboard Size" >'
                            +'<i class="las la-border-style" style="font-size:24px;"></i>'
                            +'<p style="font-size:12px;margin-top:-25px;color:green;">'+pkt.location[i].billboard_width+'x'+pkt.location[i].billboard_height+'</p>'
                            +'</div>'
                        +'</div>'

                        +'</div>';
                    }
                    $('#locations_detail').html(result);

                    for(i in pkt.budget){
                        budget +='<div class="card-header ">'
                        +'<i style="font-size:15px;font-weight:bold;"> Daily Budget</i>'
                        +'<i style="color:green;font-size: 14px;"> '+pkt.budget[i].daily_budget+'</i>'
                        +'</div>'
                        +'<div class="card-header ">'
                        +'<i style="font-size:15px;font-weight:bold;"> Start Date</i>'
                        +'<i style="color:green;font-size: 14px;"> '+pkt.budget[i].start_date+'</i>'
                        +'</div>'
                        +'<div class="card-header ">'
                        +'<i style="font-size:15px;font-weight:bold;"> End Date</i>'
                        +'<i style="color:green;font-size: 14px;"> '+pkt.budget[i].end_date+'</i>'
                        +'</div>'
                    }
                    $('#budget_detail').html(budget);

                    for(i in pkt.campaign){
                        campaign +='<div class="card-header ">'
                        +'<i style="font-size:15px;font-weight:bold;"> Name </i>'
                        +'<i style="color:green;font-size: 14px;"> '+pkt.campaign[i].name+'</i>'
                        +'</div>'
                        +'<div class="card-header ">'
                        +'<i style="font-size:15px;font-weight:bold;"> Category </i>'
                        +'<i style="color:green;font-size: 14px;"> '+pkt.campaign[i].category+'</i>'
                        +'</div>'
                        +'<div class="card-header ">'
                        +'<i style="font-size:15px;font-weight:bold;"> Status </i>'
                        +'<i style="color:green;font-size: 14px;"> '+pkt.campaign[i].status+'</i>'
                        +'</div>'
                    }
                    $('#campaign_detail').html(campaign);

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
                    document.getElementById('b-loader').style.display = 'none';
                }
                if (pkt.status!=200){
                    
                    document.getElementById('b-loader').style.display = 'none';
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
                if (data.status==200){
                    $('#billboard_status').click();
                    $('.scheduler-reset').click();
                    $('#save_budget')[0].reset();
                    $('#save_design')[0].reset();
                    $('#save_schedule')[0].reset();
                    window.location = data.uri;
                }
                if (data.status!=200){
                    
                    $('#billboard_status').click();
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
        var adverts                 = '';
        var reader                  = new FileReader();
        var form_data               = $('#file').get(0);
        var input_file              = form_data.files[0];
        var extension               = input_file.name.split('.').pop().toLowerCase();
        var media_display_position  = $('select[name=design-dropdown] option').filter(':selected').val();
    
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
                data: JSON.stringify({'media_position':'noop', 'file': base64String ,'extension': extension ,'uid':window.localStorage.getItem('content'),'campaign_id':window.localStorage.getItem('cid')}),
                dataType: "json",
                cache: false,
                processData: false,
                success: function(data) {
                    if (data.status==200){
                        document.getElementById('b-loader').style.display = 'none';
                        for(var i = 0; i < data.videos.length; i++){
                        adverts +='<div class="form-group col-md-6">'
                                    +'<div class="card">'
                                        +'<div class="card-header d-flex justify-content-between">'
                                            +'<div class="header-title">'
                                                +'<h6 class="card-title">'+data.names[i]+'</h6>'
                                                    +'</div>'
                                                +'<h6 class="card-title" ></h6><i class="las la-check" id="'+data.v[i]+':'+data.p[i]+'" style="font-size:24px;color:green;" onclick="savePanel(this)" title="Select Video"></i>'
                                            +'</div>'
                                                +'<video controls muted  class="crm-profile-pic rounded avatar-100" >'
                                                +'<source src="'+data.videos[i]+'" type="video/mp4">'
                                                +'</video>'
                                    +'</div>'
                                +'</div>';
                        }
                        $('#billboard_status').click();
                        $('#videos').html(adverts);
                        $("video:first").click();
                        document.getElementById('video_panel').style.display = 'block';
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

    //pause video on mouse leave
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
    $.ajax({
        method: "POST",
        url: ip_address+'/api/campaign/locations',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({'billboard_id': $(addressPoints).attr("id"),'uid':window.localStorage.getItem('content'),'campaign_id':window.localStorage.getItem('cid')}),
        dataType: "json",
        cache: false,
        processData: false,
        success: function(data) {
            if (data.status==200){
                $('#billboard_status').click();
            }
            if (data.status!=200){
                
                $('#billboard_status').click();
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

function savePanel(metrics) {
    document.getElementById('b-loader').style.display = 'block';
    $.ajax({
        method: "POST",
        url: ip_address+'/api/campaign/save/animate',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({'media_content':$(metrics).attr("id").split(':')[0],'uid':window.localStorage.getItem('content'),'campaign_id':window.localStorage.getItem('cid'),'media_poster':$(metrics).attr("id").split(':')[1],'media_position':'0'}),
        dataType: "json",
        cache: false,
        processData: false,
        success: function(data) {
            if (data.status==200){
                $('#billboard_status').click();
                document.getElementById('b-loader').style.display = 'none';
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