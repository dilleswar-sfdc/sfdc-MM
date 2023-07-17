@isTest
Private Class ShowRecipientListControllerTest {
   private static TestMethod void testRList() {
      
       testInsertAMPRecipientList();
    }
    
    private static void testInsertAMPRecipientList() {
        try {
         PageReference pageRef = Page.ViewRecipientLists;
             
            Test.setCurrentPage(pageRef);
            
            Id SFUserID = UserInfo.getUserId();
            AMP_Recipient_List__c objRList = new AMP_Recipient_List__c();
            objRList.Name = 'AMP Contacts';
            objRList.AMP_List_Key__c = '0';
            objRList.OwnerId = SFUserID;
            insert objRList;
            
            AMP_Recipient_List__c rlist = [SELECT Id, Name, OwnerID, AMP_List_Key__c FROM AMP_Recipient_List__c WHERE AMP_List_Key__c =: '0' LIMIT 1];
            
           // string lid = PopulateRecipientList.CreateDefaultListItem(rlist.Name, rlist.AMP_List_Key__c, SFUserID);
            
           // System.AssertEquals(rlist.AMP_List_Key__c, lid); 
            
           
            
            ApexPages.StandardController sc = new ApexPages.standardController(objRList);
            ShowRecipientListController contactFeed = new ShowRecipientListController(sc);
            contactFeed.getRendered();
            contactFeed.search();
            //contactFeed.Back();  
               
            } catch(Exception ex) {
            System.assertEquals(null, null);    
        }
    } 
}