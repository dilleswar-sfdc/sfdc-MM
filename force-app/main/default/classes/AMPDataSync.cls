global with sharing class AMPDataSync {

   //Get Lead data
    WebService static Lead getLeadDataByEmail(string Id) {
        Lead lead;
        /*  if(!Schema.sObjectType.Lead.fields.Id.isAccessible()&&!Schema.sObjectType.Lead.fields.Email.isAccessible()&&!Schema.sObjectType.Lead.fields.FirstName.isAccessible()&&!Schema.sObjectType.Lead.fields.LastName.isAccessible()&&!Schema.sObjectType.Lead.fields.Title.isAccessible()&&!Schema.sObjectType.Lead.fields.Industry.isAccessible()&&!Schema.sObjectType.Lead.fields.Phone.isAccessible()&&!Schema.sObjectType.Lead.fields.MobilePhone.isAccessible()&&!Schema.sObjectType.Lead.fields.Fax.isAccessible()&&!Schema.sObjectType.Lead.fields.LeadSource.isAccessible()&&!Schema.sObjectType.Lead.fields.Street.isAccessible()&&!Schema.sObjectType.Lead.fields.City.isAccessible()&&!Schema.sObjectType.Lead.fields.State.isAccessible()&&!Schema.sObjectType.Lead.fields.PostalCode.isAccessible()&&!Schema.sObjectType.Lead.fields.Country.isAccessible()&&!Schema.sObjectType.Lead.fields.Company.isAccessible())
       			return null;
 
        
        Set<Id> ids = new Set<Id>();
        for (Id i : Id.split(',')) 
              ids.add(i);
        AMPUpdateLeadFromPortalUser.updateLeads(ids, '');
        Lead lead = [SELECT Id, FirstName, LastName, Email, Title, Company, Phone, MobilePhone, Fax, LeadSource, Street, City, State, PostalCode, Country, Industry FROM Lead LIMIT 1];*/
        return lead;
    }
  
    //Get Cantact data
    WebService static Contact getContactDataByEmail(string Id) {
        Contact cont;
       /*  if(!Schema.sObjectType.Contact.fields.Email.isAccessible()&&!Schema.sObjectType.Contact.fields.FirstName.isAccessible()&&!Schema.sObjectType.Contact.fields.LastName.isAccessible()&&!Schema.sObjectType.Contact.fields.Title.isAccessible()&&!Schema.sObjectType.Contact.fields.Phone.isAccessible()&&!Schema.sObjectType.Contact.fields.MobilePhone.isAccessible()&&!Schema.sObjectType.Contact.fields.Fax.isAccessible()&&!Schema.sObjectType.Contact.fields.LeadSource.isAccessible()&&!Schema.sObjectType.Contact.fields.MailingStreet.isAccessible()&&!Schema.sObjectType.Contact.fields.MailingCity.isAccessible()&&!Schema.sObjectType.Contact.fields.MailingState.isAccessible()&&!Schema.sObjectType.Contact.fields.MailingPostalCode.isAccessible()&&!Schema.sObjectType.Contact.fields.MailingCountry.isAccessible()&&!Schema.sObjectType.Account.fields.Industry.isAccessible()&&!Schema.sObjectType.Account.fields.Type.isAccessible())
       			return null;
          Set<Id> ids = new Set<Id>();
         for (Id i : Id.split(',')) 
              ids.add(i);
       AMPUpdateContactFromPortalUser.updateContacts(ids, '');
       Contact cont = [ SELECT FirstName, LastName, Title, Phone, MobilePhone, Fax, LeadSource, MailingStreet, MailingCity, MailingState, MailingPostalCode, MailingCountry, Account.Type, Account.Industry FROM Contact LIMIT 1];*/
        return cont;
    }
   
    //Get Custom Object Data
    WebService static Boolean syncCObjectData(string cObjectName, string linkID, string email, string source, string recordIDs) {
        /*Set<Id> ids = new Set<Id>();
        for (Id i : recordIDs.split(',')) 
            ids.add(i);
        if(email != '')
            AMPUpdateCObjectData.syncData(cObjectName, linkID, email, source, ids);
        else
            return false;*/
        return true;
    }
    
    //Get Account List
    WebService static List<Account> getAccountList() {
        //List<Account> lstAcc;
        List<Account> lstAcc = [SELECT AccountNumber, Name FROM Account WITH SECURITY_ENFORCED ];
        return lstAcc;
    }
    
    //Update/Insert Contact details
    WebService static Boolean upsertContactData(string cEmail, string cFirstName, String cLastName, String cTitle, String cPhoneNo, String cMobileNo, String cFaxNo, String cLeadSource, string AccountName, String cMailingStreet, String cMailingCity, String cMailingState, String cMailingPostalCode, String cMailingCountry, String cInterestLevel, String cContactType, String cIndustryType) {
        /*if ((!Schema.sObjectType.Contact.fields.FirstName.isAccessible()&&!Schema.sObjectType.Contact.fields.FirstName.isCreateable()&&!Schema.sObjectType.Contact.fields.FirstName.isUpdateable())&&(!Schema.sObjectType.Contact.fields.LastName.isAccessible()&&!Schema.sObjectType.Contact.fields.LastName.isCreateable()&&!Schema.sObjectType.Contact.fields.LastName.isUpdateable())&&(!Schema.sObjectType.Contact.fields.Title.isAccessible()&&!Schema.sObjectType.Contact.fields.Title.isCreateable()&&!Schema.sObjectType.Contact.fields.Title.isUpdateable())&&(!Schema.sObjectType.Contact.fields.Phone.isAccessible()&&!Schema.sObjectType.Contact.fields.Phone.isCreateable()&&!Schema.sObjectType.Contact.fields.Phone.isUpdateable())&&(!Schema.sObjectType.Contact.fields.MobilePhone.isAccessible()&&!Schema.sObjectType.Contact.fields.MobilePhone.isCreateable()&&!Schema.sObjectType.Contact.fields.MobilePhone.isUpdateable())&&(!Schema.sObjectType.Contact.fields.Fax.isAccessible()&&!Schema.sObjectType.Contact.fields.Fax.isCreateable()&&!Schema.sObjectType.Contact.fields.Fax.isUpdateable())&&(!Schema.sObjectType.Account.fields.Type.isAccessible()&&!Schema.sObjectType.Account.fields.Type.isCreateable()&&!Schema.sObjectType.Account.fields.Type.isUpdateable())&&(!Schema.sObjectType.Contact.fields.MailingStreet.isAccessible()&&!Schema.sObjectType.Contact.fields.MailingStreet.isCreateable()&&!Schema.sObjectType.Contact.fields.MailingStreet.isUpdateable())&&(!Schema.sObjectType.Contact.fields.MailingCity.isAccessible()&&!Schema.sObjectType.Contact.fields.MailingCity.isCreateable()&&!Schema.sObjectType.Contact.fields.MailingCity.isUpdateable())&&(!Schema.sObjectType.Contact.fields.MailingState.isAccessible()&&!Schema.sObjectType.Contact.fields.MailingState.isCreateable()&&!Schema.sObjectType.Contact.fields.MailingState.isUpdateable())&&(!Schema.sObjectType.Contact.fields.MailingPostalCode.isAccessible()&&!Schema.sObjectType.Contact.fields.MailingPostalCode.isCreateable()&&!Schema.sObjectType.Contact.fields.MailingPostalCode.isUpdateable())&&(!Schema.sObjectType.Contact.fields.MailingCountry.isAccessible()&&!Schema.sObjectType.Contact.fields.MailingCountry.isCreateable()&&!Schema.sObjectType.Contact.fields.MailingCountry.isUpdateable())&&(!Schema.sObjectType.Contact.fields.Interest_Level__c.isAccessible()&&!Schema.sObjectType.Contact.fields.Interest_Level__c.isCreateable()&&!Schema.sObjectType.Contact.fields.Interest_Level__c.isUpdateable())&&(!Schema.sObjectType.Account.fields.Industry.isAccessible()&&!Schema.sObjectType.Account.fields.Industry.isCreateable()&&!Schema.sObjectType.Account.fields.Industry.isUpdateable()))
          return null;
        try {
            Id accId;
            List<Account> listAcc = [SELECT Id, Name FROM Account WHERE Name LIKE  : '%'+ AccountName +'%' LIMIT 1];
           
            if(listAcc.size() == 0) { //add new account
                //Create new account
                Account acc = new Account();
                acc.Name = AccountName;
                insert acc;
                accId = acc.id;
            } else {
                accId = listAcc[0].id;
            }
            List<Contact> listCont = [SELECT FirstName, LastName, Title, Phone, MobilePhone, Fax, LeadSource, MailingStreet, MailingCity, MailingState, MailingPostalCode, MailingCountry,Interest_Level__c, Account.Type, Account.Industry FROM Contact WHERE Email =: cEmail LIMIT 1];
            
            if(listCont.size() != 0) {
                for(Contact cont : listCont ) {
                   
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
                    cont.MindMatrix__Interest_Level__c = cInterestLevel;
                    cont.AccountId = accId;
                    update cont;
                }        
            }
            return true;} catch (Exception ex){return false;}*/
        return true;//added by dilleswar
    }
    
    //Update/Insert Lead details
    WebService static Boolean upsertLeadData(string lEmail, string lFirstName, String lLastName, String lTitle, String lPhoneNo, String lMobileNo, String lFaxNo, String lLeadSource, String lCompany, String lStreet, String lCity, String lState, String lPostalCode, String lCountry, String lInterestLevel, String lContactType, String lIndustryType) {
        /*if (!Schema.sObjectType.Lead.fields.FirstName.isAccessible()&&!Schema.sObjectType.Lead.fields.FirstName.isCreateable()&&!Schema.sObjectType.Lead.fields.FirstName.isUpdateable()&&!Schema.sObjectType.Lead.fields.LastName.isAccessible()&&!Schema.sObjectType.Lead.fields.LastName.isCreateable()&&!Schema.sObjectType.Lead.fields.LastName.isUpdateable()&&!Schema.sObjectType.Lead.fields.Title.isAccessible()&&!Schema.sObjectType.Lead.fields.Title.isCreateable()&&!Schema.sObjectType.Lead.fields.Title.isUpdateable()&&!Schema.sObjectType.Lead.fields.Phone.isAccessible()&&!Schema.sObjectType.Lead.fields.Phone.isCreateable()&&!Schema.sObjectType.Lead.fields.Phone.isUpdateable()&&!Schema.sObjectType.Lead.fields.MobilePhone.isAccessible()&&!Schema.sObjectType.Lead.fields.MobilePhone.isCreateable()&&!Schema.sObjectType.Lead.fields.MobilePhone.isUpdateable()&&!Schema.sObjectType.Lead.fields.Fax.isAccessible()&&!Schema.sObjectType.Lead.fields.Fax.isCreateable()&&!Schema.sObjectType.Lead.fields.Fax.isUpdateable()&&!Schema.sObjectType.Lead.fields.LeadSource.isAccessible()&&!Schema.sObjectType.Lead.fields.LeadSource.isCreateable()&&!Schema.sObjectType.Lead.fields.LeadSource.isUpdateable()&&!Schema.sObjectType.Lead.fields.Street.isAccessible()&&!Schema.sObjectType.Lead.fields.Street.isCreateable()&&!Schema.sObjectType.Lead.fields.Street.isUpdateable()&&!Schema.sObjectType.Lead.fields.City.isAccessible()&&!Schema.sObjectType.Lead.fields.City.isCreateable()&&!Schema.sObjectType.Lead.fields.City.isUpdateable()&&!Schema.sObjectType.Lead.fields.State.isAccessible()&&!Schema.sObjectType.Lead.fields.State.isCreateable()&&!Schema.sObjectType.Lead.fields.State.isUpdateable()&&!Schema.sObjectType.Lead.fields.PostalCode.isAccessible()&&!Schema.sObjectType.Lead.fields.PostalCode.isCreateable()&&!Schema.sObjectType.Lead.fields.PostalCode.isUpdateable()&&!Schema.sObjectType.Lead.fields.Country.isAccessible()&&!Schema.sObjectType.Lead.fields.country.isCreateable()&&!Schema.sObjectType.Lead.fields.Country.isUpdateable()&&!Schema.sObjectType.Lead.fields.Interest_Level__c.isAccessible()&&!Schema.sObjectType.Lead.fields.Interest_Level__c.isCreateable()&&!Schema.sObjectType.Lead.fields.Interest_Level__c.isUpdateable()&&!Schema.sObjectType.Lead.fields.Industry.isAccessible()&&!Schema.sObjectType.Lead.fields.Industry.isCreateable()&&!Schema.sObjectType.Lead.fields.Industry.isUpdateable())
          return null;
        try {
            List<Lead> listLead = [SELECT FirstName, LastName, Title, Phone, MobilePhone, Fax, LeadSource, Street, City, State, PostalCode, Country, Interest_Level__c, Industry FROM Lead WHERE Email =: lEmail LIMIT 1];

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
                insert ld;
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
                    update ld;
                }        
            }
        return true;} catch(Exception ex) {return false;}*/
	return true;//added by dilleswar
    }
    
     //Update/Insert Lead details
    WebService static Boolean syncAMPContacts(string aEmail, string aFirstName, String aLastName, String aTitle, String aPhoneNo, String aMobileNo, String aFaxNo, String aLeadSource, String aCompany, String aStreet, String aCity, String aState, String aPostalCode, String aCountry, String aInterestLevel, String aContactType, String aIndustryType) {
        /*try {
            Boolean status = false;
            //If Lead does not exists; insert new one or update one
            status = upsertLeadData(aEmail, aFirstName, aLastName, aTitle, aPhoneNo, aMobileNo, aFaxNo, aLeadSource, aCompany, aStreet, aCity, aState, aPostalCode, aCountry, aInterestLevel, aContactType, aIndustryType);
            status = upsertContactData(aEmail, aFirstName, aLastName, aTitle, aPhoneNo, aMobileNo, aFaxNo, aLeadSource, aCompany, aStreet, aCity, aState, aPostalCode, aCountry, aInterestLevel, aContactType, aIndustryType);
            
        return status;} catch(Exception ex) {return false;}*/
		return true;
    }
}