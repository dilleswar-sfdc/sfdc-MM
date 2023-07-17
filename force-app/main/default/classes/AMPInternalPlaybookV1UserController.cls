public class AMPInternalPlaybookV1UserController extends MindMatrixAuthenticator{
    
    
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
    public static string getplaybookUpdateComments(Integer itemid, string comment,string userid)
    {
        string requiredURL = GetInstallNameForUser()+'/api/SFGetPlaybooksUpdateComments';
        JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartObject();
        gen.writeNumberField('itemid',itemid);
        gen.writeStringField('comment', comment);
        gen.writeEndObject();
        return AMPGetWebServiceResponse.PostDataJSONResponse(requiredURL,gen.getAsString(),GetTokenForUser());
    }
    
    @AuraEnabled
    public static string getPlaybooksForCurrentUser(string userid,string page,string pagesize,string searchtext,Boolean condition,string filters)
    {
        JSONGenerator gen = JSON.createGenerator(true);    
        gen.writeStartObject();
        gen.writeStringField('search', searchtext);
        gen.writeBooleanField('condition', condition);
        gen.writeStringField('filters', filters);
        gen.writeStringField('pageSize', pagesize);
        gen.writeStringField('page', page);
        gen.writeStringField('userid', userid);
        gen.writeEndObject();
        String jsonS = gen.getAsString();
        String url = GetInstallNameForUser()+'/api/SFGetPlaybooksForCurrentUser';
        return AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,GetTokenForUser());
    }
    
    @AuraEnabled
    public static string getUpdatedRating(String userid, String itemid, String value, String type)
    {
        JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartObject();
        gen.writeStringField('userid', userid);
        gen.writeStringField('itemid', itemid);
        gen.writeStringField('value', value);
        gen.writeStringField('type', type);
        gen.writeEndObject();
        String jsonS = gen.getAsString();
        String url = GetInstallNameForUser()+'/api/SFGetUpdateRating';
        return AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,GetTokenForUser());
    }
    @AuraEnabled
    public static Boolean UpdateToken(string token)
    {
        return UpdateTokenExtended(token);
    }
	
}