@isTest
public class AMPLast5emailcampaignControllerTest {
    static testMethod void testAMPInteractiveBannerController() 
    {
        
        testGetPersonaThemeForCurrentUser();
        testAuthenticateSFUser(true);
        getLast5emailCampaign();
        testUpdateToken('Token');
    }
    
    public static Boolean testUpdateToken(string token)
    {
        Boolean updateToken = AMPLast5emailcampaignController.UpdateToken(token);
        System.assertEquals(false,updateToken);
        return updateToken;
        
    }
    
    
    public static string testGetPersonaThemeForCurrentUser()
    {
        return AMPLast5emailcampaignController.GetPersonaThemeForCurrentUser();
    }
    
    public static string testAuthenticateSFUser(Boolean createuserviasso)
    {
        return AMPLast5emailcampaignController.AuthenticateSFUser(createuserviasso);
    }
    
    public static string getLast5emailCampaign()
    {
        return AMPLast5emailcampaignController.getLast5emailCampaign();
    }
    
}