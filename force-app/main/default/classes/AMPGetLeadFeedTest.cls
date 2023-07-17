@isTest
Private Class AMPGetLeadFeedTest {
   /* private static TestMethod void testLeadFeed() {
        testInsertAMPAccInfo();
        PageReference pageRef = Page.AMPLeadActivityFeed;
        Test.setCurrentPage(pageRef);
       
        Lead newLead = new Lead(
        FirstName = 'Joe', 
        LastName = 'Tester',
        Company = 'Unknown',
        Email = 'joe.tester@mindmatrix.net',
        RecordTypeId = '0120o000001VKTxAAO');
        insert newLead;

        ApexPages.StandardController sc = new ApexPages.standardController(newLead);
        AMPGetLeadFeed LeadFeed = new AMPGetLeadFeed(sc);        
        ApexPages.currentPage().getParameters().put('id',newLead.Id);      
        LeadFeed.getActivityFeed();
       
        testInsertAMPAccInfo();
        
        Lead newLead1 = new Lead(
        FirstName = 'Shailesh', 
        LastName = 'Tayde',
        Company = 'Unknown',
        Email = 'spolekar@vectre.net',
        RecordTypeId = '0120o000001VKTxAAO');
        insert newLead1;

        ApexPages.StandardController sc1 = new ApexPages.standardController(newLead1);
        AMPGetLeadFeed LeadFeed1 = new AMPGetLeadFeed(sc1);
        ApexPages.currentPage().getParameters().put('id',newLead1.Id);
        
        LeadFeed1.getActivityFeed();
    }

    private static void testInsertAMPAccInfo() {
        try {
        profile p = [select id from profile where name='System Administrator']; 
        User thisUser = [ Select Id from User where Id = :UserInfo.getUserId() ];
        
        System.runAs( thisUser ){        
          AMPUserDetails__c ampUser = AMPUserDetails__c.getInstance();
          if(ampUser == null) {
                ampUser = new AMPUserDetails__c();
                ampUser.AccessToken__c = 'c6cf8cf235d4daedb0b7556ea48355cb0fa51f71';
                ampUser.AMPID__c = '204';
                ampUser.SFUserID__c = UserInfo.getUserId();
                //ampUser.Name__c = 'MM_AMP1';
                ampUser.AMPURL__c ='https://mm.amp.vg';
                ampUser.AMPSha1Key__c = '22280d238edfa898d44d3fa1d7aec93c078bac281';
                ampUser.AMPUName__c = 'shuchita';
                ampUser.SetupOwnerId = p.id;
                ampUser.ExpiresIn__c = 1000.00;
              	ampUser.ClientSecret__c ='';
                insert ampUser;
                
                ampUser = [SELECT AMPUName__c, AccessToken__c, SetupOwnerId FROM AMPUserDetails__c WHERE SFUserID__c =: thisUser.Id LIMIT 1];    
                System.assertEquals('shuchita', ampUser.AMPUName__c);
            } else {
                ampUser.AccessToken__c = 'c6cf8cf235d4daedb0b7556ea48355cb0fa51f71';
                ampUser.AMPID__c = '204';
                //ampUser.Name__c = 'MM_AMP1';
                ampUser.SFUserID__c = UserInfo.getUserId();
                ampUser.AMPURL__c ='https://mm.amp.vg';
                ampUser.AMPSha1Key__c = '22280d238edfa898d44d3fa1d7aec93c078bac281';
                ampUser.AMPUName__c = 'shuchita';
                ampUser.SetupOwnerId = thisUser.id;
                ampUser.ExpiresIn__c = 1000.00;
                ampUser.ClientSecret__c ='';
                upsert ampUser;
                System.assertEquals('shuchita', ampUser.AMPUName__c);
            }
        }
        } catch(Exception ex) {
            System.assertEquals(null, null);    
        }
    }
    
    private static void testInsertLead() {
        //Insert Contac
        Lead con = new Lead(
        FirstName = 'Joe', 
        LastName = 'Tester',
        Company = 'Unknown',
        Email = 'joe.tester@mindmatrix.net',
        RecordTypeId = '0120o000001VKTxAAO');
        insert con;

        Lead cont = [SELECT Email FROM Lead WHERE Email =: 'joe.tester@mindmatrix.net' LIMIT 1];
        System.AssertEquals(cont.Email, 'joe.tester@mindmatrix.net');
    }*/
}