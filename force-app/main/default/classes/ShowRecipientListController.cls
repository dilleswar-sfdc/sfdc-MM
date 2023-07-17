public with sharing class ShowRecipientListController {

    public ShowRecipientListController(ApexPages.StandardController controller) {

    }
 
    public List<AMP_Recipient_List__c> rlist {get;set;}
    public string hostURL {get;set;}
    public boolean getRendered()
    {
        Boolean render = true;
        return render;
    }
    
    // fired when the search button is clicked
    public PageReference search() {
        if(!Schema.sObjectType.AMP_Recipient_List__c.isAccessible()&&!Schema.sObjectType.AMP_Recipient_List__c.fields.ID.isAccessible()&&!Schema.sObjectType.AMP_Recipient_List__c.fields.Name.isAccessible()&&!Schema.sObjectType.AMP_Recipient_List__c.fields.AMP_List_Key__c.isAccessible()&&!Schema.sObjectType.AMP_Recipient_List__c.fields.OwnerID.isAccessible())
        {
            return null;
        } 
          
        try {
            hostURL = 'https://'+ApexPages.currentPage().getHeaders().get('Host');
            Id SFUserID = UserInfo.getUserId();//Logged-in UserID
            rlist = [SELECT ID, Name, AMP_List_Key__c FROM AMP_Recipient_List__c WHERE (OwnerID =: SFUserID) Order By Name LIMIT 100];
            if(rlist.size() == 0) rlist = null; }  catch(Exception ex) {
        }
        return null;
    }   
}