// we are not using this class anymore
public class AMPUpdateLeadFromPortalUser {
    // Call from contacts section using trigger : AMPSFSyncContactTr
    public static string updateLeads( String recipientListId) {
         
       /* try {
            if(!leadIds.isEmpty()) {
                List<Lead> leads = [SELECT Id,LastModifiedDate, Email, FirstName, LastName, Phone, Title, Company, Industry, MindMatrix__Nurture_Lead__c, LeadSource FROM Lead WHERE Id IN :leadIds WITH SECURITY_ENFORCED];
                for(Lead ld : leads) {
                    if (ld != null && ld.Id!=null) {
                        // Get Reciepent list    
                       /* if(recipientListId == '')
                            recipientListId = PopulateRecipientList.GetLeadListID(ld.Id);
                            
                        //Write web service code here
                        String result = modifyData(recipientListId, ld.Email, ld.FirstName, ld.LastName, ld.Phone, ld.Company, ld.Industry,   ld.LeadSource, ld.MindMatrix__Nurture_Lead__c, ld.Id,ld.LastModifiedDate);
                      
                    } ProcessorControl.inFutureContext = true; } } } catch(Exception ex) {  } */
        return '';
    }

    // Call method from contact sync class
   /* public static String manageLeads(String leadId, String recipientListId) {
         
        String result = '';
        try {
            Lead ld = [SELECT Id,LastModifiedDate, Email, FirstName, LastName, Phone, Title, Company, Industry,  LeadSource, MindMatrix__Nurture_Lead__c FROM Lead WHERE Id =:leadId WITH SECURITY_ENFORCED];
                    
            if (ld != null && ld.Id!=null) {
                //Write web service code here
                result = modifyData(recipientListId, ld.Email, ld.FirstName, ld.LastName, ld.Phone, ld.Company, ld.Industry,  ld.LeadSource, ld.MindMatrix__Nurture_Lead__c, ld.Id,ld.LastModifiedDate);
            }						
        } catch(Exception ex) {
        }
        return result;
    }
   
    //Modify Lead data and send it to AMP using Mobile.ashx url
    public static String modifyData(String recipientListId, String Email, string FirstName, String LastName, String PhoneNo, String CompanyName, String IndusctyType,  String LeadSource, String NurtureLead, string CRMID,Datetime LastModifiedDate) {
        String jsonResp = '', strMessage='', ampAddContactUrl='';
        try {
            AMPUserAccDetail userAcc = new AMPUserAccDetail();
            List<AMPUserDetails__c> lstUserAcc = userAcc.getAMPUserDetail();
            if(lstUserAcc.size() > 0) {
            
            if(PhoneNo == null) PhoneNo = ''; if(FirstName == null) FirstName = '';
            if(NurtureLead == null) NurtureLead = 'No'; if(IndusctyType == null) IndusctyType = '';
            
           		JSONGenerator gen = JSON.createGenerator(true);    
                gen.writeStartObject();
                gen.writeStringField('firstName', FirstName);
         		gen.writeStringField('lastName', LastName);
         		gen.writeStringField('company', CompanyName);
         		gen.writeStringField('industry', IndusctyType);
                gen.writeStringField('email', Email);
                gen.writeStringField('tpapp', 'sfdc');
                gen.writeStringField('source', 'lead');
                gen.writeStringField('crmContactId', CRMID);
                gen.writeDateTimeField('updatedon',LastModifiedDate);
                gen.writeStringField('index', '0');
                //gen.writeStringField('useremail', useremail);
                gen.writeEndObject();
                String jsonS = gen.getAsString();
                ampAddContactUrl = lstUserAcc[0].AMPUrl__c + 'api/SFContactSync'; 
                 strMessage= AMPGetWebServiceResponse.PostDataJSONResponse(ampAddContactUrl,jsonS,lstUserAcc[0].ClientSecret__c);
            }
        } 
        catch(Exception ex) {
            strMessage = ex.getMessage();
        }
            return strMessage;
        }*/
     
    }