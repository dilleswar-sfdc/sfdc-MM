//we are not using this class anymore
public with sharing class AMPGetLeadFeed {
        //this class is depreicated
        //
   /* public String infoPageURL {get;set;} 
            
    public AMPGetLeadFeed(ApexPages.StandardController controller) {
    }
    
    public PageReference getActivityFeed() {
        
        
        try {
            //Get Registered Users Details
            AMPUserAccDetail ampUser = new AMPUserAccDetail();
            List<AMPUserDetails__c> lstUserinfo = ampUser.getAMPUserDetail();
            String requiredURL, requestURL, accessToken, contactEmail='', FirstName='', LastName='',Company='', Industry='';
            Id leadID;
            Integer ampID = 0;
            DateTime UpdatedOn = System.now();
            
            //Check if user exists?
            if(lstUserinfo.size() > 0) {
                
                leadID = System.currentPageReference().getParameters().get('id');
                if(leadID != null) {
                    //Get AMP URL
                    for(AMPUserDetails__c ampc : lstUserinfo) {
                        requiredURL = ampc.AMPUrl__c;
                        ampID = Integer.ValueOf(ampc.AMPID__c);
                        accessToken = ampc.AccessToken__c;
                    }
                    List<Lead> ld = [SELECT Id, Email, FirstName, LastName, Company, Industry, LastModifiedDate FROM Lead WHERE id =:LeadID WITH SECURITY_ENFORCED LIMIT 1];
                                            
                   //if(ld.size() > 0 && ld[0].Email != null) {
                        if(ld[0].Email != null) contactEmail = ld[0].Email;
                        if(ld[0].FirstName != null) FirstName = ld[0].FirstName;
                        if(ld[0].LastName != null) LastName = ld[0].LastName;
                        if(ld[0].Company != null) Company = ld[0].Company;
                        if(ld[0].Industry != null) Industry = ld[0].Industry;
                        string contactUrl = 'crmcontactstats?id='+EncodingUtil.urlEncode(lstUserInfo[0].AMPID__c, 'UTF-8') + '&email='+ EncodingUtil.urlEncode(contactEmail, 'UTF-8') + '&firstname='+EncodingUtil.urlEncode(FirstName, 'UTF-8')+'&lastname='+EncodingUtil.urlEncode(LastName, 'UTF-8')+'&company='+EncodingUtil.urlEncode(Company, 'UTF-8')+'&industry='+EncodingUtil.urlEncode(Industry, 'UTF-8') + '&crmid='+EncodingUtil.urlEncode(leadID, 'UTF-8') + '&source='+EncodingUtil.urlEncode('lead', 'UTF-8')+ '&updatedon='+EncodingUtil.urlEncode(String.valueOf(UpdatedOn), 'UTF-8') +'&tpapp=sfdc';
                        infoPageURL = lstUserInfo[0].AMPUrl__c + '//?elt='+lstUserInfo[0].AMPSha1Key__c +'#'+  contactUrl;
                        //infoPageURL = lstUserInfo[0].AMPUrl__c + 'crmcontactstats?id='+EncodingUtil.urlEncode(lstUserInfo[0].AMPID__c, 'UTF-8')+ '&key='+ EncodingUtil.urlEncode(lstUserInfo[0].AccessToken__c, 'UTF-8') +'&email='+ EncodingUtil.urlEncode(contactEmail, 'UTF-8') + '&firstname='+EncodingUtil.urlEncode(FirstName, 'UTF-8')+'&lastname='+EncodingUtil.urlEncode(LastName, 'UTF-8')+'&company='+EncodingUtil.urlEncode(Company, 'UTF-8')+'&industry='+EncodingUtil.urlEncode(Industry, 'UTF-8') + '&crmid='+EncodingUtil.urlEncode(leadID, 'UTF-8') + '&source='+EncodingUtil.urlEncode('lead', 'UTF-8')+ '&updatedon='+EncodingUtil.urlEncode(String.valueOf(UpdatedOn), 'UTF-8') +'&tpapp=sfdc';
                   
                   //} 
                    }
                
                }
        } 
        catch (Exception ex) {}finally {/* Pupulate Recipient List PopulateRecipientList.populatelist(); } return null;
    }*/
}