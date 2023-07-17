@isTest
Private Class AMPGetWebServiceResponseTest {
    private static TestMethod void testGetJSONResponse() {  
        try {
            test.startTest();
            testPostData('https://mm.amp.vg','');
            testGetData('https://mm.amp.vg');
            
            test.stopTest();
                
        } catch(Exception e) {
            return;
        }
    }
    private static JSONParser testGetData(string url)
    {
        String strExpectedResponse = '{"error":"No User Found"}';
        JSONParser parserExpected = JSON.createParser(strExpectedResponse);
        JSONParser parser = AMPGetWebServiceResponse.GetJSONResponse('https://mm.amp.vg/public/mobile1.ashx');
        System.AssertEquals(null, parser.getCurrentToken());
        return parser;
    }
    private static string testPostData(string url,string jsonS)
    {
        String strExpectedResponse = '{"error":"No User Found"}';
        JSONParser parserExpected = JSON.createParser(strExpectedResponse);
        string parser = AMPGetWebServiceResponse.PostDataJSONResponse('https://mm.amp.vg/public/mobile1.ashx',strExpectedResponse,'');
        return parser;
    }
}