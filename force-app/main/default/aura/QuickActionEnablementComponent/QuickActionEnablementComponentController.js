({   
    scriptLoaded: function(component,event,helper)
    {
        
        helper.quickactioncontainer = $('.quickactioncontainer');
        helper.quickaction = $("#quickactionenablement");
        helper.showquickmodal = $('#quickactionmodal');
        helper.quickactionbtn = $(".quickactionbtn");
        helper.playbookcontainer = $(".playbookcontainer");
     	helper.DOTSINTERVAL = setInterval(function(){
            if(helper.NOOFDOTS == 3)
                helper.DECREASING = true;
            if(helper.NOOFDOTS == 0)
                helper.DECREASING = false;
            if(helper.DECREASING)
                --helper.NOOFDOTS;
            else
                ++helper.NOOFDOTS;
            var str = "Please wait"
            for(var i=0;i<=helper.NOOFDOTS-1;i++)
            	str += '.';
            
            component.set('v.messagetext',str);
                
        },500);
     	var height = window.innerHeight - 127;
        component.set("v.height",height);
        $(helper.quickactioncontainer).closest("html").removeClass("dont_show_modal");
        //$(".dont_show_modal").show();
        var quicksrc = component.get("v.quickactionsrc");
        var showPlaybook = helper.getCookie("showplaybook") == "true" ? true:false;     
        if(showPlaybook && quicksrc == "")
        {
            $(helper.playbookcontainer).show();
            helper.getDetails(component,event,helper);
        }
        else
        {
            //if(window.name == )
            $(helper.quickactioncontainer).show();
            var isObject = true;
            try{
                JSON.parse(window.name);
                isObject = true;
            }
            catch(e){
                isObject = false;
            }
            if(!isObject)
            {
                $(helper.quickactionbtn).hide();
                helper.GetUserByEmail(component,event,helper);
                return;
                /*$(helper.quickactionbtn).hide();
                component.set("v.quickactionsrc",window.name);
                component.set("v.classtohide",'show');
                $(helper.quickaction).show();
                helper.setCookie("showplaybook", true);
                return;*/
            }
            var data = JSON.parse(window.name);
            component.set("v.isQuickaction",data.isQuickaction);
            var isQuickaction = component.get("v.isQuickaction") == "true"? true: false;
            if(isQuickaction)
            {
                $(helper.quickactionbtn).show();
                component.set("v.playbookurl",data.playbookurl);
                component.set("v.printurl",data.printurl);
                component.set("v.ebookurl",data.ebookurl);
                component.set("v.weburl",data.weburl);
                component.set("v.btnname",data.btnname);
                helper.bindcomponent(component, event, helper);
            }
            else
            {
                if(data.install != "" && data.install != undefined)
                    component.set("v.install",data.install);
                $(helper.quickactionbtn).hide();
                component.set("v.quickactionsrc",data.src);
                component.set("v.classtohide",'show');
                $(helper.quickaction).show();
            }
        }
        helper.setCookie("showplaybook", true);
        
        window.addEventListener('message',function(evt){
            var install = component.get("v.install");
            if(evt.origin == install)
            {
                if(evt.data == "CloseSendEmail")
                {
                    setTimeout(function(){
                        $('.modal-close').click();
                    },1000);
                }
                else if(evt.data == "UserSetUpDone")
                {
                    if(component.get("v.quickactionsrc").indexOf("sfurl=") != -1)
                    {
                        var prevurl = component.get("v.quickactionsrc").split("sfurl=")[1];
                    window.location.href = prevurl;
                    }                    
                }
            }
        },false);
    },
    showmodal: function(component,event,helper)
    {
        $(helper.showquickmodal).show();
    },
    modalclose: function(component,event,helper)
    {
    	$(helper.showquickmodal).hide();
	},
    
    
})