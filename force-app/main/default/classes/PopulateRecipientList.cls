//We are not using this Class any more in the package

public with sharing class PopulateRecipientList {
    
  //  public static void populatelist() {
        //try {
        //    List<SelectOption> rloptions = AMPGetRecipientList.GetUserRecipientList(false);
        //    String item = '', items = '';
        //    Id SFUserID = UserInfo.getUserId();//Logged-in UserID
        //    
        //    if(rloptions.size() > 0) {
        //        //Check if it is changed
        //        for(Integer i=0; i<=rloptions.size()-1; i++) {
        //        List<AMP_Recipient_List__c> objList = new List<AMP_Recipient_List__c>();
        //            AMP_Recipient_List__c objRList = new AMP_Recipient_List__c();
        //            objList = [SELECT Id, Name, AMP_List_Key__c FROM AMP_Recipient_List__c WHERE (OwnerId =: SFUserID AND AMP_List_Key__c =: rloptions.get(i).getValue()) LIMIT 1];
        //            if(objList.size() != 0) {
        //                for(AMP_Recipient_List__c objRList1 : objList) {
        //                    if (!Schema.sObjectType.AMP_Recipient_List__c.fields.Name.isUpdateable()) {
        //                        ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR,'Error: Insufficient Access'));
        //                    }
        //                    objRList1.Name = rloptions.get(i).getLabel();
        //                    if (!Schema.sObjectType.AMP_Recipient_List__c.fields.AMP_List_Key__c.isUpdateable()) {
        //                        ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR,'Error: Insufficient Access'));
        //                    }
        //                    objRList1.AMP_List_Key__c = rloptions.get(i).getValue();
        //                    if( Schema.sObjectType.AMP_Recipient_List__c.fields.Name.isUpdateable()&&Schema.sObjectType.AMP_Recipient_List__c.fields.AMP_List_Key__c.isUpdateable())
        //                    update objRList1;
        //                    else
        //                    ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR,'Error: Insufficient Access'));
        //                        
        //                }
        //            } 
        //            else 
        //            {
        //                //Insert default value to store contacts and leads from AMP
        //                if(i == 0) {
        //                    CreateDefaultListItem('AMP Contacts', '0', SFUserID);
        //                }
        //                
        //                CreateDefaultListItem(rloptions.get(i).getLabel(), rloptions.get(i).getValue(), SFUserID);
        //            }
        //        }
        //    }
        //} catch(Exception ex) {
        //}
    
    
   // public static string CreateDefaultListItem(String strLabel, String strValue, Id SFUserID) {
        ////Insert default value to store contacts and leads from AMP
        //AMP_Recipient_List__c objRList = new AMP_Recipient_List__c();
        //if (!Schema.sObjectType.AMP_Recipient_List__c.fields.Name.isCreateable()) {
        //    ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR,'Error: Insufficient Access'));
        //	return null;
		//}
        //objRList.Name = strLabel;
        //if (!Schema.sObjectType.AMP_Recipient_List__c.fields.AMP_List_Key__c.isCreateable()) {
        //    ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR,'Error: Insufficient Access'));
        //	return null;
		//}
        //objRList.AMP_List_Key__c = strValue;
        // if (!Schema.sObjectType.AMP_Recipient_List__c.fields.OwnerId.isCreateable()) {
        //    ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR,'Error: Insufficient Access'));
        //	return null;
		//}
        //objRList.OwnerId = SFUserID;
        //if( Schema.sObjectType.AMP_Recipient_List__c.fields.Name.isCreateable()&&Schema.sObjectType.AMP_Recipient_List__c.fields.AMP_List_Key__c.isCreateable()&&
        //   Schema.sObjectType.AMP_Recipient_List__c.fields.OwnerId.isCreateable()){
        //       insert objRList;
        //       return objRList.AMP_List_Key__c;
        //   }else{
        //       ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR,'Error: Insufficient Access'));
        //	   return null;
        //   }
		//return '';
   // }
    
    
   // public static string GetContactListID(Id contactID) {
        //if(!Schema.sObjectType.Contact.fields.Id.isAccessible())
        //{
        //    return null;
        //} 
        //  if(!Schema.sObjectType.Contact.fields.Name.isAccessible())
        //{
        //    return null;
        //}
        //if(!Schema.sObjectType.Contact.fields.Recipient_List__c.isAccessible())
        //{
        //    return null;
        //} 
        //String listID = '';
        //Id SFUserID = UserInfo.getUserId();//Logged-in UserID
        //Contact cont = [SELECT Contact.Id, Contact.Name, Recipient_List__c FROM Contact WHERE Id =: contactID];
		//
        //if(cont != null) {
        //    List<AMP_Recipient_List__c> objList = new List<AMP_Recipient_List__c>();
        //    objList = [SELECT Id, Name, AMP_List_Key__c FROM AMP_Recipient_List__c WHERE OwnerId =: SFUserID AND Id =: cont.Recipient_List__c LIMIT 1];
        //    if(objList.size() > 0) {
        //        listID = objList[0].AMP_List_Key__c;
        //    } else {listID ='';}
        //}
        //return listID;
		//return '';
    //}
    
    //public static string GetLeadListID(Id leadID) {
        //String listID = '';
        //Id SFUserID = UserInfo.getUserId();//Logged-in UserID
        //Lead ld = [SELECT Lead.Id, Lead.Name, Recipient_List__c FROM Lead WHERE Id =: leadID];
		//
        //if(ld != null) {
        //    List<AMP_Recipient_List__c> objList = new List<AMP_Recipient_List__c>();
        //    objList = [SELECT Id, Name, AMP_List_Key__c FROM AMP_Recipient_List__c WHERE OwnerId =: SFUserID AND Id =: ld.Recipient_List__c LIMIT 1];
        //    if(objList.size() > 0) {
        //        listID = objList[0].AMP_List_Key__c;
        //    } else {listID ='';}
        //}
       // return listID;
    //}
}