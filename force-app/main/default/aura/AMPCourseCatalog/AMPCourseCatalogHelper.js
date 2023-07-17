({
    sessionId:'',
    installUrl:'',
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
                    title : 'Error Message',
                    message: "An issue occured with the Mindmatrix widget, please contact admin",
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'error',
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
                        if(data.result.authentic)
                        {
                            helper.sessionId=data.result.usersessionid;
                            helper.installUrl=data.result.installurl;
                            helper.UpdateToken(component,helper,data.result.usertoken,data.result.newuser);
                            if(!data.result.newuser){
                                helper.processcmp(component,helper);
                            }
                            
                            //helper.GetInstallName(component,event,helper);
                        }
                        /*else{
                            helper.createAuthorizedComponent(component);
                        }*/
                    }                      
                  }                     
               
                
            }
        });
        $A.enqueueAction(action);
    },
    processcmp:function(component,helper){
        var $reportPage = $("#reportspage");
        component.set("v.classtohide","show");
        $reportPage.closest("html").addClass("mmdashboard");   
        //var url = data.result.autologinurl + "?returnurl=/?clean#linearplaybook/coursecatalog";
        var url = helper.installUrl + "/?elt=" + helper.sessionId + "&clean#linearplaybook/coursecatalog";
        component.set("v.iframesrc",url);
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
	GetInstallName : function(component,event,helper) {
        var action = component.get("c.GetInstallName");
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var data = response.getReturnValue();
             	if(data != '')
                {
                    var url = data + "/?clean#linearplaybook/coursecatalog";
                    component.set("v.iframesrc",url);
                }
            }
        });
        $A.enqueueAction(action);
	}
})