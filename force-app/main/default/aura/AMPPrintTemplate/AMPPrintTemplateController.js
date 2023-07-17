({
	scriptLoaded : function(component, event, helper)
    {
     	helper.playbook = $(".playbook-container");
     	helper.divspinner = $(helper.playbook).find(".divspinner");
        helper.body = $(helper.playbook).find(".iplaybookv1body");
		helper.bindPrint(component,event,helper);
	},
    leftnav : function(component,event,helper)
    {
        var e = event.currentTarget;
     	var classname= $(e).attr('class');
        component.set("v.istab",true);
        component.set("v.page","0");
        helper.setCurrentNav(component,event,helper,classname);
    },
    dropup: function(component,event,helper)
    {
        helper.dropup(component,event,helper);
    },
    send : function(component,event,helper)
    {
        helper.send(component,event,helper);
    },
    publish: function(component,event,helper)
    {
    	helper.publish(component,event,helper);
        var dropup = component.find("dropup");
     	$A.util.toggleClass(dropup, "toggle");
	},
    customize: function(component,event,helper)
    {
        helper.customize(component,event,helper);
    },
    view: function(component,event,helper)
    {
      	helper.view(component,event,helper);
    },
    ebook: function(component,event,helper)
    {
        helper.ebook(component,event,helper);
    },
    refresh: function(component,event,helper)
    {
        var classname = $(".activenav").find(".leftnavcolor").attr("class");
        helper.setCurrentNav(component,event,helper,classname);
    },
    clear: function(component, event, helper)
    {
        var e = event.currentTarget;
        $(".search").show();
        $(e).hide();
        component.find("searchfilter").set("v.value","");
        component.set("v.searchtext","");
        var classname = $(".activenav").find(".leftnavcolor").attr("class");
        helper.setCurrentNav(component,event,helper,classname);
    },
    search:function(component,event,helper)
    {
        helper.search(component,event,helper);
    },
    keyCheck : function(component, event, helper){
        if (event.which == 13){
            helper.search(component,event,helper);
        }
    },
    callParent:function(component,event,helper)
    {
        var event = component.getEvent('callParentEvent');
        event.fire();
    },
    doAction : function(cmp, event) {
        var params = event.getParam('arguments');
        if (params) {
            var param1 = params.param1;
            // add your code here
        }
    },
})