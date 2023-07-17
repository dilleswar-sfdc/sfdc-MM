({
    doInit : function(component, event, helper) {
	// work on component init..
       
	},
    scriptLoaded : function(component, event, helper) {
        helper.APIDetails = $('.APIDetails');
        helper.GetPrerequiredData(component, event, helper);
    },
    externalClick : function(component,event,helper){
        $A.util.addClass(component.find('externaltab'), 'slds-is-active');
        $A.util.addClass(component.find('externalContent'), 'slds-show');
        $A.util.removeClass(component.find('externalContent'), 'slds-hide');
        $A.util.removeClass(component.find('internaltab'), 'slds-is-active');
        $A.util.removeClass(component.find('internalContent'), 'slds-show');
        $A.util.addClass(component.find('internalContent'), 'slds-hide');
    },
    internalClick : function(component,event,helper){
        $A.util.addClass(component.find('internaltab'), 'slds-is-active');
        $A.util.addClass(component.find('internalContent'), 'slds-show');
        $A.util.removeClass(component.find('internalContent'), 'slds-hide');
        $A.util.removeClass(component.find('externaltab'), 'slds-is-active');
        $A.util.removeClass(component.find('externalContent'), 'slds-show');
        $A.util.addClass(component.find('externalContent'), 'slds-hide');
    },
    saveapidetails:function(component, event, helper)
    {   
        var isAPITabValid = helper.checkAndSaveTabValidity(component, event, helper, 'apisettings');
        if(!isAPITabValid){
            component.find("settingstabs").set("v.selectedTabId","apisettings");
            return false;
        }
        
        /*var isjwtvalid = helper.checkAndSaveTabValidity(component, event, helper, 'jwtSettings');
        if(!isjwtvalid){
            component.find("settingstabs").set("v.selectedTabId","jwtSettings");
            return false;
        }*/

		var isUserGroupTabValid = helper.checkAndSaveTabValidity(component, event, helper, 'usergroupsettings');
        if(!isUserGroupTabValid){
            component.find("settingstabs").set("v.selectedTabId","usergroupsettings");
            return false;
        }
     
         var userGroupJO = {
             objectName:component.get('v.selectedObjectName'),
             fieldName:component.get('v.selectedfieldName'),
             values:component.get('v.valueGroupMapping'),
             checkBox:component.get('v.valueCheckBox'),
             crmobjectName:component.get('v.selectedCrmObjectName'),
             crmfieldName:component.get('v.selectedCrmfieldName'),
             crmvalues:component.get('v.valueCrmGroupMapping'),
             crmcheckBox:component.get('v.valueCrmCheckBox')
         };
        var userGroupCrmJO = {
             
         };
     	
        helper.uploadFileWithUGSetting(component, event, helper, JSON.stringify(userGroupJO));
        
     	
    },
    saveapidetailsold:function(component, event, helper)
    {   
        
        
        var installurlvalue = '';
        var tokenvalue = '';
        
        var installurl = component.find('fieldinstallurl');
        if(!installurl.get("v.validity").valid)
            return false;
        else
            installurlvalue = installurl.get("v.value");
        var tokenvar = component.find('fieldtoken');
        if(!tokenvar.get("v.validity").valid)
            return false;
        else
            tokenvalue = tokenvar.get("v.value");
        
        var selectedSuperAdminList = component.get("v.selectedSuperAdminList");
        var selectedTabID = component.find("settingstabs").get("v.selectedTabId");
        //if(selectedTabID != "usergroupsettings" && (selectedSuperAdminList.length == 0))
        if(selectedTabID != "usergroupsettings" && selectedTabID != "jwtSettings"  )
        {
            component.find("settingstabs").set("v.selectedTabId","usergroupsettings");
            
            try{
                setTimeout(function(){ 
                    try{
                        component.find("selectSuperAdmin").getElement().focus();
                    }catch(e){}
                }, 100);
            }
            catch(e){}
            return;
        }
        if(selectedTabID != "jwtSettings" && (selectedSuperAdminList.length > 0)&& selectedTabID != "apisettings")
        {
            component.find("settingstabs").set("v.selectedTabId","jwtSettings");
            
            try{
                setTimeout(function(){ 
                    try{
                        
                    }catch(e){}
                }, 100);
            }
            catch(e){}
            return;
        }
        
        var superAdminGroup = selectedSuperAdminList;
        if(selectedTabID == "usergroupsettings"){
            var object = component.find("groupObject");
            //var selectSuperAdmin = component.find('selectSuperAdmin');
            //if(!selectSuperAdmin.get("v.validity").valid){
            //    component.find("settingstabs").set("v.selectedTabId","usergroupsettings");
            //    try{
            //        setTimeout(function(){ 
            //            try{
            //                component.find("selectSuperAdmin").getElement().focus();
            //            }catch(e){}
           //         }, 100);
           //     }
           //     catch(e){}
           //     return false;	
          //  }
          //  else
          //      superAdminGroup = selectSuperAdmin.get("v.value");
        }
        
        var userJO = {superadmin:superAdminGroup};
        component.set("v.installurl",installurlvalue);
        component.set("v.token",tokenvalue);
        var userJOSTR = JSON.stringify(userJO);
        if(userJOSTR.length > 250)
        {
            helper.showToast(component, event, helper,false,'Remove one profile and try saving');
            return;
        }
        try{
            var selectedRecordTypeList = component.find("selectRecordType");
            var recordTypeList = selectedRecordTypeList.get("v.value");
            var recordTypeJO = recordTypeList;
            
            var pipelinedlistviewObj = component.find("pipelinedlistview");
            var pipelinedlistview = pipelinedlistviewObj.get("v.value");
            if(pipelinedlistview == "-1")
                pipelinedlistview = "";
            var wonlistviewObj = component.find("wonlistview");
            var wonlistview = wonlistviewObj.get("v.value");
            if(wonlistview == "-1")
                wonlistview = "";
            var alllistviewObj = component.find("alllistview");
            var alllistview = alllistviewObj.get("v.value");
            if(alllistview == "-1")
                alllistview = "";
            var recordTypeJOSTR = JSON.stringify({rts:recordTypeJO,plv:pipelinedlistview,wlv:wonlistview,alv:alllistview});
            if(recordTypeJOSTR.length > 250)
            {
                helper.showToast(component, event, helper,false,'Remove one record type and try saving');
                return;
            }
        }
        catch(e){}
        
        var message = component.get("v.createusermessage");
        if(message.length > 250)
        {
            helper.showToast(component, event, helper,false,'Message is too long, max character allowed is 250');
            return;
        }
        var title = component.get("v.createusertitle").trim();
        var btntxt = component.get("v.createuserbuttontext").trim();
        var brclr = component.get("v.createuserbordercolor").trim();
        var txtclr = component.get("v.createusertextcolor").trim();
        var btnbgclr = component.get("v.createuserbuttonbackgroundcolor").trim();
        var btnbrclr = component.get("v.createuserbuttonbordercolor").trim();
        var btntxtclr = component.get("v.createuserbuttontextcolor").trim();
        
        var popupsettings = {title:title,btntxt:btntxt,brclr:brclr,txtclr:txtclr,btnbgclr:btnbgclr,btnbrclr:btnbrclr,btntxtclr:btntxtclr};
        var popupsettingsSTR = JSON.stringify(popupsettings);
        if(popupsettingsSTR.length > 250)
        {
            helper.showToast(component, event, helper,false,'Title is too long, try removing some characters');
            return;
        }
        if(selectedTabID == "jwtSettings"){
            if(component.get("v.eltaes") == '' && component.get('v.elths256') == ''){
                helper.showToast(component, event, helper,false,'Mandatory fields are required');
                return;
            }
            var eltaes = component.find('elt_aes').get('v.value');
            var elths256 = component.find('elt_hs256').get('v.value');
            if(eltaes!='' && elths256!='' ){
                if(eltaes!="**********" && elths256!="**********"){
                 helper.elt_aes=eltaes;
                    helper.elt_hs256=elths256;
                }
            }
       	
        }
        var jo = {recordtypelist:recordTypeJOSTR,popupsettings:popupsettingsSTR,message:message,installurl:installurlvalue,token:tokenvalue,json:component.get('v.jsonFileText'),eltaes:helper.elt_aes,elths256:helper.elt_hs256};
        helper.UpdateAPIDetails(component,event,helper,jo);
    },
    handleBlur: function (component, event) {
        var inputCmp = component.find("fieldinstallurl");
         var inputValue = component.get("v.installurl");
        if(inputValue.charAt(inputValue.length-1) == '/')
            inputCmp.setCustomValidity(""); //reset error
   		else
            inputCmp.setCustomValidity("Enter a valid URL for eg: https://example.amp.vg/");
        inputCmp.reportValidity();
        /*var installurl = component.find('fieldinstallurl');
        if(!installurl.get("v.validity").valid)
            $("#installurl").html("");
        else
            $("#installurl").html("("+installurl.get("v.value")+"/*)");*/
    },
    handleSalesChange: function (component, event, helper) {
        var selectedValues = event.getParam("value");
        component.set("v.selectedSalesList", selectedValues);
    },
    handleSuperAdminChange: function (component, event, helper) {
        var selectedValues = event.getParam("value");
        component.set("v.selectedSuperAdminList", selectedValues);
    },
    handleRecordTypeChange: function (component, event, helper) {
        var selectedValues = event.getParam("value");
        component.set("v.selectedRecordTypeList", selectedValues);
    },
    onEdit : function(component,event,helper){
        var currentUserId = event.currentTarget.getAttribute('id');
        helper.onEdit(component,event,helper,currentUserId);
        
    },
     OnDelete : function(component,event,helper){
        //var currentUserId = event.currentTarget.getAttribute('id');
        helper.OnDelete(component,event,helper,component.get('v.partnerid'));
          component.set('v.showConfirmDialog', false);
    },
    OnSave : function(component,event,helper){
       // var currentUserId = event.currentTarget.getAttribute('id');
        helper.OnSave(component,event,helper);
       
    },
    closeModel : function (component,event,helper){
        component.set("v.isEdit",false);
    },
    onChange:function (component,event,helper){
         var objectName = component.find('groupObject').get('v.value');
       	component.set('v.selectedObjectName',objectName);
        helper.getFieldsForSelectedObject(component,event,helper, objectName, null);
    },
    onChangeField :function (component,event,helper){
         var objectfieldName = component.find('groupObjectField').get('v.value');
       	component.set('v.selectedfieldName',objectfieldName);
    },
    selectChange :function (component,event,helper){
        var value = event.getSource().get("v.checked");
        component.set('v.valueCheckBox',value);
    },
    addMoreGroupMapping :function (component,event,helper){
        
            helper.LISTOFUSERGROUPMAPPING.push({k:'',v:''});
            component.set('v.valueGroupMapping',helper.LISTOFUSERGROUPMAPPING);
        
    },
    onCrmChange:function (component,event,helper){
         var objectName = component.find('groupCrmObject').get('v.value');
       	component.set('v.selectedCrmObjectName',objectName);
        helper.getFieldsForSelectedCrmObject(component,event,helper, objectName, null);
    },
    onCrmChangeField :function (component,event,helper){
         var objectfieldName = component.find('groupCrmObjectField').get('v.value');
       	component.set('v.selectedCrmfieldName',objectfieldName);
    },
    selectCrmChange :function (component,event,helper){
        var value = event.getSource().get("v.checked");
        component.set('v.valueCrmCheckBox',value);
    },
    addMoreGroupCrmMapping :function (component,event,helper){
        
            helper.LISTOFCRMUSERGROUPMAPPING.push({k:'',v:''});
            component.set('v.valueCrmGroupMapping',helper.LISTOFCRMUSERGROUPMAPPING);
        
    },
    handleUploadFinished:function (component,event,helper){
        var uploadedFiles = event.getParam("files");
        uploadedFiles.forEach(file => console.log(file.name));
        
    },
   handleFilesChange:function(component,event,helper){
    	var fileName = 'No File Selected..';
        var fileOutput = {};
        if (event.getSource().get("v.files").length > 0) {
            var file = event.getSource().get("v.files")[0];
            fileName = file['name'];
            var reader = new FileReader();
            reader.onload = function(e) {
                var contents = e.target.result;
                fileOutput = JSON.parse(contents);
                console.log(fileOutput);
                component.set('v.jsonFileText', JSON.stringify(fileOutput)); 
                component.set("v.fileName", fileName);
            }
            reader.readAsText(file);
			}
        },
    
    handleSelectAllContact: function(component, event, helper) {
        var getID = component.get("v.ApiUserList");
        var checkConValue = component.find("selectAll").get("v.value");        
        var checkContact = component.find("checkContact"); 
        if(checkConValue == true){
            for(var i=0; i<checkContact.length; i++){
              if(checkContact[i] != undefined)
                    checkContact[i].set("v.value",true);            
            }
        }
        else{ 
            for(var i=0; i<checkContact.length; i++){
                if(checkContact[i] != undefined)
                    checkContact[i].set("v.value",false);
            }
        }
    },
    onDeleteAllRecords:function(component, event, helper) {
        var selectedContacts = [];
        var checkValue = component.find("checkContact");

        if(!Array.isArray(checkValue)){
            if (checkValue.get("v.value") == true) {
                selectedContacts.push(checkValue.get("v.text"));
            }
        }else{
            for (var i = 0; i < checkValue.length; i++) {
                if (checkValue[i].get("v.value") == true) {
                    selectedContacts.push(checkValue[i].get("v.text"));
                }
            }
        }
        var action = component.get("c.deleteAllUsers");
        action.setParams({
            userIds:selectedContacts
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title : 'Success',
                    message: 'API users deleted Successfully',
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'success',
                    mode: 'dismissible'
                });
                toastEvent.fire();
            }
         $A.get('e.force:refreshView').fire();
         helper.GetPrerequiredData(component,event,helper);
         component.set('v.showConfirmDialog', false);
        });
        $A.enqueueAction(action);
    },
     handleConfirmDialog : function(component, event, helper) {
        component.set('v.showConfirmDialog', true);
		var btnValue = event.target.getAttribute('id');
        if(btnValue == "DeleteAll"){
            component.set('v.showConfirmDialogForIcon',false);
            //var a = component.get('c.handleSelectAllContact');
        	//$A.enqueueAction(a);
        }
        else{
            component.set('v.partnerid',btnValue);
           component.set('v.showConfirmDialogForIcon',true);
        }
    },
    handleConfirmDialogNo : function(component, event, helper) {
        component.set('v.showConfirmDialog', false);
    },
    
    firstPage: function(component, event, helper) {
        var userList = component.get("v.ApiUserList");
        var PageSize = component.get("v.pageSize");
        var PaginationList = [];
        var pagenumber = 1;
        for(var i= 0; i < PageSize ; i++){
                PaginationList.push(userList[i]);
            }
        if(pagenumber==1){  
            component.set("v.bDisableFirst",true);
            component.set("v.bDisableLast",false);
        } 
        component.set("v.pageNumber", pagenumber); 
        component.set("v.mmAPIUser", PaginationList);
        component.set("v.end",PageSize-1);
        component.set("v.Start",0);       
    },
    
    nextPage: function(component, event, helper) {
        var userList = component.get("v.ApiUserList");
        var end = component.get("v.end"); 
        var Start = component.get("v.Start");               
        var PageSize = component.get("v.pageSize");
        var PaginationList = [];
        var counter = component.get("v.counter");
        var next = component.get("v.pageNumber");
        var nextpage = next + 1;
        var totalPage = component.get("v.totalPages");
        
        for(var i=end+1; i<end+PageSize+1 ; i++){
            if(userList.length > end){
            	PaginationList.push(userList[i]);
                counter++;
            }
        }
        Start = Start + counter;        
        end = end + counter;
        if(nextpage==totalPage){
            component.set("v.bDisableLast",true); 
        }
        if(next!=totalPage){
           component.set("v.bDisableFirst",false);
        }
        component.set("v.pageNumber",nextpage);
        component.set("v.Start",Start);
		component.set("v.end",end);
		component.set("v.mmAPIUser", PaginationList);
       
    },
     
    previousPage: function(component, event, helper) {
    	var userList = component.get("v.ApiUserList");
        var end = component.get("v.end");
        var Start = component.get("v.Start");
        var PageSize = component.get("v.pageSize");
        var totalpage = component.get("v.totalPages");
        var PaginationList = [];
        var counter = component.get("v.counter");
        var previous = component.get("v.pageNumber");
        var previouspage = previous - 1;
            for(var i= Start-PageSize; i < Start ; i++){
            if(i > -1) 
            {
                PaginationList.push(userList[i]);
                counter++;
            }
            else {
            Start++; 
            }
            if(previouspage==1){
            	component.set("v.bDisableFirst",true);        
            }
            if(previouspage!=totalpage){
            	component.set("v.bDisableLast",false);		         
            }
		}
        Start = Start - counter;
        end = end - counter;
        component.set("v.pageNumber",previouspage);
        component.set("v.Start",Start);
		component.set("v.end",end);
		component.set("v.mmAPIUser", PaginationList);
	},
    
    lastPage: function(component, event, helper) {
        var userList = component.get("v.ApiUserList");
        var PageSize = component.get("v.pageSize");
        var totalrecords = component.get("v.totalRecords");
        var PaginationList = [];
        var totalpage = component.get("v.totalPages");
        var pageNumber = component.get("v.totalPages");
        var Start = pageNumber*PageSize-10;
        var end = pageNumber*PageSize-1;
        
        for(var i=pageNumber*PageSize-10; i<pageNumber*PageSize; i++){
            PaginationList.push(userList[i]);
        }
        component.set("v.bDisableFirst",false);	
		component.set("v.bDisableLast",true);  
        component.set("v.mmAPIUser", PaginationList);
        component.set("v.pageNumber",pageNumber);
        component.set("v.end",end);
        component.set("v.Start",Start);
               
    },
    
})