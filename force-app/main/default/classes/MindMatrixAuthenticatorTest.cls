@isTest
public class MindMatrixAuthenticatorTest {
	static testMethod void testMindMatrixAuthenticatorTest() 
    {
        testUpdateTokenExtended('1acb073e7b6d6fb173d05abc4920c83a03ed0a217a533f09d8caa3jkdjfkd56464');
        testAuthenticateMMUser(true,false);
        testversionDataParsing();
    }
    public static string testAuthenticateMMUser(Boolean createuserviasso,Boolean shownavigation)
    {
        string authenticatemmuser = MindMatrixAuthenticator.AuthenticateMMUser(createuserviasso,shownavigation);
        System.assertEquals(true,authenticatemmuser!= null);
        return authenticatemmuser;
    }
    public static Boolean testUpdateTokenExtended(string token)
    {
        Boolean updatetoken =  MindMatrixAuthenticator.UpdateTokenExtended(token);
        System.assertEquals(true,updatetoken!= null);
        return updatetoken;
    }
    public static MindMatrixMiscHelper.versiondata testversionDataParsing()
    {
        MindMatrixMiscHelper.versiondata result = MindMatrixAuthenticator.versionDataParsing();
        System.assertEquals(false,result!= null);
        return result;
    }
}