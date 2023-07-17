public with sharing class AMPUpsertData {

    public static boolean syncLeadContact(String strEmail, String strFirstName, String strLastName,
        String strTitle, String strPhoneNo, String strMobileNo, String strFaxNo,  String strLeadSource, 
        String strCompany, String strStreet, String strCity, String strState, 
        String strPostalCode, String strCountry, String strInterestLevel, 
        String strContactType, String strIndustryType, String strActivity, String strActivityDueDate, 
        String strActivityComment, String strOwner, string strListId) {
        
        //PopulateRecipientList.populatelist();
      /*  List<AMP_Recipient_List__c> objList = new List<AMP_Recipient_List__c>();
        Id SFUserID = UserInfo.getUserId();//Logged-in UserID
        if(strListId == null || strListId =='')
            strListId = '0';
            if(Schema.sObjectType.AMP_Recipient_List__c.fields.Name.isAccessible()&&Schema.sObjectType.AMP_Recipient_List__c.fields.AMP_List_Key__c.isAccessible())
        objList = [SELECT Id, Name, AMP_List_Key__c FROM AMP_Recipient_List__c WHERE OwnerId =: SFUserID AND AMP_List_Key__c =: strListId LIMIT 1];
        
        //Lead Section
        try {
            if (!Schema.sObjectType.Lead.fields.FirstName.isAccessible()&&!Schema.sObjectType.Lead.fields.FirstName.isCreateable()&&!Schema.sObjectType.Lead.fields.FirstName.isUpdateable()&&!Schema.sObjectType.Lead.fields.LastName.isAccessible()&&!Schema.sObjectType.Lead.fields.LastName.isCreateable()&&!Schema.sObjectType.Lead.fields.LastName.isUpdateable()&&!Schema.sObjectType.Lead.fields.Title.isAccessible()&&!Schema.sObjectType.Lead.fields.Title.isCreateable()&&!Schema.sObjectType.Lead.fields.Title.isUpdateable()&&!Schema.sObjectType.Lead.fields.Phone.isAccessible()&&!Schema.sObjectType.Lead.fields.Phone.isCreateable()&&!Schema.sObjectType.Lead.fields.Phone.isUpdateable()&&!Schema.sObjectType.Lead.fields.MobilePhone.isAccessible()&&!Schema.sObjectType.Lead.fields.MobilePhone.isCreateable()&&!Schema.sObjectType.Lead.fields.MobilePhone.isUpdateable()&&!Schema.sObjectType.Lead.fields.Fax.isAccessible()&&!Schema.sObjectType.Lead.fields.Fax.isCreateable()&&!Schema.sObjectType.Lead.fields.Fax.isUpdateable()&&!Schema.sObjectType.Lead.fields.LeadSource.isAccessible()&&!Schema.sObjectType.Lead.fields.LeadSource.isCreateable()&&!Schema.sObjectType.Lead.fields.LeadSource.isUpdateable()&&!Schema.sObjectType.Lead.fields.Street.isAccessible()&&!Schema.sObjectType.Lead.fields.Street.isCreateable()&&!Schema.sObjectType.Lead.fields.Street.isUpdateable()&&!Schema.sObjectType.Lead.fields.City.isAccessible()&&!Schema.sObjectType.Lead.fields.City.isCreateable()&&!Schema.sObjectType.Lead.fields.City.isUpdateable()&&!Schema.sObjectType.Lead.fields.State.isAccessible()&&!Schema.sObjectType.Lead.fields.State.isCreateable()&&!Schema.sObjectType.Lead.fields.State.isUpdateable()&&!Schema.sObjectType.Lead.fields.PostalCode.isAccessible()&&!Schema.sObjectType.Lead.fields.PostalCode.isCreateable()&&!Schema.sObjectType.Lead.fields.PostalCode.isUpdateable()&&!Schema.sObjectType.Lead.fields.Country.isAccessible()&&!Schema.sObjectType.Lead.fields.country.isCreateable()&&!Schema.sObjectType.Lead.fields.Country.isUpdateable()&&!Schema.sObjectType.Lead.fields.Interest_Level__c.isAccessible()&&!Schema.sObjectType.Lead.fields.Interest_Level__c.isCreateable()&&!Schema.sObjectType.Lead.fields.Interest_Level__c.isUpdateable()&&!Schema.sObjectType.Lead.fields.Industry.isAccessible()&&!Schema.sObjectType.Lead.fields.Industry.isCreateable()&&!Schema.sObjectType.Lead.fields.Industry.isUpdateable())
          return null;
        
            ProcessorControl.inFutureContext = true;
            List<Lead> listLead = [SELECT Id, FirstName, LastName, Title, Phone, MobilePhone, Fax, LeadSource, Street, City, State, PostalCode, Country, Interest_Level__c, Industry FROM Lead WHERE Email =: strEmail LIMIT 1];
            
            Id leadID;
            if(listLead.size() == 0) {
                //Create new lead
                Lead ld = new Lead();
                ld.FirstName = strFirstName;
                ld.LastName = strLastName;
                ld.Email = strEmail;
                ld.Title = strTitle;
                ld.Company = strCompany;
                ld.Phone = strPhoneNo;
                ld.MobilePhone = strMobileNo;
                ld.Fax = strFaxNo;
                ld.LeadSource = strLeadSource;
                ld.Street = strStreet;
                ld.City = strCity;
                ld.State = strState;
                ld.PostalCode = strPostalCode;
                ld.Country = strCountry;    
                ld.Interest_Level__c = strInterestLevel;
                
                if(strOwner != null && strOwner != '')
                    ld.OwnerID = strOwner;
                
                ld.Industry = strIndustryType;
                if(objList.size() > 0) 
                    ld.Recipient_List__c = objList[0].Id;
                    
                insert ld;
                leadID = ld.Id;
            } else {
                for(Lead ld : listLead) {
                    // Update this contact
                    ld.FirstName = strFirstName;
                    ld.LastName = strLastName;
                    ld.Title = strTitle;
                    ld.Company = strCompany;
                    ld.Phone = strPhoneNo;
                    ld.MobilePhone = strMobileNo;
                    ld.Fax = strFaxNo;
                    ld.LeadSource = strLeadSource;
                    ld.Street = strStreet;
                    ld.City = strCity;
                    ld.State = strState;
                    ld.PostalCode = strPostalCode;
                    ld.Country = strCountry;    
                    ld.Interest_Level__c = strInterestLevel;
                    //Owner
                    if(strOwner != null && strOwner != '')
                        ld.OwnerID = strOwner;
                    
                    ld.Industry = strIndustryType;
                    if(objList.size() > 0) 
                        ld.Recipient_List__c = objList[0].Id;    
                        
                    leadID = ld.Id;
                    update ld;  } } 
                    createTask(leadID, strActivity, strActivityComment, strActivityDueDate, strOwner); } catch(Exception ex){ return false;}
        
        //Contact Section
        try {
            if ((!Schema.sObjectType.Contact.fields.FirstName.isAccessible()&&!Schema.sObjectType.Contact.fields.FirstName.isCreateable()&&!Schema.sObjectType.Contact.fields.FirstName.isUpdateable())&&(!Schema.sObjectType.Contact.fields.LastName.isAccessible()&&!Schema.sObjectType.Contact.fields.LastName.isCreateable()&&!Schema.sObjectType.Contact.fields.LastName.isUpdateable())&&(!Schema.sObjectType.Contact.fields.Title.isAccessible()&&!Schema.sObjectType.Contact.fields.Title.isCreateable()&&!Schema.sObjectType.Contact.fields.Title.isUpdateable())&&(!Schema.sObjectType.Contact.fields.Phone.isAccessible()&&!Schema.sObjectType.Contact.fields.Phone.isCreateable()&&!Schema.sObjectType.Contact.fields.Phone.isUpdateable())&&(!Schema.sObjectType.Contact.fields.MobilePhone.isAccessible()&&!Schema.sObjectType.Contact.fields.MobilePhone.isCreateable()&&!Schema.sObjectType.Contact.fields.MobilePhone.isUpdateable())&&(!Schema.sObjectType.Contact.fields.Fax.isAccessible()&&!Schema.sObjectType.Contact.fields.Fax.isCreateable()&&!Schema.sObjectType.Contact.fields.Fax.isUpdateable())&&(!Schema.sObjectType.Account.fields.Type.isAccessible()&&!Schema.sObjectType.Account.fields.Type.isCreateable()&&!Schema.sObjectType.Account.fields.Type.isUpdateable())&&(!Schema.sObjectType.Contact.fields.MailingStreet.isAccessible()&&!Schema.sObjectType.Contact.fields.MailingStreet.isCreateable()&&!Schema.sObjectType.Contact.fields.MailingStreet.isUpdateable())&&(!Schema.sObjectType.Contact.fields.MailingCity.isAccessible()&&!Schema.sObjectType.Contact.fields.MailingCity.isCreateable()&&!Schema.sObjectType.Contact.fields.MailingCity.isUpdateable())&&(!Schema.sObjectType.Contact.fields.MailingState.isAccessible()&&!Schema.sObjectType.Contact.fields.MailingState.isCreateable()&&!Schema.sObjectType.Contact.fields.MailingState.isUpdateable())&&(!Schema.sObjectType.Contact.fields.MailingPostalCode.isAccessible()&&!Schema.sObjectType.Contact.fields.MailingPostalCode.isCreateable()&&!Schema.sObjectType.Contact.fields.MailingPostalCode.isUpdateable())&&(!Schema.sObjectType.Contact.fields.MailingCountry.isAccessible()&&!Schema.sObjectType.Contact.fields.MailingCountry.isCreateable()&&!Schema.sObjectType.Contact.fields.MailingCountry.isUpdateable())&&(!Schema.sObjectType.Contact.fields.Interest_Level__c.isAccessible()&&!Schema.sObjectType.Contact.fields.Interest_Level__c.isCreateable()&&!Schema.sObjectType.Contact.fields.Interest_Level__c.isUpdateable())&&(!Schema.sObjectType.Account.fields.Industry.isAccessible()&&!Schema.sObjectType.Account.fields.Industry.isCreateable()&&!Schema.sObjectType.Account.fields.Industry.isUpdateable()))
          return null;
            ProcessorControl.inFutureContext = true;
            List<Contact> listCont = [SELECT FirstName, LastName, Title, Phone, MobilePhone, Fax, LeadSource, MailingStreet, MailingCity, MailingState, MailingPostalCode, MailingCountry, Account.Type, Account.Industry FROM Contact WHERE Email =: strEmail LIMIT 1];
            
            if(listCont.size() > 0) {
             	
                Id accId, contID;
                List<Account> listAcc = [SELECT Id, Name FROM Account WHERE Name LIKE  : '%'+ strCompany +'%' LIMIT 1];
                
                if(listAcc.size() == 0) { //add new account
                    //Create new account
                    Account acc = new Account();
                    acc.Name = strCompany;
                    acc.Type = strContactType;
                    acc.Industry = strIndustryType;
                
                    insert acc;
                    accId = acc.id;
                } else {
                    accId = listAcc[0].id;
                }
            
                 for(Contact cont : listCont ) {
                    //Update this contact
                    cont.FirstName = strFirstName;
                    cont.LastName = strLastName;
                    cont.Title = strTitle;
                    cont.Phone = strPhoneNo;
                    cont.MobilePhone = strMobileNo;
                    cont.Fax = strFaxNo;
                    cont.LeadSource = strLeadSource;
                    cont.MailingStreet = strStreet;
                    cont.MailingCity = strCity;
                    cont.MailingState = strState;
                    cont.MailingPostalCode = strPostalCode;
                    cont.MailingCountry = strCountry;    
                    cont.Interest_Level__c = strInterestLevel;
                    cont.AccountId = accId;
                    contID = cont.ID;
                    if(objList.size() > 0) 
                       cont.Recipient_List__c = objList[0].Id;  
                    update cont;  } 
                    createTask(contID, strActivity, strActivityComment, strActivityDueDate, strOwner);}} catch(Exception ex){ return false;}
        */return true;
    }

    /* Add Activity Task in Contact or Lead */    
   /* public static boolean createTask(Id WhoID, String strActivity, String  strActivityComment, String strActivityDueDate, String ownerID) {
        try {
            if(strActivity != null && strActivity != '') {
                Task tsk = new Task();
                tsk.WhoID =  WhoID; //Contact ID
                tsk.Subject = strActivity; //Task ID
                tsk.Status = 'Not Started';
                tsk.Description = strActivityComment;
                tsk.Priority = 'High';
                tsk.OwnerId = ownerID;
                
                //Due Date
                if(strActivityDueDate != null) {
                    Datetime dt1 = DateTime.parse(strActivityDueDate + ' 00:00 AM');
                    tsk.ActivityDate = dt1.date(); } else { tsk.ActivityDate = datetime.now().date() + 2; }
                
                //Set Reminder Date
                tsk.put('ReminderDateTime', DateTime.valueOf(tsk.ActivityDate + ' 00:00:00'));
                tsk.put('isReminderSet', true);
                insert tsk; } return true;
        } catch(Exception ex){ return false;}
}*/
    
}