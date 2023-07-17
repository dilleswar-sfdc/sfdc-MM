@isTest
Private class AMPOpportunitySyncTest {
    static testMethod void testAMPOpportunityDataSync () {
        testGetOpportunityData();
    }
    private static void testGetOpportunityData()
    {
   /* Opportunity newOpp = new Opportunity(
        Name= 'Test Opp',
        CloseDate = System.today(),
        StageName= 'Prospecting'
    );
    insert newOpp;
        if(newOpp!= null)
        {
           
        }*/
        String Opp =AMPOpportunityDataSync.getOpportunityData('');
           System.assertEquals('',Opp);
    }

}