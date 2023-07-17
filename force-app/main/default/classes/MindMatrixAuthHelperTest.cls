@isTest
public class MindMatrixAuthHelperTest {
    testMethod static void testMindMatrixAuthHelperTest(){
        
        testGetOrgInstallName();
        testGetOrgToken();
        testGetCurrentOrgInstance();
        testGetInstallNameForUser();
        testGetTokenForUser();
        testUpdateUserToken('token');
        testUpdateAPIDetailsExtended('https://dvl-main.amp.vg/','token','json','eln','elt');
        testGetOrgJWTeltHS256();
        testGetOrgJWTeltAES();
    }
     
    public static string testGetOrgInstallName(){
        string installname = MindMatrixAuthHelper.GetOrgInstallName();
        System.assertEquals(false,installname != null);
        return installname;
                
    }
    public static string testGetOrgToken(){
         string orgtoken = MindMatrixAuthHelper.GetOrgToken();
        System.assertEquals(false,orgtoken != null);
        return orgtoken;
                
    }        
     public static MindMatrix__AMPAPIDetailsV2__c testGetCurrentOrgInstance(){
         MindMatrix__AMPAPIDetailsV2__c currentOrginstance = MindMatrixAuthHelper.GetCurrentOrgInstance();
        System.assertEquals(true,currentOrginstance != null);
        return currentOrginstance;
                
    }  
    public static string testGetInstallNameForUser(){
        string installname = MindMatrixAuthHelper.GetInstallNameForUser();
        System.assertEquals(false,installname != null);
        return installname;
                
    }
    public static string testGetTokenForUser(){
        string token = MindMatrixAuthHelper.GetTokenForUser();
        System.assertEquals(false,token != null);
        return token;
                
    }
    public static Boolean testUpdateUserToken(string token){
        Boolean value = MindMatrixAuthHelper.UpdateUserToken(token);
        System.assertEquals(false,value);
        return value;
                
    }
   public static Boolean testUpdateAPIDetailsExtended(string installurl,string token,string json,string eltaes,string elths256){
        Boolean value = MindMatrixAuthHelper.UpdateAPIDetailsExtended(installurl,token,json,eltaes,elths256);
        System.assertEquals(true,value);
        return value;
                
    }
     public static string testGetOrgJWTeltHS256(){
        string value = MindMatrixAuthHelper.GetOrgJWTeltHS256();
        System.assertEquals(true,value != null);
        return value;
                
    } 
    public static string testGetOrgJWTeltAES(){
        string value = MindMatrixAuthHelper.GetOrgJWTeltAES();
        System.assertEquals(true,value != null);
        return value;
                
    } 
}