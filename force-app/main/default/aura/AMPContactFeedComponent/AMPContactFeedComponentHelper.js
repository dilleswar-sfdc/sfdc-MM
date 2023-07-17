({
    feeddata:[],
    contactfeed: '',
    msgbox:'',
    invalidapi:'',
    eltandeln:'',
    contactMMId:0,
    checkIfContactIsPartner:function(component,event,helper){
        var action = component.get("c.getContacts");
        action.setParams({ContactId: component.get("v.recordId")});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data = response.getReturnValue();
                if(data == null || data == undefined || data.length == 0)
                    return;
                
                var contact = data[0];
                var contactNotPartner = contact.Account == null || (contact.Account != null && !contact.Account.MindMatrix__IsPartner__c);
                
                //Check if contact is a partner user, if yes than return the fn and don't proceed anything
                if(!contactNotPartner)
                {
                    helper.showToastMessage('Info!', 'info', 'This contact is of partner account hence AMP widgets will not be loaded.');
                    return;
                }
                
                //if contact is not having email which is a mandatory field in MM, don't process any further.
                if(contact.Email == undefined || contact.Email == "" || contact.Email == null)
                {
                    helper.showToastMessage('Info!', 'info', 'This Contact do not  have email hence AMP widgets will not be loaded.');
                    return;
                }
                
                //If contact is a pure contact (Account.MMIsPartner = false) then proceed
                helper.processContact(component,event,helper,contact);
                
            }
        });
        $A.enqueueAction(action);
    },
    processContact:function(component,event,helper,contact)
    {
        component.set("v.contact",contact);// set the contact in the aura:attr
        helper.checkContactExistenceInMM(component,event,helper,contact,"0");
    },
    checkContactExistenceInMM : function(component,event,helper,contact,selected){
        var action = component.get("c.getContactDetails");
        action.setParams({ Email:contact.Email,contactID:contact.Id,index:selected});
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
                        helper.contactMMId = data.contactid;
                        helper.saveContactDetail(component,event,helper,contact,"0",false);
                        helper.checkUserIntegrated(component,event,helper);
                    }
                    else
                        helper.saveContactDetail(component,event,helper,contact,"0",true);
                    
                }
                
            }
        });
        $A.enqueueAction(action);
    },
    saveContactDetail: function(component,event,helper,contact,selected,callUserIntegrated)
    {
        var action = component.get("c.saveContactDetails");
        action.setParams(helper.getParamsForSaveContact(contact, selected));
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
                            helper.contactMMId = data.contactid;
                            if(callUserIntegrated)
                                helper.checkUserIntegrated(component,event,helper);
                        }
                        else
                        {
                            $(helper.msgbox.getElement()).find(".MsgTitle").html('');
                            $(helper.msgbox.getElement()).find(".pText").html('There is an error while syncing this contact with AMP')
                            $(helper.msgbox.getElement()).show();
                            
                        } 
                    }
                }
            }
        });
        $A.enqueueAction(action);
    },
    getParamsForSaveContact:function(contact, selected)
    {
        var account = '';
        var industry = '';
        if(contact.Account != null){
            account = contact.Account.Name;
            industry = contact.Account.Industry == undefined || contact.Account.Industry == null ? '' : contact.Account.Industry;
        }
        return {
            FirstName : contact.FirstName == undefined || contact.FirstName == null ? '' : contact.FirstName,
            Email:contact.Email,
            LastName:contact.LastName,
            Company:account,
            Industry:industry,
            contactID:contact.Id,
            updatedon:contact.LastModifiedDate,
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
                    if(component.get("v.showAssetfeed"))
                        helper.showAssets(component, url+component.get('v.subsource')+helper.contactMMId,helper);
                    if(component.get('v.showPlaybookfeed'))
                        helper.showPlaybook(component,url+component.get('v.playbookSource')+helper.contactMMId,helper);
                        
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