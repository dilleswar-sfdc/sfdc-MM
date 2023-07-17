@isTest
public class AMPInteractiveBannerControllerTest {
    static testMethod void testAMPInteractiveBannerController() 
    {
        
        testgetInteractiveBanner('channelpartner');
        testGetPersonaThemeForCurrentUser();
        testAuthenticateSFUser(true);
        testUpdateToken('Token');
    }
    
    public static string testgetInteractiveBanner(string personaoption)
    {
        string getInteractivebanner= AMPInteractiveBannerController.getInteractiveBanner(personaoption);
        System.assertEquals(true,getInteractivebanner != null);
        return getInteractivebanner;
    }
    
    public static string testGetPersonaThemeForCurrentUser()
    {
        string getPersona = AMPInteractiveBannerController.GetPersonaThemeForCurrentUser();
         System.assertEquals(true,getPersona != null);
        return getPersona;
    }
    
    public static string testAuthenticateSFUser(Boolean createuserviasso)
    {
        string authenticatesf =  AMPInteractiveBannerController.AuthenticateSFUser(createuserviasso);
         System.assertEquals(true,authenticatesf != null);
        return authenticatesf;
    }
    
    public static Boolean testUpdateToken(string token)
    {
        Boolean updatetoken =  AMPInteractiveBannerController.UpdateToken(token);
        System.assertEquals(true,updatetoken != null);
        return updatetoken;
    }
    
    
}