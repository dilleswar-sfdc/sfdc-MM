public with sharing class MindMatrixMiscHelper extends MindMatrixAuthenticator {
	public class versiondata{
        public string objectName;
        public string crmobjectName;
        public string fieldName;
        public string crmfieldName;
        public List<valuesclass> values;
        public List<valuescrmclass> crmvalues;
        public boolean checkBox;
        public boolean crmcheckBox;
    }
    public class valuescrmclass{
        public string k;
        public string v;
    }
    public class valuesclass{
        public string k;
        public string v;
    }
        @AuraEnabled
    public static string AuthenticateSFUser(Boolean createuserviasso,Boolean shownavigation)
    {
        return AuthenticateMMUser(createuserviasso,shownavigation);
    }
        
    
}