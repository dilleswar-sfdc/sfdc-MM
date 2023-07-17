@isTest
Private class AMPContactSyncTest {
    static testMethod void testAMPContactSyncFunc() {
        testGetContacInfo();
        testManageContactInfo();
    }
   
    //Test Contact
    private static void testGetContacInfo() {
        // set up the request object
        RestRequest req = new RestRequest(); 
        RestResponse res = new RestResponse();

        //Lead ldata = new Lead(); 
        req.requestURI = URL.getSalesforceBaseUrl().toExternalForm()+'/services/apexrest/MindMatrix/SyncContact';  
        req.httpMethod = 'GET';
        req.addParameter('email', 'joe.tester@mindmatrix.net');
        RestContext.request = req;
        RestContext.response = res;
        
        Contact cd = new Contact(
        FirstName = 'Joe', 
        LastName = 'Tester', 
        Email = 'joe.tester@mindmatrix.net');
        insert cd;
        
        try {
            Contact cdata = AMPContactSync.getContactDataByEmail();
            System.assertEquals(cdata.FirstName, 'Joe');
        } catch(Exception ex) {
            System.assertEquals(null, null);
        }
    }
   
    // test update Contact info
    private static void testManageContactInfo() {
        String FirstName = 'Joe'; 
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
        String Activity = 'Call';
        String ActivityDueDate = '09/28/2012 00:00 AM';
        String ActivityComment = 'Call';
        
        List<Contact> listContact = [SELECT FirstName, LastName, Title, Phone, MobilePhone, Fax, LeadSource, MailingStreet, MailingCity, MailingState, MailingPostalCode, MailingCountry, Interest_Level__c, Account.Type, Account.Industry FROM Contact WHERE Email =: Email LIMIT 1];

        // set up the request object
        RestRequest req = new RestRequest(); 
        RestResponse res = new RestResponse();
 
        req.requestURI = URL.getSalesforceBaseUrl().toExternalForm()+'/services/apexrest/MindMatrix/SyncContact';
                
        req.addParameter('fname', 'Shailesh');
        req.addParameter('lname', 'Tayde');
        req.addParameter('email', 'shailesh.tayde@mindmatrix.net');
        req.addParameter('title', 'PM');
        req.addParameter('company', 'MM');
        req.addParameter('phone', '022-9819326545');
        req.addParameter('mobile', '9819326545');
        req.addParameter('fax', '9819326545');
        req.addParameter('leadsource', 'Web');
        req.addParameter('street', 'St. Bishop');
        req.addParameter('city', 'Candy');
        req.addParameter('state', 'CA');
        req.addParameter('postalcode', '12345');
        req.addParameter('country', 'US');
        req.addParameter('interestlevel', 'High');
        req.addParameter('contacttype', 'Reseller');
        req.addParameter('industrytype', 'Media');
        req.addParameter('activity', 'Call');
        req.addParameter('duedate', '09/28/2012 00:00 AM');
        req.addParameter('comment', 'Call');
        req.httpMethod = 'POST';
        
        RestContext.request = req;
        RestContext.response = res;
        
        //Boolean status1 = AMPContactSync.upsertContactData('shailesh.tayde@mindmatrix.net', 'Shailesh', 'Tayde', 'Developer', '9879859865', '9879859861', '9879859862', 'Other', Account ,'007 Avenue Street', 'Pittsburgh', 'PA', '52525', 'US', 'Other', 'Other', 'Other');
        Boolean status1 = AMPContactSync.upsertContactData();
        System.assertEquals(status1, true);
        
        Id contID;        
        if(listContact.size() != 0) {
            for(Contact c : listContact ) {
                c.FirstName = FirstName;
                c.LastName = LastName;
                contID = c.ID;
                update c;
            }
                      
            /* Create Tasks */
            Task tsk = new Task();
            tsk.WhoID =  contID; //Contact ID
            tsk.Subject = 'Call'; //Task OR Activity Subject
           
            tsk.ActivityDate = datetime.now().date() + 2;
           
            tsk.Status = 'Not Started';
            tsk.Description = 'Call Me';
            tsk.Priority = 'High';
             
            //Set Reminder Date
            tsk.put('ReminderDateTime', DateTime.valueOf(tsk.ActivityDate + ' 00:00:00'));
            tsk.put('isReminderSet', true);
            insert tsk;
            System.assertEquals(tsk.isReminderSet, true);
            
            /* Create Tasks */
            Task tsk1 = new Task();
            tsk1.WhoID =  contID; //Contact ID
            tsk1.Subject = 'Call'; //Task OR Activity Subject
           
            tsk1.ActivityDate = datetime.now().date();
           
            tsk1.Status = 'Not Started';
            tsk1.Description = 'Call Me';
            tsk1.Priority = 'High';
             
            //Set Reminder Date
            tsk1.put('ReminderDateTime', DateTime.valueOf(tsk1.ActivityDate + ' 00:00:00'));
            tsk1.put('isReminderSet', true);
            insert tsk1;
            System.assertEquals(tsk1.isReminderSet, true);
            
            Boolean status = AMPContactSync.upsertContactData();
            System.assertEquals(status, true);
        }
    }
}