({
    scriptLoaded : function(component, event, helper) {
        helper.enablementtag = $("#divenablement");
        helper.playbook = $(".playbook");
        helper.enablement = $("#divenablement #iframetag");
        helper.iplaybookv1body = $(".iplaybookv1body");
        helper.ampdashboard = $(".ampdashboard");
        helper.internalplaybook = $(".internalPlaybooksection");
        helper.independentmodal = $(helper.internalplaybook).find(".modal-independant");
        helper.ampdashboardwithmenu = $('.ampdashboardwithmenu').find('#enablementmenu');
        $(helper.playbook).closest("html").removeClass("mmdashboard");
        if(component.get("v.dependantwidget") == "oneapp")
        {
            helper.getInternalPlaybookForUser(component, event, helper);
        }
        else
            helper.getDetails(component, helper);
    },
    next:function(component,event,helper){
        var page = component.get("v.page");
        if(page + 1 == component.get("v.pages")/component.get("v.pagesize"))
            return;
        component.set("v.page",++page);
        helper.getPlaybookRecord(component, helper);
    },
    prev:function(component,event,helper){
        var page = component.get("v.page");
        if(page == 0)
            return;
        component.set("v.page",--page);
        helper.getPlaybookRecord(component, helper);
    },
    paginate:function(component,event,helper){                                              
        var page =  event.getSource().get("v.class").replace('page-','');
        component.set("v.page",parseInt(page-1));
        helper.getPlaybookRecord(component, helper);
    },
    keyCheck : function(component, event, helper){
        if (event.which == 13){
            helper.search(component,event,helper);
        }
    },
    refresh: function(component,event,helper){
        helper.getPlaybookRecord(component, helper);
    },
    clear: function(component, event, helper)
    {
        var e = event.currentTarget;
        $(".search").show();
        $(e).hide();
        component.find("searchfilter").set("v.value","");
        component.set("v.searchtext","");
        component.set("v.isPlaybookFilter",false);
        component.set("v.filter","");
        var page =  1;
        component.set("v.page",parseInt(page-1));
        helper.getPlaybookRecord(component, helper);
    },
    search:function(component,event,helper){
        helper.search(component,event,helper);        
    },
    openenablement : function(component,event,helper){
        helper.displayenablement(component,event,helper);
    },
})