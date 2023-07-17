({
	//bind quicklinkwidget
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
                    component.set("v.install",data.result.installurl);
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
                            helper.UpdateToken(component,helper,data.result.usertoken,data.result.newuser);
                            if(!data.result.newuser){
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
            helper.bindPage(component,helper);
        else
            helper.getQuickLinkDetails(component,helper); 
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
    bindPage:function(component,helper)
    {
        this.callApi(component,helper);
    },
    //api to get data of quicklinkwidget
    callApi:function(component,helper) {
        var design = component.get('v.quicklinkdesign').toString();
        var mainnavbgcolor = component.get("v.mainnavbgcolor");
        var mainnavfontcolor = component.get("v.mainnavfontcolor");
        var install = component.get("v.install") + '//?elt=' + helper.sessionID;
        var jo = {"dependantwidget":component.get("v.dependantwidget"), "userid":component.get("v.userid"),"mainnavbgcolor":mainnavbgcolor,"mainnavfontcolor":mainnavfontcolor,"install":install};
        if(design == '1')
            helper.createComponent(component,"quicklinkwidgetdesign1","design",jo);
        else
            helper.createComponent(component,"quicklinkwidgetdesign2","design",jo);
        
        return;
        
        var action = component.get("c.getQuicklinkDesign");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data = JSON.parse(response.getReturnValue());
                var design = parseInt(data.result.savedDesign);
                var mainnavbgcolor = component.get("v.mainnavbgcolor");
                var mainnavfontcolor = component.get("v.mainnavfontcolor");
                var install = component.get("v.install");
                var jo = {"quicklinkdesign":component.get("v.quicklinkdesign"), "dependantwidget":component.get("v.dependantwidget"), "userid":component.get("v.userid"),"mainnavbgcolor":mainnavbgcolor,"mainnavfontcolor":mainnavfontcolor,"install":install};
                if(design == 1)
                    helper.createComponent(component,"AMPQuickLinkWidgetDesign1","design",jo);
                else
                    helper.createComponent(component,"AMPQuickLinkWidgetDesign1","design",jo);
            }
        });
        action.setBackground();
        $A.enqueueAction(action);
    },
    //create quicklinkwidget component
	createComponent : function(component,type,auraattr,jo) {
       $A.createComponent('MindMatrix:'+type,jo , function (contentComponent, status, error) {
            if (status === "SUCCESS") {
                component.set('v.'+auraattr, contentComponent);
            } else {
                throw new Error(error);
            }
        });
	},
    getQuickLinkDetails:function(component,helper)
    {
        var action = component.get("c.GetPersonaThemeForCurrentUser");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
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
                        
                        var result = data.result;
                        var pagecss = result.pagecss;
                        var design = parseInt(result.pagedata.savedDesign);
                        var language = result.pagedata.userLanguage;
                        var install = result.install + '//?elt=' + helper.sessionID;
                        var designtype = 'AMPQuickLinkWidgetDesign2';
                        if(design == 1)
                            designtype = 'AMPQuickLinkWidgetDesign1';
                        component.set("v.userid",result.userid.toString());
                        var userid = component.get("v.userid");
                        var jo = {language:language, "dependantwidget":component.get("v.dependantwidget"), "userid":userid,"mainnavbgcolor":pagecss.mainnavbgcolor,"mainnavfontcolor":pagecss.mainnavfontcolor,"install":install};
                        helper.createComponent(component,designtype,"design",jo);
                    }
                }
            }
        });
        action.setBackground();
        $A.enqueueAction(action);
    },
     
})