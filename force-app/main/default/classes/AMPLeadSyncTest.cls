@isTest
Private class AMPLeadSyncTest {
    static testMethod void testAMPLeadSyncFunc() {
        testGetLeadInfo();
        testManageLeadInfo();
    }

    // Test Lead    
    private static void testGetLeadInfo() {
        // set up the request object
       /* RestRequest req = new RestRequest(); 
        RestResponse res = new RestResponse();

        //Lead ldata = new Lead(); 
        req.requestURI = URL.getSalesforceBaseUrl().toExternalForm()+'/services/apexrest/MindMatrix/SyncLead';  
        req.httpMethod = 'GET';
        req.addParameter('email', 'joe.tester@mindmatrix.net');
        RestContext.request = req;
        RestContext.response = res;
        
        Lead ld = new Lead(
        FirstName = 'Joe', 
        LastName = 'Tester', 
        Email = 'joe.tester@mindmatrix.net', 
        Title = 'Project Manager', 
        Company = 'MindMatrix Inc.',
        RecordTypeId = '0120o000001VKTxAAO');
        insert ld;    
            
        try {
            ld = AMPLeadSync.getLeadDataByEmail();
            System.assertEquals(ld.FirstName, 'Joe');
        } catch(Exception ex) {
            System.assertEquals(null, null);
        }*/
        lead ld = AMPLeadSync.getLeadDataByEmail();
            System.assertEquals(ld != null, false);
    }
   
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
        String Activity = 'Call';
        String ActivityDueDate = '09/28/2012 00:00 AM';
        String ActivityComment = 'Call';
        
        List<Lead> listLead = [SELECT FirstName, LastName, Title, Phone, MobilePhone, Fax, LeadSource, Street, City, State, PostalCode, Country,  Industry FROM Lead WHERE Email =: Email LIMIT 1];

        // set up the request object
        RestRequest req = new RestRequest(); 
        RestResponse res = new RestResponse();
 
        req.requestURI = URL.getSalesforceBaseUrl().toExternalForm()+'/services/apexrest/MindMatrix/SyncLead';
        //'fname=' + FirstName + '&lname=' + LastName + '&email=' + Email + '&title=' + Title + '&company=' + Company + '&phone=' + Phone +
        //'&mobile=' + MobilePhone + '&fax=' + Fax + '&leadsource=' + LeadSource + '&street=' + Street + '&city=' + City + '&state=' + State + '&postalcode=' + PostalCode + '&country=' + Country + '&interestlevel=' + InterestLevel + '&contacttype=' + ContactType + '&industrytype=' + IndustryType;
                
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
       
        //Boolean status1 = AMPLeadSync.upsertLeadData('shailesh.tayde@mindmatrix.net', 'Shailesh', 'Tayde', 'Developer', '9879859865', '9879859861', '9879859862', 'Other', 'MM Inc.', '', '', '', '', 'US', 'Other', 'Other', 'Other');
        Boolean status1 = AMPLeadSync.upsertLeadData();
       // System.assertEquals(status1, true);
        //System.assertEquals(status1, false);
        Id leadID;
        if(listLead.size() != 0) {
            for(Lead ld : listLead ) {
                ld.FirstName = FirstName;
                ld.LastName = LastName;
                ld.Company = Company;
                leadID = ld.Id;
                update ld;
            }*/
            
             /* Create Tasks */
           /* Task tsk = new Task();
            tsk.WhoID =  leadID; //Contact ID
            tsk.Subject = 'Call'; //Task OR Activity Subject
           
            tsk.ActivityDate = datetime.now().date();
           
            tsk.Status = 'Not Started';
            tsk.Description = 'Call Me';
            tsk.Priority = 'High';
            tsk.ReminderDateTime = datetime.now().date();
            tsk.isReminderSet = true;
             
            insert tsk;
            System.assertEquals(tsk.isReminderSet, true);
            
            //Boolean status = AMPLeadSync.upsertLeadData(Email, FirstName, LastName, Title, Phone, MobilePhone, Fax, LeadSource, Company, Street, City, State, PostalCode, Country, InterestLevel, ContactType, IndustryType);
            Boolean status = AMPLeadSync.upsertLeadData();
            //System.assertEquals(status, true);
            //System.assertEquals(status, false);
        }*/
         Boolean status = AMPLeadSync.upsertLeadData();
           System.assertEquals(status, true);
    }     
}