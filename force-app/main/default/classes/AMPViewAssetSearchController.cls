public with sharing class AMPViewAssetSearchController extends MindMatrixAuthHelper {
    
    public static String GetInstallName(){
        if (!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__InstallUrl__c.isAccessible())
            return '';
        MindMatrix__AMPAPIDetailsV2__c api = GetCurrentAPIDetails();
        if(api != null)
            return api.MindMatrix__InstallUrl__c;
        return '';
    }
    
    public static String GetToken(){
        if (!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__Token__c.isAccessible())
            return '';
        MindMatrix__AMPAPIDetailsV2__c api = GetCurrentAPIDetails();
        if(api != null)
            return api.MindMatrix__Token__c;
        return '';
    }
    
    public static MindMatrix__AMPAPIDetailsV2__c GetCurrentAPIDetails() {
        if (!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.isAccessible())
            return null;
        MindMatrix__AMPAPIDetailsV2__c apiDetails = MindMatrix__AMPAPIDetailsV2__c.getOrgDefaults();
        return apiDetails;
    }
    
    public static Id GetAMPAPIDetailsV2_OWD_ID() {
        if (!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.isAccessible())
            return null;
        MindMatrix__AMPAPIDetailsV2__c apiDetails = MindMatrix__AMPAPIDetailsV2__c.getOrgDefaults();
        return apiDetails.Id;
    }
    
    @AuraEnabled
    public static MindMatrix__AMPAPIDetailsV2__c getAPIDetails() {
        return GetCurrentAPIDetails();
    }
    
    @AuraEnabled
    public static List<Profile> getAllProfiles() {
        if(!Schema.sObjectType.PROFILE.fields.Name.isAccessible())
          return null;  
       
        return [SELECT ID,NAME FROM PROFILE limit 1];
    }
    
    @AuraEnabled
    public static string GetPrerequiredData() {
        if(!Schema.sObjectType.PROFILE.fields.Name.isAccessible()&&!Schema.sObjectType.RecordType.fields.Name.isAccessible()&&!Schema.sObjectType.RecordType.fields.DeveloperName.isAccessible()&&!Schema.sObjectType.ListView.fields.DeveloperName.isAccessible()&&!Schema.sObjectType.ListView.fields.Name.isAccessible())
            return '';
        Map<String,Object> results = new Map<String,Object>();
       	results.put('currentapidetails', GetCurrentAPIDetails());
        results.put('mmapiusers', fnGetAPIUsers());
       
        Id owdSettingId = GetAMPAPIDetailsV2_OWD_ID();
        results.put('customsettingrecordid', owdSettingId);
        
        if(owdSettingId == null)
            results.put('usergroupsetting','{}');
        else{
            List<ContentDocumentLink> cdls = [SELECT Id, ContentDocumentId 
                            FROM ContentDocumentLink WHERE LinkedEntityId = :owdSettingId ORDER BY systemModstamp Desc LIMIT 1];
			
            ContentDocumentLink cdl = cdls.size() == 0 ? null : cdls[0];
            if(cdl == null){
                results.put('usergroupsetting','{}');
            }
            else{
                List<ContentVersion> cdvs = [SELECT Id, VersionData 
                            FROM ContentVersion WHERE ContentDocumentId = :cdl.ContentDocumentId ORDER BY CreatedDate Desc LIMIT 1];
                ContentVersion cdv = cdvs.size() == 0 ? null : cdvs[0];
                blob versionData = cdv.VersionData;
                results.put('usergroupsetting',cdv == null ? '{}' :  versionData.toString());
            }
		}
    
        return JSON.serialize(results);
    }
    
    @AuraEnabled
    public static List<RecordType> getAllRecordType() {
        return [SELECT Id,Name,DeveloperName FROM RecordType WHERE IsActive = true WITH SECURITY_ENFORCED limit 1];
    }
    
    @AuraEnabled
    public static Boolean UpdateAPIDetails(string installurl,string token,string json,string eltaes,string elths256)
    {
        
        return UpdateAPIDetailsExtended(installurl,token,json,eltaes,elths256);
    }
    
     @AuraEnabled
    public static List<MindMatrix__AMPAPIDetailsV2__c> getAPIUsers() {
       return fnGetAPIUsers();
    }
    
    public static List<MindMatrix__AMPAPIDetailsV2__c> fnGetAPIUsers() {
        List<MindMatrix__AMPAPIDetailsV2__c> apiDetails=[select id,createdbyid,createdby.name,MindMatrix__InstallUrl__c,MindMatrix__Token__c,MindMatrix__UserToken__c from MindMatrix__AMPAPIDetailsV2__c WITH SECURITY_ENFORCED];
        return apiDetails;
    }
    
    @AuraEnabled
    public static MindMatrix__AMPAPIDetailsV2__c currentUserDetails(String currentUserId) {
        return [select id,createdbyid,MindMatrix__InstallUrl__c,MindMatrix__Token__c,MindMatrix__UserToken__c,MindMatrix__SSOPopupSettings__c from MindMatrix__AMPAPIDetailsV2__c where createdbyid =:currentUserId WITH SECURITY_ENFORCED LIMIT 1 ];
    }
    
    @AuraEnabled
    public static void deleteSelectedUser(String currentUserId) {
        if(!MindMatrix__AMPAPIDetailsV2__c.sObjectType.getDescribe().isDeletable())
          return ; 
       
        MindMatrix__AMPAPIDetailsV2__c apiDetails=[select id,createdbyid,MindMatrix__InstallUrl__c,MindMatrix__Token__c,MindMatrix__UserToken__c,MindMatrix__SSOPopupSettings__c,MindMatrix__JWTCertPassword__c,MindMatrix__JWTClientId__c from MindMatrix__AMPAPIDetailsV2__c where createdbyid =:currentUserId WITH SECURITY_ENFORCED LIMIT 1];
       
       delete apiDetails;
    }
    
    @AuraEnabled
    public static MindMatrix__AMPAPIDetailsV2__c saveUpdatedDetails(MindMatrix__AMPAPIDetailsV2__c currentUserDetails) {
        if(!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__InstallUrl__c.isAccessible()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__Token__c.isAccessible()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__UserToken__c.isAccessible()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__InstallUrl__c.isCreateable()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__Token__c.isCreateable()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__UserToken__c.isCreateable()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__InstallUrl__c.isUpdateable()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__Token__c.isUpdateable()&& !Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__UserToken__c.isUpdateable())
       		return null;
        
        update currentUserDetails;
        return currentUserDetails;
    }
    
    @AuraEnabled
    public static User GetUserDetails()
    {
        try
        {
            String userName = UserInfo.getUserName();
            return [Select Id,Email,Profile.Id From User where Username = : userName WITH SECURITY_ENFORCED limit 1];
        }
        catch(Exception ex)
        {
            return null;
        }
    }
    
    
    @AuraEnabled
    public static Boolean UpdateSettingsForCurrentUser(string usertoken)
    {
         if(!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__InstallUrl__c.isAccessible()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__Token__c.isAccessible()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__GroupJSON__c.isAccessible()&& !Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__UserToken__c.isAccessible()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__SSOPopupMessage__c.isAccessible()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__RecordTypeJSON__c.isAccessible()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__JWTCertPassword__c.isAccessible()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__JWTClientId__c.isAccessible()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__InstallUrl__c.isCreateable()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__Token__c.isCreateable()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__GroupJSON__c.isCreateable()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__UserToken__c.isCreateable()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__SSOPopupMessage__c.isCreateable()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__RecordTypeJSON__c.isCreateable()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__JWTCertPassword__c.isCreateable()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__JWTClientId__c.isCreateable()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__InstallUrl__c.isUpdateable()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__Token__c.isUpdateable()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__GroupJSON__c.isUpdateable()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__UserToken__c.isUpdateable()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__SSOPopupMessage__c.isUpdateable()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__RecordTypeJSON__c.isUpdateable()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__JWTCertPassword__c.isUpdateable()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__JWTClientId__c.isUpdateable())
        return false;
        try
        {
            MindMatrix__AMPAPIDetailsV2__c api = GetCurrentAPIDetails();
            MindMatrix__AMPAPIDetailsV2__c currentUserSettings = MindMatrix__AMPAPIDetailsV2__c.getInstance();
            if(api != null){
                if(currentUserSettings == null)
                    currentUserSettings = new MindMatrix__AMPAPIDetailsV2__c();
                currentUserSettings.MindMatrix__InstallUrl__c = api.MindMatrix__InstallUrl__c;
                currentUserSettings.MindMatrix__Token__c = api.MindMatrix__Token__c;
                currentUserSettings.MindMatrix__GroupJSON__c = api.MindMatrix__GroupJSON__c;
                currentUserSettings.MindMatrix__SSOPopupSettings__c = api.MindMatrix__SSOPopupSettings__c;
                currentUserSettings.MindMatrix__SSOPopupMessage__c = api.MindMatrix__SSOPopupMessage__c;
                currentUserSettings.MindMatrix__UserToken__c = usertoken;
                currentUserSettings.MindMatrix__RecordTypeJSON__c = api.MindMatrix__RecordTypeJSON__c;
                currentUserSettings.MindMatrix__JWTCertPassword__c = api.MindMatrix__JWTCertPassword__c;
                currentUserSettings.MindMatrix__JWTClientId__c = api.MindMatrix__JWTClientId__c;
                upsert currentUserSettings;
                return true;
            }
        }
        catch(Exception ex)
        {
            return false;
        }
        return false;
    }
    
    @AuraEnabled
    public static string GetAMPAutoLoginURL(string crmId,string groupName)
    {
        try
        {
            JSONGenerator gen = JSON.createGenerator(true);
            gen.writeStartObject();
            gen.writeStringField('crmuserid', crmId);
            gen.writeStringField('groupname', groupName);
            gen.writeEndObject();
            String jsonS = gen.getAsString();
            String url = GetInstallName()+'api/ProcessOfficeDepotUser';
            return AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,GetToken());
        }
        catch(Exception ex)
        {
            return ex.getMessage();
        }
    }
    
     @AuraEnabled
    public static string GetUserGroups()
    {
         JSONGenerator gen = JSON.createGenerator(true);
            gen.writeStartObject();
        	gen.writeNumberField('pageSize', 500);
            gen.writeEndObject();
            String jsonS = gen.getAsString();
            String url = GetInstallName()+'api/GetGroups';
        string result= AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,GetToken());
        return result;
    }
    
	@AuraEnabled
    public static list<selectOption> getObjectFields(String objectname) {
        List<SelectOption> fieldNames = new List<SelectOption>();
        fieldNames.add(new SelectOption('','-- Select --'));
        if(!String.isBlank(objectName)){
            Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
            Schema.SObjectType ObjSchema = schemaMap.get(objectName);
            Map<String, Schema.SObjectField> fieldMap = ObjSchema.getDescribe().fields.getMap();
            for (String fieldName: fieldMap.keySet()) 
            {  
                fieldNames.add(new SelectOption(fieldName, fieldMap.get(fieldName).getDescribe().getLabel()));
            }
        }
        return fieldNames;
    } 
    
    @AuraEnabled
    public static string upsertUserGroupSettingInFile(String setting,String installurl,string token) {
        if(!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__InstallUrl__c.isAccessible() && !Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__Token__c.isAccessible()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__Token__c.isCreateable()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__InstallUrl__c.isCreateable()&&!Schema.sObjectType.ContentVersion.fields.Title.isCreateable()&&!Schema.sObjectType.ContentVersion.fields.PathOnClient.isCreateable()&&!Schema.sObjectType.ContentVersion.fields.VersionData.isCreateable()&&!Schema.sObjectType.ContentVersion.fields.origin.isCreateable())
            return '';
        
        Id linkedEntityId = GetAMPAPIDetailsV2_OWD_ID();
        if(linkedEntityId == null){
            MindMatrix__AMPAPIDetailsV2__c api = new  MindMatrix__AMPAPIDetailsV2__c();
            api.MindMatrix__InstallUrl__c=installurl;
            api.MindMatrix__Token__c=token;
            insert api;
            linkedEntityId = GetAMPAPIDetailsV2_OWD_ID();
        }
        Map<String,Object> results = new Map<String,Object>();
        
        if(linkedEntityId == null)
        {
            results.put('success',false);
            results.put('message','Unable to save the MM API Details, Please contact MindMatrix Admin');
            return JSON.serialize(results);
        }
        
        Blob bodyBlob=Blob.valueOf(setting);
        
        ContentVersion cv = new ContentVersion(
            Title='MM User Group Setting Json', 
            PathOnClient ='MMUserGroupSetting.json',
            VersionData = bodyBlob,
            origin = 'H');
        insert cv;
        
        List<ContentVersion> cv2s = [SELECT Id, Title, ContentDocumentId 
                                                 FROM ContentVersion WHERE Id = :cv.Id LIMIT 1];
        
        ContentVersion cv2 = cv2s.size() == 0 ? null : cv2s[0];
        
        if(cv2 == null){
            results.put('success',false);
            results.put('message','Unable to save the Content Version for the User Group Settings, Please contact MindMatrix Admin');
            return JSON.serialize(results);
        }
        
        
        
        ContentDocumentLink contentlink = new ContentDocumentLink();
        contentlink.LinkedEntityId = linkedEntityId;
        contentlink.ContentDocumentId  = cv2.ContentDocumentId;
        contentlink.ShareType = 'V';
        contentlink.Visibility = 'AllUsers';
        insert contentlink;
        
        results.put('success',true);
        results.put('message','User Group Settings successfully saved in the Content Version');
        results.put('contentversionid', cv2.Id);
        
        return JSON.serialize(results);
    }
   
    
    public class SelectOption {
        public SelectOption(String value, String label) {
            this.value = value;
            this.label = label;
            
        }
        @AuraEnabled
        public String label { get;set; }
        @AuraEnabled
        public String value { get;set; }
	} 
    
    @AuraEnabled
    public static List<MindMatrix__AMPAPIDetailsV2__c> deleteAllUsers(List<string> userIds)
    {
		List<MindMatrix__AMPAPIDetailsV2__c> apiDetails=[select id,createdbyid,MindMatrix__InstallUrl__c,MindMatrix__Token__c,MindMatrix__UserToken__c,MindMatrix__SSOPopupSettings__c,MindMatrix__JWTCertPassword__c,MindMatrix__JWTClientId__c from MindMatrix__AMPAPIDetailsV2__c where id in:userIds];
        delete apiDetails;
        return apiDetails;
    }
    
}