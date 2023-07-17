@isTest
public class AMPCommunityAssetControllerTest {
    static testMethod void testAMPCommunityAssetControllerTest() 
    {
       
        testAuthenticateSFUser();
        testUpdateToken('Token');
        testGetPersonaThemeForCurrentUser();
    }
    public static string testGetPersonaThemeForCurrentUser()
    {
        string result = AMPCommunityAssetController.GetPersonaThemeForCurrentUser();
        System.assertEquals(true,result != null);
        return result;
       
    } 
    public static Boolean testUpdateToken(string token)
    {
        Boolean updateToken = AMPCommunityAssetController.UpdateToken(token);
        System.assertEquals(false,updateToken);
        return updateToken;
       
    }    
    
    public static string testAuthenticateSFUser()
    {
        string testauthenticatesfuser =  AMPCommunityAssetController.AuthenticateSFUser();
        System.assertEquals(true,testauthenticatesfuser != null);
        return testauthenticatesfuser;
    }
    
}