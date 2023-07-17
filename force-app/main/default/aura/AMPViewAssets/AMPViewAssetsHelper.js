({
    ampdashboard:'',
    modal:'',
    viewassetresult:'',
    viewassetscontainer:'',
    maintitle:'',
    subtitle:'',
    divspinner:'',
    assets:'',
    showsendbutton:false,
    bindactions:true,
    enablement:'',
    enablementtag:'',
    enableampdashboard:'',
    viewassets:'',
    ampdashboardwithmenu:'',
    msgbox:'',
    ebookapisuccess:false,
    sessionID:'',
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
                component.set("v.install",data.result.installurl);
                if(data.result.userfound == true){
                    if(data.result.tos == false){
                        component.set('v.isOpen',true);
                        var url = data.result.installurl + "/?elt=" + data.result.usersessionid + "&returnurl=toschangepasswordsetting";
                        component.set("v.iframesrc",url);
                    }
                }
                if(getapiState==1)
                {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                    title : 'Processing...',
                    message: "Please wait while we're updating your profile. This page may refresh after that.",
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
                                helper.bindPage(component,helper,'1','');
                            else{
                                helper.getDetails(component,helper,'1','');
                                window.addEventListener('message',function(evt){
                                    var install = component.get("v.install");
                                    if(evt.origin == install)
                                    {
                                        if(evt.data == "CloseSendEmail")
                                        {
                                            setTimeout(function(){
                                                $(helper.closemodal).click();   
                                                
                                            },500);
                                        }
                                        else if(evt.data == "UserSetUpDone")
                                        {
                                            $(helper.closeiframe).click();
                                            helper.getPersonaTheme(component,helper);    
                                        }
                                    }
                                },false);
                            } 
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
    bindPage : function(component,helper,iscount,tabname) {
        helper.dynamicColorBinding(component,event,helper);
        this.ampdashboardwithmenu = $('.ampdashboardwithmenu').find('#enablementmenu');
        this.enablement = $("#divenablement");
        this.enablementtag = $(this.enablement).find('#iframetag');
        this.enableampdashboard = $(".ampdashboard");
        this.ampdashboard = $(this.enableampdashboard).closest("html");
        this.assets = $('.assets');
        this.modal = $(this.enableampdashboard).find('.demo-modal').not(".modal-independant");
        this.viewassetresult = $('.view-assets-result');
        this.viewassetscontainer = $('.view-assets-container');
        this.maintitle = $(this.viewassetresult).find('.maintitle');
        this.subtitle = $(this.viewassetresult).find('.subtitle');
        this.divspinner = $(this.viewassetresult).find('.divspinner');
        
        
        this.callApi(component,helper,iscount,tabname);
        this.showsendbutton = false;
        $(this.viewassetresult).find('.closeaccordion').click(function(){
            $(helper.assets).removeClass("CPViewAssetsclickcolor");
            helper.closeaccordion(component,helper);
        });
        
    },
    //to close accordion
    closeaccordion:function(component,helper)
    {
        $(this.viewassetresult).toggle();
    },
    //api to get data of viewassets
    callApi:function(component,helper,iscount,tabname)
    {
        if(iscount == "-1")
        {
            $(this.viewassetresult).show();
            $(this.divspinner).show();
            
            $(this.viewassetscontainer).hide();
            //$(this.viewassetresult).show();
            var username = component.get("v.username");
            var companyname = component.get("v.companyname");
            if(tabname == 'recently')
            {
                $(this.maintitle).html("Recently Used");
                $(this.subtitle).html(component.get("v.companyname") +"'s recent used assets");
            }
            else if(tabname == 'new')
            {
                $(this.maintitle).html("Assets Released In Last 90 Days");
                $(this.subtitle).html(component.get("v.companyname")+"'s recently released assets.");
            }
                else if(tabname == 'bookmarked')
                {
                    $(this.maintitle).html("My Favorites");
                    $(this.subtitle).html(component.get("v.companyname")+"'s favorite assets.");
                }
                    else if(tabname == 'recommended')
                    {
                        $(this.maintitle).html("Recommended");
                        $(this.subtitle).html(component.get("v.companyname")+"'s assets filtered by opportunity or contact.");
                    }
            var data = component.get("v."+tabname+"data");
            setTimeout(function(){
                helper.bindassets(component,helper,data,tabname);
            },10);
            return;
            
        }
        var action = component.get("c.getAssetSearchForConfig");
        var search = $(this.viewassets).find('.searchinput').val().toString();
        action.setParams({
            "searchtext": search,
            "userid":component.get("v.userid"),
            "iscount":iscount,
            "tabname":tabname
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
                        component.set('v.apiErrorMsg',finalmessage);
                        var selectVal =$(helper.viewassets).find('.categoryPicklist').val();
                         if(selectVal == null)
                             $(helper.viewassets).find('.errorMsg').html('Sorry!'+" "+finalmessage);
                     }
                    else{
                    data = data.result;
                    if(iscount == "1")
                        helper.bindcount(component,helper,data);
                    else{
                        if(component.get("v.dependantwidget"))
                            helper.bindassetsold(component,helper,data,tabname);
                        else
                            helper.bindassets(component,helper,data,tabname);
                    }
                    }
                }
            }
        });
        $A.enqueueAction(action);
    },
    //success function of viewassets
    bindassets:function(component,helper,data,tabname)
    {
        var tabdatas = data.tabdatas;
        var userdata = data.userdata;
        var install = component.get("v.install") + '//?elt=' + helper.sessionID;
        var fontcolor = component.get('v.mainnavbgcolor');
        var assetdatas = [];
        var iterationdata = {};
        for(var i = 0;i<=tabdatas.length-1;i++)
        {  
            var pretabname = tabdatas[i].tabname;
            if(pretabname == tabname)
            {                  
                var items = tabdatas[i].item;
                var max = items.length;
                //if(max == 7)
                //    max = 6;
                //else if(max > 7)
                //    max = 7;
                var html = '';
                for(var j=0;j<=max-1;j++)
                {
                    
                    var assetdata = {}; 
                    var metadata = JSON.parse(items[j].metadata);
                    var _class='';
                    var iframesrc = '';
                    var templatetype = metadata.templatetype;
                    var output = metadata.output;
                    var id = metadata.id;
                    if(templatetype == undefined || templatetype == "undefined" || templatetype == ""){
                        if(output == "2")
                        {
                            _class="showinmodal";
                            iframesrc = metadata.url + '?clean';
                        }
                        else
                        {
                            _class="showinenablement";
                            iframesrc = metadata.fileurl+ '?clean';
                        }
                    }
                    else
                    {
                        _class="showinmodal";
                        if(templatetype == "INTERNALPLAYBOOK")
                        {
                            if(items[j].flag10.toString() == "9")
                                iframesrc = install+'&clean#linearinternalplaybook/'+metadata.id;
                            else
                                iframesrc = install+'&clean#internalplaybook/'+metadata.id;
                        }
                        if(templatetype == "EMAIL")
                        {
                         _class="showinenablement";
                         if(userdata.canEmailSend)
                         {
                             if(output)
                                 iframesrc = install+'&clean#v4u/ajax/widgets/sf-handler.cshtml?sftask=GetEmailMediaByOrgTemplateId&id='+metadata.id+'&name='+metadata.name;
                             else
                                 iframesrc = install+'&clean#v4u/ajax/widgets/sf-handler.cshtml?sftask=EmailMedia&id='+metadata.id+'&name='+metadata.name+'&canEmailSend='+userdata.canEmailSend;
                         }
                        }
                        if(templatetype == "WEB")
                        {
                            _class="showinenablement";
                            //iframesrc = install+'&clean#manage/web/'+metadata.id +'/view';
                        }
                        if(templatetype == "WEBBANNER")
                        {
                            _class="showinenablement";
                            //iframesrc = install+'&clean#manage/web/'+metadata.id +'/view';
                        }
                        if(templatetype == "DATAROOM")
                        {
                            _class="showinmodal";
                            iframesrc = install+'&clean#collateral/data-room/'+metadata.id +'/view';
                        }
                        if(templatetype == "PRINT")
                        {
                            _class="showinenablement";
                            //iframesrc = install+"&clean#collateral/pdf/" + metadata.id + "/view";
                        }
                        if(templatetype == "POWERPOINT")
                        {
                            iframesrc = component.get("v.install")+"/ppt/" + metadata.templatekey + "/" + metadata.userkey
                        }
                        if(templatetype == "FORM")
                        {
                            _class="showinmodal";
                            iframesrc = install+"&clean#collateral/pdf/" + metadata.id + "/view";
                        }
                        if(templatetype == "EBOOK")
                        {
                            _class = "showinmodal";
                            iframesrc = install + "&clean#collateral/ebook/"+ metadata.id + "/view";
                        }
                        if(templatetype == "BLOGPOST")
                        {
                           iframesrc = component.get("v.install")+"/auto2/" + metadata.templatekey + "/" + metadata.userkey
                        }
                    }
                    assetdata["id"]=id;
                    assetdata["class"] = _class;
                    assetdata["iframesrc"] = iframesrc;
                    assetdata["linkid"] = items[j].linkid;
                    assetdata["linktype"] = items[j].linktype;
                    assetdata["flag6"] = items[j].flag6;
                    assetdata["status"] = items[j].status;
                    assetdata["metadata"] = metadata;
                    assetdata["metadatastr"] = JSON.stringify(metadata);
                    assetdata["showsend"] = false;
                    assetdata["showdownload"] = false;
                    assetdata["showsendtopartner"] = false;
                    assetdata["showrating"] = false;
                    assetdata["showpublish"] = false;
                    assetdata["showaddtodataroom"] = false;
                    assetdata["hovericon"] = '';
                    assetdata["showcustomize"] = false;
                    assetdata["showreport"] = false;
                    assetdata["showprintvendor"] = false;
                    assetdata["showebook"] = false;
                    assetdata["associatedAssets"] = false;
                    if(templatetype == "EMAIL")
                    {
                        if(output==false)
                        {
                            if(userdata.canEmailSend)
                            {
                                assetdata["showsend"] = true;
                            }
                            if(userdata.IsSiteAdmin || userdata.IsSuperAdmin || (userdata.canEmailSend &&userdata.hasPartnerAccess))
                            {
                                assetdata["showsendtopartner"] = true;
                            }
                            if(!userdata.hasquestionnaire && userdata.usedatasource != 1)
                            {
                                assetdata["showdownload"] = true;
                            }
                        }
                    }
                    if(templatetype == undefined && (output == 1 || output == 0))
                    {
                        var filetype=metadata.filetype;
                        assetdata["hovericon"] = helper.docIcon(component,event,helper,filetype);
                        assetdata["showdownload"] = true;
                        if(userdata.canEmailSend)
                        {
                            assetdata["showsend"] = true;
                        }
                        if (userdata.IsSiteAdmin || userdata.IsSuperAdmin ||(userdata.hasPartnerAccess && userdata.canEmailSend))
                        {
                            assetdata["showsendtopartner"] = true;
                        }
                        if (userdata.hasRatingAccess)
                        {
                            assetdata["showrating"] = true;
                        }
                        if (userdata.canAutoPublish)
                        {
                            assetdata["showpublish"] = true;
                        }
                        if (userdata.hasDataRoomAccess)
                        {
                            assetdata["showaddtodataroom"] = true;
                        }
                    }
                    if(templatetype == undefined && output == 2)
                    {
                        if (userdata.canEmailSend)
                        {
                            assetdata["showsend"] = true;
                        } 
                        if (userdata.IsSiteAdmin || userdata.IsSuperAdmin ||(userdata.hasPartnerAccess && userdata.canEmailSend))
                        {
                            assetdata["showsendtopartner"] = true;
                        }
                        if (userdata.canAutoPublish)
                        {
                            assetdata["showpublish"] = true;
                        }
                        
                        if (userdata.hasDataRoomAccess)
                        {
                            assetdata["showaddtodataroom"] = true;
                        }
                    }
                    if(templatetype == "WEB")
                    {
                        assetdata["hovericon"] = 'utility:world';
                        if(userdata.canWebEdit)
                        {
                            assetdata["showcustomize"] = true;
                        }
                        if(output)
                        {
                            assetdata["showreport"] = true;
                            if (userdata.canWebSend)
                            {
                                assetdata["showsend"] = true;
                            }
                            if (userdata.canWebPublish)
                            {
                                assetdata["showpublish"] = true;
                            }
                            
                            if (userdata.hasDataRoomAccess)
                            {
                                assetdata["showaddtodataroom"] = true;
                            }
                        }
                    }
                    /*if(templatetype == "FAQ")
                    {
                        if (userdata.canEmailSend)
                        {
                            assetdata["showsend"] = true;
                        }
                        if (userdata.IsSiteAdmin || userdata.IsSuperAdmin || (userdata.canEmailSend &&userdata.hasPartnerAccess))
                        {
                            assetdata["showsendtopartner"] = true;
                        }
                        
                        assetdata["associatedAssets"] = true;
                        
                        
                    }
                    if(templatetype == "BLOGPOST")
                    {
                            if (userdata.canAutoPublish && userdata.canPublish)
                            {
                                assetdata["showpublish"] = true;
                            }
                            
                    }*/
                    if(templatetype == "WEBBANNER")
                    {
                        if(userdata.canEdit)
                        {
                            assetdata["showcustomize"] = true;
                        }
                       /* if (userdata.canSend)
                        {
                            assetdata["showsend"] = true;
                        }
                        if (userdata.canAutoPublish && userdata.canPublish)
                        {
                            assetdata["showpublish"] = true;
                        }
                        if (userdata.IsSiteAdmin || userdata.IsSuperAdmin || (userdata.canEmailSend &&userdata.hasPartnerAccess))
                        {
                            assetdata["showsendtopartner"] = true;
                        }*/
                    }
                    if(templatetype == "PRINT")
                    {
                        assetdata["hovericon"] = 'utility:page';
                        if(userdata.canEdit)
                        {
                            assetdata["showcustomize"] = true;
                        }
                        assetdata["showdownload"] = true;
                        if (userdata.canSend)
                        {
                            assetdata["showsend"] = true;
                        }
                        if(output)
                        {
                            if (userdata.canOrderPrint)
                            {
                                assetdata["showprintvendor"] = true;
                            }
                            if (userdata.canPublish)
                            {
                                assetdata["showpublish"] = true;
                            }
                            if (userdata.hasEbookAccess)
                            {
                                assetdata["showebook"] = true;
                            }
                            if (userdata.IsSiteAdmin || userdata.IsSuperAdmin || (userdata.canEmailSend &&userdata.hasPartnerAccess&&userdata.canSend))
                            {
                                assetdata["showsendtopartner"] = true;
                            }
                            if (userdata.hasDataRoomAccess)
                            {
                                assetdata["showaddtodataroom"] = true;
                            }
                            
                        }                                 
                        if(!output)
                        {
                            if (userdata.canOrderPrint)
                            {
                                assetdata["showprintvendor"] = true;
                            }
                            if (userdata.canPublish)
                            {
                                assetdata["showpublish"] = true;
                            }
                            if (userdata.hasEbookAccess)
                            {
                                assetdata["showebook"] = true;
                            }
                            if (userdata.IsSiteAdmin || userdata.IsSuperAdmin || (userdata.canEmailSend &&userdata.hasPartnerAccess&&userdata.canSend))
                            {
                                assetdata["showsendtopartner"] = true;
                            }
                            if (userdata.hasDataRoomAccess)
                            {
                                assetdata["showaddtodataroom"] = true;
                            }
                        }
                    }
                    if(templatetype == "DATAROOM")
                    {
                        if (userdata.canPlayBookEdit)
                        {
                            assetdata["showcustomize"] = true;
                        }
                        if (userdata.canPlayBookSend)
                        {
                            assetdata["showsend"] = true;
                        }
                        if(output)
                        {
                            assetdata["showreport"] = true;
                            if (userdata.canPlayBookPublish)
                            {
                                assetdata["showpublish"] = true;
                            }
                            if (userdata.IsSiteAdmin || userdata.IsSuperAdmin || (userdata.canEmailSend &&userdata.hasPartnerAccess&&userdata.canPlayBookSend))
                            {
                                assetdata["showsendtopartner"] = true;
                            }
                            
                            
                        }
                        if(!output)
                        {
                            if (userdata.canPlayBookPublish)
                            {
                                assetdata["showpublish"] = true;
                            }
                            if (userdata.IsSiteAdmin || userdata.IsSuperAdmin || (userdata.canEmailSend &&userdata.hasPartnerAccess&&userdata.canPlayBookSend))
                            {
                                assetdata["showsendtopartner"] = true;
                            }
                        }
                    }
                    if(templatetype == "INTERNALPLAYBOOK")
                    {		
                        assetdata["hovericon"] = 'utility:notebook';
                        if(output)
                        {
                            assetdata["showreport"] = true;
                        }
                    }
                    if(templatetype == "POWERPOINT")
                    {
                        assetdata["hovericon"] = 'utility:side_list';
                        if (userdata.canPowerPointsend)
                        {
                            assetdata["showsend"] = true;
                        }
                        assetdata["showdownload"] = true;
                        if(output)
                        {
                            assetdata["showreport"] = true;
                            if (userdata.canPowerPointEdit)
                            {
                                assetdata["showcustomize"] = true;
                            }
                            if (userdata.IsSiteAdmin || userdata.IsSuperAdmin || (userdata.canEmailSend &&userdata.hasPartnerAccess&&userdata.canPowerPointsend))
                            {
                                assetdata["showsendtopartner"] = true;
                            }
                            if (userdata.hasDataRoomAccess)
                            {
                                assetdata["showaddtodataroom"] = true;
                            }
                            
                        }
                        if(!output)
                        {
                            if (userdata.canPowerPointEdit)
                            {
                                assetdata["showcustomize"] = true;
                            }
                            if (userdata.IsSiteAdmin || userdata.IsSuperAdmin || (userdata.canEmailSend &&userdata.hasPartnerAccess&&userdata.canPowerPointsend))
                            {
                                assetdata["showsendtopartner"] = true;
                            }
                            if (userdata.hasDataRoomAccess)
                            {
                                assetdata["showaddtodataroom"] = true;
                            }
                        }
                    }
                    if(templatetype == "CONTRACT")
                    {
                      if( metadata.usedatasource == "0" && metadata.hasquestionnaire==false){
                        if(userdata.canCreate && userdata.canSend){
                                assetdata["showsend"] = true;
                                assetdata["showcustomize"] = true;
                            }
                        
                        if(userdata.IsSiteAdmin || userdata.IsSuperAdmin || (userdata.canEmailSend &&userdata.hasPartnerAccess&& userdata.canSend))
                           assetdata["showsendtopartner"] = true;
                      }
                        if(metadata.usedatasource == "0" && metadata.hasquestionnaire==true){
                            if(userdata.canCreate){
                                assetdata["showcustomize"] = true;
                            }
                        }
                    }
                    assetdata["imgsrc"] = '';
                    assetdata["showvideoimage"] = false;
                    if(metadata.templatetype == undefined)
                    {
                        if(metadata.output == 0)
                        {
                            assetdata["imgsrc"]=metadata.thumburl200;
                        }
                        else if(metadata.output == 1)
                        {
                            if(metadata.filetype == "PDF" || metadata.filetype == "PDFPAGE")
                            {
                                assetdata["imgsrc_thumb"]=metadata.thumburl;
                                assetdata["imgsrc"]=metadata.thumburl200;
                            }
                            else
                            {
                                assetdata["imgsrc"]=metadata.thumburl200;
                                //<i class="{{= getDocumentIconClass(data.name)}}" style="max-height: 100px;max-width: 100px;"/>';
                            }
                        }
                            else if(metadata.output == 2)
                            {
                                if(metadata.thumburl200 == undefined){
                                    assetdata["imgsrc"]=  this.getVideoThumbnail(metadata.url);
                                    assetdata["showvideoimage"] = true;
                                }
                                else {
                                    if(metadata.thumburl200.indexOf("timg200") > -1){
                                        assetdata["imgsrc"]=  metadata.thumburl200;
                                        assetdata["showvideoimage"] = true;
                                    }
                                    else{
                                        assetdata["imgsrc"]=  this.getVideoThumbnail(metadata.url);
                                        assetdata["showvideoimage"] = true;
                                    }
                                }
                            }
                        if(metadata.trackinglink == true)
                        {
                            //<i class="fa fa-link" style="font-size:100px;" data-action-item="{{=index}}" data-action="edit"></i>
                        }
                    }
                    else
                    {
                        if(metadata.thumbnailkey == undefined)
                        {
                            assetdata["imgsrc"]=  component.get("v.install")+'/page/'+metadata.firstpage+'/'+metadata.templatepublickey+'/'+metadata.updatedon+'/thumbnail.jpeg';
                        }
                        else    
                        {
                            assetdata["imgsrc"]=  component.get("v.install")+'/timg/'+metadata.thumbnailkey+'/img';
                        }
                    }	
                    assetdata["newimgsrc"] = '';
                    assetdata["shownewimage"] = false;
                    
                    if(this.daydiff(metadata.createdon) < 90 && (!metadata.output || metadata.templatetype == undefined))
                    {
                        assetdata["newimgsrc"] = component.get("v.install")+'/AppThemes/default/img/new-icon.png';
                        assetdata["shownewimage"] = true;
                    }
                    assetdata["fontcolor"] = fontcolor;
                    assetdatas.push(assetdata);
                }
                iterationdata["showmore"] = false;
                //if(items.length > max)
                
                
                iterationdata["tabname"] = pretabname;
                iterationdata["assets"] = assetdatas;
                component.set("v.items",iterationdata);
                setTimeout(function(){
                    var records = $(".asset-col");
                    var isDisplayNone = false;
                    for(var q = 0;q<=records.length -1;q++)
                    {
                        var $record = $(records[q]);
                        if($record.css("display") == "none")
                        {
                            isDisplayNone = true;
                            break;
                        }
                    }
                    if(isDisplayNone)
                    {
                        var idata = component.get("v.items");
                        idata["showmore"] = true;
                        component.set("v.items",idata);
                    }
                    if(helper.bindactions){
            $(helper.viewassetscontainer).find('.viewAll').unbind("click").click(function(){
                var type = $(this).find('.typename').html();
                helper.showAll(component, helper,type);
            });
            $(helper.viewassetscontainer).find('.showinmodal').unbind("click").click(function()
            {
             
                 var src = $(this).find('.iframesrc').html();
                 var templatetype = $(this).find('.templatetype').html();
                 var name = $(this).find('.name').html();
                 
                 var title = '';
                 if(templatetype == "EMAIL")
                     title = "Send " + name;
                 else
                     title = "View of "+name;
                 helper.openModal(component,src,title,'');
             //open modal
            });
            
            $(helper.viewassetscontainer).find('.showinenablement').unbind("click").click(function()
			{
             var install = component.get("v.install") + '//?elt=' + helper.sessionID;
             var rec = $(this).closest('.asset-col');
             var metadata = JSON.parse($(rec).find('.metadata').html());
             var templatetype = $(rec).find('.templatetype').html();
             var output = $(rec).find('.output').html() == "true" ?true:false;
             var flag6 = $(rec).find('.flag6').html() == "true" ?true:false;
             var id = $(rec).attr('id');
                
             if(templatetype == "BLOGPOST"){
                  
                 var url=component.get("v.install")+"/auto2/"+metadata.templatekey+"/"+metadata.userkey;
                  if(url != '')
                 	helper.showEnablement(helper,component,url);
             }
                else if(templatetype == "CONTRACT"){
                 var title="Customize Contract";
                  var templatedata={};
                       if (!metadata.output) {
                           if(userdata.canSendAssets && userdata.canCreateAssets){
                               templatedata['usedatasource']=metadata.usedatasource;
                               templatedata['id']=metadata.id;
                               templatedata['name']=metadata.name;
                               var _templatedata = window.btoa((JSON.stringify(templatedata)));
                               var src = install+"&clean#assets?closesfmodal=true&function=onCustomizeSuccessContract&templatedata=" + _templatedata;
                               helper.openModal(component,src,title,'');
                           }
                       }
                     else {
                    if(userdata.canEditAssets){
                        if(metadata.status == 2){
                             templatedata['id']=metadata.id;
                            templatedata["ispartner"] = 1;
                            var _templatedata = window.btoa((JSON.stringify(templatedata)));
                            var src = install+"&clean#assets?closesfmodal=true&function=showEditContractWizard&templatedata=" + _templatedata;
                            helper.openModal(component,src,title,'');
                        }
                        else{
                       
                            templatedata["cansend"] = userdata.canSendAssets;
                            templatedata["canorderprint"] = userdata.canorderprint;
                            templatedata["canpublish"] = userdata.canPublishAssets ;
                            templatedata["canedit"] = userdata.canEditAssets;
                            templatedata["linkids"] = linkid;
                            templatedata["isSmartlist"] = null;
                            templatedata["isMedia"] = metadata.output;
                            var _templatedata = window.btoa((JSON.stringify(templatedata))); 
                            var src = install+"&clean#assets?closesfmodal=true&function=showPrint&templatedata=" + _templatedata;
                            helper.openModal(component,src,title,'');
                        }
                    }
                    }
                // helper.openModal(component,src,title,'');
             }
                    else if(templatetype == "WEB"){
                        if(!output)
                     {
                         if(userdata.canWebCreate)
                         {
                             name = 'New Media';
                             var usedatasource = metadata.usedatasource;
                             var _type = "WEB";
                             if(flag6 == true)
                                 _type = "WEB";
                             else
                                 _type = "LANDINGPAGE";
                             src = install+'&clean#v4u/ajax/widgets/sf-handler.cshtml?type='+_type+'&sftask=CreateTemporaryMedia&id='+id+'&name='+name+'&usedatasource='+usedatasource ;
                             //helper.showEnablement(helper,component,src);
                             helper.openModal(component,src,title,'');
                             //helper.callcustomizeapi(component,event,helper,id,name);
                         }
                         else if(userdata.canEdit)
                         {
                             title = 'Website';
                             if (!metadata.isNeedApproval) {
                                 if (!metadata.isApproved) {
                                     if (metadata.customize) {
                                         if (metadata.canedit)
                                             selecthtml = '<option value="'+install+'&clean#manage/web/' + id + '/editor">Editor</option>';
                                         src = install+'&clean#manage/web/' + id + '/editor';
                                         
                                     }
                                     else {
                                         src = install+'&clean#manage/web/' + id + '/view?rand=1';
                                         if (metadata.canedit) 
                                             selecthtml = '<option value="'+install+'&clean#manage/web/' + id + '/editor">Editor</option>';
                                     }
                                 }
                                 else
                                 {
                                     selecthtml = '<option value="'+install+'&clean#manage/web/' + id + '/view?rand=1">View</option>'; 
                                     src = install+'&clean#manage/web/' + id + '/view?rand=1';
                                 }
                                 
                                 if (metadata.cansend) {
                                     if (metadata.linkids != null) {
                                         selecthtml = '<option value="'+install+'&clean#communicate/email/0?assetid=' + id + '&isAssetEmail=true&linkids=' + metadata.linkids + '&isSmartlist=' + metadata.isSmartlist +'">Send</option>'; 
                                         
                                         if (metadata.canPartnerSend)
                                             selecthtml = '<option value="'+install+'&clean#communicate/email/0?assetid=' + id + '&isAssetEmail=true&linkids=' + metadata.linkids + '&isSmartlist=' + metadata.isSmartlist +'&ispartner=' + true+'">Send To Users</option>'; 
                                         
                                     }
                                     else {
                                         selecthtml = '<option value="'+install+'&clean#communicate/email/0?assetid=' + id + '&isAssetEmail=true">Send</option>'; 
                                         if (metadata.canPartnerSend)
                                             selecthtml = '<option value="'+install+'&clean#communicate/email/0?assetid=' + id + '&isAssetEmail=true&ispartner=' + true+'">Send To Users</option>'; 
                                         
                                     }
                                 }
                                 if (metadata.canpublish)
                                     selecthtml = '<option value="'+install+'&clean#setup/publish/media/true/' + id+'">Publish</option>'; 
                                 
                                 
                                 if (metadata.output)
                                     selecthtml = '<option value="'+install+'&clean#manage/web/' + id + '/info/'+now+'">Info</option>'; 
                                 
                                 
                                 if (metadata.output && metadata.hasquestionnaire)
                                     selecthtml = '<option value="'+install+'&clean#manage/web/' + id + '/questions">Input</option>'; 
                                 
                                 selecthtml = '<option value="'+install+'&clean#manage/campaigns/website/' + id + '/report">Report</option>'; 
                                 selecthtml = '<option value="'+install+'&clean#manage/campaigns/website/' + id + '/interestbypage">Pages</option>'; 
                                 selecthtml = '<option value="'+install+'&clean#manage/campaigns/website/' + id + '/interestbycontacts">Contacts</option>'; 
                                 
                             }
                             helper.openModal(component,src,title,selecthtml);
                         }
                     }
                    }
                        else if(templatetype == "EMAIL"){
                            var name = $(this).find('.name').html();
                            if(templatetype == "EMAIL")
                                title = "Send " + name;
                            var src = $(this).find('.iframesrc').text();
                            helper.openModal(component,src,title,'');
                        }
                            else if(templatetype == ''||templatetype == undefined ||templatetype == "undefined"){
                                var src =$(this).find('.iframesrc').text();
                                //var regeximage="([^\\s]+(\\.(?i)(jpe?g|png|gif|bmp))$)";
                               // regeximage.test(src);
                                //var re = /(?:\.([^.]+))?$/;
								//var ext = re.exec(src)[1];
                                //ext = ext.replace(/\?.*$/g,"");
                                if(src.indexOf("img") > -1 || src.indexOf("pdf")> -1 ||src.indexOf("txt")> -1)
                                    helper.openModal(component,src,title,'');
                                    else
                                window.location=src;
                            }
                            
                    /*else if(templatetype == "FAQ"){
                        	templatedata["reports"] = true;
                            templatedata["cansend"] = userdata.canSend;
                            templatedata["canpublish"] = userdata.canPublishAssets ;
                            templatedata["canedit"] = userdata.canEditAssets;
                            templatedata["linkids"] = linkid;
                            templatedata["isSmartlist"] = null;
                        	templatedata["customize"] = false;
                        	templatedata["canPartnerSend"] = userdata.canPartnerSend;
                            var _templatedata = window.btoa((JSON.stringify(templatedata))); 
                            var src = install+"&clean#assets?function=viewFAQ&templatedata=" + _templatedata;
                            helper.openModal(component,src,title,'');
                    }*/
                        else if(templatetype == "WEBBANNER"){
                            var templatedata ={};
                            templatedata['id']=parseInt(id);
                            templatedata['usedatasource']=metadata.usedatasource;
                            if (!metadata.output) {
                                if (userdata.canCreateWeb){ 
                                    var _templatedata = window.btoa((JSON.stringify(templatedata)));
                                    var src = install+"&clean#assets?closesfmodal=true&function=onCustomizeSuccessWebBanner&templatedata=" + _templatedata+"&tpapp=sfdc";
                                } 
                            }
                            else{
                                if (userdata.canEditWeb){ 
                                    if (metadata.status == 2) {
                                        templatedata["info"] = "Info";
                                        templatedata["question"] = "Questions";
                                        templatedata["webeditor"] = "Web Banner Editor";
                                        templatedata["assetpicker"] = "Asset Picker";
                                        templatedata["customizewebsite"] = "Customize Web Banner Media";
                                        var _templatedata = window.btoa((JSON.stringify(templatedata)));
                                        var src = install+"&clean#assets?closesfmodal=true&function=showEditWebBannerWizard&templatedata=" + _templatedata+"&tpapp=sfdc";
                                    }else{
                                        templatedata["cansend"] = userdata.canWebSend;
                                        templatedata["canpublish"] = userdata.canWebPublish;
                                        templatedata["canedit"] = userdata.canEditWeb;
                                        templatedata["customize"] = true;
                                        templatedata["contactids"] = linkid;
                                        templatedata["isNeedApproval"] = templatedata.enablewatermark;
                                        templatedata["isApproved"] = templatedata.isapproved;
                                        templatedata["canPartnerSend"] = userdata.canPartnerSend;
                                        if (metadata.output) {
                                            var _templatedata = window.btoa((JSON.stringify(templatedata)));
                                            var src = install+"&clean#assets?closesfmodal=true&function=showWebBannerMedia&templatedata=" + _templatedata+"&tpapp=sfdc";
                                            
                                        }
                                        else {
                                            $(helper.msgbox).find(".pText").html("You do not have permission to customize this template");
                                                $(helper.msgbox).find(".MsgTitle").html("NO PERMISSION");
                                                $(helper.msgbox).show();
                                                return;
                                        }
                                    }
                                }
                            }
                            helper.openModal(component,src,title,'');
                        }
                            else if(templatetype == "PRINT"){
                                var templatedata={};
                                var enablewatermark = $(rec).find('.enablewatermark').html() == "true" ?true:false;
                                var status =$(rec).find('.status').html();
                                templatedata["cansend"] = userdata.canSendAssets;
                                templatedata["canedit"] = userdata.canEditAssets;
                                templatedata["isSmartlist"] = null;
                                templatedata["canorderprint"] = userdata.canOrderPrint;
                                templatedata["canpublish"] = userdata.canPublish;
                                templatedata["customize"] = false;
                                templatedata["linkids"] = null;
                                templatedata["isSmartlist"] = null;
                                templatedata["isMedia"] = output;
                                templatedata["isNeedApproval"] = enablewatermark;
                                templatedata["isApproved"] =  status == 163 ? true : false;
                                templatedata["status"] = status;
                                templatedata["canPartnerSend"] = userdata.canPartnerSend;
                				templatedata["hasEbookAccess"] = userdata.hasEbookAccess;
                                templatedata['id']=id;
                                if (metadata.output) {
                                    if (metadata.status != 2)
                                        var src = install+"&clean#assets?closesfmodal=true&function=showPrint&templatedata=" + _templatedata+"&tpapp=sfdc"; 
                                    else{
                                        var src = install+"&clean#assets?closesfmodal=true&function=showEditPrintWizard&templatedata=" + _templatedata+"&tpapp=sfdc"; 
                                    }
                                }
                                else if (!metadata.output && !metadata.usedatasource && !metadata.hasquestionnaire)
                                { 
                                    var _templatedata = window.btoa((JSON.stringify(templatedata)));
                                    var src = install+"&clean#assets?closesfmodal=true&function=showPrint&templatedata=" + _templatedata+"&tpapp=sfdc";            
                                }
                                    else
                                        var src = install+"&clean#assets?closesfmodal=true&function=showEditPrintWizard&templatedata=" + _templatedata+"&tpapp=sfdc";
                       				helper.openModal(component,src,'Print view','');
                            }
              /*  else if(templatetype == "EMAIL"){
                     var templatedata={};
                     if(userdata.canEmailSend){
                         if(metadata.output){
                             templatedata["report"] = "Report"; 
                             templatedata["sent"] = "SENT";
                             templatedata["id"] = metadata.id;
                             templatedata["name"] = metadata.name;
                             var _templatedata = window.btoa((JSON.stringify(templatedata)));
                             var src = install+"&clean#assets?function=showEmailReport&templatedata=" + _templatedata;
                             helper.openModal(component,src,title,'');
                         }
                         else{
                             templatedata["canEmailSend"] = userdata.canEmailSend;
                             templatedata["id"] = metadata.id; 
                             templatedata["name"] = metadata.name;
                             templatedata["templatetype"]=metadata.templatetype;
                             var _templatedata = window.btoa((JSON.stringify(templatedata)));
                             var src = install+"&clean#assets?function=sendEmailView&templatedata=" + _templatedata;
                             helper.openModal(component,src,title,'');
                         }
                     }
                 }*/
             else{
                 var currenturl = window.location.href;
                 var regex = /^(.*[\\\/])/g;
                 currenturl = regex.exec(currenturl)[0];
                 var url = $(this).find('.iframesrc').text();
                 if(url != '')
                 	helper.showEnablement(helper,component,url);
             }
                 //url = encodeURI(url);
                 //var src = currenturl+"Enablement?src="+url;
                 
            });
            $(helper.viewassetscontainer).find('.send').unbind("click").click(function(e){
                
                e.stopImmediatePropagation();
                var install = component.get("v.install") + '//?elt=' + helper.sessionID;
                var rec = $(this).closest('.asset-col');
                var id = $(rec).attr('id')
                var linkid = $(rec).find('.linkid').html();
                var linktype = $(rec).find('.linktype').html();
                var iframesrc = $(rec).find('.iframesrc').html();
                var templatetype = $(rec).find('.templatetype').html();
                var usedatasource = $(rec).find('.usedatasource').html() == "true" ?true:false;
                var hasquestionnaire = $(rec).find('.hasquestionnaire').html() == "true" ?true:false;
                var metadata = JSON.parse($(rec).find('.metadata').html());
                var output = $(rec).find('.output').html() == "true" ?true:false;
                var name = $(rec).find('.name').html();
                var src = '';
                var title = 'Send';
                if(templatetype == undefined || templatetype == "undefined"|| templatetype == "")
                {
                    src = install + "&clean#communicate/email/0?templates=null&files="+linkid+"&isMultipleAssetEmail=true";
                }
                else if(templatetype == "PRINT")
                {
                    if(userdata.canSend)
                    {
                        if(output)
                        {
                            src = install + "&clean#communicate/email/0?assetid=" + id + "&isAssetEmail=true";
                        }
                        else if(!output && !usedatasource && !hasquestionnaire)
                        {
                            title="Send Print";
                            src= install+"&clean#communicate/email/0?templates="+id+"&files=null&isMultipleAssetEmail=true&customsendmodal=true&hideimportcustomize=true";
                        }
                    }
                }
                    else if(templatetype == "CONTRACT"){
                        var templatedata={};
                        title="Send Contract";
                        if(metadata.output){
                        templatedata['id']=metadata.id;
                        templatedata['playbookid']=metadata.playbookid;
                        templatedata['ispartner']=0;
                          var _templatedata = window.btoa(JSON.stringify(templatedata));
                         var src = install+"&clean#assets?closesfmodal=true&function=sendContract&templatedata=" + _templatedata;
                        }
                        else if(!metadata.output && metadata.usedatasource != 1 && !metadata.hasquestionnaire ){
                            if(userdata.canSendAssets){
                                 templatedata['id']=metadata.id;
                                templatedata["ispartner"] =1 ;
                                templatedata["name"]=metadata.name;
                                 var _templatedata = window.btoa(JSON.stringify(templatedata));
                                 var src = install+"&clean#assets?closesfmodal=true&function=sendContractMedia&templatedata=" + _templatedata;
                            }
                        }
                    }
                    else if(templatetype == "EMAIL")
                    {
                        if(userdata.canEmailSend){
                        src = install+'&clean#v4u/ajax/widgets/sf-handler.cshtml?type=EMAIL&sftask=CreateTemporaryMedia&id='+id+'&name='+name+'&usedatasource='+usedatasource ;
                        helper.showsendbutton = false;
                        helper.openModal(component,src,title,'');
                        return;
                        }
                        //helper.showEnablement(helper,component,src);
                        //helper.showsendbutton = true;
                        
                        //var name = $(rec).find('.name').html();
                        //var action = component.get("c.getCreateTemporaryMedia");
                        //action.setParams({"templateid": id,"templatename":name,"userid":component.get("v.userid")});
                        //action.setCallback(this, function(response) {
                        //    var state = response.getState();
                        //    if (state === "SUCCESS")
                        //    {
                        //        var data = JSON.parse(response.getReturnValue());
                        //        var view = data.result.template;
                        //        src = install+'/#communicate/email/0?emailtemplateid=' + view.id +"&clean";
                        //        var title = "Send "+view.name;
                        //        helper.openModal(component,src,title,'');
                        //    }
                        //});
                        //action.setBackground();
                        //$A.enqueueAction(action);
                        
                        //return;
                    }
                        else if(templatetype == "WEB")
                        {
                            src = install+"&clean#communicate/email/0?assetid=" + id + "&isAssetEmail=true";
                        }
                            else if(templatetype == "EBOOK")
                            {
                                if (metadata.linkids != metadata && edata.linkids != "") {
                                    src = install+"&clean#communicate/email/0?assetid=" + id + "&isAssetEmail=true&linkids=" + metadata.linkids + "&isSmartlist=" + metadata.isSmartlist + "&isContactcompany=" + metadata.isContactcompany;
                                }
                                else {
                                    src = install+"&clean#communicate/email/0?assetid=" + id + "&isAssetEmail=true";
                                }
                                title= "Send Ebook";
                            }
                                else if(templatetype == "POWERPOINT")
                                {
                                    if (metadata.output == 1 || (metadata.usedatasource != 1 && metadata.hasquestionnaire == false)) {
                                        src = install+"&clean#communicate/email/0?assetid=" + id + "&isAssetEmail=true";
                                        title = "Send Presentation";
                                    }
                                }
                                    else if(templatetype == "DATAROOM")
                                    {
                                        if(userdata.canSend)
                                        {
                                            if (output)
                                            {
                                                src = install+"&clean#sendassets/extdataroom?linkids=" + id + "&isSmartlist=null&isContactcompany=null";
                                            }
                                            else {
                                                $(helper.msgbox).find(".pText").html("You do not have permission to send this template");
                                                $(helper.msgbox).find(".MsgTitle").html("NO PERMISSION");
                                                $(helper.msgbox).show();
                                                return;
                                            }
                                        }
                                    }
                                       /* else if(templatetype == "FAQ"){
                                            var templatedata={};
                                            title="Send FAQ";
                                            templatedata["linkids"]=linkid;
                                            templatedata["isUserGrid"] = false;
                                            templatedata["isPartner"] = false;
                                            templatedata["iscontactcompany"]="";
                                            templatedata["templatetype"]=metadata.templatetype;
                                            var _templatedata = window.btoa(JSON.stringify(templatedata));
                         					var src = install+"&clean#assets?function=sendFAQEmail&templatedata=" + _templatedata;
                                        }*/
                                        else if (templatetype == "WEBBANNER"){
                                            var templatedata={};
                                            templatedata["linkids"]=linkid;
                                            if (metadata.output) {
                                                var _templatedata = window.btoa(JSON.stringify(templatedata));
                                                var src = install+"&clean#assets?closesfmodal=true&function=sendWebBanner&templatedata="+ _templatedata+"&tpapp=sfdc";
                                            }
                                            else {
                                                $(helper.msgbox).find(".pText").html("You do not have permission to send this template");
                                                $(helper.msgbox).find(".MsgTitle").html("NO PERMISSION");
                                                $(helper.msgbox).show();
                                                return;
                            						} 
                                        }
                   if(templatetype == "CONTRACT")
                       helper.showsendbutton=false;
                     else
                helper.showsendbutton = true;
                helper.openModal(component,src,title,'');
                return;
            });
            $(helper.viewassetscontainer).find('.sendtopartner').unbind("click").click(function(e){
                
                e.stopImmediatePropagation();
                
                var install = component.get("v.install") + '//?elt=' + helper.sessionID;
                var rec = $(this).closest('.asset-col');
                var id = $(rec).attr('id')
                var linkid = $(rec).find('.linkid').html();
                var linktype = $(rec).find('.linktype').html();
                var iframesrc = $(rec).find('.iframesrc').html();
                var templatetype = $(rec).find('.templatetype').html();
                var output = $(rec).find('.output').html();
                var usedatasource = $(rec).find('.usedatasource').html();
                var hasquestionnaire = $(rec).find('.hasquestionnaire').html();
                var metadata = JSON.parse($(rec).find('.metadata').html());
                var name = $(rec).find('.name').html();
                var src = '';
                var title = 'Send To Partner';
                if(templatetype == undefined || templatetype == "undefined"|| templatetype == "")
                {
                    src = install + "&clean#communicate/email/0?templates=null&files="+linkid+"&isMultipleAssetEmail=true&ispartner=true";
                }
                else if(templatetype == "EMAIL")
                {
                    src = install+'&clean#v4u/ajax/widgets/sf-handler.cshtml?type=PARTNEREMAIL&sftask=CreateTemporaryMedia&id='+id+'&name='+name+'&usedatasource='+usedatasource ;
                    title='';
                    helper.showsendbutton = false;
                    helper.openModal(component,src,title,'');
                    return;
                    
                }
                else if(templatetype == "CONTRACT"){
                    var templatedata={};
                    title='Send Contract';
                        if(metadata.output){
                        templatedata['id']=metadata.id;
                        templatedata['playbookid']=metadata.playbookid;
                        templatedata['ispartner']=3;
                          var _templatedata = window.btoa(JSON.stringify(templatedata));
                         var src = install+"&clean#assets?closesfmodal=true&function=sendContract&templatedata=" + _templatedata;
                        }
                        else if(!metadata.output && metadata.usedatasource != 1 && !metadata.hasquestionnaire ){
                            if(userdata.canSendAssets){
                                templatedata['id']=metadata.id;
                                templatedata["ispartner"] =3 ;
                                templatedata["name"]=metadata.name;
                                 var _templatedata = window.btoa(JSON.stringify(templatedata));
                                 var src = install+"&clean#assets?closesfmodal=true&function=sendContractMedia&templatedata=" + _templatedata;
                            }
                        }     
                }
                else if(templatetype == "PRINT" || templatetype == "POWERPOINT" || templatetype == "DATAROOM")
                {
                    if(userdata.canSend)
                    {
                        if (output || (!usedatasource && hasquestionnaire == false)) 
                        {
                            if (linkid != null && linkid != "")
                                src = install + "&clean#communicate/email/0?assetid="+id+"&isAssetEmail=true&isSmartlist=" + metadata.isSmartlist + "&ispartner=true";
                            else
                                src = install + "&clean#communicate/email/0?assetid=" + id + "&isAssetEmail=true&ispartner=true";
                            title = "Send Presentation";
                            if(templatetype == "DATAROOM")
                                title = "Send Dataroom";
                            if(templatetype == "PRINT")
                                title = "Send Print";
                        }
                    }
                }
                    else if (templatetype == "WEBBANNER"){
                        var templatedata={};
                        templatedata["linkids"]=linkid;
                        templatedata["issmartlist"]=null;
                        templatedata["id"]=id;
                        if (metadata.output){
                            var _templatedata = window.btoa(JSON.stringify(templatedata));
                            var src = install+"&clean#assets?closesfmodal=true&function=sendWebBannerToPartner&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                        }       
                        else {
                            $(helper.msgbox).find(".pText").html("You do not have permission to send this template");
                            $(helper.msgbox).find(".MsgTitle").html("NO PERMISSION");
                            $(helper.msgbox).show();
                            return;
                        }
                    }
               if(templatetype == 'CONTRACT')
                   helper.showsendbutton = false;
                   else
                helper.showsendbutton = true;
                helper.openModal(component,src,title,'');
                return;
            });
            $(helper.viewassetscontainer).find('.publish').unbind("click").click(function(e){
                e.stopImmediatePropagation();
                var install = component.get("v.install") + '//?elt=' + helper.sessionID;
                var rec = $(this).closest('.asset-col');
                var id = $(rec).attr('id');
                var linkid = $(rec).find('.linkid').html();
                var templatetype = $(rec).find('.templatetype').html();
                var usedatasource = $(rec).find('.usedatasource').html() == "true" ?true:false;
                var hasquestionnaire = $(rec).find('.hasquestionnaire').html() == "true" ?true:false;                                                                             
                var output = $(rec).find('.output').html() == "true" ?true:false;
                var src = '';
                var ShowPublish = false;
                if (output)
                    ShowPublish = true;
                else if (!output && usedatasource != 1 && !hasquestionnaire)
                    ShowPublish = true;
                if (ShowPublish) {
                    if (templatetype === undefined || templatetype == "undefined" || templatetype == "") 
                        src = install + '&clean#setup/publish/media/false/' + linkid;
                    else
                        src = install + '&clean#setup/publish/media/true/' + id ;
                    helper.showsendbutton = true;
                    helper.openModal(component,src,"Publish",'');
                }
            });
            $(helper.viewassetscontainer).find('.customize').unbind("click").click(function(e)
			{
             e.stopImmediatePropagation();
             var install = component.get("v.install") + '//?elt=' + helper.sessionID;
             var rec = $(this).closest('.asset-col');
             var id = $(rec).attr('id');
             var linkid = $(rec).find('.linkid').html();
             var linktype = $(rec).find('.linktype').html();
             var flag6 = $(rec).find('.flag6').html() == "true" ?true:false;
             var iframesrc = $(rec).find('.iframesrc').html();
             var templatetype = $(rec).find('.templatetype').html();
             var output = $(rec).find('.output').html() == "true" ?true:false;
             var name = $(rec).find('.name').html();
             var metadata = JSON.parse($(rec).find('.metadata').html());
             var src = '';
             var title = '';
             var selecthtml = '';
             var now = $.now();
             switch(templatetype) {
                 case "WEB":
                     if(!output)
                     {
                         if(userdata.canWebCreate)
                         {
                             name = 'New Media';
                             var usedatasource = metadata.usedatasource;
                             var _type = "WEB";
                             if(flag6 == true)
                                 _type = "WEB";
                             else
                                 _type = "LANDINGPAGE";
                             src = install+'&clean#v4u/ajax/widgets/sf-handler.cshtml?type='+_type+'&sftask=CreateTemporaryMedia&id='+id+'&name='+name+'&usedatasource='+usedatasource ;
                             //helper.showEnablement(helper,component,src);
                             helper.openModal(component,src,title,'');
                             //helper.callcustomizeapi(component,event,helper,id,name);
                         }
                         else if(userdata.canEdit)
                         {
                             title = 'Website';
                             if (!metadata.isNeedApproval) {
                                 if (!metadata.isApproved) {
                                     if (metadata.customize) {
                                         if (metadata.canedit)
                                             selecthtml = '<option value="'+install+'&clean#manage/web/' + id + '/editor">Editor</option>';
                                         src = install+'&clean#manage/web/' + id + '/editor';
                                         
                                     }
                                     else {
                                         src = install+'&clean#manage/web/' + id + '/view?rand=1';
                                         if (metadata.canedit) 
                                             selecthtml = '<option value="'+install+'&clean#manage/web/' + id + '/editor">Editor</option>';
                                     }
                                 }
                                 else
                                 {
                                     selecthtml = '<option value="'+install+'&clean#manage/web/' + id + '/view?rand=1">View</option>'; 
                                     src = install+'&clean#manage/web/' + id + '/view?rand=1';
                                 }
                                 
                                 if (metadata.cansend) {
                                     if (metadata.linkids != null) {
                                         selecthtml = '<option value="'+install+'&clean#communicate/email/0?assetid=' + id + '&isAssetEmail=true&linkids=' + metadata.linkids + '&isSmartlist=' + metadata.isSmartlist +'">Send</option>'; 
                                         
                                         if (metadata.canPartnerSend)
                                             selecthtml = '<option value="'+install+'&clean#communicate/email/0?assetid=' + id + '&isAssetEmail=true&linkids=' + metadata.linkids + '&isSmartlist=' + metadata.isSmartlist +'&ispartner=' + true+'">Send To Users</option>'; 
                                         
                                     }
                                     else {
                                         selecthtml = '<option value="'+install+'&clean#communicate/email/0?assetid=' + id + '&isAssetEmail=true">Send</option>'; 
                                         if (metadata.canPartnerSend)
                                             selecthtml = '<option value="'+install+'&clean#communicate/email/0?assetid=' + id + '&isAssetEmail=true&ispartner=' + true+'">Send To Users</option>'; 
                                         
                                     }
                                 }
                                 if (metadata.canpublish)
                                     selecthtml = '<option value="'+install+'&clean#setup/publish/media/true/' + id+'">Publish</option>'; 
                                 
                                 
                                 if (metadata.output)
                                     selecthtml = '<option value="'+install+'&clean#manage/web/' + id + '/info/'+now+'">Info</option>'; 
                                 
                                 
                                 if (metadata.output && metadata.hasquestionnaire)
                                     selecthtml = '<option value="'+install+'&clean#manage/web/' + id + '/questions">Input</option>'; 
                                 
                                 selecthtml = '<option value="'+install+'&clean#manage/campaigns/website/' + id + '/report">Report</option>'; 
                                 selecthtml = '<option value="'+install+'&clean#manage/campaigns/website/' + id + '/interestbypage">Pages</option>'; 
                                 selecthtml = '<option value="'+install+'&clean#manage/campaigns/website/' + id + '/interestbycontacts">Contacts</option>'; 
                                 
                             }
                             helper.openModal(component,src,title,selecthtml);
                         }
                     }
                     break;
                 case "PRINT":
                     if(!output)
                     {
                         if(userdata.canCreate)
                         {
                             name = 'New%2fMedia';
                             var usedatasource = metadata.usedatasource;
                             //src = install+'&clean#v4u/ajax/widgets/sf-handler.cshtml?type=PRINT&sftask=CreateTemporaryMedia&id='+id+'&name='+name+'&usedatasource='+usedatasource ;
                             src=  install+'&clean#v4u/ajax/widgets/sf-handler.cshtml?sftask=CreateTemporaryMedia&id='+id+'&handler=print&name='+name+'&usedatasource='+usedatasource ;
                            // helper.showEnablement(helper,component,src);
                             helper.openModal(component,src,'','');
                             //helper.callcustomizeapi(component,event,helper,id,name);
                         }
                     }
                     else
                     {
                         title = 'Print';
                         if(userdata.canEdit)
                         {
                             if (!metadata.isNeedApproval) {
                                 if (!metadata.isApproved) {
                                     if (metadata.customize) {
                                         if (metadata.isMedia) {
                                             if (metadata.canedit) 
                                                 selecthtml = '<option value="'+install+'&clean#collateral/pdf/' + id + '/editor">Customize</option>'; 
                                             src = install+'&clean#collateral/pdf/' + id + '/editor';
                                         }
                                         selecthtml = '<option value="'+install+'&clean#collateral/pdf/' + id + '/editor">View</option>'; 
                                         src = install+'&clean#collateral/pdf/' + id + '/editor';
                                     }
                                     else {
                                         selecthtml = '<option value="'+install+'&clean#collateral/pdf/' + id + '/view">View</option>'; 
                                         src = install+'&clean#collateral/pdf/' + id + '/view';
                                         if (metadata.isMedia) {
                                             if (metadata.canedit) 
                                                 selecthtml = '<option value="'+install+'&clean#collateral/pdf/' + id + '/editor">Customize</option>'; 
                                             
                                         }
                                     }
                                 }
                                 else
                                 {
                                     selecthtml = '<option value="'+install+'&clean#collateral/pdf/' + id + '/view">View</option>'; 
                                     src = install+'&clean#collateral/pdf/' + id + '/view';
                                 }
                                 
                                 
                                 
                                 if (metadata.output)///if it is media then only add info page
                                     selecthtml = '<option value="'+install+'&clean#collateral/pdf/' + id + '/info">Info</option>'; 
                                 
                                 if (metadata.cansend) {
                                     if (metadata.status == 1) {
                                         if (metadata.linkids != null) {
                                             selecthtml = '<option value="'+install+'&clean#communicate/email/0?assetid=' + id + '&isAssetEmail=true&linkids=' + metadata.linkids + '&isSmartlist=' + metadata.isSmartlist+'">Send</option>'; 
                                             
                                             if (metadata.canPartnerSend)
                                                 selecthtml = '<option value="'+install+'&clean#communicate/email/0?assetid=' + id + '&isAssetEmail=true&linkids=' + metadata.linkids + '&isSmartlist=' + metadata.isSmartlist+'&ispartner=' + true +'">Send To Users</option>'; 
                                             
                                         }
                                         else {
                                             selecthtml = '<option value="'+install+'&clean#communicate/email/0?assetid=' + id + '&isAssetEmail=true">Send</option>'; 
                                             
                                             if (metadata.canPartnerSend)
                                                 selecthtml = '<option value="'+install+'&clean#communicate/email/0?assetid=' + id + '&isAssetEmail=true&ispartner=' + true+'">Send</option>'; 
                                             
                                         }
                                     }
                                     else {
                                         if (metadata.linkids != null)
                                             selecthtml = '<option value="'+install+'&clean#communicate/email/0?assetid=' + id + '&isAssetEmail=true&linkids=' + metadata.linkids + '&isSmartlist=' + metadata.isSmartlist + '&ispartner=' + true+'">Send</option>'; 
                                         
                                         else
                                             selecthtml = '<option value="'+install+'&clean#communicate/email/0?assetid=' + id + '&isAssetEmail=true&ispartner=' + true+'">Send To Users</option>'; 
                                         
                                     }
                                 }
                                 if (metadata.canpublish) 
                                     selecthtml = '<option value="'+install+'&clean#setup/publish/media/true/' + id+'">Social</option>'; 
                                 
                                 if (metadata.canorderprint)
                                     selecthtml = '<option value="'+install+'&clean#collateral/pdf/' + id + '/order">Vendor</option>'; 
                                 
                                 //views.push({ icon: "view", name: "Download", url: "/collateral/pdf/" + id + "/download" });
                                 
                                 if (metadata.hasquestionnaire)
                                     selecthtml = '<option value="'+install+'&clean#collateral/pdf/' + id + '/questions">Input</option>'; 
                                 
                             }
                         }
                         helper.openModal(component,src,title,selecthtml);
                     }
                     break;
                 case "EBOOK":
                     break;
                 case "CONTRACT" :
                     var templatedata={};
                     title="Customize Contract";                     
                       if (!metadata.output) {
                           if(userdata.canSendAssets && userdata.canCreateAssets){
                               templatedata['usedatasource']=metadata.usedatasource;
                               templatedata['id']=metadata.id;
                               templatedata['name']=metadata.name;
                               var _templatedata = window.btoa((JSON.stringify(templatedata)));
                               var src = install+"&clean#assets?closesfmodal=true&function=onCustomizeSuccessContract&templatedata=" + _templatedata;
                           }
                       }
                     else {
                    if(userdata.canEditAssets){
                        if(metdata.status == 2){
                            templatedata["ispartner"] = 1;
                            var _templatedata = window.btoa((JSON.stringify(templatedata)));
                            var src = install+"&clean#assets?closesfmodal=true&function=showEditContractWizard&templatedata=" + _templatedata;
                        }
                        else{
                       
                            templatedata["cansend"] = userdata.canSendAssets;
                            templatedata["canorderprint"] = userdata.canorderprint;
                            templatedata["canpublish"] = userdata.canPublishAssets ;
                            templatedata["canedit"] = userdata.canEditAssets;
                            templatedata["linkids"] = linkid;
                            templatedata["isSmartlist"] = null;
                            templatedata["isMedia"] = metadata.output;
                            var _templatedata = window.btoa((JSON.stringify(templatedata))); 
                            var src = install+"&clean#assets?closesfmodal=true&function=showPrint&templatedata=" + _templatedata;
                        }
                    }
                    }
                     helper.openModal(component,src,title,'');  
                     break;
                 case "WEBBANNER" :
                      var templatedata={};
                     templatedata['usedatasource']=metadata.usedatasource;
                     templatedata['id']=parseInt(id);
                     title="Customize Webbanner"; 
                     if (!metadata.output) {
                                if (userdata.canCreateWeb){ 
                                    var _templatedata = window.btoa((JSON.stringify(templatedata)));
                                    var src = install+"&clean#assets?closesfmodal=true&function=onCustomizeSuccessWebBanner&templatedata=" + _templatedata+"&tpapp=sfdc";
                                } 
                            }
                            else{
                                if (userdata.canEditWeb){ 
                                    if (metadata.status == 2) {
                                        templatedata["info"] = "Info";
                                        templatedata["question"] = "Questions";
                                        templatedata["webeditor"] = "Web Banner Editor";
                                        templatedata["assetpicker"] = "Asset Picker";
                                        templatedata["customizewebsite"] = "Customize Web Banner Media";
                                        var _templatedata = window.btoa((JSON.stringify(templatedata)));
                                        var src = install+"&clean#assets?closesfmodal=true&function=showEditWebBannerWizard&templatedata=" + _templatedata+"&tpapp=sfdc";
                                    }else{
                                        templatedata["cansend"] = userdata.canWebSend;
                                        templatedata["canpublish"] = userdata.canWebPublish;
                                        templatedata["canedit"] = userdata.canEditWeb;
                                        templatedata["customize"] = true;
                                        templatedata["contactids"] = linkid;
                                        templatedata["isNeedApproval"] = templatedata.enablewatermark;
                                        templatedata["isApproved"] = templatedata.isapproved;
                                        templatedata["canPartnerSend"] = userdata.canPartnerSend;
                                        if (metadata.output) {
                                            var _templatedata = window.btoa((JSON.stringify(templatedata)));
                                            var src = install+"&clean#assets?closesfmodal=true&function=showWebBannerMedia&templatedata=" + _templatedata+"&tpapp=sfdc";
                                            
                                        }
                                        else {
                                            $(helper.msgbox).find(".pText").html("You do not have permission to customize this template");
                                            $(helper.msgbox).find(".MsgTitle").html("NO PERMISSION");
                                            $(helper.msgbox).show();
                                            return;
                                        }
                                    }
                                }
                            }
                            helper.openModal(component,src,title,'');
                     break;
                 case "EMAIL":
                     if(userdata.canEmailSend)
                     {
                         src = install+'&clean#v4u/ajax/widgets/sf-handler.cshtml?type=EMAIL&sftask=CreateTemporaryMedia&id='+id+'&name='+name+'&usedatasource='+usedatasource;
                         title = "Send "+view.name;
                         helper.openModal(component,src,title,'');
                         helper.showsendbutton = true;
                         //var action = component.get("c.getCreateTemporaryMedia");
                         //action.setParams({templateid: id,templatename:name,userid:component.get("v.userid")});
                         //action.setCallback(this, function(response) {
                         //    var state = response.getState();
                         //    if (state === "SUCCESS")
                         //    {
                         //        var data = JSON.parse(response.getReturnValue());
                         //        var view = data.result.template;
                         //        src = install+'/#communicate/email/0?emailtemplateid=' + view.id;
                         //        title = "Send "+view.name;
                         //        helper.openModal(component,src,title,'');
                         //    }
                         //});
                         //action.setBackground();
                         //$A.enqueueAction(action);
                     }
                     break;
                 case "DATAROOM":
                     if(userdata.canPlayBookCreate)
                     {
                         name = 'New Media';
                         var usedatasource = metadata.usedatasource;
                         src = install+'&clean#v4u/ajax/widgets/sf-handler.cshtml?type=DATAROOM&sftask=CreateTemporaryMedia&id='+id+'&name='+name+'&usedatasource='+usedatasource ;
                         //helper.showEnablement(helper,component,src);
                         helper.openModal(component,src,title,'');
                         //helper.callcustomizeapi(component,event,helper,id,name);
                     }
                     break;
                 case "POWERPOINT":
                     if(!output)
                     {
                         if(userdata.canCreate)
                         {
                             name = 'PPT Media';
                             var usedatasource = metadata.usedatasource;
                             src = install + '&clean#v4u/ajax/widgets/sf-handler.cshtml?type=POWERPOINT&sftask=CreateTemporaryMedia&id=' + id + '&name=' + name + '&usedatasource=' + usedatasource ;
                             //helper.showEnablement(helper,component,src);
                             helper.openModal(component,src,title,'');
                             //helper.callcustomizeapi(component,event,helper,id,name);
                         }
                     }
                     else
                     {
                         if(userdata.canEdit)
                         {
                             title = 'Presentation';
                             if (metadata.hasquestionnaire && metadata.usedatasource == "1")
                             {
                                 src = install+'&clean#collateral/presentation/' + metadata.id + '/info';
                                 selecthtml = '<option value="'+install+'&clean#collateral/presentation/' + metadata.id + '/info">Info</option>';
                                 selecthtml = '<option value="'+install+'&clean#collateral/presentation/' + metadata.id + '/assetpicker">AssetPicker</option>';
                                 selecthtml = '<option value="'+install+'&clean#collateral/presentation/' + metadata.id + '/reordering">Manage Slides</option>';
                                 
                             }
                             else if (metadata.hasquestionnaire)
                             {
                                 src = install+'&clean#collateral/presentation/' + metadata.id + '/info';
                                 selecthtml = '<option value="'+install+'&clean#collateral/presentation/' + metadata.id + '/info">Info</option>';
                                 selecthtml = '<option value="'+install+'&clean#collateral/presentation/' + metadata.id + '/reordering">Manage Slides</option>';
                                 selecthtml = '<option value="'+install+'&clean#collateral/presentation/' + metadata.id + '/view">View</option>';
                             }
                                 else if (metadata.usedatasource == "1")
                                 {
                                     src = install+'&clean#collateral/presentation/' + metadata.id + '/info';
                                     selecthtml = '<option value="'+install+'&clean#collateral/presentation/' + metadata.id + '/info">Info</option>';
                                     selecthtml = '<option value="'+install+'&clean#collateral/presentation/' + metadata.id + '/assetpicker">AssetPicker</option>';
                                     selecthtml = '<option value="'+install+'&clean#collateral/presentation/' + metadata.id + '/reordering">Manage Slides</option>';
                                 }
                                     else
                                     {
                                         src = install+'&clean#collateral/presentation/' + metadata.id + '/info';
                                         selecthtml = '<option value="'+install+'&clean#collateral/presentation/' + metadata.id + '/info">Info</option>';
                                         selecthtml = '<option value="'+install+'&clean#collateral/presentation/' + metadata.id + '/reordering">Manage Slides</option>';
                                         selecthtml = '<option value="'+install+'&clean#collateral/presentation/' + metadata.id + '/view">View</option>';
                                     }
                             helper.openModal(component,src,title,selecthtml);      
                         }
                     }
                     break;    
                 case "SMS":
                     if(userdata.canSMSSend)
                     {
                         return;
                     }
                     break;
                 case "QUESTIONNAIRE":
                     if(userdata.canQuestCreate)
                     {
                         name = 'New Media';
                         var usedatasource = metadata.usedatasource;
                         src = install+'&clean#v4u/ajax/widgets/sf-handler.cshtml?type=QUESTIONNAIRE&sftask=CreateTemporaryMedia&id='+id+'&name='+name+'&usedatasource='+usedatasource ;
                         //helper.showEnablement(helper,component,src);
                         helper.openModal(component,src,title,'');
                         //helper.callcustomizeapi(component,event,helper,id,name);
                     }
                     break;
                 case "POLL":
                     if(userdata.canPollCreate)
                     {
                         name = 'New Media';
                         var usedatasource = metadata.usedatasource;
                         src = install+'&clean#v4u/ajax/widgets/sf-handler.cshtml?type=POLL&sftask=CreateTemporaryMedia&id='+id+'&name='+name+'&usedatasource='+usedatasource ;
                         //helper.showEnablement(helper,component,src);
                         helper.openModal(component,src,title,'');
                         //helper.callcustomizeapi(component,event,helper,id,name);
                     }
                     break;
                     
             }
            });
            $(helper.viewassetscontainer).find('.rating').unbind("click").click(function(e){
                e.stopImmediatePropagation();
                var install = component.get("v.install") + '//?elt=' + helper.sessionID;
                var rec = $(this).closest('.asset-col');
               var metadata = JSON.parse($(rec).find('.metadata').html());
                var linkid = $(rec).find('.linkid').html();
                var linktype=$(rec).find('.linktype').html();
                var title = "Feedback (Comments)";
                var selecthtml='';
                //selecthtml = '<option value="'+install+'&clean#feedback/' + linkid + '/2/rating">Ratings</option>';
                //selecthtml += '<option value="'+install+'&clean#feedback/' + linkid + '/2/comment">Comments</option>';
             
                var templatedata={};
               templatedata['id']=linkid; 
                templatedata['type']=2;
                //var src = install+'&clean#feedback/'+ linkid + '/2/rating';
                  var _templatedata = window.btoa(JSON.stringify(templatedata));
                 var src=install+"&clean#assets?closesfmodal=true&function=showFeedbackComments&templatedata=" + _templatedata+"&tpapp=sfdc"                                                                        
                helper.openModal(component,src,title,'');
            });
            $(helper.viewassetscontainer).find('.report').unbind("click").click(function(e){
                e.stopImmediatePropagation();
                var install = component.get("v.install") + '//?elt=' + helper.sessionID;
                var rec = $(this).closest('.asset-col');
                var id = $(rec).attr('id');
                var page = $(rec).find('.page').html();
                var metadata = JSON.parse($(rec).find('.metadata').html());
                var templatetype = $(rec).find('.templatetype').html();
                var selecthtml = '';
                var src = '';
                var title = "Activity";
                if(templatetype == "DATAROOM")
                {
                    title = "PlayBook - " + metadata.name;
                    src = install+'&clean#collateral/data-room/' + id + '/report';
                    selecthtml = '<option value="'+install+'&clean#collateral/data-room/' + id + '/report">Reports</option>';
                    selecthtml += '<option value="'+install+'&clean#collateral/data-room/' + id + '/interestbycontact">Contacts</option>';
                    selecthtml += '<option value="'+install+'&clean#collateral/data-room/' + id + '/documenttracking">Documents</option>';
                }
                else if(templatetype == "INTERNALPLAYBOOK")
                {
                    src = install+'&clean#internalplaybookrecordreport/'+id ;
                    title = metadata.name;
                }
                    else if(templatetype == "POWERPOINT")
                    {
                        src = install+'&clean#collateral/presentation/' + id + '/report';
                        var srcs = [];
                        var names= [];
                        srcs.push(install+'&clean#collateral/presentation/' + id + '/report');
                        names.push("Report");
                        if (page)
                        {
                            srcs.unshift(install+'&clean#collateral/presentation/' + id + '/interestbypage');
                            names.unshift("Interest By Page");
                        }
                        else
                        {
                            srcs.push(install+'&clean#collateral/presentation/' + id + '/interestbypage');
                            names.push("Interest By Page");
                        }
                        
                        if(metadata.contact)
                        {
                            srcs.unshift(install+'&clean#collateral/presentation/' + id + '/interestbycontact');
                            names.unshift("Interest By Contact");
                        } 
                        else
                        {
                            srcs.push(install+'&clean#collateral/presentation/' + id + '/interestbycontact');
                            names.push("Interest By Contact");
                        }
                        if(metadata.name != undefined)
                        {
                            title = "Presentation Report - " + metadata.name;
                        }
                        
                        for(var i=0; i< srcs.length; i++)
                        {
                            selecthtml = '<option value="'+srcs[i]+'">'+names[i]+'</option>';
                        }
                    }
                        else
                        {
                            var srcs = [];
                            var names= [];
                            if(metadata.view)
                            {
                                srcs.push(install+'&clean#manage/web/' + id + '/view?rand=1&amp;currentuser=' + metadata.currentuser );
                                names.push("View");
                            }
                            if(metadata.userid !== undefined)
                                srcs.push(install+'&clean#manage/campaigns/website/' + id + '/report?currentuser=' + metadata.currentuser + '&userid=' + metadata.userid );
                            else
                                srcs.push(install+'&clean#manage/campaigns/website/' + options.id + '/report?currentuser=' + options.currentuser );
                            names.push("Reports");
                            if(metadata.page)
                            {
                                srcs.unshift(install+'&clean#manage/campaigns/website/' + options.id + '/interestbypage?currentuser=' + options.currentuser );
                                names.unshift("Pages");
                            }
                            else
                            {
                                srcs.push(install+'&clean#manage/campaigns/website/' + options.id + '/interestbypage?currentuser=' + options.currentuser );
                                names.push("Pages");
                            }
                            if(metadata.contact)
                            {
                                srcs.unshift(install+'&clean#manage/campaigns/website/' + options.id + '/interestbycontact?currentuser=' + options.currentuser );
                                names.unshift("Contacts");
                            }
                            else
                            {
                                srcs.push(install+'&clean#manage/campaigns/website/' + options.id + '/interestbycontact?currentuser=' + options.currentuser );
                                names.push("Contacts");
                            }
                            if(metadata.name != undefined)
                            {
                                title = "Websites Report - " + metadata.name;
                            }
                            
                            for(var i = 0; i < srcs.length; i++)
                            {
                                selecthtml = '<option value="'+srcs[i]+'">'+names[i]+'</option>';
                            }
                        }
                
                helper.openModal(component,src,title,selecthtml);
                
            });
            $(helper.viewassetscontainer).find('.addtodataroom').unbind("click").click(function(e){
                e.stopImmediatePropagation();
                var install = component.get("v.install") + '//?elt=' + helper.sessionID;
                var rec = $(this).closest('.asset-col');
                var id = $(rec).attr('id');
                var linkid = $(rec).find('.linkid').html();
                var metadata = JSON.parse($(rec).find('.metadata').html());
                var templatetype = $(rec).find('.templatetype').html();
                var selecthtml = '';
                var src = '';
                var title = "Data Rooms";
                var modal = $(".demo-modal");
                var assettype = 1;
                if (templatetype == "undefined" || templatetype == undefined || templatetype == ""){
                    assettype = 2;//2 is for document/image/video
                src = install+"&clean#collateral/datarooms/" + linkid + "/" + assettype ;
                }else{
                    src = install+"&clean#collateral/datarooms/" + id + "/" + assettype ;
                }
                helper.openModal(component,src,title,selecthtml);
            });
            $(helper.viewassetscontainer).find('.download').unbind("click").click(function(e){
                e.stopImmediatePropagation();
                var rec = $(this).closest('.asset-col');
                var id = $(rec).attr('id');
                var metadata = JSON.parse($(rec).find('.metadata').html());
                var templatetype = $(rec).find('.templatetype').html();
                var selecthtml = '';
                var src = '';
                var url = '';
                var install = component.get("v.install") + '//?elt=' + helper.sessionID;
                if(templatetype == undefined||templatetype == ""|| templatetype == "undefined"){
                    if (metadata.output == 1) { //document
                        window.location = metadata.fileurl+ "?isdownload=1";
                    } else if (metadata.output == 0) {//image
                        window.location = metadata.downloadurl+ "?isdownload=1";
                    }
                }
                if(templatetype == "POWERPOINT")
                {
                    window.location = metadata.downloadurl;
                    //url = component.get("v.install")+'/pptfile/' + metadata.templatekey + '/' + metadata.userkey ;
                    //helper.showEnablement(helper,component,url);
                    //helper.openModal(component,src,'Download HTML','');
                }
                if(templatetype == "EMAIL")
                {
                    src = install+'&clean#communicate/email/download/' + id ;
                    helper.openModal(component,src,'Download HTML','');
                }
              if(templatetype == "PRINT")
                {
                    var act = component.get("c.downloadAPI");
                    act.setParams({
                        "tid":metadata.id,
                        "type":"high"
                    });
                    act.setCallback(this,function(response){
                        var state = response.getState();
                        if(state === "SUCCESS"){
                            var response = JSON.parse(response.getReturnValue()).result;
                            if(response.pdfdownload != null)
                            	window.location = response.pdfdownload;
                        }
                    });
                    $A.enqueueAction(act);
                    
                   /*var _templatedata = window.btoa(JSON.stringify(metadata.id));
                   var src = install+"&clean#assets?closesfmodal=true&function=downloadPDF&templatedata=" + _templatedata+"&tpapp=sfdc";
                  	
                    window.addEventListener('message',function(evt){
                        var install = component.get("v.install");
                        if(evt.origin == install)
                        {   
                            
                            if(evt.data.indexOf('?isdownload=1') > -1)
                            {
                                setTimeout(function(){
                                    window.loction =evt.data;   
                                },500);
                                
                            }
                            
                        }
                    },false);*/
                }
               
            });
            $(helper.viewassetscontainer).find('.ebook').unbind("click").click(function(e){
                e.stopImmediatePropagation();
                var rec = $(this).closest('.asset-col');
                var linkid = $(rec).find('.linkid').html();
                var install = component.get("v.install") + '//?elt=' + helper.sessionID;
                var src = install+'&clean#v4u/ajax/widgets/sf-handler.cshtml?sftask=ConvertToEbook&id='+linkid;
                //helper.showEnablement(helper,component,src);
                helper.openModal(component,src,'Ebook view','');
                
                return;
                helper.ebookapisuccess = false;
                var rec = $(this).closest('.asset-col');
                var linkid = $(rec).find('.linkid').html();
                var action = component.get("c.getConvertToEbook");
                action.setParams({"linkid": linkid,"userid":component.get("v.userid")});
                action.setCallback(this, function(response) {
                    helper.ebookapisuccess = true;
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        var data = JSON.parse(response.getReturnValue());
                        var url = data.result;
                        helper.showEnablement(helper,component,url);
                    }
                });
                $A.enqueueAction(action);
                if(!helper.ebookapisuccess)
                {
                    setTimeout(function(){helper.checkEbookAPI(helper)},10000);
                }
            });
            $(helper.viewassetscontainer).find('.printvendor').unbind("click").click(function(e){
                e.stopImmediatePropagation();
                var rec = $(this).closest('.asset-col');
                var metadata = JSON.parse($(rec).find('.metadata').html());
                var title = "Send To Print Vendor";
                var install = component.get("v.install") + '//?elt=' + helper.sessionID;
                var src = install+'&clean#collateral/pdf/' + metadata.linkid + '/order';
                helper.openModal(component,src,title,'');
            });
            
            
        }
                });
                $(this.divspinner).hide();
                $(this.viewassetscontainer).show();
            }
        }
        
    },
    checkEbookAPI:function(helper)
    {
        if(!helper.ebookapisuccess)
        {
            $('.faltugiri').click();
            setTimeout(function(){helper.checkEbookAPI(helper)},3000);
        }
    },
    showEditPrintWizard : function(component,helper,data)
    {
        var print = data.result.template;
        var allpagestemplateonlydb = data.result.allpagestemplateonlydb;
        var temptype = print.templatetype;
        var now = $.now();
        var title = '';
        var src = '';
        var selecthtml = '';
        var install = component.get("v.install") + '//?elt=' + helper.sessionID;
        if (print.hasquestionnaire == true && print.usedatasource == 1 && !allpagestemplateonlydb)
            var _wizdata = {
                name: print.customizeprint,
                steps: [info, questions, assetpicker, editor]
            };
        else if (print.hasquestionnaire == true && print.usedatasource == 0)
        {
            title = print.customizeprint;
            src = install+'&clean#collateral/pdf/' + print.id + '/info/' + now ;
            selecthtml = '<option value="'+install+'&clean#collateral/pdf/' + print.id + '/info/' + now +'">'+print.info+'</option>';
            selecthtml = '<option value="'+install+'&clean#collateral/pdf/' + print.id + '/questions">Question</option>';
            selecthtml = '<option value="'+install+'&clean#collateral/pdf/' + print.id + '/editor?ispersonalized=' + print.ispersonalized +'">Print</option>';
            helper.openModal(component,src,title,selecthtml);
        }
            else if(print.hasquestionnaire == false && print.usedatasource == 0)
            {
                title = print.customizeprint;
                src = install+'&clean#collateral/pdf/' + print.id + '/info/' + now ;
                selecthtml = '<option value="'+install+'&clean#collateral/pdf/' + print.id + '/info/' + now +'">'+print.info+'</option>';
                selecthtml = '<option value="'+install+'&clean#collateral/pdf/' + print.id + '/editor?ispersonalized=' + print.ispersonalized +'">Editor</option>';
                helper.openModal(component,src,title,selecthtml);
            }
                else
                {
                    title = print.customizeprint;
                    src = install+'&clean#collateral/pdf/' + print.id + '/info/' + now ;
                    selecthtml = '<option value="'+install+'&clean#collateral/pdf/' + print.id + '/info/' + now +'">'+print.info+'</option>';
                    selecthtml = '<option value="'+install+'&clean#collateral/pdf/' + print.id + '/editor?ispersonalized=' + print.ispersonalized +'">Editor</option>';
                    helper.openModal(component,src,title,selecthtml);
                }
    },
    //api to get data to show on modal wizard
    callcustomizeapi1: function(component,helper,id,name)
    {
        helper.ebookapisuccess = false;
        var action = component.get("c.getCreateTemporaryMedia");
        action.setParams({
            "templateid": id,
            "templatename":name,
            "userid":component.get("v.userid")
        });
        action.setCallback(this, function(response) {
            helper.ebookapisuccess = true;
            
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var data = JSON.parse(response.getReturnValue());
                helper.showEditPrintWizard(component,helper,data);
            }
        });
        $A.enqueueAction(action);
    },
    //function to get video src
    getVideoThumbnail:function(url) {
        var src = '';
        if (url.indexOf('youtube.com') > -1) 
        {
            var id = url.split('/')[4]//.split('v=')[1].split('&')[0];
            var thumb = 'http://i2.ytimg.com/vi/' + id + '/hqdefault.jpg';
            src = thumb;
        }
        else if (url.indexOf('vidyard.com') > -1) 
        {
            var id = url.split('/')[3];
            var thumb = "http://play.vidyard.com/" + id + ".jpg"
            src = thumb;
        }
            else if (url.indexOf('wistia.com') > -1) 
            {
                var thumb = url + ".jpg";
                src = thumb;
            }
                else if (url.indexOf('wistia.net') > -1) {
                    $.ajax({
                        url: 'https://fast.wistia.net/oembed?url=' + url + "?embedType=async&videoWidth=640",
                        dataType: 'jsonp',
                        success: function (data) {
                            var thumb = data.thumbnail_url != undefined ? data.thumbnail_url : "//{$Site.HostPath}/v4u/img/video.jpg";
                            src = thumb;
                        }
                    });
                }
                    else if (url.indexOf('videos.amp.vg') > -1) {
                        var thumb = url.replace('.flv', '.png');
                        src = thumb;
                    }
                        else if (url.indexOf('vimeo.com') > -1) {
                            id = url.split('/')[4];
                            $.ajax({
                                url: 'https://vimeo.com/api/oembed.json?url=' + url,
                                dataType: 'jsonp',
                                success: function (data) {
                                    var thumb = data.thumbnail_url != undefined ? data.thumbnail_url : "//{$Site.HostPath}/v4u/img/video.jpg";
                                    src = thumb;
                                }
                            });
                        }
                         else if (url.indexOf('googledrive') > -1) {
                            id = url.split(" ")[1];
                             var thumb = 'https://drive.google.com/thumbnail?authuser=0&sz=w320&id='+id+''                           
                                    src = thumb;
                        }
                                     
                            else 
                            {
                                var thumb = component.get("v.install") + "/v4u/img/video.jpg";
                                src = thumb;
                            }
        return src;
    },
    //to get difference btw date
    daydiff:function(utcdt)
    {
        var d1 = new Date();
        var strdt1 = d1.toString();
        var d2 = new Date(utcdt);
        var strdt2 = d2.toString()
        var diff = Math.floor((Date.parse(strdt1) - Date.parse(strdt2)) / 86400000);
        return diff;
    },
    //count to show on viewassets
    bindcount:function(component,helper,data)
    {
        var html = '<option val="default">Select Category</option>';
        var tabs = data.tabs;
        var tabdatas = data.tabdatas;
        var firstValue = '';
        for(var i=0;i<=tabs.length-1;i++)
        {
            var tabname =helper.escapeString(component,event,helper,tabs[i]);
            if(tabname.toLowerCase() == "all")
                continue;
            //html += '<option value="'+tabs[i]+'">'+tabs[i]+'</option>';
            html += '<option value="'+tabs[i]+'">'+tabname+'</option>';
            if(i == 0)
                firstValue = tabname;
        }
        var categoryList = $(this.viewassets).find('.categoryPicklist');
        $(categoryList).html(html);
        $(categoryList).change(function() {
            var selected = $('option:selected', this).text();
            if(selected == "Select Category")
                component.set("v.andor","OR");
            else
                component.set("v.andor","AND");
        });
        //$('#categoryPicklist').val(firstValue);
        
        for(var i=0;i<=tabdatas.length-1;i++)
        {
            var tabName = tabdatas[i].tabname;
            $(this.viewassets).find('.count_'+tabName).html(tabdatas[i].row_count);
        }
        
        helper.bindAssetsUsingPromises(component,helper);
        //component.set("v.datas",data);
        //component.set("v.userdata",data.userdata);
    },
    bindAssetsUsingPromises:function(component, helper)
    {        
        if(component.get('v.usePromises')) {
            helper.helperFunctionAsPromise(component, helper.callApiForTabDetails,"new",helper)
            .then($A.getCallback(function() {
                return helper.helperFunctionAsPromise(component, helper.callApiForTabDetails,"recently",helper)
            }))
            .then($A.getCallback(function() {
                return helper.helperFunctionAsPromise(component, helper.callApiForTabDetails,"bookmarked",helper)
            }))
            .then($A.getCallback(function() {
                return helper.helperFunctionAsPromise(component, helper.callApiForTabDetails,"recommended",helper)
            }))
            .then($A.getCallback(function() {
            }))
            .catch($A.getCallback(function(err) {
                var toastEvent = $A.get("e.force:showToast");
                
                toastEvent.setParams({
                    title: 'Error',
                    type: 'error',
                    message: err.message
                });
                
                toastEvent.fire();
            }))
            .then($A.getCallback(function() {
            }));
        } 
        else
        {
            helper.callApiForTabDetails(component,'new', false, false,helper);
            helper.callApiForTabDetails(component,'recently', false, false,helper);
            helper.callApiForTabDetails(component,'bookmarked', false, false,helper);
            helper.callApiForTabDetails(component,'recommended', false, false,helper);
        }
    },
    helperFunctionAsPromise : function(component, helperFunction,tabname,helper) {
        return new Promise($A.getCallback(function(resolve, reject) {
            helperFunction(component,tabname, resolve, reject,helper);
        }));
    },
    callApiForTabDetails:function(component, tabname,resolve,reject,helper)
    {
        
        var action = component.get("c.getAssetSearchForConfig");
        var search = $(helper.viewassets).find('.searchinput').val().toString();
        action.setParams({
            "searchtext": search,
            "userid":component.get("v.userid"),
            "iscount":'0',
            "tabname":tabname
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data = JSON.parse(response.getReturnValue()).result;
                
                component.set("v."+tabname+"data",data);
                $(".sec-view-assets ."+tabname+"icon").removeClass("disabled");
                $('.'+tabname+"assetclick").click(function(){
                    var id = $(this).attr("id");
                    $(helper.assets).removeClass("CPViewAssetsclickcolor");
                    $(this).addClass("CPViewAssetsclickcolor");
                    helper.callApi(component,helper,'-1',id);
                });
                if(resolve) {
                    resolve('appendViaApexPromise succeeded');
                }
            } else {
                if(reject) {
                    reject(Error(response.getError()[0].message));
                }
            }
        });
        action.setBackground();
        $A.enqueueAction(action);
    },
    //show assets accordion data
    showAssets:function(component, helper,checkblank)
    {
        $(helper.msgbox).hide();
        var filterName = '';
        var search = $(helper.viewassets).find('.searchinput').val();
        if(checkblank)
            filterName = $(helper.viewassets).find('.categoryPicklist').val();
        if(checkblank && (filterName == "default" || filterName == "Select Category")){
            component.set("v.showerror",true);
            //$(helper.msgbox).show();
            return;
        }
        filterName = $(helper.viewassets).find('.categoryPicklist').val();
        if(filterName == "default" || filterName == "Select Category")
            filterName = '';
        //New asset changes
        /*if((filterName == "default" || filterName == "Select Category" ) && (search != ''))
            filterName = 'All';*/
     	
        var install = component.get("v.install") + '//?elt=' + helper.sessionID;
        var url = install+"&clean#search?text=" + search + "&isfilter=" + filterName + "&isdash=true&type=";
        var title= "View Assets";
        component.set("v.showerror",false);
      //component.set("v.showsearcherror",false);
        //var viewSearch = search;
        //var viewTabName = [filterName];
        //component.set("v.viewSearch",viewSearch);
        
        //component.set("v.viewTabName",tab);
       /* component.set("v.isMedia",0);
        component.set("v.isFirstLoad",0);
        component.set("v.page",0);
        component.set("v.isFirstLoadCheck",0);
		 component.set("v.isLoadUncheck",0);*/
        //new Asset changes
     	/*component.set("v.flag",false);
     	component.set("v.page",0);
        
        helper.getAssetRecord(component,event,helper,filterName,search);
        var cmpTarget = component.find('Modalbox');
        var cmpBack = component.find('Modalbackdrop');
        $A.util.addClass(cmpTarget, 'slds-fade-in-open');
        $A.util.addClass(cmpBack, 'slds-backdrop--open');  */ 
        
       helper.openModal(component,url,title,'');
      
    },
    getTypeTitle:function(type){
        if(type == "bookmarked")
            return "My Favorites";
        else if(type == "recently")
            return type.charAt(0).toUpperCase() + type.slice(1) + " Used Assets";
        return type.charAt(0).toUpperCase() + type.slice(1) + " Assets";
    },
    //show all assets on modal
    showAll:function(component, helper,type)
    {
        var install = component.get("v.install") + '//?elt=' + helper.sessionID;
        var typeTitle = helper.getTypeTitle(type);
        component.set('v.title',typeTitle);
        var src = install+"&clean#search?text=&isfilter=&isdash=true&type="+type+'&typeTitle='+typeTitle+'&isWidget=true';
        this.openModal(component,src,typeTitle,'');
    },
    //to open modal
    openModal:function(component,src,title,selecthtml)
    {   
        
        component.set('v.title',title);
        var modal = '';
        if(src == '')
            return;
        if(component.get("v.dependantwidget") !== "oneapp")
        {
            modal = $(this.viewassets).find(".modal-independant");
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
            //$(modal).find("#selectvalues").append(selecthtml);
            var optionlength = $(modal).find("#selectvalues").length;
            if(optionlength == 1)
                $(modal).find("#amp-select").hide();
            else
                $(modal).find("#amp-select").show();
        }
        else
            $(modal).find("#amp-select").hide();
        if(this.showsendbutton)
            $(modal).find("#modal-footer-send").show();
        if(title=="Publish")
            $(modal).find("#modal-footer-send").find("button").html(title);
        else
            $(modal).find("#modal-footer-send").find("button").html("Send");
        if(title == '')
        {
            $(modal).find("#modal-heading").hide();
            $(modal).find("#modal-heading").parent().css("padding","0px");
        }
        $(modal).find("#modal-heading").html(title);
        $(modal).find("iframe").attr("src",src);
        $(modal).show(); 
        this.showsendbutton = false;
    },
    //to open data in tab
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
    getDetails:function(component,helper,iscount,tabname)
    {
        var action = component.get("c.GetPersonaThemeForCurrentUser");
        action.setCallback(this, function(response){ 
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var apigetState = JSON.parse(response.getReturnValue()).status;
                if(apigetState == 1){
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                    title : 'Processing...',
                    message: "Please wait while we're updating your profile. This page may refresh after that.",
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
                        component.set("v.userid",data.result.userid.toString());
                        component.set("v.install",data.result.install);
                        component.set("v.mainnavbgcolor",data.result.pagecss.mainnavbgcolor);
                        component.set("v.mainnavfontcolor",data.result.pagecss.mainnavfontcolor);
                        component.set("v.subnavbgcolor",data.result.pagecss.subnavbgcolor);
                        component.set("v.companyname",data.result.pagedata.companyname);
                        component.set("v.username",data.result.pagedata.username);
                        helper.bindPage(component,helper,'1','');
                    }
                }
            }  
        });
        action.setBackground();
        $A.enqueueAction(action);
    },
	 getAssetRecord : function(component,event,helper,filterName,search)
    {
        var assetTab = component.get("c.getAssetTab");
        
        assetTab.setParams({
            "linkid" : '0',
            "source" : "contact",
        });
        assetTab.setCallback(this,function(response){
            var state = response.getState();
            var pushFinalMessage="";
            if(state === "SUCCESS"){
                var apiStatus=JSON.parse(response.getReturnValue()).status;
                if(apiStatus==1)
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
                }
                else{
                var data = JSON.parse(response.getReturnValue());
                 var finalresponse=data.result.code;
                var finalmessage=data.result.msg;
                if(finalresponse==false)
                {
                        pushFinalMessage= finalmessage;
                           
                 }
                else{
                    if(data.result.tabs.length > 0){
                        for(var i=0;i<=data.result.tabs.length-1;i++){
                            data.result.tabs[i].TabName =helper.escapeString(component,event,helper,data.result.tabs[i].TabName);
                        }
                        component.set('v.tabs',data.result.tabs);
                        
                    }
                        
                var tabcount=[];
                for(var i=0;i<data.result.tabs.length;i++){
                    var jo={};
                    jo["tabname"]=data.result.tabs[i].TabName;
                    jo["templatetype"]=data.result.tabs[i].arrenums;
                    tabcount.push(jo);
                }
                component.set("v.tabcountNew",tabcount);
                        component.set('v.searchtxt',search);
                        component.set("v.permission",data.result.permissions);
                        
                        helper.templateTypeLink = data.result.templatetypelink; 
                        component.set("v.templateTypeLink",data.result.templatetypelink);
                        
                        component.set('v.options',data.result.searchoptions);
                        // component.set('v.options').selectedIndex = 0;
                        
                        var tabSelected = $.grep(component.get('v.tabs'), function (element, index) {
                            return element.TabName == filterName;
                        });
                        
                        if (tabSelected.length > 0 ){
                            
                            var currentFolderwithID = [];
                            var currentTabFolderEnum = [];
                            var folderFilter = [];
                            for(var i = 0; i< tabSelected[0].arrtypes.length; i++)
                            {
                                var foldername = tabSelected[0].arrtypes[i];
                                var folderEnum = tabSelected[0].arrenums[i];
                                var item = {};
                                var jo={};
                                item["foldername"] = foldername;
                                
                                item["enum"] = folderEnum;
                                jo[foldername] = true;
                                currentFolderwithID.push(item);
                                folderFilter.push(jo);
                            }
                            component.set("v.folderFilter",folderFilter);
                            
                            for(var i=0 ;i < currentFolderwithID.length;i++){
                                currentTabFolderEnum.push(currentFolderwithID[i].enum);
                            }
                            component.set("v.currentTabFolderEnum",currentTabFolderEnum);
                            component.set("v.currentFolderwithID",currentFolderwithID);
                            //helper.getAssetSearchRecord(component,event,helper,filterName);
                        }
                        var tab='';
                        if(filterName == 'All'){
                             tab= component.get('v.tabs');
                        }else{
                         tab =[];
                        var tabObj = {};
                        tabObj.TabName = filterName;
                        tab.push(tabObj);
                        }
                         var childComponent = component.find('child');
                childComponent.viewAssetMethod(component.get("v.searchtxt"),tab,component.get("v.options"),
                                               component.get("v.currentFolderwithID"),
                                               component.get("v.permission"),component.get("v.currentTabFolderEnum"),filterName,true,pushFinalMessage,component.get("v.mainnavbgcolor"),component.get("v.mainnavfontcolor"));
                    }
                
                } 
            }
        });
        $A.enqueueAction(assetTab);
    },
	getAssetSearchRecord : function(component,event,helper,filterName){
        var currentTabFolderEnum = component.get("v.currentTabFolderEnum");
        var searchText = component.get("v.searchtxt");
        var page = component.get("v.page");
        var pagesize = component.get("v.pagesize");
        var assetSearchApi = component.get("c.sfGetAssetSearchForConfigTemplate") ;
        var isMedia = component.get("v.isMedia");
        var filterid ;
       	var conditionval;
        if(component.get("v.filterids") !=  null)
         	filterid=component.get("v.filterids");
        else
            filterid=[];
        if(component.get("v.conditionVal") == true )
            conditionval=true;
            else
             conditionval=false;
         var filterFlagVal = component.get("v.filterFlag");
        assetSearchApi.setParams({
            
            "page" :page,
            "pagesize":pagesize,
            "searchparam":searchText,
            "tableType":[],
            "templateType":currentTabFolderEnum,
            "tempSearch":false,
            "tabName":filterName,
            "isMedia":isMedia,
            "filters":filterid,
            "condition":conditionval,
            "sortupdate":"updatedon",
             "filFlag":filterFlagVal,
        });
        assetSearchApi.setCallback(this,function(response){
            var state = response.getState();
            var pushFinalMessage="";
            if(state === "SUCCESS"){
                 var apiStatus=JSON.parse(response.getReturnValue()).status;
                var assetRecord = JSON.parse(response.getReturnValue());
                var finalresponse=assetRecord.result.code;
                var finalmessage=assetRecord.result.msg;
                if(apiStatus==1)
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
                }
                else{
                     if(finalresponse==false)
                     {
                         pushFinalMessage=finalmessage;                         
                	}
                    else{
                       
                        
                        var assetRecordItem = assetRecord.result.tabData.item;
                        component.set("v.rowcount",assetRecord.result.tabData.row_count);
                        component.set("v.pages",Math.ceil(assetRecord.result.tabData.row_count/component.get("v.pagesize")));
                        var pages = component.get("v.pages");
                        if(assetRecordItem.length ==0){
                            component.set("v.nodata",true);
                            component.set("v.spinner",false);
                            component.set("v.itemss",undefined);
                            $(helper.assetrecord).find('.rotate').removeClass("rotate-me");
                        }
                        
                        else{
                            if(assetRecord.result.filterData != null){
                                if(assetRecord.result.filterData.noncategorized.length > 0 )
                                    component.set("v.Noncategorizedfilters",assetRecord.result.filterData.noncategorized);
                                else
                                    component.set("v.Noncategorizedfilters",null); 
                                
                                if(assetRecord.result.filterData.categorized.length > 0)
                                    component.set("v.categorizedfilters",assetRecord.result.filterData.categorized);
                                else
                                    component.set("v.categorizedfilters",null); 
                            }
                            var items = [];
                            for(var i = 0; i< assetRecordItem.length; i++)
                            {
                                var item = {};
                                assetRecordItem[i].metadata = JSON.parse(assetRecordItem[i].metadata);
                                
                                var typeStr = assetRecordItem[i].metadata.templatetype;//"WEB"
                                var templateTypeLink = component.get("v.templateTypeLink");
                                var typeValue = templateTypeLink[typeStr];
                                assetRecordItem[i].typename = typeStr;
                                assetRecordItem[i].typevalue = typeValue;
                                assetRecordItem[i].filetype = assetRecordItem[i].metadata.filetype;
                                if(typeStr == "PRINT" || typeStr == "DATAROOM" || typeStr =="POWERPOINT" || typeStr =="WEB" || 
                                   typeStr =="EMAIL" || typeStr =="EXTERNALLINKS" || typeStr =="INTERNALPLAYBOOK" || typeStr =="EBOOK" || typeStr =="BLOGPOST" || typeStr =="WEBBANNER" || typeStr == "CONTRACT"){
                                    var _data = assetRecordItem[i];
                                    var install = component.get("v.install");
                                    var _metadata = _data.metadata;
                                    item["metadata"] = _data.metadata;
                                    item["typename"]=typeStr;
                                    item["typeValue"]=typeValue;
                                    item["id"] = _metadata.id;
                                    item["name"] = _metadata.name;
                                    item["desc"] = _metadata.desc;
                                    item["imgUrl"] = "";
                                    if(_metadata.thumbnailkey == undefined)
                                    {
                                        item["imgUrl"] = install+'/page/'+_metadata.firstpage +'/'+_metadata.templatepublickey+ '/' + _metadata.updatedon + '/thumbnail.jpeg';
                                        
                                    }
                                    else{
                                        item["imgUrl"] = install+'/timg/'+ _metadata.thumbnailkey +'/img';}
                                    item["output"] = _metadata.output;
                                    item["status"] = _metadata.status;
                                    item["filetype"]=_metadata.filetype;
                                    item["downloadurl"] = _metadata.downloadurl;
                                    item["encrepteduserid"] =assetRecord.result.encreptedUserID;
                                    item["usedatasource"] = _metadata.usedatasource;
                                    item["hasquestionnaire"] = _metadata.hasquestionnaire;
                                    item["useprojectsource"] = _metadata.useprojectsource;
                                    item["linkid"] = component.get("v.linkid");
                                    item["linktype"] = _data.linktype;
                                    item["updatedon"] = _data.updatedon;
                                    item["isprojects"] = false;
                                    item["flag10"] = assetRecordItem[i].flag10;
                                    item["index"] = i;
                                    items.push(item);
                                }
                                
                                else if(assetRecordItem[i].filetype == "VIDEO" ){
                                    
                                    var _data = assetRecordItem[i];
                                    //var encrepteduserid = component.get("v.userdata").encrepteduserid;
                                    var encrepteduserid = assetRecord.result.encreptedUserID;
                                    var install = component.get("v.install");
                                    var _metadata = _data.metadata;
                                    item["id"] = _data.linkid;                   
                                    if(_metadata.desc != null)
                                    {
                                        item["title"] = _metadata.desc;
                                        if(_metadata.desc.length <= 130)
                                            item["desc"] = _metadata.desc;
                                        else
                                            item["desc"] = _metadata.desc.substring(0,27);
                                    }
                                    else
                                        item["desc"] = "No Description";
                                    //var thumb = component.get("v.userdata").currentDomain+'/v4u/img/video.jpg';
                                    var thumb = assetRecord.result.currentDomain+'/v4u/img/video.jpg';
                                    var noThumb = false;
                                    var url = _metadata.url;
                                    thumb = this.getVideoThumbnail(url);
                                    if(thumb == "")
                                    {
                                        thumb = component.get("v.install") + "/v4u/img/video.jpg";
                                        noThumb = true;                       
                                    }
                                    item["noThumb"] = noThumb;
                                    item['url']=_metadata.url;
                                    item["filetype"] = _metadata.filetype;
                                    item["imgUrl"] = thumb;
                                    item["output"] = _metadata.output;    
                                    item["name"] = _metadata.name;
                                    item["fileurl"] = _metadata.fileurl;
                                    item["createdon"] = _metadata.createdon.split(' ')[0];
                                    item["linkid"] = component.get("v.linkid");
                                    item["linktype"] = _data.linktype;
                                    item["updatedon"] = _data.updatedon;
                                    item["nameurl"] = _metadata.fileurl+'?userid=' +encrepteduserid+ '&rand=1';
                                    item["metadata"] = _data.metadata;
                                    item["flag10"] = assetRecordItem[i].flag10;
                                    item["index"] = i;
                                    items.push(item);
                                    
                                    
                                }
                                    else if(assetRecordItem[i].filetype == 'TEXT'|| assetRecordItem[i].filetype == 'PPT' || assetRecordItem[i].filetype == 'XLS' || assetRecordItem[i].filetype == 'CSV' ||
                                            assetRecordItem[i].filetype == 'STEP'||  assetRecordItem[i].filetype == 'PPTX' || assetRecordItem[i].filetype == 'PDF'  ||
                                            assetRecordItem[i].filetype == 'DOC' || assetRecordItem[i].filetype == 'DOCX' || assetRecordItem[i].filetype == 'XLSX' 
                                            || assetRecordItem[i].filetype == 'CSS'  || assetRecordItem[i].filetype == 'XML'  || assetRecordItem[i].filetype == 'ZIP' || 
                                            assetRecordItem[i].filetype == 'ZIPX'  || assetRecordItem[i].filetype == 'RAR'  || assetRecordItem[i].filetype == '7Z' || assetRecordItem[i].filetype == 'S7Z'
                                            || assetRecordItem[i].filetype == 'CFS'  || assetRecordItem[i].filetype == 'ICS'  || assetRecordItem[i].filetype == 'VCS'  || assetRecordItem[i].filetype == 'DWG'
                                            || assetRecordItem[i].filetype == 'STP'||assetRecordItem[i].filetype == 'DOCUMENT'){
                                        
                                        var _data = assetRecordItem[i];
                                        var install = component.get("v.install");
                                        var _metadata = _data.metadata;
                                        item["id"] = _data.linkid;
                                        item["filetype"] = _metadata.filetype;
                                        item["title"] = _metadata.name;
                                        if(_metadata.name <= 30)
                                            item["name"] = _metadata.name;
                                        else
                                            item["name"] = _metadata.name.substring(0,27);
                                        
                                        item["desc"] = _metadata.desc;
                                        item["filesize"] = _metadata.filesize;
                                        item["thumburl"] = _metadata.thumburl;
                                        item["url"] = _metadata.url;
                                        item["downloadurl"] = _metadata.downloadurl;
                                        item["fileurl"] = _metadata.fileurl;
                                        item["output"] = _metadata.output;
                                        item["createdon"] = _metadata.createdon.split(' ')[0];
                                        item["itemupdatedon"] = _metadata.updatedon.split(' ')[0];
                                        item["linkid"] = component.get("v.linkid");
                                        item["linktype"] = _data.linktype;
                                        item["updatedon"] = _data.updatedon;
                                        item["metadata"] = _data.metadata;
                                        item["index"] = i;
                                        items.push(item); 
                                    }
                                        else if(assetRecordItem[i].filetype == "JPEG" ||assetRecordItem[i].filetype == "PNG"){
                                            var _data = assetRecordItem[i];
                                            var install = component.get("v.install");
                                            var _metadata = _data.metadata;
                                            item["id"] = _data.linkid;
                                            item["filetype"] = _metadata.filetype;
                                            item["title"] = _metadata.name;
                                            if(_metadata.name <= 30)
                                                item["name"] = _metadata.name;
                                            else
                                                item["name"] = _metadata.name.substring(0,27);
                                            
                                            item["desc"] = _metadata.desc;
                                            item["output"] = _metadata.output;
                                            item["filters"] = _metadata.filters;
                                            item["filesize"] = _metadata.filesize;
                                            item["thumburl"] = _metadata.thumburl;
                                            item["fileurl"] = _metadata.fileurl;
                                            item["url"] = _metadata.url;
                                            item["imgUrl"] = _metadata.thumburl;
                                            item["createdon"] = _metadata.createdon.split(' ')[0];
                                            item["itemupdatedon"] = _metadata.updatedon.split(' ')[0];
                                            item["linkid"] = component.get("v.linkid");
                                            item["linktype"] = _data.linktype;
                                            item["updatedon"] = _data.updatedon;
                                            item["metadata"] = _data.metadata;
                                            item["index"] = i;
                                            items.push(item); 
                                        }else if(assetRecordItem[i].metadata.trackinglink == true){
                                            var _data = assetRecordItem[i];
                                            var install = component.get("v.install");
                                            var _metadata = _data.metadata;
                                            item["id"] = _metadata.id;
                                            item["name"] = _metadata.name;
                                            item["trackinglink"] = _metadata.trackinglink;
                                            item["fileurl"] = _metadata.fileurl;
                                            item["index"]=i;
                                            
                                            items.push(item);
                                        }
                                
                            }
                            component.set("v.itemss",items);
                            
                            
                        }
                        
                    }
                    var tab='';
                    if(filterName == "All"){
                         tab=component.get("v.tabs");
                    }else{
                    
                         tab =[];
                        var tabObj = {};
                        tabObj.TabName = filterName;
                        tab.push(tabObj);
                        component.set("v.flagcountVal",false);
                    }
                        
                        var childComponent = component.find('child');
                        childComponent.viewAssetMethod( component.get("v.searchtxt"),tab,component.get("v.options"),
                                                       component.get("v.currentFolderwithID"),
                                                       component.get("v.permission"), component.get("v.currentTabFolderEnum"),filterName,false,pushFinalMessage,component.get("v.mainnavbgcolor"),component.get("v.mainnavfontcolor"),component.get("v.itemss"),
                                                       component.get("v.pages"),component.get("v.rowcount"),component.get("v.install"),
                                               			component.get("v.categorizedfilters"),component.get("v.Noncategorizedfilters"),component.get("v.flagcountVal"));

            	}
            }
                                                           
        });
        
        $A.enqueueAction(assetSearchApi);
        
    },
    gettabcount :function(component,event,helper,tabName){
         var searchText = component.get("v.searchtxt");
        var page = component.get("v.page");
        var pagesize = component.get("v.pagesize");
        var assetcountApi = component.get("c.sfGetTabCount") ;
        var isMedia = component.get("v.isMedia");
        var filterid ;
       	var conditionval;
        if(component.get("v.filterids") !=  null)
         	filterid=component.get("v.filterids");
        else
            filterid=[];
        if(component.get("v.conditionVal") == true )
            conditionval=true;
            else
            conditionval=false;
     	var tabFolderEnum =component.get("v.currentTabFolderEnum");
        assetcountApi.setParams({
            "page" :page,
            "pagesize":pagesize,
            "searchparam":searchText,
            "tableType":[],
            "tempSearch":false,
            "isMedia":isMedia,
            "filters":filterid,
            "condition":conditionval,
            "sortupdate":"updatedon",
            "iscount":true,
            "tabdata":component.get("v.tabcountNew")
            
        });
        assetcountApi.setCallback(this,function(response){
            
            var state = response.getState();
            if(state === "SUCCESS"){
                var apiStatus=JSON.parse(response.getReturnValue()).status;
                if(apiStatus==1)
                {
                   
                     var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title : 'Info Message',
                        message: "An issue occured with the Mindmatrix widget, please contact admin",
                        duration:' 7000',
                        key: 'info_alt',
                        type: 'info',
                        mode: 'dismissible' 
                	});
        		 	toastEvent.fire(); 
                
                }                
                else
                {
                var tabcount = JSON.parse(response.getReturnValue());
                var finalresponse=tabcount.result.code;
                var finalmessage=tabcount.result.msg;
                  if(finalresponse==false)
                    {
                         var toastEvent = $A.get("e.force:showToast");
                             toastEvent.setParams({
                            title : 'Info Message',
                            message: 'In ViewAsset Widget'+' '+finalmessage,
                            duration:' 7000',
                            key: 'info_alt',
                            type: 'info',
                            mode: 'dismissible' 
               		       });
        				toastEvent.fire();
                        
                    }                    
                 else
                 {
                component.set("v.tabcountVal",tabcount.result.tabdata);
                
                 }
               }
                var childComponent = component.find('child');
                childComponent.ViewAssetTabMethod(component.get("v.tabcountVal"));
                
            }
        });
        
        $A.enqueueAction(assetcountApi);
  },
    dynamicColorBinding:function(component,event,helper){
        document.documentElement.style.setProperty('--mainnavbgcolor', component.get("v.mainnavbgcolor"));
        document.documentElement.style.setProperty('--mainnavfontcolor', component.get("v.mainnavfontcolor"));
        document.documentElement.style.setProperty('--subnavbgcolor', component.get("v.subnavbgcolor"));
    },
    escapeString: function(component,event,helper,str){
       return str.replace(/%27/g, "'").replace(/%27%27/g, "\"").replace(/%60/g, "`").replace(/%5c/g, "\\").replace(/%28/g, "\(").replace(/%29/g, "\)").replace(/%3e/g, ">").replace(/%3c/g, "<").replace(/%3e/,"&gt;").replace(/%3c/, "&lt;").replace(/%20/g, " ").replace(/%26/g, "&").replace(/%40/g, "@").replace(/%23/g, "#").replace(/%24/g, "$").replace(/%2f/g, "/");
    },
    
    docIcon:function(component,event,helper,filetype){
    var docIcon ='';
    if(filetype == 'TEXT')
    docIcon="doctype:txt";
    if(filetype == 'PPT' || filetype == 'PPTx')
    docIcon="doctype:ppt";
    if(filetype == 'XLS' || filetype == 'XLSX')
    docIcon="doctype:excel";
    if(filetype == 'CSV')
    docIcon="doctype:csv";
    if(filetype == 'ZIP' ||filetype == 'ZIPX')
    docIcon="doctype:zip";
    if(filetype == 'DOCUMENT'||filetype == 'DOCX' ||filetype == 'DOC')
    docIcon="doctype:word";
    if(filetype == 'STEP'||filetype == 'CSS' ||filetype == 'XML'||
    filetype == 'RAR'||filetype == '7Z'||filetype == 'S7Z' ||filetype == 'CFS' 
    ||filetype == 'ICS' ||filetype == 'VCS'||filetype == 'DWG'||filetype == 'STP')
    docIcon="doctype:unknown";
    return docIcon
}
    
})({
    ampdashboard:'',
    modal:'',
    viewassetresult:'',
    viewassetscontainer:'',
    maintitle:'',
    subtitle:'',
    divspinner:'',
    assets:'',
    showsendbutton:false,
    bindactions:true,
    enablement:'',
    enablementtag:'',
    enableampdashboard:'',
    viewassets:'',
    ampdashboardwithmenu:'',
    msgbox:'',
    ebookapisuccess:false,
    sessionID:'',
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
                component.set("v.install",data.result.installurl);
                if(data.result.userfound == true){
                    if(data.result.tos == false){
                        component.set('v.isOpen',true);
                        var url = data.result.installurl + "/?elt=" + data.result.usersessionid + "&returnurl=toschangepasswordsetting";
                        component.set("v.iframesrc",url);
                    }
                }
                if(getapiState==1)
                {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                    title : 'Processing...',
                    message: "Please wait while we're updating your profile. This page may refresh after that.",
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
                                helper.bindPage(component,helper,'1','');
                            else{
                                helper.getDetails(component,helper,'1','');
                                window.addEventListener('message',function(evt){
                                    var install = component.get("v.install");
                                    if(evt.origin == install)
                                    {
                                        if(evt.data == "CloseSendEmail")
                                        {
                                            setTimeout(function(){
                                                $(helper.closemodal).click();   
                                                
                                            },500);
                                        }
                                        else if(evt.data == "UserSetUpDone")
                                        {
                                            $(helper.closeiframe).click();
                                            helper.getPersonaTheme(component,helper);    
                                        }
                                    }
                                },false);
                            } 
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
    bindPage : function(component,helper,iscount,tabname) {
        helper.dynamicColorBinding(component,event,helper);
        this.ampdashboardwithmenu = $('.ampdashboardwithmenu').find('#enablementmenu');
        this.enablement = $("#divenablement");
        this.enablementtag = $(this.enablement).find('#iframetag');
        this.enableampdashboard = $(".ampdashboard");
        this.ampdashboard = $(this.enableampdashboard).closest("html");
        this.assets = $('.assets');
        this.modal = $(this.enableampdashboard).find('.demo-modal').not(".modal-independant");
        this.viewassetresult = $('.view-assets-result');
        this.viewassetscontainer = $('.view-assets-container');
        this.maintitle = $(this.viewassetresult).find('.maintitle');
        this.subtitle = $(this.viewassetresult).find('.subtitle');
        this.divspinner = $(this.viewassetresult).find('.divspinner');
        
        
        this.callApi(component,helper,iscount,tabname);
        this.showsendbutton = false;
        $(this.viewassetresult).find('.closeaccordion').click(function(){
            $(helper.assets).removeClass("CPViewAssetsclickcolor");
            helper.closeaccordion(component,helper);
        });
        
    },
    //to close accordion
    closeaccordion:function(component,helper)
    {
        $(this.viewassetresult).toggle();
    },
    //api to get data of viewassets
    callApi:function(component,helper,iscount,tabname)
    {
        if(iscount == "-1")
        {
            $(this.viewassetresult).show();
            $(this.divspinner).show();
            
            $(this.viewassetscontainer).hide();
            //$(this.viewassetresult).show();
            var username = component.get("v.username");
            var companyname = component.get("v.companyname");
            if(tabname == 'recently')
            {
                $(this.maintitle).html("Recently Used");
                $(this.subtitle).html(component.get("v.companyname") +"'s recent used assets");
            }
            else if(tabname == 'new')
            {
                $(this.maintitle).html("Assets Released In Last 90 Days");
                $(this.subtitle).html(component.get("v.companyname")+"'s recently released assets.");
            }
                else if(tabname == 'bookmarked')
                {
                    $(this.maintitle).html("My Favorites");
                    $(this.subtitle).html(component.get("v.companyname")+"'s favorite assets.");
                }
                    else if(tabname == 'recommended')
                    {
                        $(this.maintitle).html("Recommended");
                        $(this.subtitle).html(component.get("v.companyname")+"'s assets filtered by opportunity or contact.");
                    }
            var data = component.get("v."+tabname+"data");
            setTimeout(function(){
                helper.bindassets(component,helper,data,tabname);
            },10);
            return;
            
        }
        var action = component.get("c.getAssetSearchForConfig");
        var search = $(this.viewassets).find('.searchinput').val().toString();
        action.setParams({
            "searchtext": search,
            "userid":component.get("v.userid"),
            "iscount":iscount,
            "tabname":tabname
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
                        component.set('v.apiErrorMsg',finalmessage);
                        var selectVal =$(helper.viewassets).find('.categoryPicklist').val();
                         if(selectVal == null)
                             $(helper.viewassets).find('.errorMsg').html('Sorry!'+" "+finalmessage);
                     }
                    else{
                    data = data.result;
                    if(iscount == "1")
                        helper.bindcount(component,helper,data);
                    else{
                        if(component.get("v.dependantwidget"))
                            helper.bindassetsold(component,helper,data,tabname);
                        else
                            helper.bindassets(component,helper,data,tabname);
                    }
                    }
                }
            }
        });
        $A.enqueueAction(action);
    },
    //success function of viewassets
    bindassets:function(component,helper,data,tabname)
    {
        var tabdatas = data.tabdatas;
        var userdata = data.userdata;
        var install = component.get("v.install") + '//?elt=' + helper.sessionID;
        var fontcolor = component.get('v.mainnavbgcolor');
        var assetdatas = [];
        var iterationdata = {};
        for(var i = 0;i<=tabdatas.length-1;i++)
        {  
            var pretabname = tabdatas[i].tabname;
            if(pretabname == tabname)
            {                  
                var items = tabdatas[i].item;
                var max = items.length;
                //if(max == 7)
                //    max = 6;
                //else if(max > 7)
                //    max = 7;
                var html = '';
                for(var j=0;j<=max-1;j++)
                {
                    
                    var assetdata = {}; 
                    var metadata = JSON.parse(items[j].metadata);
                    var _class='';
                    var iframesrc = '';
                    var templatetype = metadata.templatetype;
                    var output = metadata.output;
                    var id = metadata.id;
                    if(templatetype == undefined || templatetype == "undefined" || templatetype == ""){
                        if(output == "2")
                        {
                            _class="showinmodal";
                            iframesrc = metadata.url + '?clean';
                        }
                        else
                        {
                            _class="showinenablement";
                            iframesrc = metadata.fileurl+ '?clean';
                        }
                    }
                    else
                    {
                        _class="showinmodal";
                        if(templatetype == "INTERNALPLAYBOOK")
                        {
                            if(items[j].flag10.toString() == "9")
                                iframesrc = install+'&clean#linearinternalplaybook/'+metadata.id;
                            else
                                iframesrc = install+'&clean#internalplaybook/'+metadata.id;
                        }
                        if(templatetype == "EMAIL")
                        {
                         _class="showinenablement";
                         if(userdata.canEmailSend)
                         {
                             if(output)
                                 iframesrc = install+'&clean#v4u/ajax/widgets/sf-handler.cshtml?sftask=GetEmailMediaByOrgTemplateId&id='+metadata.id+'&name='+metadata.name;
                             else
                                 iframesrc = install+'&clean#v4u/ajax/widgets/sf-handler.cshtml?sftask=EmailMedia&id='+metadata.id+'&name='+metadata.name+'&canEmailSend='+userdata.canEmailSend;
                         }
                        }
                        if(templatetype == "WEB")
                        {
                            _class="showinenablement";
                            //iframesrc = install+'&clean#manage/web/'+metadata.id +'/view';
                        }
                        if(templatetype == "WEBBANNER")
                        {
                            _class="showinenablement";
                            //iframesrc = install+'&clean#manage/web/'+metadata.id +'/view';
                        }
                        if(templatetype == "DATAROOM")
                        {
                            _class="showinmodal";
                            iframesrc = install+'&clean#collateral/data-room/'+metadata.id +'/view';
                        }
                        if(templatetype == "PRINT")
                        {
                            _class="showinenablement";
                            //iframesrc = install+"&clean#collateral/pdf/" + metadata.id + "/view";
                        }
                        if(templatetype == "POWERPOINT")
                        {
                            iframesrc = component.get("v.install")+"/ppt/" + metadata.templatekey + "/" + metadata.userkey
                        }
                        if(templatetype == "FORM")
                        {
                            _class="showinmodal";
                            iframesrc = install+"&clean#collateral/pdf/" + metadata.id + "/view";
                        }
                        if(templatetype == "EBOOK")
                        {
                            _class = "showinmodal";
                            iframesrc = install + "&clean#collateral/ebook/"+ metadata.id + "/view";
                        }
                        if(templatetype == "BLOGPOST")
                        {
                           iframesrc = component.get("v.install")+"/auto2/" + metadata.templatekey + "/" + metadata.userkey
                        }
                    }
                    assetdata["id"]=id;
                    assetdata["class"] = _class;
                    assetdata["iframesrc"] = iframesrc;
                    assetdata["linkid"] = items[j].linkid;
                    assetdata["linktype"] = items[j].linktype;
                    assetdata["flag6"] = items[j].flag6;
                    assetdata["status"] = items[j].status;
                    assetdata["metadata"] = metadata;
                    assetdata["metadatastr"] = JSON.stringify(metadata);
                    assetdata["showsend"] = false;
                    assetdata["showdownload"] = false;
                    assetdata["showsendtopartner"] = false;
                    assetdata["showrating"] = false;
                    assetdata["showpublish"] = false;
                    assetdata["showaddtodataroom"] = false;
                    assetdata["hovericon"] = '';
                    assetdata["showcustomize"] = false;
                    assetdata["showreport"] = false;
                    assetdata["showprintvendor"] = false;
                    assetdata["showebook"] = false;
                    assetdata["associatedAssets"] = false;
                    if(templatetype == "EMAIL")
                    {
                        if(output==false)
                        {
                            if(userdata.canEmailSend)
                            {
                                assetdata["showsend"] = true;
                            }
                            if(userdata.IsSiteAdmin || userdata.IsSuperAdmin || (userdata.canEmailSend &&userdata.hasPartnerAccess))
                            {
                                assetdata["showsendtopartner"] = true;
                            }
                            if(!userdata.hasquestionnaire && userdata.usedatasource != 1)
                            {
                                assetdata["showdownload"] = true;
                            }
                        }
                    }
                    if(templatetype == undefined && (output == 1 || output == 0))
                    {
                        var filetype=metadata.filetype;
                        assetdata["hovericon"] = helper.docIcon(component,event,helper,filetype);
                        assetdata["showdownload"] = true;
                        if(userdata.canEmailSend)
                        {
                            assetdata["showsend"] = true;
                        }
                        if (userdata.IsSiteAdmin || userdata.IsSuperAdmin ||(userdata.hasPartnerAccess && userdata.canEmailSend))
                        {
                            assetdata["showsendtopartner"] = true;
                        }
                        if (userdata.hasRatingAccess)
                        {
                            assetdata["showrating"] = true;
                        }
                        if (userdata.canAutoPublish)
                        {
                            assetdata["showpublish"] = true;
                        }
                        if (userdata.hasDataRoomAccess)
                        {
                            assetdata["showaddtodataroom"] = true;
                        }
                    }
                    if(templatetype == undefined && output == 2)
                    {
                        if (userdata.canEmailSend)
                        {
                            assetdata["showsend"] = true;
                        } 
                        if (userdata.IsSiteAdmin || userdata.IsSuperAdmin ||(userdata.hasPartnerAccess && userdata.canEmailSend))
                        {
                            assetdata["showsendtopartner"] = true;
                        }
                        if (userdata.canAutoPublish)
                        {
                            assetdata["showpublish"] = true;
                        }
                        
                        if (userdata.hasDataRoomAccess)
                        {
                            assetdata["showaddtodataroom"] = true;
                        }
                    }
                    if(templatetype == "WEB")
                    {
                        assetdata["hovericon"] = 'utility:world';
                        if(userdata.canWebEdit)
                        {
                            assetdata["showcustomize"] = true;
                        }
                        if(output)
                        {
                            assetdata["showreport"] = true;
                            if (userdata.canWebSend)
                            {
                                assetdata["showsend"] = true;
                            }
                            if (userdata.canWebPublish)
                            {
                                assetdata["showpublish"] = true;
                            }
                            
                            if (userdata.hasDataRoomAccess)
                            {
                                assetdata["showaddtodataroom"] = true;
                            }
                        }
                    }
                    /*if(templatetype == "FAQ")
                    {
                        if (userdata.canEmailSend)
                        {
                            assetdata["showsend"] = true;
                        }
                        if (userdata.IsSiteAdmin || userdata.IsSuperAdmin || (userdata.canEmailSend &&userdata.hasPartnerAccess))
                        {
                            assetdata["showsendtopartner"] = true;
                        }
                        
                        assetdata["associatedAssets"] = true;
                        
                        
                    }
                    if(templatetype == "BLOGPOST")
                    {
                            if (userdata.canAutoPublish && userdata.canPublish)
                            {
                                assetdata["showpublish"] = true;
                            }
                            
                    }*/
                    if(templatetype == "WEBBANNER")
                    {
                        if(userdata.canEdit)
                        {
                            assetdata["showcustomize"] = true;
                        }
                       /* if (userdata.canSend)
                        {
                            assetdata["showsend"] = true;
                        }
                        if (userdata.canAutoPublish && userdata.canPublish)
                        {
                            assetdata["showpublish"] = true;
                        }
                        if (userdata.IsSiteAdmin || userdata.IsSuperAdmin || (userdata.canEmailSend &&userdata.hasPartnerAccess))
                        {
                            assetdata["showsendtopartner"] = true;
                        }*/
                    }
                    if(templatetype == "PRINT")
                    {
                        assetdata["hovericon"] = 'utility:page';
                        if(userdata.canEdit)
                        {
                            assetdata["showcustomize"] = true;
                        }
                        assetdata["showdownload"] = true;
                        if (userdata.canSend)
                        {
                            assetdata["showsend"] = true;
                        }
                        if(output)
                        {
                            if (userdata.canOrderPrint)
                            {
                                assetdata["showprintvendor"] = true;
                            }
                            if (userdata.canPublish)
                            {
                                assetdata["showpublish"] = true;
                            }
                            if (userdata.hasEbookAccess)
                            {
                                assetdata["showebook"] = true;
                            }
                            if (userdata.IsSiteAdmin || userdata.IsSuperAdmin || (userdata.canEmailSend &&userdata.hasPartnerAccess&&userdata.canSend))
                            {
                                assetdata["showsendtopartner"] = true;
                            }
                            if (userdata.hasDataRoomAccess)
                            {
                                assetdata["showaddtodataroom"] = true;
                            }
                            
                        }                                 
                        if(!output)
                        {
                            if (userdata.canOrderPrint)
                            {
                                assetdata["showprintvendor"] = true;
                            }
                            if (userdata.canPublish)
                            {
                                assetdata["showpublish"] = true;
                            }
                            if (userdata.hasEbookAccess)
                            {
                                assetdata["showebook"] = true;
                            }
                            if (userdata.IsSiteAdmin || userdata.IsSuperAdmin || (userdata.canEmailSend &&userdata.hasPartnerAccess&&userdata.canSend))
                            {
                                assetdata["showsendtopartner"] = true;
                            }
                            if (userdata.hasDataRoomAccess)
                            {
                                assetdata["showaddtodataroom"] = true;
                            }
                        }
                    }
                    if(templatetype == "DATAROOM")
                    {
                        if (userdata.canPlayBookEdit)
                        {
                            assetdata["showcustomize"] = true;
                        }
                        if (userdata.canPlayBookSend)
                        {
                            assetdata["showsend"] = true;
                        }
                        if(output)
                        {
                            assetdata["showreport"] = true;
                            if (userdata.canPlayBookPublish)
                            {
                                assetdata["showpublish"] = true;
                            }
                            if (userdata.IsSiteAdmin || userdata.IsSuperAdmin || (userdata.canEmailSend &&userdata.hasPartnerAccess&&userdata.canPlayBookSend))
                            {
                                assetdata["showsendtopartner"] = true;
                            }
                            
                            
                        }
                        if(!output)
                        {
                            if (userdata.canPlayBookPublish)
                            {
                                assetdata["showpublish"] = true;
                            }
                            if (userdata.IsSiteAdmin || userdata.IsSuperAdmin || (userdata.canEmailSend &&userdata.hasPartnerAccess&&userdata.canPlayBookSend))
                            {
                                assetdata["showsendtopartner"] = true;
                            }
                        }
                    }
                    if(templatetype == "INTERNALPLAYBOOK")
                    {		
                        assetdata["hovericon"] = 'utility:notebook';
                        if(output)
                        {
                            assetdata["showreport"] = true;
                        }
                    }
                    if(templatetype == "POWERPOINT")
                    {
                        assetdata["hovericon"] = 'utility:side_list';
                        if (userdata.canPowerPointsend)
                        {
                            assetdata["showsend"] = true;
                        }
                        assetdata["showdownload"] = true;
                        if(output)
                        {
                            assetdata["showreport"] = true;
                            if (userdata.canPowerPointEdit)
                            {
                                assetdata["showcustomize"] = true;
                            }
                            if (userdata.IsSiteAdmin || userdata.IsSuperAdmin || (userdata.canEmailSend &&userdata.hasPartnerAccess&&userdata.canPowerPointsend))
                            {
                                assetdata["showsendtopartner"] = true;
                            }
                            if (userdata.hasDataRoomAccess)
                            {
                                assetdata["showaddtodataroom"] = true;
                            }
                            
                        }
                        if(!output)
                        {
                            if (userdata.canPowerPointEdit)
                            {
                                assetdata["showcustomize"] = true;
                            }
                            if (userdata.IsSiteAdmin || userdata.IsSuperAdmin || (userdata.canEmailSend &&userdata.hasPartnerAccess&&userdata.canPowerPointsend))
                            {
                                assetdata["showsendtopartner"] = true;
                            }
                            if (userdata.hasDataRoomAccess)
                            {
                                assetdata["showaddtodataroom"] = true;
                            }
                        }
                    }
                    if(templatetype == "CONTRACT")
                    {
                      if( metadata.usedatasource == "0" && metadata.hasquestionnaire==false){
                        if(userdata.canCreate && userdata.canSend){
                                assetdata["showsend"] = true;
                                assetdata["showcustomize"] = true;
                            }
                        
                        if(userdata.IsSiteAdmin || userdata.IsSuperAdmin || (userdata.canEmailSend &&userdata.hasPartnerAccess&& userdata.canSend))
                           assetdata["showsendtopartner"] = true;
                      }
                        if(metadata.usedatasource == "0" && metadata.hasquestionnaire==true){
                            if(userdata.canCreate){
                                assetdata["showcustomize"] = true;
                            }
                        }
                    }
                    assetdata["imgsrc"] = '';
                    assetdata["showvideoimage"] = false;
                    if(metadata.templatetype == undefined)
                    {
                        if(metadata.output == 0)
                        {
                            assetdata["imgsrc"]=metadata.thumburl200;
                        }
                        else if(metadata.output == 1)
                        {
                            if(metadata.filetype == "PDF" || metadata.filetype == "PDFPAGE")
                            {
                                assetdata["imgsrc_thumb"]=metadata.thumburl;
                                assetdata["imgsrc"]=metadata.thumburl200;
                            }
                            else
                            {
                                assetdata["imgsrc"]=metadata.thumburl200;
                                //<i class="{{= getDocumentIconClass(data.name)}}" style="max-height: 100px;max-width: 100px;"/>';
                            }
                        }
                            else if(metadata.output == 2)
                            {
                                if(metadata.thumburl200 == undefined){
                                    assetdata["imgsrc"]=  this.getVideoThumbnail(metadata.url);
                                    assetdata["showvideoimage"] = true;
                                }
                                else {
                                    if(metadata.thumburl200.indexOf("timg200") > -1){
                                        assetdata["imgsrc"]=  metadata.thumburl200;
                                        assetdata["showvideoimage"] = true;
                                    }
                                    else{
                                        assetdata["imgsrc"]=  this.getVideoThumbnail(metadata.url);
                                        assetdata["showvideoimage"] = true;
                                    }
                                }
                            }
                        if(metadata.trackinglink == true)
                        {
                            //<i class="fa fa-link" style="font-size:100px;" data-action-item="{{=index}}" data-action="edit"></i>
                        }
                    }
                    else
                    {
                        if(metadata.thumbnailkey == undefined)
                        {
                            assetdata["imgsrc"]=  component.get("v.install")+'/page/'+metadata.firstpage+'/'+metadata.templatepublickey+'/'+metadata.updatedon+'/thumbnail.jpeg';
                        }
                        else    
                        {
                            assetdata["imgsrc"]=  component.get("v.install")+'/timg/'+metadata.thumbnailkey+'/img';
                        }
                    }	
                    assetdata["newimgsrc"] = '';
                    assetdata["shownewimage"] = false;
                    
                    if(this.daydiff(metadata.createdon) < 90 && (!metadata.output || metadata.templatetype == undefined))
                    {
                        assetdata["newimgsrc"] = component.get("v.install")+'/AppThemes/default/img/new-icon.png';
                        assetdata["shownewimage"] = true;
                    }
                    assetdata["fontcolor"] = fontcolor;
                    assetdatas.push(assetdata);
                }
                iterationdata["showmore"] = false;
                //if(items.length > max)
                
                
                iterationdata["tabname"] = pretabname;
                iterationdata["assets"] = assetdatas;
                component.set("v.items",iterationdata);
                setTimeout(function(){
                    var records = $(".asset-col");
                    var isDisplayNone = false;
                    for(var q = 0;q<=records.length -1;q++)
                    {
                        var $record = $(records[q]);
                        if($record.css("display") == "none")
                        {
                            isDisplayNone = true;
                            break;
                        }
                    }
                    if(isDisplayNone)
                    {
                        var idata = component.get("v.items");
                        idata["showmore"] = true;
                        component.set("v.items",idata);
                    }
                    if(helper.bindactions){
            $(helper.viewassetscontainer).find('.viewAll').unbind("click").click(function(){
                var type = $(this).find('.typename').html();
                helper.showAll(component, helper,type);
            });
            $(helper.viewassetscontainer).find('.showinmodal').unbind("click").click(function()
            {
             
                 var src = $(this).find('.iframesrc').html();
                 var templatetype = $(this).find('.templatetype').html();
                 var name = $(this).find('.name').html();
                 
                 var title = '';
                 if(templatetype == "EMAIL")
                     title = "Send " + name;
                 else
                     title = "View of "+name;
                 helper.openModal(component,src,title,'');
             //open modal
            });
            
            $(helper.viewassetscontainer).find('.showinenablement').unbind("click").click(function()
			{
             var install = component.get("v.install") + '//?elt=' + helper.sessionID;
             var rec = $(this).closest('.asset-col');
             var metadata = JSON.parse($(rec).find('.metadata').html());
             var templatetype = $(rec).find('.templatetype').html();
             var output = $(rec).find('.output').html() == "true" ?true:false;
             var flag6 = $(rec).find('.flag6').html() == "true" ?true:false;
             var id = $(rec).attr('id');
                
             if(templatetype == "BLOGPOST"){
                  
                 var url=component.get("v.install")+"/auto2/"+metadata.templatekey+"/"+metadata.userkey;
                  if(url != '')
                 	helper.showEnablement(helper,component,url);
             }
                else if(templatetype == "CONTRACT"){
                 var title="Customize Contract";
                  var templatedata={};
                       if (!metadata.output) {
                           if(userdata.canSendAssets && userdata.canCreateAssets){
                               templatedata['usedatasource']=metadata.usedatasource;
                               templatedata['id']=metadata.id;
                               templatedata['name']=metadata.name;
                               var _templatedata = window.btoa((JSON.stringify(templatedata)));
                               var src = install+"&clean#assets?closesfmodal=true&function=onCustomizeSuccessContract&templatedata=" + _templatedata;
                               helper.openModal(component,src,title,'');
                           }
                       }
                     else {
                    if(userdata.canEditAssets){
                        if(metadata.status == 2){
                             templatedata['id']=metadata.id;
                            templatedata["ispartner"] = 1;
                            var _templatedata = window.btoa((JSON.stringify(templatedata)));
                            var src = install+"&clean#assets?closesfmodal=true&function=showEditContractWizard&templatedata=" + _templatedata;
                            helper.openModal(component,src,title,'');
                        }
                        else{
                       
                            templatedata["cansend"] = userdata.canSendAssets;
                            templatedata["canorderprint"] = userdata.canorderprint;
                            templatedata["canpublish"] = userdata.canPublishAssets ;
                            templatedata["canedit"] = userdata.canEditAssets;
                            templatedata["linkids"] = linkid;
                            templatedata["isSmartlist"] = null;
                            templatedata["isMedia"] = metadata.output;
                            var _templatedata = window.btoa((JSON.stringify(templatedata))); 
                            var src = install+"&clean#assets?closesfmodal=true&function=showPrint&templatedata=" + _templatedata;
                            helper.openModal(component,src,title,'');
                        }
                    }
                    }
                // helper.openModal(component,src,title,'');
             }
                    else if(templatetype == "WEB"){
                        if(!output)
                     {
                         if(userdata.canWebCreate)
                         {
                             name = 'New Media';
                             var usedatasource = metadata.usedatasource;
                             var _type = "WEB";
                             if(flag6 == true)
                                 _type = "WEB";
                             else
                                 _type = "LANDINGPAGE";
                             src = install+'&clean#v4u/ajax/widgets/sf-handler.cshtml?type='+_type+'&sftask=CreateTemporaryMedia&id='+id+'&name='+name+'&usedatasource='+usedatasource ;
                             //helper.showEnablement(helper,component,src);
                             helper.openModal(component,src,title,'');
                             //helper.callcustomizeapi(component,event,helper,id,name);
                         }
                         else if(userdata.canEdit)
                         {
                             title = 'Website';
                             if (!metadata.isNeedApproval) {
                                 if (!metadata.isApproved) {
                                     if (metadata.customize) {
                                         if (metadata.canedit)
                                             selecthtml = '<option value="'+install+'&clean#manage/web/' + id + '/editor">Editor</option>';
                                         src = install+'&clean#manage/web/' + id + '/editor';
                                         
                                     }
                                     else {
                                         src = install+'&clean#manage/web/' + id + '/view?rand=1';
                                         if (metadata.canedit) 
                                             selecthtml = '<option value="'+install+'&clean#manage/web/' + id + '/editor">Editor</option>';
                                     }
                                 }
                                 else
                                 {
                                     selecthtml = '<option value="'+install+'&clean#manage/web/' + id + '/view?rand=1">View</option>'; 
                                     src = install+'&clean#manage/web/' + id + '/view?rand=1';
                                 }
                                 
                                 if (metadata.cansend) {
                                     if (metadata.linkids != null) {
                                         selecthtml = '<option value="'+install+'&clean#communicate/email/0?assetid=' + id + '&isAssetEmail=true&linkids=' + metadata.linkids + '&isSmartlist=' + metadata.isSmartlist +'">Send</option>'; 
                                         
                                         if (metadata.canPartnerSend)
                                             selecthtml = '<option value="'+install+'&clean#communicate/email/0?assetid=' + id + '&isAssetEmail=true&linkids=' + metadata.linkids + '&isSmartlist=' + metadata.isSmartlist +'&ispartner=' + true+'">Send To Users</option>'; 
                                         
                                     }
                                     else {
                                         selecthtml = '<option value="'+install+'&clean#communicate/email/0?assetid=' + id + '&isAssetEmail=true">Send</option>'; 
                                         if (metadata.canPartnerSend)
                                             selecthtml = '<option value="'+install+'&clean#communicate/email/0?assetid=' + id + '&isAssetEmail=true&ispartner=' + true+'">Send To Users</option>'; 
                                         
                                     }
                                 }
                                 if (metadata.canpublish)
                                     selecthtml = '<option value="'+install+'&clean#setup/publish/media/true/' + id+'">Publish</option>'; 
                                 
                                 
                                 if (metadata.output)
                                     selecthtml = '<option value="'+install+'&clean#manage/web/' + id + '/info/'+now+'">Info</option>'; 
                                 
                                 
                                 if (metadata.output && metadata.hasquestionnaire)
                                     selecthtml = '<option value="'+install+'&clean#manage/web/' + id + '/questions">Input</option>'; 
                                 
                                 selecthtml = '<option value="'+install+'&clean#manage/campaigns/website/' + id + '/report">Report</option>'; 
                                 selecthtml = '<option value="'+install+'&clean#manage/campaigns/website/' + id + '/interestbypage">Pages</option>'; 
                                 selecthtml = '<option value="'+install+'&clean#manage/campaigns/website/' + id + '/interestbycontacts">Contacts</option>'; 
                                 
                             }
                             helper.openModal(component,src,title,selecthtml);
                         }
                     }
                    }
                        else if(templatetype == "EMAIL"){
                            var name = $(this).find('.name').html();
                            if(templatetype == "EMAIL")
                                title = "Send " + name;
                            var src = $(this).find('.iframesrc').text();
                            helper.openModal(component,src,title,'');
                        }
                            else if(templatetype == ''||templatetype == undefined ||templatetype == "undefined"){
                                var src =$(this).find('.iframesrc').text();
                                //var regeximage="([^\\s]+(\\.(?i)(jpe?g|png|gif|bmp))$)";
                               // regeximage.test(src);
                                //var re = /(?:\.([^.]+))?$/;
								//var ext = re.exec(src)[1];
                                //ext = ext.replace(/\?.*$/g,"");
                                if(src.indexOf("img") > -1 || src.indexOf("pdf")> -1 ||src.indexOf("txt")> -1)
                                    helper.openModal(component,src,title,'');
                                    else
                                window.location=src;
                            }
                            
                    /*else if(templatetype == "FAQ"){
                        	templatedata["reports"] = true;
                            templatedata["cansend"] = userdata.canSend;
                            templatedata["canpublish"] = userdata.canPublishAssets ;
                            templatedata["canedit"] = userdata.canEditAssets;
                            templatedata["linkids"] = linkid;
                            templatedata["isSmartlist"] = null;
                        	templatedata["customize"] = false;
                        	templatedata["canPartnerSend"] = userdata.canPartnerSend;
                            var _templatedata = window.btoa((JSON.stringify(templatedata))); 
                            var src = install+"&clean#assets?function=viewFAQ&templatedata=" + _templatedata;
                            helper.openModal(component,src,title,'');
                    }*/
                        else if(templatetype == "WEBBANNER"){
                            var templatedata ={};
                            templatedata['id']=parseInt(id);
                            templatedata['usedatasource']=metadata.usedatasource;
                            if (!metadata.output) {
                                if (userdata.canCreateWeb){ 
                                    var _templatedata = window.btoa((JSON.stringify(templatedata)));
                                    var src = install+"&clean#assets?closesfmodal=true&function=onCustomizeSuccessWebBanner&templatedata=" + _templatedata+"&tpapp=sfdc";
                                } 
                            }
                            else{
                                if (userdata.canEditWeb){ 
                                    if (metadata.status == 2) {
                                        templatedata["info"] = "Info";
                                        templatedata["question"] = "Questions";
                                        templatedata["webeditor"] = "Web Banner Editor";
                                        templatedata["assetpicker"] = "Asset Picker";
                                        templatedata["customizewebsite"] = "Customize Web Banner Media";
                                        var _templatedata = window.btoa((JSON.stringify(templatedata)));
                                        var src = install+"&clean#assets?closesfmodal=true&function=showEditWebBannerWizard&templatedata=" + _templatedata+"&tpapp=sfdc";
                                    }else{
                                        templatedata["cansend"] = userdata.canWebSend;
                                        templatedata["canpublish"] = userdata.canWebPublish;
                                        templatedata["canedit"] = userdata.canEditWeb;
                                        templatedata["customize"] = true;
                                        templatedata["contactids"] = linkid;
                                        templatedata["isNeedApproval"] = templatedata.enablewatermark;
                                        templatedata["isApproved"] = templatedata.isapproved;
                                        templatedata["canPartnerSend"] = userdata.canPartnerSend;
                                        if (metadata.output) {
                                            var _templatedata = window.btoa((JSON.stringify(templatedata)));
                                            var src = install+"&clean#assets?closesfmodal=true&function=showWebBannerMedia&templatedata=" + _templatedata+"&tpapp=sfdc";
                                            
                                        }
                                        else {
                                            $(helper.msgbox).find(".pText").html("You do not have permission to customize this template");
                                                $(helper.msgbox).find(".MsgTitle").html("NO PERMISSION");
                                                $(helper.msgbox).show();
                                                return;
                                        }
                                    }
                                }
                            }
                            helper.openModal(component,src,title,'');
                        }
                            else if(templatetype == "PRINT"){
                                var templatedata={};
                                var enablewatermark = $(rec).find('.enablewatermark').html() == "true" ?true:false;
                                var status =$(rec).find('.status').html();
                                templatedata["cansend"] = userdata.canSendAssets;
                                templatedata["canedit"] = userdata.canEditAssets;
                                templatedata["isSmartlist"] = null;
                                templatedata["canorderprint"] = userdata.canOrderPrint;
                                templatedata["canpublish"] = userdata.canPublish;
                                templatedata["customize"] = false;
                                templatedata["linkids"] = null;
                                templatedata["isSmartlist"] = null;
                                templatedata["isMedia"] = output;
                                templatedata["isNeedApproval"] = enablewatermark;
                                templatedata["isApproved"] =  status == 163 ? true : false;
                                templatedata["status"] = status;
                                templatedata["canPartnerSend"] = userdata.canPartnerSend;
                				templatedata["hasEbookAccess"] = userdata.hasEbookAccess;
                                templatedata['id']=id;
                                if (metadata.output) {
                                    if (metadata.status != 2)
                                        var src = install+"&clean#assets?closesfmodal=true&function=showPrint&templatedata=" + _templatedata+"&tpapp=sfdc"; 
                                    else{
                                        var src = install+"&clean#assets?closesfmodal=true&function=showEditPrintWizard&templatedata=" + _templatedata+"&tpapp=sfdc"; 
                                    }
                                }
                                else if (!metadata.output && !metadata.usedatasource && !metadata.hasquestionnaire)
                                { 
                                    var _templatedata = window.btoa((JSON.stringify(templatedata)));
                                    var src = install+"&clean#assets?closesfmodal=true&function=showPrint&templatedata=" + _templatedata+"&tpapp=sfdc";            
                                }
                                    else
                                        var src = install+"&clean#assets?closesfmodal=true&function=showEditPrintWizard&templatedata=" + _templatedata+"&tpapp=sfdc";
                       				helper.openModal(component,src,'Print view','');
                            }
              /*  else if(templatetype == "EMAIL"){
                     var templatedata={};
                     if(userdata.canEmailSend){
                         if(metadata.output){
                             templatedata["report"] = "Report"; 
                             templatedata["sent"] = "SENT";
                             templatedata["id"] = metadata.id;
                             templatedata["name"] = metadata.name;
                             var _templatedata = window.btoa((JSON.stringify(templatedata)));
                             var src = install+"&clean#assets?function=showEmailReport&templatedata=" + _templatedata;
                             helper.openModal(component,src,title,'');
                         }
                         else{
                             templatedata["canEmailSend"] = userdata.canEmailSend;
                             templatedata["id"] = metadata.id; 
                             templatedata["name"] = metadata.name;
                             templatedata["templatetype"]=metadata.templatetype;
                             var _templatedata = window.btoa((JSON.stringify(templatedata)));
                             var src = install+"&clean#assets?function=sendEmailView&templatedata=" + _templatedata;
                             helper.openModal(component,src,title,'');
                         }
                     }
                 }*/
             else{
                 var currenturl = window.location.href;
                 var regex = /^(.*[\\\/])/g;
                 currenturl = regex.exec(currenturl)[0];
                 var url = $(this).find('.iframesrc').text();
                 if(url != '')
                 	helper.showEnablement(helper,component,url);
             }
                 //url = encodeURI(url);
                 //var src = currenturl+"Enablement?src="+url;
                 
            });
            $(helper.viewassetscontainer).find('.send').unbind("click").click(function(e){
                
                e.stopImmediatePropagation();
                var install = component.get("v.install") + '//?elt=' + helper.sessionID;
                var rec = $(this).closest('.asset-col');
                var id = $(rec).attr('id')
                var linkid = $(rec).find('.linkid').html();
                var linktype = $(rec).find('.linktype').html();
                var iframesrc = $(rec).find('.iframesrc').html();
                var templatetype = $(rec).find('.templatetype').html();
                var usedatasource = $(rec).find('.usedatasource').html() == "true" ?true:false;
                var hasquestionnaire = $(rec).find('.hasquestionnaire').html() == "true" ?true:false;
                var metadata = JSON.parse($(rec).find('.metadata').html());
                var output = $(rec).find('.output').html() == "true" ?true:false;
                var src = '';
                var title = 'Send';
                if(templatetype == undefined || templatetype == "undefined"|| templatetype == "")
                {
                    src = install + "&clean#communicate/email/0?templates=null&files="+linkid+"&isMultipleAssetEmail=true";
                }
                else if(templatetype == "PRINT")
                {
                    if(userdata.canSend)
                    {
                        if(output)
                        {
                            src = install + "&clean#communicate/email/0?assetid=" + id + "&isAssetEmail=true";
                        }
                        else if(!output && !usedatasource && !hasquestionnaire)
                        {
                            title="Send Print";
                            src= install+"&clean#communicate/email/0?templates="+id+"&files=null&isMultipleAssetEmail=true&customsendmodal=true&hideimportcustomize=true";
                        }
                    }
                }
                    else if(templatetype == "CONTRACT"){
                        var templatedata={};
                        title="Send Contract";
                        if(metadata.output){
                        templatedata['id']=metadata.id;
                        templatedata['playbookid']=metadata.playbookid;
                        templatedata['ispartner']=0;
                          var _templatedata = window.btoa(JSON.stringify(templatedata));
                         var src = install+"&clean#assets?closesfmodal=true&function=sendContract&templatedata=" + _templatedata;
                        }
                        else if(!metadata.output && metadata.usedatasource != 1 && !metadata.hasquestionnaire ){
                            if(userdata.canSendAssets){
                                 templatedata['id']=metadata.id;
                                templatedata["ispartner"] =1 ;
                                templatedata["name"]=metadata.name;
                                 var _templatedata = window.btoa(JSON.stringify(templatedata));
                                 var src = install+"&clean#assets?closesfmodal=true&function=sendContractMedia&templatedata=" + _templatedata;
                            }
                        }
                    }
                    else if(templatetype == "EMAIL")
                    {
                        if(userdata.canEmailSend){
                        src = install+'&clean#v4u/ajax/widgets/sf-handler.cshtml?type=EMAIL&sftask=CreateTemporaryMedia&id='+id+'&name='+name+'&usedatasource='+usedatasource ;
                        helper.showsendbutton = false;
                        helper.openModal(component,src,title,'');
                        return;
                        }
                        //helper.showEnablement(helper,component,src);
                        //helper.showsendbutton = true;
                        
                        //var name = $(rec).find('.name').html();
                        //var action = component.get("c.getCreateTemporaryMedia");
                        //action.setParams({"templateid": id,"templatename":name,"userid":component.get("v.userid")});
                        //action.setCallback(this, function(response) {
                        //    var state = response.getState();
                        //    if (state === "SUCCESS")
                        //    {
                        //        var data = JSON.parse(response.getReturnValue());
                        //        var view = data.result.template;
                        //        src = install+'/#communicate/email/0?emailtemplateid=' + view.id +"&clean";
                        //        var title = "Send "+view.name;
                        //        helper.openModal(component,src,title,'');
                        //    }
                        //});
                        //action.setBackground();
                        //$A.enqueueAction(action);
                        
                        //return;
                    }
                        else if(templatetype == "WEB")
                        {
                            src = install+"&clean#communicate/email/0?assetid=" + id + "&isAssetEmail=true";
                        }
                            else if(templatetype == "EBOOK")
                            {
                                if (metadata.linkids != metadata && edata.linkids != "") {
                                    src = install+"&clean#communicate/email/0?assetid=" + id + "&isAssetEmail=true&linkids=" + metadata.linkids + "&isSmartlist=" + metadata.isSmartlist + "&isContactcompany=" + metadata.isContactcompany;
                                }
                                else {
                                    src = install+"&clean#communicate/email/0?assetid=" + id + "&isAssetEmail=true";
                                }
                                title= "Send Ebook";
                            }
                                else if(templatetype == "POWERPOINT")
                                {
                                    if (metadata.output == 1 || (metadata.usedatasource != 1 && metadata.hasquestionnaire == false)) {
                                        src = install+"&clean#communicate/email/0?assetid=" + id + "&isAssetEmail=true";
                                        title = "Send Presentation";
                                    }
                                }
                                    else if(templatetype == "DATAROOM")
                                    {
                                        if(userdata.canSend)
                                        {
                                            if (output)
                                            {
                                                src = install+"&clean#sendassets/extdataroom?linkids=" + id + "&isSmartlist=null&isContactcompany=null";
                                            }
                                            else {
                                                $(helper.msgbox).find(".pText").html("You do not have permission to send this template");
                                                $(helper.msgbox).find(".MsgTitle").html("NO PERMISSION");
                                                $(helper.msgbox).show();
                                                return;
                                            }
                                        }
                                    }
                                       /* else if(templatetype == "FAQ"){
                                            var templatedata={};
                                            title="Send FAQ";
                                            templatedata["linkids"]=linkid;
                                            templatedata["isUserGrid"] = false;
                                            templatedata["isPartner"] = false;
                                            templatedata["iscontactcompany"]="";
                                            templatedata["templatetype"]=metadata.templatetype;
                                            var _templatedata = window.btoa(JSON.stringify(templatedata));
                         					var src = install+"&clean#assets?function=sendFAQEmail&templatedata=" + _templatedata;
                                        }*/
                                        else if (templatetype == "WEBBANNER"){
                                            var templatedata={};
                                            templatedata["linkids"]=linkid;
                                            if (metadata.output) {
                                                var _templatedata = window.btoa(JSON.stringify(templatedata));
                                                var src = install+"&clean#assets?closesfmodal=true&function=sendWebBanner&templatedata="+ _templatedata+"&tpapp=sfdc";
                                            }
                                            else {
                                                $(helper.msgbox).find(".pText").html("You do not have permission to send this template");
                                                $(helper.msgbox).find(".MsgTitle").html("NO PERMISSION");
                                                $(helper.msgbox).show();
                                                return;
                            						} 
                                        }
                   if(templatetype == "CONTRACT")
                       helper.showsendbutton=false;
                     else
                helper.showsendbutton = true;
                helper.openModal(component,src,title,'');
                return;
            });
            $(helper.viewassetscontainer).find('.sendtopartner').unbind("click").click(function(e){
                
                e.stopImmediatePropagation();
                
                var install = component.get("v.install") + '//?elt=' + helper.sessionID;
                var rec = $(this).closest('.asset-col');
                var id = $(rec).attr('id')
                var linkid = $(rec).find('.linkid').html();
                var linktype = $(rec).find('.linktype').html();
                var iframesrc = $(rec).find('.iframesrc').html();
                var templatetype = $(rec).find('.templatetype').html();
                var output = $(rec).find('.output').html();
                var usedatasource = $(rec).find('.usedatasource').html();
                var hasquestionnaire = $(rec).find('.hasquestionnaire').html();
                var metadata = JSON.parse($(rec).find('.metadata').html());
                var src = '';
                var title = 'Send To Partner';
                if(templatetype == undefined || templatetype == "undefined"|| templatetype == "")
                {
                    src = install + "&clean#communicate/email/0?templates=null&files="+linkid+"&isMultipleAssetEmail=true&ispartner=true";
                }
                else if(templatetype == "EMAIL")
                {
                    src = install+'&clean#v4u/ajax/widgets/sf-handler.cshtml?type=PARTNEREMAIL&sftask=CreateTemporaryMedia&id='+id+'&name='+name+'&usedatasource='+usedatasource ;
                    title='';
                    helper.showsendbutton = false;
                    helper.openModal(component,src,title,'');
                    return;
                    
                }
                else if(templatetype == "CONTRACT"){
                    var templatedata={};
                    title='Send Contract';
                        if(metadata.output){
                        templatedata['id']=metadata.id;
                        templatedata['playbookid']=metadata.playbookid;
                        templatedata['ispartner']=3;
                          var _templatedata = window.btoa(JSON.stringify(templatedata));
                         var src = install+"&clean#assets?closesfmodal=true&function=sendContract&templatedata=" + _templatedata;
                        }
                        else if(!metadata.output && metadata.usedatasource != 1 && !metadata.hasquestionnaire ){
                            if(userdata.canSendAssets){
                                templatedata['id']=metadata.id;
                                templatedata["ispartner"] =3 ;
                                templatedata["name"]=metadata.name;
                                 var _templatedata = window.btoa(JSON.stringify(templatedata));
                                 var src = install+"&clean#assets?closesfmodal=true&function=sendContractMedia&templatedata=" + _templatedata;
                            }
                        }     
                }
                else if(templatetype == "PRINT" || templatetype == "POWERPOINT" || templatetype == "DATAROOM")
                {
                    if(userdata.canSend)
                    {
                        if (output || (!usedatasource && hasquestionnaire == false)) 
                        {
                            if (linkid != null && linkid != "")
                                src = install + "&clean#communicate/email/0?assetid="+id+"&isAssetEmail=true&isSmartlist=" + metadata.isSmartlist + "&ispartner=true";
                            else
                                src = install + "&clean#communicate/email/0?assetid=" + id + "&isAssetEmail=true&ispartner=true";
                            title = "Send Presentation";
                            if(templatetype == "DATAROOM")
                                title = "Send Dataroom";
                            if(templatetype == "PRINT")
                                title = "Send Print";
                        }
                    }
                }
                    else if (templatetype == "WEBBANNER"){
                        var templatedata={};
                        templatedata["linkids"]=linkid;
                        templatedata["issmartlist"]=null;
                        templatedata["id"]=id;
                        if (metadata.output){
                            var _templatedata = window.btoa(JSON.stringify(templatedata));
                            var src = install+"&clean#assets?closesfmodal=true&function=sendWebBannerToPartner&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                        }       
                        else {
                            $(helper.msgbox).find(".pText").html("You do not have permission to send this template");
                            $(helper.msgbox).find(".MsgTitle").html("NO PERMISSION");
                            $(helper.msgbox).show();
                            return;
                        }
                    }
               if(templatetype == 'CONTRACT')
                   helper.showsendbutton = false;
                   else
                helper.showsendbutton = true;
                helper.openModal(component,src,title,'');
                return;
            });
            $(helper.viewassetscontainer).find('.publish').unbind("click").click(function(e){
                e.stopImmediatePropagation();
                var install = component.get("v.install") + '//?elt=' + helper.sessionID;
                var rec = $(this).closest('.asset-col');
                var id = $(rec).attr('id');
                var linkid = $(rec).find('.linkid').html();
                var templatetype = $(rec).find('.templatetype').html();
                var usedatasource = $(rec).find('.usedatasource').html() == "true" ?true:false;
                var hasquestionnaire = $(rec).find('.hasquestionnaire').html() == "true" ?true:false;                                                                             
                var output = $(rec).find('.output').html() == "true" ?true:false;
                var src = '';
                var ShowPublish = false;
                if (output)
                    ShowPublish = true;
                else if (!output && usedatasource != 1 && !hasquestionnaire)
                    ShowPublish = true;
                if (ShowPublish) {
                    if (templatetype === undefined || templatetype == "undefined" || templatetype == "") 
                        src = install + '&clean#setup/publish/media/false/' + linkid;
                    else
                        src = install + '&clean#setup/publish/media/true/' + id ;
                    helper.showsendbutton = true;
                    helper.openModal(component,src,"Publish",'');
                }
            });
            $(helper.viewassetscontainer).find('.customize').unbind("click").click(function(e)
			{
             e.stopImmediatePropagation();
             var install = component.get("v.install") + '//?elt=' + helper.sessionID;
             var rec = $(this).closest('.asset-col');
             var id = $(rec).attr('id');
             var linkid = $(rec).find('.linkid').html();
             var linktype = $(rec).find('.linktype').html();
             var flag6 = $(rec).find('.flag6').html() == "true" ?true:false;
             var iframesrc = $(rec).find('.iframesrc').html();
             var templatetype = $(rec).find('.templatetype').html();
             var output = $(rec).find('.output').html() == "true" ?true:false;
             var name = $(rec).find('.name').html();
             var metadata = JSON.parse($(rec).find('.metadata').html());
             var src = '';
             var title = '';
             var selecthtml = '';
             var now = $.now();
             switch(templatetype) {
                 case "WEB":
                     if(!output)
                     {
                         if(userdata.canWebCreate)
                         {
                             name = 'New Media';
                             var usedatasource = metadata.usedatasource;
                             var _type = "WEB";
                             if(flag6 == true)
                                 _type = "WEB";
                             else
                                 _type = "LANDINGPAGE";
                             src = install+'&clean#v4u/ajax/widgets/sf-handler.cshtml?type='+_type+'&sftask=CreateTemporaryMedia&id='+id+'&name='+name+'&usedatasource='+usedatasource ;
                             //helper.showEnablement(helper,component,src);
                             helper.openModal(component,src,title,'');
                             //helper.callcustomizeapi(component,event,helper,id,name);
                         }
                         else if(userdata.canEdit)
                         {
                             title = 'Website';
                             if (!metadata.isNeedApproval) {
                                 if (!metadata.isApproved) {
                                     if (metadata.customize) {
                                         if (metadata.canedit)
                                             selecthtml = '<option value="'+install+'&clean#manage/web/' + id + '/editor">Editor</option>';
                                         src = install+'&clean#manage/web/' + id + '/editor';
                                         
                                     }
                                     else {
                                         src = install+'&clean#manage/web/' + id + '/view?rand=1';
                                         if (metadata.canedit) 
                                             selecthtml = '<option value="'+install+'&clean#manage/web/' + id + '/editor">Editor</option>';
                                     }
                                 }
                                 else
                                 {
                                     selecthtml = '<option value="'+install+'&clean#manage/web/' + id + '/view?rand=1">View</option>'; 
                                     src = install+'&clean#manage/web/' + id + '/view?rand=1';
                                 }
                                 
                                 if (metadata.cansend) {
                                     if (metadata.linkids != null) {
                                         selecthtml = '<option value="'+install+'&clean#communicate/email/0?assetid=' + id + '&isAssetEmail=true&linkids=' + metadata.linkids + '&isSmartlist=' + metadata.isSmartlist +'">Send</option>'; 
                                         
                                         if (metadata.canPartnerSend)
                                             selecthtml = '<option value="'+install+'&clean#communicate/email/0?assetid=' + id + '&isAssetEmail=true&linkids=' + metadata.linkids + '&isSmartlist=' + metadata.isSmartlist +'&ispartner=' + true+'">Send To Users</option>'; 
                                         
                                     }
                                     else {
                                         selecthtml = '<option value="'+install+'&clean#communicate/email/0?assetid=' + id + '&isAssetEmail=true">Send</option>'; 
                                         if (metadata.canPartnerSend)
                                             selecthtml = '<option value="'+install+'&clean#communicate/email/0?assetid=' + id + '&isAssetEmail=true&ispartner=' + true+'">Send To Users</option>'; 
                                         
                                     }
                                 }
                                 if (metadata.canpublish)
                                     selecthtml = '<option value="'+install+'&clean#setup/publish/media/true/' + id+'">Publish</option>'; 
                                 
                                 
                                 if (metadata.output)
                                     selecthtml = '<option value="'+install+'&clean#manage/web/' + id + '/info/'+now+'">Info</option>'; 
                                 
                                 
                                 if (metadata.output && metadata.hasquestionnaire)
                                     selecthtml = '<option value="'+install+'&clean#manage/web/' + id + '/questions">Input</option>'; 
                                 
                                 selecthtml = '<option value="'+install+'&clean#manage/campaigns/website/' + id + '/report">Report</option>'; 
                                 selecthtml = '<option value="'+install+'&clean#manage/campaigns/website/' + id + '/interestbypage">Pages</option>'; 
                                 selecthtml = '<option value="'+install+'&clean#manage/campaigns/website/' + id + '/interestbycontacts">Contacts</option>'; 
                                 
                             }
                             helper.openModal(component,src,title,selecthtml);
                         }
                     }
                     break;
                 case "PRINT":
                     if(!output)
                     {
                         if(userdata.canCreate)
                         {
                             name = 'New%2fMedia';
                             var usedatasource = metadata.usedatasource;
                             //src = install+'&clean#v4u/ajax/widgets/sf-handler.cshtml?type=PRINT&sftask=CreateTemporaryMedia&id='+id+'&name='+name+'&usedatasource='+usedatasource ;
                             src=  install+'&clean#v4u/ajax/widgets/sf-handler.cshtml?sftask=CreateTemporaryMedia&id='+id+'&handler=print&name='+name+'&usedatasource='+usedatasource ;
                            // helper.showEnablement(helper,component,src);
                             helper.openModal(component,src,'','');
                             //helper.callcustomizeapi(component,event,helper,id,name);
                         }
                     }
                     else
                     {
                         title = 'Print';
                         if(userdata.canEdit)
                         {
                             if (!metadata.isNeedApproval) {
                                 if (!metadata.isApproved) {
                                     if (metadata.customize) {
                                         if (metadata.isMedia) {
                                             if (metadata.canedit) 
                                                 selecthtml = '<option value="'+install+'&clean#collateral/pdf/' + id + '/editor">Customize</option>'; 
                                             src = install+'&clean#collateral/pdf/' + id + '/editor';
                                         }
                                         selecthtml = '<option value="'+install+'&clean#collateral/pdf/' + id + '/editor">View</option>'; 
                                         src = install+'&clean#collateral/pdf/' + id + '/editor';
                                     }
                                     else {
                                         selecthtml = '<option value="'+install+'&clean#collateral/pdf/' + id + '/view">View</option>'; 
                                         src = install+'&clean#collateral/pdf/' + id + '/view';
                                         if (metadata.isMedia) {
                                             if (metadata.canedit) 
                                                 selecthtml = '<option value="'+install+'&clean#collateral/pdf/' + id + '/editor">Customize</option>'; 
                                             
                                         }
                                     }
                                 }
                                 else
                                 {
                                     selecthtml = '<option value="'+install+'&clean#collateral/pdf/' + id + '/view">View</option>'; 
                                     src = install+'&clean#collateral/pdf/' + id + '/view';
                                 }
                                 
                                 
                                 
                                 if (metadata.output)///if it is media then only add info page
                                     selecthtml = '<option value="'+install+'&clean#collateral/pdf/' + id + '/info">Info</option>'; 
                                 
                                 if (metadata.cansend) {
                                     if (metadata.status == 1) {
                                         if (metadata.linkids != null) {
                                             selecthtml = '<option value="'+install+'&clean#communicate/email/0?assetid=' + id + '&isAssetEmail=true&linkids=' + metadata.linkids + '&isSmartlist=' + metadata.isSmartlist+'">Send</option>'; 
                                             
                                             if (metadata.canPartnerSend)
                                                 selecthtml = '<option value="'+install+'&clean#communicate/email/0?assetid=' + id + '&isAssetEmail=true&linkids=' + metadata.linkids + '&isSmartlist=' + metadata.isSmartlist+'&ispartner=' + true +'">Send To Users</option>'; 
                                             
                                         }
                                         else {
                                             selecthtml = '<option value="'+install+'&clean#communicate/email/0?assetid=' + id + '&isAssetEmail=true">Send</option>'; 
                                             
                                             if (metadata.canPartnerSend)
                                                 selecthtml = '<option value="'+install+'&clean#communicate/email/0?assetid=' + id + '&isAssetEmail=true&ispartner=' + true+'">Send</option>'; 
                                             
                                         }
                                     }
                                     else {
                                         if (metadata.linkids != null)
                                             selecthtml = '<option value="'+install+'&clean#communicate/email/0?assetid=' + id + '&isAssetEmail=true&linkids=' + metadata.linkids + '&isSmartlist=' + metadata.isSmartlist + '&ispartner=' + true+'">Send</option>'; 
                                         
                                         else
                                             selecthtml = '<option value="'+install+'&clean#communicate/email/0?assetid=' + id + '&isAssetEmail=true&ispartner=' + true+'">Send To Users</option>'; 
                                         
                                     }
                                 }
                                 if (metadata.canpublish) 
                                     selecthtml = '<option value="'+install+'&clean#setup/publish/media/true/' + id+'">Social</option>'; 
                                 
                                 if (metadata.canorderprint)
                                     selecthtml = '<option value="'+install+'&clean#collateral/pdf/' + id + '/order">Vendor</option>'; 
                                 
                                 //views.push({ icon: "view", name: "Download", url: "/collateral/pdf/" + id + "/download" });
                                 
                                 if (metadata.hasquestionnaire)
                                     selecthtml = '<option value="'+install+'&clean#collateral/pdf/' + id + '/questions">Input</option>'; 
                                 
                             }
                         }
                         helper.openModal(component,src,title,selecthtml);
                     }
                     break;
                 case "EBOOK":
                     break;
                 case "CONTRACT" :
                     var templatedata={};
                     title="Customize Contract";                     
                       if (!metadata.output) {
                           if(userdata.canSendAssets && userdata.canCreateAssets){
                               templatedata['usedatasource']=metadata.usedatasource;
                               templatedata['id']=metadata.id;
                               templatedata['name']=metadata.name;
                               var _templatedata = window.btoa((JSON.stringify(templatedata)));
                               var src = install+"&clean#assets?closesfmodal=true&function=onCustomizeSuccessContract&templatedata=" + _templatedata;
                           }
                       }
                     else {
                    if(userdata.canEditAssets){
                        if(metdata.status == 2){
                            templatedata["ispartner"] = 1;
                            var _templatedata = window.btoa((JSON.stringify(templatedata)));
                            var src = install+"&clean#assets?closesfmodal=true&function=showEditContractWizard&templatedata=" + _templatedata;
                        }
                        else{
                       
                            templatedata["cansend"] = userdata.canSendAssets;
                            templatedata["canorderprint"] = userdata.canorderprint;
                            templatedata["canpublish"] = userdata.canPublishAssets ;
                            templatedata["canedit"] = userdata.canEditAssets;
                            templatedata["linkids"] = linkid;
                            templatedata["isSmartlist"] = null;
                            templatedata["isMedia"] = metadata.output;
                            var _templatedata = window.btoa((JSON.stringify(templatedata))); 
                            var src = install+"&clean#assets?closesfmodal=true&function=showPrint&templatedata=" + _templatedata;
                        }
                    }
                    }
                     helper.openModal(component,src,title,'');  
                     break;
                 case "WEBBANNER" :
                      var templatedata={};
                     templatedata['usedatasource']=metadata.usedatasource;
                     templatedata['id']=parseInt(id);
                     title="Customize Webbanner"; 
                     if (!metadata.output) {
                                if (userdata.canCreateWeb){ 
                                    var _templatedata = window.btoa((JSON.stringify(templatedata)));
                                    var src = install+"&clean#assets?closesfmodal=true&function=onCustomizeSuccessWebBanner&templatedata=" + _templatedata+"&tpapp=sfdc";
                                } 
                            }
                            else{
                                if (userdata.canEditWeb){ 
                                    if (metadata.status == 2) {
                                        templatedata["info"] = "Info";
                                        templatedata["question"] = "Questions";
                                        templatedata["webeditor"] = "Web Banner Editor";
                                        templatedata["assetpicker"] = "Asset Picker";
                                        templatedata["customizewebsite"] = "Customize Web Banner Media";
                                        var _templatedata = window.btoa((JSON.stringify(templatedata)));
                                        var src = install+"&clean#assets?closesfmodal=true&function=showEditWebBannerWizard&templatedata=" + _templatedata+"&tpapp=sfdc";
                                    }else{
                                        templatedata["cansend"] = userdata.canWebSend;
                                        templatedata["canpublish"] = userdata.canWebPublish;
                                        templatedata["canedit"] = userdata.canEditWeb;
                                        templatedata["customize"] = true;
                                        templatedata["contactids"] = linkid;
                                        templatedata["isNeedApproval"] = templatedata.enablewatermark;
                                        templatedata["isApproved"] = templatedata.isapproved;
                                        templatedata["canPartnerSend"] = userdata.canPartnerSend;
                                        if (metadata.output) {
                                            var _templatedata = window.btoa((JSON.stringify(templatedata)));
                                            var src = install+"&clean#assets?closesfmodal=true&function=showWebBannerMedia&templatedata=" + _templatedata+"&tpapp=sfdc";
                                            
                                        }
                                        else {
                                            $(helper.msgbox).find(".pText").html("You do not have permission to customize this template");
                                            $(helper.msgbox).find(".MsgTitle").html("NO PERMISSION");
                                            $(helper.msgbox).show();
                                            return;
                                        }
                                    }
                                }
                            }
                            helper.openModal(component,src,title,'');
                     break;
                 case "EMAIL":
                     if(userdata.canEmailSend)
                     {
                         src = install+'&clean#v4u/ajax/widgets/sf-handler.cshtml?type=EMAIL&sftask=CreateTemporaryMedia&id='+id+'&name='+name+'&usedatasource='+usedatasource;
                         title = "Send "+view.name;
                         helper.openModal(component,src,title,'');
                         helper.showsendbutton = true;
                         //var action = component.get("c.getCreateTemporaryMedia");
                         //action.setParams({templateid: id,templatename:name,userid:component.get("v.userid")});
                         //action.setCallback(this, function(response) {
                         //    var state = response.getState();
                         //    if (state === "SUCCESS")
                         //    {
                         //        var data = JSON.parse(response.getReturnValue());
                         //        var view = data.result.template;
                         //        src = install+'/#communicate/email/0?emailtemplateid=' + view.id;
                         //        title = "Send "+view.name;
                         //        helper.openModal(component,src,title,'');
                         //    }
                         //});
                         //action.setBackground();
                         //$A.enqueueAction(action);
                     }
                     break;
                 case "DATAROOM":
                     if(userdata.canPlayBookCreate)
                     {
                         name = 'New Media';
                         var usedatasource = metadata.usedatasource;
                         src = install+'&clean#v4u/ajax/widgets/sf-handler.cshtml?type=DATAROOM&sftask=CreateTemporaryMedia&id='+id+'&name='+name+'&usedatasource='+usedatasource ;
                         //helper.showEnablement(helper,component,src);
                         helper.openModal(component,src,title,'');
                         //helper.callcustomizeapi(component,event,helper,id,name);
                     }
                     break;
                 case "POWERPOINT":
                     if(!output)
                     {
                         if(userdata.canCreate)
                         {
                             name = 'PPT Media';
                             var usedatasource = metadata.usedatasource;
                             src = install + '&clean#v4u/ajax/widgets/sf-handler.cshtml?type=POWERPOINT&sftask=CreateTemporaryMedia&id=' + id + '&name=' + name + '&usedatasource=' + usedatasource ;
                             //helper.showEnablement(helper,component,src);
                             helper.openModal(component,src,title,'');
                             //helper.callcustomizeapi(component,event,helper,id,name);
                         }
                     }
                     else
                     {
                         if(userdata.canEdit)
                         {
                             title = 'Presentation';
                             if (metadata.hasquestionnaire && metadata.usedatasource == "1")
                             {
                                 src = install+'&clean#collateral/presentation/' + metadata.id + '/info';
                                 selecthtml = '<option value="'+install+'&clean#collateral/presentation/' + metadata.id + '/info">Info</option>';
                                 selecthtml = '<option value="'+install+'&clean#collateral/presentation/' + metadata.id + '/assetpicker">AssetPicker</option>';
                                 selecthtml = '<option value="'+install+'&clean#collateral/presentation/' + metadata.id + '/reordering">Manage Slides</option>';
                                 
                             }
                             else if (metadata.hasquestionnaire)
                             {
                                 src = install+'&clean#collateral/presentation/' + metadata.id + '/info';
                                 selecthtml = '<option value="'+install+'&clean#collateral/presentation/' + metadata.id + '/info">Info</option>';
                                 selecthtml = '<option value="'+install+'&clean#collateral/presentation/' + metadata.id + '/reordering">Manage Slides</option>';
                                 selecthtml = '<option value="'+install+'&clean#collateral/presentation/' + metadata.id + '/view">View</option>';
                             }
                                 else if (metadata.usedatasource == "1")
                                 {
                                     src = install+'&clean#collateral/presentation/' + metadata.id + '/info';
                                     selecthtml = '<option value="'+install+'&clean#collateral/presentation/' + metadata.id + '/info">Info</option>';
                                     selecthtml = '<option value="'+install+'&clean#collateral/presentation/' + metadata.id + '/assetpicker">AssetPicker</option>';
                                     selecthtml = '<option value="'+install+'&clean#collateral/presentation/' + metadata.id + '/reordering">Manage Slides</option>';
                                 }
                                     else
                                     {
                                         src = install+'&clean#collateral/presentation/' + metadata.id + '/info';
                                         selecthtml = '<option value="'+install+'&clean#collateral/presentation/' + metadata.id + '/info">Info</option>';
                                         selecthtml = '<option value="'+install+'&clean#collateral/presentation/' + metadata.id + '/reordering">Manage Slides</option>';
                                         selecthtml = '<option value="'+install+'&clean#collateral/presentation/' + metadata.id + '/view">View</option>';
                                     }
                             helper.openModal(component,src,title,selecthtml);      
                         }
                     }
                     break;    
                 case "SMS":
                     if(userdata.canSMSSend)
                     {
                         return;
                     }
                     break;
                 case "QUESTIONNAIRE":
                     if(userdata.canQuestCreate)
                     {
                         name = 'New Media';
                         var usedatasource = metadata.usedatasource;
                         src = install+'&clean#v4u/ajax/widgets/sf-handler.cshtml?type=QUESTIONNAIRE&sftask=CreateTemporaryMedia&id='+id+'&name='+name+'&usedatasource='+usedatasource ;
                         //helper.showEnablement(helper,component,src);
                         helper.openModal(component,src,title,'');
                         //helper.callcustomizeapi(component,event,helper,id,name);
                     }
                     break;
                 case "POLL":
                     if(userdata.canPollCreate)
                     {
                         name = 'New Media';
                         var usedatasource = metadata.usedatasource;
                         src = install+'&clean#v4u/ajax/widgets/sf-handler.cshtml?type=POLL&sftask=CreateTemporaryMedia&id='+id+'&name='+name+'&usedatasource='+usedatasource ;
                         //helper.showEnablement(helper,component,src);
                         helper.openModal(component,src,title,'');
                         //helper.callcustomizeapi(component,event,helper,id,name);
                     }
                     break;
                     
             }
            });
            $(helper.viewassetscontainer).find('.rating').unbind("click").click(function(e){
                e.stopImmediatePropagation();
                var install = component.get("v.install") + '//?elt=' + helper.sessionID;
                var rec = $(this).closest('.asset-col');
               var metadata = JSON.parse($(rec).find('.metadata').html());
                var linkid = $(rec).find('.linkid').html();
                var linktype=$(rec).find('.linktype').html();
                var title = "Feedback (Comments)";
                var selecthtml='';
                //selecthtml = '<option value="'+install+'&clean#feedback/' + linkid + '/2/rating">Ratings</option>';
                //selecthtml += '<option value="'+install+'&clean#feedback/' + linkid + '/2/comment">Comments</option>';
             
                var templatedata={};
               templatedata['id']=linkid; 
                templatedata['type']=2;
                //var src = install+'&clean#feedback/'+ linkid + '/2/rating';
                  var _templatedata = window.btoa(JSON.stringify(templatedata));
                 var src=install+"&clean#assets?closesfmodal=true&function=showFeedbackComments&templatedata=" + _templatedata+"&tpapp=sfdc"                                                                        
                helper.openModal(component,src,title,'');
            });
            $(helper.viewassetscontainer).find('.report').unbind("click").click(function(e){
                e.stopImmediatePropagation();
                var install = component.get("v.install") + '//?elt=' + helper.sessionID;
                var rec = $(this).closest('.asset-col');
                var id = $(rec).attr('id');
                var page = $(rec).find('.page').html();
                var metadata = JSON.parse($(rec).find('.metadata').html());
                var templatetype = $(rec).find('.templatetype').html();
                var selecthtml = '';
                var src = '';
                var title = "Activity";
                if(templatetype == "DATAROOM")
                {
                    title = "PlayBook - " + metadata.name;
                    src = install+'&clean#collateral/data-room/' + id + '/report';
                    selecthtml = '<option value="'+install+'&clean#collateral/data-room/' + id + '/report">Reports</option>';
                    selecthtml += '<option value="'+install+'&clean#collateral/data-room/' + id + '/interestbycontact">Contacts</option>';
                    selecthtml += '<option value="'+install+'&clean#collateral/data-room/' + id + '/documenttracking">Documents</option>';
                }
                else if(templatetype == "INTERNALPLAYBOOK")
                {
                    src = install+'&clean#internalplaybookrecordreport/'+id ;
                    title = metadata.name;
                }
                    else if(templatetype == "POWERPOINT")
                    {
                        src = install+'&clean#collateral/presentation/' + id + '/report';
                        var srcs = [];
                        var names= [];
                        srcs.push(install+'&clean#collateral/presentation/' + id + '/report');
                        names.push("Report");
                        if (page)
                        {
                            srcs.unshift(install+'&clean#collateral/presentation/' + id + '/interestbypage');
                            names.unshift("Interest By Page");
                        }
                        else
                        {
                            srcs.push(install+'&clean#collateral/presentation/' + id + '/interestbypage');
                            names.push("Interest By Page");
                        }
                        
                        if(metadata.contact)
                        {
                            srcs.unshift(install+'&clean#collateral/presentation/' + id + '/interestbycontact');
                            names.unshift("Interest By Contact");
                        } 
                        else
                        {
                            srcs.push(install+'&clean#collateral/presentation/' + id + '/interestbycontact');
                            names.push("Interest By Contact");
                        }
                        if(metadata.name != undefined)
                        {
                            title = "Presentation Report - " + metadata.name;
                        }
                        
                        for(var i=0; i< srcs.length; i++)
                        {
                            selecthtml = '<option value="'+srcs[i]+'">'+names[i]+'</option>';
                        }
                    }
                        else
                        {
                            var srcs = [];
                            var names= [];
                            if(metadata.view)
                            {
                                srcs.push(install+'&clean#manage/web/' + id + '/view?rand=1&amp;currentuser=' + metadata.currentuser );
                                names.push("View");
                            }
                            if(metadata.userid !== undefined)
                                srcs.push(install+'&clean#manage/campaigns/website/' + id + '/report?currentuser=' + metadata.currentuser + '&userid=' + metadata.userid );
                            else
                                srcs.push(install+'&clean#manage/campaigns/website/' + options.id + '/report?currentuser=' + options.currentuser );
                            names.push("Reports");
                            if(metadata.page)
                            {
                                srcs.unshift(install+'&clean#manage/campaigns/website/' + options.id + '/interestbypage?currentuser=' + options.currentuser );
                                names.unshift("Pages");
                            }
                            else
                            {
                                srcs.push(install+'&clean#manage/campaigns/website/' + options.id + '/interestbypage?currentuser=' + options.currentuser );
                                names.push("Pages");
                            }
                            if(metadata.contact)
                            {
                                srcs.unshift(install+'&clean#manage/campaigns/website/' + options.id + '/interestbycontact?currentuser=' + options.currentuser );
                                names.unshift("Contacts");
                            }
                            else
                            {
                                srcs.push(install+'&clean#manage/campaigns/website/' + options.id + '/interestbycontact?currentuser=' + options.currentuser );
                                names.push("Contacts");
                            }
                            if(metadata.name != undefined)
                            {
                                title = "Websites Report - " + metadata.name;
                            }
                            
                            for(var i = 0; i < srcs.length; i++)
                            {
                                selecthtml = '<option value="'+srcs[i]+'">'+names[i]+'</option>';
                            }
                        }
                
                helper.openModal(component,src,title,selecthtml);
                
            });
            $(helper.viewassetscontainer).find('.addtodataroom').unbind("click").click(function(e){
                e.stopImmediatePropagation();
                var install = component.get("v.install") + '//?elt=' + helper.sessionID;
                var rec = $(this).closest('.asset-col');
                var id = $(rec).attr('id');
                var linkid = $(rec).find('.linkid').html();
                var metadata = JSON.parse($(rec).find('.metadata').html());
                var templatetype = $(rec).find('.templatetype').html();
                var selecthtml = '';
                var src = '';
                var title = "Data Rooms";
                var modal = $(".demo-modal");
                var assettype = 1;
                if (templatetype == "undefined" || templatetype == undefined || templatetype == ""){
                    assettype = 2;//2 is for document/image/video
                src = install+"&clean#collateral/datarooms/" + linkid + "/" + assettype ;
                }else{
                    src = install+"&clean#collateral/datarooms/" + id + "/" + assettype ;
                }
                helper.openModal(component,src,title,selecthtml);
            });
            $(helper.viewassetscontainer).find('.download').unbind("click").click(function(e){
                e.stopImmediatePropagation();
                var rec = $(this).closest('.asset-col');
                var id = $(rec).attr('id');
                var metadata = JSON.parse($(rec).find('.metadata').html());
                var templatetype = $(rec).find('.templatetype').html();
                var selecthtml = '';
                var src = '';
                var url = '';
                var install = component.get("v.install") + '//?elt=' + helper.sessionID;
                if(templatetype == undefined||templatetype == ""|| templatetype == "undefined"){
                    if (metadata.output == 1) { //document
                        window.location = metadata.fileurl+ "?isdownload=1";
                    } else if (metadata.output == 0) {//image
                        window.location = metadata.downloadurl+ "?isdownload=1";
                    }
                }
                if(templatetype == "POWERPOINT")
                {
                    window.location = metadata.downloadurl;
                    //url = component.get("v.install")+'/pptfile/' + metadata.templatekey + '/' + metadata.userkey ;
                    //helper.showEnablement(helper,component,url);
                    //helper.openModal(component,src,'Download HTML','');
                }
                if(templatetype == "EMAIL")
                {
                    src = install+'&clean#communicate/email/download/' + id ;
                    helper.openModal(component,src,'Download HTML','');
                }
              if(templatetype == "PRINT")
                {
                    var act = component.get("c.downloadAPI");
                    act.setParams({
                        "tid":metadata.id,
                        "type":"high"
                    });
                    act.setCallback(this,function(response){
                        var state = response.getState();
                        if(state === "SUCCESS"){
                            var response = JSON.parse(response.getReturnValue()).result;
                            if(response.pdfdownload != null)
                            	window.location = response.pdfdownload;
                        }
                    });
                    $A.enqueueAction(act);
                    
                   /*var _templatedata = window.btoa(JSON.stringify(metadata.id));
                   var src = install+"&clean#assets?closesfmodal=true&function=downloadPDF&templatedata=" + _templatedata+"&tpapp=sfdc";
                  	
                    window.addEventListener('message',function(evt){
                        var install = component.get("v.install");
                        if(evt.origin == install)
                        {   
                            
                            if(evt.data.indexOf('?isdownload=1') > -1)
                            {
                                setTimeout(function(){
                                    window.loction =evt.data;   
                                },500);
                                
                            }
                            
                        }
                    },false);*/
                }
               
            });
            $(helper.viewassetscontainer).find('.ebook').unbind("click").click(function(e){
                e.stopImmediatePropagation();
                var rec = $(this).closest('.asset-col');
                var linkid = $(rec).find('.linkid').html();
                var install = component.get("v.install") + '//?elt=' + helper.sessionID;
                var src = install+'&clean#v4u/ajax/widgets/sf-handler.cshtml?sftask=ConvertToEbook&id='+linkid;
                //helper.showEnablement(helper,component,src);
                helper.openModal(component,src,'Ebook view','');
                
                return;
                helper.ebookapisuccess = false;
                var rec = $(this).closest('.asset-col');
                var linkid = $(rec).find('.linkid').html();
                var action = component.get("c.getConvertToEbook");
                action.setParams({"linkid": linkid,"userid":component.get("v.userid")});
                action.setCallback(this, function(response) {
                    helper.ebookapisuccess = true;
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        var data = JSON.parse(response.getReturnValue());
                        var url = data.result;
                        helper.showEnablement(helper,component,url);
                    }
                });
                $A.enqueueAction(action);
                if(!helper.ebookapisuccess)
                {
                    setTimeout(function(){helper.checkEbookAPI(helper)},10000);
                }
            });
            $(helper.viewassetscontainer).find('.printvendor').unbind("click").click(function(e){
                e.stopImmediatePropagation();
                var rec = $(this).closest('.asset-col');
                var metadata = JSON.parse($(rec).find('.metadata').html());
                var title = "Send To Print Vendor";
                var install = component.get("v.install") + '//?elt=' + helper.sessionID;
                var src = install+'&clean#collateral/pdf/' + metadata.linkid + '/order';
                helper.openModal(component,src,title,'');
            });
            
            
        }
                });
                $(this.divspinner).hide();
                $(this.viewassetscontainer).show();
            }
        }
        
    },
    checkEbookAPI:function(helper)
    {
        if(!helper.ebookapisuccess)
        {
            $('.faltugiri').click();
            setTimeout(function(){helper.checkEbookAPI(helper)},3000);
        }
    },
    showEditPrintWizard : function(component,helper,data)
    {
        var print = data.result.template;
        var allpagestemplateonlydb = data.result.allpagestemplateonlydb;
        var temptype = print.templatetype;
        var now = $.now();
        var title = '';
        var src = '';
        var selecthtml = '';
        var install = component.get("v.install") + '//?elt=' + helper.sessionID;
        if (print.hasquestionnaire == true && print.usedatasource == 1 && !allpagestemplateonlydb)
            var _wizdata = {
                name: print.customizeprint,
                steps: [info, questions, assetpicker, editor]
            };
        else if (print.hasquestionnaire == true && print.usedatasource == 0)
        {
            title = print.customizeprint;
            src = install+'&clean#collateral/pdf/' + print.id + '/info/' + now ;
            selecthtml = '<option value="'+install+'&clean#collateral/pdf/' + print.id + '/info/' + now +'">'+print.info+'</option>';
            selecthtml = '<option value="'+install+'&clean#collateral/pdf/' + print.id + '/questions">Question</option>';
            selecthtml = '<option value="'+install+'&clean#collateral/pdf/' + print.id + '/editor?ispersonalized=' + print.ispersonalized +'">Print</option>';
            helper.openModal(component,src,title,selecthtml);
        }
            else if(print.hasquestionnaire == false && print.usedatasource == 0)
            {
                title = print.customizeprint;
                src = install+'&clean#collateral/pdf/' + print.id + '/info/' + now ;
                selecthtml = '<option value="'+install+'&clean#collateral/pdf/' + print.id + '/info/' + now +'">'+print.info+'</option>';
                selecthtml = '<option value="'+install+'&clean#collateral/pdf/' + print.id + '/editor?ispersonalized=' + print.ispersonalized +'">Editor</option>';
                helper.openModal(component,src,title,selecthtml);
            }
                else
                {
                    title = print.customizeprint;
                    src = install+'&clean#collateral/pdf/' + print.id + '/info/' + now ;
                    selecthtml = '<option value="'+install+'&clean#collateral/pdf/' + print.id + '/info/' + now +'">'+print.info+'</option>';
                    selecthtml = '<option value="'+install+'&clean#collateral/pdf/' + print.id + '/editor?ispersonalized=' + print.ispersonalized +'">Editor</option>';
                    helper.openModal(component,src,title,selecthtml);
                }
    },
    //api to get data to show on modal wizard
    callcustomizeapi1: function(component,helper,id,name)
    {
        helper.ebookapisuccess = false;
        var action = component.get("c.getCreateTemporaryMedia");
        action.setParams({
            "templateid": id,
            "templatename":name,
            "userid":component.get("v.userid")
        });
        action.setCallback(this, function(response) {
            helper.ebookapisuccess = true;
            
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var data = JSON.parse(response.getReturnValue());
                helper.showEditPrintWizard(component,helper,data);
            }
        });
        $A.enqueueAction(action);
    },
    //function to get video src
    getVideoThumbnail:function(url) {
        var src = '';
        if (url.indexOf('youtube.com') > -1) 
        {
            var id = url.split('/')[4]//.split('v=')[1].split('&')[0];
            var thumb = 'http://i2.ytimg.com/vi/' + id + '/hqdefault.jpg';
            src = thumb;
        }
        else if (url.indexOf('vidyard.com') > -1) 
        {
            var id = url.split('/')[3];
            var thumb = "http://play.vidyard.com/" + id + ".jpg"
            src = thumb;
        }
            else if (url.indexOf('wistia.com') > -1) 
            {
                var thumb = url + ".jpg";
                src = thumb;
            }
                else if (url.indexOf('wistia.net') > -1) {
                    $.ajax({
                        url: 'https://fast.wistia.net/oembed?url=' + url + "?embedType=async&videoWidth=640",
                        dataType: 'jsonp',
                        success: function (data) {
                            var thumb = data.thumbnail_url != undefined ? data.thumbnail_url : "//{$Site.HostPath}/v4u/img/video.jpg";
                            src = thumb;
                        }
                    });
                }
                    else if (url.indexOf('videos.amp.vg') > -1) {
                        var thumb = url.replace('.flv', '.png');
                        src = thumb;
                    }
                        else if (url.indexOf('vimeo.com') > -1) {
                            id = url.split('/')[4];
                            $.ajax({
                                url: 'https://vimeo.com/api/oembed.json?url=' + url,
                                dataType: 'jsonp',
                                success: function (data) {
                                    var thumb = data.thumbnail_url != undefined ? data.thumbnail_url : "//{$Site.HostPath}/v4u/img/video.jpg";
                                    src = thumb;
                                }
                            });
                        }
                         else if (url.indexOf('googledrive') > -1) {
                            id = url.split(" ")[1];
                             var thumb = 'https://drive.google.com/thumbnail?authuser=0&sz=w320&id='+id+''                           
                                    src = thumb;
                        }
                                     
                            else 
                            {
                                var thumb = component.get("v.install") + "/v4u/img/video.jpg";
                                src = thumb;
                            }
        return src;
    },
    //to get difference btw date
    daydiff:function(utcdt)
    {
        var d1 = new Date();
        var strdt1 = d1.toString();
        var d2 = new Date(utcdt);
        var strdt2 = d2.toString()
        var diff = Math.floor((Date.parse(strdt1) - Date.parse(strdt2)) / 86400000);
        return diff;
    },
    //count to show on viewassets
    bindcount:function(component,helper,data)
    {
        var html = '<option val="default">Select Category</option>';
        var tabs = data.tabs;
        var tabdatas = data.tabdatas;
        var firstValue = '';
        for(var i=0;i<=tabs.length-1;i++)
        {
            var tabname =helper.escapeString(component,event,helper,tabs[i]);
            if(tabname.toLowerCase() == "all")
                continue;
            //html += '<option value="'+tabs[i]+'">'+tabs[i]+'</option>';
            html += '<option value="'+tabs[i]+'">'+tabname+'</option>';
            if(i == 0)
                firstValue = tabname;
        }
        var categoryList = $(this.viewassets).find('.categoryPicklist');
        $(categoryList).html(html);
        $(categoryList).change(function() {
            var selected = $('option:selected', this).text();
            if(selected == "Select Category")
                component.set("v.andor","OR");
            else
                component.set("v.andor","AND");
        });
        //$('#categoryPicklist').val(firstValue);
        
        for(var i=0;i<=tabdatas.length-1;i++)
        {
            var tabName = tabdatas[i].tabname;
            $(this.viewassets).find('.count_'+tabName).html(tabdatas[i].row_count);
        }
        
        helper.bindAssetsUsingPromises(component,helper);
        //component.set("v.datas",data);
        //component.set("v.userdata",data.userdata);
    },
    bindAssetsUsingPromises:function(component, helper)
    {        
        if(component.get('v.usePromises')) {
            helper.helperFunctionAsPromise(component, helper.callApiForTabDetails,"new",helper)
            .then($A.getCallback(function() {
                return helper.helperFunctionAsPromise(component, helper.callApiForTabDetails,"recently",helper)
            }))
            .then($A.getCallback(function() {
                return helper.helperFunctionAsPromise(component, helper.callApiForTabDetails,"bookmarked",helper)
            }))
            .then($A.getCallback(function() {
                return helper.helperFunctionAsPromise(component, helper.callApiForTabDetails,"recommended",helper)
            }))
            .then($A.getCallback(function() {
            }))
            .catch($A.getCallback(function(err) {
                var toastEvent = $A.get("e.force:showToast");
                
                toastEvent.setParams({
                    title: 'Error',
                    type: 'error',
                    message: err.message
                });
                
                toastEvent.fire();
            }))
            .then($A.getCallback(function() {
            }));
        } 
        else
        {
            helper.callApiForTabDetails(component,'new', false, false,helper);
            helper.callApiForTabDetails(component,'recently', false, false,helper);
            helper.callApiForTabDetails(component,'bookmarked', false, false,helper);
            helper.callApiForTabDetails(component,'recommended', false, false,helper);
        }
    },
    helperFunctionAsPromise : function(component, helperFunction,tabname,helper) {
        return new Promise($A.getCallback(function(resolve, reject) {
            helperFunction(component,tabname, resolve, reject,helper);
        }));
    },
    callApiForTabDetails:function(component, tabname,resolve,reject,helper)
    {
        
        var action = component.get("c.getAssetSearchForConfig");
        var search = $(helper.viewassets).find('.searchinput').val().toString();
        action.setParams({
            "searchtext": search,
            "userid":component.get("v.userid"),
            "iscount":'0',
            "tabname":tabname
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data = JSON.parse(response.getReturnValue()).result;
                
                component.set("v."+tabname+"data",data);
                $(".sec-view-assets ."+tabname+"icon").removeClass("disabled");
                $('.'+tabname+"assetclick").click(function(){
                    var id = $(this).attr("id");
                    $(helper.assets).removeClass("CPViewAssetsclickcolor");
                    $(this).addClass("CPViewAssetsclickcolor");
                    helper.callApi(component,helper,'-1',id);
                });
                if(resolve) {
                    resolve('appendViaApexPromise succeeded');
                }
            } else {
                if(reject) {
                    reject(Error(response.getError()[0].message));
                }
            }
        });
        action.setBackground();
        $A.enqueueAction(action);
    },
    //show assets accordion data
    showAssets:function(component, helper,checkblank)
    {
        $(helper.msgbox).hide();
        var filterName = '';
        var search = $(helper.viewassets).find('.searchinput').val();
        if(checkblank)
            filterName = $(helper.viewassets).find('.categoryPicklist').val();
        if(checkblank && (filterName == "default" || filterName == "Select Category")){
            component.set("v.showerror",true);
            //$(helper.msgbox).show();
            return;
        }
        filterName = $(helper.viewassets).find('.categoryPicklist').val();
        if(filterName == "default" || filterName == "Select Category")
            filterName = '';
        //New asset changes
        /*if((filterName == "default" || filterName == "Select Category" ) && (search != ''))
            filterName = 'All';*/
     	
        var install = component.get("v.install") + '//?elt=' + helper.sessionID;
        var url = install+"&clean#search?text=" + search + "&isfilter=" + filterName + "&isdash=true&type=";
        var title= "View Assets";
        component.set("v.showerror",false);
      //component.set("v.showsearcherror",false);
        //var viewSearch = search;
        //var viewTabName = [filterName];
        //component.set("v.viewSearch",viewSearch);
        
        //component.set("v.viewTabName",tab);
       /* component.set("v.isMedia",0);
        component.set("v.isFirstLoad",0);
        component.set("v.page",0);
        component.set("v.isFirstLoadCheck",0);
		 component.set("v.isLoadUncheck",0);*/
        //new Asset changes
     	/*component.set("v.flag",false);
     	component.set("v.page",0);
        
        helper.getAssetRecord(component,event,helper,filterName,search);
        var cmpTarget = component.find('Modalbox');
        var cmpBack = component.find('Modalbackdrop');
        $A.util.addClass(cmpTarget, 'slds-fade-in-open');
        $A.util.addClass(cmpBack, 'slds-backdrop--open');  */ 
        
       helper.openModal(component,url,title,'');
      
    },
    getTypeTitle:function(type){
        if(type == "bookmarked")
            return "My Favorites";
        else if(type == "recently")
            return type.charAt(0).toUpperCase() + type.slice(1) + " Used Assets";
        return type.charAt(0).toUpperCase() + type.slice(1) + " Assets";
    },
    //show all assets on modal
    showAll:function(component, helper,type)
    {
        var install = component.get("v.install") + '//?elt=' + helper.sessionID;
        var typeTitle = helper.getTypeTitle(type);
        component.set('v.title',typeTitle);
        var src = install+"&clean#search?text=&isfilter=&isdash=true&type="+type+'&typeTitle='+typeTitle+'&isWidget=true';
        this.openModal(component,src,typeTitle,'');
    },
    //to open modal
    openModal:function(component,src,title,selecthtml)
    {   
        
        component.set('v.title',title);
        var modal = '';
        if(src == '')
            return;
        if(component.get("v.dependantwidget") !== "oneapp")
        {
            modal = $(this.viewassets).find(".modal-independant");
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
            //$(modal).find("#selectvalues").append(selecthtml);
            var optionlength = $(modal).find("#selectvalues").length;
            if(optionlength == 1)
                $(modal).find("#amp-select").hide();
            else
                $(modal).find("#amp-select").show();
        }
        else
            $(modal).find("#amp-select").hide();
        if(this.showsendbutton)
            $(modal).find("#modal-footer-send").show();
        if(title=="Publish")
            $(modal).find("#modal-footer-send").find("button").html(title);
        else
            $(modal).find("#modal-footer-send").find("button").html("Send");
        if(title == '')
        {
            $(modal).find("#modal-heading").hide();
            $(modal).find("#modal-heading").parent().css("padding","0px");
        }
        $(modal).find("#modal-heading").html(title);
        $(modal).find("iframe").attr("src",src);
        $(modal).show(); 
        this.showsendbutton = false;
    },
    //to open data in tab
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
    getDetails:function(component,helper,iscount,tabname)
    {
        var action = component.get("c.GetPersonaThemeForCurrentUser");
        action.setCallback(this, function(response){ 
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var apigetState = JSON.parse(response.getReturnValue()).status;
                if(apigetState == 1){
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                    title : 'Processing...',
                    message: "Please wait while we're updating your profile. This page may refresh after that.",
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
                        component.set("v.userid",data.result.userid.toString());
                        component.set("v.install",data.result.install);
                        component.set("v.mainnavbgcolor",data.result.pagecss.mainnavbgcolor);
                        component.set("v.mainnavfontcolor",data.result.pagecss.mainnavfontcolor);
                        component.set("v.subnavbgcolor",data.result.pagecss.subnavbgcolor);
                        component.set("v.companyname",data.result.pagedata.companyname);
                        component.set("v.username",data.result.pagedata.username);
                        helper.bindPage(component,helper,'1','');
                    }
                }
            }  
        });
        action.setBackground();
        $A.enqueueAction(action);
    },
	 getAssetRecord : function(component,event,helper,filterName,search)
    {
        var assetTab = component.get("c.getAssetTab");
        
        assetTab.setParams({
            "linkid" : '0',
            "source" : "contact",
        });
        assetTab.setCallback(this,function(response){
            var state = response.getState();
            var pushFinalMessage="";
            if(state === "SUCCESS"){
                var apiStatus=JSON.parse(response.getReturnValue()).status;
                if(apiStatus==1)
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
                }
                else{
                var data = JSON.parse(response.getReturnValue());
                 var finalresponse=data.result.code;
                var finalmessage=data.result.msg;
                if(finalresponse==false)
                {
                        pushFinalMessage= finalmessage;
                           
                 }
                else{
                    if(data.result.tabs.length > 0){
                        for(var i=0;i<=data.result.tabs.length-1;i++){
                            data.result.tabs[i].TabName =helper.escapeString(component,event,helper,data.result.tabs[i].TabName);
                        }
                        component.set('v.tabs',data.result.tabs);
                        
                    }
                        
                var tabcount=[];
                for(var i=0;i<data.result.tabs.length;i++){
                    var jo={};
                    jo["tabname"]=data.result.tabs[i].TabName;
                    jo["templatetype"]=data.result.tabs[i].arrenums;
                    tabcount.push(jo);
                }
                component.set("v.tabcountNew",tabcount);
                        component.set('v.searchtxt',search);
                        component.set("v.permission",data.result.permissions);
                        
                        helper.templateTypeLink = data.result.templatetypelink; 
                        component.set("v.templateTypeLink",data.result.templatetypelink);
                        
                        component.set('v.options',data.result.searchoptions);
                        // component.set('v.options').selectedIndex = 0;
                        
                        var tabSelected = $.grep(component.get('v.tabs'), function (element, index) {
                            return element.TabName == filterName;
                        });
                        
                        if (tabSelected.length > 0 ){
                            
                            var currentFolderwithID = [];
                            var currentTabFolderEnum = [];
                            var folderFilter = [];
                            for(var i = 0; i< tabSelected[0].arrtypes.length; i++)
                            {
                                var foldername = tabSelected[0].arrtypes[i];
                                var folderEnum = tabSelected[0].arrenums[i];
                                var item = {};
                                var jo={};
                                item["foldername"] = foldername;
                                
                                item["enum"] = folderEnum;
                                jo[foldername] = true;
                                currentFolderwithID.push(item);
                                folderFilter.push(jo);
                            }
                            component.set("v.folderFilter",folderFilter);
                            
                            for(var i=0 ;i < currentFolderwithID.length;i++){
                                currentTabFolderEnum.push(currentFolderwithID[i].enum);
                            }
                            component.set("v.currentTabFolderEnum",currentTabFolderEnum);
                            component.set("v.currentFolderwithID",currentFolderwithID);
                            //helper.getAssetSearchRecord(component,event,helper,filterName);
                        }
                        var tab='';
                        if(filterName == 'All'){
                             tab= component.get('v.tabs');
                        }else{
                         tab =[];
                        var tabObj = {};
                        tabObj.TabName = filterName;
                        tab.push(tabObj);
                        }
                         var childComponent = component.find('child');
                childComponent.viewAssetMethod(component.get("v.searchtxt"),tab,component.get("v.options"),
                                               component.get("v.currentFolderwithID"),
                                               component.get("v.permission"),component.get("v.currentTabFolderEnum"),filterName,true,pushFinalMessage,component.get("v.mainnavbgcolor"),component.get("v.mainnavfontcolor"));
                    }
                
                } 
            }
        });
        $A.enqueueAction(assetTab);
    },
	getAssetSearchRecord : function(component,event,helper,filterName){
        var currentTabFolderEnum = component.get("v.currentTabFolderEnum");
        var searchText = component.get("v.searchtxt");
        var page = component.get("v.page");
        var pagesize = component.get("v.pagesize");
        var assetSearchApi = component.get("c.sfGetAssetSearchForConfigTemplate") ;
        var isMedia = component.get("v.isMedia");
        var filterid ;
       	var conditionval;
        if(component.get("v.filterids") !=  null)
         	filterid=component.get("v.filterids");
        else
            filterid=[];
        if(component.get("v.conditionVal") == true )
            conditionval=true;
            else
             conditionval=false;
         var filterFlagVal = component.get("v.filterFlag");
        assetSearchApi.setParams({
            
            "page" :page,
            "pagesize":pagesize,
            "searchparam":searchText,
            "tableType":[],
            "templateType":currentTabFolderEnum,
            "tempSearch":false,
            "tabName":filterName,
            "isMedia":isMedia,
            "filters":filterid,
            "condition":conditionval,
            "sortupdate":"updatedon",
             "filFlag":filterFlagVal,
        });
        assetSearchApi.setCallback(this,function(response){
            var state = response.getState();
            var pushFinalMessage="";
            if(state === "SUCCESS"){
                 var apiStatus=JSON.parse(response.getReturnValue()).status;
                var assetRecord = JSON.parse(response.getReturnValue());
                var finalresponse=assetRecord.result.code;
                var finalmessage=assetRecord.result.msg;
                if(apiStatus==1)
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
                }
                else{
                     if(finalresponse==false)
                     {
                         pushFinalMessage=finalmessage;                         
                	}
                    else{
                       
                        
                        var assetRecordItem = assetRecord.result.tabData.item;
                        component.set("v.rowcount",assetRecord.result.tabData.row_count);
                        component.set("v.pages",Math.ceil(assetRecord.result.tabData.row_count/component.get("v.pagesize")));
                        var pages = component.get("v.pages");
                        if(assetRecordItem.length ==0){
                            component.set("v.nodata",true);
                            component.set("v.spinner",false);
                            component.set("v.itemss",undefined);
                            $(helper.assetrecord).find('.rotate').removeClass("rotate-me");
                        }
                        
                        else{
                            if(assetRecord.result.filterData != null){
                                if(assetRecord.result.filterData.noncategorized.length > 0 )
                                    component.set("v.Noncategorizedfilters",assetRecord.result.filterData.noncategorized);
                                else
                                    component.set("v.Noncategorizedfilters",null); 
                                
                                if(assetRecord.result.filterData.categorized.length > 0)
                                    component.set("v.categorizedfilters",assetRecord.result.filterData.categorized);
                                else
                                    component.set("v.categorizedfilters",null); 
                            }
                            var items = [];
                            for(var i = 0; i< assetRecordItem.length; i++)
                            {
                                var item = {};
                                assetRecordItem[i].metadata = JSON.parse(assetRecordItem[i].metadata);
                                
                                var typeStr = assetRecordItem[i].metadata.templatetype;//"WEB"
                                var templateTypeLink = component.get("v.templateTypeLink");
                                var typeValue = templateTypeLink[typeStr];
                                assetRecordItem[i].typename = typeStr;
                                assetRecordItem[i].typevalue = typeValue;
                                assetRecordItem[i].filetype = assetRecordItem[i].metadata.filetype;
                                if(typeStr == "PRINT" || typeStr == "DATAROOM" || typeStr =="POWERPOINT" || typeStr =="WEB" || 
                                   typeStr =="EMAIL" || typeStr =="EXTERNALLINKS" || typeStr =="INTERNALPLAYBOOK" || typeStr =="EBOOK" || typeStr =="BLOGPOST" || typeStr =="WEBBANNER" || typeStr == "CONTRACT"){
                                    var _data = assetRecordItem[i];
                                    var install = component.get("v.install");
                                    var _metadata = _data.metadata;
                                    item["metadata"] = _data.metadata;
                                    item["typename"]=typeStr;
                                    item["typeValue"]=typeValue;
                                    item["id"] = _metadata.id;
                                    item["name"] = _metadata.name;
                                    item["desc"] = _metadata.desc;
                                    item["imgUrl"] = "";
                                    if(_metadata.thumbnailkey == undefined)
                                    {
                                        item["imgUrl"] = install+'/page/'+_metadata.firstpage +'/'+_metadata.templatepublickey+ '/' + _metadata.updatedon + '/thumbnail.jpeg';
                                        
                                    }
                                    else{
                                        item["imgUrl"] = install+'/timg/'+ _metadata.thumbnailkey +'/img';}
                                    item["output"] = _metadata.output;
                                    item["status"] = _metadata.status;
                                    item["filetype"]=_metadata.filetype;
                                    item["downloadurl"] = _metadata.downloadurl;
                                    item["encrepteduserid"] =assetRecord.result.encreptedUserID;
                                    item["usedatasource"] = _metadata.usedatasource;
                                    item["hasquestionnaire"] = _metadata.hasquestionnaire;
                                    item["useprojectsource"] = _metadata.useprojectsource;
                                    item["linkid"] = component.get("v.linkid");
                                    item["linktype"] = _data.linktype;
                                    item["updatedon"] = _data.updatedon;
                                    item["isprojects"] = false;
                                    item["flag10"] = assetRecordItem[i].flag10;
                                    item["index"] = i;
                                    items.push(item);
                                }
                                
                                else if(assetRecordItem[i].filetype == "VIDEO" ){
                                    
                                    var _data = assetRecordItem[i];
                                    //var encrepteduserid = component.get("v.userdata").encrepteduserid;
                                    var encrepteduserid = assetRecord.result.encreptedUserID;
                                    var install = component.get("v.install");
                                    var _metadata = _data.metadata;
                                    item["id"] = _data.linkid;                   
                                    if(_metadata.desc != null)
                                    {
                                        item["title"] = _metadata.desc;
                                        if(_metadata.desc.length <= 130)
                                            item["desc"] = _metadata.desc;
                                        else
                                            item["desc"] = _metadata.desc.substring(0,27);
                                    }
                                    else
                                        item["desc"] = "No Description";
                                    //var thumb = component.get("v.userdata").currentDomain+'/v4u/img/video.jpg';
                                    var thumb = assetRecord.result.currentDomain+'/v4u/img/video.jpg';
                                    var noThumb = false;
                                    var url = _metadata.url;
                                    thumb = this.getVideoThumbnail(url);
                                    if(thumb == "")
                                    {
                                        thumb = component.get("v.install") + "/v4u/img/video.jpg";
                                        noThumb = true;                       
                                    }
                                    item["noThumb"] = noThumb;
                                    item['url']=_metadata.url;
                                    item["filetype"] = _metadata.filetype;
                                    item["imgUrl"] = thumb;
                                    item["output"] = _metadata.output;    
                                    item["name"] = _metadata.name;
                                    item["fileurl"] = _metadata.fileurl;
                                    item["createdon"] = _metadata.createdon.split(' ')[0];
                                    item["linkid"] = component.get("v.linkid");
                                    item["linktype"] = _data.linktype;
                                    item["updatedon"] = _data.updatedon;
                                    item["nameurl"] = _metadata.fileurl+'?userid=' +encrepteduserid+ '&rand=1';
                                    item["metadata"] = _data.metadata;
                                    item["flag10"] = assetRecordItem[i].flag10;
                                    item["index"] = i;
                                    items.push(item);
                                    
                                    
                                }
                                    else if(assetRecordItem[i].filetype == 'TEXT'|| assetRecordItem[i].filetype == 'PPT' || assetRecordItem[i].filetype == 'XLS' || assetRecordItem[i].filetype == 'CSV' ||
                                            assetRecordItem[i].filetype == 'STEP'||  assetRecordItem[i].filetype == 'PPTX' || assetRecordItem[i].filetype == 'PDF'  ||
                                            assetRecordItem[i].filetype == 'DOC' || assetRecordItem[i].filetype == 'DOCX' || assetRecordItem[i].filetype == 'XLSX' 
                                            || assetRecordItem[i].filetype == 'CSS'  || assetRecordItem[i].filetype == 'XML'  || assetRecordItem[i].filetype == 'ZIP' || 
                                            assetRecordItem[i].filetype == 'ZIPX'  || assetRecordItem[i].filetype == 'RAR'  || assetRecordItem[i].filetype == '7Z' || assetRecordItem[i].filetype == 'S7Z'
                                            || assetRecordItem[i].filetype == 'CFS'  || assetRecordItem[i].filetype == 'ICS'  || assetRecordItem[i].filetype == 'VCS'  || assetRecordItem[i].filetype == 'DWG'
                                            || assetRecordItem[i].filetype == 'STP'||assetRecordItem[i].filetype == 'DOCUMENT'){
                                        
                                        var _data = assetRecordItem[i];
                                        var install = component.get("v.install");
                                        var _metadata = _data.metadata;
                                        item["id"] = _data.linkid;
                                        item["filetype"] = _metadata.filetype;
                                        item["title"] = _metadata.name;
                                        if(_metadata.name <= 30)
                                            item["name"] = _metadata.name;
                                        else
                                            item["name"] = _metadata.name.substring(0,27);
                                        
                                        item["desc"] = _metadata.desc;
                                        item["filesize"] = _metadata.filesize;
                                        item["thumburl"] = _metadata.thumburl;
                                        item["url"] = _metadata.url;
                                        item["downloadurl"] = _metadata.downloadurl;
                                        item["fileurl"] = _metadata.fileurl;
                                        item["output"] = _metadata.output;
                                        item["createdon"] = _metadata.createdon.split(' ')[0];
                                        item["itemupdatedon"] = _metadata.updatedon.split(' ')[0];
                                        item["linkid"] = component.get("v.linkid");
                                        item["linktype"] = _data.linktype;
                                        item["updatedon"] = _data.updatedon;
                                        item["metadata"] = _data.metadata;
                                        item["index"] = i;
                                        items.push(item); 
                                    }
                                        else if(assetRecordItem[i].filetype == "JPEG" ||assetRecordItem[i].filetype == "PNG"){
                                            var _data = assetRecordItem[i];
                                            var install = component.get("v.install");
                                            var _metadata = _data.metadata;
                                            item["id"] = _data.linkid;
                                            item["filetype"] = _metadata.filetype;
                                            item["title"] = _metadata.name;
                                            if(_metadata.name <= 30)
                                                item["name"] = _metadata.name;
                                            else
                                                item["name"] = _metadata.name.substring(0,27);
                                            
                                            item["desc"] = _metadata.desc;
                                            item["output"] = _metadata.output;
                                            item["filters"] = _metadata.filters;
                                            item["filesize"] = _metadata.filesize;
                                            item["thumburl"] = _metadata.thumburl;
                                            item["fileurl"] = _metadata.fileurl;
                                            item["url"] = _metadata.url;
                                            item["imgUrl"] = _metadata.thumburl;
                                            item["createdon"] = _metadata.createdon.split(' ')[0];
                                            item["itemupdatedon"] = _metadata.updatedon.split(' ')[0];
                                            item["linkid"] = component.get("v.linkid");
                                            item["linktype"] = _data.linktype;
                                            item["updatedon"] = _data.updatedon;
                                            item["metadata"] = _data.metadata;
                                            item["index"] = i;
                                            items.push(item); 
                                        }else if(assetRecordItem[i].metadata.trackinglink == true){
                                            var _data = assetRecordItem[i];
                                            var install = component.get("v.install");
                                            var _metadata = _data.metadata;
                                            item["id"] = _metadata.id;
                                            item["name"] = _metadata.name;
                                            item["trackinglink"] = _metadata.trackinglink;
                                            item["fileurl"] = _metadata.fileurl;
                                            item["index"]=i;
                                            
                                            items.push(item);
                                        }
                                
                            }
                            component.set("v.itemss",items);
                            
                            
                        }
                        
                    }
                    var tab='';
                    if(filterName == "All"){
                         tab=component.get("v.tabs");
                    }else{
                    
                         tab =[];
                        var tabObj = {};
                        tabObj.TabName = filterName;
                        tab.push(tabObj);
                        component.set("v.flagcountVal",false);
                    }
                        
                        var childComponent = component.find('child');
                        childComponent.viewAssetMethod( component.get("v.searchtxt"),tab,component.get("v.options"),
                                                       component.get("v.currentFolderwithID"),
                                                       component.get("v.permission"), component.get("v.currentTabFolderEnum"),filterName,false,pushFinalMessage,component.get("v.mainnavbgcolor"),component.get("v.mainnavfontcolor"),component.get("v.itemss"),
                                                       component.get("v.pages"),component.get("v.rowcount"),component.get("v.install"),
                                               			component.get("v.categorizedfilters"),component.get("v.Noncategorizedfilters"),component.get("v.flagcountVal"));

            	}
            }
                                                           
        });
        
        $A.enqueueAction(assetSearchApi);
        
    },
    gettabcount :function(component,event,helper,tabName){
         var searchText = component.get("v.searchtxt");
        var page = component.get("v.page");
        var pagesize = component.get("v.pagesize");
        var assetcountApi = component.get("c.sfGetTabCount") ;
        var isMedia = component.get("v.isMedia");
        var filterid ;
       	var conditionval;
        if(component.get("v.filterids") !=  null)
         	filterid=component.get("v.filterids");
        else
            filterid=[];
        if(component.get("v.conditionVal") == true )
            conditionval=true;
            else
            conditionval=false;
     	var tabFolderEnum =component.get("v.currentTabFolderEnum");
        assetcountApi.setParams({
            "page" :page,
            "pagesize":pagesize,
            "searchparam":searchText,
            "tableType":[],
            "tempSearch":false,
            "isMedia":isMedia,
            "filters":filterid,
            "condition":conditionval,
            "sortupdate":"updatedon",
            "iscount":true,
            "tabdata":component.get("v.tabcountNew")
            
        });
        assetcountApi.setCallback(this,function(response){
            
            var state = response.getState();
            if(state === "SUCCESS"){
                var apiStatus=JSON.parse(response.getReturnValue()).status;
                if(apiStatus==1)
                {
                   
                     var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title : 'Info Message',
                        message: "An issue occured with the Mindmatrix widget, please contact admin",
                        duration:' 7000',
                        key: 'info_alt',
                        type: 'info',
                        mode: 'dismissible' 
                	});
        		 	toastEvent.fire(); 
                
                }                
                else
                {
                var tabcount = JSON.parse(response.getReturnValue());
                var finalresponse=tabcount.result.code;
                var finalmessage=tabcount.result.msg;
                  if(finalresponse==false)
                    {
                         var toastEvent = $A.get("e.force:showToast");
                             toastEvent.setParams({
                            title : 'Info Message',
                            message: 'In ViewAsset Widget'+' '+finalmessage,
                            duration:' 7000',
                            key: 'info_alt',
                            type: 'info',
                            mode: 'dismissible' 
               		       });
        				toastEvent.fire();
                        
                    }                    
                 else
                 {
                component.set("v.tabcountVal",tabcount.result.tabdata);
                
                 }
               }
                var childComponent = component.find('child');
                childComponent.ViewAssetTabMethod(component.get("v.tabcountVal"));
                
            }
        });
        
        $A.enqueueAction(assetcountApi);
  },
    dynamicColorBinding:function(component,event,helper){
        document.documentElement.style.setProperty('--mainnavbgcolor', component.get("v.mainnavbgcolor"));
        document.documentElement.style.setProperty('--mainnavfontcolor', component.get("v.mainnavfontcolor"));
        document.documentElement.style.setProperty('--subnavbgcolor', component.get("v.subnavbgcolor"));
    },
    escapeString: function(component,event,helper,str){
       return str.replace(/%27/g, "'").replace(/%27%27/g, "\"").replace(/%60/g, "`").replace(/%5c/g, "\\").replace(/%28/g, "\(").replace(/%29/g, "\)").replace(/%3e/g, ">").replace(/%3c/g, "<").replace(/%3e/,"&gt;").replace(/%3c/, "&lt;").replace(/%20/g, " ").replace(/%26/g, "&").replace(/%40/g, "@").replace(/%23/g, "#").replace(/%24/g, "$").replace(/%2f/g, "/");
    },
    
    docIcon:function(component,event,helper,filetype){
    var docIcon ='';
    if(filetype == 'TEXT')
    docIcon="doctype:txt";
    if(filetype == 'PPT' || filetype == 'PPTx')
    docIcon="doctype:ppt";
    if(filetype == 'XLS' || filetype == 'XLSX')
    docIcon="doctype:excel";
    if(filetype == 'CSV')
    docIcon="doctype:csv";
    if(filetype == 'ZIP' ||filetype == 'ZIPX')
    docIcon="doctype:zip";
    if(filetype == 'DOCUMENT'||filetype == 'DOCX' ||filetype == 'DOC')
    docIcon="doctype:word";
    if(filetype == 'STEP'||filetype == 'CSS' ||filetype == 'XML'||
    filetype == 'RAR'||filetype == '7Z'||filetype == 'S7Z' ||filetype == 'CFS' 
    ||filetype == 'ICS' ||filetype == 'VCS'||filetype == 'DWG'||filetype == 'STP')
    docIcon="doctype:unknown";
    return docIcon
}
    
})