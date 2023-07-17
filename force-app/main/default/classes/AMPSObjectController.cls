public with sharing class AMPSObjectController extends MindMatrixAuthenticator{
  
    public static String GetInstallName(){
        return AMPSettings.GetInstallName();
    }
    //return token
    public static String GetToken(){
       return AMPSettings.GetToken();
    }
 
    
    //return Active user email
    public static String GetActiveUserEmail(){
        String userName = UserInfo.getUserName();
		if (!Schema.sObjectType.User.fields.Email.isAccessible()&&!Schema.sObjectType.User.fields.Username.isAccessible()){
          return '';
        }
        User activeUser = [Select Email From User where Username = : userName limit 1];
        return activeUser.Email;
    }
    
    //Get Active user email
    @AuraEnabled
    public static string getUserEmail() {
        return GetActiveUserEmail();
    }
    
    @AuraEnabled
    public static string getMMInstallUrl() {
        return MindMatrixAuthHelper.GetOrgInstallName();
    }
    
    @AuraEnabled
    public static Boolean getMMAPIDetailsAvaiable(){
        return AMPSettings.checkMMAPIDetailsAvaiable();
    }
    
    @AuraEnabled
    public static String getUserIntegrated(){
        return checkUserByEmail();
    }
    
    @AuraEnabled
    public static string geteltandeltn(){
        return MindMatrixJWTHelper.GenerateELTandELN();
    }
    
    @AuraEnabled
    public static string checkUserByEmail(){
        string email = UserInfo.getUserEmail();
        JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartObject();
        gen.writeStringField('email', email);
        gen.writeEndObject();
        String jsonS = gen.getAsString();
        String url = MindMatrixAuthHelper.GetOrgInstallName()+'api/CheckForActiveUser';
        return AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,MindMatrixAuthHelper.GetOrgToken());
    }
    
    @AuraEnabled
    public static string AuthenticateSFUser(){
        return MindMatrixAuthenticator.AuthenticateMMUser(true,false);
    }
    //Get AMPSSODetails 
   /* @AuraEnabled
    public static MindMatrix__AMPSSODetails__c getSSODetails() {
        return AMPSettings.GetCurrentUserSSODetails();
    }  */  
    
    @AuraEnabled
    public static MindMatrix__AMPUserDetails__c getSettingUserDetails() {
        return AMPSettings.GetCurrentUserDetails();
    } 
    
   /* @AuraEnabled
    public static void updateLastSSOTime() {
        try{
            if (!Schema.sObjectType.MindMatrix__AMPSSODetails__c.fields.MindMatrix__LastSSOTime__c.isUpdateable()){
                ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR,'Error: Insufficient Access'));
                return;
            }
            MindMatrix__AMPSSODetails__c sso = AMPSettings.GetCurrentUserSSODetails();
            sso.MindMatrix__LastSSOTime__c = Datetime.now();
            upsert sso;
        }
        catch(Exception ex)
        {
            
        }
    }
    //Update AMP SSO Details
    @AuraEnabled
    public static Boolean UpdateSSODetails(string siteurl,string baseurl,string clientid,string token) 
    {
        if(!Schema.sObjectType.MindMatrix__AMPSSODetails__c.fields.MindMatrix__SiteUrl__c.isUpdateable() || !Schema.sObjectType.MindMatrix__AMPSSODetails__c.fields.MindMatrix__SiteUrl__c.isCreateable())
            return false;
        if(!Schema.sObjectType.MindMatrix__AMPSSODetails__c.fields.MindMatrix__BaseUrl__c.isUpdateable() || !Schema.sObjectType.MindMatrix__AMPSSODetails__c.fields.MindMatrix__BaseUrl__c.isCreateable())
            return false;
        if(! Schema.sObjectType.MindMatrix__AMPSSODetails__c.fields.MindMatrix__ClientID__c.isUpdateable() || !Schema.sObjectType.MindMatrix__AMPSSODetails__c.fields.MindMatrix__ClientID__c.isCreateable())
            return false;
        if(! Schema.sObjectType.MindMatrix__AMPSSODetails__c.fields.MindMatrix__SFUserID__c.isUpdateable() || !Schema.sObjectType.MindMatrix__AMPSSODetails__c.fields.MindMatrix__SFUserID__c.isCreateable())
            return false;
        if(! Schema.sObjectType.MindMatrix__AMPSSODetails__c.fields.MindMatrix__Token__c.isUpdateable() || !Schema.sObjectType.MindMatrix__AMPSSODetails__c.fields.MindMatrix__Token__c.isCreateable())
            return false;
        try
        {
            MindMatrix__AMPSSODetails__c sso = AMPSettings.GetCurrentUserSSODetails();
            if(sso == null)
                sso = new MindMatrix__AMPSSODetails__c();
            sso.MindMatrix__SiteUrl__c = siteurl;
            sso.MindMatrix__BaseUrl__c = baseurl;
            sso.MindMatrix__ClientID__c = clientid;
            sso.MindMatrix__Token__c = token;
            sso.MindMatrix__SFUserID__c = UserInfo.getUserId();            
            upsert sso;
            return true;
        }
        catch(Exception ex)
        {
            return false;
        }
    }*/
    //Get userdetail and did usersetup done
    @AuraEnabled
    public static string getUserDetails(string persona)
    {
       if (!Schema.sObjectType.User.fields.Email.isAccessible()&&!Schema.sObjectType.User.fields.Username.isAccessible()){
          return '';
        }
        String userName = UserInfo.getUserName();
        User activeUser = [Select Email From User where Username = : userName limit 1];
        String email = activeUser.Email;
        JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartObject();
        gen.writeStringField('email', email);
        gen.writeStringField('persona', persona);
        gen.writeEndObject();
        String jsonS = gen.getAsString();
        //String url = GetInstallName()+'api/SFGetUserDetails?app='+appHash+'&key='+apiKey;
        String url = MindMatrixAuthHelper.GetOrgInstallName()+'api/SFGetUserDetails';
        return AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,MindMatrixAuthHelper.GetOrgToken());
        
    }
    //Get Persona Details from email
    @AuraEnabled
    public static string GetPersonaDetail(){
        if (!Schema.sObjectType.User.fields.Email.isAccessible()&&!Schema.sObjectType.User.fields.Username.isAccessible()){
          return '';
        }
        String userName = UserInfo.getUserName();
        User activeUser = [Select Email From User where Username = : userName limit 1];
        String email = activeUser.Email;
        JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartObject();
        gen.writeStringField('email', email);
        gen.writeEndObject();
        String jsonS = gen.getAsString();
        String url = MindMatrixAuthHelper.GetOrgInstallName()+'api/SFGetPersonaDetails';
        return AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,MindMatrixAuthHelper.GetOrgToken());
    }    
    //Get SF Contact Details
    @AuraEnabled
    public static List<Contact> getContacts(String ContactId) {
        List<Contact> contacts = [SELECT Id,FirstName,LastName,Description,LastModifiedDate,  Name, MailingStreet, Phone, Email, LeadSource,Account.Name, Account.Industry, Account.MindMatrix__IsPartner__c FROM Contact WHERE Id=:ContactId WITH SECURITY_ENFORCED LIMIT 1];
        return contacts;
      
    }    
    //Get SF Leads Details
    @AuraEnabled
    public static List<Lead> getleads(String leadId) {
        List<Lead> leads = [SELECT Id,FirstName,LastName,Description,LastModifiedDate, Name, Phone, Email,Company, LeadSource FROM Lead WHERE Id=:leadId WITH SECURITY_ENFORCED LIMIT 1];
        return leads;
       
    }
    //Get SF Opportunity Details
    @AuraEnabled
    public static Opportunity getopportunityrecord(String opportunityid) {
        try{
                Opportunity opp = [SELECT Id,Name,Amount,Description,Closedate,StageName,IsClosed,Type,IsWon,Account.Name, Account.Industry,LeadSource,LastModifiedDate FROM Opportunity WHERE Id=:opportunityid WITH SECURITY_ENFORCED LIMIT 1];
                return opp;
        }
        catch(Exception ex)
        {
            return null;
        }
    }
    //Return url for quick action buttons in contact
    @AuraEnabled
    public static string getAMPRequestURL(Contact Contact,string task){
        JSONGenerator gen = JSON.createGenerator(true);
        string firstName = '';
        string lastName = '';
        string accountName = '';
        if(Contact.FirstName != null && Contact.FirstName != 'undefined')
            firstName = Contact.FirstName;
        if(Contact.LastName != null)
            lastName = Contact.LastName;
        if(Contact.Account != null && Contact.Account.Name != '')
            accountName = Contact.Account.Name;
        gen.writeStartObject();
        gen.writeStringField('source', 'contact');
        gen.writeStringField('task', task);
        gen.writeStringField('email', Contact.Email);
        gen.writeStringField('firstname', firstName);
        gen.writeStringField('lastname', lastName);
        gen.writeStringField('company', accountName);
        gen.writeStringField('crmid', Contact.Id);
        gen.writeStringField('tpapp', 'sfdc');
        //gen.writeStringField('useremail', useremail);
        gen.writeEndObject();
        String jsonS = gen.getAsString();
        String url = MindMatrixAuthHelper.GetOrgInstallName()+'api/SFHandleContactRequestUrls';
        return AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,MindMatrixAuthHelper.GetOrgToken());
    }
    //return url for quick action buttons in lead
    @AuraEnabled
    public static string getAMPRequestLeadURL(Lead Lead,string task){        
        JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartObject();
        gen.writeStringField('source', 'lead');
        gen.writeStringField('task', task);
        gen.writeStringField('email', Lead.Email);
        gen.writeStringField('firstname', Lead.FirstName);
        gen.writeStringField('lastname', Lead.LastName);
        gen.writeStringField('company', Lead.Company);
        gen.writeStringField('crmid', Lead.Id);
        gen.writeStringField('tpapp', 'sfdc');
        gen.writeEndObject();
        String jsonS = gen.getAsString();
        String url = MindMatrixAuthHelper.GetOrgInstallName()+'api/SFHandleContactRequestUrls';
        return AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,MindMatrixAuthHelper.GetOrgToken());
    }
    //return url for quick action button in opportunity and also playbook and assets url
    @AuraEnabled
    public static string getOpportunityReport(String oppID){ 
        JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartObject();
        gen.writeStringField('oppID', oppID);
        gen.writeEndObject();
        String jsonS = gen.getAsString();
        String url = MindMatrixAuthHelper.GetOrgInstallName()+'api/SFGetOpportunity';
        return AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,MindMatrixAuthHelper.GetOrgToken());
    }
    
    @AuraEnabled
    public static string saveOpportunityReport(String oppID,String name,String amount,String stage,String closedate,String isClosed,String isWon){

        JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartObject();
        gen.writeStringField('crmrecordid', oppID);
        gen.writeEndObject();
        String jsonS = gen.getAsString();
        String url = MindMatrixAuthHelper.GetOrgInstallName()+'api/SFSyncSalesforceOpportunity';
        return AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,MindMatrixAuthHelper.GetOrgToken());
    }
    //return leads feed detail, playbook and assets
    @AuraEnabled
    public static string getleadDetails(String Email,String leadID,String index) {

        JSONGenerator gen = JSON.createGenerator(true);    
        gen.writeStartObject();
        gen.writeStringField('email', Email);
        gen.writeStringField('source', 'lead');
        gen.writeStringField('index', index);
        //gen.writeStringField('useremail', useremail);
        gen.writeEndObject();
        String jsonS = gen.getAsString();
        String url = MindMatrixAuthHelper.GetOrgInstallName()+'api/SFGetContactFeed';
        return AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,MindMatrixAuthHelper.GetOrgToken());        
    }
    
    @AuraEnabled
    public static string saveLeadDetails(String FirstName,String Email,String LastName,String Company,String Industry,String leadID,String updatedon,String index) {

        JSONGenerator gen = JSON.createGenerator(true);    
        gen.writeStartObject();
        gen.writeStringField('email', Email);
        gen.writeStringField('firstName', FirstName);
        gen.writeStringField('lastName', LastName);
        gen.writeStringField('company', Company);
        gen.writeStringField('industry', Industry);
        gen.writeStringField('tpapp', 'sfdc');
        gen.writeStringField('source', 'lead');
        gen.writeStringField('crmContactId', leadID);
        gen.writeStringField('updatedon',updatedon);
        gen.writeStringField('index', index);
        //gen.writeStringField('useremail', useremail);
        gen.writeEndObject();
        String jsonS = gen.getAsString();
        String url = MindMatrixAuthHelper.GetOrgInstallName()+'api/SFContactSync';
        return AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,MindMatrixAuthHelper.GetOrgToken());
    }
    
    //return contacts feed detail, playbook and assets
    @AuraEnabled
    public static string getContactDetails(String Email,String contactID,String index) {

        JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartObject();
        gen.writeStringField('email', Email);
        gen.writeStringField('source', 'contact');
        gen.writeStringField('index', index);
        //gen.writeStringField('useremail', useremail);
        gen.writeEndObject();
        String jsonS = gen.getAsString();
        String url = MindMatrixAuthHelper.GetOrgInstallName()+'api/SFGetContactFeed';
        String result = AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,MindMatrixAuthHelper.GetOrgToken());
        return result;
        
    }
    
    @AuraEnabled(cacheable=true)
    public static string getAssetTab(String linkid,String source){    
       
        
        JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartObject();
        gen.writeStringField('cid', linkid);
        gen.writeStringField('source', source);
        gen.writeNumberField('eventid',0);
        gen.writeEndObject();
        String jsonS = gen.getAsString();
        String url = MindMatrixAuthHelper.GetOrgInstallName()+'api/SFGetAssetTab';
        String result = AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,MindMatrixAuthHelper.GetOrgToken());
        return result;
    }
    
	@AuraEnabled(cacheable=true)
    public static string getAssetTabForOpp(Integer assetId,Integer assetTypeId,String source){
        
        JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartObject();
        gen.writeNumberField('assetid',assetId);
        gen.writeNumberField('assettype',assetTypeId);
        gen.writeStringField('cid', '0');
        gen.writeStringField('source', 'opportunity');
        gen.writeEndObject();
        String jsonS = gen.getAsString();
        String url = MindMatrixAuthHelper.GetOrgInstallName()+'api/SFGetAssetTab';
        String result = AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,MindMatrixAuthHelper.GetOrgToken());
        return result;
    }
     @AuraEnabled(cacheable=true)
     public static string sfGetTabCount(Integer page,Integer pagesize,String searchparam,Boolean tempSearch,List<String> templateType,List<Integer> tableType,String tabName,Integer isMedia,Boolean condition,String sortupdate,List<String> filters,Boolean iscount,Object[] tabdata){
      	 
         JSONGenerator gen = JSON.createGenerator(true);
         gen.writeStartObject();
         gen.writeNumberField('page', page);
         gen.writeNumberField('pagesize', pagesize);
         gen.writeStringField('searchparam', searchparam);
         gen.writeObjectField('tableType',tableType);
         gen.writeBooleanField('tempSearch', tempSearch);
         gen.writeNumberField('isMedia', isMedia);
         gen.writeBooleanField('condition', condition);
         gen.writeBooleanField('filterFlag', true);
         gen.writeStringField('sort',sortupdate);
         gen.writeObjectField('filters',filters);
          gen.writeBooleanField('iscount', iscount);                                   
         gen.writeObjectField('tabdata',tabdata);
         gen.writeEndObject();
         String jsonS = gen.getAsString();
         String url = MindMatrixAuthHelper.GetOrgInstallName()+'api/SFGetTabCount';
         String result = AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,MindMatrixAuthHelper.GetOrgToken());
         return result;
    }
    
    @AuraEnabled(cacheable=true)
     public static string sfGetAssetSearchForConfigTemplate(Integer page,Integer pagesize,String searchparam,List<Integer> tableType,List<String> templateType,Boolean tempSearch,String tabName,Integer isMedia,List<String> filters,Boolean condition,String sortupdate,Boolean filFlag){
      	
         JSONGenerator gen = JSON.createGenerator(true);
         gen.writeStartObject();
         gen.writeNumberField('page', page);
         gen.writeNumberField('pagesize', pagesize);
         gen.writeStringField('searchparam', searchparam);
         gen.writeObjectField('tableType',tableType);
         gen.writeObjectField('templateType',templateType);
         gen.writeBooleanField('tempSearch', tempSearch);
         gen.writeStringField('tabName', tabName);
         gen.writeNumberField('isMedia', isMedia);
         gen.writeBooleanField('condition', condition);
         gen.writeBooleanField('filterFlag', filFlag);
         gen.writeStringField('sort','updatedon');
         gen.writeObjectField('filters',filters);
         gen.writeEndObject();
         String jsonS = gen.getAsString();
         String url = MindMatrixAuthHelper.GetOrgInstallName()+'api/SFGetAssetSearchForConfigTemplateNew';
         String result = AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,MindMatrixAuthHelper.GetOrgToken());
         return result;
    }
    
    
    @AuraEnabled
    public static string saveContactDetails(String FirstName,String Email,String LastName,String Company,String Industry,String contactID,String updatedon,String index) {

        JSONGenerator gen = JSON.createGenerator(true);
         gen.writeStartObject();
         gen.writeStringField('email', Email);
         gen.writeStringField('firstName', FirstName);
         gen.writeStringField('lastName', LastName);
         gen.writeStringField('company', Company);
         gen.writeStringField('industry', Industry);
         gen.writeStringField('tpapp', 'sfdc');
         gen.writeStringField('source', 'contact');
         gen.writeStringField('crmContactId', contactID);
         gen.writeStringField('updatedon',updatedon);
         gen.writeStringField('index', index);
         //gen.writeStringField('useremail', useremail);
         gen.writeEndObject();
         String jsonS = gen.getAsString();
         String url = MindMatrixAuthHelper.GetOrgInstallName()+'api/SFContactSync';
         return AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,MindMatrixAuthHelper.GetOrgToken());
    }
    
    //get persona theme detail via emailid
    @AuraEnabled
    public static string getPersonaThemeViaEmail()
    {
        //Add isAccessible() check
        string requiredURL = MindMatrixAuthHelper.GetInstallNameForUser()+'api/GetPersonaThemeForSF';
        JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartObject();
        gen.writeStringField('useremail', GetActiveUserEmail());
        gen.writeStringField('persona', 'channelpartner');
        gen.writeEndObject();
        String jsonS = gen.getAsString();
        return AMPGetWebServiceResponse.PostDataJSONResponse(requiredURL,jsonS,MindMatrixAuthHelper.GetTokenForUser());
    }
    //get playbook data from AMP 
    @AuraEnabled
    public static string getPlaybookSearchText(string email,string firstName,string lastName,string company,string industry,string crmContactId, string source, string updatedon,string tpapp, string searchtext, string filterparam)
    {        
        JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartObject();
        gen.writeStringField('email', Email);
        gen.writeStringField('firstName', FirstName);
        gen.writeStringField('lastName', LastName);
        gen.writeStringField('company', company);
        gen.writeStringField('industry', Industry);
        gen.writeStringField('tpapp', tpapp);
        gen.writeStringField('source', source);
        gen.writeStringField('crmContactId', crmContactId);
        //gen.writeStringField('useremail', useremail);
        gen.writeStringField('updatedon', updatedon);
        gen.writeStringField('task','internalplaybooks');
        gen.writeStringField('filterparam',filterparam);
        gen.writeStringField('searchtext',searchtext);
        //gen.writeStringField('pagesize',pagesize);
        //gen.writeStringField('page',page);
        gen.writeEndObject();
        String jsonS = gen.getAsString();
        //return jsonS;
        String url = MindMatrixAuthHelper.GetOrgInstallName()+'api/SFGetPlaybookSearchText';
        String result = AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,MindMatrixAuthHelper.GetOrgToken());
        return result;
    }
    
    @AuraEnabled
    public static string getPlaybookRecords(string searchtext, string page, string pagesize)
    {
        JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartObject();
        gen.writeStringField('searchtext',searchtext);
        gen.writeStringField('pagesize',pagesize);
        gen.writeStringField('page',page);
        gen.writeEndObject();
        String jsonS = gen.getAsString();
        //return jsonS;
        String url = MindMatrixAuthHelper.GetOrgInstallName()+'api/SFGetPlaybookRecord';
        String result = AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,MindMatrixAuthHelper.GetOrgToken());
        return result;
    }
    //get assets data from AMP 
    @AuraEnabled
    public static string getAssetsRecords(String templateType,string status, String tableType,string isCustomized, string templateSearch, string searchtext,string filetype,string page, string pagesize,string sortfield)
    {
        JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartObject();
        //gen.writeStringField('userid', userid);
        gen.writeStringField('templateType',templateType);
        gen.writeStringField('status', status);
        gen.writeStringField('filetype', filetype);
        gen.writeStringField('tableType', tableType);
        gen.writeStringField('isCustomized', isCustomized);
        gen.writeStringField('templateSearch', templateSearch);
        gen.writeStringField('searchtext', searchtext);
        gen.writeStringField('pagesize',pagesize);
        gen.writeStringField('page',page);
        gen.writeStringField('sortfield',sortfield);
        gen.writeEndObject();
        String jsonS = gen.getAsString();
        //return jsonS;
        String url = MindMatrixAuthHelper.GetOrgInstallName()+'api/SFGetAssetSearchForConfigTemplate';
        String result = AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,MindMatrixAuthHelper.GetOrgToken());
        return result;
    }
    //get assets data from AMP 
    @AuraEnabled
    public static string getAssetsSearchRecord(string email,string firstName,string lastName,string company,string industry,string crmContactId, string source, string updatedon,string tpapp, string searchtext, string filterparam)
    {
        JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartObject();
        gen.writeStringField('email', email);
        gen.writeStringField('firstName', firstName);
        gen.writeStringField('lastName', lastName);
        gen.writeStringField('company', company);
        gen.writeStringField('industry', industry);
        gen.writeStringField('updatedon', updatedon);
        gen.writeStringField('tpapp', tpapp);
        gen.writeStringField('task','assets');
        gen.writeStringField('source', source);
        gen.writeStringField('crmContactId', crmContactId);
        //gen.writeStringField('useremail', useremail);
        gen.writeStringField('filterparam',filterparam);
        //gen.writeStringField('searchtext',searchtext);
        gen.writeEndObject();
        String jsonS = gen.getAsString();
        //return jsonS;
        String url = MindMatrixAuthHelper.GetOrgInstallName()+'api/SFGetAssetsRecord';
        String result = AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,MindMatrixAuthHelper.GetOrgToken());
        return result;
    }
    //get internal playbook usedv1 data from AMP 
    @AuraEnabled
    public static string getPlaybooksForCurrentUser(string userid,string page,string pagesize,string searchtext,Boolean condition,string filters)
    {
        JSONGenerator gen = JSON.createGenerator(true);    
        gen.writeStartObject();
        gen.writeStringField('search', searchtext);
        gen.writeBooleanField('condition', condition);
        gen.writeStringField('filters', filters);
        gen.writeStringField('pageSize', pagesize);
        gen.writeStringField('page', page);
        gen.writeEndObject();
        String jsonS = gen.getAsString();
        //return jsonS;
        String url = MindMatrixAuthHelper.GetInstallNameForUser()+'api/SFGetPlaybooksForCurrentUser';
        return AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,MindMatrixAuthHelper.GetTokenForUser());
    }
    @AuraEnabled
    public static string getVimeoThumb(string src)
    {
        
        HttpRequest req = new HttpRequest();
     	req.setEndpoint('https://vimeo.com/api/oembed.json?url'+src);
     	req.setMethod('GET');        
        
        Blob headerValue = Blob.valueOf('');
        String authorizationHeader = 'BASIC ' + EncodingUtil.base64Encode(headerValue);
        req.setHeader('Authorization', authorizationHeader);
        
        Http http = new Http();
     	HTTPResponse res = http.send(req);
        return res.getBody();
    }
   
    
    //update playbook comments into amp
    //@AuraEnabled
    //public static string getplaybookUpdateComments(Integer itemid, string comment,string userid)
    //{
    //    //Add isAccessible() check
    //    JSONGenerator gen = JSON.createGenerator(true);    
    //    gen.writeStartObject();
    //    gen.writeStringField('itemid', String.valueOf(itemid));
    //    gen.writeStringField('comment', EncodingUtil.urlEncode(comment, 'UTF-8'));
    //    gen.writeStringField('type', '1');
    //    gen.writeEndObject();
    //    String jsonS = gen.getAsString();
    //    //return jsonS;
    //    String url = GetInstallName()+'api/UpdateComments?token='+GetToken();
    //    return AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS);
    //}
    //update rating in playbook
    //@AuraEnabled
    //public static string getUpdatedRating(String userid, String itemid, String value, String type)
    //{
    //    JSONGenerator gen = JSON.createGenerator(true);
    //    gen.writeStartObject();
    //    gen.writeStringField('itemid', itemid);
    //    gen.writeStringField('value', value);
    //    gen.writeStringField('type', type);
    //    gen.writeEndObject();
    //    String jsonS = gen.getAsString();
    //    String url = GetInstallName()+'api/UpdateRating?token='+GetToken();
    //    return AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS);
    //}
    
    //display all Opportunity of parent and related child account
    @AuraEnabled
    public static List<Opportunity> getAccountOpportunity(String accountId,Integer page){
       
        
            List<Opportunity> parentAccOpp = [Select Id,name,AccountId,Account.Name,StageName,Amount,CreatedDate from opportunity where AccountId =:accountId WITH SECURITY_ENFORCED ];
            List<Account> childAcc = [SELECT Id from Account where ParentId =:accountId WITH SECURITY_ENFORCED] ;
            List<Opportunity> childAccOpp = new List<Opportunity>();
            for(Account ac : childAcc){            
                childAccOpp.addAll([Select Id,name,AccountId,Account.Name,StageName,Amount,CreatedDate from Opportunity Where AccountId =: ac.Id WITH SECURITY_ENFORCED]);
            }
            parentAccOpp.addAll(childAccOpp);
            return parentAccOpp;
       
       
    }
    @AuraEnabled
    public static String getTemplateId(Integer contactId){ 
       JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartObject();
        gen.writeNumberField('contactid', contactId);
        gen.writeEndObject();
        String jsonS = gen.getAsString();
        String url = MindMatrixAuthHelper.GetOrgInstallName()+'api/sfGetPlaybookTemplateByContactID';
        String result = AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,MindMatrixAuthHelper.GetOrgToken());
        return result;
    }
    @AuraEnabled
    public static String getPlaybookValues(Integer contactId,Integer templateId,Integer companyId){
       JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartObject();
        gen.writeNumberField('contactid', contactId);
        gen.writeNumberField('templateid', templateId);
        gen.writeNumberField('companyid', companyId);
        gen.writeEndObject();
        String jsonS = gen.getAsString();
        String url = MindMatrixAuthHelper.GetOrgInstallName()+'api/SFGetPlaybookByContactID';
        String result = AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,MindMatrixAuthHelper.GetOrgToken());
		return result;
    }
    @AuraEnabled
    public static String GetToDoForInternalPlaybook(Integer playbookid,Integer stepid,Integer contactid){ 
      
       JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartObject();
        gen.writeNumberField('playbookid', playbookid);
        gen.writeNumberField('stepid', stepid);
        gen.writeNumberField('contactid', contactid);
        gen.writeEndObject();
        String jsonS = gen.getAsString();
        String url = MindMatrixAuthHelper.GetOrgInstallName()+'api/SFGetToDoForInternalPlaybook';
        String result = AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,MindMatrixAuthHelper.GetOrgToken());
        return result;
    }
     @AuraEnabled
    public static String setToDoInternalPlaybook(Integer playbookid,Integer stepid,Integer contactid,String duedate,String playbookname,String stepname,String tabname){ 
      
       JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartObject();
        gen.writeNumberField('playbookid', playbookid);
        gen.writeNumberField('stepid', stepid);
        gen.writeNumberField('contactid', contactid);
        gen.writeStringField('duedate', duedate);
        gen.writeStringField('playbookname', playbookname);
        gen.writeStringField('stepname', stepname);
        gen.writeStringField('tabname', tabName);
        gen.writeEndObject();
        String jsonS = gen.getAsString();
        String url = MindMatrixAuthHelper.GetOrgInstallName()+'api/SFSetToDoForInternalPlaybook';
        String result = AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,MindMatrixAuthHelper.GetOrgToken());
        return result;
    }
     @AuraEnabled
    public static String updatePlaybookContactNodeId(Integer playbookid,Integer contactid,Integer nodeId){ 
      
       JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartObject();
        gen.writeNumberField('playbookid', playbookid);
        gen.writeNumberField('contactid', contactid);
       	gen.writeNumberField('nodeid', nodeId);
        gen.writeEndObject();
        String jsonS = gen.getAsString();
        String url = MindMatrixAuthHelper.GetOrgInstallName()+'api/SFUpdatePlaybookContactNodeId';
        String result = AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,MindMatrixAuthHelper.GetOrgToken());
        return result;
    }
    @AuraEnabled
    public static String quickSend(String contactId,String contactsArray,String playbookId,String playbookTempId,Integer fileIds,String templateIds,String dueOnDate,String strXml,String tabId,String stepId,String assetId,String tabName,String stepName){ 
      
       JSONGenerator gen = JSON.createGenerator(true);
        gen.writeStartObject();
        gen.writeStringField('playbookid', playbookId);
        gen.writeStringField('contactid', contactId);
       	gen.writeStringField('playbookTempId', playbookTempId);
         gen.writeStartArray();
        gen.writeNumberField('fileids', fileIds);
        gen.writeEndArray();
        gen.writeStartArray();
        gen.writeStringField('templateids', templateIds);
        gen.writeEndArray();
        gen.writeStringField('sfDueDate', dueOnDate);
        gen.writeStringField('playbookcontactxml', strXml);	
        gen.writeStringField('tabid', tabId);
        gen.writeStringField('stepid', stepId);
        gen.writeStringField('assetorderno', assetId);
        gen.writeStringField('tabname', tabName);
        gen.writeStringField('stepname', stepName);
        gen.writeEndObject();
        String jsonS = gen.getAsString();
        String url = MindMatrixAuthHelper.GetOrgInstallName()+'api/SFQuicksend';
        String result = AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,MindMatrixAuthHelper.GetOrgToken());
        return result;
    }
}