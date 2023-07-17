@isTest
public class AMPAnnualTargetProgressReportControllerT {
    static testMethod void testAMPAnnualTargetProgressReportController() 
    {
       
        testGetPersonaThemeForCurrentUser();
        testAuthenticateSFUser(true);
        testgetAnnualTargetProgressReport('text');
        testUpdateToken('Token');   
       
    }
    
    public static Boolean testUpdateToken(string token)
    {
        Boolean updateToken = AMPAnnualTargetProgressReportController.UpdateToken(token);
        System.assertEquals(false,updateToken);
        return updateToken;
       
    }
    
    
    public static string testGetPersonaThemeForCurrentUser()
    {
        String personaTheme =  AMPAnnualTargetProgressReportController.GetPersonaThemeForCurrentUser();
        System.assertEquals(true,personaTheme != null);
        return personaTheme;
       
    }
    
    public static string testAuthenticateSFUser(Boolean createuserviasso)
    {
        String authSFUser =  AMPAnnualTargetProgressReportController.AuthenticateSFUser(createuserviasso);
        System.assertEquals(true,authSFUser != null);
        return authSFUser;
       
    }
    
    public static string testgetAnnualTargetProgressReport(string view)
    {
        String progressReport =  AMPAnnualTargetProgressReportController.getAnnualTargetProgressReport(view);
        System.assertEquals(true,progressReport != null);
        return progressReport;
      
    }
    
}