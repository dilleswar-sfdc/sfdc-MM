@isTest
public class AMPWidgetControllerTest {
    static testMethod void testWidgetControllerTest() 
    {
       
        testAuthenticateSFUser();
        testUpdateToken('Token');
        testGetPersonaThemeForCurrentUser();
    }
    public static Boolean testUpdateToken(string token)
    {
        Boolean updateToken = AMPWidgetController.UpdateToken(token);
        System.assertEquals(false,updateToken);
        return updateToken;
       
    }    
    
    public static string testAuthenticateSFUser()
    {
        string result = AMPWidgetController.AuthenticateSFUser();
        System.assertEquals(true,result != null);
        return result;
    }
    public static string testGetPersonaThemeForCurrentUser()
    {
        string result = AMPWidgetController.GetPersonaThemeForCurrentUser();
        System.assertEquals(true,result != null);
        return result;
    }
    
}