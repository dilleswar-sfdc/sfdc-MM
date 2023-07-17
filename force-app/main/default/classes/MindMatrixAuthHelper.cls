public with sharing virtual class MindMatrixAuthHelper {
    
     // newly added code for ESET client if they don't want to give "view all custom setting" permission.These code have to remove when we submit for securityreview.
    public static String GetPublicOrgJWTeltAES(){
        
        if (!Schema.sObjectType.MindMatrix__AMPAPIDetails__c.fields.MindMatrix__GroupJSON__c.isAccessible())
            return '';
        MindMatrix__AMPAPIDetails__c api =  MindMatrix__AMPAPIDetails__c.getOrgDefaults();
        
        if(api != null)
            return api.MindMatrix__GroupJSON__c;
        return '';
    }
    
     // newly added code for ESET client if they don't want to give "view all custom setting" permission.These code have to remove when we submit for securityreview.
    public static String GetPublicOrgJWTeltHS256(){
        
        if (!Schema.sObjectType.MindMatrix__AMPAPIDetails__c.fields.MindMatrix__RecordTypeJSON__c.isAccessible())
            return '';
        MindMatrix__AMPAPIDetails__c api =  MindMatrix__AMPAPIDetails__c.getOrgDefaults();
        
        if(api != null)
            return api.MindMatrix__RecordTypeJSON__c;
        return '';
    }
    
    // newly added code for ESET client if they don't want to give "view all custom setting" permission.These code have to remove when we submit for securityreview.
    public static String GetPublicOrgInstallName(){
        
        if (!Schema.sObjectType.MindMatrix__AMPAPIDetails__c.fields.MindMatrix__SSOPopupMessage__c.isAccessible())
            return '';
        MindMatrix__AMPAPIDetails__c api =  MindMatrix__AMPAPIDetails__c.getOrgDefaults();
        
        if(api != null)
            return api.MindMatrix__SSOPopupMessage__c;
        return '';
    }
    
    // newly added code for ESET client if they don't want to give "view all custom setting" permission.These code have to remove when we submit for securityreview.
    public static String GetPublicOrgToken(){
        
        if (!Schema.sObjectType.MindMatrix__AMPAPIDetails__c.fields.MindMatrix__SSOPopupSettings__c.isAccessible())
            return '';
        MindMatrix__AMPAPIDetails__c api =  MindMatrix__AMPAPIDetails__c.getOrgDefaults();
        
        if(api != null)
            return api.MindMatrix__SSOPopupSettings__c;
        return '';
    }
    
	public static String GetOrgInstallName(){
        
        if (!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__InstallUrl__c.isAccessible())
            return '';
        MindMatrix__AMPAPIDetailsV2__c api = GetCurrentOrgInstance();
        
        if(api != null)
            return api.MindMatrix__InstallUrl__c;
        return '';
    }
    
    public static String GetOrgToken(){
        
        if (!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__Token__c.isAccessible())
            return '';
        MindMatrix__AMPAPIDetailsV2__c api = GetCurrentOrgInstance();
        
        if(api != null)
            return api.MindMatrix__Token__c;
        return '';
    }
    
    public static MindMatrix__AMPAPIDetailsV2__c GetCurrentOrgInstance() {
        if (!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.isAccessible())
            return null;
        MindMatrix__AMPAPIDetailsV2__c apiDetails = MindMatrix__AMPAPIDetailsV2__c.getOrgDefaults();
        return apiDetails;
    }
    
    public static String GetInstallNameForUser(){
          if (!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__InstallUrl__c.isAccessible())
            return '';
        MindMatrix__AMPAPIDetailsV2__c api = MindMatrix__AMPAPIDetailsV2__c.getInstance();
     
        if(api != null)
            return api.MindMatrix__InstallUrl__c;
        return '';
    }
    //return token
    public static String GetTokenForUser(){
        if (!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__UserToken__c.isAccessible())
            return '';
        MindMatrix__AMPAPIDetailsV2__c api = MindMatrix__AMPAPIDetailsV2__c.getInstance();
       
        if(api != null)
            return api.MindMatrix__UserToken__c;
        return '';
    }
    
    public static datetime GetLastLoginDateForSSOUser(){
       // DateTime dT = System.now()
        if (!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__SSOUserLastLoginDate__c.isAccessible())
            return null;
        MindMatrix__AMPAPIDetailsV2__c api = MindMatrix__AMPAPIDetailsV2__c.getInstance();
        if(api != null)
            return api.MindMatrix__SSOUserLastLoginDate__c;
        return null;
    }
    public static Boolean UpdateUserToken(string token)
    {
        if (!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__UserToken__c.isAccessible() &&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__UserToken__c.isCreateable()&& !Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__UserToken__c.isUpdateable())
            return false;
        
        try
        {
            MindMatrix__AMPAPIDetailsV2__c api = MindMatrix__AMPAPIDetailsV2__c.getInstance();
            if(api != null && api.MindMatrix__UserToken__c != token){
                api.MindMatrix__UserToken__c = token;
                upsert api;
                return true;
            }
            return false;
        }
        catch(Exception ex)
        {
            return false;
        }
    }
    
    public static Boolean UpdateAPIDetailsExtended(string installurl,string token,string json,string eltaes,string elths256)
    {
       
        if(!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__InstallUrl__c.isAccessible()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__Token__c.isAccessible()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__GroupJSON__c.isAccessible()&& !Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__UserToken__c.isAccessible()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__RecordTypeJSON__c.isAccessible() && !Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__JWTCertPassword__c.isAccessible()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__JWTClientId__c.isAccessible()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__InstallUrl__c.isCreateable()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__Token__c.isCreateable()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__GroupJSON__c.isCreateable()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__UserToken__c.isCreateable()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__JWTClientId__c.isCreateable()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__JWTCertPassword__c.isCreateable()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__InstallUrl__c.isUpdateable()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__Token__c.isUpdateable()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__GroupJSON__c.isUpdateable()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__UserToken__c.isUpdateable()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__JWTClientId__c.isUpdateable()&&!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__JWTCertPassword__c.isUpdateable())
	        return false;
        try
        {
            MindMatrix__AMPAPIDetailsV2__c api = GetCurrentOrgInstance();
            if(api == null)
                api = new MindMatrix__AMPAPIDetailsV2__c();
            api.MindMatrix__InstallUrl__c = installurl;
            api.MindMatrix__Token__c = token;
            api.MindMatrix__GroupJSON__c = json;
            api.MindMatrix__UserToken__c = token;
            api.MindMatrix__JWTClientId__c = elths256;
            api.MindMatrix__JWTCertPassword__c = eltaes;
            upsert api;
            return true;
        }
        catch(Exception ex)
        {
            return false;
        }
    }
    
    public static String GetOrgJWTeltHS256(){
        if (!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__JWTClientId__c.isAccessible())
            return '';
        MindMatrix__AMPAPIDetailsV2__c api = GetCurrentOrgInstance();
        if(api != null)
            return api.MindMatrix__JWTClientId__c;
        return '';
    }
    public static String GetOrgJWTeltAES(){
        if (!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__JWTCertPassword__c.isAccessible())
            return '';
        MindMatrix__AMPAPIDetailsV2__c api = GetCurrentOrgInstance();
        if(api != null)
            return api.MindMatrix__JWTCertPassword__c;
        return '';
    }
    
}