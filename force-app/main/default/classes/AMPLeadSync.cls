@RestResource(urlMapping='/SyncLead/*')
global with sharing class AMPLeadSync {
	//Get Lead data
    @HttpGet    
    global static Lead getLeadDataByEmail() {
        Lead lead;
     /* if(!Schema.sObjectType.Lead.fields.Id.isAccessible()&&!Schema.sObjectType.Lead.fields.Email.isAccessible()&&!Schema.sObjectType.Lead.fields.FirstName.isAccessible() &&!Schema.sObjectType.Lead.fields.LastName.isAccessible()&&!Schema.sObjectType.Lead.fields.Title.isAccessible()&&!Schema.sObjectType.Lead.fields.Industry.isAccessible() &&!Schema.sObjectType.Lead.fields.Phone.isAccessible()&&!Schema.sObjectType.Lead.fields.MobilePhone.isAccessible()&&!Schema.sObjectType.Lead.fields.Fax.isAccessible() &&!Schema.sObjectType.Lead.fields.LeadSource.isAccessible()&&!Schema.sObjectType.Lead.fields.Street.isAccessible()&&!Schema.sObjectType.Lead.fields.City.isAccessible() &&!Schema.sObjectType.Lead.fields.State.isAccessible()&&!Schema.sObjectType.Lead.fields.PostalCode.isAccessible()&&!Schema.sObjectType.Lead.fields.Country.isAccessible() &&!Schema.sObjectType.Lead.fields.Company.isAccessible()) 
          return null;
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;
        string LeadEmail = req.params.get('email');
        Lead lInfo;
        try {
          
             lInfo = [SELECT Id, FirstName, LastName, Email, Title, Company, Phone, MobilePhone, Fax, LeadSource, Street, City, State, PostalCode, Country, Industry FROM Lead WHERE Email =: LeadEmail  LIMIT 1];
         
        } catch(Exception ex) {
        }
        return lInfo;*/
        return lead;
    }

    //Update OR Insert Lead details    
    @HttpPost
    global static boolean upsertLeadData() {
    	/*if (!Schema.sObjectType.Lead.fields.FirstName.isAccessible() && !Schema.sObjectType.Lead.fields.FirstName.isCreateable() && !Schema.sObjectType.Lead.fields.FirstName.isUpdateable() &&  !Schema.sObjectType.Lead.fields.LastName.isAccessible() && !Schema.sObjectType.Lead.fields.LastName.isCreateable() && !Schema.sObjectType.Lead.fields.LastName.isUpdateable() &&  !Schema.sObjectType.Lead.fields.Title.isAccessible() && !Schema.sObjectType.Lead.fields.Title.isCreateable() && !Schema.sObjectType.Lead.fields.Title.isUpdateable() &&  !Schema.sObjectType.Lead.fields.Phone.isAccessible() && !Schema.sObjectType.Lead.fields.Phone.isCreateable() && !Schema.sObjectType.Lead.fields.Phone.isUpdateable() &&  !Schema.sObjectType.Lead.fields.MobilePhone.isAccessible() && !Schema.sObjectType.Lead.fields.MobilePhone.isCreateable() && !Schema.sObjectType.Lead.fields.MobilePhone.isUpdateable()  && !Schema.sObjectType.Lead.fields.Fax.isAccessible() && !Schema.sObjectType.Lead.fields.Fax.isCreateable() && !Schema.sObjectType.Lead.fields.Fax.isUpdateable()    && !Schema.sObjectType.Lead.fields.LeadSource.isAccessible() && !Schema.sObjectType.Lead.fields.LeadSource.isCreateable() && !Schema.sObjectType.Lead.fields.LeadSource.isUpdateable()      && !Schema.sObjectType.Lead.fields.Street.isAccessible() && !Schema.sObjectType.Lead.fields.Street.isCreateable() && !Schema.sObjectType.Lead.fields.Street.isUpdateable() &&  !Schema.sObjectType.Lead.fields.City.isAccessible() && !Schema.sObjectType.Lead.fields.City.isCreateable() && !Schema.sObjectType.Lead.fields.City.isUpdateable() &&  !Schema.sObjectType.Lead.fields.State.isAccessible() && !Schema.sObjectType.Lead.fields.State.isCreateable() && !Schema.sObjectType.Lead.fields.State.isUpdateable() &&  !Schema.sObjectType.Lead.fields.PostalCode.isAccessible() && !Schema.sObjectType.Lead.fields.PostalCode.isCreateable() && !Schema.sObjectType.Lead.fields.PostalCode.isUpdateable() &&  !Schema.sObjectType.Lead.fields.Country.isAccessible() && !Schema.sObjectType.Lead.fields.country.isCreateable() && !Schema.sObjectType.Lead.fields.Country.isUpdateable() &&  !Schema.sObjectType.Lead.fields.Interest_Level__c.isAccessible() && !Schema.sObjectType.Lead.fields.Interest_Level__c.isCreateable() && !Schema.sObjectType.Lead.fields.Interest_Level__c.isUpdateable() &&  !Schema.sObjectType.Lead.fields.Industry.isAccessible() && !Schema.sObjectType.Lead.fields.Industry.isCreateable() && !Schema.sObjectType.Lead.fields.Industry.isUpdateable())
          return null;
        try {
            RestRequest req = RestContext.request;
            RestResponse res = RestContext.response;
            string lEmail = req.params.get('email'); 
            string lFirstName = req.params.get('fname');
            String lLastName = req.params.get('lname'); 
            String lTitle = req.params.get('title'); 
            String lPhoneNo = req.params.get('phone'); 
            String lMobileNo = req.params.get('mobile'); 
            String lFaxNo = req.params.get('fax'); 
            String lLeadSource = req.params.get('leadsource'); 
            String lCompany = req.params.get('company'); 
            String lStreet = req.params.get('street'); 
            String lCity = req.params.get('city'); 
            String lState = req.params.get('state'); 
            String lPostalCode = req.params.get('postalcode'); 
            String lCountry = req.params.get('country'); 
            String lInterestLevel = req.params.get('interestlevel'); 
            String lContactType = req.params.get('contacttype'); 
            String lIndustryType = req.params.get('industrytype'); 
            String lActivity = req.params.get('activity'); 
            String lActivityDueDate = req.params.get('duedate'); 
            String lActivityComment = req.params.get('comment'); 
            
            List<Lead> listLead = [SELECT FirstName, LastName, Title, Phone, MobilePhone, Fax, LeadSource, Street, City, State, PostalCode, Country,  Industry FROM Lead WHERE Email =: lEmail  LIMIT 1];
            
            Id leadID;
            if(listLead.size() == 0) {
                //Create new lead
                Lead ld = new Lead();
                ld.FirstName = lFirstName;
                ld.LastName = lLastName;
                ld.Email = lEmail;
                ld.Title = lTitle;
                ld.Company = lCompany;
                ld.Phone = lPhoneNo;
                ld.MobilePhone = lMobileNo;
                ld.Fax = lFaxNo;
                ld.LeadSource = lLeadSource;
                ld.Street = lStreet;
                ld.City = lCity;
                ld.State = lState;
                ld.PostalCode = lPostalCode;
                ld.Country = lCountry;    
                ld.Interest_Level__c = lInterestLevel;
                ld.Industry = lIndustryType;
                ld.RecordTypeId = '0120o000001VKTxAAO';
                insert ld;
                leadID = ld.Id;
            } else {
                for(Lead ld : listLead ) {
                    // Update this contact
                    ld.FirstName = lFirstName;
                    ld.LastName = lLastName;
                    ld.Title = lTitle;
                    ld.Company = lCompany;
                    ld.Phone = lPhoneNo;
                    ld.MobilePhone = lMobileNo;
                    ld.Fax = lFaxNo;
                    ld.LeadSource = lLeadSource;
                    ld.Street = lStreet;
                    ld.City = lCity;
                    ld.State = lState;
                    ld.PostalCode = lPostalCode;
                    ld.Country = lCountry;    
                    ld.Interest_Level__c = lInterestLevel;
                    ld.Industry = lIndustryType;
                    leadID = ld.Id;
                    update ld;
                }        
            }*/
            
              /* Add Activity Task in Contact */
          /*  try {
                if(lActivity != null && lActivity != '') {
                    Task tsk = new Task();
                    tsk.WhoID =  leadID; //Contact ID
                    tsk.Subject = lActivity; //Task ID
                    tsk.Status = 'Not Started';
                    tsk.Description = lActivityComment;
                    tsk.Priority = 'High';
                    
                    //Due Date
                    if(lActivityDueDate != null) {
                        Datetime dt1 = DateTime.parse(lActivityDueDate + ' 00:00 AM');
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
        catch(Exception ex) {return false;}*/
        return true;
    }
}