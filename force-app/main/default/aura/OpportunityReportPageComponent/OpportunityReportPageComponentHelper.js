({
    msgbox:'',
    oppiframe:'',
    invalidapi:'',
    eltandeln:'',
    projecttypeid:0,
    MMOpportunityId:0,
    getOpportunityDetails:function(component,event,helper){
        var action = component.get("c.getopportunityrecord");
        action.setParams({opportunityid: component.get("v.recordId")});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data = response.getReturnValue();
                if(data == null || data == undefined || data.length == 0)
                    return;
                
                var opportunity = data;
               
                //proceed
                helper.processOpportuntiy(component,event,helper,opportunity);
                
            }
        });
        $A.enqueueAction(action);
    },
    processOpportuntiy:function(component,event,helper,opportunity)
    {
        component.set("v.oppt",opportunity);// set the contact in the aura:attr
        helper.checkContactExistenceInMM(component,event,helper,opportunity,"0");
    },
    checkContactExistenceInMM : function(component,event,helper,opportunity,selected){
        var action = component.get("c.getOpportunityReport");
        
        action.setParams({ oppID:opportunity.Id});
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
                    var data = result.result[0];
                    var finalresponse=data.code;
                    var finalmessage = data.msg;
                    if(finalresponse == false){
                        helper.showToastMessage('Info Message', 'info', finalmessage);
                        return;
                    } 
                    
                    if(data.isExist){
                        helper.projecttypeid = data.projecttypeid;
                        helper.MMOpportunityId=data.id;
                        helper.saveOpportunityDetail(component,event,helper,opportunity,"0",false);
                        helper.checkUserIntegrated(component,event,helper);
                    }
                    else
                        helper.saveOpportunityDetail(component,event,helper,opportunity,"0",true);
                    
                }
                
            }
        });
        $A.enqueueAction(action);
    },
    saveOpportunityDetail: function(component,event,helper,opportunity,selected,callUserIntegrated)
    {
        var action = component.get("c.saveOpportunityReport");
        action.setParams(helper.getParamsForSaveContact(opportunity, selected));
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
                            helper.projecttypeid = data.projecttypeid;
                            helper.MMOpportunityId=data.projectid;
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
    getParamsForSaveContact:function(opportunity, selected)
    {
        var id = opportunity.Id.toString();
        var name = opportunity.Name == "" || opportunity.Name == undefined ? "" : opportunity.Name;
        var amount = opportunity.Amount == "" || opportunity.Amount == undefined ? "0":opportunity.Amount.toString();
        var stage = opportunity.StageName == "" || opportunity.StageName == undefined ? "" : opportunity.StageName.toString();
        var closedate = opportunity.CloseDate == "" || opportunity.CloseDate == undefined ? "" : opportunity.CloseDate.toString();
        var isClosed = opportunity.IsClosed == undefined ? "" : opportunity.IsClosed.toString();
        var isWon = opportunity.IsWon == undefined ? "" : opportunity.IsWon.toString();
        return {
            oppID:id,
            name:name,
            amount:amount,
            stage:stage,
            closedate:closedate,
            isClosed:isClosed,
            isWon:isWon
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
                    if(component.get("v.showOpportunityAssetFeed"))
                        helper.showAssets(component, url+component.get('v.assetSource')+helper.projecttypeid+'&assetid='+helper.MMOpportunityId+'&linkids='+helper.MMOpportunityId,helper);
                    if(component.get('v.showOpportunityPlaybookFeed'))
                        helper.showPlaybook(component,url+component.get('v.playbookSource')+helper.projecttypeid+'&assetid='+helper.MMOpportunityId+'&linkids='+helper.MMOpportunityId,helper);
                        
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