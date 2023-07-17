({
    sessionId:'',
    installUrl:'',
    HEIGHTMINUSWHENSMALL:50,
    HEIGHTMINUSWHENBIG:34,
    DOTSINTERVAL:null,
    NOOFDOTS:3,
    DECREASING:true,
    onLoadHeight:'',
    url:'',
    SetIframeHeight:function(component, event, helper){
       var alreadyexpanded = component.get('v.maindivclass') == "expanded";
        var heightprovided = alreadyexpanded ? component.get('v.iframeheight').replace('px','') : window.innerHeight;
        var height = (heightprovided == '' ? window.innerHeight : heightprovided) - (alreadyexpanded ? helper.HEIGHTMINUSWHENSMALL : helper.HEIGHTMINUSWHENBIG);
      
        return alreadyexpanded;
    },
     helpertoggleexpansion:function(component, event, helper){
        
        var alreadyexpanded = helper.SetIframeHeight(component, event, helper);
        component.set('v.maindivclass',alreadyexpanded ? "notexpanded" : "expanded");
        component.set('v.iconclass',alreadyexpanded ? "notexpandedicon" : "expandedicon");
        component.set('v.backdropvisibility',alreadyexpanded ? "hide" : "show");
        
    },
    changeClasss : function(component, event, helper,_class){
        component.set('v.maindivclass',_class);
        component.set('v.iconclass',_class+'icon');
        var alreadyexpanded = _class == 'notexpanded';
        component.set('v.backdropvisibility',alreadyexpanded ? "hide" : "show");
    },
    AddCustomPluginjs:function(component,event,helper,installUrl){
        
        var jo = {};
        jo["installUrl"]=installUrl;
        jo["component"]=component;
        jo["event"]=event;
        jo["helper"]=helper;
        var client = _PostMessage.listenGenericPM(jo);
        var customFN = component.get('v.CustomFunction');
        if(customFN != ''){
            customFN(jo);
        }
    },
    
    AuthenticateCurrentUser:function(component, event, helper){
        var action = component.get("c.AuthenticateSFUser");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var getapiState=JSON.parse(response.getReturnValue()).status;
                if(getapiState==1)
                {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                    title : 'Processing...',
                    message: "Please wait while we're updating your profile. This page may refresh after that.",
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'success',
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
                       /*  var toastEvent = $A.get("e.force:showToast");
                         toastEvent.setParams({
                             title : 'Error',
                             message: finalmessage,
                             duration:' 5000',
                             key: 'info_alt',
                             type: 'error',
                             mode: 'dismissible' 
                         });
        				    toastEvent.fire();*/
                     }
                    else{
                        if(data.result.authentic)
                        { 
                            helper.sessionId=data.result.usersessionid;
                            helper.installUrl=data.result.installurl;
                            helper.UpdateToken(component,event,helper,data.result.usertoken,data.result.newuser);
                            if(!data.result.newuser){
                                helper.processcmp(component,event,helper);
                            }
                         
                        }
                     
                    } 
                }
                
            }
        });
        $A.enqueueAction(action);
    },
    processcmp:function(component,event,helper){
        helper.getDetails(component,event,helper);
        var subSource = "dashboard";
        if(component.get("v.subsource") !="")
            subSource = component.get("v.subsource");
        //var cleanSource = subSource.indexOf('issendpostmessage=true') > -1 ? '&issendpostmessage=true&clean#' : '&clean#';
        if(component.get('v.EnablePMtoExpand')){
            if(component.get('v.addCleanUrl'))
            	helper.url = helper.installUrl + '/?elt='+helper.sessionId + '&issendpostmessage=true&clean#' + subSource;
            else
                helper.url = helper.installUrl + '/?elt='+helper.sessionId + '&issendpostmessage=true#' + subSource;
        }else{
            if(component.get('v.addCleanUrl'))
        		helper.url = helper.installUrl + '/?elt='+helper.sessionId + '&clean#' + subSource;
            else
             	helper.url = helper.installUrl + '/?elt='+helper.sessionId + '#' + subSource;  
        }
        if(component.get('v.openTabInNewWindow')){
            			component.set("v.messagePrint",'This Page has been redirected to new page.');
                        var urlEvent = $A.get("e.force:navigateToURL");
                        urlEvent.setParams({
                            "url": helper.url
                        });
                        urlEvent.fire();
        }else{
            component.set("v.iframesrc",helper.url);  
            if(component.get('v.defaultAutoExpand')){
                component.set('v.maindivclass',"expanded");
                component.set('v.iconclass',"expandedicon");
                $('html').addClass('mmdashboard');
                component.set('v.enablePostMessage',false);
                setTimeout(function(){
           			component.set('v.backdropvisibility',"show");
        		},6000);
            	
            }
        }
        helper.helperProcessCmp(component,event,helper);
    },
    helperProcessCmp:function(component,event,helper){
        helper.AddCustomPluginjs(component,event,helper,helper.installUrl)
        var $reportPage = $("#viewassetpage");
        component.set("v.classtohide","show");
        //if(!component.get('v.AlreadyAuthenticated'))
        	//$reportPage.closest("html").addClass("mmdashboard");
        setTimeout(function(){
            component.set('v.messagevisibility',"hide");
            clearInterval(helper.DOTSINTERVAL);
            helper.SetIframeHeight(component, event, helper);
            helper.triggerDefaultExpansion(component, event, helper);
        },1000);
    },
    UpdateToken:function(component,event,helper,token,newuser){
        var action = component.get("c.UpdateToken");
        action.setParams({
            "token": token
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                if(newuser){
                    helper.processcmp(component,event,helper);
                } 
            }
        });
        $A.enqueueAction(action);
    },
    triggerDefaultExpansion : function(component,event,helper) {
        if(component.get('v.defaultexpandattr'))
        {
         	component.set("v.backdropvisibility","show");
            component.set("v.messagevisibility","hide");
            component.set("v.maindivclass","expanded");
            component.set("v.iconclass","expandedicon");
        }
        
    },
	GetInstallName : function(component,event,helper) {
        var action = component.get("c.GetInstallName");
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var data = response.getReturnValue();
             	if(data != '')
                {
                    var url = data + "/?clean#search?text=";
                    component.set("v.iframesrc",url);
                }
            }
        });
        $A.enqueueAction(action);
	},
     getDetails:function(component,event,helper)
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
                    message: "Please wait while we're updating your profile. This page may refresh after that.",
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
                      
                        component.set("v.mainnavbgcolor",data.result.pagecss.mainnavbgcolor);
                        component.set("v.mainnavfontcolor",data.result.pagecss.mainnavfontcolor);
                        component.set("v.subnavbgcolor",data.result.pagecss.subnavbgcolor);
                        helper.dynamicColorBinding(component,event,helper);

                    }
                }
            }  
        });
        action.setBackground();
        $A.enqueueAction(action);
    },
    dynamicColorBinding:function(component,event,helper){
        document.documentElement.style.setProperty('--mainnavbgcolor', component.get("v.mainnavbgcolor"));
      
    },
    designInterval : function(component,event,helper){
        helper.DOTSINTERVAL = setInterval(function(){
            if(helper.NOOFDOTS == 3)
                helper.DECREASING = true;
            if(helper.NOOFDOTS == 0)
                helper.DECREASING = false;
            if(helper.DECREASING)
                --helper.NOOFDOTS;
            else
                ++helper.NOOFDOTS;
            var str = "Please wait"
            for(var i=0;i<=helper.NOOFDOTS-1;i++)
            	str += '.';
            
            component.set('v.messagetext',str);
                
        },500);
    }
})