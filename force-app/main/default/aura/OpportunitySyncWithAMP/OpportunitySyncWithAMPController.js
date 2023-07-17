({
	scriptLoaded : function(component, event, helper) {
        helper.checkUserIntegrated(component, event, helper);                                 
	},
    clickok:function(component,event,helper)
    {
        window.location.reload();
    },
    redirect:function(component,event,helper)
    {
        var isCommunity = document.location.pathname.indexOf("one.app") > -1?false: true;
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/one/one.app#/n/MindMatrix__MM_Settings"
        });
        urlEvent.fire();
        $A.get("e.force:closeQuickAction").fire()
    },
    submit:function(component,event,helper)
    {
        $A.get("e.force:closeQuickAction").fire()
    },
})