({

    doInit : function(component, event, helper) {
        
    },
    scriptLoaded:function(component, event, helper) 
    {
       
        helper.modal = $(".statuswidget_option_c .modal-independant");
        helper.modalforclose = $(".statuswidget_option_c .modal-independant,.modal-engagement");
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
    displayinmodal: function(component,event,helper)
    {
        var e = event.currentTarget;
        var type = $(e).closest(".mainstatswidgetdiv").find(".widgettype").html();
     	helper.displaymodal(component,event,helper,type);
    },
    displayengagementmodal: function(component,event,helper)
    {
        var e = $.grep(helper.statsdata,function(a){return a.name == "engagementlevel"});
        if(e.length > 0)
        {
            var obj = e[0];
            var data = obj.data;
            var engagementMessage = data.engagementMessage;
            var isJson = false;
            try{
                var something = engagementMessage;
                if (typeof something != 'string')
                    something = JSON.stringify(something);
                
                try {
                    var a = JSON.parse(something);
                    if (a != null)
                        isJson = true;
                } catch (e) {
                    isJson = false;
                }
            }
            catch(e){
                isJson = false;
            }
            var message = '';
            if(isJson){
                if(engagementMessage.length > 1)
                {
                    try{
                        var engagementdata = engagementMessage[1].engagementdata;
                        var value = engagementdata[data.interestlevel];
                        if(value != undefined)
                        {
                            message = value.replace(/&lt;/gi,'<').replace(/&gt;/gi, '>');
                        }
                    }catch(e){}
                }
            }
            else
            {
                message = engagementMessage.replace(/&lt;/gi,'<').replace(/&gt;/gi, '>');
            }
            if(message != ''){
                var engagementModal = $('.modal-engagement');
                $(engagementModal).find("#modal-heading").html("Message");
                var $div = $("<div/>").html(message)
                $(engagementModal).find(".engagementmessage").html('');
                $(engagementModal).find(".engagementmessage").append($div.clone());
                $(engagementModal).show();
            }
        }
    },
    showEnablement: function(component,event,helper)
    {
     	var e = event.currentTarget;
        var url = $(e).find(".src").html();
        
     if(component.get("v.dependantwidget") == "oneapp")
     {
         localStorage.setItem('iframeSrcForEnablement', url); 
         var urlEvent = $A.get("e.force:navigateToURL");
         urlEvent.setParams({
             "url": url
         });
         urlEvent.fire();  
     }
     else if(component.get("v.dependantwidget") == "apex")
     {
         var origin = window.location.origin;
         url= origin+url;
         window.open(url,'_blank');
     }
         else{
             var listviewid = url.split('=')[1];
             var navEvent = $A.get("e.force:navigateToList");
             navEvent.setParams({
                 "listViewId": listviewid,
                 "listViewName": null,
                 "scope": "Opportunity"
             });
             navEvent.fire();
         }
    },
    openaccordion: function(component,event,helper){
        helper.toggleaccordion(component,event,helper);
    },
    modalclose: function(component, event, helper)
    {
        var modal = $(helper.modalforclose);
        $(modal).find("#amp-select").hide();
        $(modal).find("#modal-footer-send").hide();
        $(modal).find("#modal-heading").html('');
        $(modal).find("iframe").attr("src",'');
        $(modal).hide(); 
    },
    handleSelect : function(component, event, helper) {
        var src = $(".statuswidget_option_c .modal-independant").find("#selectvalues").val();
        var modal = $(".statuswidget_option_c .modal-independant");
        $(modal).find("iframe").attr("src",src);
    },
    showViewAsset : function(component,event,helper){
         $('.mainStatusWidgetDiv').hide();
         helper.AuthenticateCurrentUser(component,event,helper);
    },
    
})