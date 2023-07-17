@isTest
public class ampRedirectButtonToMMTest {
    
    static testMethod void testampRedirectButtonToMMTest(){
        testAuthenticateSFUser();
        
    }
   
   public static string testAuthenticateSFUser()
    {
        string result = ampRedirectButtonToMM.AuthenticateSFUser();
        System.assertEquals(true,result != null);
        return result;
    }
}