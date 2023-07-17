({
    checkUserIntegrated:function(component,event,helper){
        var action = component.get("c.getMMAPIDetailsAvaiable");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var data = JSON.parse(response.getReturnValue());
                if(data)
                {
                    //$(".sendampemail").closest("html").addClass("dont_show_modal");
                    helper.bindcomponent(component, event, helper);	
                }
                else
                {
                    $(component.find('syncwithamp').getElement()).find('.Syncmessage').show();
                }
            }
        });
        $A.enqueueAction(action);
    },
    getSyncWithAMP:function(component, event, helper) {
        
        var el = component.find('syncwithamp');//.getElement();
        if(el == undefined){
            setTimeout(function(){
                helper.getSyncWithAMP(component, event, helper);
            },1000);
            return;
        }
        var $mmSendAmpEmail = $(".MindMatrixSendAMPEmail");
        $mmSendAmpEmail.closest('body').addClass('override-slds-container-sendampemail');
        /*setTimeout(function(){
            helper.getIconLeft(component,helper,$mmSendAmpEmail);
        },2000); */       
    },
    /*getIconLeft:function(component,helper,$mmSendAmpEmail){
        var el = component.find('syncwithamp').getElement();
        var left = el.offsetWidth+el.offsetLeft+4;
        if(isNaN(left)){
            setTimeout(function(){
                helper.getIconLeft(component,helper,$mmSendAmpEmail);
            },1000);
            return;
        }
        component.set('v.iconleft',left+'px');
        component.set('v.icondisplay','block');
        
    },*/
    bindcomponent : function(component, event, helper) {
        helper.getleadDetails(component, event, helper);
    },
    getleadDetails:function(component, event, helper)
    {
        
        var action = component.get("c.getleads");
        action.setParams({
            "leadId": component.get("v.recordId")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var lead = (response.getReturnValue())[0];
                //$A.get("e.force:closeQuickAction").fire();
                component.set("v.lead",lead);
                helper.getAmpSendEmailURL(component, event, helper);
            }
        });
        $A.enqueueAction(action);
    },
    getAmpSendEmailURL:function(component, event, helper)
    {        
        var action = component.get("c.getAMPRequestLeadURL");
        action.setParams({
            Lead:component.get("v.lead"),
            task:"sendemail"
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var data = JSON.parse(response.getReturnValue());
                var source = data.result.url+'&tpapp=sfdc';
             	helper.showCommunityAsset(component,'communityasset',source,helper);
             	
            }
        });
        $A.enqueueAction(action);  
    },
    setCookie:function(cname, cvalue) {
        document.cookie = cname + "=" + cvalue + ";path=/";
    },
    showCommunityAsset:function(component,container,source,helper)
    {	component.set('v.modalopen',true);
        $A.createComponent('c:AMPCommunityAsset', {subsource:source}, function (contentComponent, status, error) {
            if (status === "SUCCESS") {
                component.set('v.'+container, contentComponent);
            } else {
                throw new Error(error);
            }
        });    
        
    }
})