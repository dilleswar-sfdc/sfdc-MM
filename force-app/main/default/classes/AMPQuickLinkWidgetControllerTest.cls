@isTest
public class AMPQuickLinkWidgetControllerTest {
    static testMethod void testAMPInteractiveBannerController() 
    {
        testgetQuicklinkDesign();
        testGetPersonaThemeForCurrentUser();
        testgetQuickLinkWidgets('1');
        testGetSalesforceDetails();
        testAuthenticateSFUser(true);
        testUpdateToken('Token');
    }
    
    public static Boolean testUpdateToken(string token)
    {
        Boolean updateToken = AMPQuickLinkWidgetController.UpdateToken(token);
        System.assertEquals(false,updateToken);
        return updateToken;
       
    }
    
    
    public static string testgetQuicklinkDesign()
    {
        return AMPQuickLinkWidgetController.getQuicklinkDesign();
    }
    
    public static string testGetPersonaThemeForCurrentUser()
    {
        return AMPQuickLinkWidgetController.GetPersonaThemeForCurrentUser();
    }
    
    public static string testgetQuickLinkWidgets(string design)
    {
        return AMPQuickLinkWidgetController.getQuickLinkWidgets(design);
    }
    
    public static string testGetSalesforceDetails() {
       return AMPQuickLinkWidgetController.GetSalesforceDetails();
              
    }
    
    public static string testAuthenticateSFUser(Boolean createuserviasso)
    {
        return AMPQuickLinkWidgetController.AuthenticateSFUser(createuserviasso);
    }
    
}