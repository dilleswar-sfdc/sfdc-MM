@isTest
public class MindMatrixJWTHelperTest {
    testMethod static void testMindMatrixJWTHelperTest()
    {
        testEncodeURL('https://mm.amp.vg/');
        testCreateJWT('fgfg46464654','Ym7AD3OT2kpuIRcVAXCweYhV64B0Oi9ETAO6XRbqB8LDL3tF4bMk9x/59PljcGbP5v38BSzCjD1VTwuO6iWA8uzDVAjw2fMNfcT2/LyRlMOsynblo3envlivtgHnKkZj6HqRrG5ltgwy5NsCQ7WwwYPkldhLTF+wUYAnq28+QnU=','xyz@mailinator.com');
        testGenerateELTandELN();
        testGenerateELTandELNemail('xyz@mailinator.com');
        testELTandELN('xyz@mailinator.com');
        testGenerateJWTToken('ydadfhdkljk54654654','xyz@mailinator.com');
        testCreateSalt(16);
        testEncrypt('dfadgdagsha','fgfg46464654');
        testbase64URLencode(blob.valueof('hkhkhkh'));
        
    }
    public static string testEncodeURL(string url){
        string encodeurl = MindMatrixJWTHelper.EncodeURL(url);
        System.assertEquals('https%3A%2F%2Fmm.amp.vg%2F',encodeurl);
        return encodeurl;
                
    }
    
    public static string testCreateJWT(string nonce, string hs256key,string email){
        string result = MindMatrixJWTHelper.CreateJWT(nonce,hs256key,email);
        System.assertEquals(true,result != null);
        return result;
                
    }
    public static string testELTandELN(string email){
         //return MindMatrixJWTHelper.ELTandELN(email);
         string testeltandeln = MindMatrixJWTHelper.ELTandELN(email);
        System.assertEquals(true,testeltandeln != null);
        return testeltandeln;
    }
    public static string testGenerateELTandELN(){
         //return MindMatrixJWTHelper.GenerateELTandELN();
         string testgenerateeltandeln = MindMatrixJWTHelper.GenerateELTandELN();
        System.assertEquals(true,testgenerateeltandeln != null);
        return testgenerateeltandeln;
    }
    public static string testGenerateELTandELNemail(string email){
        // return MindMatrixJWTHelper.GenerateELTandELN(email);
         string testgenerateeltandelnemail = MindMatrixJWTHelper.GenerateELTandELN(email);
        System.assertEquals(true,testgenerateeltandelnemail != null);
        return testgenerateeltandelnemail;
    }
   
    public static string testCreateSalt(Integer len){
       // return MindMatrixJWTHelper.CreateSalt(len);
        string testCreateSalt = MindMatrixJWTHelper.CreateSalt(len);
        System.assertEquals(true,testCreateSalt != null);
        return testCreateSalt;
       
    }
    public static string testEncrypt(String jwt, String nonce){
       // return MindMatrixJWTHelper.Encrypt(jwt,nonce);
        string testEncrypt = MindMatrixJWTHelper.Encrypt(jwt,nonce);
        System.assertEquals(true,testEncrypt != null);
        return testEncrypt;
    }
    public static string testbase64URLencode(Blob input){
       // return MindMatrixJWTHelper.base64URLencode(input);
        string base64urlencode = MindMatrixJWTHelper.base64URLencode(input);
        System.assertEquals(true,base64urlencode != null);
        return base64urlencode;
        
    }
    
    public static String testGenerateJWTToken(String nonce ,string email){
        String generateJWTToken = MindMatrixJWTHelper.GenerateJWTToken(nonce,email);
        //System.assertEquals('ydadfhdkljk54654654',generateJWTToken);
        System.assertEquals(true,generateJWTToken != null);
        return generateJWTToken;
       
    }
}