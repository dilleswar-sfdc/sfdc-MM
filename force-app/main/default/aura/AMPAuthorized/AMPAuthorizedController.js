({
    doInit : function(component, event, helper) {
        component.set("v.displaypopup","none");
        helper.GetUserDetails(component, event, helper);
    },
	CreateUser : function(component, event, helper) {
        component.set("v.showspinner","block");
        var apiDetails = component.get("v.allapidetails");
        var userJOStr = apiDetails.MindMatrix__GroupJSON__c;
        var userJO = JSON.parse(userJOStr);
        var superadmin = userJO.superadmin;
        var user = component.get("v.userdetails");
        var profileId = user.ProfileId;
        var group = "Sales";
        if(superadmin.indexOf(profileId) > -1)
            group = "Super Admin";
        helper.GetAutoLoginURL(component,event,helper,user.Id,group);
		//helper.GetUserDetails(component, event, helper);
	},
    modalclose : function(component, event, helper) {
        component.set("v.displaypopup","none");
    }
})