@isTest
public class AMPLinearPlaybookWidgetControllerTest {
    static testMethod void testAMPLinearPlaybookWidgetController() 
    {
        
        testGetPersonaThemeForCurrentUser();
        testAuthenticateSFUser(true);
        testgetLinearPlaybookWidgets();
        testUpdateToken('Token');    
    }
    
    public static Boolean testUpdateToken(string token)
    {
         Boolean updateToken = AMPLinearPlaybookWidgetController.UpdateToken(token);
        System.assertEquals(false,updateToken);
        return updateToken;
        
    }
    
    
    public static string testGetPersonaThemeForCurrentUser()
    {
        return AMPLinearPlaybookWidgetController.GetPersonaThemeForCurrentUser();
    }
    
    public static string testAuthenticateSFUser(Boolean createuserviasso)
    {
        return AMPLinearPlaybookWidgetController.AuthenticateSFUser(createuserviasso);
    }
    
    public static string testgetLinearPlaybookWidgets()
    {
        return AMPLinearPlaybookWidgetController.getLinearPlaybookWidgets();
    }
    
}