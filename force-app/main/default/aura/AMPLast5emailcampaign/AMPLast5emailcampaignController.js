({
    generateEmail:function(component,event,helper)
    {
        helper.lastemailcampaign = $('.lastemailcampaign');
        helper.modal = $(helper.lastemailcampaign).find(".modal-independant");
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
    handleSelect : function(component, event, helper) {
        var src = $(".lastemailcampaign .modal-independant").find("#selectvalues").val();
        var modal = $(".lastemailcampaign .modal-independant");
        $(modal).find("iframe").attr("src",src);
    },
    modalclose: function(component, event, helper)
    {
        var modal = $(helper.lastemailcampaign).find(".modal-independant");
        $(modal).find("#amp-select").hide();
        $(modal).find("#modal-footer-send").hide();
        $(modal).find("#modal-heading").html('');
        $(modal).find("iframe").attr("src",'');
        $(modal).hide(); 
    },
    showViewAsset : function(component,event,helper){
         $(helper.viewassets).show();
         helper.AuthenticateCurrentUser(component,event,helper);
    },
    
})