({
    useremail:'',
    sessionID:'',
    autologin:'',
    limit:0,
    AuthenticateCurrentUser:function(component, event, helper){
        var action = component.get("c.AuthenticateSFUser");
        action.setParams({
           "createuserviasso": component.get("v.createuserviasso")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data = JSON.parse(response.getReturnValue());
                if(data.result.userfound == true){
                    if(data.result.tos == false){
                        component.set('v.isOpen',true);
                        var url = data.result.installurl + "/?elt=" + data.result.usersessionid + "&returnurl=toschangepasswordsetting";
                        component.set("v.iframesrc",url);
                    }
                }
                var statusData=data.status;
                if(statusData==1)
                {   
                    component.set("v.nodata",true);
                    component.set("v.errorMsg","Please wait while we're updating your profile.");
                    component.set("v.isSpinner",false);
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title : 'Processing...',
                        message: "Please wait while we're updating your profile.",
                        duration:' 5000',
                        key: 'info_alt',
                        type: 'Info',
                        mode: 'dismissible' 
                    });
                    toastEvent.fire();
                    
                }
                else
                {
                var data = JSON.parse(response.getReturnValue()).result;
                var finalresponse=data.code;
                var finalmessage=data.msg;
                if(finalresponse==false)
                {
                    component.set("v.nodata",true);
                    component.set("v.errorMsg","Sorry!"+" "+finalmessage);
                    component.set("v.isSpinner",false);
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
                else
                {
                if(data.authentic)
                {
                    helper.sessionID = data.usersessionid;
                    helper.autologin =data.autologinurl;
                    helper.UpdateToken(component,helper,data.usertoken,data.newuser);
                    $(helper.interactive).show();
                    if(!data.newuser){
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
        if(component.get("v.dependantwidget")== "oneapp" ){
            helper.getInteractiveBanner(component, event, helper);
        }
        else
            helper.getDetailsWithInteractiveBanner(component, event, helper);
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
    getInteractiveBanner : function(component, event, helper) {
        var action = component.get("c.getInteractiveBanner");
        var userid = component.get("v.userid");
        var install = component.get("v.install");
        action.setParams({"userid":userid,"personaoption":"3"});
        
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var statusData=JSON.parse(response.getReturnValue()).status;
                if(statusData==1)
                {
                    component.set("v.isSpinner",false);
                    component.set("v.nodata",true);
                    component.set("v.errorMsg","An issue occured with the Mindmatrix widget, please contact admin");
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
                else
                {
                   
                   var data = JSON.parse(response.getReturnValue());
                    var finalresponse=data.result.code;
                    var finalmessage=data.result.msg;
                        
                    if(finalresponse==false)
                    {
                        component.set("v.isSpinner",false);
                        component.set("v.nodata",true);
                        component.set("v.errorMsg","Sorry!"+" "+finalmessage);
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
                    else
                    {
                    if(data.result.src == undefined && data.result.brandbannerurl != "")
                    {
                        //place the iamge url
                        if(data.result.enableWidget == false){
                            component.set("v.isSpinner",false);
                            $(helper.interactive).hide();
                            
                        }else{
                            component.set("v.isSpinner",false);
                            var url = data.result.brandbannerurl;
                            if(data.result.brandbannerurl.indexOf(component.get("v.install")) == -1)
                                url = component.get("v.install") + '/' + url;
                            $(helper.interactive).css("background-image","url('"+url+"')"); 
                            if(data.result.brandbannerheight != "")
                            {
                                $(helper.interactive).css("height",(parseInt(data.result.brandbannerheight))+"px");
                            }
                            if(data.result.headerText != undefined && data.result.headerText != "")
                                component.set("v.headertext",data.result.headerText);
                            $(helper.interactive).show();
                            
                        }
                    }
                    else{
                         if(data.result.enableWidget == false){
                             component.set("v.isSpinner",false);
                            $(helper.interactive).hide();
                         }
                        else{
                             var webbannerID = data.result.webBannerID;
                             if(webbannerID >0){
                                 component.set("v.isSpinner",false);
                                 setTimeout(function(){
                                     var _src = data.result.src;
                                     var install = component.get("v.install");
                                     var height = data.result.maxheight;
                                     var frame = $('.enablementiframe');
                                     var src=component.get("v.install")+"/?elt="+helper.sessionID +"&returnurl="+_src;
                                     component.set("v.enablementiframe",src);
                                     $(frame).show();
                                     $(frame).css("height",height+"px");
                                     $(helper.interactive).hide();
                                 },100);
                             }
                             else{
                                 component.set("v.isSpinner",false);
                                 $(helper.interactive).attr("src",component.get("v.install")+"/v4u/img/persona/webbanner/channelpartner-Option_C.png");
                                 $(helper.interactive).show();
                             }
                         }
                    }
                    }
                }
            }  
        });
        action.setBackground();
        $A.enqueueAction(action);
        
    },
    getDetailsWithInteractiveBanner:function(component, event, helper)
    {
        helper.callPersonaTheme(component, event, helper);
    },
    callPersonaTheme:function(component, event, helper)
    {
        var action = component.get("c.GetPersonaThemeForCurrentUser");
        action.setCallback(this, function(response){ 
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var statusData=JSON.parse(response.getReturnValue()).status;
                if(statusData==1)
                {
                    component.set("v.isSpinner",false);
                    component.set("v.nodata",true);
                    component.set("v.errorMsg","Please wait while we're updating your profile.");
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
                else
                {
                    var data = JSON.parse(response.getReturnValue());
                    var finalresponse=data.result.code;
                    var finalmessage=data.result.msg;
                        
                    if(finalresponse==false)
                    {
                        component.set("v.isSpinner",false);
                        component.set("v.nodata",true);
                        component.set("v.errorMsg","Sorry!"+finalmessage);
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
                    else
                    {
                    component.set("v.userid",data.result.userid.toString());
                    component.set("v.install",data.result.install);
                    helper.useremail = data.result.useremail;
                    var persona = data.result.pagedata.persona;
                    var personaOption = data.result.pagedata.personaOption;
                    helper.setColor(component,persona);
                    helper.getInteractiveBanner(component, event, helper);
                	}
               }
            }  
        });
        action.setBackground();
        $A.enqueueAction(action);
    },
    setColor:function(component,persona){
        var color = '#FFF';
        if(persona == "sales")
            color = '#F69521';
        component.set("v.fontcolor",color);
    },
})