/**
 * @File Name          : AccountContactsController.cls
 * @Description        : 
 * @Author             : ChangeMeIn@UserSettingsUnder.SFDoc
 * @Group              : 
 * @Last Modified By   : ChangeMeIn@UserSettingsUnder.SFDoc
 * @Last Modified On   : 6/10/2019, 2:08:32 PM
 * @Modification Log   : 
 *==============================================================================
 * Ver         Date                     Author                    Modification
 *==============================================================================
 * 1.0    6/10/2019, 2:08:32 PM   ChangeMeIn@UserSettingsUnder.SFDoc     Initial Version
**/
public with sharing class AccountContactsController {
    
    // dropdownlist options list
   /* List<selectoption> options = new List<selectoption>();
    List<selectoption> rloptions = new List<selectoption>();
   
    public boolean getRendered()
    {
        Boolean render = (searchResults == null || searchResults.size() == 0 ? false : true);
        return render;
    }
    
    //Recipient list id
    public String listID{get; set;}
    
    public Integer seq{
        get {
            if(ApexPages.currentPage().getParameters().get('id') != null)
                seq = 0;//account contacts
            else if(ApexPages.currentPage().getParameters().get('cids') != null) 
                seq = 1;//contacts
            else if(ApexPages.currentPage().getParameters().get('lids') != null) 
                seq = 2;//leads
            else
                seq = 0;
        return seq;
        }
        set;
    }   
    
    // the account ids
    public Id accID {
        get {
            if(accID == null) {
                    if(ApexPages.currentPage().getParameters().get('id') != null)
                        accID = ApexPages.currentPage().getParameters().get('id');
                    else if(ApexPages.currentPage().getParameters().get('cids') != null)
                        accID = ApexPages.currentPage().getParameters().get('cids');
                    else if(ApexPages.currentPage().getParameters().get('lids') != null)
                        accID = ApexPages.currentPage().getParameters().get('lids');
                    else {
                          
                     
                        List<Account> accounts = [SELECT Id, Name FROM Account WITH SECURITY_ENFORCED Limit 1];
                        if(accounts.size() > 0) {
                            accID = accounts.get(0).id;
                        }
                     
                    }
                }
            return accID;
        }
        set;
    }

    // the results from the search. do not init the results or a blank rows show up initially on page load
    public List<AMPContactWrapper> searchResults {get;set;}
    // the contacts that were checked/selected.
    public List<AMPContactWrapper> selectedContacts {
        get {
            if (selectedContacts == null) selectedContacts = new List<AMPContactWrapper>();
            return selectedContacts;
        }
        set;
    }      
  
    // constructor
    public AccountContactsController() {}
 
    // fired when the search button is clicked
    public PageReference search() {
        
        try {
            if(seq == 0) {
                if (searchResults == null) {
                    searchResults = new List<AMPContactWrapper>(); // init the list if it is null
                } else {
                    searchResults.clear(); // clear out the current results if they exist
                }
         
                // dynamic soql for fun
                String qry = 'SELECT ID, FirstName, LastName, Phone, Email, Title, AccountID FROM Contact WHERE (IsDeleted = false AND AccountID = :accID) ORDER BY LastName';
    
                // may need to modify for governor limits??
                for(Contact c : Database.query(qry)) {
                    // create a new wrapper by passing it the contact in the constructor
                    AMPContactWrapper cw = new AMPContactWrapper(c);
                    // add the wrapper to the results
                    searchResults.add(cw);
                }
            } else if(seq == 1) {//contacts 
                    String[] cIds = EncodingUtil.urlDecode(ApexPages.currentPage().getParameters().get('cids'), 'UTF-8').split(',');
                    if(cIds.size() > 0) { 
                        for (String Id : cIds) {
                            //Insert/Update contacts in AMP with respetive list id
                              string result = AMPUpdateContactFromPortalUser.manageContacts(Id, '');
                        }  
                        
                            ApexPages.addMessage(new ApexPages.message(ApexPages.severity.CONFIRM, cIds.size() + ' contact(s) successfully synced with AMP!'));
                  
                  }
            } else if(seq == 2) {//leads
                    String[] lIds = EncodingUtil.urlDecode(ApexPages.currentPage().getParameters().get('lids'), 'UTF-8').split(',');
                    if(lIds.size() > 0) { 
                        for (String Id : lIds) {
                            //Insert/Update leads in AMP with respetive list id
                            string result = AMPUpdateLeadFromPortalUser.manageLeads(Id, '');
                        }                                    
                    ApexPages.addMessage(new ApexPages.message(ApexPages.severity.CONFIRM,lIds.size()+' lead(s) successfully synced with AMPdili!'));
                }
            }
        }
        catch(Exception ex) {
        }
        return null;
    }   
    
    // updates contact with AMP contact database
    public PageReference SyncContacts() {
         // clear out the currently selected categories
        selectedContacts.clear();
 
        // add the selected categories to a new List
        for (AMPContactWrapper cw : searchResults) {
            if (cw.checked) {
                //Insert/Update contacts in AMP with respetive list id
                string result = AMPUpdateContactFromPortalUser.manageContacts(cw.cont.id, listID);
                //Add processed contacts in list collection
                selectedContacts.add(new AMPContactWrapper(cw.cont));
            }
        }
 
        // ensure they selected at least one contact or show an error message.
        if (selectedContacts.size() > 0)
            ApexPages.addMessage(new ApexPages.message(ApexPages.severity.CONFIRM,'Contact(s) successfully synced with AMP!'));
        else
            ApexPages.addMessage(new ApexPages.message(ApexPages.severity.WARNING,'Please select at least one contact.'));
        return null;
    }    
    
    // Get all account
    public List<SelectOption> getValues(){
         

        options.clear();
        for(Account acc:[SELECT Id, Name FROM Account WITH SECURITY_ENFORCED]){
          options.add(new selectOption(acc.Id,acc.Name));
        }
        return options;
    }
    
    // Get users recipient list
    public List<SelectOption> getListValues(){
        rloptions.clear();
        rloptions = AMPGetRecipientList.GetUserRecipientList(true);
        return rloptions;
    }
 
    // fired when the back button is clicked
    public PageReference Back() {
        return Page.AMPSFContactSync;
    }    */     
}