({
	doInit : function(component, event, helper) {
		
	},
    scriptLoaded: function(component, event, helper) {
        helper.interactive = $(".interactive");
        $(helper.interactive).closest("html").removeClass("mmdashboard");
        setTimeout(function(){
			helper.AuthenticateCurrentUser(component, event, helper);
        },1000)
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
    showViewAsset : function(component,event,helper){
         $(helper.interactive).hide();
         helper.AuthenticateCurrentUser(component,event,helper);
    },
    

})