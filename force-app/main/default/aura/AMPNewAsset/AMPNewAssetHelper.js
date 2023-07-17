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
    eltandeln:'',
    getElnandElt : function(component,event,helper){
        var action = component.get('c.geteltandeltn');
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                helper.eltandeln = response.getReturnValue();
            }
        });
        $A.enqueueAction(action);
    },
    getAssetRecord : function(component,event,helper)
    {
        helper.getElnandElt(component,event,helper);
        var isoPP = component.get("v.source")=='opportunity';
        var jo=isoPP ? {assetId:component.get('v.linkid'),assetTypeId:component.get('v.projecttypeid')} : {linkid:component.get('v.linkid'),source:component.get("v.source")}
        var assetTab = component.get("c." + (isoPP ? "getAssetTabForOpp" : "getAssetTab"));
        assetTab.setParams(jo);
        assetTab.setCallback(this,function(response){
            var state = response.getState();
            
            if(state === "SUCCESS"){
                var apiStatus=JSON.parse(response.getReturnValue()).status;
                var sendFinalMsg="";
                if(apiStatus==1)
                {
                   var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                    title : 'Info Message',
                    message: "An issue occured with the Mindmatrix widget, please contact admin",
                    duration:' 7000',
                    key: 'info_alt',
                    type: 'Info',
                    mode: 'dismissible' 
                });
        		toastEvent.fire(); 
                  
                }
                else
                {
                  
                var data = JSON.parse(response.getReturnValue()).result;                   
                var finalresponse=data.code;
                var finalmessage=data.msg;                
                if(finalresponse==false)
                {                        
                     sendFinalMsg='Sorry!'+' '+ finalmessage;
                 }
                 else
                 {
                     if(data.tabs.length > 0){
                         for(var i=0;i<=data.tabs.length-1;i++){
                             data.tabs[i].TabName =helper.escapeString(component,event,helper,data.tabs[i].TabName);
                         }
                         component.set('v.tabs',data.tabs);
                         
                     }
                  helper.getDetails(component,helper);
                //component.set('v.tabs',data.tabs);
                var tabcount=[];
                for(var i=0;i<data.tabs.length;i++){
                    var jo={};
                    jo["tabname"]=data.tabs[i].TabName;
                    jo["templatetype"]=data.tabs[i].arrenums;
                    tabcount.push(jo);
                }
                component.set("v.tabcountNew",tabcount);
                var searchtxt =component.set('v.searchtxt',data.searchtext);
                component.set("v.permission",data.permissions);
                var permission = component.get("v.permission");
                helper.templateTypeLink = data.templatetypelink; 
                component.set("v.templateTypeLink",data.templatetypelink);
                component.set('v.options',data.searchoptions);
                if(data.tabs.length > 0){
                    var tab = data.tabs[0];
                    var tabName = tab.TabName;
                    var currentFolderwithID = [];
                    var currentTabFolderEnum = [];
                    for(var i = 0; i< tab.arrtypes.length; i++)
                    {
                        var foldername = tab.arrtypes[i];
                        var folderEnum = tab.arrenums[i];
                        var item = {};
                        item["foldername"] = foldername;
                        item["enum"] = folderEnum;
                        currentFolderwithID.push(item);
                    }
                    for(var i=0 ;i < currentFolderwithID.length;i++){
                        currentTabFolderEnum.push(currentFolderwithID[i].enum);
                    }
                    component.set("v.currentTabFolderEnum",currentTabFolderEnum);
                    component.set("v.currentFolderwithID",currentFolderwithID);
                }
               
            }
            }
                  var childComponent = component.find('child');
                var tabName;
                if(tab == undefined){
                    tabName=null;
                }
                else{
                    tabName=tab.TabName;
                }
                childComponent.modalViewMethod(helper.eltandeln,component.get("v.searchtxt"),component.get("v.tabs"),component.get("v.options"),
                                               component.get("v.currentFolderwithID"),
                                               component.get("v.permission"),component.get("v.currentTabFolderEnum"),tabName,true,sendFinalMsg,component.get("v.header"),component.get("v.mainnavbgcolor"),component.get("v.mainnavfontcolor"));
              // if(component.get("v.errorFlag")
               //    var childComponent = component.find('child');
               // childComponent.modalViewMethod(component.set("v.spinner",false),component.set("v.itemss",undefined), component.set("v.nodata",true));
            }
        });
       
        $A.enqueueAction(assetTab);
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
                        type: 'Info',
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
                            type: 'Info',
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
                childComponent.modalViewTabMethod(component.get("v.tabcountVal"));
                
            }
        });
        
        $A.enqueueAction(assetcountApi);
  },
    getAssetSearchRecord : function(component,event,helper,tabName){
       
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
        //assetSearchApi.setStorable();
        assetSearchApi.setParams({
            "page" :page,
            "pagesize":pagesize,
            "searchparam":searchText,
            "tableType":[],
            "templateType":currentTabFolderEnum,
            "tempSearch":false,
            "tabName":tabName,
            "isMedia":isMedia,
            "filters":filterid,
            "condition":conditionval,
          	"sortupdate":"updatedon",
            "filFlag":filterFlagVal,
        });
        assetSearchApi.setCallback(this,function(response){
            
            var state = response.getState();
            var sendFinalMsg="";
            if(state === "SUCCESS")
            {
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
                        duration:' 7000',
                        key: 'info_alt',
                        type: 'Info',
                        mode: 'dismissible' 
                	});
        		 	toastEvent.fire();                 
                }
                else
                {
                   if(finalresponse==false)
                     { 
                        sendFinalMsg='Sorry!'+' '+ finalmessage;
                	}
                    else
                    {
                        component.set("v.install",'https://'+assetRecord.result.currentDomain);
                        var assetRecordItem = assetRecord.result.tabData.item;
                        component.set("v.rowcount",assetRecord.result.tabData.row_count);
                        component.set("v.pages",Math.ceil(assetRecord.result.tabData.row_count/component.get("v.pagesize")));
                        if(assetRecordItem.length ==0){
                            
                            component.set("v.spinner",false);
                            component.set("v.itemss",undefined);
                            $(helper.assetrecord).find('.rotate').removeClass("rotate-me");
                            component.set("v.nodata",true);
                            component.set("v.ErrorMsg","test message for");                        
                        }
                        else {
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
                                var typeStr = assetRecordItem[i].metadata.templatetype;
                                var templateTypeLink = component.get("v.templateTypeLink");
                                var typeValue = templateTypeLink[typeStr];
                                assetRecordItem[i].typename = typeStr;
                                assetRecordItem[i].typevalue = typeValue;
                                assetRecordItem[i].filetype = assetRecordItem[i].metadata.filetype;
                                var select ;
                                if(typeStr != undefined)
                                    select = 0;
                                else if(assetRecordItem[i].filetype == "VIDEO")
                                    select = 1;
                                else if(assetRecordItem[i].filetype == "JPEG" ||assetRecordItem[i].filetype == "PNG")
                                    select = 2;
                                else if(assetRecordItem[i].filetype == 'TEXT'|| assetRecordItem[i].filetype == 'PPT' || assetRecordItem[i].filetype == 'XLS' || assetRecordItem[i].filetype == 'CSV' ||
                            assetRecordItem[i].filetype == 'STEP'||  assetRecordItem[i].filetype == 'PPTX' || assetRecordItem[i].filetype == 'PDF'  ||
                            assetRecordItem[i].filetype == 'DOC' || assetRecordItem[i].filetype == 'DOCX' || assetRecordItem[i].filetype == 'XLSX' 
                            || assetRecordItem[i].filetype == 'CSS'  || assetRecordItem[i].filetype == 'XML'  || assetRecordItem[i].filetype == 'ZIP' || 
                            assetRecordItem[i].filetype == 'ZIPX'  || assetRecordItem[i].filetype == 'RAR'  || assetRecordItem[i].filetype == '7Z' || assetRecordItem[i].filetype == 'S7Z'
                            || assetRecordItem[i].filetype == 'CFS'  || assetRecordItem[i].filetype == 'ICS'  || assetRecordItem[i].filetype == 'VCS'  || assetRecordItem[i].filetype == 'DWG'
                            || assetRecordItem[i].filetype == 'STP'||assetRecordItem[i].filetype == 'DOCUMENT')
                                    select = 3;
                                else 
                                    select =4;
                                switch(select){
                                    case 0:
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
                                        item["imgUrl"] = install+'/page/'+_metadata.firstpage +'/'+_metadata.templatepublickey+'/'+ _metadata.updatedon + '/thumbnail.jpeg';
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
                                    item["flag1"]= assetRecordItem[i].flag1;
                                    item["flag6"]= assetRecordItem[i].flag6;
                                    item["index"] = i;
                                    items.push(item);
                                        break;
                                    case 1:
                                         var _data = assetRecordItem[i];
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
                                        if(_metadata.thumburl200 == undefined){
                                            item["imgUrl"]=  this.getVideoThumbnail(_metadata.url);
                                        }
                                        else {
                                            if(_metadata.thumburl200.indexOf("timg200") > -1){
                                                item["imgUrl"]=  _metadata.thumburl200;
                                            }
                                            else{
                                                item["imgUrl"]=  this.getVideoThumbnail(_metadata.url);
                                            }
                                        }
                                    item["thumburl200"]=_metadata.thumburl200;
                                    item["output"] = _metadata.output;    
                                    item["name"] = _metadata.name;
                                    item["fileurl"] = _metadata.fileurl;
                                    item["createdon"] = _metadata.createdon.split(' ')[0];
                                    item["linkid"] = _data.linkid;
                                    item["linktype"] = _data.linktype;
                                    item["updatedon"] = _data.updatedon;
                                    item["nameurl"] = _metadata.fileurl+'?userid=' +encrepteduserid+ '&rand=1';
                                    item["metadata"] = _data.metadata;
                                    item["flag10"] = assetRecordItem[i].flag10;
                                     item["flag1"]= assetRecordItem[i].flag1;
                                    item["index"] = i;
                                    items.push(item);											
                                        break;
                                    case 2:
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
                                            item["thumburl200"]=_metadata.thumburl200;
                                            item["fileurl"] = _metadata.fileurl;
                                            item["url"] = _metadata.url;
                                            item["imgUrl"] = _metadata.thumburl200;
                                            item["createdon"] = _metadata.createdon.split(' ')[0];
                                            item["itemupdatedon"] = _metadata.updatedon.split(' ')[0];
                                            item["linkid"] = _data.linkid;
                                            item["linktype"] = _data.linktype;
                                            item["updatedon"] = _data.updatedon;
                                            item["metadata"] = _data.metadata;
                                             item["flag1"]= assetRecordItem[i].flag1;
                                            item["index"] = i;
                                            items.push(item); 
                                        break;
                                    case 3:
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
                                        item["thumburl200"]=_metadata.thumburl200;
                                        item["url"] = _metadata.url;
                                        item["fileurl"] = _metadata.fileurl;
                                        item["downloadurl"] = _metadata.downloadurl;
                                        item["output"] = _metadata.output;
                                        item["createdon"] = _metadata.createdon.split(' ')[0];
                                        item["itemupdatedon"] = _metadata.updatedon.split(' ')[0];
                                        item["linkid"] = _data.linkid;
                                        item["linktype"] = _data.linktype;
                                        item["updatedon"] = _data.updatedon;
                                        item["metadata"] = _data.metadata;
                                         item["flag1"]= assetRecordItem[i].flag1;
                                        item["index"] = i;
                                        items.push(item);
                                        break;
                                    case 4:
                                         var _data = assetRecordItem[i];
                                            var install = component.get("v.install");
                                            var _metadata = _data.metadata;
                                            item["id"] = _metadata.id;
                                            item["name"] = _metadata.name;
                                            item["trackinglink"] = _metadata.trackinglink;
                                            item["fileurl"] = _metadata.fileurl;
                                             item["flag1"]= assetRecordItem[i].flag1;
                                            item["index"]=i;
                                            items.push(item);
                                        break;
                                    
                                }
                            }
                            component.set("v.itemss",items);
                        }
                    }
                }
            }
            if(!component.get("v.flag")){
                 
                var childComponent = component.find('child');
                childComponent.modalViewMethod('',component.get("v.searchtxt"),component.get("v.tabs"),component.get("v.options"),component.get("v.currentFolderwithID"),
                                               component.get("v.permission"),component.get("v.currentTabFolderEnum"),tabName,false,sendFinalMsg,component.get("v.header"),component.get("v.mainnavbgcolor"),component.get("v.mainnavfontcolor"),component.get("v.itemss"),component.get("v.pages"),component.get("v.rowcount")
                                               ,component.get("v.install"),component.get("v.source"),component.get("v.projecttypeid"),
                                               component.get("v.linkid"),component.get("v.categorizedfilters"),component.get("v.Noncategorizedfilters"));
				component.set("v.flag",true);                
            }
            else{
                var childComponent = component.find('child');
                childComponent.modalViewAnotherMethod(component.get("v.itemss"),component.get("v.rowcount"),component.get("v.install"),component.get("v.pages"),component.get("v.tabcountVal"),tabName,component.get("v.flagcount"),component.get("v.categorizedfilters"),component.get("v.Noncategorizedfilters"),sendFinalMsg);
            }    
        });
       
        $A.enqueueAction(assetSearchApi);
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
                            //});
                            
                        }else if (url.indexOf('googledrive') > -1) {
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
   
    escapeString: function(component,event,helper,str){
       return str.replace(/%27/g, "'").replace(/%27%27/g, "\"").replace(/%60/g, "`").replace(/%5c/g, "\\").replace(/%28/g, "\(").replace(/%29/g, "\)").replace(/%3e/g, ">").replace(/%3c/g, "<").replace(/%3e/,"&gt;").replace(/%3c/, "&lt;").replace(/%20/g, " ").replace(/%26/g, "&").replace(/%40/g, "@").replace(/%23/g, "#").replace(/%24/g, "$").replace(/%2f/g, "/");
    },
    getDetails:function(component,helper)
    {
        var action = component.get("c.getPersonaThemeViaEmail");
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
                        component.set("v.mainnavbgcolor",data.result.pagecss.mainnavbgcolor);
                        component.set("v.mainnavfontcolor",data.result.pagecss.mainnavfontcolor);
                        component.set("v.subnavbgcolor",data.result.pagecss.subnavbgcolor);
                        
                    }
                }
            }  
        });
        action.setBackground();
        $A.enqueueAction(action);
    },
 
})