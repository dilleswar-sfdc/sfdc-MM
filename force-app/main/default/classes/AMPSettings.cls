public with sharing class AMPSettings {
    public static string GetUserGroupNameForNonVersioningUser(string profileId)
    {
        String groupname = 'Sales';
        if (!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c .fields.MindMatrix__GroupJSON__c.isAccessible()){
            return groupname;
        } 
        MindMatrix__AMPAPIDetailsV2__c apiDetails = MindMatrix__AMPAPIDetailsV2__c.getOrgDefaults();
        if(apiDetails == null)
            return groupname;
        
        string jsonStr = apiDetails.MindMatrix__GroupJSON__c;
        if (jsonStr != null && jsonStr != 'undefined' && jsonStr.IndexOf(profileId) != -1)
        {
            groupname='Super Admin';
        }
        return groupname;
    }
    
    
    public static String GetUserGroupNameForVersioningUser(User user, MindMatrixMiscHelper.versiondata versionData) {
        
        string sfName = '';
        string groupName = 'Sales';
        
        try{
            if(versionData.objectName == null && user == null)
                return groupName;
            
            if(user.Contact != null && versionData.objectName == 'Contact'){
                sfName = (string)(user.Contact.get(versionData.fieldName));}
            else if(user.Account != null && versionData.objectName == 'Account'){
                sfName = (string)(user.Account.get(versionData.fieldName));}
            else if(user.Profile != null && versionData.objectName == 'Profile'){
                sfName = (string)(user.Profile.get(versionData.fieldName));}
            else if(user.UserRole != null && versionData.objectName == 'UserRole'){
                sfName = (string)(user.UserRole.get(versionData.fieldName));}
            else{
                if(user != null && versionData.objectName == 'User')
                    sfName = (string)(user.get(versionData.fieldName));}
            
            
            List<MindMatrixMiscHelper.valuesclass> mappingValues = versionData.values;
            for(MindMatrixMiscHelper.valuesclass val : mappingValues){
                if(val.k == sfName){
                    groupName = val.v;
                    break;
                }
            }
            return groupName;
        }catch(Exception ex){
                return groupName;
        }
    }
    
    public static String GetUserGroupNameForVersioningCrmUser(User user, MindMatrixMiscHelper.versiondata versionData) {
        
        string sfName = '';
        string groupName = 'Sales'; 
        try{
        if(user == null && versionData == null)
            return groupName;
            
        if(user.Profile != null && versionData.crmobjectName == 'Profile')
            sfName = (string)(user.Profile.get(versionData.crmfieldName));
        else if(user.UserRole != null && versionData.crmobjectName == 'UserRole')
            sfName = (string)(user.UserRole.get(versionData.crmfieldName));
        else{
            if(user != null && versionData.objectName == 'User')
                sfName = (string)(user.get(versionData.crmfieldName));}
        
        
        List<MindMatrixMiscHelper.valuescrmclass> mappingValues = versionData.crmvalues;
        for(MindMatrixMiscHelper.valuescrmclass val : mappingValues){
            if(val.k == sfName){
                groupName = val.v;
                break;
            }
        }
        
        return groupName;
        }catch (Exception ex){
            return groupName;
        }
    }
    
    public static boolean getRemovedPrevioususergroupcheckboxvalue(MindMatrixMiscHelper.versiondata versionData){
        if(versionData == null)
            return null;
        return versionData.checkBox;
    }
    
    public static boolean getRemovedPrevioususergroupCrmcheckboxvalue(MindMatrixMiscHelper.versiondata versionData){
        if(versionData == null)
            return null;
        return versionData.crmcheckBox;
    }
    
    
    public static Boolean checkMMAPIDetailsAvaiable()
    {
        if (!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.isAccessible())
            return false;
        
        MindMatrix__AMPAPIDetailsV2__c apiDetails = MindMatrix__AMPAPIDetailsV2__c.getOrgDefaults();
        if(apiDetails != null)
            return  true;
        
        return false;
    }
    
    
    public static MindMatrix__AMPUserDetails__c GetCurrentUserDetails()
    {
        if (!Schema.sObjectType.AMPUserDetails__c.fields.MindMatrix__AccessToken__c.isAccessible() &&!Schema.sObjectType.AMPUserDetails__c.fields.MindMatrix__AMPID__c.isAccessible()&&!Schema.sObjectType.AMPUserDetails__c.fields.MindMatrix__ExpiresIn__c.isAccessible()&&!Schema.sObjectType.AMPUserDetails__c.fields.MindMatrix__AMPSha1Key__c.isAccessible()&&!Schema.sObjectType.AMPUserDetails__c.fields.MindMatrix__AMPUName__c.isAccessible()&&!Schema.sObjectType.AMPUserDetails__c.fields.MindMatrix__AMPUrl__c.isAccessible()&&!Schema.sObjectType.AMPUserDetails__c.fields.SFUserID__c.isAccessible()&&!Schema.sObjectType.AMPUserDetails__c.fields.MindMatrix__ClientSecret__c.isAccessible()&&!Schema.sObjectType.AMPUserDetails__c.fields.MindMatrix__ClientID__c.isAccessible())
            return null;
        
        Id SFUserID = UserInfo.getUserId();
        List<AMPUserDetails__c> lstUserAcc = [SELECT MindMatrix__AccessToken__c, MindMatrix__AMPID__c, MindMatrix__AMPSha1Key__c, MindMatrix__AMPUName__c, MindMatrix__AMPUrl__c,MindMatrix__ClientID__c,MindMatrix__ClientSecret__c,MindMatrix__ExpiresIn__c FROM AMPUserDetails__c WHERE SFUserID__c =: SFUserID LIMIT 1];
        
        if(lstUserAcc.size() > 0){
            return lstUserAcc[0];
        }
        else
            return null;
    }
    
    public static String GetInstallName()
    {
        if(!Schema.sObjectType.AMPUserDetails__c.fields.MindMatrix__AMPUrl__c.isAccessible())
            return null;
        try{
            
            MindMatrix__AMPUserDetails__c userDetails = GetCurrentUserDetails();
            if(userDetails != null)
                return userDetails.MindMatrix__AMPUrl__c;
            
            return '';
        }
        catch(Exception ex)
        {
            return ex.getMessage();
        }
    }
    
    public static String GetToken()
    {
        if(!Schema.sObjectType.AMPUserDetails__c.fields.MindMatrix__ClientSecret__c.isAccessible())
            return null;
        try{
            
            MindMatrix__AMPUserDetails__c userDetails = GetCurrentUserDetails();
            if(userDetails != null)
                return userDetails.MindMatrix__ClientSecret__c;
            
            return '';
        }
        catch(Exception ex)
        {
            return ex.getMessage();
        }
    }
    
}