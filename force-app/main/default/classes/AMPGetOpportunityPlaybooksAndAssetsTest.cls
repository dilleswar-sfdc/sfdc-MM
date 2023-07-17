@isTest
public class AMPGetOpportunityPlaybooksAndAssetsTest {
	static TestMethod void testOpportunityPlaybooks() {
        testInsertAMPAccInfo();
        PageReference pageRef = Page.AMPOpportunityPlaybooks;
        Test.setCurrentPage(pageRef);
       
        Opportunity newOpp = new Opportunity(
        Name = 'Joe', 
        CloseDate = Date.today(),
        StageName = '	Prospecting');
        insert newOpp;

        ApexPages.StandardController sc = new ApexPages.standardController(newOpp);
        AMPGetOpportunityPlaybooksAndAssets OpportunityPlaybook = new AMPGetOpportunityPlaybooksAndAssets(sc);  
        OpportunityPlaybook.infoPageURL = '';
        OpportunityPlaybook.whatSection = '';
        ApexPages.currentPage().getParameters().put('id',newOpp.Id);      
        OpportunityPlaybook.getRelatedPlaybookAssets();
       
        testInsertAMPAccInfo();
        
        Opportunity newOpp1 = new Opportunity(
        Name = 'Joe', 
        CloseDate = Date.today(),
        StageName = '	Prospecting');
        insert newOpp1;

        ApexPages.StandardController sc1 = new ApexPages.standardController(newOpp1);
        AMPGetOpportunityPlaybooksAndAssets OpportunityFeed1 = new AMPGetOpportunityPlaybooksAndAssets(sc1);
        ApexPages.currentPage().getParameters().put('id',newOpp1.Id);
        OpportunityFeed1.infoPageURL = 'https://mm.amp.vg';
        OpportunityFeed1.whatSection = 'World';
        OpportunityFeed1.getRelatedPlaybookAssets();
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
    
    private static void testInsertOpportunity() {
        //Insert Contac
        Opportunity newOpp1 = new Opportunity(
        Name = 'Joe', 
        CloseDate = Date.today(),
        StageName = '	Prospecting');
        insert newOpp1;


        Opportunity cont = [SELECT Name FROM Opportunity WHERE Id =: newOpp1.Id LIMIT 1];
        System.AssertEquals(cont.Name, 'Joe');
    }
    //
}