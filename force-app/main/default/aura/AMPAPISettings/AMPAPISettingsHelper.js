({
    elt_aes:'',
    elt_hs256:'',
    LISTOFUSERGROUPMAPPING:[{k:'',v:''}],
    LISTOFCRMUSERGROUPMAPPING:[{k:'',v:''}],
    GetPrerequiredData : function(component, event, helper) {
        var action = component.get("c.GetPrerequiredData");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var data = JSON.parse(response.getReturnValue());
                if(data.usergroupsetting=='{}'){
                  component.set("v.toggleSpinner", false);
                  component.set("v.toggleCrmSpinner",false);
                }
                helper.bindPreRequiredResponse(component, event, helper, data);
                
            }
        });
        $A.enqueueAction(action);
    },
    
    getGroup : function(component, event, helper,values){
        var action = component.get("c.GetUserGroups");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var data = JSON.parse(response.getReturnValue());
                if(data.result.item != undefined){
                var userGroupsResult = data.result.item;
                userGroupsResult.unshift({"name":"--select--"});
                component.set('v.getUserGroupValues',data.result.item);
                //component.set('v.getUserGroupCrmValues',data.result.item);
                if(values != undefined){
                    var valuesgroupmapping =values;
                    if(valuesgroupmapping.length >= 0){
                        for(var i=0;i < valuesgroupmapping.length;i++){
                            helper.LISTOFUSERGROUPMAPPING.push(valuesgroupmapping[i]);
                        }
                        helper.LISTOFUSERGROUPMAPPING.shift();
                    }
                    component.set('v.valueGroupMapping',helper.LISTOFUSERGROUPMAPPING);
                }
              component.set("v.toggleSpinner", false);
              //component.set("v.toggleCrmSpinner",false);
            }
            }
        });
        $A.enqueueAction(action);
    },
    getCrmGroup : function(component, event, helper,values){
        var action = component.get("c.GetUserGroups");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var data = JSON.parse(response.getReturnValue());
                if(data.result.item != undefined){
                var userGroupsResult = data.result.item;
                userGroupsResult.unshift({"name":"--select--"});
                //component.set('v.getUserGroupValues',data.result.item);
                component.set('v.getUserGroupCrmValues',data.result.item);
                if(values != undefined){
                    var valuesgroupmapping =values;
                    if(valuesgroupmapping.length >= 0){
                        for(var i=0;i < valuesgroupmapping.length;i++){
                            helper.LISTOFCRMUSERGROUPMAPPING.push(valuesgroupmapping[i]);
                        }
                        helper.LISTOFCRMUSERGROUPMAPPING.shift();
                    }
                    component.set('v.valueCrmGroupMapping',helper.LISTOFCRMUSERGROUPMAPPING);
                }
              //component.set("v.toggleSpinner", false);
              component.set("v.toggleCrmSpinner",false);
            }
            }
        });
        $A.enqueueAction(action);
    },
    
    
    bindPreRequiredResponse : function(component, event, helper, data){
        component.set('v.recordId',data.customsettingrecordid);
        //component.set("v.mmAPIUser",data.mmapiusers);
        helper.PaginationApiUser(component,event,helper,data);
        helper.bindUserGroupSetting(component,event,helper,data.usergroupsetting);
        helper.bindCurrentAPIDetails(component, event, helper, data.currentapidetails);
    },
    bindUserGroupSetting : function(component, event, helper, usergroupsetting) {
        
        component.set('v.valueGroupMapping',helper.LISTOFUSERGROUPMAPPING);
        component.set('v.valueCrmGroupMapping',helper.LISTOFCRMUSERGROUPMAPPING)
        if(usergroupsetting == '{}' )
        {
            component.set("v.toggleSpinner", false);
            component.set("v.toggleCrmSpinner",false);
            return;
        }
            
        
        var jo = usergroupsetting;
        if(jo != '' && jo != undefined && jo != '{}'){
            component.set("v.toggleSpinner", true);
            component.set("v.toggleCrmSpinner",true);
            var userJO = JSON.parse(jo);
            component.set('v.valueCheckBox',userJO.checkBox);
            component.set('v.valueCrmCheckBox',userJO.crmcheckBox);
            component.set('v.selectedCrmObjectValue',userJO.crmobjectName);
            component.set('v.selectedObjectValue',userJO.objectName);
            helper.getFieldsForSelectedObject(component, event, helper,userJO.objectName, userJO.fieldName,userJO.values);
            helper.getFieldsForSelectedCrmObject(component, event, helper,userJO.crmobjectName, userJO.crmfieldName,userJO.crmvalues);
            /*var valuesgroupmapping =userJO.values;
            
                if(valuesgroupmapping.length >= 0){
                    for(var i=0;i < valuesgroupmapping.length;i++){
                        helper.LISTOFUSERGROUPMAPPING.push(valuesgroupmapping[i]);
                    }
                    helper.LISTOFUSERGROUPMAPPING.shift();
                }
                component.set('v.valueGroupMapping',helper.LISTOFUSERGROUPMAPPING);*/
           
        }
        
    },
    getFieldsForSelectedObject:function(component,event,helper, objectName, selectedValue,values){
        var objectfileds = component.get("c.getObjectFields");
        objectfileds.setParams({
            objectname :objectName
        });
        objectfileds.setCallback(this,function(response){
         var state = response.getState();
            if(state === "SUCCESS"){
                var response = response.getReturnValue();
                component.set("v.fieldsName",response);
                //component.set("v.fieldscrmName",response);
                if(selectedValue != null)
                {
                    setTimeout(function(){
                        component.set('v.selectedfieldName',selectedValue);
                        //component.set('v.selectedCrmfieldName',selectedValue);
                    },100);
                    
                }
                
                helper.getGroup(component,event,helper,values);
            }
                                               
        });
        $A.enqueueAction(objectfileds);
    },
     getFieldsForSelectedCrmObject:function(component,event,helper, objectName, selectedValue,values){
        var objectfileds = component.get("c.getObjectFields");
        objectfileds.setParams({
            objectname :objectName
        });
        objectfileds.setCallback(this,function(response){
         var state = response.getState();
            if(state === "SUCCESS"){
                var response = response.getReturnValue();
                //component.set("v.fieldsName",response);
                component.set("v.fieldscrmName",response);
                if(selectedValue != null)
                {
                    setTimeout(function(){
                        //component.set('v.selectedfieldName',selectedValue);
                        component.set('v.selectedCrmfieldName',selectedValue);
                    },100);
                    
                }
                
                helper.getCrmGroup(component,event,helper,values);
            }
                                               
        });
        $A.enqueueAction(objectfileds);
    },
    compareStrings:function(a, b) {
        // Assuming you want case-insensitive comparison
        a = a.toLowerCase();
        b = b.toLowerCase();
        
        return (a < b) ? -1 : (a > b) ? 1 : 0;
    },
    bindCurrentAPIDetails : function(component, event, helper, data) {
        var installurl = '';
        var token = '';
        var userJOSTR = '';
        var message = '';
        var popupsettings = '';
        var recordTypeSTR = '';
        var eltaes = '';
        var elths256 ='';
        if(data != null){
            installurl = data.MindMatrix__InstallUrl__c;
            token = data.MindMatrix__Token__c;
            userJOSTR = data.MindMatrix__GroupJSON__c;
            message = data.MindMatrix__SSOPopupMessage__c;
            popupsettings = data.MindMatrix__SSOPopupSettings__c;
            recordTypeSTR = data.MindMatrix__RecordTypeJSON__c;
            eltaes= data.MindMatrix__JWTCertPassword__c;
            elths256 = data.MindMatrix__JWTClientId__c;
            helper.elt_aes=data.MindMatrix__JWTCertPassword__c;
            helper.elt_hs256=data.MindMatrix__JWTClientId__c;
        }
        if(installurl != undefined && installurl != '')
            $("#installurl").html("("+installurl+"*)");
        component.set("v.installurl",installurl);
        component.set("v.token",token);
        if(eltaes != ''&& eltaes !=  undefined )
            component.set("v.eltaes","**********");
        if(elths256 != '' && elths256 != undefined )
            component.set("v.elths256","**********");
    },
    UpdateAPIDetails:function(component,event,helper,jo){
        var action = component.get("c.UpdateAPIDetails");
        action.setParams(jo);
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var data = response.getReturnValue();
                if(data){
                    helper.showToast(component,event,helper,true,'MM api settings updated successfully');
                }
                else
                    helper.showToast(component,event,helper,false,'Problem while saving MM api settings');
            }
        });
        $A.enqueueAction(action);
    },
    showToast : function(component, event, helper,status,message) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title: status?"Success":"Failed",
            message: message,
            type:status?"success":'error'
        });
        toastEvent.fire();
    },
    onEdit : function(component,event,helper,currentUserId){
        var action = component.get("c.currentUserDetails");
        action.setParams({
            currentUserId:currentUserId
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                component.set("v.isEdit",true);
                var data = response.getReturnValue();
                //data['tosredirecturl']=JSON.parse(data.MindMatrix__SSOPopupSettings__c).tosredirecturl;
                component.set('v.currentUserDetails',data);
            }
        });
        $A.enqueueAction(action);
    },
    OnDelete : function(component,event,helper,currentUserId){
        var action = component.get("c.deleteSelectedUser");
        action.setParams({
            currentUserId:currentUserId
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title : 'Success',
                    message: 'API user deleted Successfully',
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'success',
                    mode: 'dismissible'
                });
                toastEvent.fire();
            }
            $A.get('e.force:refreshView').fire();
        });
        $A.enqueueAction(action);
        helper.GetPrerequiredData(component,event,helper);
    },
    OnSave : function(component,event,helper){
        var action = component.get("c.saveUpdatedDetails");
        var data=component.get("v.currentUserDetails");
        action.setParams({
            currentUserDetails:data
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                component.set("v.isEdit",false);
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title : 'Success',
                    message: 'API user saved successfully',
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'success',
                    mode: 'dismissible'
                });
                toastEvent.fire();
            }
        });
        $A.enqueueAction(action);
    },
    checkAndSaveTabValidity:function(component,event,helper, tabId){
        if(tabId == 'apisettings'){
            return helper.checkAndSaveAPISettings(component,event,helper);
        }
        else if(tabId == 'usergroupsettings'){
            return helper.checkAndSaveUserGroupSettings(component,event,helper);
        }
            else if(tabId == 'jwtSettings'){
                return helper.checkAndSaveJWTSettings(component,event,helper);
            }
    },
    checkAndSaveAPISettings:function(component,event,helper)
    {
        var installurl = component.find('fieldinstallurl');
        if(installurl == undefined){
            return false;
        }
        
        if(!installurl.get("v.validity").valid)
            return false;
        else
            component.set("v.installurl",installurl.get("v.value"));
        var tokenvar = component.find('fieldtoken');
        if(!tokenvar.get("v.validity").valid)
            return false;
        else
            component.set("v.token",tokenvar.get("v.value"));
        //if(installurl.get("v.value") != null  && installurl.get("v.value") != null)
        	helper.saveApiDetails(component,event,helper,'');
        return true;
    },
    checkAndSaveUserGroupSettings:function(component, event, helper){
        var selectedObject = component.find('groupObject');
        var selectedCrmObject = component.find('groupCrmObject');
        if(selectedObject == undefined || selectedCrmObject  == undefined){
            return false;
        }
        if(!selectedObject.get("v.validity").valid && !selectedCrmObject.get("v.validity").valid)
            return false;
        else{
            component.set("v.selectedObjectName",selectedObject.get("v.value"));
            component.set("v.selectedCrmObjectName",selectedCrmObject.get("v.value"));}
        
        var selectedCrmField = component.find('groupCrmObjectField');
        var selectedField = component.find('groupObjectField');
        if(!selectedField.get("v.validity").valid && !selectedCrmField.get("v.validity").valid)
            return false;
        else{
            component.set("v.selectedfieldName",selectedField.get("v.value"));
            component.set("v.selectedCrmfieldName",selectedCrmField.get("v.value"));}
        
        var groupMapping = component.get('v.valueGroupMapping');
        var crmGroupMapping = component.get('v.valueCrmGroupMapping');
        if(groupMapping.length == 0 || crmGroupMapping == 0)
            return false;
        
        if(groupMapping.length == 1 || crmGroupMapping.length == 1)
        {
            if((groupMapping[0].k == '' || groupMapping[0].v == '') && (crmGroupMapping[0].k == '' || crmGroupMapping[0].v == ''))
                return false;
           
        }
        
        return true;
        
    },
    checkAndSaveJWTSettings:function(component, event, helper){
        var eltaes = component.find('elt_aes');
        if(eltaes == undefined){
            return false;
        }
        if(!eltaes.get("v.validity").valid)
            return false;
        
        var elths256 = component.find('elt_hs256');
        if(!elths256.get("v.validity").valid)
            return false;
        
        var eltaesValue = eltaes.get("v.value");
        var elths256value = elths256.get("v.value");
        
        if(eltaesValue!='' && elths256value!='' ){
            if(eltaesValue!="**********" && elths256value!="**********"){
                helper.elt_aes=eltaesValue;
                helper.elt_hs256=elths256value;
            }
        }
        //helper.saveApiDetails(component,event,helper,'');
        return true;
        
    },
    uploadFileWithUGSetting:function(component, event, helper, ugSetting){
        var action = component.get("c.upsertUserGroupSettingInFile");
        action.setParams({
            setting:ugSetting,
            installurl:component.get('v.installurl'),
            token:component.get("v.token")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var response = JSON.parse(response.getReturnValue());
                if(response.success){
                    helper.showToast(component,event,helper,'Success',response.message);
                    var isJWTTabValid = helper.checkAndSaveTabValidity(component, event, helper, 'jwtSettings');
                    if(!isJWTTabValid){
                        component.find("settingstabs").set("v.selectedTabId","jwtSettings");
                        return false;
                    }  
                    helper.saveApiDetails(component,event,helper,response.contentversionid);
                    
                }
                else{
                    helper.showToast(component,event,helper,'Failed',response.message);
                }
                //
            }
        });
        $A.enqueueAction(action);
    },
    saveApiDetails : function(component,event,helper,contentversionid){
        var jo = {installurl:component.get('v.installurl'),token:component.get("v.token"),json:contentversionid,eltaes:helper.elt_aes,elths256:helper.elt_hs256};
        helper.UpdateAPIDetails(component,event,helper,jo);
    },
    PaginationApiUser: function(component, event, helper,data){
    	var Userlist = data.mmapiusers; 
        var pageSize = component.get("v.pageSize");;
        var pageNumber = component.get("v.pageNumber");
        var PaginationList = [];
        var totalPages = Math.ceil(Userlist.length/pageSize);       
        component.set("v.end",pageSize-1);
            for(var i=0;i<=pageSize-1; i++){ 
            	PaginationList.push(Userlist[i]);   
            }
            if(pageNumber==1){
                component.set("v.bDisableFirst",true);
            }
            if (pageNumber == 1 && totalPages == 1){
                component.set("v.bDisableFirst",true);
                component.set("v.bDisableLast",true);
            }
        	if(Userlist.length == 0 || Userlist.length == 1){
                component.set("v.unableCheckBox",true);
            }
            if(Userlist.length > 10){
                component.set("v.paginationButton",true);
            }
        	if(Userlist.length != 0){
                component.set("v.deleteVisibility",true);
            }
            component.set("v.ApiUserList",Userlist);    
            component.set("v.mmAPIUser",PaginationList);    
            component.set("v.totalPages",totalPages);
            component.set("v.pageNumber",pageNumber);
            component.set("v.totalRecords",Userlist.length);
    }, 
    
})