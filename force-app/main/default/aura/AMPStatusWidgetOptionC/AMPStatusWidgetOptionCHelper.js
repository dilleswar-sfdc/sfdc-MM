({
    ampdashboard:'',
    modal:'',
    togglebtn:'',
    togglebg:'',
    openaccordion:'',
    bgcolor:'',
    statuswidgetbody:'',
    independentmodal:'',
    statuswidget:'',
    createaccordion:true,
    statsdata:'',
    modalforclose:'',
    userlanguage:'',
    sessionID:'',
    toslanguage:'',
    AuthenticateCurrentUser:function(component, event, helper){
        var action = component.get("c.AuthenticateSFUser");
         action.setParams({
           "createuserviasso": component.get("v.createuserviasso")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                 var data = JSON.parse(response.getReturnValue());
                var getapiState=data.status;
                if(data.result.tos == false){
                	component.set('v.isOpen',true);
                    var url = data.result.installurl + "/?elt=" + data.result.usersessionid + "&returnurl=toschangepasswordsetting";
                    component.set("v.iframesrc",url);
                }
                if(getapiState==1)
                {
                    component.set("v.noData",true);
                    component.set("v.errorMsg","Please wait while we're updating your profile.");
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                    title : 'processing...',
                    message: "Please wait while we're updating your profile.",
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'info',
                    mode: 'dismissible' 
                });
        		toastEvent.fire();
                }  
                else{                     
                   
                    var finalresponse=data.result.code;
                    var finalmessage=data.result.msg;
                    if(finalresponse==false)
                     {
                         component.set("v.noData",true);
                    	 component.set("v.errorMsg","Sorry!"+" "+"In StatusWidget"+" "+finalmessage);
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
                            component.set("v.showwidget","block");
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
            helper.bindPage(component,helper);
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
    createAccordianComponent: function(component,helper){
        //this.createSingleComponent(component,"AMPAnnualTargetProgressReport","AnnualTargetProgressReport",helper);
        this.createSingleComponent(component,"AMPLast5emailcampaign","last5emailcampaign",helper);
    },
	bindPage : function(component,helper) {
        
        //component.set("v.tosContent",$.getlocalizedcontent('8'));
        helper.createaccordion = true;
        this.statuswidget = $(".statuswidget_option_c");
        this.ampdashboard = $(".ampdashboard").closest("html");
        this.modal = $('.ampdashboard .demo-modal').not('.modal-independant');
        this.statuswidgetbody = $(".statuswidgetbody");
        this.independentmodal = $(this.statuswidget).find(".modal-independant");
        this.togglebtn = $(".reports-toggle-btn");
        this.togglebg = $(this.statuswidget).find(".reports-toggle-btn");
        this.openaccordion = $(".stats_option_c-accordian");
        this.bgcolor = $(this.statuswidget);
        this.callApi(component,helper);
	},
    callApi:function(component,helper) {
        
            var action = component.get("c.getStatusWidget");
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    
                    var apigetState = JSON.parse(response.getReturnValue()).status;
                if(apigetState == 1){
                    component.set("v.noData",true);
                    component.set("v.errorMsg","An issue occured with the Mindmatrix widget, please contact admin");
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
                          component.set("v.noData",true);
                          component.set("v.errorMsg","Sorry!"+""+"In StatusWidget"+""+finalmessage);
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
                            var dataStatus = JSON.parse(response.getReturnValue());
                            var failed = dataStatus.status == 1 || data.result.statuswidgets == undefined;
                            if(!failed)
                                failed = data.result.statuswidgets.length < 1;
                            if(failed)
                            {
                                $(".statuswidget_option_c .statuswidgetbody .statusdatacount").html("<div style='padding: 20px;border: 1px solid #80808066; border-radius: 3px;'>Sorry! We could not find any data to show you.</div>");
                                $(helper.statuswidgetbody).find(".divspinner").hide();
                                $(helper.statuswidgetbody).css("height","");
                                $(helper.statuswidgetbody).find(".slds-wrap").show();
                                return;
                            }
                            var override = component.get("v.isoverridesalesforce");
                            try{
                                var widgets = data.result.statuswidgets.map(function(o){return o.name});
                                var oppPresent = widgets.includes("opportunitieswon")||widgets.includes("opportunitypipeline")||widgets.includes("totalopportunities");
                                override = override && oppPresent;
                            }
                            catch(e){
                                override = false;
							}
                            if(override)
                            {
                                var action1 = component.get("c.GetSalesforceOppDetails");
                                action1.setCallback(this, function(response) {
                                    var state = response.getState();
                                    if (state === "SUCCESS") {
                                        var _data = JSON.parse(response.getReturnValue());
                                        
                                        $.each(data.result.statuswidgets,function(i,item)
                                               {
                                                   if(item.name == "opportunitieswon")
                                                   {
                                                       item.widgetsrc = _data[0].OppwonUrl;
                                                       item.data.row_count = _data[0].oppwoncount;
                                                       item.data.amount = _data[0].oppwonamount;
                                                       if(item.data.amount.indexOf('nbsp') > -1)
                                                           item.data.amount = 0;
                                                       item.data.currencytext = _data[0].currencytext;     
                                                   }
                                                   else if(item.name == "opportunitypipeline")
                                                   {
                                                       item.widgetsrc = _data[0].OppPipelineUrl;
                                                       item.data.row_count = _data[0].pipelinecount;
                                                       item.data.amount = _data[0].pipelineamount;
                                                       if(item.data.amount.indexOf('nbsp') > -1)
                                                           item.data.amount = 0;
                                                       item.data.currencytext = _data[0].currencytext;     
                                                   }
                                                       else if(item.name == "totalopportunities")
                                                       {
                                                           item.widgetsrc = _data[0].ALLOppUrl;
                                                           item.data.row_count = _data[0].totaloppcount;
                                                           item.data.amount = _data[0].totaloppamount;
                                                           if(item.data.amount.indexOf('nbsp') > -1)
                                                               item.data.amount = 0;
                                                           item.data.currencytext = _data[0].currencytext;     
                                                       }
                                                   
                                               });
                                        
                                        helper.bindData(component,helper,data)
                                        //return;
                                    }
                                    else{
                                        $.each(data,function(i,item){
                                            if(item.name == "create")
                                            {
                                                item.widgetsrc = '';
                                                item.data.row_count = 0;
                                                item.data.amount = 0;
                                                item.data.currencytext = 'NA'; 
                                            }
                                        });
                                        helper.bindData(component,helper,data);
                                    }
                                });
                                //action1.setBackground();
                                $A.enqueueAction(action1);
                            }
                            else
                                helper.bindData(component,helper,data);
                     }
                    }
                }
                
            });
            //action.setBackground();
            $A.enqueueAction(action);
        
    },
    GetInterestColor:function (interesttype) {
        var str = "";
        switch (interesttype.toLowerCase()) {
            case "active":
                str = "#C05C1A";
                break;
            case "notsure":
                str = "#C0C1C5";
                break;
            case "other":
                str = "#CCC691";
                break;
            case "hot":
                str = "#E50909";
                break;
            case "closed":
                str = "#100F0F";
                break;
            case "high":
                str = "#32B12C";
                break;
            case "medium":
                str = "#4DB9FD";
                break;
            case "low":
                str = "#DBCA00";
                break;
            case "notinterested":
                str = "#100F0F";
                break;
        }
        return str;
    },
    bindData: function(component,helper,data)
    {
        var colorData = data.result.colordata;
        var ringColor = "#e51937";
        var valueColor = "#000";
        var backGroundColor = colorData.backgroundColor;
        var insideRingColor = colorData.insideRingColor;
        var titleColor = colorData.titleColor;
        if(colorData.ringColor != null)
            ringColor = colorData.ringColor;
        if(colorData.valueColor != null)
            valueColor = colorData.valueColor;
        var color = {ringColor:ringColor,valueColor:valueColor,backGroundColor:backGroundColor,insideRingColor:insideRingColor,titleColor:titleColor};
        component.set("v.colorData",color);
        for(var i = 0 ;i<=data.result.statuswidgets.length -1 ; i++)
        {
            var _data = data.result.statuswidgets[i];
            if(helper.userlanguage==null)
                helper.userlanguage="English";
            var userLanguage = helper.userlanguage.toLowerCase();
            try{
                var _header = JSON.parse(_data.title);
	            _data.title = _header[userLanguage];
            }
            catch(e){}
        }
        helper.statsdata = data.result.statuswidgets;
 		/*helper.statsdata = data.result.statuswidgets.filter(function(e){
           return e.name != "mdfavailable";
        });*/
        component.set("v.stat2",helper.statsdata);
        helper.dynamicColorBinding(component,event,helper);
        setTimeout(function(){
            
            var e = $.grep(helper.statsdata,function(a){return a.name == "engagementlevel"});
            if(e.length > 0)
            {
                try{
                    var obj = e[0];
                    var data = obj.data;
                    var engagementMessage = data.engagementMessage;
                    if(engagementMessage.length > 0)
                    {
                        var name = engagementMessage[0].name;
                        var english = name.english;
                        $('.statuswidgets.engagementlevel .stat-label').text(english);
                    }
				}
                catch(e)
                {}
                
            }
        },500);
        $(helper.statuswidgetbody).find(".divspinner").hide();
        $(helper.statuswidgetbody).css("height","");
        $(helper.statuswidgetbody).find(".slds-wrap").show();
        
        return;
    },
    formatMoney:function(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    },
    createSingleComponent:function(component,type,auraattr,helper)
    {
        var mainnavbgcolor = component.get("v.mainnavbgcolor");
        var mainnavfontcolor = component.get("v.mainnavfontcolor");
        var install = component.get("v.install") + '//?elt=' + helper.sessionID;
        var userid = component.get("v.userid");
        var jo = {"dependantwidget": component.get("v.dependantwidget"), "userid":userid,"mainnavbgcolor":mainnavbgcolor,"mainnavfontcolor":mainnavfontcolor,"install":install};
        
        $A.createComponent('MindMatrix:'+type, jo, function (contentComponent, status, error) {
            if (status === "SUCCESS") {
                helper.createaccordion = false;
                component.set('v.'+auraattr, contentComponent);
            } else {
                throw new Error(error);
            }
        });
    },
    displaymodal : function(component,event,helper,type)
    {
        
        var modal = '';
        var selecthtml = '';
        var e = event.currentTarget;
        var isEmail = $(e).attr("title");
        if(type == "engagementlevel")
        {
            var message = "";
            
            return;
        }
        else if(type == "lastemailcampaigngraph")
        {
            var email = $.parseJSON($(e).find("span").html());
            var emailId = 0;
            try{
                emailId = parseInt(email.id);
            }
            catch(e){
                emailId = 0;
            }
            if(emailId == 0 || email.senton == "")
                return;
            var install = component.get("v.install") + '//?elt=' + helper.sessionID;
            var src = install+"&clean#communicate/email/" + email.id + "/report";
            
            selecthtml = '<option value="'+install+'&clean#communicate/email/'+ email.id +'/report">';
            selecthtml += '<span>Report</span></option>';
            selecthtml += '<option value="'+install+'&clean#communicate/email/'+ email.id +'/message">';
            selecthtml += '<span class="dropdown-icon"><span data-aura-rendered-by="341:348;a" class="slds-icon_container null slds-icon__svg--default"><svg class="slds-icon slds-icon-text-default" aria-hidden="true"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#comments"></use></svg></span></span>';
            selecthtml += '<span>Message</span></option>';
            selecthtml += '<option value="'+install+'&clean#communicate/email/'+ email.id + '/receipients">';
            selecthtml += '<span class="dropdown-icon"><span data-aura-rendered-by="341:348;a" class="slds-icon_container null slds-icon__svg--default"><svg class="slds-icon slds-icon-text-default" aria-hidden="true"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#groups"></use></svg></span></span>';
            selecthtml += '<span>Receipients</span></option>';
            selecthtml += '<option value="'+install+'&clean#communicate/email/'+ email.id + '/interest">';
            selecthtml += '<span class="dropdown-icon"><span data-aura-rendered-by="341:348;a" class="slds-icon_container null slds-icon__svg--default"><svg class="slds-icon slds-icon-text-default" aria-hidden="true"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#internal_share"></use></svg></span></span>';
            selecthtml += '<span>Opened</span></option>';
            selecthtml += '<option value="'+install+'&clean#communicate/email/'+ email.id + '/bounced">';
            selecthtml += '<span class="dropdown-icon"><span data-aura-rendered-by="341:348;a" class="slds-icon_container null slds-icon__svg--default"><svg class="slds-icon slds-icon-text-default" aria-hidden="true"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#ban"></use></svg></span></span>';
            selecthtml += '<span>Bounced</span></option>';
            selecthtml += '<option value="'+install+'&clean#communicate/email/'+ email.id + '/links">';
            selecthtml += '<span class="dropdown-icon"><span data-aura-rendered-by="341:348;a" class="slds-icon_container null slds-icon__svg--default"><svg class="slds-icon slds-icon-text-default" aria-hidden="true"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#new_window"></use></svg></span></span>';
            selecthtml += '<span>Links</span></option>';
            selecthtml += '<option value="'+install+'&clean#communicate/email/'+ email.id + '/unopened">';
            selecthtml += '<span class="dropdown-icon"><span data-aura-rendered-by="341:348;a" class="slds-icon_container null slds-icon__svg--default" style="transform: scaleX(-1);"><svg class="slds-icon slds-icon-text-default" aria-hidden="true"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#internal_share"></use></svg></span></span>';
            selecthtml += '<span>Unopened</span></option>';
            selecthtml += '<option value="'+install+'&clean#communicate/email/'+ email.id + '/unsubscribed">';
            selecthtml += '<span class="dropdown-icon"><span data-aura-rendered-by="341:348;a" class="slds-icon_container null slds-icon__svg--default"><svg class="slds-icon slds-icon-text-default" aria-hidden="true"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#error"></use></svg></span></span>';
            selecthtml += '<span>Unsubscribed</span></option>';
            
            var title = "Sent Email Report ("+email.name + ")";
        }
           
        else if(isEmail == '')
            return;
            
        if(component.get("v.dependantwidget") != "oneapp")
        {
            modal = $(this.independentmodal);
            $(modal).find("#amp-select").hide();
            if(selecthtml !== '')
            {
                $(modal).find("#selectvalues").html(selecthtml);
                $(modal).find("#amp-select").show();
            }
        }
        else{
            var ampdashboard = $(this.ampdashboard);
            $(ampdashboard).toggleClass("modal-open");
            $(ampdashboard).toggleClass("fullscreen");
            modal = $(this.modal);
            $(modal).find("#amp-select").hide();
            if(selecthtml !== '')
            {
                $(modal).find("#selectvalues").html(selecthtml);
                $(modal).find("#amp-select").show();
            }
        }
        $(".demo-only").hide();
        var e = event.currentTarget;
         if(type != "lastemailcampaigngraph")
         {
             var title = $(e).attr("title");
             title = title.replace(/\w\S*/g, function(title){return title.charAt(0).toUpperCase() + title.substr(1).toLowerCase();});
             var src = $(e).parent().find('.stat-chart').find('.src').html().replace(/&amp;/g, '&');
         }   
           
        $(modal).find("#modal-heading").html(title);
        $(modal).find("iframe").attr("src",src);
        $(modal).show();
    },
    isEmailCampaign:function(component,event,helper){
        
        var email = $.parseJSON($(e).find("span").html());
        var install = component.get("v.install") + '//?elt=' + helper.sessionID;
        var src = install+"&clean#/communicate/email/" + email.id + "/report";
        
        var selecthtml = '<option value="'+install+'&clean#communicate/email/'+ email.id +'/report">';
        selecthtml += '<span>Report</span></option>';
        selecthtml += '<option value="'+install+'&clean#communicate/email/'+ email.id +'/message">';
        selecthtml += '<span class="dropdown-icon"><span data-aura-rendered-by="341:348;a" class="slds-icon_container null slds-icon__svg--default"><svg class="slds-icon slds-icon-text-default" aria-hidden="true"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#comments"></use></svg></span></span>';
        selecthtml += '<span>Message</span></option>';
        selecthtml += '<option value="'+install+'&clean#communicate/email/'+ email.id + '/receipients">';
        selecthtml += '<span class="dropdown-icon"><span data-aura-rendered-by="341:348;a" class="slds-icon_container null slds-icon__svg--default"><svg class="slds-icon slds-icon-text-default" aria-hidden="true"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#groups"></use></svg></span></span>';
        selecthtml += '<span>Receipients</span></option>';
        selecthtml += '<option value="'+install+'&clean#communicate/email/'+ email.id + '/interest">';
        selecthtml += '<span class="dropdown-icon"><span data-aura-rendered-by="341:348;a" class="slds-icon_container null slds-icon__svg--default"><svg class="slds-icon slds-icon-text-default" aria-hidden="true"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#internal_share"></use></svg></span></span>';
        selecthtml += '<span>Opened</span></option>';
        selecthtml += '<option value="'+install+'&clean#communicate/email/'+ email.id + '/bounced">';
        selecthtml += '<span class="dropdown-icon"><span data-aura-rendered-by="341:348;a" class="slds-icon_container null slds-icon__svg--default"><svg class="slds-icon slds-icon-text-default" aria-hidden="true"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#ban"></use></svg></span></span>';
        selecthtml += '<span>Bounced</span></option>';
        selecthtml += '<option value="'+install+'&clean#communicate/email/'+ email.id + '/links">';
        selecthtml += '<span class="dropdown-icon"><span data-aura-rendered-by="341:348;a" class="slds-icon_container null slds-icon__svg--default"><svg class="slds-icon slds-icon-text-default" aria-hidden="true"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#new_window"></use></svg></span></span>';
        selecthtml += '<span>Links</span></option>';
        selecthtml += '<option value="'+install+'&clean#communicate/email/'+ email.id + '/unopened">';
        selecthtml += '<span class="dropdown-icon"><span data-aura-rendered-by="341:348;a" class="slds-icon_container null slds-icon__svg--default" style="transform: scaleX(-1);"><svg class="slds-icon slds-icon-text-default" aria-hidden="true"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#internal_share"></use></svg></span></span>';
        selecthtml += '<span>Unopened</span></option>';
        selecthtml += '<option value="'+install+'&clean#communicate/email/'+ email.id + '/unsubscribed">';
        selecthtml += '<span class="dropdown-icon"><span data-aura-rendered-by="341:348;a" class="slds-icon_container null slds-icon__svg--default"><svg class="slds-icon slds-icon-text-default" aria-hidden="true"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#error"></use></svg></span></span>';
        selecthtml += '<span>Unsubscribed</span></option>';
        
        var title = "Email - "+email.name;
        helper.openModal(component,src,title,selecthtml);
    },
    toggleaccordion : function(component,event,helper){
        $(this.togglebtn).find(".toggle-btn,.invert-btn").toggleClass("togglecolor");
        //$(this.togglebtn).find(".invert-btn").toggleClass("togglecolor");
        $(this.togglebtn).toggleClass("toggle-bg");
        $(this.openaccordion).toggleClass("openaccordion");
        $(this.bgcolor).toggleClass("bg-color");
        if(helper.createaccordion){
            helper.createAccordianComponent(component,helper);
        }
        $(this.openaccordion).find(".divspinner").hide();
        $(this.openaccordion).css("height","");
    },
    getDetails:function(component,helper)
    {
        var action = component.get("c.GetPersonaThemeForCurrentUser");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var apigetState = JSON.parse(response.getReturnValue()).status;
                if(apigetState == 1){
                    component.set("v.noData",true);
                    	 component.set("v.errorMsg","Please wait while we're updating your profile.");
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                    title : 'Processing...',
                    message: "Please wait while we're updating your profile.",
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
                         component.set("v.noData",true);
                         component.set("v.errorMsg","Sorry!"+""+"In StatusWidget"+""+finalmessage);
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
                        helper.userlanguage = result.pagedata.userLanguage;
                        component.set("v.mainnavfontcolor",pagecss.mainnavfontcolor);
                        component.set("v.mainnavbgcolor",pagecss.mainnavbgcolor);
                        component.set("v.subnavbgcolor",pagecss.subnavbgcolor);
                        component.set("v.install",result.install);
                        var installWithSession = component.get("v.install") + '//?elt=' + helper.sessionID;
                        component.set("v.installwithsession",installWithSession);
                        helper.bindPage(component,helper);
                    }
                }
            }
        });
        action.setBackground();
        $A.enqueueAction(action);
    },
     dynamicColorBinding:function(component,event,helper){
        var colorData=component.get("v.colorData");
         document.documentElement.style.setProperty('--mainnavbgcolor', component.get("v.mainnavbgcolor"));
         document.documentElement.style.setProperty('--valueColor', colorData.valueColor);
         document.documentElement.style.setProperty('--insideRingColor', colorData.insideRingColor);
         document.documentElement.style.setProperty('--titleColor', colorData.titleColor);
         document.documentElement.style.setProperty('--valueColor', colorData.valueColor);
         document.documentElement.style.setProperty('--ringColor', colorData.ringColor);
         document.documentElement.style.setProperty('--engagementcolor', component.get("v.engagementcolor"));
         document.documentElement.style.setProperty('--backGroundColor', colorData.backGroundColor);
    }
})