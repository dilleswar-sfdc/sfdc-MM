@isTest
public class AMPViewAssetSearchControllerTest {
    static testMethod void testAMPViewAssetSearchController() 
    {
        testGetInstallName();
        testGetToken();
        testGetCurrentAPIDetails();
        testgetAPIDetails();
        testUpdateAPIDetails('https://dvl-master.amp.vg','sdsad89353','json string','dfd444','fgfgfgf');
        testGetAMPAutoLoginURL('sdoai398sdfsd','json string');
        testgetAllProfiles();
        testGetUserDetails();
        testUpdateSettingsForCurrentUser('usertoken');
        testgetAllRecordType();
        testGetPrerequiredData();
        testGetAPIuser();
        testGetUserGroups();
        testupsertUserGroupSettingInFile('fdfd','installurl','token');
       
        //testcurrentUserDetails();
        //testdeletesSelectuser();
        //testsaveupdatedetails();
    }
    
    public static String testupsertUserGroupSettingInFile(string setting,string installurl,string token){
        String getgroup = AMPViewAssetSearchController.upsertUserGroupSettingInFile(setting,installurl,token);
        System.assertEquals(true,getgroup != null);
        return getgroup;
       
    }
    
    public static String testGetUserGroups(){
        String getgroup = AMPViewAssetSearchController.GetUserGroups();
        System.assertEquals(true,getgroup!= null);
        return getgroup;
       
    }
    public static String testGetInstallName(){
        String installName = AMPViewAssetSearchController.GetInstallName();
        System.assertEquals(null,installName);
        return installName;
       
    }
    public static String testGetToken(){
        String token = AMPViewAssetSearchController.GetToken();
        System.assertEquals(null,token);
        return token;
         
    }
    
     public static List<MindMatrix__AMPAPIDetailsV2__c> testGetAPIuser(){
        return AMPViewAssetSearchController.getAPIUsers();
         
    }
     public static MindMatrix__AMPAPIDetailsV2__c testsaveupdatedetails(){
          MindMatrix__AMPAPIDetailsV2__c apiDetails = MindMatrix__AMPAPIDetailsV2__c.getOrgDefaults();
        return AMPViewAssetSearchController.saveUpdatedDetails(apiDetails);
         
    }
     public static MindMatrix__AMPAPIDetailsV2__c testcurrentUserDetails(){
          return AMPViewAssetSearchController.currentUserDetails('0050o00000ZBjj1AAD');
    }
     public static void testdeletesSelectuser(){
       AMPViewAssetSearchController.deleteSelectedUser('0050o00000ZBjj1AAD');

    }
    public static MindMatrix__AMPAPIDetailsV2__c testGetCurrentAPIDetails() {
        MindMatrix__AMPAPIDetailsV2__c mmAMPAPIDetails = AMPViewAssetSearchController.GetCurrentAPIDetails();
         MindMatrix__AMPAPIDetailsV2__c apiDetails = MindMatrix__AMPAPIDetailsV2__c.getOrgDefaults();
        System.assertEquals(apiDetails,mmAMPAPIDetails);
        return mmAMPAPIDetails;
       
    }
    
    public static MindMatrix__AMPAPIDetailsV2__c testgetAPIDetails() {
        MindMatrix__AMPAPIDetailsV2__c mmAMPAPIDetails = AMPViewAssetSearchController.getAPIDetails();
         MindMatrix__AMPAPIDetailsV2__c apiDetails = MindMatrix__AMPAPIDetailsV2__c.getOrgDefaults();
        System.assertEquals(apiDetails,mmAMPAPIDetails);
        return mmAMPAPIDetails;
    }
    public static Boolean testUpdateAPIDetails(string installurl,string token,string json,string jWTCertPassword ,string jwtClientId)
    {
        Boolean updateAPI = AMPViewAssetSearchController.UpdateAPIDetails(installurl, token,json,jWTCertPassword,jwtClientId);
        
        System.assertEquals(true,updateAPI);
        return updateAPI;
        
    }
    
    public static string testGetAMPAutoLoginURL(string  crmId,string groupName)
    {
        return AMPViewAssetSearchController.GetAMPAutoLoginURL(crmId,groupName);
    }
    public static List<Profile> testgetAllProfiles() {
        List<Profile> listProfile = AMPViewAssetSearchController.getAllProfiles();
        List<Profile> testlistProfile=[SELECT ID,NAME FROM PROFILE limit 1];
        System.assertEquals(testlistProfile,listProfile);
        return listProfile;
         
    }
    public static User testGetUserDetails()
    {
        return AMPViewAssetSearchController.GetUserDetails();
    }
    public static Boolean testUpdateSettingsForCurrentUser(string usertoken)
    {
        return AMPViewAssetSearchController.UpdateSettingsForCurrentUser(usertoken);
    }
    public static List<RecordType> testgetAllRecordType(){
         return AMPViewAssetSearchController.getAllRecordType();
    }
    public static  string testGetPrerequiredData(){
        return AMPViewAssetSearchController.GetPrerequiredData();
    }
    
}