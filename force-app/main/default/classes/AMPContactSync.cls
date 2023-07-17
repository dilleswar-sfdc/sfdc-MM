@RestResource(urlMapping='/SyncContact/*')
global with sharing class AMPContactSync {

    //Get Contact Data
    @HttpGet    
    global static Contact getContactDataByEmail() {
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;
        string contactEmail = req.params.get('email');
        Contact cInfo;
        try {
            if(Schema.sObjectType.Contact.isAccessible()){
            cInfo = [SELECT Id, FirstName, LastName, Email, Title, AccountId, Phone, MobilePhone, Fax, LeadSource, MailingStreet, MailingCity, MailingState, MailingPostalCode, MailingCountry, Interest_Level__c,  Account.Name, Account.Type, Account.Industry FROM Contact WHERE Email =: contactEmail WITH SECURITY_ENFORCED LIMIT 1];
            }
        } catch(Exception ex) {
        }
        return cInfo;
    }

    //Update OR Insert Contact details
    @HttpPost
    global static boolean upsertContactData() {
         
        
        
        try {
            RestRequest req = RestContext.request;
            RestResponse res = RestContext.response;

            string cEmail = req.params.get('email');
            string cFirstName = req.params.get('fname'); 
            String cLastName = req.params.get('lname'); 
            String cTitle = req.params.get('title'); 
            String cPhoneNo = req.params.get('phone'); 
            String cMobileNo = req.params.get('mobile'); 
            String cFaxNo = req.params.get('fax'); 
            String cLeadSource = req.params.get('leadsource');
            string AccountName = req.params.get('company');
            String cMailingStreet = req.params.get('street'); 
            String cMailingCity = req.params.get('city'); 
            String cMailingState = req.params.get('state'); 
            String cMailingPostalCode = req.params.get('postalcode'); 
            String cMailingCountry = req.params.get('country'); 
            String cInterestLevel = req.params.get('interestlevel'); 
            String cContactType = req.params.get('contacttype'); 
            String cIndustryType = req.params.get('industrytype'); 
            String cActivity = req.params.get('activity');
            String cActivityDueDate = req.params.get('duedate');
            String cActivityComment = req.params.get('comment');
            
            Id accId, contID;
           	if (!Schema.sObjectType.Account.fields.Name.isAccessible()&&!Schema.sObjectType.Account.fields.Type.isAccessible()&&!Schema.sObjectType.Account.fields.Industry.isAccessible()&&!Schema.sObjectType.Account.fields.Name.isCreateable()&&!Schema.sObjectType.Account.fields.Type.isCreateable()&&!Schema.sObjectType.Account.fields.Industry.isCreateable())
              return false;
           
            List<Account> listAcc = [SELECT Id, Name FROM Account WHERE Name LIKE  : '%'+ AccountName +'%' WITH SECURITY_ENFORCED LIMIT 1];
           
            if(listAcc.size() == 0) { //add new account
                //Create new account
                Account acc = new Account();
                acc.Name = AccountName;
                acc.Type = cContactType;
                acc.Industry = cIndustryType;
				
                insert acc;
                accId = acc.id;
            } else {
                accId = listAcc[0].id;
            }
            if(!Schema.sObjectType.Contact.fields.FirstName.isCreateable()&&!Schema.sObjectType.Contact.fields.LastName.isCreateable()&&!Schema.sObjectType.Contact.fields.Email.isCreateable()&&!Schema.sObjectType.Contact.fields.Title.isCreateable()&&!Schema.sObjectType.Contact.fields.AccountId.isCreateable()&&!Schema.sObjectType.Contact.fields.Phone.isCreateable()&&!Schema.sObjectType.Contact.fields.MobilePhone.isCreateable()&&!Schema.sObjectType.Contact.fields.Fax.isCreateable()&&!Schema.sObjectType.Contact.fields.LeadSource.isCreateable()&&!Schema.sObjectType.Contact.fields.MailingStreet.isCreateable()&&!Schema.sObjectType.Contact.fields.MailingCity.isCreateable()&&!Schema.sObjectType.Contact.fields.MailingState.isCreateable()&&!Schema.sObjectType.Contact.fields.MailingPostalCode.isCreateable()&&!Schema.sObjectType.Contact.fields.MailingCountry.isCreateable()&&!Schema.sObjectType.Contact.fields.Interest_Level__c.isCreateable()&&!Schema.sObjectType.Contact.fields.FirstName.isUpdateable()&&!Schema.sObjectType.Contact.fields.LastName.isUpdateable()&&!Schema.sObjectType.Contact.fields.Email.isUpdateable()&&!Schema.sObjectType.Contact.fields.Title.isUpdateable()&&!Schema.sObjectType.Contact.fields.AccountId.isUpdateable()&&!Schema.sObjectType.Contact.fields.Phone.isUpdateable()&&!Schema.sObjectType.Contact.fields.MobilePhone.isUpdateable()&&!Schema.sObjectType.Contact.fields.Fax.isUpdateable()&&!Schema.sObjectType.Contact.fields.LeadSource.isUpdateable()&&!Schema.sObjectType.Contact.fields.MailingStreet.isUpdateable()&&!Schema.sObjectType.Contact.fields.MailingCity.isUpdateable()&&!Schema.sObjectType.Contact.fields.MailingState.isUpdateable()&&!Schema.sObjectType.Contact.fields.MailingPostalCode.isUpdateable()&&!Schema.sObjectType.Contact.fields.MailingCountry.isUpdateable()&&!Schema.sObjectType.Contact.fields.Interest_Level__c.isUpdateable())
            return false;
            
            List<Contact> listCont = [SELECT FirstName, LastName,Email, Title, Phone, MobilePhone, Fax, LeadSource, MailingStreet, MailingCity, MailingState, MailingPostalCode, MailingCountry, Interest_Level__c, Account.Type, Account.Industry FROM Contact WHERE Email =: cEmail WITH SECURITY_ENFORCED LIMIT 1];
            
             if(listCont.size() == 0) {
                //Create new contact
                Contact cont = new Contact();
                cont.FirstName = cFirstName;
                cont.LastName = cLastName;
                cont.Email = cEmail;
                cont.Title = cTitle;
                cont.AccountId = accId;
                cont.Phone = cPhoneNo;
                cont.MobilePhone = cMobileNo;
                cont.Fax = cFaxNo;
                cont.LeadSource = cLeadSource;
                cont.MailingStreet = cMailingStreet;
                cont.MailingCity = cMailingCity;
                cont.MailingState = cMailingState;
                cont.MailingPostalCode = cMailingPostalCode;
                cont.MailingCountry = cMailingCountry;    
                cont.Interest_Level__c = cInterestLevel;
                insert cont;
                contID = cont.ID;
            } else {
                for(Contact cont : listCont ) {
                    // Update this contact
                    cont.FirstName = cFirstName;
                    cont.LastName = cLastName;
                    cont.Title = cTitle;
                    cont.Phone = cPhoneNo;
                    cont.MobilePhone = cMobileNo;
                    cont.Fax = cFaxNo;
                    cont.LeadSource = cLeadSource;
                    cont.MailingStreet = cMailingStreet;
                    cont.MailingCity = cMailingCity;
                    cont.MailingState = cMailingState;
                    cont.MailingPostalCode = cMailingPostalCode;
                    cont.MailingCountry = cMailingCountry;    
                    cont.Interest_Level__c = cInterestLevel;
                    cont.AccountId = accId;
                    contID = cont.ID;
                    update cont;
                }
            }
            
            /* Add Activity Task in Contact */
            try {
                if(cActivity != null && cActivity != '') {
                    Task tsk = new Task();
                    tsk.WhoID =  contID; //Contact ID
                    tsk.Subject = cActivity; //Task ID
                    tsk.Status = 'Not Started';
                    tsk.Description = cActivityComment;
                    tsk.Priority = 'High';
                    
                    //Due Date
                    if(cActivityDueDate != null) {
                        Datetime dt1 = DateTime.parse(cActivityDueDate + ' 00:00 AM');
                        tsk.ActivityDate = dt1.date();
                    }
                    else {
                        tsk.ActivityDate = datetime.now().date() + 2;
                    }
                    
                    //Set Reminder Date
                    tsk.put('ReminderDateTime', DateTime.valueOf(tsk.ActivityDate + ' 00:00:00'));
                    tsk.put('isReminderSet', true);
                    insert tsk;
                }
            } catch(Exception ex){}
            
            return true;
            
        } 
        catch (Exception ex){return false;}
    }
}