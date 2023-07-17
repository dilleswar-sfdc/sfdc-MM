({
    ampdashboard:'',
    modal:'',
    lastemailcampaign:'',
    independentmodal:'',
    sessionID:'',
    AuthenticateCurrentUser:function(component, event, helper){
        var action = component.get("c.AuthenticateSFUser");
        action.setParams({
           "createuserviasso": component.get("v.createuserviasso")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var getapiState=JSON.parse(response.getReturnValue()).status;
                if(getapiState==1)
                {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                    title : 'Info Message',
                    message: "An issue occured with the Mindmatrix widget, please contact admin",
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'info',
                    mode: 'dismissible' 
                });
        		toastEvent.fire();
                }
                else{
                    var data = JSON.parse(response.getReturnValue());
                    var newuser=data.result.newuser;
                    if(data.result.tos == false){
                        component.set('v.isOpen',true);
                        var url = data.result.installurl + "/?elt=" + data.result.usersessionid + "&returnurl=toschangepasswordsetting";
                        component.set("v.iframesrc",url);
                    }
                    var finalresponse=data.result.code;
                    var finalmessage=data.result.msg;
                    if(finalresponse==false)
                     {
                         var toastEvent = $A.get("e.force:showToast");
                         toastEvent.setParams({
                             title : 'Info Message',
                             message: finalmessage,
                             duration:' 5000',
                             key: 'info_alt',
                             type: 'info',
                             mode: 'dismissible' 
                         });
                         toastEvent.fire();
                     }
                    else{
                        if(data.result.authentic)
                        {
                            helper.sessionID = data.result.usersessionid;
                            helper.UpdateToken(component,helper,data.result.usertoken,newuser);
                            component.set("v.showwidget","block");
                            if(!newuser){
                                helper.processcmp(component,helper);
                            }
                        }
                    }
                }
            }
        });
        $A.enqueueAction(action);
    },
    processcmp:function(component,helper){
        if(component.get("v.dependantwidget") == "oneapp")
            helper.getLast5emailCampaign(component,helper);
        else
            helper.getDetails(component,helper); 
    },
    UpdateToken:function(component,helper,token,newuser){
        var action = component.get("c.UpdateToken");
        action.setParams({
            "token": token
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                if(newuser){
                    helper.processcmp(component,helper);
                }
            }
        });
        $A.enqueueAction(action);
    },
    createAuthorizedComponent : function(component)
    {
        $A.createComponent('c:AMPAuthorized',{} , function (contentComponent, status, error) {
            if (status === "SUCCESS") {
                component.set('v.unauthorized', contentComponent);
            } else {
                throw new Error(error);
            }
        });
	},
	getLast5emailCampaign : function(component,helper) {
        helper.dynamicColorBinding(component,event,helper);
        var ampdashboard = $(".ampdashboard");
        this.modal = $(ampdashboard).find('.demo-modal').not('.modal-independant');
        this.independentmodal = $(this.lastemailcampaign).find(".modal-independant");
		var action = component.get("c.getLast5emailCampaign");
        action.setParams({userid:component.get("v.userid")});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var apigetState = JSON.parse(response.getReturnValue()).status;
                if(apigetState == 1){
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                    title : 'Info Message',
                    message: "An issue occured with the Mindmatrix widget, please contact admin",
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'info',
                    mode: 'dismissible' 
                });
        		toastEvent.fire();
                }
                else{
                    
                    var data = JSON.parse(response.getReturnValue()).result;
                    var finalresponse=data.code;
                     var finalmessage=data.msg;
                    if(finalresponse==false)
                     {
                         $(".lastemailcampaign-container").html("<div class='slds-box'>Sorry!"+' '+finalmessage+"</div>");
                         var toastEvent = $A.get("e.force:showToast");
                             toastEvent.setParams({
                            title : 'Info Message',
                            message: finalmessage,
                            duration:' 5000',
                            key: 'info_alt',
                            type: 'info',
                            mode: 'dismissible' 
               		 		});
        				toastEvent.fire();
                     }
                    else{
                        var _data = data;
                        if(_data == undefined){
                            $(".lastemailcampaign-container").html("<div class='slds-box'>Sorry! We could not find any data to show you.</div>");
                        }
                        else{
                        var nodata = true;
                        var html = '';
                        var install = component.get("v.install") + '//?elt=' + helper.sessionID;
                        for(var i = 0; i<_data.length; i++)
                        {
                            nodata = false;
                            var id = _data[i].id;
                            var name = _data[i].name;
                            var openrate = _data[i].openrate;
                            var sparkdata = _data[i].sparkdata;
                            var totalclicks = _data[i].totalClicks;
                            var totalopens = _data[i].totalOpens;
                            var sentOn = _data[i].sentOn;
                            var emaildata = [];
                            emaildata["id"] = id;
                            emaildata["name"] = id;
                            emaildata["sentOn"] = id;
                            
                            var cirDeg = (openrate/100)*360;
                            var circlass = '';
                            if(cirDeg > 179)
                            {
                                circlass = 'container p50plus small';
                            }
                            else
                                circlass = 'container small';
                            
                            html += '<div class="slds-grid slds-grid--align-spread slds-wrap">';
                            html += '<div class="grid-padding slds-p-around--small slds-col slds-size--2-of-12">';
                            html += '<div class="'+circlass+'" style="cursor:pointer;border: 4px solid #eeeeee;height: 47px;width: 45px;">';
                            html += '<span>'+openrate+'%</span>';
                            html += '<div class="slice">';
                            html += '<div class="bar" style="-webkit-transform: rotate('+cirDeg+'deg); -moz-transform: rotate('+cirDeg+'deg); -ms-transform: rotate('+cirDeg+'deg); -o-transform: rotate('+cirDeg+'deg); transform: rotate('+cirDeg+'deg); -ms-transform: rotate('+cirDeg+'deg);"></div>';
                            html += '<div class="fill"></div>';
                            html += '</div></div></div>';
                            html += '<div class="grid-padding slds-p-around--small slds-col slds-size--5-of-12">';
                            html += '<span style="cursor:pointer;" class="emailName" >'+name+'<span id="'+id+'" style="display:none;">{"id":"'+id+'","senton":"'+sentOn+'", "name":"'+name+'"}</span></span>';
                            html += '</div>';
                            html += '<div class="grid-padding slds-p-around--small slds-col slds-size--3-of-12">';
                            html += '<span style="color:#71843f!important;">'+sparkdata+'</span>';
                            html += '</div>';
                            html += '<div class="grid-padding slds-p-around--small slds-col slds-size--2-of-12">';
                            html += '<ul class="smaller-stat"><li title="Total unique email opens"><span class="totalopens">'+totalopens+'</span></li>';
                            html += '<li title="Total unique email clicks"><span class="totalclicks">'+totalclicks+'</span></li></ul>';
                            html += '</div></div>';
                        }
                        if(!nodata)
                            $(".lastemailcampaign-container").html(html);
                        else
                            $(".lastemailcampaign-container").html("<div class='slds-box'>Sorry! We could not find any data to show you.</div>");
                        $(".emailName").click(function(){
                            
                            var email = $.parseJSON($(this).find("span").html());
                            var src = install+"&clean#communicate/email/" + email.id + "/report";
                            
                            var selecthtml = '<option value="'+install+'&clean#communicate/email/'+ email.id +'/report">';
                            //selecthtml += '<span class="dropdown-icon"><span data-aura-rendered-by="341:348;a" class="slds-icon_container slds-icon-utility-metrics iconcolor" data-aura-rendered-by="30:431;a"><span data-aura-rendered-by="33:431;a" class="lightningPrimitiveIcon" data-aura-class="lightningPrimitiveIcon"><svg class="slds-icon slds-icon-text-default slds-icon--x-small" focusable="false" aria-hidden="true" data-key="metrics">';
                            //selecthtml += '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/_slds/icons/v7.31.0/utility-sprite/svg/symbols.svg#metrics"></use></span></span>';
                            selecthtml += '<span>Report</span></option>';
                            selecthtml += '<option value="'+install+'&clean#communicate/email/'+ email.id +'/message">';
                            selecthtml += '<span class="dropdown-icon"><span data-aura-rendered-by="341:348;a" class="slds-icon_container null slds-icon__svg--default"><svg class="slds-icon slds-icon-text-default" aria-hidden="true"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#comments"></use></svg></span></span>';
                            selecthtml += '<span>Message</span></option>';
                            selecthtml += '<option value="'+install+'&clean#communicate/email/'+ email.id + '/receipients">';
                            selecthtml += '<span class="dropdown-icon"><span data-aura-rendered-by="341:348;a" class="slds-icon_container null slds-icon__svg--default"><svg class="slds-icon slds-icon-text-default" aria-hidden="true"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#groups"></use></svg></span></span>';
                            selecthtml += '<span>Receipients</span></option>';
                            selecthtml += '<option value="'+install+'&clean#communicate/email/'+ email.id + '/interest">';
                            selecthtml += '<span class="dropdown-icon"><span data-aura-rendered-by="341:348;a" class="slds-icon_container null slds-icon__svg--default"><svg class="slds-icon slds-icon-text-default" aria-hidden="true"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#internal_share"></use></svg></span></span>';
                            selecthtml += '<span>Opened</span></option>';
                            selecthtml += '<option value="'+install+'&clean#communicate/email/'+ email.id + '/bounced">';
                            selecthtml += '<span class="dropdown-icon"><span data-aura-rendered-by="341:348;a" class="slds-icon_container null slds-icon__svg--default"><svg class="slds-icon slds-icon-text-default" aria-hidden="true"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#ban"></use></svg></span></span>';
                            selecthtml += '<span>Bounced</span></option>';
                            selecthtml += '<option value="'+install+'&clean#communicate/email/'+ email.id + '/links">';
                            selecthtml += '<span class="dropdown-icon"><span data-aura-rendered-by="341:348;a" class="slds-icon_container null slds-icon__svg--default"><svg class="slds-icon slds-icon-text-default" aria-hidden="true"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#new_window"></use></svg></span></span>';
                            selecthtml += '<span>Links</span></option>';
                            selecthtml += '<option value="'+install+'&clean#communicate/email/'+ email.id + '/unopened">';
                            selecthtml += '<span class="dropdown-icon"><span data-aura-rendered-by="341:348;a" class="slds-icon_container null slds-icon__svg--default" style="transform: scaleX(-1);"><svg class="slds-icon slds-icon-text-default" aria-hidden="true"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#internal_share"></use></svg></span></span>';
                            selecthtml += '<span>Unopened</span></option>';
                            selecthtml += '<option value="'+install+'&clean#communicate/email/'+ email.id + '/unsubscribed">';
                            selecthtml += '<span class="dropdown-icon"><span data-aura-rendered-by="341:348;a" class="slds-icon_container null slds-icon__svg--default"><svg class="slds-icon slds-icon-text-default" aria-hidden="true"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#error"></use></svg></span></span>';
                            selecthtml += '<span>Unsubscribed</span></option>';
                            
                            var title = "Send Email Report ("+email.name + ")";
                            helper.openModal(component,src,title,selecthtml);
                            
                        });
                    }}
                }
            }
        });
        action.setBackground();
        $A.enqueueAction(action);
	},
    openModal:function(component,src,title,selecthtml)
    {
     if(component.get("v.dependantwidget") != "oneapp")
     {
         modal = $(this.independentmodal);
         $(modal).find("#amp-select").hide();
         if(selecthtml !== '')
         {
             $(modal).find("#selectvalues").html(selecthtml);
             $(modal).find("#amp-select").show();
         }
     }
     else
     {
         $(this.ampdashboard).toggleClass("modal-open");
         $(this.ampdashboard).toggleClass("fullscreen");
         var modal = $(this.modal);
         $(modal).find("#amp-select").hide();
         if(selecthtml !== '')
         {
             $(modal).find("#selectvalues").html(selecthtml);
             $(modal).find("#amp-select").show();
         }         
     }
     $(modal).find("#modal-heading").html(title);
     $(modal).find("iframe").attr("src",src);
     $(modal).show(); 
    },
    getDetails:function(component,helper)
    {
        var action = component.get("c.GetPersonaThemeForCurrentUser");
        
        action.setCallback(this, function(response){ 
            
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var apigetState = JSON.parse(response.getReturnValue()).status;
                if(apigetState == 1){
                   
                     var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                    title : 'Processing...',
                    message: "Please wait while we're updating your profile.",
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'info',
                    mode: 'dismissible' 
                });
        		toastEvent.fire(); 
                }
                else{
                    var data = JSON.parse(response.getReturnValue());
                    var finalresponse=data.result.code;
                     var finalmessage=data.result.msg;
                    if(finalresponse==false)
                     {
                         var toastEvent = $A.get("e.force:showToast");
                             toastEvent.setParams({
                            title : 'Info Message',
                            message: finalmessage,
                            duration:' 5000',
                            key: 'info_alt',
                            type: 'info',
                            mode: 'dismissible' 
               		 		});
        				toastEvent.fire();
                     }
                    else{
                        
                        component.set("v.userid",data.result.userid.toString());
                        component.set("v.install",data.result.install);
                        component.set("v.mainnavbgcolor",data.result.pagecss.mainnavbgcolor);
                        component.set("v.mainnavfontcolor",data.result.pagecss.mainnavfontcolor);
                        helper.getLast5emailCampaign(component,helper);
                    }
                }
            }  
        });
        action.setBackground();
        $A.enqueueAction(action);
    },
    dynamicColorBinding:function(component,event,helper){
        document.documentElement.style.setProperty('--mainnavbgcolor', component.get("v.mainnavbgcolor"));
    }
})