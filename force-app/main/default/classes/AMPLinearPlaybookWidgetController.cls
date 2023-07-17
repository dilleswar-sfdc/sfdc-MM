public class AMPLinearPlaybookWidgetController extends MindMatrixAuthenticator{
    
    
    @AuraEnabled
    public static string GetPersonaThemeForCurrentUser()
    {
        //Add isAccessible() check
        string requiredURL = GetInstallNameForUser()+'/api/GetPersonaThemeForSF';
        JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartObject();
        gen.writeStringField('persona', 'channelpartner');
        gen.writeEndObject();
        String jsonS = gen.getAsString();
        return AMPGetWebServiceResponse.PostDataJSONResponse(requiredURL,jsonS,GetTokenForUser());
    }
    
    @AuraEnabled
    public static string AuthenticateSFUser(Boolean createuserviasso)
    {
        return AuthenticateMMUser(createuserviasso,false);
    }
    @AuraEnabled
    public static string getLinearPlaybookWidgets()
    {
        string requiredURL = GetInstallNameForUser()+'/api/SFGetLinearPlaybookWidgets';
        return AMPGetWebServiceResponse.PostDataJSONResponse(requiredURL,'',GetTokenForUser());
    }    
    @AuraEnabled
    public static Boolean UpdateToken(string token)
    {
        return UpdateTokenExtended(token);
    }
}