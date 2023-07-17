({
    Lightning: '',
    LightningPlusSSO: '',
    SSODetails : '',
    NonSSODetails : '',
    CheckOption : function(component, event, helper) {
        var issso = component.get("v.issso");
        $(helper.Lightning).attr('checked',false);
        $(helper.LightningPlusSSO).attr('checked',false);
        $(helper.SSODetails).hide();
        $(helper.NonSSODetails).hide();
        $(helper.Lightning).parent().removeClass('active');
        $(helper.LightningPlusSSO).parent().removeClass('active');
        if(issso)
        {
            $(helper.LightningPlusSSO).attr('checked',true);
            component.set('v.lightningplussso',true);
            $(helper.SSODetails).show();
            $(helper.LightningPlusSSO).parent().addClass('active');
        }
        else{
            $(helper.Lightning).attr('checked',true);
            $(helper.NonSSODetails).show();
            $(helper.Lightning).parent().addClass('active');
        }
    },
    UpdateSSODetails:function(component,event,helper,jo)
    {
        var action = component.get("c.UpdateSSODetails");
        action.setParams(jo);
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var data = response.getReturnValue();
                if(data){
                    helper.showToast(component,event,helper,true,'MM settings updated successfully');
                }
                else
                    helper.showToast(component,event,helper,false,'Problem while saving MM settings');
            }
        });
        $A.enqueueAction(action);
    },
    GetCurrentSSODetails:function(component,event,helper)
    {
        var action = component.get("c.getSSODetails");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var data = response.getReturnValue();
                var baseurl = '';
                var clientid = '';
                var siteurl = '';
                var token = '';
                var lastssotime = '';
                var isSSO = false;
                if(data != null){
                    baseurl = data.MindMatrix__BaseUrl__c;
                    clientid = data.MindMatrix__ClientID__c;
                    siteurl = data.MindMatrix__SiteUrl__c;
                    token = data.MindMatrix__Token__c;
                    lastssotime = data.MindMatrix__LastSSOTime__c;
                    isSSO = data.MindMatrix__IsSSO__c;
                }
                component.set("v.siteurl",siteurl);
                component.set("v.baseurl",baseurl);
                component.set("v.clientid",clientid);
                component.set("v.token",token);
                component.set("v.lastssotime",lastssotime);
                component.set("v.issso",isSSO);
                helper.CheckOption(component,event,helper);
                
            }
        });
        $A.enqueueAction(action);
    },
    showToast : function(component, event, helper,status,message) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title: status?"Success":"Failed",
            message: message,
            type:status?"success":'error'
        });
        toastEvent.fire();
    }
})