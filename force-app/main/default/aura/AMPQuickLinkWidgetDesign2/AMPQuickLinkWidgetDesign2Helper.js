({
    ampdash:'',
    ampdashboard:'',
    modal:'',
    independentmodal:'',
    quicklinkdesign2body:'',
    divenablement:'',
    ampdashboardwithmenu:'',
    quicklinkbtn2:'',
    bindPage:function(component,helper)
    {
        this.ampdash = $(".ampdashboard");
        this.ampdashboardwithmenu = $('.ampdashboardwithmenu').find('#enablementmenu');
        this.ampdashboard = $(this.ampdash).closest("html");
        this.modal = $(this.ampdash).find('.demo-modal').not('.modal-independant');
        helper.quicklinkdesign2body = $(".quicklinkdesign2body");
        this.quicklinkbtn2 = $('.quicklinkdesignbutton2');
        this.independentmodal = $(this.quicklinkbtn2).find(".modal-independant");
        
        this.divenablement = $('#divenablement');
        this.callApi(component,helper);
    },
    callApi:function(component,helper) {
        var action = component.get("c.getQuickLinkWidgets");
        action.setParams({
            "design": '2'
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            
            if (state === "SUCCESS") {
                var apigetState = JSON.parse(response.getReturnValue()).status;
                if(apigetState == 1){
                    component.set("v.nodata",true);
                    component.set("v.errorMsg","An issue occured with the Mindmatrix widget, please contact admin");
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
                         component.set("v.nodata",true);
                         component.set("v.errorMsg","Sorry!"+""+"In QuickLindWidget"+""+finalmessage);
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
                     }else{
                         var dataStatus = JSON.parse(response.getReturnValue());
                         $(helper.quicklinkdesign2body).find(".qgrid").hide();
                         
                         var quicklinkdesign= $(".quicklinkdesignbutton2");
                         if(dataStatus.status == 1 || data.result.quicklinkwidgets.length < 1)
                         {
                             $(this.quicklinkbtn2).find(".quicklinkdesign2body").html("<div style='padding: 20px;border: 1px solid #80808066; border-radius: 3px;'>Sorry! We could not find any data to show you.</div>").show();
                             $(quicklinkdesign).find(".divspinner").hide();
                             return;
                         }
                         var colorData = data.result.colorData;
                         if(colorData.box_shadow == "apply"){
                             $(quicklinkdesign).find(".template").addClass("boxshadowapplied");
                             colorData.boxShadowCustom = colorData.box_shadow_color + " " + colorData.box_shadow_hoffset + "px " + colorData.box_shadow_voffset +"px "+colorData.box_shadow_blur+"px "+colorData.box_shadow_spread + "px";
                         }
                         component.set("v.colorData",colorData);
                         data = data.result.quicklinkwidgets;
                         helper.dynamicColorBinding(component,event,helper);
                         if(component.get("v.isoverridesalesforce"))
                         {
                             var action1 = component.get("c.GetSalesforceDetails");
                             action1.setCallback(this, function(response) {
                                 var state = response.getState();
                                 if (state === "SUCCESS") {
                                     try{
                                         var _data = JSON.parse(response.getReturnValue());
                                         $.each(data,function(i,item){
                                             if(item.name == "create")
                                             {
                                                 item.data.lead_count = _data[0].leadcount;
                                                 item.data.opportunity_count = _data[0].oppcount;
                                                 item.data.amount = _data[0].Amount;
                                                 if(_data[0].Amount.indexOf('nbsp') > -1)
                                                     item.data.amount = 0;
                                                 item.data.currencyText = _data[0].currencytext;
                                                 //component.set("v.opportunityurl",_data[0].ALLOppUrl);
                                             }
                                         });
                                     }catch(e){}
                                     
                                     
                                     helper.binddata(component,helper,data)
                                     return;
                                 }
                                 else{
                                     $.each(data,function(i,item){
                                         if(item.name == "create")
                                         {
                                             item.data.lead_count = 0;
                                             item.data.opportunity_count = 0;
                                             item.data.amount = 0;
                                             item.data.currencyText = "NA";
                                         }
                                     });
                                     helper.binddata(component,helper,data);
                                 }
                             });
                             action1.setBackground();
                             $A.enqueueAction(action1);
                         }
                         else
                             helper.binddata(component,helper,data);
                     }
                }
            }

        });
        action.setBackground();
        $A.enqueueAction(action);
    },
    binddata:function(component,helper,data)
    {
        for(var i=0;i<=data.length-1;i++)
        {
            var name = data[i].name;
            if(name == "")
                continue;
            var $obj = $('.grid_'+name)
            $obj.show();
            var _data = data[i].data;
            if(component.get("v.language")==null)
                component.set("v.language","English");
            var userLanguage = component.get("v.language").toLowerCase();
            try{
                var _header = JSON.parse(_data.widgetheader);
	            _data.widgetheader = _header.items[userLanguage];
                
            }
            catch(e){}
            try{
                var _description = JSON.parse(_data.widgetdescription);
                _data.widgetdescription = _description.items[userLanguage];
                
            }
            catch(e){}
            try{
                var _widgettooltip = JSON.parse(_data.widgettooltip);
	            _data.widgettooltip = _widgettooltip.items[userLanguage];
                if(_data.widgettooltip != '' && _data.widgettooltip != null && _data.widgettooltip != undefined)
                	$obj.find(".design2").attr('title',decodeURIComponent(_data.widgettooltip));
            }
            catch(e){
                _data.widgettooltip = data[i].linkname;
            }
            var install = component.get("v.install") + "&clean";
            if(name == "helpmesell" || name == "marketingcampaign" || name == "marketingcampaignsreport" || name == "viewassets" || name == "helpmemarket" || name == "helpmebuildbrand" || name == "trainingcertification" || name == "productpromotion" || name == "gettrained" || name == "watchvideo")
            {
                var row_count = _data.row_count;
                var description = _data.widgetdescription;
                var header = _data.widgetheader;
                var widgetname = _data.widgetname;
                var configname = _data.configname;
                var linktype = _data.linktype;
                var linktoid = _data.linktoid;
                var personalization = _data.personalization;
                var url = "#widgets/quicklink-widgets/internal-playbook-grid/";
                
                var modalsrc = install + url + widgetname +"/"+ configname +"/"+ linktype +"/"+ linktoid +"/"+ personalization ;
                if(name == "marketingcampaign")
                {
                    url = "#widgets/quicklink-widgets/drip-campaign-grid/";
                    modalsrc = install + url + widgetname +"/"+ configname +"/"+ linktype +"/"+ linktoid ;
                }
                else if(name == "marketingcampaignsreport"){
                    url = "#widgets/drip/campaign/";
                    modalsrc = install + url +"/"+widgetname+"/"+widgetname +"/"+ configname +"/"+ linktype +"/"+ linktoid ;
                }
                else if(name == "viewassets")
                {
                    url = "#search?text=";
                    modalsrc = install +url ;
                }
                    else if(name == "watchvideo")
                    {
                        url = "#widgets/quicklink-widgets/watch-video-grid/";
                        modalsrc = install + url +  widgetname +"/"+ configname +"/"+ linktype +"/"+ linktoid;
                    }
                
                if(row_count == null || row_count === undefined || row_count == "null")
                    row_count = 0;
                if(description == null || description === undefined || description == "null")
                    description = "";
                else
                    description = decodeURI(description);
                $("#"+name+" .btnheader").html(header);
                $("#"+name+" .btninfo").html(description);
                //$("#"+name+" .notificationdiv").html(row_count);
                $("#"+name+" #src").html(modalsrc);
            }
            else
            {
                var description = _data.widgetdescription;
                var header = _data.widgetheader;
                var listhtml = '';
                if(description == null || description === undefined || description == "null")
                    description = "";
                else
                    description = decodeURI(description);
                if(name == "reports")
                {
                    var items = _data.reporttype.items;
                    for(var j=0; j< items.length; j++)
                    {
                        var text = items[j].text;
                        var reporturl = install+"#"+items[j].reporturl;
                        listhtml  += "<li><a class='linkurl "+text+"-report' id='"+text+" Reports' title='Click here to View "+text+" Reports'>"+text+"<span style='display:none;'>"+reporturl+"</span></a></li>";
                    }
                    $("#"+name+" .lists").html(listhtml);
                }
                else if(name == "create")
                {
                    var hascontactaccess = _data.hasContactAccess;
                    var hasOpportunityAccess = _data.hasOpportunityAccess;
                    var currencyText = _data.currencyText;
                    var lead_count = _data.lead_count;
                    var opportunity_count = _data.opportunity_count;
                    var amount = _data.amount;
                    var leadurl = install+"#connections/contacts/create";
                    var opportunityurl = component.get("v.opportunityurl");
                    if(hascontactaccess)
                        var contacthtml = "<li><a class='linkurl create-leads' title='Click here to create Leads'>Leads ("+lead_count+")<span style='display:none;'>"+leadurl+"</span></a></li>";
                    if(hasOpportunityAccess)
                        var opportunityhtml = "<li><a class='linkurl create-opportunity' title='Click here to create opportunity'>Opportunities "+opportunity_count+" ("+amount+" "+currencyText+")<span style='display:none;'>"+opportunityurl+"</span></a></li>";
                    var listhtml = "<ul>"+contacthtml+" "+opportunityhtml+"</ul>";
                    
                }
                    else if(name == "registerleads")
                    {
                        var registeredurl = install+"#manage/leads/leadregistered";
                        var approvedurl = install+"#manage/leads/leadregistered/approved";
                        var registerleads = _data.registerleads;
                        var approvedleads = _data.approvedleads;
                        listhtml = "<ul><li><a class='linkurl' id='Register Deals' title='Click here to register deals'>Registered ("+registerleads+")<span style='display:none;'>"+registeredurl+"</span></a></li><li><a class='linkurl' id='Approved Deals' title='Click to view approved deals'>Approved ("+approvedleads+")<span style='display:none;'>"+approvedurl+"</span></a></li></ul>";
                    }
                        else if(name == "managemdffunds")
                        {
                            var assigned = _data.assigned;
                            var approved = _data.approved;
                            var currency = _data.currency;
                            var assignedurl = install+"#manage/mdf/funds";
                            var approvedurl = install+"#manage/mdf/funds/approved";
                            listhtml = "<ul><li><a class='linkurl' title='Click to manage mdf funds'>Assigned ("+assigned+" "+currency+")<span style='display:none;'>"+assignedurl+"</span></a></li><li><a class='linkurl' id='Mdf Funds' title='Click to view approved funds'>Approved ("+approved+" "+currency+")<span style='display:none;'>"+approvedurl+"</span></a></li></ul>";
                        }
                            else if (name == "createpresentation")
                            {
                                var modalsrc = install + '#collateral/presentation';
                                $("#"+name+" #src").html(modalsrc);
                            }		
                				else if (name == "externalquicklink1"||name == "externalquicklink2"||name == "externalquicklink3"||name == "externalquicklink4"
                                        ||name == "externalquicklink5"||name == "externalquicklink6")
                            {
                               var modalsrc = _data.externallinkurl;
                                $("#"+name+" #src").html(modalsrc);
                            }
                
                
                if(name != "reports")
                    $("#"+name+" .datalisting").html(listhtml);
                $("#"+name+" .btnheader").html(header);
                $("#"+name+" .btninfo").html(description);
            }
            
        }
        $(helper.quicklinkdesign2body).show();
        var quicklinkdesign= $(this.quicklinkbtn2);
        $(quicklinkdesign).find(".divspinner").hide();
        $(quicklinkdesign).css("height","");
        
     	$(".externalquicklink").click(function(){
            if($(this).find('#src').html() != ""){
        	 var src = $(this).find('#src').html().replace(/&amp;/g, '&');
        	 window.open(src, '_blank');
            }
     	});
        $(".smallbtnclick").click(function(){
            
            var id = $(this).attr("id");
            var title = $(this).find('#src').attr("title");
            var src = $(this).find('#src').html().replace(/&amp;/g, '&');
            if(id == "createpresentation")
                helper.showEnablement(helper,component,src);
            else 
            	helper.openModal(component,src,title,'');
        });
        $(".linkurl").click(function(e){
            
            e.stopImmediatePropagation();
            var url = $(this).find('span').html();
            var id = $(this).attr("id");
            if(component.get("v.dependantwidget") == "oneapp"){
                if($(this).hasClass("create-opportunity"))
                {
                    var urlEvent = $A.get("e.force:navigateToURL");
                    urlEvent.setParams({"url": "/006/e?"});
                    urlEvent.fire();
                    return;
                }
                else if($(this).hasClass("create-leads"))
                {
                    var urlEvent = $A.get("e.force:navigateToURL");
                    urlEvent.setParams({"url": "/00Q/e?"});
                    urlEvent.fire();
                    return;
                }
            }
            else if(component.get("v.dependantwidget") == "apex")
            {
                var origin = window.location.origin;
                var title= '';
                if($(this).hasClass("create-opportunity"))
                {
                    url= origin+"/006/e?";
                    window.open(url,'_blank');
                    return;
                }
                else if($(this).hasClass("create-leads"))
                {
                    url=origin+"/00Q/e?";
                    window.open(url,'_blank');
                    return;
                }
            }
                else{
                    var listviewid = url.split('=')[1];
                    if($(this).hasClass("create-opportunity"))
                    {
                        var createRecordEvent = $A.get("e.force:createRecord");
                        createRecordEvent.setParams({
                            "entityApiName": "Opportunity"
                        });
                        createRecordEvent.fire();
                        return;
                    }
                    else if($(this).hasClass("create-leads"))
                    {
                        var createRecordEvent = $A.get("e.force:createRecord");
                        createRecordEvent.setParams({
                            "entityApiName": "Lead"
                        });
                        createRecordEvent.fire();
                        return;
                    }
                }
            helper.showEnablement(helper,component,url);
            
            //helper.redirectUrl(component,src);
        });
    },
    showEnablement:function(helper,component,src)
    {       
        window.name = src;
        if(component.get("v.dependantwidget") == "oneapp")
        {
            var urlEvent = $A.get("e.force:navigateToURL");
            urlEvent.setParams({
                "url": "/one/one.app#/n/Enablement"
            });
            urlEvent.fire();  
        }
        else if(component.get("v.dependantwidget") == "apex"){
            $(helper.ampdashboardwithmenu).click();
        }
        else{
                var urlEvent = $A.get("e.force:navigateToURL");
                urlEvent.setParams({
                    "url": '/enablement'
                });
                urlEvent.fire();
            }
            //else{
            //    helper.openModal(component,src,'','');
            //}
        return;
    },
    //function to open the modal
    openModal:function(component,src,title,selecthtml)
    {        
        var modal = '';
        if(component.get("v.dependantwidget") != "oneapp")
        {
            modal = $(this.independentmodal);
        }
        else{
            var ampdashboard = $(this.ampdashboard);
            $(ampdashboard).toggleClass("modal-open");
            $(ampdashboard).toggleClass("fullscreen");
            modal = $(this.modal);
        }
        $(modal).find("#amp-select").hide();
        if(selecthtml !== '')
        {
            $(modal).find("#selectvalues").html(selecthtml);
            var optionlength = $(modal).find("#selectvalues").length;
            if(optionlength == 1)
                $(modal).find("#amp-select").hide();
            else
                $(modal).find("#amp-select").show();
        }
        if(title == '')
        {
            $(modal).find("#modal-heading").hide();
            $(modal).find("#modal-heading").parent().css("padding","0px");
        }
        $(modal).find("#modal-heading").html(title);
        $(modal).find("iframe").attr("src",src);
        $(modal).show();
    },
	dynamicColorBinding:function(component,event,helper){
         var colorData = component.get('v.colorData');
        document.documentElement.style.setProperty('--mainnavbgcolor',component.get("v.mainnavbgcolor"));
        document.documentElement.style.setProperty('--mainnavfontcolor',component.get("v.mainnavfontcolor"));
        document.documentElement.style.setProperty('--hover_icon_color',colorData.hover_icon_color);
        document.documentElement.style.setProperty('--icon_color',colorData.icon_color);
        document.documentElement.style.setProperty('--widget_bg_color',colorData.widget_bg_color);
        document.documentElement.style.setProperty('--widget_bg_image_pos_y',colorData.widget_bg_image_pos_y);
        document.documentElement.style.setProperty('--widget_bg_image_pos_x',colorData.widget_bg_image_pos_x);
        document.documentElement.style.setProperty('--widget_bg_image_repeat',colorData.widget_bg_image_repeat);
        document.documentElement.style.setProperty('--widget_bg_image_size',colorData.widget_bg_image_size);
        document.documentElement.style.setProperty('--widget_bg_image',colorData.widget_bg_image);
        document.documentElement.style.setProperty('--bg_color',colorData.bg_color);
        document.documentElement.style.setProperty('--border_radius',colorData.border_radius);
        document.documentElement.style.setProperty('--border_style',colorData.border_style);
        document.documentElement.style.setProperty('--border_width',colorData.border_width);
        document.documentElement.style.setProperty('--boxShadowCustom',colorData.boxShadowCustom);
        document.documentElement.style.setProperty('--title_font_color',colorData.title_font_color);
        document.documentElement.style.setProperty('--title_line_height',colorData.title_line_height);
        document.documentElement.style.setProperty('--title_text_transform',colorData.title_text_transform);
        document.documentElement.style.setProperty('--title_text_align',colorData.title_text_align);
        document.documentElement.style.setProperty('--title_font_style',colorData.title_font_style);
        document.documentElement.style.setProperty('--title_font_weight',colorData.title_font_weight);
        document.documentElement.style.setProperty('--title_font_size',colorData.title_font_size);
        document.documentElement.style.setProperty('--hover_title_font_color',colorData.hover_title_font_color);
        document.documentElement.style.setProperty('--desc_font_color',colorData.desc_font_color);
        document.documentElement.style.setProperty('--desc_line_height',colorData.desc_line_height);
        document.documentElement.style.setProperty('--desc_text_transform',colorData.desc_text_transform);
        document.documentElement.style.setProperty('--desc_text_align',colorData.desc_text_align);
        document.documentElement.style.setProperty('--desc_font_style',colorData.desc_font_style);
        document.documentElement.style.setProperty('--desc_font_weight',colorData.desc_font_weight);
        document.documentElement.style.setProperty('--desc_font_size',colorData.desc_font_size);
        document.documentElement.style.setProperty('--hover_desc_font_color',colorData.hover_desc_font_color);
        document.documentElement.style.setProperty('--hover_bg_color',colorData.hover_bg_color);
        document.documentElement.style.setProperty('--desc_link_bg_color',colorData.desc_link_bg_color);
        document.documentElement.style.setProperty('--desc_link_font_color',colorData.desc_link_font_color);
        document.documentElement.style.setProperty('--desc_link_line_height',colorData.desc_link_line_height);
        document.documentElement.style.setProperty('--desc_link_text_transform',colorData.desc_link_text_transform);
        document.documentElement.style.setProperty('--desc_link_text_align',colorData.desc_link_text_align);
        document.documentElement.style.setProperty('--desc_link_font_style',colorData.desc_link_font_style);
		document.documentElement.style.setProperty('--desc_link_font_weight',colorData.desc_link_font_weight);
        document.documentElement.style.setProperty('--desc_link_font_size',colorData.desc_link_font_size);
        document.documentElement.style.setProperty('--hover_desc_link_font_color',colorData.hover_desc_link_font_color);
    }
})