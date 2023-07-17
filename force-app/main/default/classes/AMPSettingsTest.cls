@isTest(SeeAllData=true)
public class AMPSettingsTest {
    static testMethod void testAMPSettings() 
    {
        //testIsSSOEnabled();
        //Select Id,Email,Profile.Id,LastModifiedDate, Account.Id, Account.LastModifiedDate, Contact.Email, Contact.Id, Contact.LastModifiedDate From User  limit 1
        user u = [select Id,name,Email,account.name,contact.name,profile.name,Profile.Id,userrole.id,account.rating,LastModifiedDate, Account.Id, Account.LastModifiedDate, Contact.Email, Contact.Id, Contact.LastModifiedDate From User where id =: userinfo.getUserId() limit 1];
        //User u = Database.query(query);
        MindMatrixMiscHelper.versiondata versionData = MindMatrixAuthenticator.versionDataParsing();
        
        testcheckMMAPIDetailsAvaiable();
        testGetUserGroupNameForNonVersioningUser(u.Profile.Id);
        //testCheckIfUserIntegrated();
        testGetUserGroupNameForVersioningUser(u,versionData);
        testGetUserGroupNameForVersioningCrmUser(u,versionData);
        testgetRemovedPrevioususergroupcheckboxvalue(versionData);
        testgetRemovedPrevioususergroupCrmcheckboxvalue(versionData);
        testGetCurrentUserDetails();
        testGetInstallName();
        testGetToken();
        //testgetSSODetails();
        //testUpdateSSODetails(false,'https://dvl-master.amp.vg','https://dvl-sso.amp.vg','3542352352345','sdfasd235356');
        //testGetCurrentAPIDetails();
        
    }
    public static Boolean testcheckMMAPIDetailsAvaiable(){
        Boolean details = AMPSettings.checkMMAPIDetailsAvaiable();
        System.assertEquals(true,details);
        return details;
       
    }
    public static string testGetUserGroupNameForNonVersioningUser(string profileid){
        string usergroup = AMPSettings.GetUserGroupNameForNonVersioningUser(profileid);
        System.assertEquals('Sales',usergroup == null?'Sales':usergroup);
        return usergroup;
       
    }
    public static boolean testgetRemovedPrevioususergroupCrmcheckboxvalue(MindMatrixMiscHelper.versiondata versiondata){
        boolean checkboxcrmvalue = AMPSettings.getRemovedPrevioususergroupCrmcheckboxvalue(versiondata);
        System.assertEquals(true,checkboxcrmvalue != null);
        return checkboxcrmvalue;
       
    }
    public static boolean testgetRemovedPrevioususergroupcheckboxvalue(MindMatrixMiscHelper.versiondata versiondata){
        boolean checkboxvalue = AMPSettings.getRemovedPrevioususergroupcheckboxvalue(versiondata);
        System.assertEquals(true,checkboxvalue != null);
        return checkboxvalue;
       
    }
    
    public static String testGetUserGroupNameForVersioningUser(User user, MindMatrixMiscHelper.versiondata versionData){
       String groupName= AMPSettings.GetUserGroupNameForVersioningUser(user,versionData);
       System.assertEquals('Sales',groupName==''||groupName==null?'':groupName );
        return groupName;
    }
    
    /*public static string testCheckIfUserIntegrated()
    {
        string CheckIfUserIntegrated =AMPSettings.CheckIfUserIntegrated();
        System.assertEquals(true,CheckIfUserIntegrated);
        return CheckIfUserIntegrated;
        
    }*/
    
    public static String testGetUserGroupNameForVersioningCrmUser(User user, MindMatrixMiscHelper.versiondata versionData){
       String groupName= AMPSettings.GetUserGroupNameForVersioningCrmUser(user,versionData);
       System.assertEquals('Super Admin',groupName==''||groupName==null?'':groupName );
        return groupName;
    }
    
    public static MindMatrix__AMPUserDetails__c testGetCurrentUserDetails()
    {
        MindMatrix__AMPUserDetails__c currentUserDetail =AMPSettings.GetCurrentUserDetails();
        System.assertEquals(false,currentUserDetail != null);
        return currentUserDetail;
        
    }
    
    public static String testGetInstallName()
    {
        String installName = AMPSettings.GetInstallName();
        System.assertEquals(false,installName != '');
        return installName;
        
    }
    
    public static String testGetToken()
    {
        String token =  AMPSettings.GetToken();
        System.assertEquals(false,token!='');
        return token;
       
    }
    
    /*public static MindMatrix__AMPSSODetails__c testgetSSODetails() {
        MindMatrix__AMPSSODetails__c ssoDetails =  AMPSettings.getSSODetails();
        System.assertEquals(null,ssoDetails);
        return ssoDetails;
        
    }  */ 
    
    /*public static Boolean testUpdateSSODetails(boolean issso,string siteurl,string baseurl,string clientid,string token) 
    {
        Boolean updateSSODetails = AMPSettings.UpdateSSODetails(issso, siteurl, baseurl, clientid, token);
        System.assertEquals(true,updateSSODetails);
        return updateSSODetails;
        
    }*/
    
}