({
	doInit : function(component, event, helper) {

	},
    scriptLoaded: function(component,event,helper)
    {
        helper.quickactioncontainer = $('.quickactioncontainer');
        helper.quickaction = $("#iframeenablement");
        helper.showquickmodal = $('#quickactionmodal');
        helper.quickactionbtn = $(".quickactionbtn");
        var height = window.innerHeight - 127;
        component.set("v.height",height);
        $(helper.quickactioncontainer).closest("html").addClass("mmdashboard");
        //helper.playbookcontainer = $(".playbookcontainer");
        
        var isObject = true;
        try{
            JSON.parse(window.name);
            isObject = true;
        }
        catch(e){
            isObject = false;
        }
        if(isObject)
        {
            var data = JSON.parse(window.name);
            component.set("v.isQuickaction",data.isQuickaction);
            var isQuickaction = component.get("v.isQuickaction") == "true";
            if(isQuickaction)
            {
                $(helper.quickactionbtn).show();
                component.set("v.playbookurl",data.playbookurl);
                component.set("v.printurl",data.printurl);
                component.set("v.ebookurl",data.ebookurl);
                component.set("v.weburl",data.weburl);
                component.set("v.btnname",data.btnname);
                helper.bindcomponent(component, event, helper);
                $(helper.quickactioncontainer).show();
            }
            else
            {
                $(helper.quickactionbtn).hide();
                component.set("v.iframesrc",data.src);
                component.set("v.classtohide",'show');
                $(helper.quickaction).show();
                $(helper.quickactioncontainer).show();
            }            
        }
        else
        {            
            
            component.set("v.iframesrc",window.name);
            component.set("v.classtohide",'show');
            $(helper.quickactionbtn).hide();
            $(helper.quickaction).show();
            $(helper.quickactioncontainer).show();
        }
    },
    showmodal: function(component,event,helper)
    {
        $(helper.showquickmodal).show();
    },
    modalclose: function(component,event,helper)
    {
    	$(helper.showquickmodal).hide();
	}
})