public class AMPViewAssetController extends MindMatrixAuthenticator{
    
    
    //return token for sfGetAssetSearchForConfigTemplate  and getAssetTab method
   // public static String GetViewToken(){https://mindmatrix-dev-ed.my.salesforce.com/_ui/common/apex/debug/ApexCSIPage#
    //    return AMPSettings.GetToken();
   // }
    
    @AuraEnabled
    public static string getAssetSearchForConfig(string searchtext,string userid,string iscount,string tabname)
    {
        JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartObject();
        gen.writeStringField('searchparam', searchtext);
        gen.writeStringField('userid', userid);
        gen.writeStringField('iscount', iscount);
        gen.writeStringField('tabname', tabname);
        gen.writeEndObject();
        String jsonS = gen.getAsString();
        String url = GetInstallNameForUser()+'api/SFGetAssetSearchForConfig';
        return AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,GetTokenForUser());
    }
    
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
    public static string getCreateTemporaryMedia(Integer templateid,String templatename,String userid) {
        string result = '';
        try{
            JSONGenerator gen = JSON.createGenerator(true);    
            gen.writeStartObject();
            gen.writeNumberField('templateid', templateid);
            gen.writeStringField('templatename', templatename);
            gen.writeStringField('userid', userid);
            gen.writeEndObject();
            String jsonS = gen.getAsString();
            String url = GetInstallNameForUser()+'/api/SFGetCreateTemporaryMedia';
            result = AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,GetTokenForUser());
        }
        catch(Exception ex)
        {
            return ex.getMessage();
        }
        return result;
        
    }
    @AuraEnabled
    public static Boolean UpdateToken(string token)
    {
         return UpdateTokenExtended(token);
    }
     @AuraEnabled(cacheable=true)
   
    public static string getAssetTab(String linkid,String source){    
        
        JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartObject();
        gen.writeStringField('cid', linkid);
        gen.writeStringField('source', source);
        gen.writeNumberField('eventid',0);
        gen.writeEndObject();
        String jsonS = gen.getAsString();
        String url = GetInstallNameForUser()+'api/SFGetAssetTab';
        String result = AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,GetTokenForUser());
        return result;
    }
     @AuraEnabled(cacheable=true)
    
     public static string sfGetAssetSearchForConfigTemplate(Integer page,Integer pagesize,String searchparam,Boolean tempSearch,List<String> templateType,List<Integer> tableType,String tabName,Integer isMedia,Boolean condition,String sortupdate,List<String> filters,Boolean filFlag){ 
       
         JSONGenerator gen = JSON.createGenerator(true);
         gen.writeStartObject();
         gen.writeNumberField('page', page);
         gen.writeNumberField('pagesize', pagesize);
         gen.writeStringField('searchparam', searchparam);
         gen.writeObjectField('tableType',tableType);
         gen.writeObjectField('templateType',templateType);
         gen.writeBooleanField('tempSearch', tempSearch);
         gen.writeStringField('tabName', tabName);
         gen.writeNumberField('isMedia', isMedia);
         gen.writeBooleanField('condition', condition);
         gen.writeStringField('sort',sortupdate);
         gen.writeObjectField('filters',filters);
         gen.writeBooleanField('filterFlag', filFlag);
         gen.writeEndObject();
         String jsonS = gen.getAsString();
         String url = GetInstallNameForUser()+'api/SFGetAssetSearchForConfigTemplateNew';
         String result = AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,GetTokenForUser());
         return result;
    }
    
     @AuraEnabled(cacheable=true)
     public static string sfGetTabCount(Integer page,Integer pagesize,String searchparam,Boolean tempSearch,List<String> templateType,List<Integer> tableType,Integer isMedia,Boolean condition,String sortupdate,List<String> filters,Boolean iscount,Object[] tabdata){
         
         JSONGenerator gen = JSON.createGenerator(true);
         gen.writeStartObject();
         gen.writeNumberField('page', page);
         gen.writeNumberField('pagesize', pagesize);
         gen.writeStringField('searchparam', searchparam);
         gen.writeObjectField('tableType',tableType);
         gen.writeBooleanField('tempSearch', tempSearch);
         gen.writeNumberField('isMedia', isMedia);
         gen.writeBooleanField('condition', condition);
         gen.writeBooleanField('filterFlag', true);
         gen.writeStringField('sort',sortupdate);
         gen.writeObjectField('filters',filters);
         gen.writeBooleanField('iscount', iscount);                                   
         gen.writeObjectField('tabdata',tabdata);
         gen.writeEndObject();
         String jsonS = gen.getAsString();
         String url = GetInstallNameForUser()+'api/SFGetTabCount';
         String result = AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,GetTokenForUser());
         return result;
    }
    
    
}