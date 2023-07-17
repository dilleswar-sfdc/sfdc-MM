public class ampRedirectButtonToMM extends MindMatrixAuthenticator {
	
    @AuraEnabled
    public static string AuthenticateSFUser()
    {
        return AuthenticateMMUser(true,false);
    }
}