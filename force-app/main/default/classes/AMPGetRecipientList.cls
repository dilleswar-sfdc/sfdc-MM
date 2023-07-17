/*
  GET Recipient List from AMP
 */

Public Class AMPGetRecipientList {
    Public static String listId {get;set;}
    Public static String listName {get;set;}
    
    Public Static List<SelectOption> GetUserRecipientList(boolean showDefaultValue) {
        try {
            List<selectoption> options = new List<selectoption>();
            String ampUrl;
            //String listId='', listName='';
            // Get Recipient List
            AMPUserAccDetail lstUserinfo = new AMPUserAccDetail();
            List<AMPUserDetails__c> lstUser = lstUserinfo.getAMPUserDetail();
            if(lstUser.size() > 0) {
                //ampUrl = lstUser[0].AMPUrl__c + 'public/mobile.ashx?method=getlists&id='+ lstUser[0].AMPID__c +'&key=' + lstUser[0].AccessToken__c;
                JSONParser parser = AMPGetWebServiceResponse.GetJSONResponse(ampUrl);
                if(showDefaultValue)
                    options.add(new selectOption('', 'Not Applicable'));
                    
                while (parser.nextToken() != null) {
                    if (parser.getCurrentToken() == JSONToken.FIELD_NAME){
                        if(parser.getText() == 'id') {                          
                            parser.nextToken(); listId = parser.getText();  parser.nextValue(); parser.nextValue(); parser.nextValue();
                            //distributionid -- publickey -- distributionid
                            // Get the list name
                            listName = parser.getText();  options.add(new selectOption(listId, listName));
                        }
                    }
                }
            }
            return options; } catch(Exception ex) {  return null;
        }
    }
}