({
	doInit : function(component, event, helper) {
        var height = window.innerHeight - 127;
        component.set("v.height",height);
        helper.AuthenticateCurrentUser(component, event, helper);
	}
})