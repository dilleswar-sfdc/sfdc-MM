({
    scriptLoaded : function(component,event,helper){
        helper.doInit(component,event,helper);
                                     

    },
	callActivity : function(component, event, helper) {
        $A.util.addClass(component.find('callActivity'),'callactivity');
         $A.util.removeClass(component.find('accActivity'),'callactivity');
         $A.util.removeClass(component.find('leadActivity'),'callactivity');
        component.set("v.accInfoClick",false);
        component.set("v.callActivityclick",true);
        component.set("v.leadActivityclick",false);
        
	},
    accountInfo: function(component,event,helper){
         $A.util.addClass(component.find('accActivity'),'callactivity');
         $A.util.removeClass(component.find('leadActivity'),'callactivity');
          $A.util.removeClass(component.find('callActivity'),'callactivity');
        component.set("v.accInfoClick",true);
        component.set("v.callActivityclick",false);
        component.set("v.leadActivityclick",false);
    },
    leadActivity : function(component,event,helper){
        $A.util.removeClass(component.find('callActivity'),'callactivity');
        $A.util.removeClass(component.find('accActivity'),'callactivity');
         $A.util.addClass(component.find('leadActivity'),'callactivity');
        component.set("v.accInfoClick",false);
        component.set("v.callActivityclick",false);
        component.set("v.leadActivityclick",true);
        
    },
    onChangeTab : function(component,event,helper){
        component.set("v.spinner",true);
        helper.onChangeTab(component,event,helper);
 		
    },
    modalclose : function(component,event,helper){
        var cmpTarget = component.find('Modalbox');
        var cmpBack = component.find('Modalbackdrop');
        $A.util.removeClass(cmpBack,'slds-backdrop_open');
        $A.util.removeClass(cmpTarget, 'slds-fade-in-open');
         for(var i=0;i<=allTabs.length-1;i++){
           if(allTabs[i].stepname == helper.currentStep) {
                              allTabs[i].selected=true;
               component.set("v.selectedValue",allTabs[i].stepid);
                          }else{
                              allTabs[i].selected=false;
                          }
        }
                component.set("v.optionTab",allTabs);
    },
    cancel : function(component,event,helper){
        var cmpTarget = component.find('Modalbox');
        var cmpBack = component.find('Modalbackdrop');
        $A.util.removeClass(cmpBack,'slds-backdrop_open');
        $A.util.removeClass(cmpTarget, 'slds-fade-in-open');
      	 var allTabs = component.get("v.optionTab");
        //var getCurrentTab=helper.currentStep;
        for(var i=0;i<=allTabs.length-1;i++){
           if(allTabs[i].stepname == helper.currentStep) {
                              allTabs[i].selected=true;
               component.set("v.selectedValue",allTabs[i].stepid);
                          }else{
                              allTabs[i].selected=false;
                          }
        }
                component.set("v.optionTab",allTabs);
        
    },
    duedateEdit : function(component,event,helper){
        component.set("v.dateEdit",true);
        var cmpTarget = component.find('ModalDatebox');
        var cmpBack = component.find('ModalDatebackdrop');
        $A.util.addClass(cmpBack,'slds-backdrop_open');
        $A.util.addClass(cmpTarget, 'slds-fade-in-open');
},
    datecancel : function(component,event,helper){
        var cmpTarget = component.find('ModalDatebox');
        var cmpBack = component.find('ModalDatebackdrop');
        $A.util.removeClass(cmpBack,'slds-backdrop_open');
        $A.util.removeClass(cmpTarget, 'slds-fade-in-open'); 
    },
    modaldateclose : function(component,event,helper){
        var cmpTarget = component.find('ModalDatebox');
        var cmpBack = component.find('ModalDatebackdrop');
        $A.util.removeClass(cmpBack,'slds-backdrop_open');
        $A.util.removeClass(cmpTarget, 'slds-fade-in-open'); 
    },
    viewMore : function(component,event,helper){
        
    },
    onmousehoverWonOpp : function(component,event,helper){
        component.set("v.tooltipWonOpp",true);
    },
    onmouseoutWonOpp  : function(component,event,helper){
        component.set("v.tooltipWonOpp",false);
    },
    onmousehovertotalOpp : function(component,event,helper){
        component.set("v.tooltipTotalOpp",true);
    },
    onmouseouttotalOpp : function(component,event,helper){
        component.set("v.tooltipTotalOpp",false);
    },
    onmousehovercomOpp : function(component,event,helper){
        component.set("v.tooltipcomOpp",true);
    },
 	onmouseoutcomOpp :  function(component,event,helper){
        component.set("v.tooltipcomOpp",false);
    },
 	onmousehovercomcont :  function(component,event,helper){
        component.set("v.tooltipcompCont",true);
    },
    onmouseoutcomcont :  function(component,event,helper){
        component.set("v.tooltipcompCont",false);
    },
    play : function(component,event,helper){
        var id= event.getSource().get("v.value");
        
        var index = $("#"+id).data("index");
        var data = component.get('v.callActivity');
         if(data.length>0){
             for( var i= 0;i < data.length;i++){
                var getindex = data[i].index;
                 if(getindex != index){
                   if(data[i].icon == 'utility:pause'){
                     var cid= $("#"+data[i].id)[0].pause();
                 //var item = data[index];
                 var item = data[i];
                 data[i].icon=item.icon == "utility:pause" ? "utility:play" : "utility:pause";
                  }
                 }else{
                     if(data[i].icon == 'utility:pause'){
                    var cid= $("#"+data[i].id)[0].pause();
                 //var item = data[index];
                 var item = data[i];
                 data[i].icon=item.icon == "utility:pause" ? "utility:play" : "utility:pause"; 
                     }
                     else{
                         if(data[index].icon == 'utility:play'){
                             var cid= $("#"+id)[0].play();
                             //var item = data[index];
                             var item = data[index];
                             data[index].icon=item.icon == "utility:pause" ? "utility:play" : "utility:pause";
                         }
                     }
                 }
             } 
             
         }
        component.set("v.callActivity",data);
      
    },
    save : function(component,event,helper){
        component.set('v.spinner',true);
          var setToDoDate = component.get("v.todoDueOnDate");                                  
         var tabid=component.find("select").get('v.value');
          var stepidNO= parseInt(tabid.match(/\d+/g)); 
           helper.i=stepidNO;
             if(stepidNO > 1)
             $A.util.removeClass(component.find("slide-left"),"slds-hide");             
             if(stepidNO == component.get("v.optionTabLength"))
              $A.util.addClass(component.find("slide-right"),"slds-hide");
             if(stepidNO <component.get("v.optionTabLength"))
               $A.util.removeClass(component.find("slide-right"),"slds-hide");
          	if(stepidNO == 1)
              $A.util.addClass(component.find("slide-left"),"slds-hide");    
          component.set("v.stepIdNO",stepidNO);                                 
          component.set("v.selectedValue",tabid);
         var tabSelected = $.grep(component.get('v.optionTabData'), function (element, index) {
               return element[0].stepid == tabid;
           });
           component.set("v.stepName",tabSelected[0][0].stepname); 
             var tabName= tabSelected[0][0].tabName;  
            var originalStepName=tabSelected[0][0].originalStepName;
             var toDoTime= component.get('v.time');
             var toDoDate=component.get('v.date');
             var gettimeVal= toDoTime.split('.');
             if (toDoDate != "" && toDoTime != "") 
                var dueDateTime = new Date(toDoDate + ' ' + toDoTime);
             var dueDateTimeUTC = new Date(dueDateTime.getTime() - dueDateTime.getTimezoneOffset() * 60000);
            //var convertDueDateTime =dueDateTime.toLocaleString()+' '+'GMT';
           	 var playbookName= component.get("v.playbookName");
             var setToDoInternalPlaybook = component.get("c.setToDoInternalPlaybook");
             setToDoInternalPlaybook.setParams({
                 "playbookid":component.get("v.playbookTempId"),
                 "stepid":stepidNO,
                 "contactid":component.get("v.contactid"),
                 "duedate": dueDateTimeUTC,
                "stepname": originalStepName,
                 "tabname":tabName,
                 "playbookname":playbookName
                 
                 
             });                           
              setToDoInternalPlaybook.setCallback(this,function(response){
                  var state= response.getState();
                  if(state=== "SUCCESS"){
                      var result=JSON.parse(response.getReturnValue()).result;
                      helper.currentStep=component.get("v.stepName");
                      var time=toDoTime;
                      time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
                      if (time.length > 1) { // If time format correct
                          time = time.slice (1);  // Remove full string match value
                          time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
                          time[0] = +time[0] % 12 || 12; // Adjust hours
                      }
                       toDoTime=  time.join (''); 
                      var dueOnDate=toDoDate + '  ' + toDoTime;
                      component.set("v.spinner",false);
                      component.set("v.todoDueDate",toDoDate);
                      component.set('v.dueonDate',dueOnDate);
                      var allTabs = component.get("v.optionTab");
                      //var getCurrentTab=helper.currentStep;
                      for(var i=0;i<=allTabs.length-1;i++){
                          if(allTabs[i].stepname == helper.currentStep) {
                              allTabs[i].selected=true;
                          }else{
                              allTabs[i].selected=false;
                          }
                      }
                      component.set("v.optionTab",allTabs);
                      if(component.get('v.dateEdit')){
                          var cmpTarget = component.find('ModalDatebox');
                          var cmpBack = component.find('ModalDatebackdrop');
                          $A.util.removeClass(cmpBack,'slds-backdrop_open');
                          $A.util.removeClass(cmpTarget, 'slds-fade-in-open');
                      }
                      else{
                          var asset=[];
                          var email=[];
                          var printCampaign=[];
                          var nurturing=[];
                          var contract=[];
                          var actionItem=[];
                          for(var i=0;i<=tabSelected[0].length-1;i++){
                              switch(tabSelected[0][i].tabType){
                                  case "PrintCampaign":
                                      $A.util.removeClass(component.find("printcampaign"),'hideTabs');
                                      $A.util.addClass(component.find("printcampaign"),'showTabs');
                                      printCampaign.push(tabSelected[0][i]);
                                      component.set("v.printCampaign",printCampaign);
                                      break;
                                  case "ActionItem":
                                      $A.util.removeClass(component.find("ActionItems"),'hideTabs');
                                      $A.util.addClass(component.find("ActionItems"),'showTabs');
                                      actionItem.push(tabSelected[0][i]);
                                      component.set("v.actionItem",actionItem);
                                      break;
                                  case "Nurturing":
                                      $A.util.removeClass(component.find("Nurturing"),'hideTabs');
                                      $A.util.addClass(component.find("Nurturing"),'showTabs');
                                      nurturing.push(tabSelected[0][i]);
                                      component.set("v.nurturing",nurturing);
                                      break;
                                  case "Asset":
                                      $A.util.removeClass(component.find("Assets"),'hideTabs');
                                      $A.util.addClass(component.find("Assets"),'showTabs');                                      
                                      asset.push(tabSelected[0][i]);
                                      component.set("v.asset",asset);
                                      break;
                                  case "Contract":
                                      $A.util.removeClass(component.find("Contract"),'hideTabs');
                                      $A.util.addClass(component.find("Contract"),'showTabs');
                                      contract.push(tabSelected[0][i]);
                                      component.set("v.contract",contract);
                                      break;
                                  case "Email":
                                     $A.util.removeClass(component.find("Email"),'hideTabs');
                                    $A.util.addClass(component.find("Email"),'showTabs');
                                      email.push(tabSelected[0][i]);
                                      component.set("v.email",email);
                                      break;
                              }
                          }
                          if(asset.length > 0){
                              component.set('v.tabData',asset);
                              var cmpTarget = component.find('Modalbox');
                          var cmpBack = component.find('Modalbackdrop');
                          $A.util.removeClass(cmpBack,'slds-backdrop_open');
                          $A.util.removeClass(cmpTarget, 'slds-fade-in-open');
                            $A.util.addClass(component.find("assetButton"),"tabClicked"); 
                               helper.updatePlaybookContactNodeId(component,event,helper,stepidNO);
                              return;}
                          if(email.length > 0){
                              component.set('v.tabData',email);
                              var cmpTarget = component.find('Modalbox');
                          var cmpBack = component.find('Modalbackdrop');
                          $A.util.removeClass(cmpBack,'slds-backdrop_open');
                          $A.util.removeClass(cmpTarget, 'slds-fade-in-open');
                              $A.util.addClass(component.find("emailButton"),"tabClicked");
                               helper.updatePlaybookContactNodeId(component,event,helper,stepidNO);
                              return;
                          }
                      	 if(printCampaign.length > 0){
                              component.set('v.tabData',printCampaign);
                             var cmpTarget = component.find('Modalbox');
                          var cmpBack = component.find('Modalbackdrop');
                          $A.util.removeClass(cmpBack,'slds-backdrop_open');
                          $A.util.removeClass(cmpTarget, 'slds-fade-in-open');
                              $A.util.addClass(component.find("printButton"),"tabClicked");
                              helper.updatePlaybookContactNodeId(component,event,helper,stepidNO);
                              return;
                          }
                            if(nurturing.length > 0){
                              component.set('v.tabData',nurturing);
                                var cmpTarget = component.find('Modalbox');
                          var cmpBack = component.find('Modalbackdrop');
                          $A.util.removeClass(cmpBack,'slds-backdrop_open');
                          $A.util.removeClass(cmpTarget, 'slds-fade-in-open');
                          $A.util.addClass(component.find("nurturingButton"),"tabClicked");
                                 helper.updatePlaybookContactNodeId(component,event,helper,stepidNO);
                              return;
                          }
                           if(contract.length > 0){
                              component.set('v.tabData',contract);
                               var cmpTarget = component.find('Modalbox');
                          var cmpBack = component.find('Modalbackdrop');
                          $A.util.removeClass(cmpBack,'slds-backdrop_open');
                          $A.util.removeClass(cmpTarget, 'slds-fade-in-open');
                                $A.util.addClass(component.find("contractButton"),"tabClicked");
                                helper.updatePlaybookContactNodeId(component,event,helper,stepidNO);
                              return;
                          }
                           if(actionItem.length > 0){
                              component.set('v.tabData',actionItem);
                               var cmpTarget = component.find('Modalbox');
                          var cmpBack = component.find('Modalbackdrop');
                          $A.util.removeClass(cmpBack,'slds-backdrop_open');
                          $A.util.removeClass(cmpTarget, 'slds-fade-in-open');
                                $A.util.addClass(component.find("actionButton"),"tabClicked");
                                helper.updatePlaybookContactNodeId(component,event,helper,stepidNO);
                              return;
                          }
                          
                      }
                    
                  }
               });
               $A.enqueueAction(setToDoInternalPlaybook);
        
    },
    datesave : function(component,event,helper){
       var cmpTarget = component.find('ModalDatebox');
        var cmpBack = component.find('ModalDatebackdrop');
        $A.util.removeClass(cmpBack,'slds-backdrop_open');
        $A.util.removeClass(cmpTarget, 'slds-fade-in-open'); 
    },
    notes :  function(component,event,helper){
        var noteval = component.find("notes").get("v.value");
        component.set("v.notes",noteval);
    },
    download : function(component,event,helper){
         var index=event.getSource().get('v.value');
          var calldata = component.get('v.callActivity');                                      
          var url = calldata[index].recordingurl+ "?Download=true";
            window.location.href = url;
    },
    quicksendtocontact : function(component,event,helper){
        var id = $(event.currentTarget).attr("id");
        var _item = component.get("v.optionTabData");
        var tabSelected = $.grep(component.get('v.optionTabData'), function (element, index) {
               return element[0].id == id;
           });
        
    },
    slideRight : function(component,event,helper){
        
        $A.util.removeClass(component.find("slide-left"),"slds-hide");
        var allSteps =component.get("v.optionTab");
                                                 
                                                  while(helper.i<=parseInt(allSteps[helper.i].stepid.match(/\d+/g))){
                                                      component.set("v.selectedValue",allSteps[helper.i].stepid);
                                                      helper.i++;
                                                      break;
                                                  }                                        
         var selectedvl = component.get("v.selectedValue");                                                                           
         component.set("v.tabSelect",true);
        var cmpTarget = component.find('Modalbox');
    	var cmpBack = component.find('Modalbackdrop');
        $A.util.addClass(cmpBack,'slds-backdrop_open');
       	$A.util.addClass(cmpTarget, 'slds-fade-in-open');
    },
    slideLeft : function(component,event,helper){
                                                 var allSteps =component.get("v.optionTab");
                                                 helper.i--;
                                                 helper.i--;
      while(helper.i<=parseInt(allSteps[helper.i].stepid.match(/\d+/g))){
                                                      component.set("v.selectedValue",allSteps[helper.i].stepid);
                                                      if(allSteps[helper.i].stepid == 'step1')
                                                       $A.util.addClass(component.find("slide-left"),"slds-hide");    
                                                      break;
                                                  }     
         component.set("v.tabSelect",true);
        var cmpTarget = component.find('Modalbox');
    	var cmpBack = component.find('Modalbackdrop');
        $A.util.addClass(cmpBack,'slds-backdrop_open');
       	$A.util.addClass(cmpTarget, 'slds-fade-in-open');
},
    onPlaybackEnded : function(component,event,helper){
        var data = component.get('v.callActivity');
         for( var i= 0;i < data.length;i++){
           if(data[i].icon == 'utility:pause'){
                 var item = data[i];
                 data[i].icon= "utility:play" ; 
                     }  
         }
      component.set("v.callActivity",data);
    },
    emailTab : function(component,event,helper){
       component.set("v.tabData",component.get('v.email'));
         $A.util.addClass(component.find("emailButton"),"tabClicked");
         $A.util.removeClass(component.find("assetButton"),"tabClicked");
         $A.util.removeClass(component.find("nurturingButton"),"tabClicked");
         $A.util.removeClass(component.find("actionButton"),"tabClicked");
         $A.util.removeClass(component.find("contractButton"),"tabClicked");
         $A.util.removeClass(component.find("printButton"),"tabClicked");
    },
    assetTab : function(component,event,helper){
         component.set("v.tabData",component.get('v.asset'));
        $A.util.addClass(component.find("assetButton"),"tabClicked");
        $A.util.removeClass(component.find("emailButton"),"tabClicked");
         $A.util.removeClass(component.find("nurturingButton"),"tabClicked");
         $A.util.removeClass(component.find("actionButton"),"tabClicked");
         $A.util.removeClass(component.find("contractButton"),"tabClicked");
         $A.util.removeClass(component.find("printButton"),"tabClicked");
    },
    nurturingTab : function(component,event,helper){
         component.set("v.tabData",component.get('v.nurturing'));
        $A.util.addClass(component.find("nurturingButton"),"tabClicked");
         $A.util.removeClass(component.find("emailButton"),"tabClicked");
         $A.util.removeClass(component.find("assetButton"),"tabClicked");
         $A.util.removeClass(component.find("actionButton"),"tabClicked");
         $A.util.removeClass(component.find("contractButton"),"tabClicked");
         $A.util.removeClass(component.find("printButton"),"tabClicked");
    },
    actionTab : function(component,event,helper){
         component.set("v.tabData",component.get('v.actionItem'));
        $A.util.addClass(component.find("actionButton"),"tabClicked");
        $A.util.removeClass(component.find("emailButton"),"tabClicked");
         $A.util.removeClass(component.find("assetButton"),"tabClicked");
         $A.util.removeClass(component.find("nurturingButton"),"tabClicked");
         $A.util.removeClass(component.find("contractButton"),"tabClicked");
         $A.util.removeClass(component.find("printButton"),"tabClicked");
    },
    contractTab : function(component,event,helper){
         component.set("v.tabData",component.get('v.contract'));
        $A.util.addClass(component.find("contractButton"),"tabClicked");
           $A.util.removeClass(component.find("emailButton"),"tabClicked");
         $A.util.removeClass(component.find("assetButton"),"tabClicked");
         $A.util.removeClass(component.find("nurturingButton"),"tabClicked");
         $A.util.removeClass(component.find("actionButton"),"tabClicked");
         $A.util.removeClass(component.find("printButton"),"tabClicked");

    },
    printCampTab : function(component,event,helper){
         component.set("v.tabData",component.get('v.printCampaign'));
        $A.util.addClass(component.find("printButton"),"tabClicked");
         $A.util.removeClass(component.find("emailButton"),"tabClicked");
         $A.util.removeClass(component.find("assetButton"),"tabClicked");
         $A.util.removeClass(component.find("nurturingButton"),"tabClicked");
         $A.util.removeClass(component.find("actionButton"),"tabClicked");
         $A.util.removeClass(component.find("contractButton"),"tabClicked");
    },
    quickSend : function(component,event,helper){
        helper.quickSend(component,event,helper);
    }
})