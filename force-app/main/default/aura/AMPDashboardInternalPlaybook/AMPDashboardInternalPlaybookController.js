({
    scriptLoaded : function(component, event, helper) {
        helper.enablementtag = $("#divenablement");
        helper.playbook = $(".playbook");
        helper.enablement = $("#divenablement #iframetag");
        helper.iplaybookv1body = $(".iplaybookv1body");
        helper.ampdashboard = $(".ampdashboard");
        helper.internalplaybook = $(".internalPlaybooksection");
        helper.independentmodal = $(helper.internalplaybook).find(".modal-independant");
        helper.ampdashboardwithmenu = $('.ampdashboardwithmenu').find('#enablementmenu');
        $(helper.playbook).closest("html").removeClass("mmdashboard");
        helper.filter = $(".filters");
        helper.commentmodal = $("#commentmodal");
        helper.comment = $(helper.commentmodal).find("#comment");
        $(helper.internalplaybook).find(".errorMsg").hide();
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
    next:function(component,event,helper){
        var page = component.get("v.page");
        if(page + 1 == component.get("v.pages")/component.get("v.pagesize"))
            return;
        component.set("v.page",++page);
        helper.callApi(component, helper,"getPlaybooksForCurrentUser",'','');
    },
    prev:function(component,event,helper){
        var page = component.get("v.page");
        if(page == 0)
            return;
        component.set("v.page",--page);
        helper.callApi(component, helper,"getPlaybooksForCurrentUser",'','');
    },
    paginate:function(component,event,helper){                                              
        var page =  event.getSource().get("v.class").replace('page-','');
        component.set("v.page",parseInt(page-1));
        helper.callApi(component, helper,"getPlaybooksForCurrentUser",'','');
    },
    keyCheck : function(component, event, helper){
        if (event.which == 13){
            helper.search(component,event,helper);
        }
    },
    refresh: function(component,event,helper){
        helper.callApi(component, helper,"getPlaybooksForCurrentUser",'','');
    },
    clear: function(component, event, helper)
    {
        var e = event.currentTarget;
        $(".search").show();
        $(e).hide();
        component.find("searchfilter").set("v.value","");
        component.set("v.searchtext","");
        var page =  1;
        component.set("v.page",parseInt(page-1));
        helper.callApi(component, helper,"getPlaybooksForCurrentUser",'','');
    },
    search:function(component,event,helper){
        helper.search(component,event,helper);        
    },
    filterplaybok: function(component,event,helper)
    {
        var e = event.currentTarget;
     	var isselect = $(e).hasClass("isselected");
     	$(e).toggleClass("isselected");
     	var selected = $(helper.filter).find(".isselected");
     	var filter = [];
     	for(var i = 0;i<selected.length;i++)
        {
            filter.push($(selected[i]).attr("id"));
        }
     	selected.length == 0 ? filter = "":filter;
     	component.set("v.selectedfilter",filter);
        var page =  1;
        component.set("v.page",parseInt(page-1));
        helper.callApi(component, helper,"getPlaybooksForCurrentUser",'','');
    },
    togglefilter:function(component,event,helper)
    {
     var e = event.currentTarget;
     if($(e).find(".filtercheck").html() == "AND")
     {
         $(e).find(".filtercheck").html("OR")
         component.set("v.isfilter",false);
     }
     else{
         $(e).find(".filtercheck").html("AND");
         component.set("v.isfilter",true);
     }     
     $(e).find(".ftoggle").toggleClass("toggleleft");
     $(e).find(".fbullet").toggleClass("bulletright");
     $(e).find(".fbullet").toggleClass("bulletleft");
     $(e).find(".filtercheck").toggleClass("OR");
     var page =  1;
        component.set("v.page",parseInt(page-1));
        helper.callApi(component, helper,"getPlaybooksForCurrentUser",'','');
    },
    updatecomment : function(component,event,helper){
        helper.opencommentmodal(component,event,helper);
    },
    submit : function(component,event,helper){
        helper.submitmodal(component,event,helper);
    },
    closeme : function(component,event,helper){
        $(helper.commentmodal).hide();
    },
    openenablement : function(component,event,helper){
        helper.displayenablement(component,event,helper);
    },
    doInit : function(component,event,helper){},
    ratecount : function(component,event,helper){
        var e = event.currentTarget;
        var itemid = $(e).closest(".star-rating").attr("id");
        var rateid = $(e).attr("id");
        var ratename = rateid.split("_")[0];
        var ratecount = rateid.split("_")[1];
        var howmuchrated = $(e).closest(".star-rating").find(".ratecolor");
        var ratetosendapi = 0;
        $(howmuchrated).removeClass("ratecolor");
        if(ratecount == howmuchrated.length){
            ratetosendapi = 0;
        }
        else
        {
            ratetosendapi = ratecount;
            for(var i=ratecount; i>=1; i--)
            {
                $("#"+ratename+"_"+i).addClass("ratecolor");
            }
        }
        var action = component.get("c.getUpdatedRating");
        action.setParams({
            "userid":component.get("v.userid").toString(),
            "itemid":itemid.toString(),
            "value":(ratetosendapi).toString(),
            "type":"1"
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var toastEvent = $A.get("e.force:showToast");
                if(toastEvent){
                    toastEvent.setParams({
                        "title": "Success!",
                        "message": "Your rating has been updated successfully.",
                        type :"success"
                    });
                    toastEvent.fire();
                }
                else
                {
                    component.set("v.message","Your rating has been updated successfully.");
                    $A.util.removeClass(component.find("successToast"), "slds-hide");
                    setTimeout(function(){
                        helper.closeToast(component);
                    },1000);
                }
                return;
            }});
        $A.enqueueAction(action);
        
    },
    closeToast:function(component){
        helper.closeToast(component);
    },
    ratingpopover : function(component,event,helper){
        var e = event.currentTarget;
        $(e).next().show();
    },
    removepopover :function(component,event,helper){
        var e = event.currentTarget;
        $(e).next().hide();
    },
    modalclose:function(component,event,helper){
        var modal = $(helper.independentmodal);
        $(modal).find("#iframe-modal").attr("src",'');
        $(modal).hide(); 
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
                           
    }
})