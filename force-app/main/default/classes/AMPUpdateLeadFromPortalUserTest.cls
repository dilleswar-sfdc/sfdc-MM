@isTest
Private Class AMPUpdateLeadFromPortalUserTest {
    public static testMethod void testLeadOpts() { 
        testUpdateLeads();
    }
    
 	@isTest
    public static void testUpdateLeads() {
      
         string testupdateleads = AMPUpdateLeadFromPortalUser.updateLeads('');
         System.assertEquals(true,testupdateleads != null);
       
     
    }
        
  /*  public static void testManageLeads() { 
        String result = '';
        try {
            Lead ld = new Lead(
            FirstName = 'Joe1', 
            LastName = 'Tester1', 
            Email = 'joe.tester@mindmatrix1.net', 
            Title = 'Project Manager1', 
            Company = 'MindMatrix1 Inc.');
            insert ld;
            
            Lead ld1 = [SELECT Id,LastModifiedDate, Email, FirstName, LastName, Phone, Title, Company, Industry,  MindMatrix__Nurture_Lead__c FROM Lead WHERE email = 'joe.tester@mindmatrix1.net'];
            
            System.assertNotEquals(ld1, null);
            AMPUpdateLeadFromPortalUser.manageLeads(ld1.id, '');

            // Negative Testing
            AMPUpdateLeadFromPortalUser.manageLeads('00Qd0000006M9Ex', '');
            Lead ld2 = [SELECT Id,LastModifiedDate, Email, FirstName, LastName, Phone, Title, Company, Industry,  MindMatrix__Nurture_Lead__c FROM Lead WHERE Id =:'00Qd0000006M9Ex'];
            System.assertEquals(ld2, null);
        } catch(Exception ex) {
            System.assertEquals(null, null);
            return;
        }
    }
    
    private static void testModifyData() {
        try {
        profile p = [select id from profile where name='System Administrator']; 
        User thisUser = [ Select Id from User where Id = :UserInfo.getUserId() ];
        String resp='';
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
            
            List<AMPUserDetails__c> acc = [SELECT AMPUrl__c FROM AMPUserDetails__c WHERE SFUserID__c =: UserInfo.getUserId() LIMIT 1];
            System.assertNotEquals(0, acc.size());
            
            resp = AMPUpdateLeadFromPortalUser.modifyData('', 'shailesh.tayde@mindmatrix.net', 'Shailesh', 'Tayde', '9820098200', 'MM', 'Other', 'Other', 'No', '00Q9000000HqCOy',datetime.newInstance(2014, 9, 15, 12, 30, 0));
            resp = AMPUpdateLeadFromPortalUser.modifyData('7669', 'shailesh.tayde@mindmatrix.net', 'Shailesh', 'Tayde', '9820098211', 'MM', 'Other', 'Other', 'No', '00Q9000000HqCOy',datetime.newInstance(2014, 9, 15, 12, 30, 0));
        }
        } catch(Exception ex) {
            System.assertEquals(null, null);    
        }
    }*/
}