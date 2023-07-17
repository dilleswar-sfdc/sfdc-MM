public with sharing class AMPGetContactPlaybooks {

    public String infoPageURL {get;set;} 
    public String whatSection {get;set;}
    public Boolean ShowAMPPage  {get;set;}
    public AMPGetContactPlaybooks(ApexPages.StandardController controller) {
        ShowAMPPage = true;
    }
    
    public PageReference getRelatedPlaybookAssets() {
       
        try {
            //Get Registered Users Details
            AMPUserAccDetail ampUser = new AMPUserAccDetail();
            List<AMPUserDetails__c> lstUserinfo = ampUser.getAMPUserDetail();
            String requiredURL, requestURL, accessToken, contactEmail='', FirstName='', LastName='',Company='', Industry ='';
            Id contactID;
            Integer ampID = 0;
            DateTime UpdatedOn = System.now();
            
            //Check if user exists?
            if(lstUserinfo.size() > 0) {
              
                contactID = System.currentPageReference().getParameters().get('id');
                
                if(contactID != null) {
                    //Get AMP URL
                    for(AMPUserDetails__c ampc : lstUserinfo) {
                        requiredURL = ampc.AMPUrl__c;
                        ampID = Integer.ValueOf(ampc.AMPID__c);
                        accessToken = ampc.AccessToken__c;
                    }
                    
                    List<Contact> cont = [SELECT Email, FirstName, LastName, LastModifiedDate, Account.Name, Account.Industry,Account.MindMatrix__IsPartner__c FROM Contact WHERE id =: contactID WITH SECURITY_ENFORCED LIMIT 1];
                    
                        if(cont[0].Account.MindMatrix__IsPartner__c != null)
                        {
                            if(cont[0].Account.MindMatrix__IsPartner__c)
                            {
                                ShowAMPPage = false;
                            }
                        }
                    
                        if(cont[0].Email != null) contactEmail = cont[0].Email;
                        if(cont[0].FirstName != null) FirstName = cont[0].FirstName;
                        if(cont[0].LastName != null) LastName = cont[0].LastName;
                        if(cont[0].Account.Name != null) Company = cont[0].Account.Name;
                        if(cont[0].Account.Industry != null) Industry = cont[0].Account.Industry;
                        
                        UpdatedOn = cont[0].LastModifiedDate;
                        String task = (whatSection == 'playbook') ? 'internalplaybooks': 'assets';
                        if(ShowAMPPage){
                            string contactURL = 'handleapprequests?task='+ task +'&email='+ EncodingUtil.urlEncode(contactEmail, 'UTF-8') + '&firstname='+EncodingUtil.urlEncode(FirstName, 'UTF-8')+'&lastname='+EncodingUtil.urlEncode(LastName, 'UTF-8')+'&company='+EncodingUtil.urlEncode(Company, 'UTF-8')+'&industry='+EncodingUtil.urlEncode(Industry, 'UTF-8') +'&crmid='+EncodingUtil.urlEncode(contactID, 'UTF-8')+ '&source='+EncodingUtil.urlEncode('contact', 'UTF-8') + '&updatedon='+EncodingUtil.urlEncode(String.valueOf(UpdatedOn), 'UTF-8') +'&tpapp=sfdc';
                            infoPageURL = lstUserInfo[0].AMPUrl__c + '//?elt='+lstUserInfo[0].AMPSha1Key__c +'#'+  contactUrl;
                            //infoPageURL = lstUserInfo[0].AMPUrl__c + 'login/'+ EncodingUtil.urlEncode(lstUserInfo[0].AMPUName__c, 'UTF-8') +'/'+lstUserInfo[0].AMPSha1Key__c+'?returnurl=' + EncodingUtil.urlEncode('/handleapprequests?task='+ task +'&email='+ EncodingUtil.urlEncode(contactEmail, 'UTF-8') + '&firstname='+EncodingUtil.urlEncode(FirstName, 'UTF-8')+'&lastname='+EncodingUtil.urlEncode(LastName, 'UTF-8')+'&company='+EncodingUtil.urlEncode(Company, 'UTF-8')+'&industry='+EncodingUtil.urlEncode(Industry, 'UTF-8') +'&crmid='+EncodingUtil.urlEncode(contactID, 'UTF-8')+ '&source='+EncodingUtil.urlEncode('contact', 'UTF-8') + '&updatedon='+EncodingUtil.urlEncode(String.valueOf(UpdatedOn), 'UTF-8') +'&tpapp=sfdc', 'UTF-8');
                        }
                        else
                        {
                            string errMsg = 'This contact is of partner account hence AMP widgets will not be loaded.';
                            ApexPages.addmessage(new ApexPages.message(ApexPages.severity.INFO,errMsg));
                        }
                        
                        
                        }
                  
            }
        } 
        catch (Exception ex) {} finally { /* Pupulate Recipient List PopulateRecipientList.populatelist();*/} return null;
    }   
}