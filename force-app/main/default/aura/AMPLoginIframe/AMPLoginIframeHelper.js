({
	AuthenticateCurrentUser:function(component, event, helper){
        var action = component.get("c.AuthenticateSFUser");
        action.setParams({
           "createuserviasso": true
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data = JSON.parse(response.getReturnValue());
                if(data.result.authentic)
                {
                    component.set("v.iframesrc",data.result.autologinurl);
                }
               /* else{
                    helper.createAuthorizedComponent(component);
                }*/
            }
        });
        $A.enqueueAction(action);
    },
    createAuthorizedComponent : function(component)
    {
    	return;
        $A.createComponent('c:AMPAuthorized',{} , function (contentComponent, status, error) {
            if (status === "SUCCESS") {
                component.set('v.unauthorized', contentComponent);
            } else {
                throw new Error(error);
            }
        });
	}
})