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
                   $A.util.addClass(component.find("redirect"),"slds-hide");
                    component.set('v.spinner',true);
					helper.bindcomponent(component, event, helper);
                }
                else
                {
                    $(component.find('syncwithamp').getElement()).find('.Syncmessage').show();
                }
            }
        });
        $A.enqueueAction(action);
    },
    bindcomponent : function(component, event, helper) {
        helper.getleadDetails(component, event, helper);
        
    },
    getleadDetails:function(component, event, helper)
    {
        
        var action = component.get("c.getleads");
        action.setParams({
            "leadId": component.get("v.recordId")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var lead = (response.getReturnValue())[0];
                //$A.get("e.force:closeQuickAction").fire();
                component.set("v.lead",lead);
                helper.getAmpSendEmailURL(component, event, helper);
            }
        });
        $A.enqueueAction(action);
    },
    getAmpSendEmailURL:function(component, event, helper)
    {        
        var action = component.get("c.getAMPRequestLeadURL");
        action.setParams({
            Lead:component.get("v.lead"),
            task:"dripcampaign"
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                 var apiStatus=JSON.parse(response.getReturnValue()).status;
                if(apiStatus==1)
                {
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
                    component.set("v.spinner",false);
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
                            message: 'In Nurture Campaign'+' '+finalmessage,
                            duration:' 5000',
                            key: 'info_alt',
                            type: 'error',
                            mode: 'dismissible' 
               		 });
        				toastEvent.fire();
                  		 $A.get("e.force:closeQuickAction").fire();
                     component.set("v.spinner",false);
                 }
                else
                {
                    	var source = data.url+'&tpapp=sfdc';
             			helper.showCommunityAsset(component,'communityasset',source,helper);
                        //var data = JSON.parse(response.getReturnValue());
                        /*var isCommunity = document.location.pathname.indexOf("one.app") >= -1?false: true;
                        helper.setCookie("showplaybook", false);
                        window.name = '{"isQuickaction":"false","src":"'+data.url+'"}';
                        var urlEvent = $A.get("e.force:navigateToURL");
                        urlEvent.setParams({
                            "url": isCommunity?"/enablement":"/one/one.app#/n/MindMatrix__Enablement"
                        });
                        urlEvent.fire();*/
            	//$("#iframe-modal-lead").attr("src",data.result.url);
            		//$A.get("e.force:closeQuickAction").fire();
                     component.set("v.spinner",false);
                        }
               }
            }
        });
        $A.enqueueAction(action);  
    },
    setCookie:function(cname, cvalue) {
        document.cookie = cname + "=" + cvalue + ";path=/";
    },
    showCommunityAsset:function(component,container,source,helper)
    {	component.set('v.modalopen',true);
        $A.createComponent('c:AMPCommunityAsset', {subsource:source}, function (contentComponent, status, error) {
            if (status === "SUCCESS") {
                component.set('v.'+container, contentComponent);
            } else {
                throw new Error(error);
            }
        });    
        
    }
})