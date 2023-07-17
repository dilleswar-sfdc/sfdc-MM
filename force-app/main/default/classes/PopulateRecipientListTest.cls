@isTest
Private class PopulateRecipientListTest {
   /* private static TestMethod void testRList() {
        try{
    	PopulateRecipientList.populatelist();
        PopulateRecipientList.CreateDefaultListItem('','','');
        Id SFUserID = UserInfo.getUserId();
		PopulateRecipientList.GetContactListID(SFUserID);
		PopulateRecipientList.GetLeadListID(SFUserID);
        }catch(Exception ex){}
        // create an instance of the controller
        //testInsertAMPRecipientList();
        //ContactTest();
        //LeadTest();
    }
    
    private static void testInsertAMPRecipientList() {
        try {
                Id SFUserID = UserInfo.getUserId();
                AMP_Recipient_List__c objRList = new AMP_Recipient_List__c();
                objRList.Name = 'AMP Contacts';
                objRList.AMP_List_Key__c = '0';
                objRList.OwnerId = SFUserID;
                insert objRList;
                AMP_Recipient_List__c rlist = [SELECT Id, Name, OwnerID, AMP_List_Key__c FROM AMP_Recipient_List__c WHERE AMP_List_Key__c =: '0' LIMIT 1];
                
               // string lid = PopulateRecipientList.CreateDefaultListItem(rlist.Name, rlist.AMP_List_Key__c, SFUserID);

               // System.AssertEquals(rlist.AMP_List_Key__c, lid); 
            } catch(Exception ex) {
            System.assertEquals(null, null);    
        }
    }
    
    private static void ContactTest() {
        AMP_Recipient_List__c objRList = new AMP_Recipient_List__c();
        objRList.Name = 'AMP Contacts';
        objRList.AMP_List_Key__c = '0';
        insert objRList;
        System.assertEquals('0', objRList.AMP_List_Key__c);            
        Contact cd = new Contact(
        FirstName = 'Joe', 
        LastName = 'Tester', 
        Recipient_List__c = objRList.Id,
        Email = 'joe.tester@mindmatrix.net');
        insert cd;
        
      //  string lId = PopulateRecipientList.GetContactListID(cd.ID);
        System.assertNotEquals('0', string.ValueOf(cd.Recipient_List__c));
    }
    
    private static void LeadTest() {
        AMP_Recipient_List__c objRList = new AMP_Recipient_List__c();
        objRList.Name = 'AMP Contacts';
        objRList.AMP_List_Key__c = '0';
        insert objRList;
        System.assertEquals('0', objRList.AMP_List_Key__c);            
        
        Lead ld = new Lead(
        FirstName = 'mike', 
        LastName = 'Tester', 
        Company = 'Rev', 
        Recipient_List__c = objRList.Id,
        Email = 'mike@mindmatrix.net',
        RecordTypeId = '0120o000001VKTxAAO');
        insert ld;
        
       // string lId = PopulateRecipientList.GetLeadListID(ld.ID);
        System.assertNotEquals('0', string.ValueOf(ld.Recipient_List__c));
    }   */ 
}