({
    scriptLoaded : function(component, event, helper) {
        helper.Lightning = $('#lightning');
        helper.LightningPlusSSO = $('#lightningplussso');
        helper.SSODetails = $('.SSODetails');
        helper.NonSSODetails = $('.NonSSODetails');
        helper.CheckOption(component, event, helper);
        helper.GetCurrentSSODetails(component, event, helper);
    },
    authenticateSSO : function(component, event, helper) {
        var isSSO = component.get("v.issso");
        var baseurlvalue = '';
        var siteurlvalue = '';
        var clientidvalue = '';
        var tokenvalue = '';
        if(isSSO){
            var baseurl = component.find('fieldbaseurl');
            if(!baseurl.get("v.validity").valid)
                return false;
            else
                baseurlvalue = baseurl.get("v.value");
            var siteurl = component.find('fieldsiteurl');
            if(!siteurl.get("v.validity").valid)
                return false;
            else
                siteurlvalue = siteurl.get("v.value");
            var clientid = component.find('fieldclientid');
            if(!clientid.get("v.validity").valid)
                return false;
            else
                clientidvalue = clientid.get("v.value");
            var tokenvar = component.find('fieldtoken');
            if(!tokenvar.get("v.validity").valid)
                return false;
            else
                tokenvalue = tokenvar.get("v.value");
        }
        var regex = /^(.*[\\\/])/g;
        var currenturl = window.location.href;
        var sfUrl = regex.exec(currenturl)[0] + "MindMatrix__MM_Settings";
        var url = baseurlvalue+'/Account/ExternalLogin?clientID='+clientidvalue;
        var retUrl = encodeURIComponent(sfUrl+"?islightning=true");
        window.location.href = url + "&returnUrl="+ retUrl;
        return;
    },
    handleRadioClick : function(component, event, helper) {
        var target = event.target;
        component.set("v.issso",$(target).attr('id') == 'lightningplussso');
        helper.CheckOption(component, event, helper);
    },
    redirect:function(component,event,helper)
    {
        component.set("v.issso",false);
        var isCommunity = document.location.pathname.indexOf("one.app") > -1?false: true;
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/one/one.app#/n/MindMatrix__AMP"
        });
        urlEvent.fire();
        $A.get("e.force:closeQuickAction").fire()
    },
    savessodetails:function(component, event, helper)
    {
        var isSSO = component.get("v.issso");
        var baseurlvalue = '';
        var siteurlvalue = '';
        var clientidvalue = '';
        var tokenvalue = '';
        if(isSSO){
            var baseurl = component.find('fieldbaseurl');
            if(!baseurl.get("v.validity").valid)
                return false;
            else
                baseurlvalue = baseurl.get("v.value");
            var siteurl = component.find('fieldsiteurl');
            if(!siteurl.get("v.validity").valid)
                return false;
            else
                siteurlvalue = siteurl.get("v.value");
            var clientid = component.find('fieldclientid');
            if(!clientid.get("v.validity").valid)
                return false;
            else
                clientidvalue = clientid.get("v.value");
            var tokenvar = component.find('fieldtoken');
            if(!tokenvar.get("v.validity").valid)
                return false;
            else
                tokenvalue = tokenvar.get("v.value");
        }
        
        component.set("v.siteurl",siteurlvalue);
        component.set("v.baseurl",baseurlvalue);
        component.set("v.clientid",clientidvalue);
        component.set("v.token",tokenvalue);
        
        var jo = {issso:isSSO, siteurl:siteurlvalue,baseurl:baseurlvalue,clientid:clientidvalue,token:tokenvalue};
        helper.UpdateSSODetails(component,event,helper,jo);
    },
    handleBlur: function (component, event) {
    	var value = component.find("fieldsiteurl").get("v.value");
        if(value != '')
    		$("#installurl").html("("+value+"/*)");
    }
})