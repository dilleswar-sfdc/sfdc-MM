({
    checkBoxId:"",
    tabFolderLink:[],
    templateTypeLink:{},
    checkboxId:[],
    checked:[],
    unchecked:[],
    jo:{},
    assetrecord:'',
    rotateme:'',
    selectedAssets : [],
    assetCount : 0,
    filterIds : [],
    tabrotate:'',
    eltandeln:'',
    dropup : function(component,event,helper){
        var index = $(event.currentTarget).attr("data-action");
        var data = component.get("v.itemss");
        var rowcount = component.get("v.rowcount");
        if(rowcount >= 1)
        {
            for( var i= 0;i < data.length;i++){
                var getindex = data[i].index;
                if(getindex != index)
                    $("#dropup_"+getindex).addClass("toggle");
            }
            $("#dropup_"+index).toggleClass("toggle");
        }  
    },
    handleActive:function(component,event,helper)
    {
        
        $(helper.assetrecord).find('.rotate').addClass("rotate-me"); 
        component.set("v.spinner",true);
        component.set("v.itemss",null);
        component.set("v.nodata",false);
        var target = event.currentTarget;
        var targetId = target.getAttribute("id");
        component.set("v.selTabId",targetId);
        var rotateid = component.find("selTAbColor");
        for(var i=0;i< rotateid.length;i++){
            var val = rotateid[i].getElement().getAttribute('id');
            if(val == targetId)
                $A.util.addClass(rotateid[i], "tabcolor");
            else
                $A.util.removeClass(rotateid[i], "tabcolor");  
        }
        var tabsData = component.get("v.tabs");
        var tabSelected = $.grep(component.get('v.tabs'), function (element, index) {
            return element.TabName == targetId;
        });
        var tabName = tabSelected[0].TabName;
        if (tabSelected.length > 0 ){
            if(tabSelected[0].arrtypes != undefined){
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
            }
            if(component.get("v.select") == "Include Mine"){
                if(tabName == "All"){
                    component.set("v.currentFolder",component.get("v.currentTabFolderEnum"));
                    var cmpEvent = component.getEvent("CmpmodalEvent"); 
                    cmpEvent.setParams({
                        "tabNameData" : tabName,
                        "searchtextModal" :component.get("v.searchtxt"),
                        "currentFolder" : component.get("v.currentTabFolderEnum"),
                        "isMedia":1,
                        "filterflag":true,
                        "flagcountVal":false,
                    }); 
                    cmpEvent.fire();
                }
                else{
                    var cmpEvent = component.getEvent("CmpmodalEvent"); 
                    cmpEvent.setParams({
                        "tabNameData" : tabName,
                        "searchtextModal" :component.get("v.searchtxt"),
                        "currenttabfolderENum" : component.get("v.currentTabFolderEnum"),
                        "isMedia":1,
                        "filterflag":true,
                        "flagcountVal":false,
                    }); 
                    cmpEvent.fire();
                    
                }
            }else{
                if(tabName == "All"){
                    component.set("v.currentFolder",component.get("v.currentTabFolderEnum"));
                    var cmpEvent = component.getEvent("CmpmodalEvent"); 
                    cmpEvent.setParams({
                        "tabNameData" : tabName,
                        "searchtextModal" :component.get("v.searchtxt"),
                        "currentFolder" : component.get("v.currentTabFolderEnum"),
                        "isMedia":0,
                        "filterflag":true,
                        "flagcountVal":false,
                    }); 
                    cmpEvent.fire();
                    var cmpEvent = component.getEvent("viewModalEvent"); 
                    cmpEvent.setParams({
                        "tabNameData" : tabName,
                        "modalSearchtxt" :component.get("v.searchtxt"),
                        "modalFolderEnum" : component.get("v.currentTabFolderEnum"),
                        "modlaisMedia" : 0,
                        "filterflag":true,
                        "flagcountVal":false,
                        
                    }); 
                    cmpEvent.fire();
                }
                else{
                    var cmpEvent = component.getEvent("CmpmodalEvent"); 
                    cmpEvent.setParams({
                        "tabNameData" : tabName,
                        "searchtextModal" :component.get("v.searchtxt"),
                        "currenttabfolderENum" : component.get("v.currentTabFolderEnum"),
                        "isMedia":0,
                        "filterflag":true,
                        "flagcountVal":false,
                    }); 
                    cmpEvent.fire();
                    var cmpEvent = component.getEvent("viewModalEvent"); 
                    cmpEvent.setParams({
                        "tabNameData" : tabName,
                        "modalSearchtxt" :component.get("v.searchtxt"),
                        "modalFolderEnum" : component.get("v.currentTabFolderEnum"),
                        "modlaisMedia" : 0,
                        "filterflag":true,
                        "flagcountVal":false,
                        
                    }); 
                    cmpEvent.fire();
                }
            }
        }
    },
    send : function(component,event,helper){
        var userdata = component.get("v.permission"); 
        var install = component.get("v.install");
        var index = $(event.currentTarget).attr("data-action");
        var _item = component.get("v.itemss");
        var rec =_item[index] ;
        var linkid = rec.linkid;
        var templatedata = rec.metadata;
        var sourcetype=component.get("v.sourceType");
        var projecttypeid = component.get("v.projectTypeId");                                   
        if(templatedata == "undefined" || templatedata == undefined ){
            if(rec.trackinglink == true){
                if(userdata.canExternalLinkSend){
                    rec['linkids']=null;
                    rec['isusergrid']=false;
                    rec['issmartlist']=null;
                    rec['iscontactcompany']=null;
                    var _templatedata = window.btoa(JSON.stringify(rec));
                    if(linkid == undefined){
                        if(component.get("v.isPopUp"))
                            var url="&clean#assets?closesfmodal=true&function=sendExternalLinks&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                        else
                            var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=sendExternalLinks&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                    }
                }
            }
        }
        else if(templatedata.templatetype == "PRINT" ){
            templatedata["linkids"]=null;
            templatedata["issmartlist"]=null;
            var _templatedata=window.btoa(JSON.stringify(templatedata));
            if(linkid == undefined)
                var url="&clean#assets?closesfmodal=true&function=sendPrint&templatedata=" +_templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
            else
                var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=sendPrint&templatedata=" +_templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
        }else if(templatedata.templatetype == "DATAROOM" ||templatedata.templatetype ==36864){
            templatedata["isSmartlist"]=null;
            templatedata["linkids"]=null;
            templatedata["iscontactcompany"] = "";
            templatedata["ispartner"] = false;                                             
            templatedata["templatetype"] = 36864;
            var _templatedata = window.btoa((JSON.stringify(templatedata)));
            if(linkid == undefined)
                var url="&clean#assets?closesfmodal=true&function=sendToDataRoom&templatedata=" + _templatedata +"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
            else
                var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=sendToDataRoom&templatedata=" + _templatedata +"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
            helper.dropup(component,event,helper);                                                       
        }
            else if(templatedata.templatetype == "POWERPOINT" ){
                templatedata["linkids"]=null;
                templatedata["isusergrid"] = false;
                templatedata["issmartlist"]=null;
                templatedata["iscontactcompany"]="";
                var _templatedata = window.btoa(JSON.stringify(templatedata));
                if(linkid == undefined)
                    var url="&clean#assets?closesfmodal=true&function=sendPPTFromNewAssets&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                else
                    var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=sendPPTFromNewAssets&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
            }else if(templatedata.templatetype == "EBOOK"){
                templatedata["linkids"]=linkid;
                templatedata["isSmartlist"]="";
                templatedata["isContactcompany"]="";
                var _templatedata = window.btoa(JSON.stringify(templatedata));
                if(linkid == undefined)
                    var url="&clean#assets?closesfmodal=true&function=sendEbook&templatedata=" + _templatedata +"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                else
                    var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=sendEbook&templatedata=" + _templatedata +"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
            }else if(templatedata.filetype == "VIDEO"){
                templatedata["id"]=linkid;
                templatedata["linkids"]=null;
                templatedata["templatetype"] = 8388608;
                var _templatedata = window.btoa(JSON.stringify(templatedata));
                if(linkid == undefined)
                    var url="&clean#assets?closesfmodal=true&function=sendAssetsEmail&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                else
                    var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=sendAssetsEmail&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
            }
        
                else if(templatedata.filetype == 'TXT'|| templatedata.filetype == 'PPT' || templatedata.filetype == 'XLS' || templatedata.filetype == 'CSV' ||
                        templatedata.filetype == 'STEP'||  templatedata.filetype == 'PPTX' || templatedata.filetype == 'PDF'  ||
                        templatedata.filetype == 'DOC' || templatedata.filetype == 'DOCX' || templatedata.filetype == 'XLSX' 
                        || templatedata.filetype == 'CSS'  || templatedata.filetype == 'XML'  || templatedata.filetype == 'ZIP' || 
                        templatedata.filetype == 'ZIPX'  || templatedata.filetype == 'RAR'  || templatedata.filetype == '7Z' || templatedata.filetype == 'S7Z'
                        || templatedata.filetype == 'CFS'  || templatedata.filetype == 'ICS'  || templatedata.filetype == 'VCS'  || templatedata.filetype == 'DWG'
                        || templatedata.filetype == 'STP' || templatedata.filetype == 'DOCUMENT' || templatedata.filetype == 'TEXT' ){
                    templatedata["linkids"]=null;
                    templatedata["id"]=linkid;
                    templatedata["filters"]=null;
                    templatedata["templatetype"] = 2097152;
                    var _templatedata = window.btoa(JSON.stringify(templatedata));
                    if(linkid == undefined)
                        var url="&clean#assets?closesfmodal=true&function=sendAssetsEmail&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                    else
                        var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=sendAssetsEmail&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                }else if(templatedata.filetype == "JPEG" || templatedata.filetype == "PNG"){
                    templatedata["linkids"]=null;
                    templatedata["id"]=linkid;
                    templatedata["filters"]=null;
                    templatedata["templatetype"] = 1048576;
                    templatedata["ispartner"] = false;                                                                       
                    var _templatedata = window.btoa(JSON.stringify(templatedata));
                    if(linkid==undefined)
                        var url="&clean#assets?closesfmodal=true&function=sendAssetsEmail&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                    else
                        var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=sendAssetsEmail&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                }else if(templatedata.templatetype =="EMAIL"){
                    if(userdata.canEmailSend){
                        templatedata["linkids"]=null;
                        templatedata["isUserGrid"] = false;
                        templatedata["isPartner"] = false;
                        templatedata["isSmartlist"]=null;
                        templatedata["isContactcompany"]="";
                        templatedata["isShownInModal"]=true;
                        var _templatedata = window.btoa(JSON.stringify(templatedata));
                        if(linkid==undefined)
                            var url="&clean#assets?closesfmodal=true&function=sendEmail&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                        else
                            var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=sendEmail&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                    }
                }else if(templatedata.templatetype =="WEB"){
                    templatedata["linkids"]=linkid;
                    templatedata["issmartlist"]=null;
                    templatedata["iscontactcompany"]="";
                    var _templatedata = window.btoa(JSON.stringify(templatedata));
                    if(linkid==undefined)
                        var url = "&clean#assets?closesfmodal=true&function=sendWebsite&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                    
                    else
                        var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=sendWebsite&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                }
                    else if(templatedata.templatetype =="CONTRACT"){
                        templatedata["isSmartlist"]=null;
                        templatedata["linkids"]=linkid;
                        if (templatedata.output) {
                            var _templatedata = window.btoa(JSON.stringify(templatedata));
                            if(linkid==undefined)
                                var url = "&clean#assets?closesfmodal=true&function=sendContract&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                            
                            else
                                var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=sendContract&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                        }
                        else if(!templatedata.output && templatedata.usedatasource != 1 && !templatedata.hasquestionnaire ){
                            if(userdata.canSendAssets){
                                templatedata["ispartner"] =1 ;
                                var _templatedata = window.btoa(JSON.stringify(templatedata));
                                if(linkid==undefined)
                                    var url = "&clean#assets?closesfmodal=true&function=sendContractMedia&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                                
                                else 
                                    var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=sendContractMedia&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                            }
                        }
                    }   
                        else if(templatedata.templatetype =="WEBBANNER"){
                            templatedata["linkids"]=linkid;
                            if (templatedata.output) {
                                var _templatedata = window.btoa(JSON.stringify(templatedata));
                                if(linkid==undefined)
                                    var url = "&clean#assets?closesfmodal=true&function=sendWebBanner&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                                
                                else
                                    var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=sendWebBanner&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                                
                            }
                            else {
                                alert('you don have permission to send ');
                            }   
                        }
                            else if(templatedata.templatetype =="FAQ"){
                                            templatedata["linkids"]=null;
                                            templatedata["isUserGrid"] = false;
                                            templatedata["isPartner"] = false;
                                            templatedata["iscontactcompany"]="";
                                            templatedata["templatetype"]=templatedata.templatetype;
                                            var _templatedata = window.btoa(JSON.stringify(templatedata));
                         					var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=sendFAQEmail&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                            }
        if(component.get("v.isPopUp")){
            if(linkid == undefined){
                if(url != undefined){
                    var cmpEvent = component.getEvent("viewModalActionEvent");
                    cmpEvent.setParams({
                        "actionUrl" : url
                    }); 
                    cmpEvent.fire(); 
                }
            }
        }else{
            if(url != undefined)
                helper.showEnablement(helper,component,url);
        }                              
    },
    rating : function(component,event,helper){
        var userdata = component.get("v.permission");
        var install = component.get("v.install");
        var index = $(event.currentTarget).attr("data-action");
        var _item = component.get("v.itemss");
        var rec =_item[index] ;
        var linkid = rec.linkid;
        var templatedata = rec.metadata;
        if(userdata.hasRatingAccess){
            if(templatedata.filetype == "VIDEO"||(templatedata.filetype == "JPEG" || templatedata.filetype == "PNG")||(templatedata.filetype == 'TXT'|| templatedata.filetype == 'PPT' || templatedata.filetype == 'XLS' || templatedata.filetype == 'CSV' ||
                 templatedata.filetype == 'STEP'||  templatedata.filetype == 'PPTX' || templatedata.filetype == 'PDF'  ||
                 templatedata.filetype == 'DOC' || templatedata.filetype == 'DOCX' || templatedata.filetype == 'XLSX' 
                 || templatedata.filetype == 'CSS'  || templatedata.filetype == 'XML'  || templatedata.filetype == 'ZIP' || 
                 templatedata.filetype == 'ZIPX'  || templatedata.filetype == 'RAR'  || templatedata.filetype == '7Z' || templatedata.filetype == 'S7Z'
                 || templatedata.filetype == 'CFS'  || templatedata.filetype == 'ICS'  || templatedata.filetype == 'VCS'  || templatedata.filetype == 'DWG'
                 || templatedata.filetype == 'STP' || templatedata.filetype == 'TEXT' || templatedata.filetype == 'DOCUMENT')){
                templatedata["id"]=linkid;}
            templatedata["type"]=2;
            var _templatedata = window.btoa(JSON.stringify(templatedata));
            if(linkid==undefined)
                var url = "&clean#assets?closesfmodal=true&function=showFeedbackComments&templatedata=" + _templatedata+"&tpapp=sfdc";
            
            else
                var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=showFeedbackComments&templatedata=" + _templatedata+"&tpapp=sfdc";
            if(linkid == undefined){
                var cmpEvent = component.getEvent("viewModalActionEvent");
                cmpEvent.setParams({
                    "actionUrl" : url
                }); 
                cmpEvent.fire(); 
            }else{
                helper.showEnablement(helper,component,url);
            }
        }
    },
    addToRoom : function(component,event,helper){
        var userdata = component.get("v.permission");  
        var isShownInModal = component.get("v.isShownInModal");
        var dataRoomID = component.get("v.dataRoomID");
        var install = component.get("v.install");
        var index = $(event.currentTarget).attr("data-action");
        var _item = component.get("v.itemss");
        var rec =_item[index] ;
        var linkid = rec.linkid;
        var templatedata = rec.metadata;
        var  assettype = 1;  
        if(templatedata.filetype == "JPEG" || templatedata.filetype == "PNG"||templatedata.filetype == "VIDEO"||templatedata.filetype == "VIDEO"||(templatedata.filetype == "JPEG" || templatedata.filetype == "PNG")||(templatedata.filetype == 'TXT'|| templatedata.filetype == 'PPT' || templatedata.filetype == 'XLS' || templatedata.filetype == 'CSV' ||
                 templatedata.filetype == 'STEP'||  templatedata.filetype == 'PPTX' || templatedata.filetype == 'PDF'  ||
                 templatedata.filetype == 'DOC' || templatedata.filetype == 'DOCX' || templatedata.filetype == 'XLSX' 
                 || templatedata.filetype == 'CSS'  || templatedata.filetype == 'XML'  || templatedata.filetype == 'ZIP' || 
                 templatedata.filetype == 'ZIPX'  || templatedata.filetype == 'RAR'  || templatedata.filetype == '7Z' || templatedata.filetype == 'S7Z'
                 || templatedata.filetype == 'CFS'  || templatedata.filetype == 'ICS'  || templatedata.filetype == 'VCS'  || templatedata.filetype == 'DWG'
                 || templatedata.filetype == 'STP' || templatedata.filetype == 'TEXT' || templatedata.filetype == 'DOCUMENT')){
            	
                	if( isShownInModal && dataRoomID > 0 || userdata.hasDataRoomAccess){
                    templatedata["assetType"]=2;
                    templatedata["linkid"]=linkid;
                    var _templatedata = window.btoa(JSON.stringify(templatedata));
                    if(linkid==undefined)
                        var url = "&clean#assets?closesfmodal=true&function=addToDataRoom&templatedata=" + _templatedata+"&tpapp=sfdc";
                    
                    else
                        var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=addToDataRoom&templatedata=" + _templatedata+"&tpapp=sfdc";
                }
            
        }
        else {
            if( isShownInModal && dataRoomID > 0 || userdata.hasDataRoomAccess){
                templatedata["assetType"]=1;
                templatedata["linkid"]=templatedata.id;
                var _templatedata = window.btoa(JSON.stringify(templatedata));
                if(linkid==undefined)
                    var url = "&clean#assets?closesfmodal=true&function=addToDataRoom&templatedata=" + _templatedata+"&tpapp=sfdc";
                
                else
                    var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=addToDataRoom&templatedata=" + _templatedata+"&tpapp=sfdc";
            }
        }
        if(linkid == undefined){
            if(url != undefined){
                var cmpEvent = component.getEvent("viewModalActionEvent");
                cmpEvent.setParams({
                    "actionUrl" : url
                }); 
                cmpEvent.fire();
            }
        }else{
            if(url != undefined)
                helper.showEnablement(helper,component,url);
        }
    },
    customize : function(component,event,helper){
        var userdata = component.get("v.permission");                                       
        var install = component.get("v.install");
        var index = $(event.currentTarget).attr("data-action");
        var _item = component.get("v.itemss");
        var rec =_item[index] ;
        var linkid = rec.linkid;
        var templatedata = rec.metadata;
        if(templatedata.templatetype == "PRINT"){
            if(!templatedata.output)
            {
                if(userdata.canCreateAssets)
                {
                    var name = "New%2fMedia";
                    if(linkid==undefined)
                        var url = '&clean#v4u/ajax/widgets/sf-handler.cshtml?closesfmodal=true&sftask=CreateTemporaryMedia&id='+templatedata.id+'&handler=print&name='+name+'&usedatasource='+templatedata.usedatasource + '&tpapp=sfdc';
                    
                    else
                        var url = install+'/?clean#v4u/ajax/widgets/sf-handler.cshtml?sftask=CreateTemporaryMedia&id='+templatedata.id+'&handler=print&name='+name+'&usedatasource='+templatedata.usedatasource + '&tpapp=sfdc';
                }
            }
            else if(userdata.canEditAssets)
            {
                
                templatedata["cansend"] = userdata.canSendAssets;
                templatedata["canorderprint"]= false;
                templatedata["canpublish"] = true;
                templatedata["canedit"] = userdata.canEditAssets;
                templatedata["linkids"] = "";
                templatedata["isSmartlist"] = "";
                templatedata["isMedia"] =  templatedata.output;
                var _templatedata = window.btoa((JSON.stringify(templatedata)));
                if(linkid==undefined)
                    var url = "&clean#assets?closesfmodal=true&function=showPrint&templatedata=" + _templatedata;
                else
                    var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=showPrint&templatedata=" + _templatedata;
            }
        }else if(templatedata.templatetype == "DATAROOM"){
            if(!templatedata.output)
            {
                if(userdata.canCreateAssets)
                {
                    var name = "Data%2fRoom%2fMedia";
                    if(linkid==undefined)
                        var url = '&clean#v4u/ajax/widgets/sf-handler.cshtml?closesfmodal=true&type=DATAROOM&sftask=CreateTemporaryMedia&id='+templatedata.id+'&handler=dataroom&name='+name+'&usedatasource='+templatedata.usedatasource + '&tpapp=sfdc';
                    
                    else
                        var url = install+'/?clean#v4u/ajax/widgets/sf-handler.cshtml?type=DATAROOM&sftask=CreateTemporaryMedia&id='+templatedata.id+'&handler=dataroom&name='+name+'&usedatasource='+templatedata.usedatasource + '&tpapp=sfdc';
                }
            }
            else if(userdata.canCreateAssets)
            {
                
                templatedata["canedit"] = true;
                templatedata["cansend"] = userdata.canSendAssets;
                templatedata["canpublish"]=userdata.canPublishAssets;
                templatedata["isMedia"]=templatedata.output;
                templatedata["isNeedApproval"]=templatedata.enablewatermark;
                templatedata["isApproved"]=templatedata.isapproved;
                var _templatedata = window.btoa((JSON.stringify(templatedata)));
                if(linkid==undefined)
                    var url = "&clean#assets?closesfmodal=true&function=showPlaybookMedia&templatedata=" + _templatedata+"&tpapp=sfdc";
                
                else
                    var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=showPlaybookMedia&templatedata=" + _templatedata+"&tpapp=sfdc";
            }
        }else if(templatedata.templatetype == "POWERPOINT"){
            var url = '';
            if (!templatedata.output)
            {
                if(userdata.canPresentationCreate)
                {
                    var name = "New Media";
                    if(linkid==undefined)
                        url = '&clean#v4u/ajax/widgets/sf-handler.cshtml?closesfmodal=true&type=POWERPOINT&sftask=CreateTemporaryMedia&id='+templatedata.id+'&name='+name+'&usedatasource='+templatedata.usedatasource + '&tpapp=sfdc';
                    
                    else
                        url = install+'/?clean#v4u/ajax/widgets/sf-handler.cshtml?type=POWERPOINT&sftask=CreateTemporaryMedia&id=' + templatedata.id + '&name=' + name + '&usedatasource=' + templatedata.usedatasource + '&tpapp=sfdc';
                }
            }
            else if(userdata.canPresentationCreate)
            {
                var _templatedata = window.btoa((JSON.stringify(templatedata)));
                if(linkid==undefined)
                    url = "&clean#assets?closesfmodal=true&function=showPresentationView&templatedata=" + _templatedata;
                
                else
                    url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=showPresentationView&templatedata=" + _templatedata;
            }
        }else if(templatedata.templatetype == "EBOOK"){
            templatedata["cansend"]= userdata.caneBookSend;
            templatedata["canpublish"]= userdata.caneBookPublish;
            templatedata["canedit"]= userdata.caneBookEdit;
            templatedata["customize"]=true;
            templatedata["linkids"]=linkid;
            templatedata["isSmartlist"]=null;
            templatedata["isContactcompany"]=null;
            templatedata["status"]=1;
            var _templatedata = window.btoa((JSON.stringify(templatedata)));
            if(linkid==undefined)
                var url = "&clean#assets?closesfmodal=true&function=showEbook&templatedata=" + _templatedata+"&tpapp=sfdc"; 
            else
                var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=showEbook&templatedata=" + _templatedata+"&tpapp=sfdc";
        }else if (templatedata.templatetype == "EMAIL"){
            if(userdata.canSendEmail){
                var _templatedata = window.btoa((JSON.stringify(templatedata)));
                if(linkid==undefined)
                    var url = "&clean#assets?closesfmodal=true&function=sendCustomizedEmail&templatedata=" + _templatedata+"&tpapp=sfdc";
                
                else
                    var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=sendCustomizedEmail&templatedata=" + _templatedata+"&tpapp=sfdc";
            }
        }else if(templatedata.templatetype == "WEB"){
            if(!templatedata.output){
                if (userdata.canWebCreate){
                    var name = "Web Media";
                    var _type = "WEB";
                    var flag6 = rec.flag6;
                    if(flag6 == true)
                        _type = "WEB";
                    else
                        _type = "LANDINGPAGE";
                    if(linkid==undefined)
                        var url = '&clean#v4u/ajax/widgets/sf-handler.cshtml?closesfmodal=true&type='+_type+'&sftask=CreateTemporaryMedia&id='+templatedata.id+'&handler=print&name='+name+'&usedatasource='+templatedata.usedatasource + '&tpapp=sfdc';
                    
                    else
                        var url = install+'/?clean#v4u/ajax/widgets/sf-handler.cshtml?type='+_type+'&sftask=CreateTemporaryMedia&id='+templatedata.id+'&handler=print&name='+name+'&usedatasource='+templatedata.usedatasource + '&tpapp=sfdc';
                }
            }else{
                if(userdata.canWebEdit){
                    if(templatedata.status == 2){
                        templatedata["webeditor"]="Landing Page Editor"; ;
                        templatedata["customizewebsite"]="Customize Landing Page Media";
                        var _templatedata = window.btoa((JSON.stringify(templatedata)));
                        if(linkid==undefined)
                            var url = "&clean#assets?closesfmodal=true&function=showEditLandingpageWizard&templatedata=" + _templatedata+"&tpapp=sfdc";
                        
                        else
                            var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=showEditLandingpageWizard&templatedata=" + _templatedata+"&tpapp=sfdc";
                    }else{
                        templatedata["cansend"] = userdata.canWebSend;
                        templatedata["canpublish"] = userdata.canWebPublish;
                        templatedata["canedit"] = userdata.canWebEdit;
                        templatedata["customize"] = true;
                        templatedata["isNeedApproval"] =templatedata.enablewatermark;
                        templatedata["isApproved"]=templatedata.isapproved;
                        templatedata["canPartnerSend"]=userdata.canPartnerSend;
                        if(templatedata.output){
                            var _templatedata = window.btoa((JSON.stringify(templatedata)));
                            if(linkid==undefined)
                                var url = "&clean#assets?closesfmodal=true&function=showEditLandingpageWizard&templatedata=" + _templatedata+"&tpapp=sfdc";
                            
                            else
                                var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=showLandingpageMedia&templatedata=" + _templatedata+"&tpapp=sfdc";
                        }else{
                            alert("you don't have permission to view this template");
                        }  
                    }
                }
            }
        }
            else if(templatedata.templatetype == "CONTRACT"){
                if (!templatedata.output) {
                    if(userdata.canSendAssets && userdata.canCreateAssets){
                        var _templatedata = window.btoa((JSON.stringify(templatedata)));
                        if(linkid==undefined)
                            var url = "&clean#assets?closesfmodal=true&function=onCustomizeSuccessContract&templatedata=" + _templatedata+"&tpapp=sfdc";     
                        
                        else
                            var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=onCustomizeSuccessContract&templatedata=" + _templatedata+"&tpapp=sfdc";     
                    }
                }else {
                    if(userdata.canEditAssets){
                        if(templatedata.status == 2){
                            templatedata["ispartner"] = 1;
                            var _templatedata = window.btoa((JSON.stringify(templatedata)));
                            if(linkid==undefined)
                                var url = "&clean#assets?closesfmodal=true&function=showEditContractWizard&templatedata=" + _templatedata+"&tpapp=sfdc";
                            
                            else
                                var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=showEditContractWizard&templatedata=" + _templatedata+"&tpapp=sfdc";
                        }else{
                            
                            templatedata["cansend"] = userdata.canSendAssets;
                            templatedata["canorderprint"] = userdata.canorderprint;
                            templatedata["canpublish"] = userdata.canPublishAssets ;
                            templatedata["canedit"] = userdata.canEditAssets;
                            templatedata["linkids"] = linkid;
                            templatedata["isSmartlist"] = null;
                            templatedata["isMedia"] = templatedata.output;
                            var _templatedata = window.btoa((JSON.stringify(templatedata)));
                            if(linkid==undefined)
                                var url = "&clean#assets?closesfmodal=true&function=showPrint&templatedata=" + _templatedata+"&tpapp=sfdc";
                            
                            else
                                var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=showPrint&templatedata=" + _templatedata+"&tpapp=sfdc";
                        }
                    }
                }
            }
                else if(templatedata.templatetype == "WEBBANNER"){
                    if (!templatedata.output) {
                        if (userdata.canCreateWeb){ 
                            var _templatedata = window.btoa((JSON.stringify(templatedata)));
                            if(linkid==undefined)
                                var url = "&clean#assets?closesfmodal=true&function=onCustomizeSuccessWebBanner&templatedata=" + _templatedata+"&tpapp=sfdc";
                            
                            else
                                var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=onCustomizeSuccessWebBanner&templatedata=" + _templatedata+"&tpapp=sfdc";
                        } 
                    }else{
                        if (userdata.canEditWeb){ 
                            if (templatedata.status == 2) {
                                templatedata["info"] = "Info";
                                templatedata["question"] = "Questions";
                                templatedata["webeditor"] = "Web Banner Editor";
                                templatedata["assetpicker"] = "Asset Picker";
                                templatedata["customizewebsite"] = "Customize Web Banner Media";
                                var _templatedata = window.btoa((JSON.stringify(templatedata)));
                                if(linkid==undefined)
                                    var url = "&clean#assets?closesfmodal=true&function=showEditWebBannerWizard&templatedata=" + _templatedata+"&tpapp=sfdc";
                                
                                else
                                    var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=showEditWebBannerWizard&templatedata=" + _templatedata+"&tpapp=sfdc";
                            }else{
                                templatedata["cansend"] = userdata.canWebSend;
                                templatedata["canpublish"] = userdata.canWebPublish;
                                templatedata["canedit"] = userdata.canEditWeb;
                                templatedata["customize"] = true;
                                templatedata["contactids"] = linkid;
                                templatedata["isNeedApproval"] = templatedata.enablewatermark;
                                templatedata["isApproved"] = templatedata.isapproved;
                                templatedata["canPartnerSend"] = userdata.canPartnerSend;
                                if (templatedata.output) {
                                    var _templatedata = window.btoa((JSON.stringify(templatedata)));
                                    if(linkid==undefined)
                                        var url = "&clean#assets?closesfmodal=true&function=showWebBannerMedia&templatedata=" + _templatedata+"&tpapp=sfdc";
                                    
                                    else
                                        var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=showWebBannerMedia&templatedata=" + _templatedata+"&tpapp=sfdc";
                                    
                                }
                                else {
                                    alert("you do not have permission to customize");
                                }
                            }
                        }
                    }
                }
        if(linkid == undefined){
            if(url != undefined){
                var cmpEvent = component.getEvent("viewModalActionEvent");
                cmpEvent.setParams({
                    "actionUrl" : url
                }); 
                cmpEvent.fire(); 
            }
        }else{
            if(url != undefined)
                helper.showEnablement(helper,component,url);
        }
    },
    SendToUsers : function(component,event,helper){
        var userdata = component.get("v.permission");   
        var install = component.get("v.install");
        var index = $(event.currentTarget).attr("data-action");
        var _item = component.get("v.itemss");
        var rec =_item[index] ;
        var linkid = rec.linkid;     	
        var templatedata = rec.metadata;
        var id = templatedata.id;
        var sourcetype=component.get("v.sourceType");
        var projecttypeid = component.get("v.projectTypeId");  
        if(templatedata.templatetype == "POWERPOINT") { 
            if(userdata.canPowerPointsend) {
                templatedata["linkids"]=linkid;
                templatedata["issmartlist"]=null;
                templatedata["isUserGrid"]=true;
                if( templatedata.output == 1 || (templatedata.usedatasource != 1 && templatedata.hasquestionnaire == false))
                {
                    var _templatedata = window.btoa(JSON.stringify(templatedata));
                    if(linkid==undefined)
                        var url = "&clean#assets?closesfmodal=true&function=sendUserToPartner&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                    
                    else
                        var url = install+"?clean#assets?closesfmodal=true&function=sendUserToPartner&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                }
            }
        }
        else if (templatedata.templatetype == "DATAROOM" || templatedata.templatetype == 36864){
            templatedata["linkids"]=linkid;
            templatedata["issmartlist"]=null;
            templatedata["iscontactcompany"]=null;
            templatedata["isusergrid"]=false;
            templatedata["templatetype"]=36864;
            if (userdata.canPlayBookSend) {
                if(templatedata.output || !templatedata.output && templatedata.usedatasource != 1 && !templatedata.hasquestionnaire){
                    var _templatedata = window.btoa(JSON.stringify(templatedata));
                    if(linkid==undefined)
                        var url = "&clean#assets?closesfmodal=true&function=sendPartnerAssetsEmailPrint&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                    
                    else
                        var url = install+"?clean#assets?closesfmodal=true&function=sendPartnerAssetsEmailPrint&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                } 
            }
        }
            else if(templatedata.templatetype == "PRINT" ){
            templatedata["linkids"]=null;
            templatedata["issmartlist"]=null;
            templatedata["iscontactcompany"]=null;
            templatedata["isusergrid"]=false;
            if (userdata.canSendPrint) {
                var _templatedata = window.btoa(JSON.stringify(templatedata));
                if(linkid==undefined)
                    var url = "&clean#assets?closesfmodal=true&function=sendPartnerAssetsEmailPrint&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                
                else
                    var url = install+"?clean#assets?closesfmodal=true&function=sendPartnerAssetsEmailPrint&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
            }
        }
                else if(templatedata.templatetype == "EMAIL"){
            templatedata["linkids"]=null;
            templatedata["issmartlist"]=null;
            templatedata["isusergrid"]=false;
            if(userdata.canEmailSend){
                var _templatedata = window.btoa(JSON.stringify(templatedata));
                if(linkid==undefined)
                    var url = "&clean#assets?closesfmodal=true&function=showEmailPartnerSend&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                
                else
                    var url = install+"?clean#assets?closesfmodal=true&function=showEmailPartnerSend&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
            }
        }
                    else if(templatedata.filetype == "JPEG" || templatedata.filetype == "PNG"){
            templatedata["linkids"]=null;
            templatedata["issmartlist"]=null;
            templatedata["iscontactcompany"]=null;
            templatedata["isusergrid"]=false;
            templatedata["templatetype"]=1048576;
            templatedata["id"]=linkid;
            var _templatedata = window.btoa(JSON.stringify(templatedata));
            if(linkid==undefined)
                var url = "&clean#assets?closesfmodal=true&function=sendPartnerAssetsEmail&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
            
            else
                var url = install+"?clean#assets?closesfmodal=true&function=sendPartnerAssetsEmail&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
        }
                        else if(templatedata.filetype == "VIDEO"){
            templatedata["linkids"]=null;
            templatedata["issmartlist"]=null;
            templatedata["iscontactcompany"]=null;
            templatedata["isusergrid"]=false;
            templatedata["templatetype"]=8388608;
            templatedata["id"]=linkid;
            var _templatedata = window.btoa(JSON.stringify(templatedata));
            if(linkid==undefined)
                var url = "&clean#assets?closesfmodal=true&function=sendPartnerAssetsEmail&templatedata=" + _templatedata+"&tpapp=sfdc";
            
            else
                var url = install+"?clean#assets?closesfmodal=true&function=sendPartnerAssetsEmail&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
        }
                            else if(templatedata.filetype == 'TXT'|| templatedata.filetype == 'PPT' || templatedata.filetype == 'XLS' || templatedata.filetype == 'CSV' ||
                 templatedata.filetype == 'STEP'||  templatedata.filetype == 'PPTX' || templatedata.filetype == 'PDF'  ||
                 templatedata.filetype == 'DOC' || templatedata.filetype == 'DOCX' || templatedata.filetype == 'XLSX' 
                 || templatedata.filetype == 'CSS'  || templatedata.filetype == 'XML'  || templatedata.filetype == 'ZIP' || 
                 templatedata.filetype == 'ZIPX'  || templatedata.filetype == 'RAR'  || templatedata.filetype == '7Z' || templatedata.filetype == 'S7Z'
                 || templatedata.filetype == 'CFS'  || templatedata.filetype == 'ICS'  || templatedata.filetype == 'VCS'  || templatedata.filetype == 'DWG'
                 || templatedata.filetype == 'STP' || templatedata.filetype == 'TEXT' || templatedata.filetype == 'DOCUMENT'){
            templatedata["linkids"]=null;
            templatedata["issmartlist"]=null;
            templatedata["iscontactcompany"]=null;
            templatedata["isusergrid"]=false;
            templatedata["templatetype"]=2097152;
            templatedata["id"]=linkid;
            var _templatedata = window.btoa(JSON.stringify(templatedata));
            if(linkid==undefined)
                var url = "&clean#assets?closesfmodal=true&function=sendPartnerAssetsEmail&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
            
            else
                var url = install+"?clean#assets?closesfmodal=true&function=sendPartnerAssetsEmail&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
        }
            else if(templatedata.templatetype == "CONTRACT"){ 
                templatedata["linkids"]=linkid;
                templatedata["issmartlist"]=null;
                if (templatedata.output) {
                    templatedata["sendcontract"] = "SendContract";
                    templatedata["save"] = "Save";
                    templatedata["ispartner"] = 3 ;
                    var _templatedata = window.btoa(JSON.stringify(templatedata));
                    if(linkid==undefined)
                        var url = "&clean#assets?closesfmodal=true&function=sendContract&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                    
                    else
                        var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=sendContract&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                }
                else if(!templatedata.output && templatedata.usedatasource != 1 && !templatedata.hasquestionnaire ){
                    if(userdata.canSendAssets){
                        templatedata["ispartner"] = 3 ;
                        var _templatedata = window.btoa(JSON.stringify(templatedata));
                        if(linkid==undefined)
                            var url = "&clean#assets?closesfmodal=true&function=sendContractMedia&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                        
                        else
                            var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=sendContractMedia&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                    }
                }
            }
                else if(templatedata.templatetype == "WEBBANNER") {
                    templatedata["linkids"]=linkid;
                    templatedata["issmartlist"]=null;
                    if (templatedata.output){
                        var _templatedata = window.btoa(JSON.stringify(templatedata));
                        if(linkid==undefined)
                            var url = "&clean#assets?closesfmodal=true&function=sendWebBannerToPartner&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                        
                        else
                            var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=sendWebBannerToPartner&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                    }       
                    else {
                        alert('you do not have the permission to send');
                    }
                }  
                    else if(templatedata.templatetype == "EBOOK") {
                        templatedata["linkids"]=linkid;
                        templatedata["issmartlist"]=null;
                        var _templatedata = window.btoa(JSON.stringify(templatedata));
                        if(linkid==undefined)
                            var url = "&clean#assets?closesfmodal=true&function=sendEbookToPartner&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                        
                        else
                            var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=sendEbookToPartner&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                    }  
                        else if(templatedata.templatetype == "FAQ"){
                        	templatedata["id"] = id;
                            templatedata["linkids"] = linkid;
                            templatedata["isSmartlist"] = null;
                            var _templatedata = window.btoa((JSON.stringify(templatedata))); 
                            var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=sendFAQToPartner&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                        }
        if(linkid == undefined){
            if(url != undefined){
                var cmpEvent = component.getEvent("viewModalActionEvent");
                cmpEvent.setParams({
                    "actionUrl" : url
                }); 
                cmpEvent.fire();
            }
        }else{
            if(url != undefined)
                helper.showEnablement(helper,component,url);
        }
    },
    copy : function(component,event,helper){
        var userdata = component.get("v.permission");   
        var install = component.get("v.install");
        var index = $(event.currentTarget).attr("data-action");
        var _item = component.get("v.itemss");
        var rec =_item[index] ;
        var linkid = rec.linkid;     	
        var templatedata = rec;
        var _templatedata = window.btoa(JSON.stringify(templatedata));
        if(linkid==undefined){
            if(component.get('v.isPopUP'))
                var url = '&clean#v4u/ajax/widgets/sf-handler.cshtml?closesfmodal=true&sftask=CopyExternalLink&templateData='+_templatedata+'&tpapp=sfdc';
            
            else
                var url = install+'/?clean#v4u/ajax/widgets/sf-handler.cshtml?sftask=CopyExternalLink&templateData='+_templatedata+'&tpapp=sfdc';
        }
        if(component.get("v.isPopUp")){
            if(linkid == undefined){
                var cmpEvent = component.getEvent("viewModalActionEvent");
                cmpEvent.setParams({
                    "actionUrl" : url
                }); 
                cmpEvent.fire(); 
            }
        }else{
            helper.showEnablement(helper,component,url);
        }
    },   
    publish : function(component,event,helper){
        var install = component.get("v.install");
        var index = $(event.currentTarget).attr("data-action");
        var _item = component.get("v.itemss");
        var rec =_item[index] ;
        var linkid = rec.linkid;
        var templatedata = rec.metadata;
        var ShowPublish=false;
        if(templatedata.output)
            ShowPublish=true;
        else if(!templatedata.output && !templatedata.usedatasource && !templatedata.hasquestionnaire)
            ShowPublish=true;
        if(templatedata.templatetype == "undefined" || templatedata.templatetype == undefined){
            if(templatedata.filetype == "VIDEO"||(templatedata.filetype == "JPEG" || templatedata.filetype == "PNG")||(templatedata.filetype == 'TXT'|| templatedata.filetype == 'PPT' || templatedata.filetype == 'XLS' || templatedata.filetype == 'CSV' ||
                 templatedata.filetype == 'STEP'||  templatedata.filetype == 'PPTX' || templatedata.filetype == 'PDF'  ||
                 templatedata.filetype == 'DOC' || templatedata.filetype == 'DOCX' || templatedata.filetype == 'XLSX' 
                 || templatedata.filetype == 'CSS'  || templatedata.filetype == 'XML'  || templatedata.filetype == 'ZIP' || 
                 templatedata.filetype == 'ZIPX'  || templatedata.filetype == 'RAR'  || templatedata.filetype == '7Z' || templatedata.filetype == 'S7Z'
                 || templatedata.filetype == 'CFS'  || templatedata.filetype == 'ICS'  || templatedata.filetype == 'VCS'  || templatedata.filetype == 'DWG'
                 || templatedata.filetype == 'STP' || templatedata.filetype == 'TEXT' || templatedata.filetype == 'DOCUMENT')){
                templatedata["id"]=linkid;}
            var _templatedata = window.btoa(JSON.stringify(templatedata));
            if(linkid==undefined)
                var url = "&clean#assets?closesfmodal=true&function=showPublishFile&templatedata=" + _templatedata+"&tpapp=sfdc";
            else
                var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=showPublishFile&templatedata=" + _templatedata+"&tpapp=sfdc";
        }else{
            if(templatedata.filetype == "VIDEO"||(templatedata.filetype == "JPEG" || templatedata.filetype == "PNG")||(templatedata.filetype == 'TXT'|| templatedata.filetype == 'PPT' || templatedata.filetype == 'XLS' || templatedata.filetype == 'CSV' ||
                 templatedata.filetype == 'STEP'||  templatedata.filetype == 'PPTX' || templatedata.filetype == 'PDF'  ||
                 templatedata.filetype == 'DOC' || templatedata.filetype == 'DOCX' || templatedata.filetype == 'XLSX' 
                 || templatedata.filetype == 'CSS'  || templatedata.filetype == 'XML'  || templatedata.filetype == 'ZIP' || 
                 templatedata.filetype == 'ZIPX'  || templatedata.filetype == 'RAR'  || templatedata.filetype == '7Z' || templatedata.filetype == 'S7Z'
                 || templatedata.filetype == 'CFS'  || templatedata.filetype == 'ICS'  || templatedata.filetype == 'VCS'  || templatedata.filetype == 'DWG'
                 || templatedata.filetype == 'STP' || templatedata.filetype == 'TEXT' || templatedata.filetype == 'DOCUMENT')){
                templatedata["id"]=linkid;}
            var _templatedata = window.btoa(JSON.stringify(templatedata));
            if(linkid==undefined)
                var url = "&clean#assets?closesfmodal=true&function=showPublishMedia&templatedata=" + _templatedata+"&tpapp=sfdc";                                                
            
            else
                var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=showPublishMedia&templatedata=" + _templatedata+"&tpapp=sfdc";                                                
        }
        if(linkid == undefined){
            var cmpEvent = component.getEvent("viewModalActionEvent");
            cmpEvent.setParams({
                "actionUrl" : url
            }); 
            cmpEvent.fire(); 
        }else{
            helper.showEnablement(helper,component,url);
        }   
    },
    ebook : function(component,event,helper){
        var userdata = component.get("v.permission");
        var install = component.get("v.install");
        var index = $(event.currentTarget).attr("data-action");
        var _item = component.get("v.itemss");
        var rec =_item[index] ;
        if(userdata.canPreviewAssets)
        {
            var templatedata = rec.metadata;
            if(rec.linkid ==undefined)
                var url = '&clean#v4u/ajax/widgets/sf-handler.cshtml?closesfmodal=true&sftask=ConvertToEbook&id='+templatedata.id+'&tpapp=sfdc';
            
            else
                var url = install+'/?clean#v4u/ajax/widgets/sf-handler.cshtml?sftask=ConvertToEbook&id='+templatedata.id+'&tpapp=sfdc';
            if(rec.linkid == undefined){
                var cmpEvent = component.getEvent("viewModalActionEvent");
                cmpEvent.setParams({
                    "actionUrl" : url
                }); 
                cmpEvent.fire(); 
            }else{
                helper.showEnablement(helper,component,url);
                helper.dropup(component,event,helper);
            }
        } 
    },
    download : function(component,event,helper){
        var install = component.get("v.install");
        var index = $(event.currentTarget).attr("data-action");
        var _item = component.get("v.itemss");
        var rec =_item[index] ;
        var templatedata = rec.metadata;
        if(templatedata.templatetype == "POWERPOINT"){
            if(templatedata.output == 1 || (templatedata.usedatasource != 1 && templatedata.hasquestionnaire == false))
            {
                window.location = templatedata.downloadurl;
            }  
        }else if(templatedata.templatetype == undefined){
            if (templatedata.output == 1) { //document
                window.location = templatedata.fileurl+ "?isdownload=1";
            } else if (templatedata.output == 0) {//image
                window.location = templatedata.downloadurl+ "?isdownload=1";
            }
        }
        else if(templatedata.templatetype == "PRINT")
                {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title : 'Info Message',
                        message: 'The download take time',
                        duration:' 100',
                        key: 'info_alt',
                        type: 'info',
                        mode: 'dismissible'
                    });
                    toastEvent.fire();
                    var act = component.get("c.downloadAPI");
                    act.setParams({
                        "tid":templatedata.id,
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
                  
                }
               
            else if(templatedata.templatetype == "EMAIL"){
                var _templatedata = window.btoa((JSON.stringify(templatedata)));
                if(rec.linkid==undefined)
                    var url = "&clean#assets?closesfmodal=true&function=showDownloadHtml&templatedata=" + _templatedata+"&tpapp=sfdc";
                
                else
                    var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=showDownloadHtml&templatedata=" + _templatedata+"&tpapp=sfdc";
                if(rec.linkid == undefined){
                    var cmpEvent = component.getEvent("viewModalActionEvent");
                    cmpEvent.setParams({
                        "actionUrl" : url
                    }); 
                    cmpEvent.fire(); 
                }else{
                    helper.showEnablement(helper,component,url);
                }
            }
               /* else if(templatedata.filetype == "JPEG" || templatedata.filetype == "PNG"){
                   window.location = templatedata.downloadurl;
                }
                    else if(templatedata.filetype == 'TXT'|| templatedata.filetype == 'PPT' || templatedata.filetype == 'XLS' || templatedata.filetype == 'CSV' ||
                            templatedata.filetype == 'STEP'||  templatedata.filetype == 'PPTX' || templatedata.filetype == 'PDF'  ||
                            templatedata.filetype == 'DOC' || templatedata.filetype == 'DOCX' || templatedata.filetype == 'XLSX' 
                            || templatedata.filetype == 'CSS'  || templatedata.filetype == 'XML'  || templatedata.filetype == 'ZIP' || 
                            templatedata.filetype == 'ZIPX'  || templatedata.filetype == 'RAR'  || templatedata.filetype == '7Z' || templatedata.filetype == 'S7Z'
                            || templatedata.filetype == 'CFS'  || templatedata.filetype == 'ICS'  || templatedata.filetype == 'VCS'  || templatedata.filetype == 'DWG'
                            || templatedata.filetype == 'STP' || templatedata.filetype == 'TEXT' || templatedata.filetype == 'DOCUMENT'){
                        window.location = templatedata.fileurl;
                    }*/
    },
    preview : function(component,event,helper){
        var index = $(event.currentTarget).attr("data-action");
        var _item = component.get("v.itemss");
        var rec =_item[index] ;
        var linkid = rec.linkid;
        var install = component.get("v.install");
        var url = rec.nameurl;
        if(linkid == undefined){
            var cmpEvent = component.getEvent("viewModalActionEvent");
            cmpEvent.setParams({
                "actionUrl" : url
            }); 
            cmpEvent.fire(); 
        }else{
            helper.showEnablement(helper,component,url);
        }
    },
    view : function(component,event,helper){
        var userdata = component.get("v.permission");
        var install = component.get("v.install");
        var index = $(event.currentTarget).attr("data-action");
        var _item = component.get("v.itemss");
        var rec =_item[index] ;
        var linkid = rec.linkid;
        var templatedata = rec.metadata;
        if(templatedata == "undefined" || templatedata == undefined ){
            if(rec.trackinglink == true){
                if(userdata.canExternalLinkSend){
                    var url = rec.fileurl;
                }
            }
        }
        else if(templatedata.filetype == "JPEG" ||templatedata.filetype == "PNG"){
            var external_url = templatedata.url;
            if (external_url != undefined && external_url.indexOf('googledrive') > -1) {
                if (templatedata.output == 0) { //Image
                    var url = templatedata.fileurl;
                }
            }
            else {
                var url =templatedata.fileurl;
            }
        }
            else if(templatedata.templatetype == "POWERPOINT" ){                  
                templatedata["linkids"] = linkid;
                var _templatedata = window.btoa((JSON.stringify(templatedata)));
                if(linkid==undefined)
                    var url="/ppt/"+templatedata.templatekey+"/"+templatedata.userkey;
                else
                    var url = install+"/ppt/"+templatedata.templatekey+"/"+templatedata.userkey;
            }else if(templatedata.filetype == "VIDEO"){
                var url =templatedata.originalurl;
            }else if (templatedata.templatetype == "EMAIL"){
                if(userdata.canEmailSend){
                    if(templatedata.output){
                        templatedata["report"] = "Report"; 
                        templatedata["sent"] = "SENT";
                        var _templatedata = window.btoa((JSON.stringify(templatedata)));
                        if(linkid==undefined)
                            var url = "&clean#assets?closesfmodal=true&function=showEmailReport&templatedata=" + _templatedata+"&tpapp=sfdc";
                        
                        else
                            var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=showEmailReport&templatedata=" + _templatedata+"&tpapp=sfdc";
                    }
                    else{
                        templatedata["canEmailSend"] = userdata.canEmailSend;
                        var _templatedata = window.btoa((JSON.stringify(templatedata)));
                        if(linkid==undefined)
                            var url = "&clean#assets?closesfmodal=true&function=sendEmailView&templatedata=" + _templatedata+"&tpapp=sfdc";
                        
                        else
                            var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=sendEmailView&templatedata=" + _templatedata+"&tpapp=sfdc";
                    }
                }
            }else if (templatedata.templatetype == "DATAROOM"||templatedata.templatetype == 36864){
                templatedata["customize"] = false;
                templatedata["cansend"] = userdata.canPlayBookSend;
                templatedata["canpublish"] = userdata.canPlayBookPublish;
                templatedata["canedit"] = userdata.canPlayBookEdit;
                templatedata["linkids"] = linkid;
                templatedata["isSmartlist"] = null;
                if(templatedata.output){
                    if(templatedata.status==2){
                        var _templatedata = window.btoa((JSON.stringify(templatedata)));
                        if(linkid==undefined)
                            var url = "&clean#assets?closesfmodal=true&function=showEditPlaybookWizard&templatedata=" + _templatedata+"&tpapp=sfdc";
                        
                        else
                            var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=showEditPlaybookWizard&templatedata=" + _templatedata+"&tpapp=sfdc";
                    }
                    else
                    {var _templatedata = window.btoa((JSON.stringify(templatedata)));
                     if(linkid==undefined)
                         var url = "&clean#assets?closesfmodal=true&function=showPlaybookMedia&templatedata=" + _templatedata+"&tpapp=sfdc";
                     
                     else
                         var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=showPlaybookMedia&templatedata=" + _templatedata+"&tpapp=sfdc";}
                }
                else if (!templatedata.output && templatedata.usedatasource!=1 && !templatedata.hasquestionnaire){
                    var _templatedata = window.btoa((JSON.stringify(templatedata)));
                    if(linkid==undefined)
                        var url = "&clean#assets?closesfmodal=true&function=showPlaybookMedia&templatedata=" + _templatedata+"&tpapp=sfdc";                           
                    
                    else
                        var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=showPlaybookMedia&templatedata=" + _templatedata+"&tpapp=sfdc";                           
                }
            } 
                else if(templatedata.filetype == 'TEXT'|| templatedata.filetype == 'PPT' || templatedata.filetype == 'XLS' || templatedata.filetype == 'CSV' ||
                        templatedata.filetype == 'STEP'||  templatedata.filetype == 'PPTX' || templatedata.filetype == 'PDF'  ||
                        templatedata.filetype == 'DOC' || templatedata.filetype == 'DOCX' || templatedata.filetype == 'XLSX' 
                        || templatedata.filetype == 'CSS'  || templatedata.filetype == 'XML'  || templatedata.filetype == 'ZIP' || 
                        templatedata.filetype == 'ZIPX'  || templatedata.filetype == 'RAR'  || templatedata.filetype == '7Z' || templatedata.filetype == 'S7Z'
                        || templatedata.filetype == 'CFS'  || templatedata.filetype == 'ICS'  || templatedata.filetype == 'VCS'  || templatedata.filetype == 'DWG'
                        || templatedata.filetype == 'STP'||templatedata.filetype=='DOCUMENT' ){
                    var external_url = templatedata.url;
                    if(external_url != undefined && external_url.indexOf('googledrive') > -1) {
                        if (templatedata.output == 1) { //document
                            var url = templatedata.fileurl;
                        }
                    }
                    else {
                        var url = templatedata.fileurl;
                    }  
                }else if(templatedata.templatetype == "EBOOK"){
                    var _templatedata = window.btoa((JSON.stringify(templatedata)));
                    if(linkid==undefined)
                        var url = "&clean#assets?closesfmodal=true&function=showAssetsTemplate&templatedata=" + _templatedata+"&tpapp=sfdc";
                    
                    else
                        var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=showAssetsTemplate&templatedata=" + _templatedata+"&tpapp=sfdc";
                }else if(templatedata.templatetype == "INTERNALPLAYBOOK"){
                    var sourcetype=component.get("v.sourceType");
                    var projecttypeid = component.get("v.projectTypeId"); 
                    if(component.get("v.sourceType") == "opportunity"){
                        if(rec.flag10 == 9)
                            url = install+"?clean#linearinternalplaybook/"+templatedata.id+"?contactid="+linkid;
                        else
                        url = install+"?clean#internalplaybook/"+templatedata.id+"?projecttypeid="+projecttypeid+"&projectid="+linkid;
                    }else
                        if(linkid==undefined)
                            url="&clean#internalplaybook/"+templatedata.id;
                        else{
                            if(rec.flag10 == 9)
                            url = install+"?clean#linearinternalplaybook/"+templatedata.id+"?contactid="+linkid;
                            else
                             url = install+"?clean#internalplaybook/"+templatedata.id+"?contactid="+linkid;   
                        }
                }else if(templatedata.templatetype == "BLOGPOST"){
                    var url = install+"/auto2/"+templatedata.templatekey+"/"+rec.encrepteduserid;
                }
                    else  if(templatedata.templatetype == "PRINT"){
                        
                        templatedata["cansend"] = userdata.canSendAssets;
                        templatedata["canedit"] = userdata.canEditAssets;
                        templatedata["linkids"] = linkid;
                        templatedata["isSmartlist"] = null;
                        if (templatedata.output) {
                            if (templatedata.status != 2)
                                if(linkid==undefined)
                                    var url = "&clean#assets?closesfmodal=true&function=showPrint&templatedata=" + _templatedata+"&tpapp=sfdc"; 
                            
                                else
                                    var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=showPrint&templatedata=" + _templatedata+"&tpapp=sfdc"; 
                            else{
                                // modal.showEditPrintWizard(data);
                                if(linkid==undefined)
                                    var url = "&clean#assets?closesfmodal=true&function=showEditPrintWizard&templatedata=" + _templatedata+"&tpapp=sfdc"; 
                                
                                else
                                    var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=showEditPrintWizard&templatedata=" + _templatedata+"&tpapp=sfdc"; 
                            }
                        }
                        else if (!templatedata.output && !templatedata.usedatasource && !templatedata.hasquestionnaire)
                        {
                            
                            var _templatedata = window.btoa((JSON.stringify(templatedata)));
                            if(linkid==undefined)
                                var url = "&clean#assets?closesfmodal=true&function=showPrint&templatedata=" + _templatedata+"&tpapp=sfdc";            
                            
                            else
                                var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=showPrint&templatedata=" + _templatedata+"&tpapp=sfdc";            
                        }
                            else
                                if(linkid==undefined)
                                    var url = "&clean#assets?closesfmodal=true&function=showEditPrintWizard&templatedata=" + _templatedata+"&tpapp=sfdc";
                        
                                else
                                    var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=showEditPrintWizard&templatedata=" + _templatedata+"&tpapp=sfdc";
                    }
						else if(templatedata.templatetype == "FAQ"){
                        	templatedata["reports"] = true;
                            templatedata["cansend"] = userdata.canSend;
                            templatedata["canpublish"] = userdata.canPublishAssets ;
                            templatedata["canedit"] = userdata.canEditAssets;
                            templatedata["linkids"] = linkid;
                            templatedata["isSmartlist"] = null;
                        	templatedata["customize"] = false;
                        	templatedata["canPartnerSend"] = userdata.canPartnerSend;
                            var _templatedata = window.btoa((JSON.stringify(templatedata))); 
                            var url = install+"?elt="+helper.eltandeln+"&clean#assets?closesfmodal=true&function=viewFAQ&templatedata=" + _templatedata+"&sourcetype="+sourcetype+"&projecttypeid="+projecttypeid+"&tpapp=sfdc";
                        }
        if(component.get("v.isPopUp")){
            if(linkid == undefined){
                if(url != undefined){
                    var cmpEvent = component.getEvent("viewModalActionEvent");
                    cmpEvent.setParams({
                        "actionUrl" : url
                    }); 
                    cmpEvent.fire(); 
                }
            }
        }else{ 
            if(url != undefined)
                helper.showEnablement(helper,component,url);
        }
    },
    PrintVendor : function(component,event,helper){
        var userdata = component.get("v.permission"); 
        var install = component.get("v.install");
        var index = $(event.currentTarget).attr("data-action");
        var _item = component.get("v.itemss");
        var rec =_item[index] ;
        var linkid = rec.linkid;
        var templatedata = rec.metadata;
        if(userdata.canOrderPrint){
            templatedata["linkid"]=templatedata.linkid;
            var _templatedata = window.btoa(JSON.stringify(templatedata));
            if(linkid==undefined)
                var url = "&clean#assets?closesfmodal=true&function=printVendor&templatedata=" + _templatedata+"&tpapp=sfdc";
            else
                var url = install+"?clean#assets?closesfmodal=true&function=printVendor&templatedata=" + _templatedata+"&tpapp=sfdc";
            if(linkid == undefined){
                var cmpEvent = component.getEvent("viewModalActionEvent");
                cmpEvent.setParams({
                    "actionUrl" : url
                }); 
                cmpEvent.fire(); 
            }else{
                helper.showEnablement(helper,component,url);
            }
        }
    },
    report : function(component,event,helper){
        var install = component.get("v.install");
        var index = $(event.currentTarget).attr("data-action");
        var _item = component.get("v.itemss");
        var rec =_item[index] ;
        var linkid = rec.linkid;
        var templatedata = rec.metadata;
        if(templatedata.templatetype == "POWERPOINT"){
            var _templatedata = window.btoa(JSON.stringify(templatedata));
            if(linkid==undefined)
                var url = "&clean#assets?closesfmodal=true&function=ShowPresentationReport&templatedata=" + _templatedata+"&tpapp=sfdc";
            
            else
                var url = install+"?clean#assets?closesfmodal=true&function=ShowPresentationReport&templatedata=" + _templatedata+"&tpapp=sfdc";
        }else if(templatedata.templatetype == "INTERNALPLAYBOOK"){
            var _templatedata = window.btoa(JSON.stringify(templatedata));
            if(linkid==undefined)
                var url = "&clean#assets?closesfmodal=true&function=showReportForInternalPlaybook&templatedata=" + _templatedata+"&tpapp=sfdc";          
            
            else
                var url = install+"?clean#assets?closesfmodal=true&function=showReportForInternalPlaybook&templatedata=" + _templatedata+"&tpapp=sfdc";          
        }else if(templatedata.templatetype == "DATAROOM"){
            var _templatedata = window.btoa(JSON.stringify(templatedata));
            if(linkid==undefined)
                var url = "&clean#assets?closesfmodal=true&function=showPlaybookReport&templatedata=" + _templatedata+"&tpapp=sfdc";
            
            else
                var url = install+"?clean#assets?closesfmodal=true&function=showPlaybookReport&templatedata=" + _templatedata+"&tpapp=sfdc";
        }else if(templatedata.templatetype == "WEB"){
            templatedata["currentuser"]=true;
            var _templatedata = window.btoa(JSON.stringify(templatedata));
            if(linkid==undefined)
                var url = "&clean#assets?closesfmodal=true&function=showWebReport&templatedata=" + _templatedata+"&tpapp=sfdc";
            
            else
                var url = install+"?clean#assets?closesfmodal=true&function=showWebReport&templatedata=" + _templatedata+"&tpapp=sfdc";
        }else if(templatedata.templatetype == "EBOOK"){
            var _templatedata = window.btoa(JSON.stringify(templatedata));
            if(linkid==undefined)
                var url = "&clean#assets?closesfmodal=true&function=CheckForEbookReport&templatedata=" + _templatedata+"&tpapp=sfdc";
            
            else
                var url = install+"?clean#assets?closesfmodal=true&function=CheckForEbookReport&templatedata=" + _templatedata+"&tpapp=sfdc";
        }                           
        if(linkid == undefined){
            if(url != undefined){
                var cmpEvent = component.getEvent("viewModalActionEvent");
                cmpEvent.setParams({
                    "actionUrl" : url
                }); 
                cmpEvent.fire();
            }
        }else{
            if(url != undefined)
                helper.showEnablement(helper,component,url);
        }
    },
    associatedAssets: function(component,event,helper){
        var userdata = component.get("v.permission");
        var install = component.get("v.install");
        var index = $(event.currentTarget).attr("data-action");
        var _item = component.get("v.itemss");
        var rec =_item[index] ;
        var linkid = rec.linkid;
        var templatedata = rec.metadata;
        templatedata["name"] = templatedata.name;
        templatedata["cansend"] = userdata.canSend;
        templatedata["canPartnerSend"] = userdata.canPartnerSend;
        templatedata["linkids"]=linkid;
        templatedata["isSmartlist"] = null;
        templatedata["id"] = templatedata.id;
        var _templatedata = window.btoa(JSON.stringify(templatedata));
        var url = install+"?clean#assets?closesfmodal=true&function=showRelatedAssets&templatedata=" + _templatedata+"&tpapp=sfdc"; 
    	if(url != undefined)
                helper.showEnablement(helper,component,url);
    },
    showEnablement:function(helper,component,src)
    {
        window.name = src;
        if(component.get("v.dependantwidget") == "oneapp" || !component.get("v.isEnablement"))
        {
            helper.setCookie("showplaybook", false);
            var urlEvent = $A.get("e.force:navigateToURL");
            urlEvent.setParams({
                "url": "/one/one.app#/n/MindMatrix__Enablement"
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
                return;
            }
        return;
    },
    setCookie:function(cname, cvalue) {
        document.cookie = cname + "=" + cvalue + ";path=/";
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
                            //return new Promise(function(resolve, reject) {
                            id = url.split('/')[4];
                            $.ajax({
                                url: 'https://vimeo.com/api/oembed.json?url=' + url,
                                dataType: 'jsonp',
                                success: function (data) {
                                    var thumb = data.thumbnail_url != undefined ? data.thumbnail_url : "//{$Site.HostPath}/v4u/img/video.jpg";
                                    src = thumb;
                                    //resolve(data);
                                },
                                error: function(res){
                                    //reject(res);
                                }
                            });
                        }
                            else if (url.indexOf('googledrive') > -1) {
                                id = url.split(" ")[1];
                                var thumb = 'https://drive.google.com/thumbnail?authuser=0&sz=w320&id='+id+''                           
                                src = thumb;
                            }
        return src;
    },
    getFileSize:function(size) {
        if (size < 1024) {
            return size + " bytes";
        }
        else if (size < 1024 * 1024) {
            return Math.floor(size / 1024) + "kb";
        }
            else if (size < 1024 * 1024 * 1024) {
                return Math.floor(size / 1024 / 1024) + "mb";
            }
                else if (size < 1024 * 1024 * 1024 * 1024) {
                    return Math.floor(size / 1024 / 1024 / 1024) + "gb";
                }
                    else if (size < 1024 * 1024 * 1024 * 1024 * 1024) {
                        return Math.floor(size / 1024 / 1024 / 1024 / 1024) + "tb";
                    }
        return size;
    },
    onUncheck : function(component,event,helper){
        component.set("v.itemss",null);
        var currentCheckbox = $(event.currentTarget);
        var idTab = component.get("v.selTabId");
        $(helper.assetrecord).find('.rotate').addClass("rotate-me");
        var tabSelected = $.grep(component.get('v.tabs'), function (element, index) {
            return element.TabName == idTab;
        }); 
        var tabName = tabSelected[0].TabName;
        var checked =  $(event.currentTarget).prop("checked");
        var currentId = currentCheckbox.attr('id');
        var currentTabFolderEnum = component.get("v.currentTabFolderEnum");
        var currentFolder = component.get("v.currentFolder");
        if(checked == false){
            if (tabSelected.length > 0 ){
                if( tabName == "All"){
                    if(component.get("v.select") == "Include Mine"){
                        var index = currentFolder.indexOf(currentId);
                        currentFolder.splice(index, 1);
                        var cmpEvent = component.getEvent("CmpmodalEvent");                        
                        cmpEvent.setParams({
                            "tabNameData" : tabName,
                            "searchtextModal" :component.get("v.searchtxt"),
                            "currentFolder" : component.get("v.currentFolder"),
                            "cmpPages" : component.get("v.page"),
                            "flagcountVal":false,
                            "filterflag":false,
                            "isMedia":1
                            
                        }); 
                        cmpEvent.fire(); 
                    }else{
                        var index = currentFolder.indexOf(currentId);
                        currentFolder.splice(index, 1);
                        var cmpEvent = component.getEvent("CmpmodalEvent");
                        cmpEvent.setParams({
                            "tabNameData" : tabName,
                            "searchtextModal" :component.get("v.searchtxt"),
                            "currentFolder" : component.get("v.currentFolder"),
                            "cmpPages" : component.get("v.page"),
                            "flagcountVal":false,
                            "filterflag":false,
                            "isMedia":0
                        }); 
                        cmpEvent.fire(); 
                    }
                }else{
                    if(component.get("v.select") == "Include Mine"){
                        var index = currentTabFolderEnum.indexOf(currentId);
                        currentTabFolderEnum.splice(index, 1);
                        var cmpEvent = component.getEvent("CmpmodalEvent");
                        cmpEvent.setParams({
                            "tabNameData" : tabName,
                            "searchtextModal" :component.get("v.searchtxt"),
                            "currenttabfolderENum" : component.get("v.currentTabFolderEnum"),
                            "cmpPages" : component.get("v.page"),
                            "flagcountVal":false,
                            "filterflag":false,
                            "isMedia":1
                        }); 
                        cmpEvent.fire();  
                        var modalEvent = component.getEvent("viewModalEvent"); 
                        modalEvent.setParams({
                            "tabNameData" : tabName,
                            "modalFolderEnum" : component.get("v.currentTabFolderEnum"),
                            "modalPage": component.get("v.page"),
                            "modalSearchtxt" : component.get("v.searchtext"),
                            "modlaisMedia": 1,
                            "filterflag":false
                        }); 
                        modalEvent.fire(); 
                    }
                    else{
                        var index = currentTabFolderEnum.indexOf(currentId);
                        currentTabFolderEnum.splice(index, 1);
                        var cmpEvent = component.getEvent("CmpmodalEvent");
                        cmpEvent.setParams({
                            "tabNameData" : tabName,
                            "searchtextModal" :component.get("v.searchtxt"),
                            "currenttabfolderENum" : component.get("v.currentTabFolderEnum"),
                            "cmpPages" : component.get("v.page"),
                            "flagcountVal":false,
                            "filterflag":false,
                            "isMedia":0
                        }); 
                        cmpEvent.fire();  
                        var modalEvent = component.getEvent("viewModalEvent"); 
                        modalEvent.setParams({
                            "tabNameData" : tabName,
                            "modalFolderEnum" : component.get("v.currentTabFolderEnum"),
                            "modalPage": component.get("v.page"),
                            "modalSearchtxt" : component.get("v.searchtext"),
                            "modlaisMedia" : 0,
                            "filterflag":false
                        }); 
                        modalEvent.fire(); 
                    }
                }
            }
        }else{
            if (tabSelected.length > 0 ){
                if(tabName == "All"){
                    if(component.get("v.select") == "Include Mine"){
                        currentFolder.push(currentId);
                        var cmpEvent = component.getEvent("CmpmodalEvent");
                        cmpEvent.setParams({
                            "tabNameData" : tabName,
                            "searchtextModal" :component.get("v.searchtxt"),
                            "currentFolder" : component.get("v.currentFolder"),
                            "cmpPages" : component.get("v.page"),
                            "flagcountVal":false,
                            "filterflag":false,
                            "isMedia":1
                        }); 
                        cmpEvent.fire(); 
                    }else{
                        currentFolder.push(currentId);
                        var cmpEvent = component.getEvent("CmpmodalEvent");
                        cmpEvent.setParams({
                            "tabNameData" : tabName,
                            "searchtextModal" :component.get("v.searchtxt"),
                            "currentFolder" : component.get("v.currentFolder"),
                            "cmpPages" : component.get("v.page"),
                            "flagcountVal":false,
                            "filterflag":false,
                            "isMedia":0
                        }); 
                        cmpEvent.fire(); 
                    }
                }else{
                    if(component.get("v.select") == "Include Mine"){
                        currentTabFolderEnum.push(currentId);
                        var cmpEvent = component.getEvent("CmpmodalEvent");
                        cmpEvent.setParams({
                            "tabNameData" : tabName,
                            "searchtextModal" :component.get("v.searchtxt"),
                            "currenttabfolderENum" : component.get("v.currentTabFolderEnum"),
                            "cmpPages" : component.get("v.page"),
                            "flagcountVal":false,
                            "filterflag":false,
                            "isMedia":1
                        }); 
                        cmpEvent.fire(); 
                        var modalEvent = component.getEvent("viewModalEvent"); 
                        modalEvent.setParams({
                            "tabNameData" : tabName,
                            "modalFolderEnum" : component.get("v.currentTabFolderEnum"),
                            "modalPage": component.get("v.page"),
                            "modalSearchtxt" : component.get("v.searchtxt"),
                            "modlaisMedia" : 1,
                            "filterflag":false
                        }); 
                        modalEvent.fire(); 
                    }else{
                        currentTabFolderEnum.push(currentId);
                        var cmpEvent = component.getEvent("CmpmodalEvent");
                        cmpEvent.setParams({
                            "tabNameData" : tabName,
                            "searchtextModal" :component.get("v.searchtxt"),
                            "currenttabfolderENum" : component.get("v.currentTabFolderEnum"),
                            "cmpPages" : component.get("v.page"),
                            "flagcountVal":false,
                            "filterflag":false,
                            "isMedia":0
                        }); 
                        cmpEvent.fire(); 
                        var modalEvent = component.getEvent("viewModalEvent"); 
                        modalEvent.setParams({
                            "tabNameData" : tabName,
                            "modalFolderEnum" : component.get("v.currentTabFolderEnum"),
                            "modalPage": component.get("v.page"),
                            "modalSearchtxt" : component.get("v.searchtxt"),
                            "modlaisMedia" : 0,
                            "filterflag":false
                        }); 
                        modalEvent.fire(); 
                    }
                }
            }
        }
    },
    
    rotatesysclick : function(component,event,helper){
        
        component.set("v.itemss",null);
        component.set("v.nodata",false);
        component.set("v.spinner",true);
        $(helper.assetrecord).find('.rotate').addClass("rotate-me");
        window.setTimeout(
            $A.getCallback(function() {
                if(component.get("v.tabs") == null){
                    component.set("v.itemss",null);
                    component.set("v.nodata",true);
                    component.set("v.spinner",false);
                    $(helper.assetrecord).find('.rotate').removeClass("rotate-me");
                    return;
                }
                var id = component.get("v.selTabId");
                var tabsData = component.get("v.tabs");
                var tabSelected = $.grep(component.get('v.tabs'), function (element, index) {
                    return element.TabName == id;
                });
                var tabName = tabSelected[0].TabName;
                var select = component.get("v.select");
                if(select == "Include Mine"){
                    if(tabName == "All"){
                        component.set("v.isMedia",1);
                        var cmpEvent = component.getEvent("CmpmodalEvent");
                        cmpEvent.setParams({
                            "tabNameData" : tabName,
                            "searchtextModal" :component.get("v.searchtxt"),
                            "currentFolder" : component.get("v.currentFolder"),
                            "isMedia" : component.get("v.isMedia"),
                            "selectOption":component.get("v.select"),
                            "filterflag":false,
                            "flagcountVal":false,
                            "filterId" :helper.filterIds,
                            "conditionval":component.get("v.conditionVal")
                        }); 
                        cmpEvent.fire(); 
                    }else{
                        component.set("v.isMedia",1);
                        var cmpEvent = component.getEvent("CmpmodalEvent");
                        cmpEvent.setParams({
                            "tabNameData" : tabName,
                            "searchtextModal" :component.get("v.searchtxt"),
                            "currenttabfolderENum" : component.get("v.currentTabFolderEnum"),
                            "isMedia" : component.get("v.isMedia"),
                            "selectOption":component.get("v.select"),
                            "filterflag":false,
                            "flagcountVal":false,
                            "filterId" :helper.filterIds,
                            "conditionval":component.get("v.conditionVal")
                        }); 
                        cmpEvent.fire(); 
                        var modalEvent = component.getEvent("viewModalEvent"); 
                        modalEvent.setParams({
                            "tabNameData" : tabName,
                            "modalFolderEnum" : component.get("v.currentTabFolderEnum"),
                            "modalSearchtxt" : component.get("v.searchtxt"),
                            "modlaisMedia" : component.get("v.isMedia"),
                            "filterflag":false,
                            "filterId" :helper.filterIds,
                            "conditionval":component.get("v.conditionVal")
                        }); 
                        modalEvent.fire(); 
                    }
                }else{
                    if(tabName == "All"){
                        component.set("v.isMedia",0);
                        var cmpEvent = component.getEvent("CmpmodalEvent");
                        cmpEvent.setParams({
                            "tabNameData" : tabName,
                            "searchtextModal" :component.get("v.searchtxt"),
                            "currentFolder" : component.get("v.currentFolder"),
                            "isMedia" : component.get("v.isMedia"),
                            "selectOption":component.get("v.select"),
                            "filterflag":false,
                            "flagcountVal":false,
                            "filterId" :helper.filterIds,
                            "conditionval":component.get("v.conditionVal")
                        }); 
                        cmpEvent.fire(); 
                    }else{
                        component.set("v.isMedia",0);
                        var cmpEvent = component.getEvent("CmpmodalEvent");
                        cmpEvent.setParams({
                            "tabNameData" : tabName,
                            "searchtextModal" :component.get("v.searchtxt"),
                            "currenttabfolderENum" : component.get("v.currentTabFolderEnum"),
                            "isMedia" : component.get("v.isMedia"),
                            "selectOption":component.get("v.select"),
                            "filterflag":false,
                            "flagcountVal":false,
                            "filterId" :helper.filterIds,
                            "conditionval":component.get("v.conditionVal")
                        }); 
                        cmpEvent.fire(); 
                        var modalEvent = component.getEvent("viewModalEvent"); 
                        modalEvent.setParams({
                            "filterflag":false,
                            "tabNameData" : tabName,
                            "modalFolderEnum" : component.get("v.currentTabFolderEnum"),
                            "modalSearchtxt" : component.get("v.searchtxt"),
                            "modlaisMedia" : 0,
                            "filterId" :helper.filterIds,
                            "conditionval":component.get("v.conditionVal")
                        }); 
                        modalEvent.fire(); 
                    }
                }
            }),1000
        );
        
    },
    
    search : function(component,event,helper){
        //component.set("v.spinner",false);
        var id = component.get("v.selTabId");
        var tabsData = component.get("v.tabs");
        $(helper.assetrecord).find('.rotate').addClass("rotate-me");
        var tabSelected = $.grep(component.get('v.tabs'), function (element, index) {
            return element.TabName == id;
        });
        var tabName = tabSelected[0].TabName;
        var isEnterKey = event.keyCode === 13;
        var tab = component.get("v.tabs");
        var queryTerm =  component.find("searchfilter").get("v.value");;
        component.set("v.searchtxt",queryTerm);
        //component.set("v.spinner",true);
        //component.set("v.itemss",null);
        //component.set("v.nodata",false);
        var currentFolder = component.get("v.currentFolder");
        if( tabName == "All"){
            var cmpEvent = component.getEvent("CmpmodalEvent"); 
            cmpEvent.setParams({
                "tabNameData" : tabName,
                "searchtextModal" :queryTerm,
                "currentFolder" : currentFolder,
                "flagcountVal":false,
                "isMedia":component.get("v.isMedia"),
                "filterflag":true,
                "check":0
            }); 
            cmpEvent.fire();
            var modalEvent = component.getEvent("viewModalEvent"); 
            modalEvent.setParams({
                "tabNameData" : tabName,
                "modalFolderEnum" : component.get("v.currentTabFolderEnum"),
                "modlaisMedia" : component.get("v.isMedia"),
                "modalSearchtxt" : queryTerm,
                "filterflag":true,
                "flagcountVal":true
            }); 
            modalEvent.fire(); 
        }else{
            var cmpEvent = component.getEvent("CmpmodalEvent"); 
            cmpEvent.setParams({
                "tabNameData" : tabName,
                "searchtextModal" :queryTerm,
                "currenttabfolderENum" : component.get("v.currentTabFolderEnum"),
                "flagcountVal":false,
                "isMedia":component.get("v.isMedia"),
                "filterflag":true,
                "check":0
            }); 
            cmpEvent.fire(); 
            var modalEvent = component.getEvent("viewModalEvent"); 
            modalEvent.setParams({
                "tabNameData" : tabName,
                "modalFolderEnum" : component.get("v.currentTabFolderEnum"),
                "modlaisMedia" : component.get("v.isMedia"),
                "modalSearchtxt" : component.get("v.searchtxt"),
                "filterflag":true
            }); 
            modalEvent.fire(); 
        }
    },
    onconditionclick : function(component,event,helper){
        component.set("v.itemss",null);
        component.set("v.spinner",true);
        component.set("v.nodata",false);
        var condition =event.getSource().get("v.label");
        if(condition == 'AND'){
            component.set("v.conditionVal",false);
            component.set('v.condition','OR');   
        }
        else{
            component.set('v.condition','AND');
            component.set("v.conditionVal",true);
        }   
        var isMedia ;
        if (component.get("v.select") == "Include Mine")
            isMedia=1;
        else
            isMedia=0
            var id = component.get("v.selTabId");
        var tabsData = component.get("v.tabs");
        var tabSelected = $.grep(component.get('v.tabs'), function (element, index) {
            return element.TabName == id;
        });
        var tabName = tabSelected[0].TabName;
        if( tabName == "All"){                                             
            var cmpEvent = component.getEvent("CmpmodalEvent"); 
            cmpEvent.setParams({
                "conditionval":component.get("v.conditionVal"),
                "filterId" :helper.filterIds,
                "tabNameData" : tabName,
                "searchtextModal" :component.get("v.searchtxt"),
                "currentFolder" : component.get("v.currentFolder"),
                "cmpPages" : component.get("v.page"),
                "isMedia" : isMedia,
                "filterflag":false,
                "flagcountVal":false,
            }); 
            cmpEvent.fire();                                               
        }else{
            var cmpEvent = component.getEvent("CmpmodalEvent"); 
            cmpEvent.setParams({
                "conditionval":component.get("v.conditionVal"),
                "filterId" :helper.filterIds,
                "tabNameData" : tabName,
                "searchtextModal" :component.get("v.searchtxt"),
                "currenttabfolderENum" :component.get("v.currentTabFolderEnum"),
                "cmpPages" : component.get("v.page"),
                "isMedia" : isMedia,
                "filterflag":false,
                "flagcountVal":false,
            }); 
            cmpEvent.fire(); 
            var modalEvent = component.getEvent("viewModalEvent"); 
            modalEvent.setParams({
                "conditionval":component.get("v.conditionVal"),
                "filterId" :helper.filterIds,
                "tabNameData" : tabName,
                "modalPage":component.get("v.page"),
                "modalFolderEnum" : component.get("v.currentTabFolderEnum"),
                "modlaisMedia" : component.get("v.isMedia"),
                "modalSearchtxt" : component.get("v.searchtxt"),
                "filterflag":false
            }); 
            modalEvent.fire(); 
        }                                           
    },
    filterclick : function(component,event,helper){
        component.set("v.itemss",null);
        component.set("v.spinner",true);
        component.set("v.nodata",false);
        $(helper.assetrecord).find('.rotate').addClass("rotate-me");
        var target = event.currentTarget;
        var targetId = target.getAttribute("id");
        //$("#"+targetId).css('color', 'blue');
        if ($("#"+targetId).css('color')=="rgb(0, 0, 255)") {
            $("#"+targetId).css('color',"black" );
            $("#"+targetId).css('background-color', 'white');
            var index =  helper.filterIds.indexOf(targetId);
            helper.filterIds.splice(index, 1);
        }
        else{
            $("#"+targetId).css('color',"blue" ); 
            $("#"+targetId).css('background-color',"grey" );
            helper.filterIds.push(targetId) ;
        }
        var isMedia ;
        var condition;
        if (component.get("v.select") == "Include Mine")
            isMedia=1;
        else
            isMedia=0
            if(component.get("v.condition")=="OR")
                condition=false;
        else
            condition=true;
        var id = component.get("v.selTabId");
        var tabsData = component.get("v.tabs");
        var tabSelected = $.grep(component.get('v.tabs'), function (element, index) {
            return element.TabName == id;
        });
        var tabName = tabSelected[0].TabName;
        if( tabName == "All"){                                             
            var cmpEvent = component.getEvent("CmpmodalEvent"); 
            cmpEvent.setParams({
                "conditionval":condition,
                "filterId" :helper.filterIds,
                "tabNameData" : tabName,
                "searchtextModal" :component.get("v.searchtxt"),
                "currentFolder" : component.get("v.currentFolder"),
                "cmpPages" : component.get("v.page"),
                "isMedia" : isMedia,
                "flagcountVal":false,
                "filterflag":false,
            }); 
            cmpEvent.fire();                                               
        }else{
            var cmpEvent = component.getEvent("CmpmodalEvent"); 
            cmpEvent.setParams({
                "conditionval":condition,
                "filterId" :helper.filterIds,
                "tabNameData" : tabName,
                "searchtextModal" :component.get("v.searchtxt"),
                "currenttabfolderENum" :component.get("v.currentTabFolderEnum"),
                "cmpPages" : component.get("v.page"),
                "isMedia" : isMedia,
                "flagcountVal":false,
                "filterflag":false,
            }); 
            cmpEvent.fire(); 
            var modalEvent = component.getEvent("viewModalEvent"); 
            modalEvent.setParams({
                "conditionval":condition,
                "filterId" :helper.filterIds,
                "tabNameData" : tabName,
                "modalPage":component.get("v.page"),
                "modalFolderEnum" : component.get("v.currentTabFolderEnum"),
                "modlaisMedia" : component.get("v.isMedia"),
                "modalSearchtxt" : component.get("v.searchtxt"),
                "filterflag":false
            }); 
            modalEvent.fire(); 
        }   
    }
})