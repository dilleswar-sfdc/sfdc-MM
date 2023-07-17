/*
* The AMP authentication class : In-Progress
*/
public with sharing class AMPLoginController {
    public AMPLoginController(){
        amp_liError = '';
    }
    public String output { get; set; }
    public String errMsg {get;set;}
    //Always be pre-defined here as this is the first page
    public Transient String ampOauthUrl {get;set;}
    //String UniqueAppName = 'MM_AMP';
    Id SFUserID = UserInfo.getUserId();
    public Transient String amp_UserName = '';
    public Transient String amp_Password = '';
    public Transient String amp_Install = '';
    public Transient Boolean amp_ChecUserId = true;
    public Transient string accessToken {get;set;}
    public Transient String ampID {get;set;}
    public Transient String expiresIn {get;set;}
    public Transient String clientid {get;set;}
    public Transient String clientsecret {get;set;}
    public Transient String sessionid {get;set;}
    private string requiredStyle= '';
    public String errorMsg = '';
    public string amp_liError {get; private set;}
    
    // dropdownlist options list
    List<selectoption> options = new List<selectoption>();
    public string getAmp_UserName()
    {
        return amp_UserName;
    }
    public void setAmp_UserName(string Value)
    {
        amp_UserName = Value;
    }
    
    public string getAmp_Password()
    {
        return amp_Password;
    }
    public void setAmp_Password(string Value)
    {
        amp_Password = Value;
    }
    
    public void setAmp_ChecUserId(boolean Value)
    {
        amp_ChecUserId = Value;
    }
        
    public string getAmp_Install()
    {
        return amp_Install;
    }
    public void setAmp_Install(string Value)
    {
        amp_Install = Value;
    }
    
    public string getrequiredStyle()
    {
        return requiredStyle;
    } 
    
    // the account ids
    public String domainName {
        get;set;
    }
    //Get the Token
    public String GetToken()
    {
        if (!Schema.sObjectType.AMPUserDetails__c.fields.AccessToken__c.isAccessible() &&!Schema.sObjectType.AMPUserDetails__c.fields.AMPID__c.isAccessible() && !Schema.sObjectType.AMPUserDetails__c.fields.ExpiresIn__c.isAccessible() && !Schema.sObjectType.AMPUserDetails__c.fields.AMPSha1Key__c.isAccessible() &&!Schema.sObjectType.AMPUserDetails__c.fields.AMPUName__c.isAccessible()&&!Schema.sObjectType.AMPUserDetails__c.fields.AMPUrl__c.isAccessible() &&!Schema.sObjectType.AMPUserDetails__c.fields.SFUserID__c.isAccessible()&&!Schema.sObjectType.AMPUserDetails__c.fields.ClientSecret__c.isAccessible() &&!Schema.sObjectType.AMPUserDetails__c.fields.ClientID__c.isAccessible())
            return null;
        List<AMPUserDetails__c> lstUserAcc = [SELECT AccessToken__c, AMPID__c, ExpiresIn__c, AMPSha1Key__c, AMPUName__c,AMPUrl__c, SFUserID__c, ClientSecret__c, ClientID__c FROM AMPUserDetails__c WHERE SFUserID__c =: SFUserID LIMIT 1 ];
        if(lstUserAcc.size() > 0){
            return  lstUserAcc[0].ClientSecret__c;
        }
        else
            return null;
    }
   // Get all account
    public List<SelectOption> getValues(){
        options.clear(); 
        options.add(new selectOption('https://mm.amp.vg/', 'AMP (MINDMATRIX)'));
        options.add(new selectOption('https://amplify.ngkf.com/', 'AMPLIFY NGKF'));        
        options.add(new selectOption('https://borderstates.amp.vg/', 'BORDER STATES'));
        options.add(new selectOption('https://broadsoft.amp.vg/', 'BROADSOFT'));
        options.add(new selectOption('https://datto.amp.vg/', 'DATTO'));
        options.add(new selectOption('https://demandbase.amp.vg/', 'DEMAND BASE'));
        //options.add(new selectOption('https://insperity.amp.vg/', 'INSPERITY'));
        options.add(new selectOption('https://legacyshield.amp.vg/', 'LEGACY SHIELD'));
        options.add(new selectOption('https://marketopia.amp.vg/', 'MARKETOPIA'));        
        options.add(new selectOption('https://msp.amp.vg/', 'MSP'));
        options.add(new selectOption('https://mul-t-lock.amp.vg/', 'MUL-T-LOCK'));
        options.add(new selectOption('https://ngkf.amp.vg/', 'NGKF'));
        options.add(new selectOption('https://offsitedatasync.amp.vg/', 'OFFSITEDATASYNC'));
        options.add(new selectOption('https://pax8.amp.vg/', 'PAX8'));
        //options.add(new selectOption('https://sotheby.amp.vg/', 'SOTHEBY'));
        options.add(new selectOption('https://tbg.amp.vg/', 'TBG'));
        //options.add(new selectOption('https://the20.amp.vg/', 'THE 20'));
        //options.add(new selectOption('https://thebluebook.amp.vg/', 'THE BLUE BOOK'));
        options.add(new selectOption('https://uc.amp.vg/', 'UNITED CAPITAL'));

        return options;
    }
    public PageReference login() {
        amp_liError = '';
        errorMsg = '';
        String isToken = GetToken();
        Boolean canLogin = false;
        if(isToken == null)
        {
            canLogin = callDeveloperApi();
        }
        else{
          
			/*if (!Schema.sObjectType.AMPUserDetails__c.fields.AccessToken__c.isAccessible() &&!Schema.sObjectType.AMPUserDetails__c.fields.AMPID__c.isAccessible() && !Schema.sObjectType.AMPUserDetails__c.fields.ExpiresIn__c.isAccessible() && !Schema.sObjectType.AMPUserDetails__c.fields.AMPSha1Key__c.isAccessible() &&!Schema.sObjectType.AMPUserDetails__c.fields.AMPUName__c.isAccessible()&&!Schema.sObjectType.AMPUserDetails__c.fields.AMPUrl__c.isAccessible() &&!Schema.sObjectType.AMPUserDetails__c.fields.SFUserID__c.isAccessible()&&!Schema.sObjectType.AMPUserDetails__c.fields.ClientSecret__c.isAccessible() &&!Schema.sObjectType.AMPUserDetails__c.fields.ClientID__c.isAccessible())
            	return null;            
            List<AMPUserDetails__c> lstUserAcc = [SELECT AccessToken__c, AMPID__c, ExpiresIn__c, AMPSha1Key__c, AMPUName__c,AMPUrl__c, SFUserID__c, ClientSecret__c, ClientID__c FROM AMPUserDetails__c WHERE SFUserID__c =: SFUserID LIMIT 1];
        	clientid = lstUserAcc[0].ClientID__c;
           	ampID = lstUserAcc[0].AMPID__c;
            canLogin = true;
            clientsecret = isToken;*/
        }
        if(canLogin)
        { 
           /* sessionid = getSessionID(clientsecret);
            PageReference authPageRef;
            if (!isValid()) {
                //what to show when the data is not valid:
                amp_liError = errMsg;
                ApexPages.addmessage(new ApexPages.message(ApexPages.severity.WARNING,errMsg));
                requiredStyle = 'border-size:2px; border-color:#CC0000;border-style:solid;';
                return null;
            }
            else {
                PageReference authPage;
                try 
                {
                    requiredStyle = '';
                    String authuri, rediruri;
                    Boolean IsSuccess;
                    IsSuccess = RegisterAMPRequest();
                    //Success
                    if(IsSuccess) { 
                        rediruri = 'https://'+ApexPages.currentPage().getHeaders().get('Host')+'/apex/AMPHome';
                        authPage = new PageReference(rediruri);
                    }
                    else {
                        
                        amp_liError = 'Bad User name Or Password.';
                        ApexPages.Addmessage(new ApexPages.message(ApexPages.severity.WARNING,'Bad User name Or Passwordddd.'));
                        authPage = null;
                    }
                }
                catch (DMLException e) 
                {
                    amp_liError = 'Error while signing in. Please try again.';
                    output  = e.getMessage();
                    ApexPages.addMessage(new ApexPages.message(ApexPages.severity.ERROR,'Error while signing in. Please try again.'));
                    authPage = null;
                }
                authPageRef = authPage;
            }
            return authPageRef;*/
        }
        else
            amp_liError = 'Bad User name Or Password.';
            ApexPages.Addmessage(new ApexPages.message(ApexPages.severity.WARNING,'Bad User name Or Passwordddd.'));
            return null;
    }
    
    //Check if credentials are valid
    public Boolean isValid()
    {
        // this method is called to validate the data entered by user.
        if (amp_UserName == ''){errMsg = 'Please enter valid AMP credential.'; return false;}
        else if (amp_Password == ''){errMsg = 'Please enter valid AMP credential.'; return false;}
        else if (amp_Install == '')
        { errMsg = 'please enter valid Install URL.'; return false; }
        else return true;
    }

    public string getSessionID(string token)
    {
        
        JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartObject();
        gen.writeEndObject();
        String jsonS = gen.getAsString();
        String url = amp_Install+'/api/CreateUserSession';
        string data =  AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,token);
        AMPGetWebServiceResponse.SessionIDAPIResult result = (AMPGetWebServiceResponse.SessionIDAPIResult)System.JSON.deserialize(data, AMPGetWebServiceResponse.SessionIDAPIResult.class);
        
        string sessionID = result.result;
        return sessionID;
    }
    
    public Boolean callDeveloperApi()
    {
        try{
            string appName = 'Salesforce Integration';
            string appPassword =  EncodingUtil.convertToHex(Crypto.generateDigest('SHA1',Blob.valueOf(amp_Password)));
            JSONGenerator gen = JSON.createGenerator(true);
            gen.writeStartObject();
            gen.writeStringField('user', amp_UserName);
            gen.writeStringField('pass', appPassword);
            gen.writeStringField('app', appName);
            gen.writeBooleanField('isPasswordSHA1',true);
            gen.writeEndObject();
            String jsonS = gen.getAsString();
            String requiredURL = amp_Install+'/api/DeveloperAPIEnsureApp';
            String data =  AMPGetWebServiceResponse.PostDataJSONResponse(requiredURL,jsonS,'');
            
            AMPGetWebServiceResponse.DevApiResult result = (AMPGetWebServiceResponse.DevApiResult)System.JSON.deserialize(data, AMPGetWebServiceResponse.DevApiResult.class);
            clientid = result.result.clientid;
            clientsecret = result.result.clientsecret;
            ampID = result.result.userid;
            //sessionid = MindMatrixJWTHelper.GenerateJWTToken(result.result.usersessionid);
            
            /*if (clientid == ''){errMsg = 'Can not find ClientId .'; return false;}
            else if (clientsecret == ''){errMsg = 'Can not find ClientSecret.'; return false;}
            else if (ampID == ''){errMsg = 'Can not find userId.'; return false;}
            else*/ return true;  
        }
        catch(Exception ex)
        {
            return false;
        }
    }
    
    public void CheckIfUserExists() {
        
        if (!Schema.sObjectType.AMPUserDetails__c.fields.AccessToken__c.isAccessible() &&!Schema.sObjectType.AMPUserDetails__c.fields.AMPID__c.isAccessible() && !Schema.sObjectType.AMPUserDetails__c.fields.ExpiresIn__c.isAccessible() && !Schema.sObjectType.AMPUserDetails__c.fields.AMPSha1Key__c.isAccessible() &&!Schema.sObjectType.AMPUserDetails__c.fields.AMPUName__c.isAccessible()&&!Schema.sObjectType.AMPUserDetails__c.fields.AMPUrl__c.isAccessible() &&!Schema.sObjectType.AMPUserDetails__c.fields.SFUserID__c.isAccessible()&&!Schema.sObjectType.AMPUserDetails__c.fields.ClientSecret__c.isAccessible() &&!Schema.sObjectType.AMPUserDetails__c.fields.ClientID__c.isAccessible())
            return ;
        List<AMPUserDetails__c> lstUserinfo = [SELECT AccessToken__c, AMPID__c, ExpiresIn__c, AMPSha1Key__c, AMPUName__c, AMPUrl__c FROM AMPUserDetails__c WHERE SFUserID__c =: SFUserID LIMIT 1];
        if(lstUserinfo.size() > 0) { //Exists
            setAmp_Install(lstUserinfo[0].AMPUrl__c);
            ApexPages.Addmessage(new ApexPages.message(ApexPages.severity.INFO,'AMP account already registered using <b>' + lstUserinfo[0].AMPUName__c + '</b> user!'));
            }
    }
    /**
      * Makes final HTTP request to get the access token first time login
    * */
    public boolean RegisterAMPRequest(){
        boolean bStatus;
        try {
            if (!Schema.sObjectType.AMPUserDetails__c.fields.AccessToken__c.isAccessible() &&!Schema.sObjectType.AMPUserDetails__c.fields.AMPID__c.isAccessible() && !Schema.sObjectType.AMPUserDetails__c.fields.ExpiresIn__c.isAccessible() && !Schema.sObjectType.AMPUserDetails__c.fields.AMPSha1Key__c.isAccessible() &&!Schema.sObjectType.AMPUserDetails__c.fields.AMPUName__c.isAccessible()&&!Schema.sObjectType.AMPUserDetails__c.fields.AMPUrl__c.isAccessible() &&!Schema.sObjectType.AMPUserDetails__c.fields.SFUserID__c.isAccessible()&&!Schema.sObjectType.AMPUserDetails__c.fields.ClientSecret__c.isAccessible() &&!Schema.sObjectType.AMPUserDetails__c.fields.ClientID__c.isAccessible())
            return false;
            
            List<AMPUserDetails__c> lstUserinfo = [SELECT AccessToken__c, AMPID__c, ExpiresIn__c, AMPSha1Key__c, AMPUName__c,AMPUrl__c, SFUserID__c, ClientSecret__c, ClientID__c FROM AMPUserDetails__c WHERE SFUserID__c =: SFUserID LIMIT 1];
            //Insert record in custom AMP object
            if(errorMsg == '') {
                //First time login thru SF
               if(lstUserinfo.size() == 0) {                
                   AMPUserDetails__c ampApp = new AMPUserDetails__c();
                   ampApp.SFUserID__c = SFUserID;
                   ampApp.AccessToken__c ='Access token not used';
                   ampApp.AMPID__c = ampID;
                   ampApp.ExpiresIn__c = 0;
                   ampApp.AMPUrl__c = amp_Install;
                   ampApp.AMPSha1Key__c = sessionid;
                   ampApp.SetupOwnerId = UserInfo.getUserId();
                   ampApp.AMPUName__c = amp_UserName;
                   ampApp.ClientID__c = clientid;
                   ampApp.ClientSecret__c = clientsecret;
                   if(Schema.sObjectType.AMPUserDetails__c.fields.SFUserID__c.isCreateable()&&Schema.sObjectType.AMPUserDetails__c.fields.AccessToken__c.isCreateable() &&Schema.sObjectType.AMPUserDetails__c.fields.AMPID__c.isCreateable()&&Schema.sObjectType.AMPUserDetails__c.fields.ExpiresIn__c.isCreateable() &&Schema.sObjectType.AMPUserDetails__c.fields.AMPUrl__c.isCreateable()&&Schema.sObjectType.AMPUserDetails__c.fields.AMPSha1Key__c.isCreateable() &&Schema.sObjectType.AMPUserDetails__c.fields.SetupOwnerId.isCreateable()&&Schema.sObjectType.AMPUserDetails__c.fields.AMPUName__c.isCreateable() &&Schema.sObjectType.AMPUserDetails__c.fields.ClientID__c.isCreateable()&&Schema.sObjectType.AMPUserDetails__c.fields.ClientSecret__c.isCreateable())
                   { insert ampApp; bStatus = true;}
                  /* if(ampApp.ExpiresIn__c > 0) { insert ampApp; bStatus = true; } else { bStatus = false; output = 'You AMP account has been expired!'; }*/
                }
                else {
                    /*for(AMPUserDetails__c ampApp : lstUserinfo){
                        ampApp.SFUserID__c = SFUserID;
                        ampApp.AccessToken__c ='Access token not used';
                        ampApp.AMPID__c = ampID;
                        ampApp.ExpiresIn__c = 0;
                        ampApp.AMPUrl__c = amp_Install;
                        ampApp.AMPSha1Key__c = sessionid;
                        ampApp.AMPUName__c = amp_UserName;
                        ampApp.ClientID__c = clientid;
                        ampApp.ClientSecret__c = clientsecret;
                        ampApp.SetupOwnerId = UserInfo.getUserId();
                        if(lstUserinfo.size() > 0 && Schema.sObjectType.AMPUserDetails__c.fields.SFUserID__c.isUpdateable()&&Schema.sObjectType.AMPUserDetails__c.fields.AccessToken__c.isUpdateable()&&Schema.sObjectType.AMPUserDetails__c.fields.AMPID__c.isUpdateable()&&Schema.sObjectType.AMPUserDetails__c.fields.ExpiresIn__c.isUpdateable()&&Schema.sObjectType.AMPUserDetails__c.fields.AMPUrl__c.isUpdateable()&&Schema.sObjectType.AMPUserDetails__c.fields.AMPSha1Key__c.isUpdateable()&&Schema.sObjectType.AMPUserDetails__c.fields.SetupOwnerId.isUpdateable()&&Schema.sObjectType.AMPUserDetails__c.fields.AMPUName__c.isUpdateable()&&Schema.sObjectType.AMPUserDetails__c.fields.ClientID__c.isUpdateable()&&Schema.sObjectType.AMPUserDetails__c.fields.ClientSecret__c.isUpdateable())
                        { update ampApp;bStatus = true;  }
                    }*/
                }
            } 
            else {
                bStatus = false;
                output = errorMsg;}
        }
        catch(Exception e) {
            output = 'Exception while creating : '+e.getMessage(); bStatus = false; 
        }
        return bStatus;
    }
    
    //Get Expiry in hours
    public Double GetSeconds(DateTime expityDate) {
        long dt1 = expityDate.getTime() / 1000 / 60;  //getTime gives us milliseconds, so divide by 1000 for seconds
        long dt2 = DateTime.Now().getTime() / 1000 / 60;
        double d = dt1 - dt2;
        return d;
    }
    
    // Get SHA1 key
    public String storeSHA1Key(String secretkey) {
        String algorithmName = 'SHA1'; 
        Blob input = Blob.valueOf(secretkey);
        Blob signing = Crypto.generateDigest(algorithmName, input);
        return EncodingUtil.convertToHex(signing);
    }
    

}