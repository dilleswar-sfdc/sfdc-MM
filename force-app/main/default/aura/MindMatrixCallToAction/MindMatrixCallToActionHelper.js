({
    AuthenticateCurrentUser:function(component, event, helper){
        var action = component.get("c.AuthenticateSFUser");
        action.setParams({
            "createuserviasso": component.get("v.createuserviasso")
        });
        action.setCallback(this, function(response) {
            
            var state = response.getState();
            if (state === "SUCCESS") {
                var data = JSON.parse(response.getReturnValue());
                var redirectionOption = component.get('v.RedirectionOption');
                var url = data.result.installurl + "/?elt=" + data.result.usersessionid;
                var sourceUrl= component.get("v.sourceUrl");
                component.set("v.loadedText",component.get("v.Text"));
                if(redirectionOption == "Popup"){
                    component.set("v.isModalOpen", true);
                    var iframeurl = url+ "&clean#" +sourceUrl ;
                    component.set("v.iframesrc",iframeurl);
                }
                else if(redirectionOption == "Enablement"){
                    window.name = url+ "&clean#" + sourceUrl;
                    var urlEvent = $A.get("e.force:navigateToURL");
                    urlEvent.setParams({
                        "url": '/enablement'
                    });
                    urlEvent.fire();
                    return;
                }
                    else if(redirectionOption == "ExternalRedirection"){
                        var urlEvent = $A.get("e.force:navigateToURL");
                        urlEvent.setParams({
                            "url": url
                        });
                        urlEvent.fire();
                    }
                        else if(redirectionOption == "InternalRedirection"){
                            var urlEvent = $A.get("e.force:navigateToURL");
                            urlEvent.setParams({
                                "url": '/'+ sourceUrl
                            });
                            urlEvent.fire();
                        }
            }
        });
        
        $A.enqueueAction(action);
    }
})