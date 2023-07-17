// we are not using this class anymore
public with sharing class AMPGetLeadPlaybooks {

/*    public String infoPageURL {get;set;} 
    public String whatSection {get;set;}
    
    public AMPGetLeadPlaybooks(ApexPages.StandardController controller) {

    }
    
    public PageReference getRelatedPlaybookAssets() {
        
        
        
        try {
            //Get Registered Users Details
            AMPUserAccDetail ampUser = new AMPUserAccDetail();
            List<AMPUserDetails__c> lstUserinfo = ampUser.getAMPUserDetail();
            String requiredURL, requestURL, accessToken, leadEmail='', FirstName='', LastName='', Company='', Industry ='';
            Id leadID;
            Integer ampID = 0;
            DateTime UpdatedOn = System.now();
            
            //Check if user exists?
            if(lstUserinfo.size() > 0) {
                if(Schema.sObjectType.Lead.isAccessible()){
                leadID = System.currentPageReference().getParameters().get('id');
                
                if(leadID != null) {
                    //Get AMP URL
                    for(AMPUserDetails__c ampc : lstUserinfo) {
                        requiredURL = ampc.AMPUrl__c;
                        ampID = Integer.ValueOf(ampc.AMPID__c);
                        accessToken = ampc.AccessToken__c;
                    }
                    
                    List<Lead> ld = [SELECT Email, FirstName, LastName, Company, Industry, LastModifiedDate FROM Lead WHERE id =: leadID WITH SECURITY_ENFORCED LIMIT 1];

                        if(ld[0].Email != null) leadEmail = ld[0].Email;
                        if(ld[0].FirstName != null) FirstName = ld[0].FirstName;
                        if(ld[0].LastName != null) LastName = ld[0].LastName;
                        if(ld[0].Company != null) Company = ld[0].Company;
                        if(ld[0].Industry != null) Industry = ld[0].Industry;

                        UpdatedOn = ld[0].LastModifiedDate;
                        String task = (whatSection == 'playbook') ? 'executeplaybook': 'assets';
                        string contactURL = 'handleapprequests?task='+ task +'&email='+ EncodingUtil.urlEncode(leadEmail, 'UTF-8') + '&firstname='+EncodingUtil.urlEncode(FirstName, 'UTF-8')+'&lastname='+EncodingUtil.urlEncode(LastName, 'UTF-8')+'&company='+EncodingUtil.urlEncode(Company, 'UTF-8')+'&industry='+EncodingUtil.urlEncode(Industry, 'UTF-8') +'&crmid='+EncodingUtil.urlEncode(leadID, 'UTF-8')+ '&source='+EncodingUtil.urlEncode('lead', 'UTF-8') + '&updatedon='+EncodingUtil.urlEncode(String.valueOf(UpdatedOn), 'UTF-8') + '&tpapp=sfdc';
                    	infoPageURL = lstUserInfo[0].AMPUrl__c + '//?elt='+lstUserInfo[0].AMPSha1Key__c +'#'+  contactUrl;
                        //infoPageURL = lstUserInfo[0].AMPUrl__c + 'login/'+ EncodingUtil.urlEncode(lstUserInfo[0].AMPUName__c, 'UTF-8') +'/'+lstUserInfo[0].AMPSha1Key__c+'?returnurl=' + EncodingUtil.urlEncode('/handleapprequests?task='+ task +'&email='+ EncodingUtil.urlEncode(leadEmail, 'UTF-8') + '&firstname='+EncodingUtil.urlEncode(FirstName, 'UTF-8')+'&lastname='+EncodingUtil.urlEncode(LastName, 'UTF-8')+'&company='+EncodingUtil.urlEncode(Company, 'UTF-8')+'&industry='+EncodingUtil.urlEncode(Industry, 'UTF-8') +'&crmid='+EncodingUtil.urlEncode(leadID, 'UTF-8')+ '&source='+EncodingUtil.urlEncode('lead', 'UTF-8') + '&updatedon='+EncodingUtil.urlEncode(String.valueOf(UpdatedOn), 'UTF-8') + '&tpapp=sfdc', 'UTF-8');
                        
                    }
                  }
                }
        }
        catch (Exception ex) {} finally { /* Pupulate Recipient List PopulateRecipientList.populatelist(); } return null;
    }   */
}