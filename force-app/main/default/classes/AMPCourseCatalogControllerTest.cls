@isTest
public class AMPCourseCatalogControllerTest {
    static testMethod void testAMPCourseCatalogController() 
    {
        testAuthenticateSFUser();
        testUpdateToken('Token');
    }
    
    public static Boolean testUpdateToken(string token)
    {
        Boolean updateToken = AMPCourseCatalogController.UpdateToken(token);
        System.assertEquals(false,updateToken);
        return updateToken;
       
    }
    
    public static string testAuthenticateSFUser()
    {
        string sfauthenticatesfuser = AMPCourseCatalogController.AuthenticateSFUser();
        System.assertEquals(true,sfauthenticatesfuser != null);
        return sfauthenticatesfuser;
    }
    
}