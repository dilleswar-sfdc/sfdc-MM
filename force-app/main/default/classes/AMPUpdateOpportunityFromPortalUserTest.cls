@isTest
private class AMPUpdateOpportunityFromPortalUserTest
{
     static testMethod void testOpportunityOpts()
    {
        testgetAMPApiKey();
    }
    
   
    public static string testgetAMPApiKey(){
        string testgetapikey =  AMPUpdateOpportunityFromPortalUser.getAMPApiKey('sfdc');
        System.assertEquals(true,testgetapikey != null);
        return testgetapikey;
        
    }
}