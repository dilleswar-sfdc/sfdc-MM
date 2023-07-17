({
	doInit : function(component, event, helper) {
		component.set('v.openModal',true);
        
        /*$(document).keyup(function(e) {
            
             if (e.key === "Escape") {
                component.set('v.openModal',false);
            }
        });*/
	},
    CloseModal : function(component,event,helper){
        $('html').removeClass('mmdashboard');
        if(!component.get('v.getExpandedValue'))
            $('html').addClass('mmdashboard');
        component.set('v.openModal',false);
    }
})