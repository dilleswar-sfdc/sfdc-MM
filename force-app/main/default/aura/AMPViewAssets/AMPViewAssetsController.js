({
    scriptLoaded : function(component, event, helper)
    {      
     helper.viewassets = $('.viewassets');
     helper.closemodal = $('.modal-close');
     helper.closeiframe = $('.iframe-close');
     helper.msgbox = $('#MsgBoxSelectCategory');
     $(helper.viewassets).closest("html").removeClass("mmdashboard");
     helper.AuthenticateCurrentUser(component, event, helper);
        window.addEventListener('message',function(evt){
            var install = component.get("v.install");
            if(evt.origin == install)
            {   //it is for new asset changes
                if(evt.data == "CloseViewAssetModalInSFDC")
                {
                    var title=component.get('v.title');
                    var compare ="View Assets,New Assets,Recently Used Assets,Recommended Assets,My Favorites"
                    var titles = compare.split(',');
                    if(titles.indexOf(title) <= -1){
                        setTimeout(function(){
                            $(helper.closeiframe).click();   
                        },500);
                    }
                }
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
    HideMessage:function(component, event, helper)
    {
        $(helper.msgbox).hide();
    },
    viewModalEvt : function(component,event,helper){
        
        var modalFolderEnum = event.getParam("modalFolderEnum"); 
        component.set("v.currentTabFolderEnum",modalFolderEnum);
        var modalIsMedia = event.getParam("modlaisMedia");
        var modalsearchtxt = event.getParam("modalSearchtxt");
       var flagcountval=event.getParam("flagcountVal");
                 component.set("v.flagcountVal",flagcountval);
        var modalPage = event.getParam("modalPage");
      component.set('v.filterFlag',event.getParam("filterflag"));
        var modalCurrentPage = event.getParam("modalCurrentPage");

        component.set("v.filterids",event.getParam("filterId"));
        component.set("v.conditionVal",event.getParam("conditionval"));
        if(modalIsMedia == 1){
            var filterName = event.getParam("tabNameData");
            component.set("v.isMedia",modalIsMedia);
            if(modalPage > 0){
                component.set("v.page",modalPage); 
                if(event.getParam("flag")== true)
                    helper.gettabcount(component,event,helper)
                    else
                helper.getAssetSearchRecord(component,event,helper,filterName);
            }else{
                 component.set("v.page",0); 
                if(event.getParam("flag")== true)
                    helper.gettabcount(component,event,helper)
                    else
                helper.getAssetSearchRecord(component,event,helper,filterName);
            }
        }else{
            var filterName = event.getParam("tabNameData");
            component.set("v.isMedia",modalIsMedia); 
            component.set("v.searchtxt",modalsearchtxt);
           // component.set("v.isFirstLoad",isFirstLoad);
            if(modalPage > 0){
                component.set("v.page",modalPage); 
                 if(event.getParam("flag")== true)
                    helper.gettabcount(component,event,helper)
                    else
                helper.getAssetSearchRecord(component,event,helper,filterName);
            }else{
                 component.set("v.page",0); 
                if(event.getParam("flag")== true)
                    helper.gettabcount(component,event,helper)
                    else
                helper.getAssetSearchRecord(component,event,helper,filterName);
            }
        }
        
        
    },
    viewActionModalEvt : function(component,event,helper){
        
        var cmpTarget = component.find('modalBoxIframe');
        var cmpBack = component.find('modalBackdropIframe');
        $A.util.addClass(cmpTarget, 'slds-fade-in-open');
        $A.util.addClass(cmpBack, 'slds-backdrop--open');
		var install = component.get("v.install") + '//?elt=' + helper.sessionID;
        var modalAction = event.getParam("actionUrl");
        if(modalAction.indexOf("https") != -1){
            component.set('v.actionUrl',null);
        }
        else{
            modalAction = install+modalAction;
            component.set("v.actionUrl",null);
        }
        setTimeout(function(){
            component.set('v.actionUrl',modalAction);
        },500);
        	
     },
    modalIframeAssetClose : function(component,event,helper){
        
        var cmpTarget = component.find('modalBoxIframe');
        var cmpBack = component.find('modalBackdropIframe');
        $A.util.removeClass(cmpTarget, 'slds-fade-in-open');
        $A.util.removeClass(cmpBack, 'slds-backdrop--open'); 
     },
    showAssets:function(component, event, helper)
    {
		
        helper.showAssets(component, helper,true);
    },
    showSearchAsset:function(component, event, helper)
    {
		
        helper.showAssets(component, helper,false);
    },
    doInit: function(component, event, helper)
    {},
    modalAssetclose: function(component, event, helper)
    {
        var cmpTarget = component.find('Modalbox');
        var cmpBack = component.find('Modalbackdrop');
        $A.util.removeClass(cmpBack,'slds-backdrop--open');
        $A.util.removeClass(cmpTarget, 'slds-fade-in-open'); 
        var childComponent = component.find('child');
        childComponent.viewModalClose();
        /*  var modal = $(helper.viewassets).find(".modal-independant");
        $(modal).find("#amp-select").hide();
        $(modal).find("#modal-footer-send").hide();
        $(modal).find("header").css("padding","15px");
     	$(modal).find("#modal-heading").show();
        $(modal).find("iframe").attr("src",'');
        $(modal).hide(); */
    },
    modalclose : function(component,event,helper){
       var modal = $(helper.viewassets).find(".modal-independant");
        $(modal).find("#amp-select").hide();
        $(modal).find("#modal-footer-send").hide();
        $(modal).find("header").css("padding","15px");
     	$(modal).find("#modal-heading").show();
        $(modal).find("iframe").attr("src",'');
        $(modal).hide(); 
    },
    hideerror:function(component,event,helper){component.set("v.showerror",false);},
    sendEmail:function(component,event,helper)
    {
        var title = event.target.innerHTML == "Send"?"SendAMPEmail":"PublishSocialTemplate";
        var vfWindow = component.find("iframe-modal-independant").getElement().contentWindow;
        
        vfWindow.postMessage(title,component.get("v.install"));
    },
    showViewAsset : function(component,event,helper){
         $(helper.viewassets).show();
         helper.AuthenticateCurrentUser(component,event,helper);
    },
    redirectTosUrl:function(component,event,helper){
        var action = component.get("c.UpdateToS");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS")
            {
               var response=response.getReturnValue();
                component.set("v.isOpen",false);
                window.location.reload();
            }
        });
        $A.enqueueAction(action);
                           
    },
    //onclick function for new,recently,recommened,fav
    /*iconclick:function(component,event,helper){
        var type = event.getSource().getLocalId();
        helper.showAll(component, helper,type);
    }*/
})