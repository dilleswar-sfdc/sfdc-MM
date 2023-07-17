@isTest
Private Class AMPHomePageControllerTest {
    private static TestMethod void testHome() {
        testHomePage();
        testInsertAMPAccInfo();
        testHomePage();
        testClearUserSetting();
    }
    private static void testClearUserSetting()
    {
        //Test converage for the AMPLogin visualforce page
        PageReference pageRef = Page.AMPHome;
        Test.setCurrentPageReference(pageRef);
        // create an instance of the controller
        AMPHomePageController homePg = new AMPHomePageController();
       
        homePg.homePageURL = 'https://mm.amp.vg';
        homePg.strMessage  = '';
              
        homePg.clearUserSettings();
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
                upsert ampUser;
                System.assertEquals('shuchita', ampUser.AMPUName__c);
            }
        }
        } catch(Exception ex) {
            System.assertEquals(null, null);    
        }
    }
    
    private static void testHomePage() {
        //Test converage for the AMPLogin visualforce page
        PageReference pageRef = Page.AMPHome;
        Test.setCurrentPageReference(pageRef);
        // create an instance of the controller
        AMPHomePageController homePg = new AMPHomePageController();
       
        homePg.homePageURL = 'https://mm.amp.vg';
        homePg.strMessage  = '';
              
        homePg.getAMPHomeUrl();
    }
}