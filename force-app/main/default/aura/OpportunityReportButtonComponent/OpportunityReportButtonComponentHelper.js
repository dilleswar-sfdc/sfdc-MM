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
                    $(".sendampemail").closest("html").addClass("dont_show_modal");
					helper.bindcomponent(component, event, helper);
                }
                else
                {
                    component.set("v.IsSpinner",false);
                    $(component.find("syncwithamp").getElement()).find('.mmReportLink').show();
                    $(component.find('syncwithamp').getElement()).find('.Syncmessage').html("MM Settings is not available.").show();
                    $(component.find("close").getElement()).show();
                }
            }
        });
        $A.enqueueAction(action);
    },
    bindcomponent : function(component, event, helper) {
        helper.getopportunityDetails(component, event, helper);
    },
    getopportunityDetails:function(component, event, helper)
    {
        var action = component.get("c.getopportunityrecord");
        action.setParams({
            "recordid": component.get("v.recordId")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var opportunity = (response.getReturnValue());
                component.set("v.opportunity",opportunity);
                helper.getOpportunityReport(component, event, helper);
            }
        });
        action.setBackground();
        $A.enqueueAction(action);
    },
    getOpportunityReport:function(component, event, helper)
    {
        var action = component.get("c.getOpportunityReport");
        var oppt = component.get("v.opportunity");
        var id = oppt.Id.toString();        
        var name = oppt.Name == "" || oppt.Name == undefined ? "" : oppt.Name;
        var amount = oppt.Amount == "" || oppt.Amount == undefined ? "0":oppt.Amount.toString();
        var stage = oppt.StageName == "" || oppt.StageName == undefined ? "" : oppt.StageName.toString();
        var closedate = oppt.CloseDate == "" || oppt.CloseDate == undefined ? "" : oppt.CloseDate.toString();
        var isClosed = oppt.IsClosed == undefined ? "" : oppt.IsClosed.toString();
        var isWon = oppt.IsWon == undefined ? "" : oppt.IsWon.toString();
        action.setParams({oppID:id,name:name,amount:amount,stage:stage,closedate:closedate,isClosed:isClosed,isWon:isWon});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var data = JSON.parse(response.getReturnValue()).result[0];
                if(!data.fieldmapping)
                {
                    $('.divMessageBox .MsgTitle').html(data.message);
                    $(".forceModal").hide();
                    $('.divMessageBox').show();
                    $A.get("e.force:closeQuickAction").fire();
                    return;
                }
                var pid = data.id;
                var ptypeid = data.projecttypeid;
                var src = data.install+'/?clean#manage/projectrecord/report/'+ptypeid+'/'+pid;
                var isCommunity = document.location.pathname.indexOf("one.app") >= -1?false: true;
                helper.setCookie("showplaybook", false);
                window.name = '{"isQuickaction":"false","src":"'+src+'"}';
                var urlEvent = $A.get("e.force:navigateToURL");
                urlEvent.setParams({
                    "url": isCommunity?"/enablement":"/one/one.app#/n/MindMatrix__Enablement"
                });
                urlEvent.fire();
             	//component.set("v.opportunitysrc",src);
                //$(".sendampemail").show();
            }
        });
        action.setBackground();
        $A.enqueueAction(action);  
    },
    setCookie:function(cname, cvalue) {
        document.cookie = cname + "=" + cvalue + ";path=/";
    }
})