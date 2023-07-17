@RestResource(urlMapping='/SyncLeadContact/*')
global with sharing class AMPLeadContactSync {

    /*
        Description : Update OR Insert Lead/Contact details
        Check the contact details coming from AMP is exists in Lead / Contact
        If exists in one of it, update the same. If exists in both
        Update both section details.
    */
    
    @HttpPost
    global static boolean upsertContactData() {
        try {
            RestRequest req = RestContext.request;
            RestResponse res = RestContext.response;

            string strEmail = req.params.get('email');
            string strFirstName = req.params.get('fname'); 
            String strLastName = req.params.get('lname'); 
            String strTitle = req.params.get('title'); 
            String strPhoneNo = req.params.get('phone'); 
            String strMobileNo = req.params.get('mobile'); 
            String strFaxNo = req.params.get('fax'); 
            String strLeadSource = req.params.get('leadsource');
            string strCompany = req.params.get('company');
            String strStreet = req.params.get('street'); 
            String strCity = req.params.get('city'); 
            String strState = req.params.get('state'); 
            String strPostalCode = req.params.get('postalcode'); 
            String strCountry = req.params.get('country'); 
            String strInterestLevel = req.params.get('interestlevel'); 
            String strContactType = req.params.get('contacttype'); 
            String strIndustryType = req.params.get('industrytype'); 
            String strActivity = req.params.get('activity');
            String strActivityDueDate = req.params.get('duedate');
            String strActivityComment = req.params.get('comment');
            String strOwner = req.params.get('owner');
            String strListId = req.params.get('listid');
            
            return AMPUpsertData.syncLeadContact(strEmail, strFirstName, strLastName,
                strTitle, strPhoneNo, strMobileNo, strFaxNo,  strLeadSource, 
                strCompany, strStreet, strCity, strState, 
                strPostalCode, strCountry, strInterestLevel, 
                strContactType, strIndustryType, strActivity, strActivityDueDate, 
                strActivityComment, strOwner, strListId); } catch (Exception ex){return true;} } }