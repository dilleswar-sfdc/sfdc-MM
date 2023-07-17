window._PostMessage = {
    genericPostMessageCalled:false,
    listedForMMInternalPlaybookPM: (jo) =>{
        
        window.addEventListener('message', evt =>{
        	
        	if(jo.installUrl != evt.origin)
            	return;
        	var component= jo.component;
        	var helper = jo.helper;
        	var event = jo.event;
        if(typeof(evt.data.indexOf) == 'undefined')
        	return;
            if(evt.data.indexOf('internalplaybook')>-1){
        		$('html').addClass('mmdashboard');
        $A.createComponent('MindMatrix:MMCustomModal', {subsource:evt.data,getExpandedValue:component.get('v.enablePostMessage')}, function (contentComponent, status, error) {
                        if (status === "SUCCESS") {
                            component.set('v.MMCustomModal', contentComponent);
                        } else {
                            throw new Error(error);
                        }
                    });    
                    
                }
    	}, false);  
    },
    listenGenericPM:(jo)=>{
        
        //window._PostMessage.jo = jo;
        //window.removeEventListener('message',window._PostMessage.messageFn);
        if(!window._PostMessage.genericPostMessageCalled)
        {
        	
        	window._PostMessage.genericPostMessageCalled = true;
        	window.addEventListener('message', (evt)=>
            {
        try{
                var component= jo.component;
                var helper = jo.helper;
                var event = jo.event;
        if(component.get("v.enablePostMessage")){
        	if(typeof(evt.data.indexOf) == 'undefined')
        		return;
                if(location.origin == evt.origin){//when called from inside sf
                    if(evt.data =="sfiFrameMinimize")
                    {
                    //$A.enqueueAction(component.get('c.toggleexpansion'));
                        helper.changeClasss(component, event, helper,'notexpanded');
                        component.set('v.height',helper.onLoadHeight+'px;') ; 
        				window._PostMessage.removemmdashboardclass();
                        
                    }
                    if(evt.data =="sfiFrameMaximize")
                    {
                    //$A.enqueueAction(component.get('c.toggleexpansion'));
                        helper.changeClasss(component, event, helper,'expanded');
                        component.set('v.height',helper.onLoadHeight+'px;') ; 
                        window._PostMessage.addmmdashboardclass();
                    }
                }
                else if(jo.installUrl != evt.origin)
                    return;

        	if(jo.installUrl != evt.origin)//check installurl is same
            	return;
                if(evt.data.indexOf("onloadWidgetHeight") > -1)
                {
                    var widgethgt= evt.data.split("onloadWidgetHeight")[1];
                    if(component.get('v.iframeheight') == null || component.get('v.iframeheight') ==  undefined)
                    helper.onLoadHeight=widgethgt;
                    component.set('v.height',widgethgt+'px;') ;
                } 
                if(evt.data =="sfiFrameMaximize")
                {
                    var length = $('.MindMatrixSendAMPEmail').length;
                 if(length == 0){
                    helper.changeClasss(component, event, helper,'expanded');
                    component.set('v.height',"calc(100vh - 30px)");
                    window._PostMessage.addmmdashboardclass();
                 }else
                     window._PostMessage.removemmdashboardclass();
                    //var cmpTarget = component.find('mainDiv');
                    //$A.util.addClass(cmpTarget, 'addoverflow');
                }
                if(evt.data =="sfiFrameMinimize")
                {
                    //$A.enqueueAction(component.get('c.toggleexpansion'));
                    helper.changeClasss(component, event, helper,'notexpanded');
                    component.set('v.height',helper.onLoadHeight+'px;') ;
                    if(evt.currentTarget.length == 3)
                        window._PostMessage.addmmdashboardclass();
                 	else
                    	window._PostMessage.removemmdashboardclass();
                    
                }
                if(evt.data.indexOf("dropDownHeight") > -1)
                {
                    var dropdownhgt= evt.data.split("dropDownHeight")[1];
                    var dropheight= parseInt(dropdownhgt) + parseInt(helper.onLoadHeight);
                    component.set('v.height',dropheight+'px;') ;
                } 
                if(evt.data == "setOnLoadHeight")
                {
                    component.set('v.height',helper.onLoadHeight+'px;') ; 
                }
				}			
			}
            catch(e){console.log('MindMatrix Post Message Error :: ' + e)}
    
            },false);
    	}
    },
        removemmdashboardclass:()=>{
            $('html').removeClass('mmdashboard');
        },
        addmmdashboardclass:()=>{
            $('html').addClass('mmdashboard');
        }
         
}
