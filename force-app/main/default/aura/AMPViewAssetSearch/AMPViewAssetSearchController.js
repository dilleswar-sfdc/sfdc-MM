({
	scriptLoaded : function(component, event, helper) {
        helper.GetUserDetails(component, event, helper);
    },
    saveapidetails:function(component, event, helper)
    {
        var installurlvalue = '';
        var tokenvalue = '';
        
        var installurl = component.find('fieldinstallurl');
        if(!installurl.get("v.validity").valid)
        	return false;
        else
            installurlvalue = installurl.get("v.value");
        var tokenvar = component.find('fieldtoken');
        if(!tokenvar.get("v.validity").valid)
        	return false;
        else
            tokenvalue = tokenvar.get("v.value");
        
        component.set("v.installurl",installurlvalue);
        component.set("v.token",tokenvalue);

		var jo = {installurl:installurlvalue,token:tokenvalue};
        helper.UpdateAPIDetails(component,event,helper,jo);
    },
    hideapidetails: function (component, event) {
    	$('.apidetails').hide();
    },
    redirect:function(component,event,helper)
    {
        var isCommunity = document.location.pathname.indexOf("one.app") > -1?false: true;
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/one/one.app#/n/MindMatrix__MM_API_Settings"
        });
        urlEvent.fire();
        $A.get("e.force:closeQuickAction").fire()
    }
})