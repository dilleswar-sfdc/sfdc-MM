@isTest
public class MindMatrixMiscHelperTest {
	static testMethod void testMindMatrixMiscHelperTest() 
    {
		testAuthenticateSFUser(true,false);        
    }
    
    public static string testAuthenticateSFUser(boolean createuserviasso,boolean shownavigation){
        string result = MindMatrixMiscHelper.AuthenticateSFUser(createuserviasso,shownavigation);
        System.assertEquals(true,result != null);
        return result;
    }
}