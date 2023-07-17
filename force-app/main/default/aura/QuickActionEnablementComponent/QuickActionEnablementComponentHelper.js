({
    quickaction:'',
    showquickmodal:'',
    quickactioncontainer:'',
    DOTSINTERVAL:null,
    NOOFDOTS:3,
    DECREASING:true,
    GetUserByEmail : function(component, event, helper) {
        var action = component.get('c.getUserByEmail');
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS"){
                var response = JSON.parse(response.getReturnValue());
                if(response.result.userfound){
                    component.set("v.quickactionsrc",window.name);
                    component.set("v.classtohide",'show');
                    $(helper.quickaction).show();
                    helper.setCookie("showplaybook", true);
                    setTimeout(function(){
                        component.set('v.messagevisibility',"hide");
                        clearInterval(helper.DOTSINTERVAL);
                    },1000);
                    return;
                } else{
                    helper.showToastMessage('Authentication', 'info', 'Please create the user')
                    setTimeout(function(){
                        component.set('v.messagevisibility',"hide");
                        clearInterval(helper.DOTSINTERVAL);
                    },1000);
                }           
               
            }
        });
        $A.enqueueAction(action);
    },
    createUser : function(component,event,helper){
        var action = component.get("c.AuthenticateSFUser");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var response = JSON.parse(response.getReturnValue());
                if(response.result.userfound == true){
                	
                	window.location.reload();
                }
            }
        });
        $A.enqueueAction(action);
    },
    bindcomponent : function(component, event, helper) {
        if(component.get("v.isFirst"))
        {
            component.set("v.isFirst","false");
            $(helper.showquickmodal).show();
        }
        //helper.getContactDetails(component, event, helper);
        $(".amptype").click(function(){
            component.set("v.quickactionsrc",component.get("v."+$(this).attr("id")+"url"));
            component.set("v.classtohide",'show');
            $(helper.quickaction).show();
            $(helper.showquickmodal).hide();
            
        });
    },
     getCookie:function(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        if(decodedCookie != null || decodedCookie != 'undefined' || decodedCookie != "")
        {
            var ca = decodedCookie.split(';');
            for(var i = 0; i <ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
        }
        return "";
    },
    setCookie:function(cname, cvalue) {
        var d = new Date();
        document.cookie = cname + "=" + cvalue + ";path=/";
    },
    getDetails:function(component,event,helper)
    {
        var action = component.get("c.getPersonaThemeViaEmail");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data = JSON.parse(response.getReturnValue());
                if(data.result.message == "user not logged in")
                {
                    helper.checkSSO(component,event,helper);
                    return;
                }
                var result = data.result;
                var pagecss = result.pagecss;
                var userid = result.userid.toString();
                var mainnavfontcolor = pagecss.mainnavfontcolor;
                var mainnavbgcolor = pagecss.mainnavbgcolor;
                var subnavbgcolor = pagecss.subnavbgcolor;
                var install = result.install;
                var jo = {"isEnablement":true,"dependantwidget":"oneapp","userid":userid,"mainnavbgcolor":mainnavbgcolor,"mainnavfontcolor":mainnavfontcolor,"install":install,"subnavbgcolor":subnavbgcolor};
                helper.showplaybook(component,event,helper,jo);
            }
        });
        action.setBackground();
        $A.enqueueAction(action);
    },
    showplaybook:function(component,event,helper,jo)
    {
        $A.createComponent('c:AMPInternalPlaybookComponent', jo, function (contentComponent, status, error) {
            if (status === "SUCCESS") {
                component.set('v.AMPInternalPlaybookComponent', contentComponent);
                var spinner = component.find("mySpinner");
                $A.util.toggleClass(spinner, "slds-hide");
            } else {
                throw new Error(error);
            }
        });  
    },
    checkSSO:function(component,event,helper)
    {
        var action = component.get("c.getSSODetails");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var data = response.getReturnValue();
                var baseurl = data.MindMatrix__BaseUrl__c;
                var siteurl = data.MindMatrix__SiteUrl__c;
                var clientid = data.MindMatrix__ClientID__c;
                var token = data.MindMatrix__Token__c;
                component.set("v.siteurl",siteurl);
                component.set("v.baseurl",baseurl);
                component.set("v.clientid",clientid);
                component.set("v.token",token);
                component.set("v.lastssotime",data.MindMatrix__LastSSOTime__c);
                if(baseurl == "" || typeof(baseurl) == "undefined" || typeof(siteurl) == "undefined" || siteurl == "" ||typeof(clientid)=="undefined"|| clientid == "" ||typeof(token)=="undefined"|| token == "")
                {
                    $('.maindivspinner').hide();
                    $('.ssodetails').show();
                }
                else
                    helper.singleSignOn(component,event,helper,false);
            }
        });
        $A.enqueueAction(action);
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
                if(data)
                    helper.singleSignOn(component,event,helper,false);
            }
        });
        $A.enqueueAction(action);
    },
    singleSignOn : function(component,event,helper,callsso)
    {
        var currenturl = window.location.href;
     	var lastssotime = component.get("v.lastssotime");
        var expiresInHours = 24;
        var callSSO = callsso;
        if(lastssotime === undefined || lastssotime == "undefined")
            callSSO = true;
        else
        {
            var date = new Date(lastssotime);
            date = date.setHours(date.getHours() + expiresInHours);
            var now = new Date();
            if(now >= date)
                callSSO = true;            
        }
        if(callSSO && currenturl.indexOf("visualEditor") < 0)
        {
            var action = component.get("c.updateLastSSOTime");
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS")
                {
                    var regex = /^(.*[\\\/])/g;
                    var sfUrl = regex.exec(currenturl)[0] + "MindMatrix__Enablement";
                    var url = component.get("v.baseurl")+'/Account/ExternalLogin?clientID='+component.get("v.clientid");
                    var retUrl = encodeURIComponent(sfUrl+"?islightning=true");
                    window.location.href = url + "&returnUrl="+ retUrl;
                    return;
                }
            });
            action.setBackground();
            $A.enqueueAction(action);
        }
        else{
            helper.usersetupdone(component,event,helper);
        }
    },
    usersetupdone : function(component,event,helper)
    {
        var action = component.get("c.getUserDetails");
        action.setParams({
            "persona": "channelpartner"
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var apiresponse = response.getReturnValue();
                if(apiresponse.indexOf("error") > -1)
                {
                    if(apiresponse.toLowerCase().indexOf("remote site setting") > -1)
                    {
                        $('#MsgBoxBackDel').show();
                    }
                    return;
                }
                var data = JSON.parse(response.getReturnValue());
                var userid = data["result"]["userid"].toString();
                if(userid == "0")
                {
                    helper.singleSignOn(component,event,helper,true);
                    return;
                }
                var _usersetupdone = data["result"]["usersetupdone"].toString();
                var install = data["result"]["install"].toString();
                
                var usersetupdone = _usersetupdone.toLowerCase()=="true"?true:false;
                component.set("v.userid",userid);
                component.set("v.usersetupdone",_usersetupdone);
                component.set("v.install",install);
                component.set("v.dummyiframesrc",install+'/v4u/public/loginoauth2user.aspx?token='+component.get('v.token')+'&useremail='+data.result.personatheme.useremail);
                
                if(usersetupdone)
                    helper.getDetails(component, event, helper);
                else
                    helper.showSelfServe(component,event,helper,install);
            }
        });
        $A.enqueueAction(action);
    },
    showSelfServe:function(component,event,helper,install)
    {
        var url = install +"/welcome?clean&sfurl="+window.location.href;
        var isCommunity = document.location.pathname.indexOf("one.app") > -1?false: true;
     	window.name = '{"isQuickaction":"false","src":"'+url+'","install":"'+install+'"}';
        helper.setCookie("showplaybook", false);
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": isCommunity?"/enablement":"/one/one.app#/n/MindMatrix__Enablement"
        });
        urlEvent.fire();
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