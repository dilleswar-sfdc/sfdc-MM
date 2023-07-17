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
		var action = component.get("c.getleads");
        action.setParams({
            "leadId":component.get("v.recordId")
        });
            action.setCallback(this, function(response){
            var state = response.getState();
                if(state = "SUCCESS")
                {
                    var lead = (response.getReturnValue())[0];
                    component.set("v.lead",lead);
                     helper.saveLeadDetail(component,event,helper,lead,"0");
                }
        });
        $A.enqueueAction(action);
	},
    saveLeadDetail: function(component,event,helper,lead,selected)
    {
        var leadId = lead.Id;
        var account = '';
        var industry = '';
        account = lead.Company;
        if(lead.Account != null){
            account = lead.Account.Name;
            industry = lead.Account.Industry == undefined || lead.Account.Industry == null ? '':lead.Account.Industry;
        }
        var selected = selected;
        if(lead.Email == undefined || lead.Email == "")
        {
            $(component.find("syncwithamp").getElement()).find('.Syncmessage').html("This Lead doesn't have Email So, the AMP Stats will not be shown.").show();
            component.set("v.IsSpinner",false);
            return;
        }
        var action1 = component.get("c.saveLeadDetails");
        component.set("v.firstname",lead.FirstName);
        component.set("v.lastname",lead.LastName);
        
        action1.setParams({ FirstName : lead.FirstName,Email:lead.Email,LastName:lead.LastName,Company:account,Industry:industry,leadID:lead.Id,updatedon:lead.LastModifiedDate,index:selected});
        action1.setCallback(this, function(response){
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
                }
                else{
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
                    $(component.find("syncwithamp").getElement()).find('.Syncmessage').html('There is an error while syncing this lead with AMP').show();
                }                
                
                $(component.find("submitbtn").getElement()).show();
            }
                }
            }
        });
        $A.enqueueAction(action1);
    },
})