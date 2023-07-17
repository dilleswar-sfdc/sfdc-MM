public with sharing class AMPGetOpportunityPlaybooksAndAssets {
    
    public String infoPageURL {get;set;} 
    public String whatSection {get;set;} 
    
    public AMPGetOpportunityPlaybooksAndAssets(ApexPages.StandardController controller) {
        
    }
    
    public PageReference getRelatedPlaybookAssets() {
         
       
        if(!Schema.sObjectType.AMPUserDetails__c.fields.AMPUrl__c.isAccessible()&& !Schema.sObjectType.AMPUserDetails__c.fields.AccessToken__c.isAccessible())
            return null;
        
        try {
            //Get Registered Users Details
            AMPUserAccDetail ampUser = new AMPUserAccDetail();
            List<AMPUserDetails__c> lstUserinfo = ampUser.getAMPUserDetail();
            String requiredURL, requestURL, accessToken, Filters='';
            Integer ampID = 0;
            DateTime UpdatedOn = System.now();
            Id OpportunityID = System.currentPageReference().getParameters().get('id');
            //Check if user exists?
            if(OpportunityID != null) {
            
                List<Opportunity> oppt = [SELECT Name, Type, StageName, LastModifiedDate, Account.Name, Account.Industry, LeadSource FROM Opportunity WHERE id =: OpportunityID WITH SECURITY_ENFORCED LIMIT 1];
                
                if(oppt[0].Name != null) Filters = oppt[0].Name;
                if(oppt[0].Type != null) if(Filters != '') { Filters = Filters + ' ' + oppt[0].Type; }
                if(oppt[0].StageName != null) if(Filters != '') { Filters = Filters + ' ' + oppt[0].StageName; }
                //if(oppt[0].Account.Name != null) if(Filters != '') { Filters = Filters + ' ' + oppt[0].Account.Name; }
                if(oppt[0].Account.Industry != null) if(Filters != '') { Filters = Filters + ' ' + oppt[0].Account.Industry; }
                
                UpdatedOn = oppt[0].LastModifiedDate;
                String task = (whatSection == 'playbook') ? 'internalplaybooks': 'assets';
                if(lstUserinfo.size() > 0) {
                    //Get AMP URL
                    for(AMPUserDetails__c ampc : lstUserinfo) {
                        requiredURL = ampc.AMPUrl__c;
                        ampID = Integer.ValueOf(ampc.AMPID__c);
                        accessToken = ampc.AccessToken__c;
                    }
                    string oppUrl = 'handleapprequests?task='+ task +'&filterparam='+EncodingUtil.urlEncode(Filters, 'UTF-8') +'&crmid='+EncodingUtil.urlEncode(OpportunityID, 'UTF-8')+ '&source='+EncodingUtil.urlEncode('opportunity', 'UTF-8')+ '&updatedon='+EncodingUtil.urlEncode(String.valueOf(UpdatedOn), 'UTF-8')+'&tpapp=sfdc';
                    infoPageURL = lstUserInfo[0].AMPUrl__c + '//?elt='+lstUserInfo[0].AMPSha1Key__c +'#'+  oppUrl;
                    //infoPageURL = lstUserInfo[0].AMPUrl__c + 'login/'+ EncodingUtil.urlEncode(lstUserInfo[0].AMPUName__c, 'UTF-8') +'/'+lstUserInfo[0].AMPSha1Key__c+'?returnurl=' + EncodingUtil.urlEncode('/handleapprequests?task='+ task +'&filterparam='+EncodingUtil.urlEncode(Filters, 'UTF-8') +'&crmid='+EncodingUtil.urlEncode(OpportunityID, 'UTF-8')+ '&source='+EncodingUtil.urlEncode('opportunity', 'UTF-8')+ '&updatedon='+EncodingUtil.urlEncode(String.valueOf(UpdatedOn), 'UTF-8')+'&tpapp=sfdc', 'UTF-8');
                   
                    
                }
                else
                {
                    MindMatrix__AMPAPIDetailsV2__c api = MindMatrix__AMPAPIDetailsV2__c.getInstance();
                    if(api != null && api.MindMatrix__InstallUrl__c != ''){
                        infoPageURL = api.MindMatrix__InstallUrl__c +  '/handleapprequests?task='+ task +'&filterparam='+EncodingUtil.urlEncode(Filters, 'UTF-8') +'&crmid='+EncodingUtil.urlEncode(OpportunityID, 'UTF-8')+ '&source='+EncodingUtil.urlEncode('opportunity', 'UTF-8')+ '&updatedon='+EncodingUtil.urlEncode(String.valueOf(UpdatedOn), 'UTF-8')+'&tpapp=sfdc';
                      
                    }
                }
              
            }
            
        } 
        catch (Exception ex) {} 
        finally { /* Pupulate Recipient List PopulateRecipientList.populatelist();*/} return null;
    }   
}