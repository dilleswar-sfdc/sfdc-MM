public with sharing  class AMPQuickLinkWidgetController extends MindMatrixAuthenticator{
    
    
    @AuraEnabled
    public static string getQuicklinkDesign()
    {
        //Add isAccessible() check
        string requiredURL = GetInstallNameForUser()+'/api/SFGetQuicklinkDesign';
        return AMPGetWebServiceResponse.PostDataJSONResponse(requiredURL,'',GetTokenForUser());
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
    public static string getQuickLinkWidgets(string design)
    {
        //Add isAccessible() check        
        JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartObject();
        gen.writeStringField('design', design);
        gen.writeEndObject();
        String jsonS = gen.getAsString();
        string requiredURL = GetInstallNameForUser()+'/api/SFGetQuickLinkWidgets';
        return AMPGetWebServiceResponse.PostDataJSONResponse(requiredURL,jsonS,GetTokenForUser());
    }
    
    @AuraEnabled
    public static string GetSalesforceDetails() {
        try{
            if(!Schema.SObjectType.Opportunity.isAccessible())
                return '';
            
            Map<String,String> PrefixList = new Map<String,String>{};
                Map<String, Schema.SObjectType> gd = Schema.getGlobalDescribe();
            for(String sObj : gd.keySet()){            
                Schema.DescribeSObjectResult r =  gd.get(sObj).getDescribe();            
                PrefixList.put(r.getName(), r.getKeyPrefix());            
            }
            String ALLOppUrl = '/'+PrefixList.get('Opportunity')+'?fcf=' + AMPStatusWidgetOptionCController.GetAllListView();
            List<string> recordType = AMPStatusWidgetOptionCController.GetRecordTypeFromSettings();
            String recordTypeQuery = '';
            if(recordType.size() > 0){
                string condition = '\''+string.join(recordType,'\',\'') + '\'';
                recordTypeQuery = ' where recordtype.id in ('+ condition + ')';
            }
            JSONGenerator gen = JSON.createGenerator(true);
            AggregateResult groupedlead = [SELECT count(Id)leadcount FROM Lead];
            
            String queryOppAmount = 'SELECT FORMAT(sum(Amount))amount FROM Opportunity' + recordTypeQuery;
            AggregateResult groupedResults = Database.query(queryOppAmount);
            String queryOppCount = 'SELECT count(Id)oppcount FROM Opportunity' + recordTypeQuery;
            AggregateResult groupedoppcount = Database.query(queryOppCount);
            Object amount = groupedResults.get('amount');
            Integer opp_count = integer.valueOf(groupedoppcount.get('oppcount'));
            Integer lead_count = integer.valueOf(groupedlead.get('leadcount'));
            String currencytext = UserInfo.getDefaultCurrency();
            gen.writeStartArray();
            gen.writeStartObject();
            gen.writeNumberField('leadcount', lead_count);
            gen.writeObjectField('Amount', amount);
            gen.writeNumberField('oppcount', opp_count);
            gen.writeStringField('currencytext', currencytext);
            gen.writeStringField('ALLOppUrl', ALLOppUrl);
            gen.writeEndObject();
            gen.writeEndArray();
            return gen.getAsString();
        }
        catch(Exception ex)
        {
            return ex.getMessage();
        }
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
    
}