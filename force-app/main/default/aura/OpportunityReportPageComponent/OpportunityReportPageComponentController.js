({
    scriptLoaded : function(component, event, helper) {
        if(component.get("v.showOpportunityPlaybookFeed") || component.get("v.showOpportunityAssetFeed")){
            helper.msgbox = component.find("MsgBoxBackDel");
            helper.oppiframe = $(".opp-iframe");
            helper.dummyiframe =  $(".dummyiframe");
            helper.invalidapi = component.find("MsgBoxInvalidToken");
            $(helper.dummyiframe).closest("html").removeClass("mmdashboard");
            helper.getOpportunityDetails(component, event, helper);
            $(".bot2-Msg1-2").click(function(){
                $(helper.dummyiframe).closest("html").removeClass("dont_show_modal");
                $(helper.msgbox.getElement()).hide();
            });
        }
    },
    handleBlur: function (component, event) {
        var value = component.find("fieldsiteurl").get("v.value");
        if(value != '')
            $("#installurl").html("("+value+"/*)");
    },
    redirect:function(component,event,helper)
    {
        var isCommunity = document.location.pathname.indexOf("one.app") > -1?false: true;
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/one/one.app#/n/MindMatrix__AMP"
        });
        urlEvent.fire();
        $('.ssodetails').hide();
    },
    redirecttosettings:function(component,event,helper)
    {
        var isCommunity = document.location.pathname.indexOf("one.app") > -1?false: true;
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/one/one.app#/n/MindMatrix__MM_Settings"
        });
        urlEvent.fire();
        $('.ssodetails').hide();
    },
    submit:function(component,event,helper)
    {
        $('.ssodetails').hide();
    },
    createUser:function(component,event,helper){
        component.set('v.showUserCreationModal',false);
        helper.syncUserToMM(component,event,helper);
    }
})