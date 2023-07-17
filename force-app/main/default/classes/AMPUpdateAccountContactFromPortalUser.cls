public with sharing class AMPUpdateAccountContactFromPortalUser {
    @Future(callout=true)
    // Call from contacts section using trigger : AMPSFSyncAccountContactTr
    public static void updateAllContacts(Set<Id> accountIds) {
        try {
            if(Schema.sObjectType.Contact.isAccessible()){
                List<Contact> uContacts = [SELECT Id FROM Contact WHERE AccountId IN :accountIds WITH SECURITY_ENFORCED]; 
                if(uContacts.size() !=0 ) {
                    for(Contact c : uContacts) {
                        AMPUpdateContactFromPortalUser.manageContacts(c.Id, '');  
                    } ProcessorControl.inFutureContext = true; 
                } 
            }
        }
        catch(Exception ex) {  } } }