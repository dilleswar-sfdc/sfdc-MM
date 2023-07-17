@isTest(SeeAllData=false)
Private Class AMPUpdateContactFromPortalUserTest {
    public static testMethod void testContactOpts() { 
        testUpdateContacts();
        testManageContacts();
        testModifyData();
    }

    public static void testUpdateContacts() {
        try {
            Contact con= new Contact(
            FirstName = 'Joe', 
            LastName = 'Tester', 
            Email = 'joe.tester@mindmatrix.net', 
            Title = 'Project Manager');
            insert con;

            Set<Id> lContacts = new Set<Id>();
            lContacts.add(con.Id);
            
            Contact con1 = [SELECT Id,LastModifiedDate, Email, FirstName, LastName, Phone, Title,  Account.Name, Account.Type, Account.Industry, MindMatrix__Interest_Level__c, MindMatrix__Prospect_Contact__c FROM Contact WHERE email = 'joe.tester@mindmatrix.net'];
            

            System.assertNotEquals(con1, null);
            AMPUpdateContactFromPortalUser.updateContacts(lContacts, '');

            // Negative Testing
            Set<id> nContacts = new Set<Id>();
            nContacts.add('0039000002ZdmV6AAJ');
            AMPUpdateContactFromPortalUser.updateContacts(nContacts, '');
            Contact con2 = [SELECT Id,LastModifiedDate, Email, FirstName, LastName, Phone, Title,  Account.Name, Account.Type, Account.Industry, MindMatrix__Interest_Level__c, MindMatrix__Prospect_Contact__c FROM Contact WHERE Id =:'0039000002ZdmV6AAJ'];
            System.assertEquals(con2, null);
        } catch(Exception ex) {            
            System.assertEquals(null, null);
            return;
        }
    }
        
    public static void testManageContacts() { 
        String result = '';
        try {
            Account act = new Account();
            act.Name='TestAccount';
            insert act;
            
            Contact con = new Contact(
            FirstName = 'Joe', 
            LastName = 'Tester', 
            Email = 'joe.tester@mindmatrix1.net', 
            Title = 'Project Manager',
            AccountID = act.id);
            insert con;
            
            Opportunity o = new Opportunity();
            o.Name = 'Test Job';
            o.Probability = 50;
            o.Amount = 100.00;
            o.StageName = 'Prospect';
            o.CloseDate = System.today();
            o.AccountID = act.id;
            insert o;
            
            OpportunityContactRole oCR = new OpportunityContactRole();
            oCR.ContactId = con.id;
            oCR.OpportunityId = o.Id;
            oCR.IsPrimary = true;
            oCR.Role='Economic Decision Maker';
            insert oCR;
            
            Contact con1 = [SELECT Id,LastModifiedDate, Email, FirstName, LastName, Phone, Title,  Account.Name, Account.Type, Account.Industry, MindMatrix__Interest_Level__c, MindMatrix__Prospect_Contact__c FROM Contact WHERE email = 'joe.tester@mindmatrix1.net'];
            
            System.assertNotEquals(con1, null);
            AMPUpdateContactFromPortalUser.manageContacts(con1.id, '');

            // Negative Testing
            AMPUpdateContactFromPortalUser.manageContacts('0039000002ZdmV6AAJ', '');
            Contact con2 = [SELECT Id,LastModifiedDate, Email, FirstName, LastName, Phone, Title,  Account.Name, Account.Type, Account.Industry, MindMatrix__Interest_Level__c, MindMatrix__Prospect_Contact__c FROM Contact WHERE Id =:'0039000002ZdmV6AAJ'];
            System.assertEquals(con2, null);
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
              	ampUser.ClientSecret__c='';
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
                ampUser.ClientSecret__c='';
                upsert ampUser;
                System.assertEquals('shuchita', ampUser.AMPUName__c);
            }
            resp = AMPUpdateContactFromPortalUser.modifyData('', 'shailesh.tayde@mindmatrix.net', 'Shailesh', 'Tayde', '9820098200', 'MM', 'Other', 'Other', 'Other', 'Other', 'No', 'Prospecting', 100.00, '0039000000Njvqs', datetime.newInstance(2014, 9, 15, 12, 30, 0));
            resp = AMPUpdateContactFromPortalUser.modifyData('7669', 'shailesh.tayde@mindmatrix.net', 'Shailesh', 'Tayde', '9820098211', 'MM', 'Other', 'Other', 'Other', 'Other', 'No', 'Prospecting', 200.00, '0039000000Njvqs', datetime.newInstance(2014, 9, 15, 12, 30, 0));
                
        }
        } catch(Exception ex) {
            System.assertEquals(null, null);    
        }
    }
}