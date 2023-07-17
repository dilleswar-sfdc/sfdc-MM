@isTest
public class AMPMMReportsControllerTest {
    static testMethod void testAMPMMReportsControllerTest() 
    {
        testAuthenticateSFUser();
        testUpdateToken('Token');
    }
    
    public static Boolean testUpdateToken(string token)
    {
         Boolean updateToken = AMPMMReportsController.UpdateToken(token);
        System.assertEquals(false,updateToken);
        return updateToken;
       
    }
    
    public static string testAuthenticateSFUser()
    {
        return AMPMMReportsController.AuthenticateSFUser();
    }
    
}