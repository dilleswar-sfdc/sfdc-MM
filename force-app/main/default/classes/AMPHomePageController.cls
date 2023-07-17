public with sharing class AMPHomePageController {    
    public String homePageURL {get;set;} 
    public String strMessage {get;set;}
    //public String apiSessionId {get;set;}
    //public String apiServerURL {get;set;}
    public String whatSection {get;set;}
 
     public PageReference getAMPHomeUrl() {
          if(!Schema.sObjectType.AMPUserDetails__c.fields.AMPUrl__c.isAccessible()&&!Schema.sObjectType.AMPUserDetails__c.fields.AMPSha1Key__c.isAccessible())
            return null;
           

        PageReference authPage;
        try {    
            AMPUserAccDetail userInfo = new AMPUserAccDetail();
            List<AMPUserDetails__c> lstUserInfo = userInfo.getAMPUserDetail();
            if(lstUserInfo.size() > 0){
                /* Populate Recipient List*/ 
               // PopulateRecipientList.populatelist();
                if(whatSection == 'home'){
                    homePageURL = lstUserInfo[0].AMPUrl__c + '?elt='+MindMatrixJWTHelper.GenerateELTandELN(lstUserInfo[0].AMPUName__c)+  '&clean';
                    //homePageURL = lstUserInfo[0].AMPUrl__c + '/?elt='+MindMatrixJWTHelper.GenerateELTandELN()+  '&clean';
                    //homePageURL = lstUserInfo[0].AMPUrl__c + 'login/'+ EncodingUtil.urlEncode(lstUserInfo[0].AMPUName__c, 'UTF-8') +'/'+lstUserInfo[0].AMPSha1Key__c+'?returnurl='+ EncodingUtil.urlEncode('/clean', 'UTF-8');
                }
                else{
                   // homePageURL = lstUserInfo[0].AMPUrl__c + '/?elt='+lstUserInfo[0].AMPSha1Key__c+  '&clean#search?text=';
                    homePageURL = lstUserInfo[0].AMPUrl__c + '/?elt='+MindMatrixJWTHelper.GenerateELTandELN(lstUserInfo[0].AMPUName__c)+  '&clean#search?text=';
                   // homePageURL = lstUserInfo[0].AMPUrl__c + 'login/'+ EncodingUtil.urlEncode(lstUserInfo[0].AMPUName__c, 'UTF-8') +'/'+lstUserInfo[0].AMPSha1Key__c+'?returnurl=/#search?clean&text=';
                } 
                authPage = null;
            } else {
                String rediruri = 'https://'+ApexPages.currentPage().getHeaders().get('Host')+'/apex/AMPLogin';
                authPage = new PageReference(rediruri);}} catch(Exception ex) { authPage = null;}
        return authPage;
    }
    public PageReference clearUserSettings() {
        PageReference authPage;
        try { 
            AMPUserAccDetail userInfo = new AMPUserAccDetail();
            List<AMPUserDetails__c> userDetails = userInfo.getAMPUserDetail();
            if(userDetails.size() > 0)
            {
                if (AMPUserDetails__c.sObjectType.getDescribe().isDeletable()) {
                    delete userDetails;    
                    String rediruri = 'https://'+ApexPages.currentPage().getHeaders().get('Host')+'/apex/AMPLogin';
                    authPage = new PageReference(rediruri);
                }
            }
        }
        catch(Exception ex) { authPage = null;}
        return authPage;
    }
}