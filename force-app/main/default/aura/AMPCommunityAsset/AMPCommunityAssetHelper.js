({
    sessionId:'',
    installUrl:'',
    HEIGHTMINUSWHENSMALL:50,
    HEIGHTMINUSWHENBIG:34,
    DOTSINTERVAL:null,
    NOOFDOTS:3,
    DECREASING:true,
    SetIframeHeight:function(component, event, helper){
      
    },
     AddCustomPlugin:function(component,event,helper,installUrl){
    	var clientDetails = component.get("v.ClientName");
        if(clientDetails == undefined || clientDetails == '')
            return;
         
        if(!helper.IsJSON(clientDetails))
            return;
        
        var jo = JSON.parse(clientDetails);
        var name = jo.name;
        var client = _MMCLIENTS[name];
        if(client == undefined)
            return;
        
        var details = jo.details;
        details.installurl = installUrl;
        client.init(details);
        
	},
    IsJSON:function(jo){
        try{
            JSON.parse(jo);
            return true;
        }
        catch(e){
            return false;
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
                            helper.AddCustomPlugin(component, event, helper,helper.installUrl);
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
        
        var subSource = "search?text=";
        if(component.get("v.subsource") !="")
            subSource = component.get("v.subsource");
        if(component.get('v.addCleanUrl'))
        		var url = helper.installUrl + '/?elt='+helper.sessionId + '&clean#' + subSource;
            else
             	var url = helper.installUrl + '/?elt='+helper.sessionId + '#' + subSource;
        component.set("v.iframesrc",url);
        helper.helperProcessCmp(component,event,helper);
        
    },
    helperProcessCmp:function(component,event,helper){
        helper.getDetails(component,event,helper);
        var $reportPage = $("#viewassetpage");
        component.set("v.classtohide","show");
       	//$reportPage.closest("html").addClass("mmdashboard");
       	$reportPage.closest("html").removeClass("mmdashboard")
        setTimeout(function(){
            component.set('v.messagevisibility',"hide");
            clearInterval(helper.DOTSINTERVAL);
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
    designinterval : function(component,event,helper){
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