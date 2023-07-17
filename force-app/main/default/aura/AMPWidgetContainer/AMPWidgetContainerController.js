({
	doInit : function(component, event, helper) {
        
        if(!component.get('v.AlreadyAuthenticated'))
        {
            helper.AuthenticateCurrentUser(component, event, helper);
        }
        
        else{
            component.set('v.hideIcon',false);
            component.set('v.iframesrc',component.get('v.subsource'));
            helper.installUrl= component.get('v.subsource').split('?')[0].slice(0, -1);
            helper.helperProcessCmp(component,event,helper);
            //added for get company color
            helper.getDetails(component,event,helper);
        }
        if(component.get('v.iframeheight') != null || component.get('v.iframeheight') !=  undefined){
           helper.onLoadHeight = component.get('v.iframeheight');
            component.set('v.height',component.get('v.iframeheight')+'px');
        }
        
       //helper.AddCustomPluginjs(component,event,helper,helper.installUrl)
       helper.designInterval(component,event,helper);
	},
    toggleexpansion:function(component, event, helper){
        var alreadyexpanded = helper.SetIframeHeight(component, event, helper);
        component.set('v.enablePostMessage',alreadyexpanded);
        component.set('v.maindivclass',alreadyexpanded ? "notexpanded" : "expanded");
        component.set('v.iconclass',alreadyexpanded ? "notexpandedicon" : "expandedicon");
        component.set('v.backdropvisibility',alreadyexpanded ? "hide" : "show");
        if(alreadyexpanded){
            window.postMessage('sfiFrameMinimize');
        }else{
            $('html').addClass('mmdashboard');
        }
        
    },
    Redirectnew_window: function (component, event, helper) {
        var newUrl = $A.get("e.force:navigateToURL");
                        newUrl.setParams({
                            "url": helper.url
                        });
                        newUrl.fire();
    },
    modalclose : function(component, event, helper) {
        var cmpTarget = component.find('modalopen');
        var cmpBack = component.find('backdropopen');
        $A.util.removeClass(cmpTarget, 'slds-fade-in-open');
        $A.util.removeClass(cmpBack, 'slds-backdrop--open');
    },
    
})