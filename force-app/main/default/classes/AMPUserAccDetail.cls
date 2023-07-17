/* 
    Utility class which returns the AMP user details 
*/
public  with sharing class AMPUserAccDetail {
    //Get AMP user details
    public List<AMPUserDetails__c> getAMPUserDetail(){
        
         if(!Schema.sObjectType.AMPUserDetails__c.fields.AccessToken__c.isAccessible()&&!Schema.sObjectType.AMPUserDetails__c.fields.AMPID__c.isAccessible()&&!Schema.sObjectType.AMPUserDetails__c.fields.ExpiresIn__c.isAccessible()&&!Schema.sObjectType.AMPUserDetails__c.fields.AMPUrl__c.isAccessible()&&!Schema.sObjectType.AMPUserDetails__c.fields.AMPSha1Key__c.isAccessible()&&!Schema.sObjectType.AMPUserDetails__c.fields.AMPUName__c.isAccessible()&&!Schema.sObjectType.AMPUserDetails__c.fields.SFUserID__c.isAccessible()&&!Schema.sObjectType.AMPUserDetails__c.fields.ClientSecret__c.isAccessible())
       
            return null;
        
        // dropdownlist options list
        List<AMPUserDetails__c> lstUserAcc = new List<AMPUserDetails__c>();
        //String UniqueAppName = 'MM_AMP';
        Id SFUserID = UserInfo.getUserId();
        //Check if application is installed and user details are present; validate them
        lstUserAcc = [SELECT AccessToken__c, AMPID__c, ExpiresIn__c, AMPUrl__c, AMPSha1Key__c, AMPUName__c, SFUserID__c,ClientSecret__c FROM AMPUserDetails__c WHERE SFUserID__c =: SFUserID LIMIT 1];
        return lstUserAcc;
    }
}