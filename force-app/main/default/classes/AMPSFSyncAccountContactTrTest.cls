@isTest
Private Class AMPSFSyncAccountContactTrTest {
    public static testMethod void testAccContact() {
        test.startTest();
        Account act = new Account();
        act.Name='TestAccount';
        insert act;
        
        Contact con = new Contact(
        FirstName = 'Joe1', 
        LastName = 'Tester1', 
        Email = 'joe.tester@mindmatrix1.net', 
        Title = 'Project Manager1',
        AccountID = act.id);
        insert con;
        
        Set<Id> lContacts = new Set<Id>();
        //lContacts.add(con.Id);
            
        act.Name = 'MM Test';
        con.AccountID = act.id;
        try {
            update act;
            update con;
        } catch (System.DmlException e){ 
        }
        test.stopTest();   
        List<Contact> uContacts = [SELECT Id FROM Contact WHERE AccountId =: act.ID]; 
        if(uContacts.size() !=0 ) {
            for(Contact c : uContacts) {
                lContacts.add(con.Id);                
            }
        }
        AMPUpdateContactFromPortalUser.updateContacts(lContacts, '');
        System.assertEquals(act.id, con.AccountID);
    }
}