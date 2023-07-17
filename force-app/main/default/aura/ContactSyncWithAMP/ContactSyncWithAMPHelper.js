({
    checkUserIntegrated:function(component,event,helper){
        var action = component.get("c.getMMAPIDetailsAvaiable");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var data = JSON.parse(response.getReturnValue());
                if(data)
                {
                    $(component.find("syncwithamp").getElement()).find('.mmReportLink').hide();
                    helper.syncWithAmp(component,event,helper);
                }
                else
                {
                    component.set("v.IsSpinner",false);
                    $(component.find("syncwithamp").getElement()).find('.mmReportLink').show();
                    $(component.find('syncwithamp').getElement()).find('.Syncmessage').html("MM Settings is not available.").show();
                    $(component.find("close").getElement()).show();
                }
            }
        });
        $A.enqueueAction(action);
    },
    syncWithAmp : function(component,event,helper) {
        var action = component.get("c.getContacts");
        action.setParams({
            "ContactId":component.get("v.recordId")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state = "SUCCESS")
            {
                var contact = (response.getReturnValue())[0];
                try{
                    var account = contact.Account;
                    if(account != null)
                    {
                        var isPartner = account.MindMatrix__IsPartner__c;
                        if(isPartner)
                        {
                         	$(component.find("syncwithamp").getElement()).find('.Syncmessage').html("This is a partner contact hence cannot be synced with AMP as contact.").show();
            				component.set("v.IsSpinner",false);   
                            return;
                        }
                    }
                }
                catch(e){}
                component.set("v.contact",contact);
                helper.saveContactDetail(component,event,helper,contact,"0");
            }
        });
        $A.enqueueAction(action);
    },
    saveContactDetail: function(component,event,helper,contact,selected)
    {
        var contactId = contact.Id;
        var account = '';
        var industry = '';
        if(contact.Account != null){
            account = contact.Account.Name;
            industry = contact.Account.Industry == undefined || contact.Account.Industry == null ? '':contact.Account.Industry;
        }
        var selected = selected;
        if(contact.Email == undefined || contact.Email == "")
        {
            $(component.find("syncwithamp").getElement()).find('.Syncmessage').html("This Contact doesn't have email So, the AMP Stats will not be shown.").show();
            component.set("v.IsSpinner",false);
            return;
        }
        var action = component.get("c.saveContactDetails");
        action.setParams({ FirstName : contact.FirstName,Email:contact.Email,LastName:contact.LastName,Company:account,Industry:industry,contactID:contact.Id,updatedon:contact.LastModifiedDate,index:selected});
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state == "SUCCESS")
            {
            	 var apigetState = JSON.parse(response.getReturnValue()).status;
                if(apigetState == 1){
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                    title : 'Error Message',
                    message: "An issue occured with the Mindmatrix widget, please contact admin",
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'error',
                    mode: 'dismissible' 
                });
        		toastEvent.fire();
                    $A.get("e.force:closeQuickAction").fire();
                }else{
                 	var data = JSON.parse(response.getReturnValue()).result;
                    var finalresponse=data.code;
                    var finalmessage=data.msg;
                    if(finalresponse==false)
                     {
                         var toastEvent = $A.get("e.force:showToast");
                             toastEvent.setParams({
                            title : 'Error',
                            message: finalmessage,
                            duration:' 5000',
                            key: 'info_alt',
                            type: 'error',
                            mode: 'dismissible' 
               		 		});
        				toastEvent.fire();
                         $A.get("e.force:closeQuickAction").fire();
                     }
                    else{
                component.set("v.IsSpinner",false);
                if(data)
                {
                    $(component.find("syncwithamp").getElement()).find('.Syncmessage').show();
                }
                else
                {
                    $(component.find("syncwithamp").getElement()).find('.Syncmessage').html('There is an error while syncing Contact with AMP').show();
                    
                }     
                
                
                $(component.find("submitbtn").getElement()).show();
                }
                }
            }
        });
        $A.enqueueAction(action);
    },
})