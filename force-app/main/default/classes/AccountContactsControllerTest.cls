@isTest
Private class AccountContactsControllerTest {
  /*  private static TestMethod void testAccContactSync() {
   
        // create an instance of the controller        
        PageReference pageRef = Page.AMPSFContactSync;
        Test.setCurrentPage(pageRef);
        
        Account newAcc = new Account(Name = 'test');
        insert newAcc;
        
        // Verify that the initial state is as expected.
        newAcc = [SELECT Name, Website FROM Account WHERE Id = :newAcc.Id];
        System.assertEquals(null, newAcc.Website);
        
        AccountContactsController acc = new AccountContactsController();
        
        acc.getRendered();
        //call the method for populuating the Account picklist
        List<selectOption> accList = acc.getValues();
        System.AssertNotEquals(0, accList.size()); //assert that the size of our picklist is not 0
                
        //call the method for populuating the Account picklist
        List<selectOption> recptList = acc.getListValues();
        System.AssertEquals(0, recptList.size()); //assert that the size of our picklist is not 0
        acc.accID = null;
        //ApexPages.currentPage().getParameters().put('id', '0039000000Bfdv9');
        acc.search();
        
        //Insert Account
        Account newAcc1 = new Account(Name = 'test1');
        insert newAcc1;
        
        // Verify that the initial state is as expected.
        newAcc1 = [SELECT Name, Website FROM Account WHERE Id = :newAcc1.Id];
        System.assertEquals(null, newAcc1.Website);
        
        //Insert contacts
        Contact newContact = new Contact(
        FirstName = 'Joe',         
        LastName = 'Tester',
        Email = 'joe.tester@mindmatrix.net',
        AccountID = newAcc1.id);
        insert newContact;
        
        newContact = [SELECT Id, AccountID FROM Contact WHERE Id =: newContact.Id];
        System.assertEquals(newAcc1.id, newContact.AccountID);
        
        Contact newContact1 = new Contact(
        FirstName = 'Shailesh', 
        LastName = 'Tayde',
        Email = 'shailesh.tayde@maxval.net',
        AccountID = newAcc1.id);
        insert newContact1;
       
        newContact = [SELECT Id, AccountID FROM Contact WHERE Id =: newContact1.Id];
        System.assertEquals(newAcc1.id, newContact1.AccountID);
        
        acc.accID = newAcc1.id;        
        acc.search();        
        acc.listID='';
        acc.SyncContacts();
        
        AMPUpdateContactFromPortalUser.manageContacts(acc.accID, '');
        acc.SyncContacts();
        acc.Back();
                
        //3
        AccountContactsController acc1 = new AccountContactsController();
        ApexPages.currentPage().getParameters().put('id', '0039000000Bfdv9');
        acc1.search();        
        acc1.listID='';
        acc1.SyncContacts();
    }*/
}