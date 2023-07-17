({
    scriptLoaded : function(component, event, helper) 
    {
        if(component.get("v.dependantwidget") == "oneapp")
        {
            helper.getAssetRecord(component,event,helper);
        }
        else
            helper.getDetails(component,event, helper);     
    },
    tabSelected:function(component, event, helper){},
    clear: function(component, event, helper)
    {
        var e = event.currentTarget;
        $(".search").show();
        $(e).hide();
        //component.find("searchfilter").set("v.value","");
        component.set("v.searchtext","");
        component.set("v.isfilter",false);
        component.set("v.filter","");
        var page =  1;
        component.set("v.page",parseInt(page-1));
        helper.getAssetRecord(component,event,helper);
    },
    handleActive:function(component,event,helper)
    {
        helper.handleActive(component,event,helper);
    },
    handleSorting:function(component,event,helper)
    {
        var page =  1;
        component.set("v.page",parseInt(page-1));
        var sortvalue = event.getSource().get("v.value").toString();
        component.set("v.sortfield",sortvalue);
        helper.getAssetRecord(component,event,helper);
    },
    handleOrder:function(component,event,helper)
    {
        var page =  1;
        component.set("v.page",parseInt(page-1));
        var sortvalue = event.getSource().get("v.value").toString();
        component.set("v.sortorder",sortvalue);
        helper.getAssetRecord(component,event,helper);
    },
    next:function(component,event,helper){
        var page = component.get("v.page");
        if(page + 1 == component.get("v.pages")/component.get("v.pagesize"))
            return;
        component.set("v.page",++page);
		component.set("v.currentpage",(component.get("v.page")+1));
        helper.getAssetRecord(component,event,helper);
    },
    prev:function(component,event,helper){
        var page = component.get("v.page");
        if(page == 0)
            return;
        component.set("v.page",--page);
        component.set("v.currentpage",(component.get("v.page")+1));
        helper.getAssetRecord(component,event,helper);
    },
    paginate:function(component,event,helper){
        var page =  event.getSource().get("v.class").replace('page-','');
        component.set("v.page",parseInt(page-1));
        helper.getAssetRecord(component,event,helper);
    },
    handleComponentEvent : function(component, event) {
        var data = event.getParam("data");
		data = JSON.parse(JSON.stringify(data));
        var currentnav = data.currentnav.toString();
        component.set("v.pages", data.pages);
        component.set("v.currentNav",currentnav);
        component.set("v.rowcount",data.rowcount);
        component.set("v.isfirst",data.isfirst);
        component.set("v.istab",data.istab);
        if(component.get("v.istab"))
        {
            component.set("v.currentpage", 1);
            component.set("v.page", 0);
        }
            
    }
})