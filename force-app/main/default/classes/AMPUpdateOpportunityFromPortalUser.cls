public with sharing class AMPUpdateOpportunityFromPortalUser {
  /*  @Future(callout = true)
    public static void UpdateOppHelper(Set<Id> oppIds)
    {
        string appName = 'SFDC';
        string apiKey = getAMPApiKey(appName);
    }*/
    
    public static string getAMPApiKey(string appName)
    {
     /*   if (!Schema.sObjectType.AMPUserDetails__c.fields.AMPUName__c.isAccessible()&&!Schema.sObjectType.AMPUserDetails__c.fields.AMPSha1Key__c.isAccessible())
            return '';
        //string appName = 'SFDC';
        string appHash =  EncodingUtil.convertToHex(Crypto.generateDigest('SHA1',Blob.valueOf(appName)));
        string appKey = '';
        
        AMPUserAccDetail userAcc = new AMPUserAccDetail();
        List<AMPUserDetails__c> lstUserAcc = userAcc.getAMPUserDetail();
        
        if(lstUserAcc.size() > 0){
            string username = lstUserAcc[0].AMPUName__c;
            string sha1 = lstUserAcc[0].AMPSha1Key__c;
            string passwordsha = EncodingUtil.convertToHex(Crypto.generateDigest('SHA1',Blob.valueOf(appHash + sha1)));
            
            JSONGenerator gen = JSON.createGenerator(true);
            gen.writeStartObject();
            gen.writeStringField('user', username);
            gen.writeStringField('pass', passwordsha);
            gen.writeEndObject();
            String jsonS = gen.getAsString();

            string loginUrl = lstUserAcc[0].AMPUrl__c +'/api/login?app='+appHash+'&key='+appKey;
            
            appKey = AMPGetWebServiceResponse.PostDataJSONResponse(loginUrl,jsonS,'');
            
            AMPGetWebServiceResponse.JsonResult result = (AMPGetWebServiceResponse.JsonResult)JSON.deserialize(appKey, AMPGetWebServiceResponse.JsonResult.class);
            if(result.status == 2)
        		getAMPApiKey(appName);
            else
            	appKey = result.result;
           
        }
        return appKey;
    }
        
    public static string updateOpportunities(Set<Id> oppIds,string appName, string apiKey) 
    {
       if (!Schema.sObjectType.AMPUserDetails__c.fields.AMPUrl__c.isAccessible()&&!Schema.sObjectType.Opportunity.fields.Id.isAccessible()&&!Schema.sObjectType.Opportunity.fields.Name.isAccessible()&&!Schema.sObjectType.Opportunity.fields.LastModifiedDate.isAccessible())
            return '';
       
        JSONGenerator retVal = JSON.createGenerator(true);
        try {
            if(!oppIds.isEmpty()) {
            
                string appHash =  EncodingUtil.convertToHex(Crypto.generateDigest('SHA1',Blob.valueOf(appName)));
                AMPUserAccDetail userAcc = new AMPUserAccDetail();
                List<AMPUserDetails__c> lstUserAcc = userAcc.getAMPUserDetail();
                
                if(lstUserAcc.size() > 0){
                    String url = lstUserAcc[0].AMPUrl__c +'/api/SyncSalesforceOpportunity?app='+appHash+'&key='+apiKey;
                 
                    List<Opportunity> opps = [SELECT Id, Name,LastModifiedDate FROM Opportunity WHERE Id IN : oppIds ];
                    retVal.writeStartArray();
                    for(Opportunity opp : opps)
                    {
                        if (opp != null && opp.Id!=null) 
                        {
                            JSONGenerator gen = JSON.createGenerator(true);
                            gen.writeStartObject();
                            gen.writeStringField('crmrecordid', opp.Id);
                            gen.writeStringField('userid', lstUserAcc[0].AMPID__c);
                            gen.writeEndObject();
                            string jsonS = gen.getAsString();
                            string postResult = AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,'');
                            AMPGetWebServiceResponse.JsonResult result = (AMPGetWebServiceResponse.JsonResult)JSON.deserialize(postResult , AMPGetWebServiceResponse.JsonResult.class);
                            retVal.writeStartObject();
                            if(result.status > 0)
                            {
                                retVal.writeNumberField('status', 0);
                                retVal.writeStringField('result', opp.Name + ' failed to Sync');
                            }
                            else
                            {
                                retVal.writeNumberField('status', 1);
                                retVal.writeStringField('result', opp.Name + ' synced successfully');
                            }
                            retVal.writeEndObject();
                        }
                    }
                    retVal.writeEndArray();
                 
                }
            } 
        } 
        catch(Exception ex) {  } 
        return retVal.getAsString();*/
        return '';
    }
}