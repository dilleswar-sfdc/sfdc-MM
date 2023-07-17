@isTest
Private Class AMPUserAccDetailTest {
    public static testMethod void TestgetAMPUserDetail() { 
        try {
            test.startTest();
            //String UniqueAppName = 'MM_AMP';
            String  AMPUrl='';
            Id SFUserID = UserInfo.getUserId();
            AMPUserAccDetail obj = new AMPUserAccDetail();
            List<AMPUserDetails__c> acc = obj.getAMPUserDetail();
            acc = [SELECT AMPUrl__c FROM AMPUserDetails__c WHERE SFUserID__c =: SFUserID LIMIT 1];
            for(AMPUserDetails__c c : acc) {
                    AMPUrl = String.ValueOf(c.AMPUrl__c);
            }
           System.assertEquals(AMPUrl,''); 
        }
        catch(Exception e) {
            return;
        }
    } 
}