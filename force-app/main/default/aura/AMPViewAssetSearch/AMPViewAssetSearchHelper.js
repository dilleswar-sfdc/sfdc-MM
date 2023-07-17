({
    GetUserDetails:function(component,event,helper)
    {
        var action = component.get("c.GetUserDetails");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var data = response.getReturnValue();
                if(data != null){
                    component.set("v.userdetails",data);
                    helper.checkAPIDetails(component, event, helper);
                }
            }
        });
        $A.enqueueAction(action);
        
    },
    checkAPIDetails:function(component,event,helper)
    {
        var action = component.get("c.getAPIDetails");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var data = response.getReturnValue();
                var installurl = '';
                var token = '';
                var userJOStr = '';
                if(data != null){
                    installurl = data.MindMatrix__InstallUrl__c;
                    token = data.MindMatrix__Token__c;
                    userJOStr = data.MindMatrix__GroupJSON__c;
                }
                component.set("v.installurl",installurl);
                component.set("v.token",token);
                if(userJOStr == "" || typeof(userJOStr) == "undefined" || installurl == "" || typeof(installurl) == "undefined" || typeof(token)=="undefined"|| token == "")
                {
                    $('.spinner-div').hide();
                    $(component.find("MsgBoxAPISettings").getElement()).show();
                }
                else{
                    $('.apidetails').hide();
                    var userJO = JSON.parse(userJOStr);
                    var superadmin = userJO.superadmin;
                    var user = component.get("v.userdetails");
                    var profileId = user.ProfileId;
                    var group = "Sales";
                    if(superadmin.indexOf(profileId) > -1)
                        group = "Super Admin";
                    helper.GetAutoLoginURL(component,event,helper,user.Id,group);
                }
            }
        });
        $A.enqueueAction(action);
    },
    UpdateAPIDetails:function(component,event,helper,jo){
        var action = component.get("c.UpdateAPIDetails");
        action.setParams(jo);
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var data = response.getReturnValue();
                if(data){
                    $('.apidetails').hide();
                    helper.GetAutoLoginURL(component,event,helper);
                }
            }
        });
        $A.enqueueAction(action);
    },
    GetAutoLoginURL:function(component,event,helper,crmId,groupName){
        var action = component.get("c.GetAMPAutoLoginURL");
        var jo = {crmId:crmId,groupName:groupName};
        action.setParams(jo);
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var data = response.getReturnValue();
                var errDiv = component.find("MsgBoxRemoteSiteSettings").getElement();
                if(data.indexOf("error") > -1 && data.indexOf("Remote site settings") > -1)
                {
                    $(errDiv).show();
                }
                else
                {
                    var userInfo = JSON.parse(data);
                    if(userInfo.result)
                    {
                        if(userInfo.status == 1)
                        {
                            $(errDiv).find('.MsgTitle').html(userInfo.result.message)
                            $(errDiv).find('.pText').hide();
                            $(errDiv).show();
                        }
                        else if(userInfo.status == 0 && userInfo.result.userfound)
                        {
                            //var url = userInfo.result.autologinurl + "?returnurl=/?clean#search?text=";
                            var url = userInfo.result.installurl + "/?elt=" + userInfo.result.usersessionid + "&clean#search?text=";
                            component.set("v.viewassetsearchsrc",url);
                            helper.UpdateUserToken(component,event,helper,userInfo.result.usertoken);
                        }
                        
                    }
                    
                }
                $(".bot2-Msg1-2").click(function(){
                    $(errDiv).hide();
                });
                $('.spinner-div').hide();
                
            }
        });
        $A.enqueueAction(action);
    },
    UpdateUserToken:function(component,event,helper,usertoken){
        var action = component.get("c.UpdateSettingsForCurrentUser");
        var jo = {usertoken:usertoken};
        action.setParams(jo);
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var data = response.getReturnValue();
            }
        });
        $A.enqueueAction(action);
    }
})