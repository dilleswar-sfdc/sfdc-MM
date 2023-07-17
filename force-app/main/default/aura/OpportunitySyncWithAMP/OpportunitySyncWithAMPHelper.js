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
    syncWithAmp: function(component, event,helper)
    {
        var action1 = component.get("c.getopportunityrecord");
        action1.setParams({opportunityid: component.get("v.recordId"),});
            action1.setCallback(this, function(response){
            var state = response.getState();
                if(state = "SUCCESS")
                {
                    var data = response.getReturnValue();
                     helper.saveOppDetail(component,event,helper,data);
                }
        });
        $A.enqueueAction(action1);  
    },
    saveOppDetail: function(component,event,helper,data)
    {
        var action2 = component.get("c.saveOpportunityReport");
        component.set("v.oppt",data);
        var id = data.Id.toString();
        var name = data.Name == "" || data.Name == undefined ? "" : data.Name;
        var amount = data.Amount == "" || data.Amount == undefined ? "0":data.Amount.toString();
        var stage = data.StageName == "" || data.StageName == undefined ? "" : data.StageName.toString();
        var closedate = data.CloseDate == "" || data.CloseDate == undefined ? "" : data.CloseDate.toString();
        var isClosed = data.IsClosed == undefined ? "" : data.IsClosed.toString();
        var isWon = data.IsWon == undefined ? "" : data.IsWon.toString();
        action2.setParams({oppID:id,name:name,amount:amount,stage:stage,closedate:closedate,isClosed:isClosed,isWon:isWon});
        action2.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
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
                 	var data = JSON.parse(response.getReturnValue());
                    var finalresponse=data.result.code;
                    var finalmessage=data.result.msg;
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
                var apiresponse = response.getReturnValue();
                if(apiresponse.indexOf("error") > -1)
                {
                    if(apiresponse.toLowerCase().indexOf("remote site setting") > -1)
                    {
                        $('#MsgBoxBackDel').show();
                    }
                    return;
                }
               
                if(data.result.message.indexOf("successfully") > -1)
                {
                    component.set("v.IsSpinner",false);
                    $(component.find('syncwithamp').getElement()).find('.Syncmessage').show();
                    $(component.find('submitbtn').getElement()).show();
                    return; 
                }
            }
                }
            }
        });
        $A.enqueueAction(action2);
    },
})