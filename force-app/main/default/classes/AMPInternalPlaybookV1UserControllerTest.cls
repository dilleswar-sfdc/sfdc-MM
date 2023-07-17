@isTest
public class AMPInternalPlaybookV1UserControllerTest {
    static testMethod void testAMPInteractiveBannerController() 
    {
        
        testGetPersonaThemeForCurrentUser();
        testAuthenticateSFUser();
        testgetplaybookUpdateComments(0,'comment','343');
        testgetPlaybooksForCurrentUser('1212','0','9','search',false,'filters');
        testgetUpdatedRating('1212', '0','9','type');
        testUpdateToken('Token');
    }
    
    public static Boolean testUpdateToken(string token)
    {
        Boolean updateToken = AMPInternalPlaybookV1UserController.UpdateToken(token);
        System.assertEquals(false,updateToken);
        return updateToken;
        
    }
    
    
    public static string testGetPersonaThemeForCurrentUser()
    {
        return AMPInternalPlaybookV1UserController.GetPersonaThemeForCurrentUser();
    }
    
    public static string testAuthenticateSFUser()
    {
    
        return AMPInternalPlaybookV1UserController.AuthenticateSFUser(true);
    }
    
    public static string testgetplaybookUpdateComments(Integer itemid, string comment,string userid)
    {
        return AMPInternalPlaybookV1UserController.getplaybookUpdateComments(itemid, comment, userid);
    }
    
    public static string testgetPlaybooksForCurrentUser(string userid,string page,string pagesize,string searchtext,Boolean condition,string filters)
    {
        return AMPInternalPlaybookV1UserController.getPlaybooksForCurrentUser(userid, page, pagesize, searchtext, condition, filters);
    }
    public static string testgetUpdatedRating(String userid, String itemid, String value, String type)
    {
        return AMPInternalPlaybookV1UserController.getUpdatedRating(userid, itemid, value, type);
    }
    
}