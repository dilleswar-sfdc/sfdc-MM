({   
    i:1,
    currentStep:'',
    currentStepid:'',
    doInit : function(component,event,helper)
     { 
         var templateId = component.get("c.getTemplateId");
         templateId.setParams({
             "contactId": component.get("v.contactid")
         });
         templateId.setCallback(this,function(response){
            var state = response.getState();
             if(state === "SUCCESS"){
                
                 var templateid = JSON.parse(response.getReturnValue()).result.templateID;
                 component.set("v.templateId",templateid);
                 component.set("v.companyId",JSON.parse(response.getReturnValue()).result.companyID);
                 helper.getPlaybookData(component,event,helper);
             }
            
         });
          $A.enqueueAction(templateId);
          
     },  
      getPlaybookData : function(component,event,helper){
         var getPlaybook = component.get("c.getPlaybookValues");
          getPlaybook.setParams({
             "contactId": component.get("v.contactid"),
              "templateId":component.get("v.templateId"),
              "companyId": component.get("v.companyId")
         });
         getPlaybook.setCallback(this,function(response){
             
             var state = response.getState();
             if(state === "SUCCESS"){
                 var playbookData = JSON.parse(response.getReturnValue());
                 component.set("v.contactData",playbookData.result.PlaybookContactsToDosViews.item);
                 component.set("v.contactXml",playbookData.result.PlaybookContactsToDosViews.item[0].playbookcontactxml);
                 //var jsonText = JSON. stringify(xmlToJson(playbookData.result.PlaybookContactsToDosViews.item[0].playbookcontactxml)); 
                 component.set("v.leadActivity",playbookData.result.ContactActivityFeeds);
                 component.set("v.playbookTempId",playbookData.result.playbookMedia.id);
                 component.set("v.install",'https://'+playbookData.result.currentDomain);
                 var tempalteJA = playbookData.result.templateJA;
                 var stepTabData = playbookData.result.Template.extendeddata.replace(/@/g, "");
                 
                 var playbookName= playbookData.result.Template.name;
                 component.set("v.playbookName",playbookName);
                 var stepTabDataReplace = JSON.parse(stepTabData.replace(/#/g, ""));
                    var stepTAB	=stepTabDataReplace.template.tabs.tab;
                 if(stepTAB.length>0){
                     var tab = stepTabDataReplace.template.tabs.tab;
                     var stepSequence = [];
                     for(var i=0;i<tab.length;i++){
                         var tabName= tab[i].tabname;
                         var steps = tab[i].step;
                         for(var j=0;j<steps.length;j++){
                             var stepid =steps[j].id;
                             var stepname = steps[j].name+'('+tabName+')';
                             var jo={}
                             jo['stepid']=stepid;
                             jo['stepname']=stepname;
                             jo['selected']=false;
                             stepSequence.push(jo);
                         }
                         
                     }
                     component.set("v.optionTab",stepSequence);
                     component.set("v.optionTabLength",stepSequence.length);
                    helper.currentStep= stepSequence[0].stepname;
                     helper.currentStepid=stepSequence[0].stepid;
                 }
                 if(stepTAB.length>0){
                     var tab = stepTabDataReplace.template.tabs.tab;
                     var stepSequenceData = [];
                     for(var i=0;i<tab.length;i++){
                         var tabName= tab[i].tabname;
                         var tabId=tab[i].id;
                         var steps = tab[i].step;
                         for(var j=0;j<steps.length;j++){
                             var stepid =steps[j].id;
                             var stepname = steps[j].name+'('+tabName+')';
                             var stepDelay=steps[j].delay;
                              var assetsData = steps[j].asset;    
                             var originalStepName=steps[j].name;
                             var lastmediaid="";
                             var isadded=false;
                             var isdone=false;
                             var taskcompletedon="";
                             var assets = [];
                             $(assetsData).each(function () {
                                
                              var assettype = this.type;
                                var jo={};
                             if(assettype == "externalmedia"){
                             jo['stepid']=stepid;
                             jo['stepname']=stepname;
                             jo['type']=assettype;
                             jo['tabType']="Asset";
                             jo['delay']=stepDelay;
                             jo['id']=this.id; 
                             jo['fileid']=this.fileid;                                
                             jo['subtype']=this.subtype; 
                             jo['andorout']=this.andorout; 
                             jo['tabName']=tabName;
                             jo['originalStepName']=originalStepName;
                             if( this.thumburl != "undefined" && this.thumburl != undefined){
                             jo['thumburl']=this.thumburl.replace('%3A',':');
                             }
                             jo['fileurl']=this.fileurl.replace('%3A',':');
                             jo['name']=this.text.replace(/%20/g,'');
                             jo['thumbnailurl']=this.thumbnailurl;
                             jo['tabId']=tabId;
                             jo['lastmediaid']=lastmediaid;
                             jo['taskcompletedon']=taskcompletedon;
                             jo['enum']=1;
                             }
                             else if(assettype == "printcampaign"){
                             jo['stepid']=stepid;
                             jo['stepname']=stepname;
                             jo['type']=assettype;
                             jo['tabType']="PrintCampaign";
                             jo['delay']=stepDelay;
                             jo['subtype']=this.subtype; 
                             jo['andorout']=this.andorout;
                             jo['id']=this.id;
                             jo['tabName']=tabName;
                             jo['originalStepName']=originalStepName;
                             jo['tabId']=tabId;
                             jo['isdone']=isdone;
                             jo['taskcompletedon']=taskcompletedon;
                             jo['enum']=2;
                             //jo['thumburl']=steps[j].asset.thumburl;
                             //jo['fileurl']=steps[j].asset.fileurl;
                             jo['text']=this.text;
                                 for(var k=0;k<tempalteJA.length;k++){
                                     if(this.text ==tempalteJA[k].id ){
                                        // jo['id']=tempalteJA[k].id;
                                         jo['name']=tempalteJA[k].name;
                                         jo['templatetype']=tempalteJA[k].templatetype;
                                          if(tempalteJA[k].templatetype == 16)
                                              jo['tabType']="PrintCampaign";
                                         jo['thumburl']=tempalteJA[k].thumbnail;
                                         
                                     }
                                 }
                             }else if(assettype == "actionitem"){
                             jo['stepid']=stepid;
                             jo['stepname']=stepname;
                             jo['type']=assettype;
                             jo['tabType']="ActionItem";
                             jo['delay']=stepDelay;
                             jo['id']=this.id;
                             jo['tabName']=tabName;
                             jo['subtype']=this.actiontype; 
                             jo['andorout']=this.andorout;
                            jo['originalStepName']=originalStepName;
                             //jo['cdatasection']=this.cdata-section.replace('%20','');
                             jo['name']=this.actionitemname.replace('%20',''); 
                             jo['tabId']=tabId;
                             jo['isdone']=isdone;
                             jo['taskcompletedon']=taskcompletedon;
                             jo['enum']=3;
                             }
                             else if(assettype == "drip"){
                             jo['stepid']=stepid;
                             jo['id']=this.id;
                             jo['stepname']=stepname;
                             jo['type']=assettype;
                             jo['tabType']="Nurturing";
                             jo['tabName']=tabName;
                             jo['originalStepName']=originalStepName;
                             jo['delay']=stepDelay;
                             //jo['subtype']=steps[j].asset.actiontype; 
                             jo['andorout']=this.andorout; 
                             jo['dripid']=this.text;
                             jo['name']='Nurture';
                             jo['tabId']=tabId;
                             jo['isadded']=isadded;
                             jo['taskcompletedon']=taskcompletedon;
                             jo['enum']=4;
                             }
                             else if(assettype == "template"){
                             jo['stepid']=stepid;
                             jo['stepname']=stepname;
                             jo['type']=assettype;
                             jo['delay']=stepDelay;
                             jo['tabType']="Asset";
                             jo['tabName']=tabName;
                             jo['originalStepName']=originalStepName;
                             jo['id']=this.id;
                             //jo['subtype']=steps[j].asset.actiontype; 
                             jo['andorout']=this.andorout; 
                             jo['text']=this.text;
                             jo['tabId']=tabId;
                             jo['taskcompletedon']=taskcompletedon;
                             jo['enum']=5;
                             jo['lastmediaid']=lastmediaid;
                                 for(var k=0;k<tempalteJA.length;k++){
                                     if(this.text ==tempalteJA[k].id ){
                                        // jo['id']=tempalteJA[k].id;
                                         jo['name']=tempalteJA[k].name;
                                         jo['templatetype']=tempalteJA[k].templatetype;
                                         if(tempalteJA[k].templatetype == 3145728)
                                             jo['tabType']="Contract";
                                          else if(tempalteJA[k].templatetype == 32)
                                             jo['tabType']="Email"; 
                                         else
                                             jo['tabType']="Asset";
                                         jo['thumburl']=tempalteJA[k].thumbnail;
                                         jo['templatetype']=tempalteJA[k].templatetype;
                                         
                                     }
                                 }
                             }
                             else if(assettype == "newassets"){
                             jo['stepid']=stepid;
                             jo['stepname']=stepname;
                             jo['type']=assettype;
                             jo['tabType']='Asset';
                             jo['delay']=stepDelay;
                             jo['id']=this.id;
                             jo['tabName']=tabName;
                             jo['originalStepName']=originalStepName;
                             jo['newobjecttypes']=this.newobjecttypes; 
                             jo['andorout']=this.andorout; 
                             jo['name']=this.text.replace(/%20/g,'');
                             jo['tabId']=tabId;
                             jo['isdone']=isdone;
                             jo['taskcompletedon']=taskcompletedon;
                             jo['enum']=6;
                             }
                             else if(assettype == "callscript"){
                             jo['stepid']=stepid;
                             jo['id']=this.id;
                             jo['stepname']=stepname;
                             jo['type']=assettype;
                             jo['delay']=stepDelay;
                             jo['tabName']=tabName;
                             jo['originalStepName']=originalStepName;
                             jo['scripttype']=this.newobjecttypes; 
                             jo['andorout']=this.andorout; 
                             jo['name']=this.callscriptname;
                             jo['tabId']=tabId;
                             jo['taskcompletedon']=taskcompletedon;
                             jo['enum']=7;
                             }
                                 assets.push(jo);
                             })
                             
                             stepSequenceData.push(assets); 
                         
                        //}
                       }
                     }
                     component.set("v.optionTabData",stepSequenceData);
                 }
                 component.set("v.tabData",stepSequenceData[0]);
                 component.set("v.stepName",stepSequenceData[0][0].stepname);
                 var contactinfodata = component.get('v.contactData');
                 var datetime = playbookData.result.PlaybookContactsToDosViews.item[0].duedate;
                 var lastActivity=playbookData.result.PlaybookContactsToDosViews.item[0].updatedon;
                 var datevalue = $A.localizationService.formatDateTime(datetime, "dd/MM/yyyy, hh:mm a");
                 var conversionLastActivityDate=$A.localizationService.formatDateTime(lastActivity, "dd/MM/yyyy");
                 contactinfodata.map(function(item){
                     item.duedate = datevalue;
                     item.updatedon=conversionLastActivityDate;
                     return item;
                 }); 
                   component.set("v.contactData",contactinfodata[0]);
                 component.set("v.accountData",playbookData.result.account);
                 
                 component.set("v.callActivity",playbookData.result.GetCallRecordsForContact.item);
                  
                 if(component.get("v.callActivity") == null){
                     component.set("v.nodata",true);
                    component.set("v.callActivityclick",true);
                 }
                
                     var callActivitydata = component.get("v.callActivity");
                     for(var x=0;x<callActivitydata.length;x++){
                         var datetime =playbookData.result.GetCallRecordsForContact.item[x].activityon;
                         var calldatevalue = $A.localizationService.formatDateTime(datetime, "dd/MM/yyyy, hh:mm a");
                         var totalSeconds =playbookData.result.GetCallRecordsForContact.item[x].duration;
                         var hours = Math.floor(totalSeconds / 3600);
                         totalSeconds %= 3600;
                         hours = (hours < 10) ? "0" + hours : hours;
                         var minutes = Math.floor(totalSeconds / 60);
                         var seconds = totalSeconds % 60;
                         minutes = (minutes < 10) ? "0" + minutes : minutes;
                         seconds = (seconds < 10) ? "0" + seconds : seconds;
                         var d = minutes + ":" + seconds;
                         var totalduration =hours + ":" +d;
                         callActivitydata[x].icon = 'utility:play';
                         callActivitydata[x].activityon = calldatevalue;
                         callActivitydata[x].duration = totalduration;
                         callActivitydata[x].index = x;
                     } 
               	component.set("v.callActivityclick",true);
                  $A.util.addClass(component.find('callActivity'),'callactivity');
                component.set("v.callActivity",callActivitydata);
                 
                 var leadactivityFeed = JSON.parse(component.get("v.leadActivity"));
                 if(leadactivityFeed.length > 0)
                     {
                         var dataSet = [];
                         for(var i = 0;i<=leadactivityFeed.length-1;i++){
                             var date = '';
                             var feed = leadactivityFeed[i];
                             date = feed.when.split(' ');
                             if(date.length > 0)
                                 date = date[0];
                             feed.date = date;     
                             feed.feedmsg = "";
                             
                             feed.feedmsg = $($.parseHTML(feed.msg)).text();
                             if(feed.feedmsg.length > 100)
                                 feed.feedmsg = feed.feedmsg.substring(0,100)+'...';
                             leadactivityFeed[i].feedmsg=feed.feedmsg;
                             var type = feed.type;
                             var iconpath = '';
                             if(type == "email") iconpath = 'email';
                             else if(type == "sms") iconpath = 'email';
                                 else if(type == "externallink") iconpath = 'link';
                                     else if(type == "externalsite") iconpath = 'world';
                                         else if(type == "form") iconpath = 'file';
                                             else iconpath = 'clock';
                             feed.icon = iconpath;                      
                         }
                         component.set("v.leadActivity",leadactivityFeed);
                     }
                 component.set("v.callActivityclick",true);
             }
         });
         $A.enqueueAction(getPlaybook);
     }   ,
    onChangeTab : function(component,event,helper){
        var tabid=component.find("select").get('v.value');
        var stepidNO= parseInt(tabid.match(/\d+/g));
         
          var tabSelected = $.grep(component.get('v.optionTabData'), function (element, index) {
               return element[0].stepid == tabid;
           });
            var delay=  parseInt(tabSelected[0][0].delay);
             component.set("v.movingStep",tabSelected[0][0].stepname) ;                                        
        var getToDoForInternalPlaybook = component.get("c.GetToDoForInternalPlaybook");
        getToDoForInternalPlaybook.setParams({
            "playbookid":component.get("v.playbookTempId"),
            "stepid":stepidNO,
            "contactid":component.get("v.contactid"),
          });
        getToDoForInternalPlaybook.setCallback(this,function(response){
              var state= response.getState();
            if(state==="SUCCESS"){
               
                var timezonesf = $A.get("$Locale.timezone");
                var mydate = new Date().toLocaleString("en-US", {timeZone: timezonesf});
                var localDate = new Date();
                var timezone = localDate.getTimezoneOffset();
                
                var playbookToDoData = JSON.parse(response.getReturnValue()).result;
                var toDoHours = 6; var toDoMinutes = 0; // set default ToDo Time as 6 am for the playbook Todo
               var todaydate = new Date();
                var settododate ;
               if($.type(playbookToDoData) != "object"){
                   if (stepidNO == parseInt(component.get("v.stepName").match(/\d+/g)) ){
                            todaydate.setDate(todaydate.getDate() + 1);
                   }
                        else {
                            todaydate.setDate(todaydate.getDate() + delay);
                       }
                    todaydate.setHours(toDoHours, toDoMinutes);
                    var todoDueDate= $A.localizationService.formatDateTime(todaydate, "yyyy/MM/dd");
                   component.set("v.todoDueDate",todoDueDate);
                    var todoDueOnDate=$A.localizationService.formatDateTime(todaydate, "MM/dd/yyyy hh:m a"); 
                   var settodotime=(todaydate.getHours()+':'+todaydate.getMinutes()+' '+ampm);
                     settododate=((todaydate.getMonth() + 1) + '/' + todaydate.getDate() + '/' + todaydate.getFullYear());
                   component.set("v.time",settodotime) ;
                    component.set('v.date',settododate);
                    //component.set("v.todoDueOnDate",todaydate.toUTCString());
                    component.set("v.dueonDate",todoDueOnDate);
                }
                else{
                   // component.set("v.playbookDueDate",playbookToDoData.duedate);
                     var todoDueDate= $A.localizationService.formatDateTime(playbookToDoData.duedate, "yyyy/MM/dd");
                    //component.set("v.todoDueDate",todoDueDate);
                   // var todoDueOnDate=$A.localizationService.formatDateTime(playbookToDoData.duedate, "MM/dd/yyyy hh:mm a");
                    //settododate=(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate());
                   // var testTime=$A.localizationService.formatDateTime(playbookToDoData.duedate, "HH:mm:ss.SSSZ");
                    // var defaultTime='6:00PM';
                     var getDateTime = playbookToDoData.duedate;
                     var getsplitTime = getDateTime.split(" ");
                     var getDate = getsplitTime[0].split("/");
                     getDate=getDate[2]+"/"+getDate[0]+"/"+getDate[1];
                     var getTime=getsplitTime[1].slice(0, -3);
                     var getampm= getsplitTime[2];
                     var exactTime =getTime+" "+getampm;
                     var time = exactTime;
                     var hours = Number(time.match(/^(\d+)/)[1]);
                     var minutes = Number(time.match(/:(\d+)/)[1]);
                     var AMPM = time.match(/\s(.*)$/)[1];
                     if(AMPM == "PM" && hours<12) hours = hours+12;
                     if(AMPM == "AM" && hours==12) hours = hours-12;
                     var sHours = hours.toString();
                     var sMinutes = minutes.toString();
                     if(hours<10) sHours = "0" + sHours;
                     if(minutes<10) sMinutes = "0" + sMinutes;
                     var exactgetTime=sHours + ":" + sMinutes;
                     component.set("v.time",exactgetTime) ;
                    component.set('v.date',getDate);
                    //component.set("v.todoDueOnDate",'2020-09-12T18:13:41Z');
                    var todoDueOnDate=getDate +' '+exactTime;
                   // component.set("v.dueonDate",todoDueOnDate);
                    //component.set("v.playbookToDoDueOnDate",todoDueOnDate)
                } 
                component.set('v.spinner',false);
                component.set("v.tabSelect",true);
                var cmpTarget = component.find('Modalbox');
                var cmpBack = component.find('Modalbackdrop');
                $A.util.addClass(cmpBack,'slds-backdrop_open');
                $A.util.addClass(cmpTarget, 'slds-fade-in-open');
                $A.util.addClass(component.find("printcampaign"),'hideTabs');
                $A.util.removeClass(component.find("printcampaign"),'showTabs');
                $A.util.addClass(component.find("ActionItems"),'hideTabs');
                 $A.util.removeClass(component.find("ActionItems"),'showTabs');
                $A.util.addClass(component.find("Nurturing"),'hideTabs');
                 $A.util.removeClass(component.find("Nurturing"),'showTabs');
                $A.util.addClass(component.find("Assets"),'hideTabs');
                 $A.util.removeClass(component.find("Assets"),'showTabs');
                $A.util.addClass(component.find("Contract"),'hideTabs');
                 $A.util.removeClass(component.find("Contract"),'showTabs');
                $A.util.addClass(component.find("Email"),'hideTabs');
                 $A.util.removeClass(component.find("Email"),'showTabs');
            }
                                                             
       });
        $A.enqueueAction(getToDoForInternalPlaybook);
    },
    updatePlaybookContactNodeId : function(component,event,helper,stepidNO){
        var updatePlaybookContactNodeId = component.get("c.updatePlaybookContactNodeId");
        updatePlaybookContactNodeId.setParams({
           'playbookid':component.get("v.playbookTempId"),
                 'nodeId':stepidNO,
                 'contactid':component.get("v.contactid"), 
        });
        updatePlaybookContactNodeId.setCallback(this,function(response){
            var state= response.getState();
            if(state==="SUCCESS"){
                
            }
        });
        $A.enqueueAction(updatePlaybookContactNodeId);
    },
    quickSend : function(component,event,helper){
       // var templatedata=[];
        var id = $(event.currentTarget).attr("id");
        var selectedAsset = $.grep(component.get("v.tabData"), function (element, index) {
               return element.id == id;
           });
        var taskcompletedon=new Date();
        if(selectedAsset[0].lastmediaid == ""){
            selectedAsset[0].lastmediaid='mediaId|';
            selectedAsset[0].taskcompletedon=taskcompletedon;}
        else if(selectedAsset[0].isdone == false){
         selectedAsset[0].isdone=true;
            selectedAsset[0].taskcompletedon=taskcompletedon;}
            else if (selectedAsset[0].isadded == false){
         selectedAsset[0].isadded=true;
                selectedAsset[0].taskcompletedon=taskcompletedon;}
      //  var allAssetData=component.get("v.optionTabData")
      /*  for(var i=0;i<allAssetData.length;i++){
            for(var j=0;j<allAssetData[i].length;j++){
                if(selectedAsset[0].id==allAssetData[i][0].id){
                    allAssetData[i].splice(allAssetData[i][0],1,selectedAsset[0]);
                }
            }
        }*/
        
        $('#'+id).css('background-color', 'lightblue');
        $('#'+id).find("div").removeClass('slds-hide');
        var contactId=component.get('v.contactid');
        var strXml = [];
       // strXml.push('<template>');
        var allAsset=component.get("v.optionTabData");
        for(var i=0;i<allAsset.length;i++){
            for(var j=0;j<allAsset[i].length;j++){
            var assetType = allAsset[i][j].type;
             var assetID = allAsset[i][j].stepid;
             var mediaID = allAsset[i][j].lastmediaid;
             var assetFileID = allAsset[i][j].fileid;
             var taskCompletedOn =allAsset[i][j].taskcompletedon ;
             var isDone = allAsset[i][j].isdone;
             var isAdded = allAsset[i][j].isadded;
             var eNum=allAsset[i][j].enum;
             if (assetType == "template") {
                            if (mediaID)
                                strXml.push('<asset type="template" id="' + assetID + '" lastmediaid="' + mediaID + '" taskcompletedon="' + taskCompletedOn + '">' + assetFileID + '</asset>');
                            else if (allAsset[i][0].templatetype == '3145728' && mediaID)
                                strXml.push('<asset type="template" id="' + assetID + '" taskcompletedon="' + taskCompletedOn + '">' + assetFileID + '</asset>');
                    }
                    else if (assetType == "drip" && isAdded) {
                        strXml.push('<asset type="drip" id="' + assetID + '" isadded="' + isAdded + '" taskcompletedon="' + taskCompletedOn + '">' + assetFileID + '</asset>');
                    }
                    else if (assetType == "callscript" && isDone) {
                        strXml.push('<asset type="callscript" id="' + assetID + '" isdone="' + isDone + '" taskcompletedon="' + taskCompletedOn + '"></asset>');
                    }
                    else if (assetType == "actionitem" && isDone) {
                        strXml.push('<asset type="actionitem" id="' + assetID + '" isdone="' + isDone + '" taskcompletedon="' + taskCompletedOn + '"></asset>');
                    }
                    else if (assetType == "externalmedia" && mediaID) {
                        strXml.push('<asset type="externalmedia" id="' + assetID + '" lastmediaid="' + mediaID + '" taskcompletedon="' + taskCompletedOn + '"></asset>');
                    }
                    else if (assetType == "newasset" && isDone) {
                        strXml.push('<asset type="newassets" id="' + assetID + '" isdone="' + isDone + '" taskcompletedon="' + taskCompletedOn + '"></asset>');
                    }
                    else if (assetType == "printcampaign" && isDone) {
                        strXml.push('<asset type="printcampaign" id="' + assetID + '" isdone="' + isDone + '" taskcompletedon="' + taskCompletedOn + '"></asset>');
                    }
            }         
        }
        // strXml.push('</template>');
        var contactXml= component.get("v.contactXml");
        var fileId=selectedAsset[0].fileid;
        var assetId=selectedAsset[0].id;
        var assetType=selectedAsset[0].type;
        var assetTemplateType=selectedAsset[0].templatetype;
       	var templateIDs ;
//        var fileIDs = [];
        //var contacts = [];
       // contacts.push(component.get("v.contactid"));
        fileId=parseInt(fileId);
        if(assetType == 'template'){
            if (fileId > 0)
                    templateIDs=fileId;
            if(assetTemplateType == "3145728"){
                
            }
        }
        else if(assetType == 'externalmedia'){
             if (fileId > 0)
                    fileId=fileId;
				else
                    fileId='';
        }
              	/*	selectedAsset[0].contacts=component.get('v.contactid');
                    selectedAsset[0].templateIDs=templateIDs;
                    selectedAsset[0].fileids=fileId;
                    selectedAsset[0].playbookid=component.get("v.templateId");
        			selectedAsset[0].playbookTempId=component.get("v.playbookTempId");
        			selectedAsset[0].dueDate=component.get("v.dueonDate");
        			selectedAsset[0].strXml=strXml.join("");*/
         var quickSend = component.get("c.quickSend");
        quickSend.setParams({
            'contactId':component.get("v.contactid"),
            //'contactsArray':contacts,
            'playbookId':component.get("v.templateId"),
            'playbookTempId':component.get("v.playbookTempId"),
            'fileIds':fileId,
            'templateIds':templateIDs,
            'dueOnDate':component.get("v.dueonDate"),
            'strXml':strXml.join(""),
            'tabId':parseInt(selectedAsset[0].tabId.replace("tb", ""), 10),
            'stepId':parseInt(selectedAsset[0].stepid.match(/\d+$/)[0]),
            'assetId':parseInt(assetId.replace("asset", ""), 10),
            'tabName':selectedAsset[0].tabName,
            'stepName':selectedAsset[0].originalStepName,
        });
        quickSend.setCallback(this,function(response){
            var state= response.getState();
            if(state==="SUCCESS"){
                
            }
        });
        $A.enqueueAction(quickSend);
        
        
                   // var _templatedata = window.btoa(JSON.stringify(selectedAsset[0]));
                    //var url = component.get('v.install')+"/?clean#assets?function=quickSend&templatedata="+_templatedata +"&tpapp=sfdc";
                   // helper.showEnablement(helper,component,url);
       
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
 })