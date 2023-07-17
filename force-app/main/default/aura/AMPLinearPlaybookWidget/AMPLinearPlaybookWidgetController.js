({
	scriptLoaded : function(component, event, helper) {
        
        helper.divenablement =  $('#divenablement');
        helper.ampdashboard =  $('.ampdashboard');
        helper.linearplaybook = $(".linear-playbook-widget");
        helper.linearresponsive = $(helper.linearplaybook).find(".linear-responsive");
        helper.independentmodal = $(helper.linearplaybook).find(".modal-independant");
        helper.AuthenticateCurrentUser(component, event, helper);
          
        
        
    },
    doInit : function(component, event, helper) {
		
	},
    modalclose: function(component, event, helper)
    {
        var modal = $(helper.independentmodal);
        $(modal).find("iframe").attr("src",'');
        $(modal).hide(); 
    },
    showViewAsset : function(component,event,helper){
         $(helper.viewassets).show();
         helper.AuthenticateCurrentUser(component,event,helper);
    }
})