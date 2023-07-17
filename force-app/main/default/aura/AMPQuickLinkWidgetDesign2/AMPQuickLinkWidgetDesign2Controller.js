({
	scriptLoaded : function(component, event, helper) {
        helper.independentmodal = $(".quicklinkdesignbutton .modal-independant");
        helper.bindPage(component,helper);
    },
    doInit : function(component, event, helper) {
        
    },
    fullscreen:function(component,event,helper)
    {
        $(".slds-modal__container").toggleClass('fullscreen');
    },
    modalclose:function(component,event,helper){
        var modal = $(helper.independentmodal);
        $(modal).find("#amp-select").hide();
        $(modal).find("#modal-footer-send").hide();
        $(modal).find("#modal-heading").html('');
        $(modal).find("header").css("padding","15px");
     	$(modal).find("#modal-heading").show();                                     
        $(modal).find("iframe").attr("src",'');
        $(modal).hide(); 
    }
})