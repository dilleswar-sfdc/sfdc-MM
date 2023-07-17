@isTest
public class AMPStatusWidgetOptionCControllerTest {
	static testMethod void testAMPInteractiveBannerController() 
    {
        
        testGetPersonaThemeForCurrentUser();
        testAuthenticateSFUser(true);
        testgetStatusWidget();
        testGetSalesforceOppDetails();
    	testUpdateToken('Token');    
        testGetRecordTypeFromSettings();
        testGetWonListView();
        testGetPipeLinedListView();
        testGetAllListView();
    }
    
    public static List<String> testGetRecordTypeFromSettings()
    {
        return AMPStatusWidgetOptionCController.GetRecordTypeFromSettings();
    }
    
    public static String testGetWonListView()
    {
        return AMPStatusWidgetOptionCController.GetWonListView();
    }
    
    public static String testGetPipeLinedListView()
    {
        return AMPStatusWidgetOptionCController.GetPipeLinedListView();
    }
    
    public static String testGetAllListView()
    {
        return AMPStatusWidgetOptionCController.GetAllListView();
    }
    
    
    public static Boolean testUpdateToken(string token)
    {
         Boolean updateToken =  AMPStatusWidgetOptionCController.UpdateToken(token);
        System.assertEquals(false,updateToken);
        return updateToken;
        
    }
    
    
    public static string testGetPersonaThemeForCurrentUser()
    {
        return AMPStatusWidgetOptionCController.GetPersonaThemeForCurrentUser();
    }
    
    public static string testAuthenticateSFUser(Boolean createuserviasso)
    {
        return AMPStatusWidgetOptionCController.AuthenticateSFUser(createuserviasso);
    }
    
    public static string testgetStatusWidget()
    {
        return AMPStatusWidgetOptionCController.getStatusWidget();
    }
    
    public static string testGetSalesforceOppDetails() {        
        return AMPStatusWidgetOptionCController.GetSalesforceOppDetails();
    }
    
}