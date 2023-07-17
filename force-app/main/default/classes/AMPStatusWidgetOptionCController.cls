public class AMPStatusWidgetOptionCController extends MindMatrixAuthenticator{
    
    
    public static List<String> GetRecordTypeFromSettings()
    {
        if (!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__RecordTypeJSON__c.isAccessible() )
            return null;
        MindMatrix__AMPAPIDetailsV2__c api = AMPViewAssetSearchController.GetCurrentAPIDetails();
        if(api != null){
            string jsonStr =  api.MindMatrix__RecordTypeJSON__c;
            if(jsonStr != null && jsonStr != '')
            {
                AMPGetWebServiceResponse.ExtraSettings result = (AMPGetWebServiceResponse.ExtraSettings)System.JSON.deserialize(jsonStr, AMPGetWebServiceResponse.ExtraSettings.class);
                if(result.rts == null)
                    return new List<string>();
                else
                    return result.rts;
            }
        }
        return new List<String>();
    }
    
    public static String GetWonListView()
    {
        if (!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__RecordTypeJSON__c.isAccessible() )
            return '';
        
        MindMatrix__AMPAPIDetailsV2__c api = AMPViewAssetSearchController.GetCurrentAPIDetails();
        if(api != null){
            string jsonStr =  api.MindMatrix__RecordTypeJSON__c;
            if(jsonStr != null && jsonStr != '')
            {
                AMPGetWebServiceResponse.ExtraSettings result = (AMPGetWebServiceResponse.ExtraSettings)System.JSON.deserialize(jsonStr, AMPGetWebServiceResponse.ExtraSettings.class);
                if(result.wlv == null)
                    return '';
                else
                    return result.wlv;
            }
        }
        return '';
    }
    
    public static String GetPipeLinedListView()
    {
         if (!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__RecordTypeJSON__c.isAccessible() )
            return '';
        
        MindMatrix__AMPAPIDetailsV2__c api = AMPViewAssetSearchController.GetCurrentAPIDetails();
        if(api != null){
            string jsonStr =  api.MindMatrix__RecordTypeJSON__c;
            if(jsonStr != null && jsonStr != '')
            {
                AMPGetWebServiceResponse.ExtraSettings result = (AMPGetWebServiceResponse.ExtraSettings)System.JSON.deserialize(jsonStr, AMPGetWebServiceResponse.ExtraSettings.class);
                if(result.plv == null)
                    return '';
                else
                    return result.plv;
            }
        }
        return '';
    }
    
    public static String GetAllListView()
    {
         if (!Schema.sObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__RecordTypeJSON__c.isAccessible() )
            return '';
        MindMatrix__AMPAPIDetailsV2__c api = AMPViewAssetSearchController.GetCurrentAPIDetails();
        if(api != null){
            string jsonStr =  api.MindMatrix__RecordTypeJSON__c;
            if(jsonStr != null && jsonStr != '')
            {
                AMPGetWebServiceResponse.ExtraSettings result = (AMPGetWebServiceResponse.ExtraSettings)System.JSON.deserialize(jsonStr, AMPGetWebServiceResponse.ExtraSettings.class);
                if(result.alv == null)
                    return '';
                else
                    return result.alv;
            }
        }
        return '';
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
    public static string getStatusWidget()
    {
        JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartObject();
        gen.writeStringField('persona', 'channelpartner');
        gen.writeEndObject();
        String jsonS = gen.getAsString();
       
        string requiredURL = GetInstallNameForUser()+'/api/SFGetStatusWidget';
        return AMPGetWebServiceResponse.PostDataJSONResponse(requiredURL,jsonS,GetTokenForUser());
    }
    
    @AuraEnabled
    public static string GetSalesforceOppDetails() {      
        try{
            if(!Schema.SObjectType.Opportunity.isAccessible())
                return '';
            
            Map<String,String> PrefixList = new Map<String,String>{};
                Map<String, Schema.SObjectType> gd = Schema.getGlobalDescribe();
            for(String sObj : gd.keySet()){            
                Schema.DescribeSObjectResult r =  gd.get(sObj).getDescribe();            
                PrefixList.put(r.getName(), r.getKeyPrefix());            
            }
            
            string prefiex = PrefixList.get('Opportunity');
            
            String OppPipelineUrl ='/'+PrefixList.get('Opportunity')+'?fcf=' + GetPipeLinedListView();
            String OppwonUrl = '/'+PrefixList.get('Opportunity')+'?fcf=' + GetWonListView();
            String ALLOppUrl = '/'+PrefixList.get('Opportunity')+'?fcf=' + GetAllListView();
            JSONGenerator gen = JSON.createGenerator(true);
            //AggregateResult opppipelineamount = null;
            List<string> recordType = AMPStatusWidgetOptionCController.GetRecordTypeFromSettings();
            String recordTypeQuery = '';
            if(recordType.size() > 0){
                string condition = '\''+string.join(recordType,'\',\'') + '\'';
                recordTypeQuery = ' and recordtype.id in ('+ condition + ')';
            }
            String queryOppPipeLineAmount = 'select FORMAT(sum(Amount))pipelineamount from opportunity where forecastcategory=\'pipeline\'' + recordTypeQuery;
            AggregateResult opppipelineamount = Database.query(queryOppPipeLineAmount);
            String queryOppPipeLineCount = 'select Count(Id)pipelinecount from opportunity where forecastcategory=\'pipeline\'' + recordTypeQuery;        
            AggregateResult opppipelinecount = Database.query(queryOppPipeLineCount);
            
            String queryOppWonAmount = 'select FORMAT(sum(Amount))wonamount from opportunity where isclosed = true and iswon=true ' + recordTypeQuery;                
            AggregateResult oppwonamount = Database.query(queryOppWonAmount);
            String queryOppWonCount = 'select Count(Id)woncount from opportunity where isclosed = true and iswon=true ' + recordTypeQuery;                
            AggregateResult oppwoncount = Database.query(queryOppWonCount);
            
            
            recordTypeQuery = '';
            if(recordType.size() > 0){
                string condition = '\''+string.join(recordType,'\',\'') + '\'';
                recordTypeQuery = ' where recordtype.id in ('+ condition + ')';
            }
            string queryOppAmount = 'SELECT FORMAT(sum(Amount))amount FROM Opportunity ' + recordTypeQuery;
            AggregateResult oppamount = Database.query(queryOppAmount);
            string queryOppCount = 'SELECT count(Id)oppcount FROM Opportunity ' + recordTypeQuery;
            AggregateResult groupedoppcount = Database.query(queryOppCount);
            Object pipelineamount = opppipelineamount.get('pipelineamount');
            Object wonamount = oppwonamount.get('wonamount');
            Object totaloppamount = oppamount.get('amount');
            Integer woncount = integer.valueOf(oppwoncount.get('woncount'));
            Integer totaloppcount = integer.valueOf(groupedoppcount.get('oppcount'));
            Integer pipelinecount = integer.valueOf(opppipelinecount.get('pipelinecount'));
            String currencytext = UserInfo.getDefaultCurrency();
            gen.writeStartArray();
            gen.writeStartObject();
            gen.writeNumberField('oppwoncount', woncount);
            gen.writeNumberField('totaloppcount', totaloppcount);
            gen.writeNumberField('pipelinecount', pipelinecount);
            gen.writeObjectField('pipelineamount', pipelineamount);
            gen.writeObjectField('oppwonamount', wonamount);
            gen.writeObjectField('totaloppamount', totaloppamount);
            gen.writeStringField('currencytext', currencytext);
            gen.writeStringField('OppPipelineUrl', OppPipelineUrl);
            gen.writeStringField('OppwonUrl', OppwonUrl);
            gen.writeStringField('ALLOppUrl', ALLOppUrl);
            gen.writeEndObject();
            gen.writeEndArray();
            return gen.getAsString();}
        catch(Exception ex)
        {
            return ex.getMessage();
        }
    }
    
    @AuraEnabled
    public static Boolean UpdateToken(string token)
    {
         return UpdateTokenExtended(token);
    }
      
}