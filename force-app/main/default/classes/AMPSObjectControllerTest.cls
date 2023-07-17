@isTest
public class AMPSObjectControllerTest {
	static testMethod void testAMPSObjectController() 
    {
        testGetInstallName();  
        testGetToken();
        testGetActiveUserEmail();
        testgetUserEmail();
        //testgetSSODetails();
        //testupdateLastSSOTime();
        //testUpdateSSODetails();
        testgetUserDetails();
        testGetPersonaDetail();
        testgetContacts();
        testgetleads();
        testgetopportunityrecord();
        testgetAMPRequestURL();
        testgetAMPRequestLeadURL();
        testgetOpportunityReport();
        testsaveOpportunityReport();
        testgetleadDetails();
        testsaveLeadDetails();
        testgetContactDetails();
        testsaveContactDetails();
        testgetPersonaThemeViaEmail();
        testgetPlaybookRecords();
        testgetAssetsRecords();
        testgetAssetsSearchRecord();
        testgetPlaybooksForCurrentUser();
        testgetUserIntegrated();
        testgetSettingUserDetails();
        Contact cont = new Contact();
        cont.Email = 'test@mailinator.com';
        cont.FirstName = 'Jon';
        cont.LastName = 'Snow';
        upsert cont;
        testgetAMPRequestURL(cont,'add');
        testgetAssetTab();
        testsfGetAssetSearchForConfigTemplate();
        testsfGetTabCount();
        testgetAccountOpportunity();
        testgetPlaybookSearchText();
        testTemplateId();
        testgetPlaybookValues();
        testGetToDoForInternalPlaybook();
        testsetToDoInternalPlaybook();
        testupdatePlaybookContactNodeId();
        //testquickSend();
    }
  
    public static string testgetAssetTab(){
        String linkid = '',source = '';
    	return AMPSObjectController.getAssetTab(linkid,source);
    }
    public static String testsfGetAssetSearchForConfigTemplate(){
        Integer page = 1 , pagesize = 10,isMedia = 0;
        String searchparam = '',tabName = '',sortupdate = '';
        Boolean tempSearch = false ,condition = false ,filFlag=false;
        List<String> templateType = new List<String>{'16','32','128','16384','36864','1048576','2097152','8388608','16777216','268435456'};
        List<Integer> tableType = new List<Integer>();
        List<String> filters = new List<String>();
        String result = AMPSObjectController.sfGetAssetSearchForConfigTemplate( page, pagesize,searchparam,tableType, templateType, tempSearch, tabName, isMedia, filters, condition, sortupdate, filFlag);
        return result;
    }
  	 public static String testsfGetTabCount(){
        Integer page = 1 , pagesize = 10,isMedia = 0;
        String searchparam = '',tabName = '',sortupdate = '';
        Boolean tempSearch = false ,condition = false ,iscount=true;
        List<String> templateType = new List<String>{'16','32','128','16384','36864','1048576','2097152','8388608','16777216','268435456'};
        List<Integer> tableType = new List<Integer>();
        List<String> filters = new List<String>();
         Object[] tabdata = new Object[]{};
        String result = AMPSObjectController.sfGetTabCount( page, pagesize, searchparam, tempSearch, templateType, tableType, tabName, isMedia, condition, sortupdate, filters, iscount, tabdata);
        return result;
    }
    public static List<Opportunity> testgetAccountOpportunity(){
       	String accountId ='';
        Integer page=0;
    	return AMPSObjectController.getAccountOpportunity(accountId,page);
    }
    public static string testgetAMPRequestURL(Contact Contact,string task){
    	return AMPSObjectController.getAMPRequestURL(contact,task);
    }
    public static MindMatrix__AMPUserDetails__c testgetSettingUserDetails() {
        return AMPSObjectController.getSettingUserDetails();
    } 
    public static string testgetUserIntegrated() {
        return AMPSObjectController.getUserIntegrated();
    }
    private static string testgetPlaybooksForCurrentUser() {
        string userid='',page='',pagesize='',searchtext='',filters='';
        Boolean condition = false;
        return AMPSObjectController.getPlaybooksForCurrentUser(userid,page,pagesize,searchtext,condition,filters);
    }
    
    private static string testgetAssetsSearchRecord() {
        string email='',firstName='',lastName='',company='',industry='',crmContactId='', source='', updatedon='',tpapp='', searchtext='', filterparam='';
        return AMPSObjectController.getAssetsSearchRecord(email,firstName,lastName,company,industry,crmContactId, source, updatedon,tpapp, searchtext, filterparam);
    }
    
    private static string testgetAssetsRecords() {
        string templateType='',status='', tableType='',isCustomized='', templateSearch='', searchtext='',filetype='',page='', pagesize='', sortfield='';
        return AMPSObjectController.getAssetsRecords(templateType,status, tableType,isCustomized, templateSearch, searchtext,filetype,page, pagesize, sortfield);
    }
    
    private static string testgetPlaybookRecords() {
        string email='',firstName='',lastName='',company='',industry='',crmContactId='', source='', updatedon='',tpapp='', searchtext='', filterparam='',page='', pagesize='';
        return AMPSObjectController.getPlaybookRecords(filterparam,page, pagesize);
    }
    
    private static string testgetVimeoThumb(){
        string data = ' ';
        return AMPSObjectController.getVimeoThumb(data);
    }
    
    private static string testgetPersonaThemeViaEmail() {
        return AMPSObjectController.getPersonaThemeViaEmail();
    }
    
    private static string testsaveContactDetails() {
        String FirstName='',Email='',LastName='',Company='',Industry='',contactID='',updatedon='',index='';
        return AMPSObjectController.saveContactDetails(FirstName,Email,LastName,Company,Industry,contactID,updatedon,index);
    }
    
    private static string testgetContactDetails() {
        String Email = '',contactID = '',index='';
        return AMPSObjectController.getContactDetails(Email,contactID,index);
    }
    
    private static string testsaveLeadDetails() {
        String FirstName='',Email='',LastName='',Company='',Industry='',leadID='',updatedon='',index='';
        return AMPSObjectController.saveLeadDetails(FirstName,Email,LastName,Company,Industry,leadID,updatedon,index);
    }
    
    private static string testgetleadDetails() {
        String Email = '',leadID = '',index='';
        return AMPSObjectController.getleadDetails(Email,leadID,index);
    }
    private static string testsaveOpportunityReport() {
        String oppID = '',name = '',amount='',stage='',closedate='',isClosed='',isWon='';
        return AMPSObjectController.saveOpportunityReport(oppID,name,amount,stage,closedate,isClosed,isWon);
    }
    private static string testgetPlaybookSearchText(){
        String email = '', firstName='', lastName='', company='', industry='', crmContactId='', source='', updatedon='', tpapp='', searchtext='', filterparam='';
        return AMPSObjectController.getPlaybookSearchText( email, firstName, lastName, company, industry, crmContactId, source, updatedon, tpapp, searchtext, filterparam);
    }
    private static string testgetOpportunityReport() {
        string id = '';
        return AMPSObjectController.getOpportunityReport(id);
    }
    private static string testgetAMPRequestLeadURL() {
        String task = 'add';
       try{
            Lead lead= new Lead();
            lead.Email = '';
            lead.FirstName= '';
            lead.LastName = '';
            lead.company='';
            insert lead;
            //Lead lead = [Select Email,FirstName,LastName,Company,Id From Lead limit 1];
            return AMPSObjectController.getAMPRequestLeadURL(lead,task);
        }
       catch(Exception ex){
            return '';
        }
    }
    private static string testgetAMPRequestURL() {
        string task = '';
        try{
            Contact con = [Select Email From Contact limit 1];
            return AMPSObjectController.getAMPRequestURL(con,task);
        }
        catch(Exception ex){
            return '';
        }
    }
    private static Opportunity testgetopportunityrecord() {
        string Id = '';
        Opportunity getOPP =AMPSObjectController.getopportunityrecord(Id);
        System.assertEquals(null,getOPP);
        return getOPP;
       
    }
    private static List<Lead> testgetleads() {
        string leadId = '';
        List<Lead> getLead =AMPSObjectController.getleads(leadId);
        List<Lead> testLead =new List<Lead>();
        System.assertEquals(testLead,getLead);
        return getLead;
        
    }
    private static List<Contact> testgetContacts() {
        string contactId = '';
         List<Contact> getContact =AMPSObjectController.getContacts(contactId);
        List<Contact> testContact =new List<Contact>();
        System.assertEquals(testContact,getContact);
        return getContact;
       
    }
    private static string testGetPersonaDetail() {
        return AMPSObjectController.GetPersonaDetail();
    }
    
    private static string testgetUserDetails() {
        try{
        	string persona = '';
        	return AMPSObjectController.getUserDetails(persona);
        }
        catch(Exception ex)
        {
            return 'error:'+ex.getMessage();
        }
    }
    
    /*private static Boolean testUpdateSSODetails() {
        string siteurl = '',baseurl = '',clientid = '',token = '';
        AMPSObjectController.UpdateSSODetails(siteurl,baseUrl,clientid,token);
        return true;
    }
    
    private static void testupdateLastSSOTime() {
        AMPSObjectController.updateLastSSOTime();
    }
    
    private static void testgetSSODetails() {
        AMPSObjectController.getSSODetails();
    }*/
    
    private static void testGetInstallName() {
        String installName =  AMPSObjectController.GetInstallName();
        System.assertEquals('',installName);
       
    }
    
    private static void testGetToken() {
        String token = AMPSObjectController.GetToken();
        System.assertEquals('',token);
       
    }
    
    private static void testGetActiveUserEmail() {
        String activeUserEmail = AMPSObjectController.GetActiveUserEmail();
        String userName = UserInfo.getUserName();
        User activeUser = [Select Email From User where Username = : userName limit 1];
        System.assertEquals(activeUser.Email,activeUserEmail);
       
        
    }
    
    private static void testgetUserEmail() {
        String userEmail =  AMPSObjectController.getUserEmail();
         String userName = UserInfo.getUserName();
        User activeUser = [Select Email From User where Username = : userName limit 1];
        System.assertEquals(activeUser.Email,userEmail);
       
    }
    Public static string testTemplateId(){
        Integer contactid=0;
        String templateid = AMPSObjectController.getTemplateId(contactid);
        return templateid;
    }
	
	Public static string testgetPlaybookValues(){
        Integer contactid=0,templateId=0,companyId=0;
         return AMPSObjectController.getPlaybookValues(contactid,templateId,companyId);
    }   
    Public static string testGetToDoForInternalPlaybook(){
         Integer contactid=0,setid=0,companyId=0;
        return AMPSObjectController.GetToDoForInternalPlaybook(contactid,setid,companyId);
    }
    Public static string testsetToDoInternalPlaybook(){
         Integer playbookid=0, stepid=0, contactid=0;
         String duedate='', playbookname='', stepname='', tabname='';
        return AMPSObjectController.setToDoInternalPlaybook(playbookid,stepid,contactid,duedate,playbookname,stepname,tabname);
	}
    public static string testupdatePlaybookContactNodeId(){
        Integer playbookid=0, contactid=0, nodeId=0;
        return AMPSObjectController.updatePlaybookContactNodeId(playbookid,contactid,nodeId);
    }
    public static String testquickSend(){
        String contactId='', contactsArray='',playbookId='', playbookTempId='', templateIds='',
             dueOnDate='',strXml='', tabId='',stepId='',assetId='',tabName='',stepName='';
            Integer fileIds=0;
        return AMPSObjectController.quickSend(contactId,contactsArray,playbookId,playbookTempId,fileIds,templateIds,dueOnDate,strXml,tabId,stepId,assetId,tabName,stepName);
    }
}