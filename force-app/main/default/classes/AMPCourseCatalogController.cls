public class AMPCourseCatalogController extends MindMatrixAuthenticator{
    
    @AuraEnabled
    public static string AuthenticateSFUser()
    {
        return AuthenticateMMUser(true,false);
    }
    @AuraEnabled
    public static Boolean UpdateToken(string token)
    { 
        return UpdateTokenExtended(token);
    }
}