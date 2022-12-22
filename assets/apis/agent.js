$(document).ready(function() {
    adverts = '';
    ip_address = 'http://127.0.0.1:5008';
    var uid = window.localStorage.getItem('content');
    document.getElementById('b-loader').style.display = 'block';
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
 
    $.ajax({
        method: "POST",
        url: ip_address+'/api/campaign/agents',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({'uid':window.localStorage.getItem('content')}),
        dataType: "json",
        cache: false,
        processData: false,
        success: function(data) {
            if (data.status==200){
                for(i in data.advert){
                    adverts +='<div class="col-lg-4">'
                    +'<div class="card p-2 text-left">'
                    +'<video controls muted poster="'+data.advert[i].poster+'" style="height:180px;width:320px;" class="crm-profile-pic rounded avatar-100">'
                    +'<source src="'+data.advert[i].source_file+'" type="video/webm">'
                    +'</video>'
                    +'<button class="btn mt-1" id="'+data.advert[i].campaign_id+':'+data.advert[i].campaign_owner_id+'" onclick="previewAdvert(this)"><h5>'+data.advert[i].name+'</h5></button>'
                    +'</div>'
                    +'</div>'
                }
                console.log(data.advert.length);
                document.getElementById('b-loader').style.display = 'none';
            }
            $('#videos').html(adverts);

            if (data.status!=200){
                document.getElementById('b-loader').style.display = 'none';
            }
        },
        statusCode: {
            400: function(data) {
                document.getElementById('b-loader').style.display = 'none';
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

    $("#create_advert").bind('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: ip_address+'/api/advert/create',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify({'campaign_id':window.localStorage.getItem('aid'),'status':'APPROAVED'}),
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


});     

function previewAdvert(metrics) {
    result    = '';
    budget    = '';
    chess     = {};
    campaign  = '';
    document.getElementById('b-loader').style.display = 'block';
    $.ajax({
        method: "POST",
        url: ip_address+'/api/campaign/agents/preview',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({'uid':$(metrics).attr("id").split(':')[1],'campaign_id':$(metrics).attr("id").split(':')[0]}),
        dataType: "json",
        cache: false,
        processData: false,
        success: function(pkt) {
            if (pkt.status==200){
                for(i in pkt.location){
                    result +='<div class="col-lg-12" >'
                    +'<div class="card"><div class="card-body p-2">'
                    +'<div class="d-flex flex-wrap  align-items-center">'
                    +'<img class="svg-icon" height="130" width="200" src="'+pkt.location[i].billboard_image+'" >'
                    +'<path fill-rule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" clip-rule="evenodd" />'
                    +'</svg>'
                    
                    +'<div style="margin-left:201px;margin-top:-120px;">'
                    +'<h4 id="'+pkt.location[i].billboard_id+'" style="text-transform:capitalize;margin-left:10px;margin-top:-90px;overflow: hidden;font-size:20px;font-weight:bold;">'
                    +pkt.location[i].billboard_name+'</h4>'
                    
                    +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-top:10px;" title="Daily Views">'
                    +'<i class="las la-eye"></i>'
                    +'<p style="font-size: 10px;margin-top:-25px;">'+pkt.location[i].billboard_daily_views+'</p>'
                    +'</div>'
                    +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:53px;margin-top:-50px;" title="Billboard Size">'
                    +'<i class="las la-border-style"></i>'
                    +'<p style="font-size: 10px;margin-top:-25px;">'+pkt.location[i].billboard_width+'x'+pkt.location[i].billboard_height+'</p>'
                    +'</div>'
                    +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:108px;margin-top:-50px;" title="Traffic Direction">'
                    +'<i class="las la-compass"></i>'
                    +'<p style="font-size: 10px;margin-top:-25px;">'+pkt.location[i].billboard_traffic_direction+'</p>'
                    +'</div>'
                    +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:165px;margin-top:-50px;width:52px;" title="Status">'
                    +'<i class="las la-check-double"></i>'
                    +'<p style="font-size: 10px;margin-top:-25px;">'+pkt.location[i].billboard_availability+'</p>'
                    +'</div>'
                    +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:227px;margin-top:-50px;width:42px;" title="Channels">'
                    +'<i class="las la-border-none"></i>'
                    +'<p style="font-size: 10px;margin-top:-25px;">'+pkt.location[i].billboard_screen_count+'</p>'
                    +'</div>'
                    +'<div class="icon iq-icon-box-2 edit-button bg-white  rounded" style="margin-left:280px;margin-top:-50px;width:42px;cursor: pointer;" title="See On Map">'
                    +'<i  class="las la-map-marker" id="'+pkt.location[i].billboard_name+'" onclick="queryMap(this)" alt="check"></i>'
                    +'<p style="font-size: 10px;margin-top:-25px;">View</p>'
                    +'</div>'
                    +'</div>'
                    +'<button id="'+pkt.location[i].billboard_id+'" onclick="saveMap(this)" type="submit" class="btn btn-outline-dark mt-1" style="margin-left:210px;width:300px;height:40px;"> <i class="las la-save" style="color:green;font-size: 24px;"  title="Save Billboard"></i> </button>'
                    +'</div></div></div></div>';
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
                    //onRenderSchedule(chess);
                  
                }
                document.getElementById('b-loader').style.display = 'none';
                window.localStorage.setItem('aid', $(metrics).attr("id").split(':')[0]);
                $("#load-preview").click();
            }
            if (pkt.status!=200){
                
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

    return false;
}

