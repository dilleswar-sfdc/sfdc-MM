public class AMPAnnualTargetProgressReportController extends MindMatrixAuthenticator{
    
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
    public static Boolean UpdateToken(string token)
    {
        return UpdateTokenExtended(token);
    }
    
    @AuraEnabled
    public static string getAnnualTargetProgressReport(string view)
    {
        //Add isAccessible() check
        string requiredURL = GetInstallNameForUser()+'/api/SFGetAnnualTargetProgressReport';
        JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartObject();
        gen.writeStringField('view', view);
        gen.writeEndObject();
        String jsonS = gen.getAsString();
        return AMPGetWebServiceResponse.PostDataJSONResponse(requiredURL,jsonS,GetTokenForUser());
    }
}