({
    generateChart:function(component,event,helper)
    {
        helper.annualtarget = $('.annualtarget');
        component.set("v.view","2");
        helper.AuthenticateCurrentUser(component, event, helper);
        window.addEventListener('message',function(evt){
            var install = component.get("v.install");
            if(evt.origin == install)
            {
                if(evt.data == "closetosmodal")
                {
                    setTimeout(function(){
                        component.set("v.isOpen",false);
                        window.location.reload();  
                    },500);
                }
                
            }
        },false);
        
    },
	handleMenuSelect : function(component, event, helper) {
        
		var view = $(helper.annualtarget).find("#selectannualstats").val();
        component.set("v.view",view);
        $(helper.annualtarget).find(".divspinner").show();
        var data = helper.getAnnualTargetProgressReport(component, helper);
    },
    scriptLoaded:function(component,event,helper)
    {
        //helper.getContactInterestStatsProgressBar(component);
    },
    
})