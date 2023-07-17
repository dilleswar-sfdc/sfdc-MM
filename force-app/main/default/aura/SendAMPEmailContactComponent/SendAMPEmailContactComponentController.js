({
	scriptLoaded : function(component, event, helper) {
        helper.checkUserIntegrated(component, event, helper);
        helper.getSyncWithAMP(component, event, helper);
       	
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
    /*modalclose :function(component,event,helper){
        $(".MindMatrixSendAMPEmail").closest('body').removeClass('override-slds-container-sendampemail');
        $A.get("e.force:closeQuickAction").fire();
        window.postMessage('sfiFrameMinimize');
    }*/
})