@isTest
public class AMPViewAssetControllerTest {
	static testMethod void testAMPInteractiveBannerController() 
    {
       
        testGetPersonaThemeForCurrentUser();
        testAuthenticateSFUser(true);
        testgetAssetSearchForConfig('text','1212','1','343');
        testgetCreateTemporaryMedia(1,'dfdf','dfdfdf');
        getUpdateToken('dfdf');
        testgetAssetTab();
        testsfGetAssetSearchForConfigTemplate();
        testsfGetTabCount();
        
    }
   
    
    public static string testGetPersonaThemeForCurrentUser()
    {
        return AMPViewAssetController.GetPersonaThemeForCurrentUser();
    }
    
    public static string testAuthenticateSFUser(Boolean createuserviasso)
    {
        return AMPViewAssetController.AuthenticateSFUser(createuserviasso);
    }
    
    public static string testgetAssetSearchForConfig(string searchtext,string userid,string iscount,string tabname)
    {
        return AMPViewAssetController.getAssetSearchForConfig(searchtext, userid, iscount, tabname);
    }
    public static string testgetCreateTemporaryMedia(Integer templateid,String templatename,String userid) {
        return AMPViewAssetController.getCreateTemporaryMedia(templateid,templatename,userid);
    }
    public static Boolean getUpdateToken(string token)
    {
        Boolean updateToken = AMPViewAssetController.UpdateToken(token);
        System.assertEquals(false,updateToken);
        return updateToken;
       
    }
    public static string testgetAssetTab(){
         String linkid ='',source= '';
           return AMPViewAssetController.getAssetTab(linkid,source);                                    
     }
    public static string testsfGetAssetSearchForConfigTemplate(){
        Integer page = 1 , pagesize = 10,isMedia = 0;
        String searchparam = '',tabName = '',sortupdate = '';
        Boolean tempSearch = false ,condition = false, filFlag= false;
        List<String> templateType = new List<String>{'16','32','128','16384','36864','1048576','2097152','8388608','16777216','268435456'};
        List<Integer> tableType = new List<Integer>();
        List<String> filters = new List<String>();
         return AMPViewAssetController.sfGetAssetSearchForConfigTemplate( page, pagesize, searchparam, tempSearch, templateType, tableType, tabName, isMedia, condition, sortupdate, filters,filFlag);  
    }
    public static string testsfGetTabCount(){
        Integer page = 1 , pagesize = 10,isMedia = 0;
        String searchparam = '',tabName = '',sortupdate = '';
        Boolean tempSearch = false ,condition = false, filFlag= false, iscount= false;
        List<String> templateType = new List<String>{'16','32','128','16384','36864','1048576','2097152','8388608','16777216','268435456'};
        List<Integer> tableType = new List<Integer>();
        List<String> filters = new List<String>();
        List<Object> tabdata =new List<Object>();
         return AMPViewAssetController.sfGetTabCount( page, pagesize, searchparam, tempSearch,templateType,tableType, isMedia, condition, sortupdate, filters,iscount,tabdata);  
    }
    
}