public with sharing virtual class MindMatrixAuthenticator extends MindMatrixAuthHelper {
    public static string AuthenticateMMUser(Boolean createuserviasso,Boolean shownavigation){
        
        if (!Schema.SObjectType.User.isAccessible()&& !Schema.SObjectType.User.fields.Email.isAccessible()&& !Schema.SObjectType.User.fields.ProfileId.isAccessible()&&!Schema.SObjectType.User.fields.Username.isAccessible()&&!Schema.SObjectType.contact.fields.Email.isAccessible()&&!Schema.SObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__SSOUserLastLoginDate__c.isCreateable()&&!Schema.SObjectType.MindMatrix__AMPAPIDetailsV2__c.fields.MindMatrix__SSOUserLastLoginDate__c.isUpdateable()){
            return '';
        }
        try
        {
            string query = null;
            Boolean newLogin = false;
            //Getting User Info
            String userName = UserInfo.getUserName();
            user userdetails = [select id,email,Contact.Id,Account.Id from user where Username = : userName  limit 1];
            MindMatrixMiscHelper.versiondata userGroupSettingVersion = versionDataParsing();

            boolean usingNewUserGroupSetting = userGroupSettingVersion != null;

            if(usingNewUserGroupSetting){
               if(!String.isBlank(userdetails.contact.Id) && !String.isBlank(userdetails.Account.Id))
                	query =String.escapeSingleQuotes('Select Id,Email,Profile.Id,'+userGroupSettingVersion.objectName+'.'+userGroupSettingVersion.fieldName+',LastModifiedDate,LastLoginDate, Account.Id, Account.LastModifiedDate, Contact.Email, Contact.Id, Contact.LastModifiedDate,userrole.Id From User where Username = : userName  limit 1');
                else{
                    if(!String.isBlank(userGroupSettingVersion.crmobjectName) && !String.isBlank(userGroupSettingVersion.crmfieldName))
                  		query =String.escapeSingleQuotes('Select Id,Email,Profile.Id,'+userGroupSettingVersion.crmobjectName+'.'+userGroupSettingVersion.crmfieldName+',LastModifiedDate,LastLoginDate, Account.Id, Account.LastModifiedDate, Contact.Email, Contact.Id, Contact.LastModifiedDate,userrole.Id From User where Username = : userName  limit 1');
                    else
                      	query ='Select Id,Email,Profile.Id,LastModifiedDate, Account.Id, Account.LastModifiedDate,LastLoginDate, Contact.Email, Contact.Id, Contact.LastModifiedDate,userrole.Id From User where Username = : userName  limit 1';  
                }
            }
            else
                query ='Select Id,Email,Profile.Id,LastModifiedDate, Account.Id, Account.LastModifiedDate,LastLoginDate, Contact.Email, Contact.Id, Contact.LastModifiedDate,userrole.Id From User where Username = : userName  limit 1';                    
        
            User activeUser = Database.query(query);
            string getGroupName='';
            Boolean getremovedPreviousUserGroup =false;
            
            String crmId = activeUser.Id;
            String profileId = activeUser.ProfileId;
          
            String customSettingRecordId = AMPViewAssetSearchController.GetAMPAPIDetailsV2_OWD_ID();
            if(customSettingRecordId == null)
				customSettingRecordId='';
          
            //sso user last login date
			if(GetLastLoginDateForSSOUser() == null || GetLastLoginDateForSSOUser() < activeUser.LastLoginDate)
                newLogin = true;
          
            //Generating JSON for Payload
            JSONGenerator gen = JSON.createGenerator(true);
            gen.writeStartObject();
            
            //User details
            gen.writeStringField('crmuserid', crmId);
            gen.writeStringField('crmuseremail', activeUser.Email);
            
            gen.writeDateTimeField('userlastmodifieddate',activeUser.LastModifiedDate);
            gen.writeBooleanField('createuserviasso', createuserviasso);
            
            //Contact details
            if(activeUser.Contact != null){
                gen.writeStringField('crmcontactid', activeUser.Contact.Id);
                gen.writeStringField('crmcontactemail', activeUser.Contact.Email);
                gen.writeDateTimeField('contactlastmodifieddate',activeUser.Contact.LastModifiedDate);
            }
            
            //Account details
            if(activeUser.Account != null){
                gen.writeStringField('crmaccountid', activeUser.Account.Id);
                gen.writeDateTimeField('accountlastmodifieddate',activeUser.Account.LastModifiedDate);
                
            }
            gen.writeBooleanField('newlogin', newLogin);
            gen.writeBooleanField('shownavigation', shownavigation);
            
            // newly added code for ESET client if they don't want to give "view all custom setting" permission.this code have to remove when we submit for securityreview
            string getOrgInstallName= GetOrgInstallName() != '' ? GetOrgInstallName() : GetPublicOrgInstallName();
            string getOrgToken = GetOrgToken() != '' ? GetOrgToken() : GetPublicOrgToken();
            
            //Getting authenticated information from MM
            
            //String url = GetOrgInstallName()+'api/AuthenticateSFUser';
            String url = getOrgInstallName+'api/AuthenticateSFUser';
            
            if(!String.isBlank(activeUser.Contact.Id)  && !String.isBlank(activeUser.Account.Id) && usingNewUserGroupSetting){
                getGroupName = AMPSettings.GetUserGroupNameForVersioningUser(activeUser, userGroupSettingVersion);
                getremovedPreviousUserGroup = AMPSettings.getRemovedPrevioususergroupcheckboxvalue(userGroupSettingVersion);
            }else{
                getGroupName = AMPSettings.GetUserGroupNameForVersioningCrmUser(activeUser, userGroupSettingVersion);
                getremovedPreviousUserGroup = AMPSettings.getRemovedPrevioususergroupCrmcheckboxvalue(userGroupSettingVersion);
            }
            String GroupName = usingNewUserGroupSetting ? getGroupName :  AMPSettings.GetUserGroupNameForNonVersioningUser(profileId);
            boolean removedPreviousUserGroup = getremovedPreviousUserGroup;
            
            if(removedPreviousUserGroup == null)
                removedPreviousUserGroup = false;

            list<ContentDocumentLink> cdl = [SELECT systemModstamp FROM ContentDocumentLink WHERE LinkedEntityId =: customSettingRecordId ORDER BY systemModstamp DESC LIMIT 1];
            
            gen.writeStringField('groupname', GroupName);
            gen.writeBooleanField('removedprevioususergroup', removedPreviousUserGroup);
          
            //file details
            if(cdl.size() > 0){
                gen.writeDateTimeField('filelastmodifieddate',cdl[0].systemModstamp);
            }
            
            gen.writeEndObject();
            String jsonS = gen.getAsString();
            String response= AMPGetWebServiceResponse.PostDataJSONResponse(url,jsonS,getOrgToken);
           
            AMPGetWebServiceResponse.AuthenicateResult parseobject= (AMPGetWebServiceResponse.AuthenicateResult) System.JSON.deserialize(response, AMPGetWebServiceResponse.AuthenicateResult.class);
            //Getting the sessionId from the MM response and creating JWT Token
            parseobject.result.usersessionid = MindMatrixJWTHelper.GenerateELTandELN();
            if(newLogin){
                MindMatrix__AMPAPIDetailsV2__c api = MindMatrix__AMPAPIDetailsV2__c.getInstance();
                api.MindMatrix__SSOUserLastLoginDate__c = activeUser.LastLoginDate;
                upsert api;
            }
            return JSON.serialize(parseobject);
            
        }
        catch(Exception ex)
        {
            return ex.getMessage();
        }
    }
    
    public static Boolean UpdateTokenExtended(string token)
    {
        return UpdateUserToken(token);
    }
    public static MindMatrixMiscHelper.versiondata versionDataParsing()
    {
        try{
            
            Id owdSettingId = AMPViewAssetSearchController.GetAMPAPIDetailsV2_OWD_ID();
            if(owdSettingId == null)
                return null;
            
            List<ContentDocumentLink> cdls = [SELECT Id, ContentDocumentId 
                                              FROM ContentDocumentLink WHERE LinkedEntityId = :owdSettingId ORDER BY systemModstamp DESC LIMIT 1];
            
            ContentDocumentLink cdl = cdls.size() == 0 ? null : cdls[0];
            if(cdl == null)
                return null;
            
            ContentVersion cv = [SELECT Id, VersionData FROM ContentVersion WHERE ContentDocumentId =: cdl.ContentDocumentId];
            
            if(cv == null)
                return null;
            blob versionData = cv.VersionData;
            if(versionData == null)
                return null;
            
            String versionDataStringify = versionData.toString();
            
            MindMatrixMiscHelper.versiondata parseResult = (MindMatrixMiscHelper.versiondata) System.JSON.deserialize(versionDataStringify, MindMatrixMiscHelper.versiondata.class);
            return parseResult;
            
        }
        catch(Exception ex){
            return null;
        }
    }
}