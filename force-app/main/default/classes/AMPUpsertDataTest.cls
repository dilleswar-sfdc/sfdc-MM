@isTest(SeeAllData=true)
Private class AMPUpsertDataTest {
    static testMethod void testsyncLeadContact() {
        //testGetLeadInfo();
        ///testGetContacInfo();
        //testCreateAccountInfo();
        testManageLeadInfo();
        //testCreateAccountInfo();
        //testCreateTask();
    }
    
      // Test Lead    
  /*  private static void testGetLeadInfo() {
        Lead ld = new Lead(
        FirstName = 'Joe', 
        LastName = 'Tester', 
        Email = 'joe.tester@mindmatrix.net', 
        Title = 'Project Manager', 
        Company = 'MindMatrix Inc.',
        RecordTypeId = '0120o000001VKTxAAO');
        insert ld;
        
        Lead ldata = AMPDataSync.getLeadDataByEmail(ld.Id);
        System.assertEquals(ldata.FirstName!='', true);
    }
    
    //Test Contact
    private static void testGetContacInfo() {
        Contact cd = new Contact(
        FirstName = 'Joe12', 
        LastName = 'Tester31', 
        Email = 'joe.tester1231@mindmatrix.net');
        insert cd;
        
        Contact cdata = AMPDataSync.getContactDataByEmail(cd.Id);
        System.assertEquals(cdata.FirstName!='', true);
    }
    
    // Test Account info
    private static void testCreateAccountInfo() {
        Account acc = new Account(
        Name = 'MindMatrix Inc.' ,
        AccountNumber = 'CD355007');
        insert acc;
        System.assertEquals(acc.Name!='', true);
    }
    
    // Test Account info
    private static void testCreateTask() {
        /*Task tsk = new Task();
        tsk.WhoID =  '00590000000ghIQ'; //Contact ID
        tsk.Subject = 'Call'; //Task ID
        tsk.Status = 'Not Started';
        tsk.Description = 'Call Me';
        tsk.Priority = 'High';
        insert tsk;
        
        boolean result = AMPUpsertData.createTask('00590000000ghIQ', 'Call','Not Started', '07/07/2012', '00590000000ghIQ');
        
        System.assertEquals(result, false);
    }*/
    
     // test update lead info
    private static void testManageLeadInfo() {
      /*  String FirstName = 'Joe'; 
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
        String strOwner = '00590000000ghIQ';
        
        Account acc = new Account(
        Name = 'MindMatrix Inc.' ,
        AccountNumber = 'CD355007');
        insert acc;
        System.assertEquals(acc.Name!='', true);
        
        List<Lead> listLead = [SELECT FirstName, LastName, Title, Phone, MobilePhone, Fax, LeadSource, Street, City, State, PostalCode, Country, Interest_Level__c, Industry FROM Lead WHERE Email =: Email LIMIT 1];

        Boolean status1 = AMPUpsertData.syncLeadContact('shailesh.tayde@mindmatrix.net', 'Shailesh', 'Tayde', 'Developer', '9879859865', '9879859861', '9879859862', 'Other', 'MM Inc.', '', '', '', '', 'US', 'Other', 'Other', 'Other', '', '', '', strOwner, '0');
        //System.assertEquals(status1, true);
            
        if(listLead.size() != 0) {
            for(Lead ld : listLead ) {
                ld.FirstName = FirstName;
                ld.LastName = LastName;
                ld.Company = Company;
                update ld;
            }
            Boolean status = AMPUpsertData.syncLeadContact(Email, FirstName, LastName, Title, Phone, MobilePhone, Fax, LeadSource, Company, Street, City, State, PostalCode, Country, InterestLevel, ContactType, IndustryType, '', '', '', '', '');
            System.assertEquals(status, true);
        } else {
            Lead ld = new Lead();
            ld.FirstName = 'sa';
            ld.LastName = 'aa';
            ld.Company  ='sa';
            insert ld;
        }*/
        
        Boolean status2 = AMPUpsertData.syncLeadContact('', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
        System.assertEquals(status2, true);
    }
}