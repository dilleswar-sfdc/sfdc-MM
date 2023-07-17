({
    GetUserDetails:function(component,event,helper)
    {
        var action = component.get("c.GetUserDetails");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var data = response.getReturnValue();
                if(data != null){
                    component.set("v.userdetails",data);
                    helper.checkAPIDetails(component, event, helper);
                }
            }
        });
        $A.enqueueAction(action);
        
    },
    checkAPIDetails:function(component,event,helper)
    {
        var action = component.get("c.getAPIDetails");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var data = response.getReturnValue();
                var installurl = '';
                var token = '';
                var userJOStr = '';
                var message = '';
                var popupsettings = '';
                if(data != null){
                    installurl = data.MindMatrix__InstallUrl__c;
                    token = data.MindMatrix__Token__c;
                    userJOStr = data.MindMatrix__GroupJSON__c;
                    message = data.MindMatrix__SSOPopupMessage__c;
                    popupsettings = data.MindMatrix__SSOPopupSettings__c;
                }
                component.set("v.installurl",installurl);
                component.set("v.token",token);
                if(userJOStr == "" || typeof(userJOStr) == "undefined" || installurl == "" || typeof(installurl) == "undefined" || typeof(token)=="undefined"|| token == "")
                {
                    component.set("v.createusertitle","MM API Settings is not available");
                    component.set("v.createusermessage","Go to MM API Settings and update the details, then come back and refresh");
                    //component.set("v.displaypopup","none");
                    component.set("v.displaybutton","none");
                    component.set("v.showspinner","none");
                }
                else{
                    if(message && message != "" && message != undefined && message != null)
                        component.set("v.createusermessage",message);
                    if(popupsettings && popupsettings != "" && popupsettings != undefined && popupsettings != null)
                    {
                        try{
                            var popupJo = JSON.parse(popupsettings);
                            var title = popupJo.title;
                            var btntxt = popupJo.btntxt;
                            var brclr = popupJo.brclr;
                            var txtclr = popupJo.txtclr;
                            var btnbgclr = popupJo.btnbgclr;
                            var btnbrclr = popupJo.btnbrclr;
                            var btntxtclr = popupJo.btntxtclr;
                            if(title && title != "" && title != undefined && title != null)
                                component.set("v.createusertitle",title);
                            if(btntxt && btntxt != "" && btntxt != undefined && btntxt != null)
                                component.set("v.createuserbuttontext",btntxt);
                            if(brclr && brclr != "" && brclr != undefined && brclr != null)
                                component.set("v.createuserbordercolor",brclr);
                            if(txtclr && txtclr != "" && txtclr != undefined && txtclr != null)
                                component.set("v.createusertextcolor",txtclr);
                            if(btnbgclr && btnbgclr != "" && btnbgclr != undefined && btnbgclr != null)
                                component.set("v.createuserbuttonbackgroundcolor",btnbgclr);
                            if(btnbrclr && btnbrclr != "" && btnbrclr != undefined && btnbrclr != null)
                                component.set("v.createuserbuttonbordercolor",btnbrclr);
                            if(btntxtclr && btntxtclr != "" && btntxtclr != undefined && btntxtclr != null)
                                component.set("v.createuserbuttontextcolor",btntxtclr);
                            helper.dynamicColorBinding(component,event,helper);
                        }
                        catch(e){}
                    }
                    component.set("v.allapidetails",data);
                    $A.enqueueAction(component.get('c.CreateUser'))
                }
            }
        });
        $A.enqueueAction(action);
    },
    UpdateAPIDetails:function(component,event,helper,jo){
        var action = component.get("c.UpdateAPIDetails");
        action.setParams(jo);
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var data = response.getReturnValue();
                if(data){
                    helper.GetAutoLoginURL(component,event,helper);
                }
            }
        });
        $A.enqueueAction(action);
    },
    GetAutoLoginURL:function(component,event,helper,crmId,groupName){
        var action = component.get("c.GetAMPAutoLoginURL");
        var jo = {crmId:crmId,groupName:groupName};
        action.setParams(jo);
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS")
            {
             var apigetState = JSON.parse(response.getReturnValue()).status;
                if(apigetState == 1){
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                    title : 'Error Message',
                    message: "An issue occured with the Mindmatrix widget, please contact admin",
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'error',
                    mode: 'dismissible' 
                });
        		toastEvent.fire();
                }else{
             		var data = JSON.parse(response.getReturnValue());
                
                     var finalresponse=data.result.code;
                     var finalmessage=data.result.msg;
                    if(finalresponse==false)
                     {
                         var toastEvent = $A.get("e.force:showToast");
                             toastEvent.setParams({
                            title : 'Error',
                            message: finalmessage,
                            duration:' 5000',
                            key: 'info_alt',
                            type: 'error',
                            mode: 'dismissible' 
               		 		});
        				toastEvent.fire();
                     }
                    else{
                        var dataError = response.getReturnValue();
                        if(dataError.indexOf("error") > -1 && dataError.indexOf("Remote site settings") > -1)
                        {
                            component.set("v.createusertitle","Remote site settings!!!");
                            component.set("v.createusermessage","Go to Remote site settings and add the install url, then come back and refresh");
                            //component.set("v.displaypopup","none");
                            component.set("v.displaybutton","none");
                            component.set("v.showspinner","none");
                        }
                        else
                        {
                            var userInfo = data;
                            if(userInfo.result)
                            {
                                if(apigetState != 0)
                                {
                                    component.set("v.createusertitle","Some error occured");
                                    component.set("v.createusermessage",userInfo.result.message);
                                    //component.set("v.displaypopup","none");
                                    component.set("v.showspinner","none");
                                    component.set("v.displaybutton","none");
                                    component.set("v.displaypopup","block");
                                    
                                }
                                else if(apigetState == 0 && userInfo.result.userfound)
                                {
                                    helper.UpdateUserToken(component,event,helper,userInfo.result.usertoken);
                                }
                                
                            }
                            
                        }
                        $('.spinner-div').hide();
                        var cmpEvent = component.getEvent("authorizedEvent");
            		cmpEvent.fire(); 
                	}
                }
            }
        });
        $A.enqueueAction(action);
    },
    UpdateUserToken:function(component,event,helper,usertoken){
        var action = component.get("c.UpdateSettingsForCurrentUser");
        var jo = {usertoken:usertoken};
        action.setParams(jo);
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var data = response.getReturnValue();
                location.reload();
            }
        });
        $A.enqueueAction(action);
    },
    dynamicColorBinding : function(component,event,helper){
        document.documentElement.style.setProperty('--createuserbordercolor', component.get("v.createuserbordercolor"));
        document.documentElement.style.setProperty('--createusertextcolor', component.get("v.createusertextcolor"));
        document.documentElement.style.setProperty('--createuserbuttonbackgroundcolor', component.get("v.createuserbuttonbackgroundcolor"));
        document.documentElement.style.setProperty('--createuserbuttontextcolor', component.get("v.createuserbuttontextcolor"));
        document.documentElement.style.setProperty('--createuserbuttonbordercolor', component.get("v.createuserbuttonbordercolor"));
       	
	},
})