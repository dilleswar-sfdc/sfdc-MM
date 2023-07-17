({
    widgetmsg:'',
    userstagecaretdown:'',
    userstageinfo:'',
    showprogress:'',
    divenablement:'',
    ampdashboard:'',
    linearplaybook:'',
    independentmodal:'',
    ampdashboardwithmenu:'',
    linearresponsive:'',
    sessionID:'',
    loaderhtml:'<div class="demo-only divspinner"><div role="status" class="slds-spinner slds-spinner_small spinpos"><div class="slds-spinner__dot-a"></div><div class="slds-spinner__dot-b"></div></div><div style="position: absolute;top: 10px;left: 50px;font-size: 25px;">Loading...</div></div>',
    AuthenticateCurrentUser:function(component, event, helper){
        var action = component.get("c.AuthenticateSFUser");
        action.setParams({
           "createuserviasso": component.get("v.createuserviasso")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var getapiState=JSON.parse(response.getReturnValue()).status;
                if(getapiState==1)
                {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                    title : 'Info Message',
                    message: "An issue occured with the Mindmatrix widget, please contact admin",
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'info',
                    mode: 'dismissible' 
                });
        		toastEvent.fire();
                }else{
                    var data = JSON.parse(response.getReturnValue());
                    var finalresponse=data.result.code;
                    var finalmessage=data.result.msg;
                    if(finalresponse==false)
                     {
                         var toastEvent = $A.get("e.force:showToast");
                             toastEvent.setParams({
                            title : 'Info Message',
                            message: finalmessage,
                            duration:' 5000',
                            key: 'info_alt',
                            type: 'info',
                            mode: 'dismissible' 
               		 		});
        				toastEvent.fire();
                     }
                    else{    
                        if(data.result.authentic)
                        {
                            helper.sessionID = data.result.usersessionid;
                            helper.UpdateToken(component,helper,data.result.usertoken,data.result.newuser);
                            if(!data.result.newuser){
                                helper.processcmp(component,helper);
                            }
                                     
                        }
                    }
                }
              }
        });
        $A.enqueueAction(action);
    },
    processcmp:function(component,helper){
        if(component.get("v.dependantwidget") == "oneapp")
        {
            helper.loadLinearPlaybookWidget(component,helper);
        }
        else
            helper.getDetails(component,helper); 
    },
    UpdateToken:function(component,helper,token,newuser){
        var action = component.get("c.UpdateToken");
        action.setParams({
            "token": token
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                if(newuser){
                    helper.processcmp(component,helper);
                }
            }
        });
        $A.enqueueAction(action);
    },
    createAuthorizedComponent : function(component)
    {
        $A.createComponent('c:AMPAuthorized',{} , function (contentComponent, status, error) {
            if (status === "SUCCESS") {
                component.set('v.unauthorized', contentComponent);
            } else {
                throw new Error(error);
            }
        });
	},
	
    loadLinearPlaybookWidget : function(component, helper) {
        helper.dynamicColorBinding(component,event,helper);
        this.ampdashboardwithmenu = $('.ampdashboardwithmenu').find('#enablementmenu');
        this.callApi(component, helper);
    },
    callApi:function(component, helper)
    {
        var jo = {};
        var $playbookWidget = $(helper.linearplaybook);
        var playbookWidgetData = JSON.parse(JSON.stringify(component.get("v.onboardingdata")));
        var originalTemplateData = playbookWidgetData.originalTemplateData != "" ? playbookWidgetData.originalTemplateData : "<template></template>";
        var $templateDoc =  $($.parseXML(originalTemplateData.extendeddata));
        var templateData = playbookWidgetData.templateData;
        var recentPlaybookProgress = playbookWidgetData.recentPlaybookProgress;
        var tabs = [];
        if($templateDoc.find("tab").length == 0)
        {
            $(".layout-linearplaybookwidget").hide();
            $(".layout-statuswiget").removeClass("slds-large-size--10-of-12").addClass("slds-large-size--12-of-12");
            $(".maindivspinner").hide();
            return;
        }
        $templateDoc.find("tab").each(function (i) {
            var $this = $(this);
            var tab = {};
            tab["id"] = $this.attr('id');
            tab["duedays"] = $this.attr('duedays');
            tab["stageindextext"] = i+1;
            tab["userlogourl"] = playbookWidgetData.userLogoUrl;
            tab["username"] = playbookWidgetData.userName;
            
            var tabName=$this[0].firstChild.textContent;
            //var tabName = $this.attr('tabname');
            if (tabName.length > 0) {
                tabName = decodeURIComponent(tabName.trim());
                tabName = tabName.trim();
            }
            tab["stagenamelabel"] = tabName;
            if(tabName.length > 20)
            {
                tabName = tabName.substring(0, 20) + "...";
            }
            tab["stagename"] = tabName;
            var stepindex = tab["id"].substring(2);
            var steps = [];
            var activeStage = 0;
            if(typeof recentPlaybookProgress != 'undefined')
                activeStage = recentPlaybookProgress.stageid;
            
            var currentStage = stepindex;
            tab["checkwholestage"] = false;
            if(currentStage < activeStage)
                tab["checkwholestage"] = true;
            $this.find('step').each(function(j){
                var step = {};
                var $this = $(this);
                var step={};
                step["id"] = $this.attr('id');
                step["text"] = decodeURIComponent($this[0].firstChild.textContent);
                step["ischeck"] = false;
                var currentindex = j;
                var currentStep = parseInt(step["id"].substring(4));
                var activeStep = -1;
                if(typeof recentPlaybookProgress != 'undefined')
                    activeStep = recentPlaybookProgress.stageindex;
                                
                if((tab["checkwholestage"]))
                    step["ischeck"] = true;
                else if(currentindex <= activeStep && currentStage <= activeStage)
                {
                    step["ischeck"] = true;
                }
                steps.push(step);
            });
            tab["steps"] = steps;
            tab["isactive"] = false;
            tab["isduedays"] = false;
            
            if(typeof recentPlaybookProgress != 'undefined'){
                if(tab["id"] == "tb"+recentPlaybookProgress.stageid)
                {
                    tab["isactive"] = true;
                    tab["percent"] = 50;
                    if(tab["duedays"] != "0")
                		tab["isduedays"] = true;
                }
            }
            tabs.push(tab);
        });
        component.set("v.tabs",tabs);
        var downiconcolor = component.get("v.subnavbgcolor");
        var progressdata = [];
        var progress = {};
        var calendarhtml = '<span class="slds-icon_container slds-icon-utility-event" data-aura-rendered-by="10:425;a"><span data-aura-rendered-by="13:425;a" class="lightningPrimitiveIcon" data-aura-class="lightningPrimitiveIcon"><svg class="slds-icon slds-icon_xx-small slds-icon-text-default" focusable="false" aria-hidden="true" data-key="event"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/_slds/icons/v7.31.0/utility-sprite/svg/symbols.svg#event"></use></svg></span></span>';
        var checkhtml =  '<span style="margin-left: -14px;" class="slds-icon_container slds-icon-utility-check" data-aura-rendered-by="10:425;a"><span data-aura-rendered-by="13:425;a" class="lightningPrimitiveIcon" data-aura-class="lightningPrimitiveIcon"><svg class="slds-icon slds-icon_xx-small slds-icon-text-default" style="fill:#16325c;" focusable="false" aria-hidden="true" data-key="check"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/_slds/icons/v7.31.0/utility-sprite/svg/symbols.svg#check"></use></svg></span></span>';
        var warninghtml = '<span class="slds-icon_container slds-icon-utility-warning" data-aura-rendered-by="10:425;a"><span data-aura-rendered-by="13:425;a" class="lightningPrimitiveIcon" data-aura-class="lightningPrimitiveIcon"><svg class="slds-icon slds-icon_xx-small slds-icon-text-default" focusable="false" aria-hidden="true" data-key="warning"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/_slds/icons/v7.31.0/utility-sprite/svg/symbols.svg#warning"></use></svg></span></span>';
        var downhtml = '<span style="border-right: 3px solid '+downiconcolor+';border-bottom: 3px solid '+downiconcolor+';display: inline-block;padding: 3px;transform: rotate(45deg);position:  absolute;left: 35px;top: 13px;"></span>';
        
        setTimeout(function(){
            $playbookWidget.find('.six-steps').click(function () {
                var install = component.get("v.install") + '//?elt=' + helper.sessionID;
                var src = install + '&clean#linearinternalplaybook/' + originalTemplateData.id;
                helper.showEnablement(helper,component,src);
            });
            
            
            var stageid = 0;
            
            if(typeof recentPlaybookProgress != 'undefined'){
                var $progressStageObj = $playbookWidget.find("#tb"+recentPlaybookProgress.stageid);
                stageid = parseInt(recentPlaybookProgress.stageid)-1;
                //mark all previous stages as completed
                if(recentPlaybookProgress.completedon == null){
                    $progressStageObj.prevAll().find('.stagedata').addClass('completed');
                    var stageDueDays = $progressStageObj.find('.playbookstage .stagedata .duedays').html();
                    //progress["stageDueDays"] = stageDueDays;
                    
                    var $tabProgressObj = $($.parseXML(templateData.extendeddata)).find('#tab' + recentPlaybookProgress.stageid);
                    var $progressSteps = $tabProgressObj.find('step');
                    var $lastCompletedSteps = $progressSteps.filter(function () {
                        return $(this).attr('taskcompletedon') != "";
                    }).last();
                    $('#' + $lastCompletedSteps.attr('id')).prevAll().addBack().prepend(checkhtml);
                    
                    if (stageDueDays != "0") {
                        $progressStageObj.find('.playbookstage').addBack().addClass('active');
                        
                        //var progressTemplate = $playbookWidget.find('#progressTemplate').html();
                        //var $progressObj = $(progressTemplate).appendTo($progressStageObj.find('.playbookstage'));
                        
                        var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                        var dueDate = new Date(recentPlaybookProgress.duedate);
                        var startDate = new Date(recentPlaybookProgress.createdon);
                        var currentDate = new Date();

                        progress["isWarning"] = false;
                        progress["progressclass"] = '';
                        if (currentDate > dueDate) {
                            progress["progressclass"] = 'action-req';
                            progress["isWarning"] = true;
                            //$progressObj.find('.progress-content .content').html(warninghtml+'<span>Past due action required</span>');
                        } else {
                            var dueDays = Math.round(Math.abs((dueDate.getTime() - startDate.getTime()) / (oneDay)));
                            var daysRemained = Math.round(Math.abs((dueDate.getTime() - currentDate.getTime()) / (oneDay)));
                            var daysLeft = (dueDays - daysRemained);
                            progress["daysleft"] = daysLeft;
                            progress["dueDays"] = dueDays;
                            //$progressObj.find('.progress-content .calendar').html(calendarhtml);
                            //$progressObj.find('.progress-content .daysleft').text((dueDays - daysRemained) + "/" + dueDays + " Days Left");
                        }
                        
                        progress["currentdate"] = currentDate;
                        progress["duedate"] = dueDate;
                        
                         
                        var totatSteps = $progressSteps.length;
                        var lastCompletedStepIndex = $progressSteps.index($lastCompletedSteps);
                        var completionPercentage = 0;
                        if (totatSteps > 0)
                            completionPercentage = Math.round(((lastCompletedStepIndex + 1)) / totatSteps * 100);
                        
                        progress["completionPercentage"] = completionPercentage;
                        //var $progressBar = $progressObj.find('.progress-bar');
                        //$progressBar.attr('aria-valuenow', completionPercentage);
                        //$progressObj.find('.progress-bar').css('width', completionPercentage + '%');
                        //$progressObj.find('.progress-bar-caption').text(completionPercentage + '%');
                    }
                    
                }else{//linear playbook completed
                    $playbookWidget.find('.playbookstage .stagedata').addClass('completed');
                    $(".layout-linearplaybookwidget").hide();
                    $(".layout-statuswidget").removeClass("slds-large-size--10-of-12").addClass("slds-large-size--12-of-12");
                    return;
                }
            }
            var completedStages = Array.apply(null, {length: stageid}).map(function(value, index){
                return index + 1;
            });
            
            progress["completedStages"] = completedStages;
            var iscompletedstage = (completedStages.length > 0) ? true: false;
            progress["iscompletedstage"] = iscompletedstage;
            
            if(completedStages.length > 0)
            {
             var color = component.get("v.mainnavbgcolor")+ "!important";
             //$("#tb"+completedStages.join(",#tb")).find('.stepdetails').prepend(checkhtml);
             $(helper.linearplaybook).find("#tb"+completedStages.join(",#tb")).find('.stepdetails').css("color",color);
             $(helper.linearplaybook).find("#tb"+completedStages.join(",#tb")).find('.stepdetails .stepdetails-txt').css("color",color);
             $(helper.linearplaybook).find("#tb"+completedStages.join(",#tb")).find('.complete-state').show();
             //$("#tb"+completedStages.join(",#tb")).find('.stagedata').addClass('completed');
             
             //$('#' + $lastCompletedSteps.attr('id')).prevAll().addBack().prepend(checkhtml);
            }
            progressdata.push(progress);
            component.set("v.progressdata",progress);
            
            
            try{
                if ($(helper.linearresponsive).hasClass('slick-initialized')) {
                    $(helper.linearresponsive).slick('destroy');
                }
                $(helper.linearresponsive).slick({
                    dots: true,
                    infinite: true,
                    speed: 300,
                    slidesToShow: component.get("v.sliderlength"),
                    slidesToScroll: component.get("v.sliderlength"),
                });
            }
            catch(e){
                e.message;
                }
            
            var stageTemplate = $playbookWidget.find('#stageTemplate');
            $(stageTemplate).find('.slick-dots li:eq('+stageid+') button').click();
            var activestage = $(stageTemplate).find('.linear-responsive.slick-initialized.slick-slider.slick-dotted');
            $(activestage).prepend('<div class="active-pointer"><div class="profile-bubble"><img style="width:40px;" src= "' + playbookWidgetData.userLogoUrl + '" /></div><div class="userstageinfo">You are here '+downhtml+'</div><h4 class="widgetmsg">Hello '+playbookWidgetData.userName+', following are the steps that will help you get started.</h4></div>');
            
            
            //$(activestage).find('.stagedata').before('<div class="active-pointer"><div class="profile-bubble"><img style="width:40px;" src= "' + playbookWidgetData.userLogoUrl + '" /></div><div class="userstageinfo">You are here</div>'+downhtml+'<h4 class="widgetmsg">Hello '+playbookWidgetData.userName+', following are the steps that will help you get started.</h4></div>');
            //$('#stageTemplate').find('.stagedata').prepend('<div class="active-pointer" style="width:100px;"><div class="profile-bubble"><img style="position: absolute;top: 40px;left:-40%;border-radius: 50px;height:40px;opacity:1 !important;" src= "' + playbookWidgetData.userLogoUrl + '" /></div></div>');
            
            
            //$(activestage).find('.active-pointer').append($('.widgetmsg'));
            
            $(activestage).find('.userstageinfo,.userstagecaretdown,.widgetmsg,.downicon').delay(4000).animate({ opacity: 0 });
            $('#tb'+parseInt(parseInt(stageid)+1)).parent().hover(function () {
			    $(activestage).find('.userstageinfo,.userstagecaretdown,.widgetmsg,.downicon').animate({ opacity: 1 });
            }, function () {
                $(activestage).find('.userstageinfo,.userstagecaretdown,.widgetmsg,.downicon').animate({ opacity: 0 });
            });
            $(stageTemplate).show();
            $(".maindivspinner").hide();
        },1000);
        
    },
    getDetails:function(component,helper)
    {
        var action = component.get("c.GetPersonaThemeForCurrentUser");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var apigetState = JSON.parse(response.getReturnValue()).status;
                if(apigetState == 1){
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                    title : 'Info Message',
                    message: "An issue occured with the Mindmatrix widget, please contact admin",
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'info',
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
                            title : 'Info Message',
                            message: finalmessage,
                            duration:' 5000',
                            key: 'info_alt',
                            type: 'info',
                            mode: 'dismissible' 
               		 		});
        				toastEvent.fire();
                     }
                    else{
                        
                        var result = data.result;
                        var pagecss = result.pagecss;
                        component.set("v.userid",result.userid.toString());
                        component.set("v.mainnavfontcolor",pagecss.mainnavfontcolor);
                        component.set("v.mainnavbgcolor",pagecss.mainnavbgcolor);
                        component.set("v.subnavbgcolor",pagecss.subnavbgcolor);
                        component.set("v.install",result.install);
                        helper.getLinearPlaybookData(component,helper);
                    }
                }
            }
        });
        action.setBackground();
        $A.enqueueAction(action);
    },
    getLinearPlaybookData:function(component,helper)
    {
        var action = component.get("c.getLinearPlaybookWidgets");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS"){
                var apigetState = JSON.parse(response.getReturnValue()).status;
                if(apigetState == 1){
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                    title : 'Info Message',
                    message: "An issue occured with the Mindmatrix widget, please contact admin",
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'info',
                    mode: 'dismissible' 
                });
        		toastEvent.fire();
                }
                else{
                    var data = JSON.parse(response.getReturnValue()).result;
                     var finalresponse=data.code;
                     var finalmessage=data.msg;
                    if(finalresponse==false)
                     {
                         $(".linear-playbook-widget").html("<div class='slds-box'>Sorry!"+' '+finalmessage+"</div>");
                         var toastEvent = $A.get("e.force:showToast");
                             toastEvent.setParams({
                            title : 'Info Message',
                            message: finalmessage,
                            duration:' 5000',
                            key: 'info_alt',
                            type: 'info',
                            mode: 'dismissible' 
               		 		});
        				toastEvent.fire();
                     }
                    else{
                    component.set("v.onboardingdata",data);
                    helper.loadLinearPlaybookWidget(component,helper);
                }
            }
           }
        });
     action.setBackground();
     $A.enqueueAction(action);
    },
    openModal:function(helper,component,src)
    {
        var modal = $(helper.independentmodal);
        $(modal).find("#iframe-modal").attr("src",src);
        $(modal).show();
    },
    showEnablement:function(helper,component,src)
    {
        window.name = src;
        if(component.get("v.dependantwidget") == "community")
        {
            var urlEvent = $A.get("e.force:navigateToURL");
            urlEvent.setParams({
                "url": '/enablement'
            });
            urlEvent.fire();            
            return;
        }        
        if(component.get("v.dependantwidget") == "oneapp")
        {
            var urlEvent = $A.get("e.force:navigateToURL");
            urlEvent.setParams({
                "url": "/one/one.app#/n/Enablement"
            });
            urlEvent.fire();  
        }
        else{
            $(helper.ampdashboardwithmenu).click();
        }
        return;
    },
    dynamicColorBinding : function(component,event,helper){
        document.documentElement.style.setProperty('--playbookwidth', component.get("v.playbookwidth")+'px');
       	document.documentElement.style.setProperty('--mainnavbgcolor',component.get('v.mainnavbgcolor'));
	},
    
})