({
    checkUserIntegrated:function(component,event,helper){
        var action = component.get("c.getUserIntegrated");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var data = JSON.parse(response.getReturnValue());
                if(data.result.userfound)
                {
                    $(".manageampsale").show();
                    $(".dripcampaignurl").closest("html").addClass("dont_show_modal");
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
            task:"managesalesmaterials"
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var data = JSON.parse(response.getReturnValue());
                component.set("v.playbookurl",data.result.url.playbook);
                component.set("v.printurl",data.result.url.print);
                component.set("v.ebookurl",data.result.url.ebook);
                component.set("v.weburl",data.result.url.web);
             	var isCommunity = document.location.pathname.indexOf("one.app") >= -1?false: true;
             	helper.setCookie("showplaybook", false);
             	window.name = '{"btnname":"Manage AMP Sales Materials","isQuickaction":"true","playbookurl":"'+data.result.url.playbook+'","printurl":"'+data.result.url.print+'","ebookurl":"'+data.result.url.ebook+'","weburl":"'+data.result.url.web+'","tabname":"createlead"}';
                var urlEvent = $A.get("e.force:navigateToURL");
                urlEvent.setParams({
                    "url": isCommunity?"/enablement":"/one/one.app#/n/MindMatrix__Enablement"
                });
             	urlEvent.fire();
            	//$("#iframe-modal").attr("src",data.result.url);
            }
        });
        $A.enqueueAction(action);
    },
    setCookie:function(cname, cvalue) {
        document.cookie = cname + "=" + cvalue + ";path=/";
    }
})