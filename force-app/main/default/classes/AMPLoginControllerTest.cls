@isTest(SeeAllData=true)
Private Class AMPLoginControllerTest {
    private static TestMethod void testlogin() {
        testLogin1('', '');
        testLogin1('shuchita', '');
        testLogin1('', 'Shuchita001');       
        testLogin1('shuchita', 'Shuchita001');
        AMPLoginController loginCon = new AMPLoginController();
        loginCon.RegisterAMPRequest();
        loginCon.storeSHA1Key('');
        loginCon.CheckIfUserExists();     
        loginCon.getValues();
        loginCon.setAMP_Install('');
        loginCon.GetToken();
        loginCon.callDeveloperApi();
        loginCon.isValid();
        loginCon.login();
        
        
        
        loginCon.getSessionID('token');
        loginCon.setAmp_UserName('username');
        loginCon.isValid();
        loginCon.setAmp_Password('Password');     
        loginCon.isValid();
        loginCon.setAmp_Install('https://mm.amp.vg');     
        loginCon.isValid();
        loginCon.setAmp_ChecUserId(false); 
        loginCon.login();
    }
   
    private static void testLogin1(String UName, String UPwd) {
        //Test converage for the AMPLogin visualforce page
        PageReference pageRef = Page.AMPLogin;
        Test.setCurrentPageReference(pageRef);
        // create an instance of the controller
        AMPLoginController loginCon = new AMPLoginController();
       
        //try calling methods/properties of the controller in all possible scenarios

         //call the method for populuating the amp installs picklist
        List<selectOption> ampOpts = loginCon.getValues();
        System.AssertNotEquals(0, ampOpts.size()); //assert that the size of our picklist is not 0

        //Login Success
        loginCon.amp_UserName = UName;
        loginCon.amp_Password = UPwd;
        
        String ampOauthUrl = 'https://mm.amp.vg/';
        String UniqueAppName = 'MM_AMP';
        loginCon.errorMsg = '{"error":"No User Found"}';
        loginCon.ampOauthUrl = ampOauthUrl;  
        String ampUsername = loginCon.getAmp_UserName();
        loginCon.setAmp_UserName(ampUsername);
        String ampPasswrd = loginCon.getAmp_Password();
        loginCon.setAmp_Password(ampPasswrd);            

        String eStyle = loginCon.getrequiredStyle();
		
        testInsertAMPAccInfo();
        loginCon.CheckIfUserExists();    
        String sha1Key = loginCon.storeSHA1Key('mon00');
        System.assertEquals(sha1Key , '22280d238edfa898d44d3fa1d7aec93c078bac28');
        loginCon.accessToken = sha1key;
        loginCon.ampID = '';
        loginCon.expiresIn = '';
        loginCon.getAmp_Install();
        loginCon.domainName = '';
        //loginCon.login();

        DateTime createdDateValue = DateTime.now();
        Double dtDiff = loginCon.GetSeconds(createdDateValue);
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
            }
        }
        } catch(Exception ex) {
            System.assertEquals(null, null);    
        }
    }
      
        
}