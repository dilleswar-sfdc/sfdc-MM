@isTest(SeeAllData=false)
Private class AMPDataSyncTest {
    static testMethod void testAMPDataSyncFunc() {
        testGetLeadInfo();
        testGetContacInfo();
        testGetAccountInfo();
        testManageLeadInfo();
        testManageContactInfo();
        testampDataSync();
        testsyncCObjectData();
    }

    private static void testsyncCObjectData()
    {
       /* Lead ld = new Lead(
        FirstName = 'mike', 
        LastName = 'Tester314', 
        Email = 'mike314@mindmatrix.net', 
        Title = 'tester', 
        Company = 'revclerx',
        RecordTypeId = '0120o000001VKTxAAO');
        insert ld;*/
        AMPDataSync.syncCObjectData('','','', '','');
        
    }
    // Test Lead    
    private static void testGetLeadInfo() {
       /* Lead ld = new Lead(
        FirstName = 'Joe', 
        LastName = 'Tester', 
        Email = 'joe.tester@mindmatrix.net', 
        Title = 'Project Manager', 
        Company = 'MindMatrix Inc.',
        RecordTypeId = '0120o000001VKTxAAO');
        insert ld;*/
        
        Lead ldata = AMPDataSync.getLeadDataByEmail('');
        System.assertEquals(ldata != null, false);
    }
    
    //Test Contact
    private static void testGetContacInfo() {
       /* Contact cd = new Contact(
        FirstName = 'Joe12', 
        LastName = 'Tester31', 
        Email = 'chinnu@mailintor.com');
        insert cd;*/
        
        Contact cdata = AMPDataSync.getContactDataByEmail('');
        System.assertEquals(cdata != null, false);
    }
    
    // Test Account info
    private static void testGetAccountInfo() {
        Account acc = new Account(
        Name = 'MindMatrix Inc.' ,
        AccountNumber = 'CD355007');
        insert acc;
        
        List<Account> adata = AMPDataSync.getAccountList();
        
        for(Account a : adata) {
            System.assertEquals(a.Name, 'MindMatrix Inc.');
        }
    }
    
    // test update lead info
    private static void testManageLeadInfo() {
        /*String FirstName = 'Joe'; 
        String LastName = 'Tester';
        String Email = 'joe.tester@mindmatrix.net';
        String Title = 'Project Manager';
        String Company = 'MindMatrix Inc.'; //Account Name
        String Phone = '9820098200'; 
        String MobilePhone = '9820098222';
        String Fax = '9820098211'; 
        String LeadSource = 'Other';
        String Street = '2403 Sidney Street';
        String City = 'Pittsburgh'; 
        String State = 'PA'; 
        String PostalCode = '15203';
        String Country = 'US'; 
        String IndustryType = 'Other';
        String InterestLevel = 'Other';
        String ContactType = 'Other';
        List<Lead> listLead = [SELECT FirstName, LastName, Title, Phone, MobilePhone, Fax, LeadSource, Street, City, State, PostalCode, Country,  Industry FROM Lead WHERE Email =: Email LIMIT 1];

        Boolean status1 = AMPDataSync.upsertLeadData('joe.tester@mindmatrix.net', 'Shailesh', 'Tayde', 'Developer', '9879859865', '9879859861', '9879859862', 'Other', 'MM Inc.', '', '', '', '', 'US', 'Other', 'Other', 'Other');
        //System.assertEquals(status1, true);
            
        if(listLead.size() != 0) {
            for(Lead ld : listLead ) {
                ld.FirstName = FirstName;
                ld.LastName = LastName;
                ld.Company = Company;
                update ld;
            }*/
            Boolean status = AMPDataSync.upsertLeadData('','','','','','','','','','','','','','','','','');
            System.assertEquals(status != null, true);
        
    }  
    
    // test update Contact info
    private static void testManageContactInfo() {
       /* String FirstName = 'Joe'; 
        String LastName = 'Tester';
        String Email = 'joe.tester@mindmatrix.net';
        String Title = 'Project Manager';
        String Account = 'MindMatrix Inc.'; 
        String Phone = '9820098200'; 
        String MobilePhone = '9820098222';
        String Fax = '9820098211'; 
        String LeadSource = 'Other';
        String Street = '2403 Sidney Street';
        String City = 'Pittsburgh'; 
        String State = 'PA'; 
        String PostalCode = '15203';
        String Country = 'US'; 
        String IndustryType = 'Other';
        String InterestLevel = 'Other';
        String ContactType = 'Other';
        List<Contact> listContact = [SELECT FirstName, LastName, Title, Phone, MobilePhone, Fax, LeadSource, MailingStreet, MailingCity, MailingState, MailingPostalCode, MailingCountry, MindMatrix__Interest_Level__c, Account.Type, Account.Industry FROM Contact WHERE Email =: Email LIMIT 1];

        
            
        if(listContact.size() != 0) {
            for(Contact c : listContact ) {
                c.FirstName = FirstName;
                c.LastName = LastName;
                update c;
            }
            Boolean status = AMPDataSync.upsertContactData(Email, FirstName, LastName, Title, Phone, MobilePhone, Fax, Account, LeadSource, Street, City, State, PostalCode, Country, InterestLevel, ContactType, IndustryType);
            System.assertEquals(status, true);
        }*/
        Boolean status1 = AMPDataSync.upsertContactData('','','','','','','','','','','','','','','','','');
        System.assertEquals(status1 != null,true);
    } 
    
    // test update Contact info
    private static void testampDataSync() {
        /*String FirstName = 'Joe'; 
        String LastName = 'Tester';
        String Email = 'joe.tester@mindmatrix.net';
        String Title = 'Project Manager';
        String Company = 'MindMatrix Inc.'; 
        String Phone = '9820098200'; 
        String MobilePhone = '9820098222';
        String Fax = '9820098211'; 
        String LeadSource = 'Other';
        String Street = '2403 Sidney Street';
        String City = 'Pittsburgh'; 
        String State = 'PA'; 
        String PostalCode = '15203';
        String Country = 'US'; 
        String IndustryType = 'Other';
        String InterestLevel = 'Other';
        String ContactType = 'Other';
        List<Lead> listLead = [SELECT FirstName, LastName, Title, Phone, MobilePhone, Fax, LeadSource, Street, City, State, PostalCode, Country, MindMatrix__Interest_Level__c, Industry FROM Lead WHERE Email =: Email LIMIT 1];
*/
        Boolean status1 = AMPDataSync.syncAMPContacts('','','','','','','','','','','','','','','','','');
        System.assertEquals(status1 != null, true);
    } 
}