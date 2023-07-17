/*
Utility class which returns the web service response
*/
public class AMPGetWebServiceResponse {
    //Method that return JSON response
    public class JsonResult
    {
        public string result;
        public integer status;
    }
    public class cls_result {
        public Integer status;	//0
        public String message;	//This is the message
    }
    public class AuthenicateResult
    {
        public resultclass result;
        public Integer status;
        public string version;
        public object tosredircturl;
        
    }
    public class resultclass{
		public boolean userfound;
        public string autologinurl;
        public string errorMessage;
        public String apiStatus;
        public boolean authentic;
        public string usertoken;
        public string usersessionid;
        public string username;
        public Integer userid;
        public string authkey;
        public string installurl;
        public boolean newuser;
        public boolean tos;
        public Integer language;
    }
    public class syncclass
    {
        public object result;
        
        
    }
    public class fromAMP
    {
        public Integer status;	//1
        public cls_result result;
        
        public fromAMP parse(String json)
        {
            return (fromAMP) System.JSON.deserialize(json, fromAMP.class);
        }
    }

    public class SessionIDAPIResult{
        public string result;
        public Integer status;
    }
    
    public class DevApiResult{
        public DevAPI result;
        public Integer status;	//0  
        
    }    
    public class DevAPI {
            public String clientid;	//e9cd92ecef5d668de387a9a71dbccfa3d19da53705adda4e1a3b452d27665c3a
            public String clientsecret;	//b129a5ff9f8701c3d813950bdd95ca71766aa580bf646f5785435f5d468d616d
            public String userid;
        	public String usersessionid;
        }
    
    public class ExtraSettings {

        public List<String> rts;
        public String plv;
        public String wlv;
        public String alv;
        
        //public static PopUpSettings parse(String json) {
        //    return (PopUpSettings) System.JSON.deserialize(json, PopUpSettings.class);
        //}
    }
    
   
    public static JSONParser GetJSONResponse(String WSUrl)
    {
        JSONParser parser;
        String jsonResp = '{"error":"Key Expired or Invalid"}';
        try {
            Http http = new Http();
            HttpRequest req = new HttpRequest();
            
            //set the Method
            req.setMethod('GET');
            req.setHeader('Accept', 'application/json'); 
            req.setHeader('Content-Type','application/json');
            req.setCompressed(true); 
            req.setEndpoint(WSUrl);
            
            //create the response object
            HttpResponse resp = http.Send(req);
            //the Feed service is returning a line feed so parse it out
            parser = JSON.createParser(resp.getBody());
        } 
        catch(Exception ex) {
            jsonResp = '{"error":"' + ex.getMessage() + '"}';
            parser = JSON.createParser(jsonResp);
        }
        return parser;
    }
    
    //Method that return JSON response
    public static string PostDataJSONResponse(String url,String jsonS,String getToken)
    {
        
        string parser;
        String jsonResp = '{"error":"Key Expired or Invalid"}';
        try {
            String endpoint = url;
            HttpRequest req = new HttpRequest();
            req.setEndpoint(endpoint);
            req.setMethod('POST');
            req.setHeader('Accept', 'application/json'); 
            req.setHeader('Content-Type','application/json');
            if(getToken != '')
            req.setHeader( 'Authorization', 'token '+getToken);
            req.setTimeout(120000);
            req.setbody(jsonS);
            Http http = new Http();
            HTTPResponse response = http.send(req);
            return response.getBody();
        } 
        catch(Exception ex) {
            jsonResp = '{"error":"' + ex.getMessage() + '"}';
            parser = jsonResp;
        }
        return parser;
    }
    
    
}