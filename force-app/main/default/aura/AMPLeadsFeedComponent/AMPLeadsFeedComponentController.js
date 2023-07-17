({
	scriptLoaded : function(component, event, helper) {
        if(component.get("v.showLeadFeed") || component.get("v.showLeadPlaybook") || component.get("v.showLeadAsset") ){
            helper.playbookcontainer = $('.playbookcontainer');
            helper.assetscontainer = $('.assetscontainer');
            helper.leadfeed = $('.leadfeed-container');
            helper.msgbox = component.find("MsgBoxBackDel");   
            helper.invalidapi = component.find("MsgBoxInvalidToken");	
            helper.playbookiframe = $("#playbook-iframe");
            $(".dummyiframe").closest("html").removeClass("mmdashboard");
            $(helper.playbookiframe).find('#playbooksrc').attr('src','');
            $(helper.assetiframe).find('#assetsrc').attr('src','');
            helper.getLeadDetailsAndvalidedEmail(component, event, helper);
            $(".bot2-Msg1-2").click(function(){
                $(helper.msgbox.getElement()).hide();
            });
        }
	},
    handleSelect: function(component,event,helper){        
        var selected = event.getSource().get("v.value").toString();
        component.set("v.isLeadFeed",true);
        helper.loadlead(component, event, helper, selected);
    },
    prev: function(component,event,helper){
        var page = component.get("v.page");
        page = page-1;
        helper.paginate(component,helper,page);                                   
    },
    paginate: function(component,event,helper){
        var page =  event.getSource().get("v.class").replace('page-','')-1;
        helper.paginate(component,helper,page);                                      
    },
    next: function(component,event,helper){
        var page = component.get("v.page");        
        page = page+1;
        helper.paginate(component,helper,page);                                           
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