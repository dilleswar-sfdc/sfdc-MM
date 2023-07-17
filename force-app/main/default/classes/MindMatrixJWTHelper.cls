public with sharing class MindMatrixJWTHelper extends MindMatrixAuthHelper {
   
    public static string GenerateELTandELN(){
        string email = UserInfo.getUserEmail();
        return ELTandELN(email);
    }
    
    public static string ELTandELN(string email)
    {
        string nonce = CreateSalt(16);
        string jwt = GenerateJWTToken(nonce, email);
        string encrypted = Encrypt(jwt, nonce);
        string elt = EncodeURL(encrypted);
        string eln = EncodeURL(nonce);
        return elt+'&eln='+eln;
    }
    
    public static string GenerateELTandELN(string email)
    {
        return ELTandELN(email);
    }
    
    //We're calling this function to generate the token
    public static string GenerateJWTToken(string nonce, string email) {
        //return CreateJWT(nonce, GetOrgJWTeltHS256(), email);
        
        return CreateJWT(nonce, GetOrgJWTeltHS256() != '' ? GetOrgJWTeltHS256() : GetPublicOrgJWTeltHS256(), email);
        
    }
   
    public static string CreateSalt(Integer len){
        Blob blobKey = crypto.generateAesKey(256);
        return EncodingUtil.convertToHex(blobKey).substring(0,len);
    }   
    
     public static String Encrypt(String jwt, String nonce){
        
        Blob iv = Blob.valueOf(nonce);
         if(iv == null)
             return '';
         
         //string orgjwtaes =GetOrgJWTeltAES();
         string orgjwtaes =GetOrgJWTeltAES() != '' ? GetOrgJWTeltAES() : GetPublicOrgJWTeltAES();
         
         if(orgjwtaes == null)
             return '';
        Blob key = crypto.generateMac('HmacSHA256',Blob.valueOf(orgjwtaes), iv);
        Blob data = Blob.valueOf(jwt);
        Blob encrypted = Crypto.encrypt('AES256', key, iv, data);
        return EncodingUtil.base64Encode(encrypted);
      }
    
    public static String base64URLencode(Blob input){ 
        String output = encodingUtil.base64Encode(input);
        output = output.replace('+', '-');
        output = output.replace('/', '_');
        while ( output.endsWith('=')){
            output = output.subString(0,output.length()-1);
        }
		return output;
    }
    
    public static string EncodeURL(string url){
        return EncodingUtil.urlEncode(url, 'UTF-8');
    }
    
	public static string CreateJWT(string nonce, string hs256key, string email){
        String header = '{"alg": "HS256","typ":"JWT","kid":"' + nonce + '"}';
        //String install = GetOrgInstallName();
        
        //newly added code for ESET client if they don't want to give "view all custom setting" permission.These code have to remove when we submit for securityreview.
        String install = GetOrgInstallName() != '' ? GetOrgInstallName() : GetPublicOrgInstallName();
        
        
        if(install == null )
            return '';
        URL url = new URL(install);
        String siteaddress = url.getProtocol() + '://' + url.getHost();
        
        Auth.JWT jwt = new Auth.JWT();
        jwt.setAud(siteaddress); 
        jwt.setIss(siteaddress);
        jwt.setValidityLength(60 * 30 * 24);
        
        //Additional claims to set nameid
        Map<String, Object> claims = new Map<String, Object>();
        claims.put('nameid', email);
       
        jwt.setAdditionalClaims(claims);
        
		String jwtRequest = base64URLencode(blob.valueof(header)) + '.' +base64URLencode(blob.valueof(jwt.toJSONString()));
        Blob key = EncodingUtil.base64Decode(hs256key);
		blob signature = Crypto.generateMac('hmacSHA256',Blob.valueof(jwtRequest),key);
        
        string jwtToken = jwtRequest+'.'+base64URLencode(signature);
        
        
        String hs256keyconvert = EncodingUtil.base64Encode(Blob.valueOf(hs256key));
		
        return jwtToken;
    }
    
   
}