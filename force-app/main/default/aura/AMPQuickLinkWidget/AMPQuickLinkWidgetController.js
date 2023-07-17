({
    scriptLoaded:function(component, event, helper)
    {
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
    doInit : function(component, event, helper) {
        
    },
    modalclose: function(component, event, helper)
    {
        var modal = $(".modal-independant");
        $(modal).find("#amp-select").hide();
        $(modal).find("#modal-footer-send").hide();
        $(modal).find("#modal-heading").html('');
        $(modal).find("header").css("padding","15px");
     	$(modal).find("#modal-heading").show();
        $(modal).find("iframe").attr("src",'');
        $(modal).hide(); 
    },
     showViewAsset : function(component,event,helper){
       
         helper.AuthenticateCurrentUser(component,event,helper);
    },
})