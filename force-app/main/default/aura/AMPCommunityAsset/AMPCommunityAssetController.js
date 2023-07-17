({
	doInit : function(component, event, helper) {
        var height = window.innerHeight - 127;
        component.set("v.height",height);
      	helper.AuthenticateCurrentUser(component, event, helper);
       
        helper.designinterval(component,event,helper);
	},
    toggleexpansion:function(component, event, helper){
        var alreadyexpanded = helper.SetIframeHeight(component, event, helper);
        component.set('v.maindivclass',alreadyexpanded ? "notexpanded" : "expanded");
        component.set('v.iconclass',alreadyexpanded ? "notexpandedicon" : "expandedicon");
        component.set('v.backdropvisibility',alreadyexpanded ? "hide" : "show");
        
    },
    
})