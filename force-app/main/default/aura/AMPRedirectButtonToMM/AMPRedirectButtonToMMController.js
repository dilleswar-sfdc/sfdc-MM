({
    doInit : function(component, event, helper) {
        component.set('v.loadedText',component.get("v.Text"));
        var buttonid=component.find('buttoneset');
        $A.util.addClass(buttonid, 'btndil');
        document.documentElement.style.setProperty('--width', component.get("v.Width")+'px');
        document.documentElement.style.setProperty('--height', component.get("v.Height")+'px');
        document.documentElement.style.setProperty('--color', component.get("v.color"));
        document.documentElement.style.setProperty('--backgroundcolor', component.get("v.Backgroundcolor"));
        window.addEventListener('message',function(evt){
            var install = component.get("v.install");
            if(evt.origin == install)
            {  
                if(evt.data == "closetosmodal")
                {
                    
                        component.set("v.tosCheck",false);
                        var redirecturl=component.get('v.install')+"/?elt="+component.get('v.sessionId');
                        var urlEvent = $A.get("e.force:navigateToURL");
                        urlEvent.setParams({
                            "url": redirecturl
                        });
                        urlEvent.fire();
                    
                }
                
            }
        },false);
    },
	handleClick : function(component, event, helper) {
        component.set('v.loadedText','Loading...');
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title : 'Processing...',
            message: "Please wait while we're updating your profile.",
            duration:' 10000',
            type: 'success',
            mode: 'pester'
        });
        toastEvent.fire();
        if(component.get('v.buttonClick')){
            component.set('v.buttonClick',false);
            var action = component.get("c.AuthenticateSFUser");
            action.setCallback(this, function(response) {
                component.set('v.buttonClick',true);
                var state = response.getState();
                if (state === "SUCCESS") {
                    var getapiState=JSON.parse(response.getReturnValue()).status;
                    if(getapiState==1)
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
                        }
                        else{
                            if(data.result.authentic)
                            {  
                                component.set("v.install",data.result.installurl);
                                component.set('v.sessionId',data.result.usersessionid);
                                if(data.result.userfound == true){
                                    if(data.result.tos == false){
                                        component.set('v.tosCheck',true);
                                        var url = data.result.installurl + "/?elt=" + data.result.usersessionid + "&returnurl=toschangepasswordsetting";
                                        component.set("v.iframesrc",url);
                                    }else{
                                        var redirecturl=data.result.installurl+"/?elt="+data.result.usersessionid;
                                        var urlEvent = $A.get("e.force:navigateToURL");
                                        urlEvent.setParams({
                                            "url": redirecturl
                                        });
                                        urlEvent.fire();
                                    }
                                }
                                component.set("v.loadedText",component.get("v.Text"));
                            }
                        }
                    }
                }
            });
            $A.enqueueAction(action);
        }
    }
	
})