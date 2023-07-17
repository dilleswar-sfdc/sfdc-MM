public with sharing class AMPUpdateContactFromPortalUser {
    // Call from contacts section using trigger : AMPSFSyncContactTr
    public static void updateContacts(Set<Id> contactIds, String recipientListId) {
       
         
        try {
            if(!contactIds.isEmpty()) {
                Id accId;
                String strStage = '';
                Decimal dAmount = 0.0;
             if(Schema.sObjectType.Contact.isAccessible()){
                //For loop starts here : 
                List<Contact> contacts = [SELECT Id,LastModifiedDate, Email, FirstName, LastName, Phone, Title, AccountId, Account.Name, Account.Type, Account.Industry,Account.MindMatrix__IsPartner__c, MindMatrix__Interest_Level__c, LeadSource, MindMatrix__Prospect_Contact__c FROM Contact WHERE Id IN :contactIds WITH SECURITY_ENFORCED];
                //SOQL to get Contacts and Opportunities for updated Accounts
                for (Contact cont : contacts ) {
                    //Contact
                    //Contact cont = [SELECT Id, Email, FirstName, LastName, Phone, Title, AccountId, Account.Name, Account.Type, Account.Industry, Interest_Level__c, LeadSource, Prospect_Contact__c FROM Contact WHERE Id IN :contactIds];
                  
                    if (cont != null && cont.Id!=null) 
                    {
                        Boolean syncContact = true;
                        if(cont.Account != null && cont.Account.MindMatrix__IsPartner__c != null)
                        {
                            if(cont.Account.MindMatrix__IsPartner__c)
                            {
                                syncContact = false;
                            }
                        }
                        if(syncContact){
                            //Get Contact related opportunity using Opportunity Contact Role
                         if(Schema.sObjectType.OpportunityContactRole.isAccessible()){
                            List<OpportunityContactRole> contactOppt = [SELECT Id, IsPrimary, OpportunityId, Opportunity.Name, Opportunity.Amount, Opportunity.StageName FROM OpportunityContactRole WHERE ContactId =: cont.Id AND (Opportunity.StageName != 'Closed Won' AND Opportunity.StageName != 'Closed Lost') WITH SECURITY_ENFORCED ORDER BY Opportunity.LastModifiedDate  DESC  LIMIT 1 ];
                            if(contactOppt.size() != 0) {
                                strStage = contactOppt[0].Opportunity.StageName; // Opportunity Stage Name
                                if(contactOppt[0].Opportunity.Amount != null) //Opportunity Amount
                                    dAmount = contactOppt[0].Opportunity.Amount;
                            }
                            // Get Reciepent list    
                           /* if(recipientListId == '')
                                recipientListId = PopulateRecipientList.GetContactListID(cont.Id);*/
                                
                            //Write web service code here
                            String result = modifyData(recipientListId, cont.Email, cont.FirstName, cont.LastName, cont.Phone, cont.Account.Name, cont.Account.Type, cont.Account.Industry, cont.MindMatrix__Interest_Level__c, cont.LeadSource, cont.MindMatrix__Prospect_Contact__c, strStage, dAmount, cont.Id,cont.LastModifiedDate); 
                          }
                        }
                    } 
                } 
                ProcessorControl.inFutureContext = true;
             }  
            } 
        } catch(Exception ex) {  } 
    }

    // Call method from contact sync class
    public static String manageContacts(String contactId, String recipientListId) {
       
        String result = '';
        Id accId;
        String strStage = '';
        Decimal dAmount = 0.0;
        try {
            
         if(Schema.sObjectType.Contact.isAccessible()){
            Contact cont = [SELECT Id,LastModifiedDate, Email, FirstName, LastName, Phone, Title, AccountId, Account.Name, Account.Type, Account.Industry, MindMatrix__Interest_Level__c, LeadSource, MindMatrix__Prospect_Contact__c FROM Contact WHERE Id =:contactId WITH SECURITY_ENFORCED];

            if (cont != null && cont.Id!=null) {
             if(Schema.sObjectType.OpportunityContactRole.isAccessible()){
                //Get Contact related opportunity using Opportunity Contact Role
                List<OpportunityContactRole> contactOppt = [SELECT Id, IsPrimary, OpportunityId, Opportunity.Name, Opportunity.Amount, Opportunity.StageName FROM OpportunityContactRole WHERE ContactId =: contactId AND (Opportunity.StageName != 'Closed Won' AND Opportunity.StageName != 'Closed Lost') WITH SECURITY_ENFORCED ORDER BY Opportunity.LastModifiedDate DESC  LIMIT 1];
                if(contactOppt.size() != 0) {
                    strStage = contactOppt[0].Opportunity.StageName; // Opportunity Stage Name
                    if(contactOppt[0].Opportunity.Amount != null) //Opportunity Amount
                        dAmount = contactOppt[0].Opportunity.Amount;
                }
                //Write web service code here
                result = modifyData(recipientListId, cont.Email, cont.FirstName, cont.LastName, cont.Phone, cont.Account.Name, cont.Account.Type, cont.Account.Industry, cont.MindMatrix__Interest_Level__c, cont.LeadSource, cont.MindMatrix__Prospect_Contact__c, strStage, dAmount, cont.Id,cont.LastModifiedDate);
             }
            }
         }
        } 
        catch(Exception ex) {
            result = ex.getMessage();
        }
        return result;
    }
   
    public static String modifyData(String recipientListId, String Email, string FirstName, String LastName, String PhoneNo, String AccountName, String ContactType, String IndusctyType, String InterestLevel, String LeadSource, String ProspectContact, String OppStage, Decimal OppAmount, string CRMID,Datetime LastModifiedDate) {
        String jsonResp = '', strMessage='', ampAddContactUrl='';
        try {
            AMPUserAccDetail userAcc = new AMPUserAccDetail();
            List<AMPUserDetails__c> lstUserAcc = userAcc.getAMPUserDetail();
            if(lstUserAcc.size() > 0) { 
                if(ProspectContact == null) ProspectContact = 'No'; if(PhoneNo == null) PhoneNo = ''; if(FirstName == null) FirstName = ''; if(AccountName == null) AccountName = '';if(IndusctyType == null) IndusctyType = '';
                if(AccountName == null) AccountName = '';
                JSONGenerator gen = JSON.createGenerator(true);    
                gen.writeStartObject();
                gen.writeStringField('firstName', FirstName);
                gen.writeStringField('lastName', LastName);
                gen.writeStringField('company', AccountName);
                gen.writeStringField('industry', IndusctyType);
                gen.writeStringField('email', Email);
                gen.writeStringField('tpapp', 'sfdc');
                gen.writeStringField('source', 'contact');
                gen.writeStringField('crmContactId', CRMID);
                gen.writeDateTimeField('updatedon',LastModifiedDate);
                gen.writeStringField('index', '0');
                //gen.writeStringField('useremail', useremail);
                gen.writeEndObject();
                String jsonS = gen.getAsString();
                ampAddContactUrl = lstUserAcc[0].AMPUrl__c + 'api/SFContactSync';
                 strMessage= AMPGetWebServiceResponse.PostDataJSONResponse(ampAddContactUrl,jsonS,lstUserAcc[0].ClientSecret__c);
            }
        } 
        catch(Exception ex) {
            strMessage = ex.getMessage();
        }
        return strMessage;
        }
    
        
    }