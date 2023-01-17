$(document).ready(function() {
    popup   = '';
    result  = '';
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
            if (data.status==200){
                if(data.msg[0].user_id==uid){
                    $('#admin-email').html(data.msg[0].user_email);
                    $('#admin-profile-image').attr({src: data.msg[0].user_image});
                    $('#admin-creation-date').html(data.msg[0].user_registration_date);
                    $('#admin-usernames').html(data.msg[0].first_name + " " + data.msg[0].last_name);
                }
                $("#load-pending").click();
                //$("#load-billboards").click();
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
    $("#load-pending").bind('click', function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: ip_address+'/api/campaign/status/pending',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify({'uid':window.localStorage.getItem('content')}),
            dataType: "json",
            cache: false,
            processData: false,
            success: function(data) {
                document.getElementById('p_r_a').style.display = 'block';
                if (data.status==200){
                    if(data.advert.length>0){
                        adverts = '';
                        for(i in data.advert){
                            adverts +='<div style="height:120px;" class="p-1">'
                                +'<video poster="'+data.advert[i].poster+'"  class="crm-profile-pic rounded avatar-100 playlist" id="'+data.advert[i].campaign_id+':'+data.advert[i].campaign_owner_id+'" onclick="previewAdvert(this)" tooltip="'+data.advert[i].name+'">'
                                +'<source src="'+data.advert[i].source_file+'" type="video/webm">'
                                +'</video>'
                            +'</div>';
                        }
                        document.getElementById('b-loader').style.display = 'none';
                        $('#videos').html(adverts);
                        $("video:first").click();
                    }

                    if(data.advert.length==0){
                        adverts = '';
                        adverts +='<div class="card border-none bg-body">'
                            +'<div class="card-body custom-card-space">'
                                +'<div class="card border-none">'
                                    +'<div class="card-body custom-card-space ">'
                                        +'<div class="row" >'
                                            +'<div class="col-xl-12">'
                                                +'<div class="row" >'
                                                    +'<div class="col-lg-4">'
                                                        +'<div class="card text-center">'
                                                            +'<div class="card-body">'
                                                                +'<i class="las la-info-circle" style="font-size:64px;color:green;"></i>'
                                                                //+'<h6 class="card-title mt-1">Compose a Campaign or Complete draft</h6>'
                                                            +'</div>'
                                                        +'</div>'
                                                    +'</div>'                 
                                                +'</div>'
                                            +'</div>'
                                        +'</div>'
                                    +'</div>'
                                +'</div>'
                            +'</div>'
                        +'</div>';
                        $('#home').html(adverts);
                        document.getElementById('b-loader').style.display = 'none';
                    }
                    document.getElementById('p_r_a').style.display = 'none';
                }
            
                if (data.status!=200){
                    document.getElementById('p_r_a').style.display = 'none';
                }
            },
            statusCode: {
                400: function(data) {
                    document.getElementById('p_r_a').style.display = 'none';
                }
            },
            error: function(err) {
                console.log(err);
            }
        });
    });

    $("#load_approaved").bind('click', function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: ip_address+'/api/campaign/status/approaved',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify({'uid':window.localStorage.getItem('content')}),
            dataType: "json",
            cache: false,
            processData: false,
            success: function(data) {
                document.getElementById('p_r_a').style.display = 'block';
                if (data.status==200){
                    if(data.advert.length>0){
                        adverts = '';
                        for(i in data.advert){
                            adverts +='<div style="height:120px;" class="p-1">'
                                +'<video poster="'+data.advert[i].poster+'"  class="crm-profile-pic rounded avatar-100 playlist" id="'+data.advert[i].campaign_id+':'+data.advert[i].campaign_owner_id+'" onclick="previewAdvert(this)" tooltip="'+data.advert[i].name+'">'
                                +'<source src="'+data.advert[i].source_file+'" type="video/webm">'
                                +'</video>'
                            +'</div>';
                        }
                        document.getElementById('b-loader').style.display = 'none';
                        $('#approaved_videos').html(adverts);
                        $("#approaved_videos:first").click();
                    }
    
                    if(data.advert.length==0){
                        adverts = '';
                        adverts +='<div class="card border-none bg-body">'
                            +'<div class="card-body custom-card-space">'
                                +'<div class="card border-none">'
                                    +'<div class="card-body custom-card-space ">'
                                        +'<div class="row" >'
                                            +'<div class="col-xl-12">'
                                                +'<div class="row" >'
                                                    +'<div class="col-lg-4">'
                                                        +'<div class="card text-center">'
                                                            +'<div class="card-body">'
                                                                +'<i class="las la-info-circle" style="font-size:64px;color:green;"></i>'
                                                                //+'<h6 class="card-title mt-1">Compose a Campaign or Complete draft</h6>'
                                                            +'</div>'
                                                        +'</div>'
                                                    +'</div>'                 
                                                +'</div>'
                                            +'</div>'
                                        +'</div>'
                                    +'</div>'
                                +'</div>'
                            +'</div>'
                        +'</div>';
                        $('#approaved_videos').html(adverts);
                        document.getElementById('p_r_a').style.display = 'none';
                    }
                    document.getElementById('p_r_a').style.display = 'none';
                }
               
                if (data.status!=200){
                    document.getElementById('p_r_a').style.display = 'none';
                }
            },
            statusCode: {
                400: function(data) {
                    document.getElementById('p_r_a').style.display = 'none';
                }
            },
            error: function(err) {
                console.log(err);
            }
        });
    });

    $("#load-rejected").bind('click', function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: ip_address+'/api/campaign/status/rejected',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify({'uid':window.localStorage.getItem('content')}),
            dataType: "json",
            cache: false,
            processData: false,
            success: function(data) {
                document.getElementById('p_r_a').style.display = 'block';
                if (data.status==200){
                    if(data.advert.length>0){
                        adverts = '';
                        for(i in data.advert){
                            adverts +='<div style="height:120px;" class="p-1">'
                                +'<video poster="'+data.advert[i].poster+'" style="height:180px;width:320px;" class="crm-profile-pic rounded avatar-100 playlist" id="'+data.advert[i].campaign_id+':'+data.advert[i].campaign_owner_id+'" onclick="previewAdvert(this)" tooltip="'+data.advert[i].name+'">'
                                +'<source src="'+data.advert[i].source_file+'" type="video/webm">'
                                +'</video>'
                            +'</div>';
                        }
                        console.log(data.advert.length);
                       
                        $('#rejected_videos').html(adverts);
                        //$("video:first").click();
                    }
    
                    if(data.advert.length==0){
                        adverts = '';
                        adverts +='<div class="card border-none bg-body">'
                            +'<div class="card-body custom-card-space">'
                                +'<div class="card border-none">'
                                    +'<div class="card-body custom-card-space ">'
                                        +'<div class="row" >'
                                            +'<div class="col-xl-12">'
                                                +'<div class="row" >'
                                                    +'<div class="col-lg-4">'
                                                        +'<div class="card text-center">'
                                                            +'<div class="card-body">'
                                                                +'<i class="las la-info-circle" style="font-size:64px;color:green;"></i>'
                                                                //+'<h6 class="card-title mt-1">Campaings that had not been completed</h6>'
                                                            +'</div>'
                                                        +'</div>'
                                                    +'</div>'                 
                                                +'</div>'
                                            +'</div>'
                                        +'</div>'
                                    +'</div>'
                                +'</div>'
                            +'</div>'
                        +'</div>';
                        $('#ongoing_videos').html(adverts);
                    }
                    document.getElementById('p_r_a').style.display = 'none';
                }
               
                if (data.status!=200){
                    document.getElementById('p_r_a').style.display = 'none';
                }
            },
            statusCode: {
                400: function(data) {
                    document.getElementById('p_r_a').style.display = 'none';
                }
            },
            error: function(err) {
                console.log(err);
            }
        });
    
    });

    $("#load-ongoing").bind('click', function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: ip_address+'/api/campaign/status/ongoing',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify({'uid':window.localStorage.getItem('content')}),
            dataType: "json",
            cache: false,
            processData: false,
            success: function(pkt) {
                if (pkt.status==200){
                    popup  = '';
                    result = '';
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
                    $('#ongoing_videos').html(result);
                    /*
                    for(i in pkt.design){
                        $("#design_detail").attr("poster", pkt.design[i].poster);
                        $("#design_detail").attr("src", pkt.design[i].source_file);
                        document.getElementById('design_detail').style.display = 'block';
                    }
    
                    for(i in pkt.schedule){
                        chess =pkt.schedule[i];
                        //onRenderSchedule(chess);
                      
                    }
                    document.getElementById('b-loader').style.display = 'none';
                    $("#load-home").click();
                    */
                }
                if (pkt.status!=200){
                    
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

    $("#create_campaign").bind('submit', function(e) {
        e.preventDefault();
        var name                   = $('#campaign_name').val();
        var category               = $('select[name=campaign_category] option').filter(':selected').val();
        $.ajax({
            method: "POST",
            url: ip_address+'/api/campaign/create',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify({'name': name, 'category':category,'id':uid}),
            dataType: "json",
            cache: false,
            processData: false,
            success: function(data) {
                if (data.status==200){
                    document.getElementById('b-loader').style.display = 'none';
                    if($(document.activeElement).attr('id')=='campaign_continue'){
                        window.localStorage.setItem('cid', data.id);
                        window.location = data.uri;
                    }
                    if($(document.activeElement).attr('id')=='campaign_save_and_close'){
                        $('#client-home').click();
                    }
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

    $(document).on('mouseover', 'video', function() { 
        $(this).get(0).play(); 
    }); 

    //pause video on mouse leave
    $(document).on('mouseleave', 'video', function() { 
        $(this).get(0).pause(); 
    });
});     

function previewAdvert(metrics) {
    result    = '';
    popup     = '';
    chess     = {};
    campaign  = '';
    document.getElementById('b-loader').style.display = 'block';
    $.ajax({
        method: "POST",
        url: ip_address+'/api/campaign/preview',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({'uid':$(metrics).attr("id").split(':')[1],'campaign_id':$(metrics).attr("id").split(':')[0]}),
        dataType: "json",
        cache: false,
        processData: false,
        success: function(pkt) {
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
                }

                for(i in pkt.schedule){
                    chess =pkt.schedule[i];
                    //onRenderSchedule(chess);
                  
                }
                document.getElementById('b-loader').style.display = 'none';
                $("#load-home").click();
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
