global with sharing class AMPPageUrl
{
    webService static String getPageUrl(String objectId)
    {
        PageReference p = Page.AMPSFContactSync;
        p.getParameters().put('id', objectId);
        
        return p.getUrl();
    }
    
    webService static String getRecipientListPageUrl()
    {
        PageReference p = Page.ViewRecipientLists;
        return p.getUrl();
    }
    
    webService static String getAMPMediaUrl()
    {
         if(!Schema.sObjectType.AMPUserDetails__c.fields.AccessToken__c.isAccessible()&&!Schema.sObjectType.AMPUserDetails__c.fields.AMPID__c.isAccessible()&&!Schema.sObjectType.AMPUserDetails__c.fields.ExpiresIn__c.isAccessible()&&!Schema.sObjectType.AMPUserDetails__c.fields.AMPSha1Key__c.isAccessible()&&!Schema.sObjectType.AMPUserDetails__c.fields.AMPUName__c.isAccessible()&&!Schema.sObjectType.AMPUserDetails__c.fields.AMPUrl__c.isAccessible())
            return null;
        
        Id SFUserID = UserInfo.getUserId();
        String ampMediaUrl = '';
        List<AMPUserDetails__c> lstUserinfo = [SELECT AccessToken__c, AMPID__c, ExpiresIn__c, AMPSha1Key__c, AMPUName__c, AMPUrl__c FROM AMPUserDetails__c WHERE SFUserID__c =: SFUserID LIMIT 1];
        if(lstUserinfo.size() > 0) ampMediaUrl = lstUserinfo[0].AMPUrl__c + 'login/' + lstUserinfo[0].AMPUName__c + '/' + lstUserinfo[0].AMPSha1Key__c;
        
        return ampMediaUrl;
    }
}