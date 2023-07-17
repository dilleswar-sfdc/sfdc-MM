({
    leadfeed:'',
    feeddata:[],
    msgbox:'',
	invalidapi:'',
    eltandeln:'',
    LeadMMId:0,
	getLeadDetailsAndvalidedEmail:function(component,event,helper){
        var action = component.get("c.getleads");
        action.setParams({leadId: component.get("v.recordId")});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data = response.getReturnValue();
                if(data == null || data == undefined || data.length == 0)
                    return;
                
                var lead = data[0];
                
                //if lead is not having email which is a mandatory field in MM, don't process any further.
                if(lead.Email == undefined || lead.Email == "" || lead.Email == null)
                {
                    helper.showToastMessage('Info!', 'info', 'This Contact do not  have email hence AMP widgets will not be loaded.');
                    return;
                }
                //proceed
                helper.processLead(component,event,helper,lead);
                
            }
        });
        $A.enqueueAction(action);
    },
    processLead:function(component,event,helper,lead)
    {
        component.set("v.lead",lead);// set the lead in the aura:attr
        helper.checkLeadExistenceInMM(component,event,helper,lead,"0");
    },
    checkLeadExistenceInMM : function(component,event,helper,lead,selected){
        var action = component.get("c.getleadDetails");
        action.setParams({ Email:lead.Email,leadID:lead.Id,index:selected});
        action.setCallback(this, function(response) {
            var state = response.getState();
            var apiresponse = response.getReturnValue(); 
            if (state === "SUCCESS") {
                var result = JSON.parse(apiresponse);
                if(result.status == 1){
                    helper.showToastMessage('Info Message', 'info', 'An issue occured with the Mindmatrix widget, please contact admin');
                }
                else
                {
                    var data = result.result;
                    var finalresponse=data.code;
                    var finalmessage = data.msg;
                    if(finalresponse == false){
                        helper.showToastMessage('Info Message', 'info', finalmessage);
                        return;
                    } 
                    
                    if(data.isExist){
                        helper.LeadMMId = data.contactid;
                        helper.saveLeadDetail(component,event,helper,lead,"0",false);
                        helper.checkUserIntegrated(component,event,helper);
                    }
                    else
                        helper.saveLeadDetail(component,event,helper,lead,"0",true);
                    
                }
                
            }
        });
        $A.enqueueAction(action);
    },
    saveLeadDetail: function(component,event,helper,lead,selected,callUserIntegrated)
    {
        var action = component.get("c.saveLeadDetails");
        action.setParams(helper.getParamsForSaveContact(lead, selected));
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state == "SUCCESS")
            {	
                var apiresponse = response.getReturnValue();
                var result = JSON.parse(apiresponse);
                if(result.status == 1){
                    helper.showToastMessage('Info Message', 'info', 'An issue occured with the Mindmatrix widget, please contact admin');
                }
                else{
                    var data = result.result;
                    var finalresponse=data.code;
                    var finalmessage=data.msg;
                    if(finalresponse == false){
                        helper.showToastMessage('Info Message', 'info', finalmessage);
                    } 
                    else{
                        component.set("v.IsSpinner",false);
                        if(data){
                            helper.LeadMMId = data.contactid;
                            if(callUserIntegrated)
                                helper.checkUserIntegrated(component,event,helper);
                        }
                        else
                        {
                            $(helper.msgbox.getElement()).find(".MsgTitle").html('');
                            $(helper.msgbox.getElement()).find(".pText").html('There is an error while syncing this lead with AMP')
                            $(helper.msgbox.getElement()).show();
                            
                        } 
                    }
                }
            }
        });
        $A.enqueueAction(action);
    },
  getParamsForSaveContact:function(lead, selected)
    {
        var account = '';
        var industry = '';
        account = lead.Company;
        if(lead.Account != null){
            account = lead.Account.Name;
            industry = lead.Account.Industry == undefined || lead.Account.Industry == null ? '' : lead.Account.Industry;
        }
        return {
            FirstName : lead.FirstName,
            Email:lead.Email,
            LastName:lead.LastName,
            Company:account,
            Industry:industry,
            leadID:lead.Id,
            updatedon:lead.LastModifiedDate,
            index:selected
        };
    },
  checkUserIntegrated:function(component,event,helper){
        var action = component.get("c.getUserIntegrated");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var data = JSON.parse(response.getReturnValue());
                helper.syncUserToMM(component,event,helper);
            }
        });
        $A.enqueueAction(action);
    },
  syncUserToMM : function(component,event,helper){
        var action = component.get("c.AuthenticateSFUser");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var response = JSON.parse(response.getReturnValue());
                if(response.result.userfound == true){
                    helper.eltandeln=response.result.usersessionid;
                    helper.processMMWidgets(component,event,helper);
                    
                }
            }
        });
        $A.enqueueAction(action);
    },
    processMMWidgets : function(component,event,helper){
         var action = component.get("c.getMMInstallUrl");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var response = response.getReturnValue();
                var url = response+"?elt="+helper.eltandeln+"&clean#";
                    if(component.get("v.showLeadAsset"))
                        helper.showAssets(component, url+component.get('v.assetSource')+helper.LeadMMId,helper);
                    if(component.get('v.showLeadPlaybook'))
                        helper.showPlaybook(component,url+component.get('v.playbookSource')+helper.LeadMMId,helper);
                        
            }
        });
         $A.enqueueAction(action);
    },
    showAssets:function(component, source,helper){
        helper.showWidgetcontainer(component,'AMPAssetContainer',{AlreadyAuthenticated:true,subsource:source,iframeheight:component.get('v.assetHeight')});
    },
    showPlaybook:function(component, source,helper){
        helper.showWidgetcontainer(component,'AMPPlaybookContainer',{CustomFunction:_PostMessage.listedForMMInternalPlaybookPM,AlreadyAuthenticated:true,subsource:source,iframeheight:component.get('v.playbookHeight')});
    }, 
    showWidgetcontainer:function(component,container,obj)
    {	
        $A.createComponent('c:AMPWidgetContainer', obj, function (contentComponent, status, error) {
            if (status === "SUCCESS") {
                component.set('v.'+container, contentComponent);
            } else {
                throw new Error(error);
            }
        });    
        
    }, 
    showToastMessage:function(title, type, message){
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": title,
            "message": message,
            "duration":"5000",
            "type":"info",
            "mode":"dismissible"
        });
        toastEvent.fire();
    }
    
})