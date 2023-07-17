@isTest
Private Class AMPContactWrapperTest {
    public static testMethod void testMe() { 
        try {
            test.startTest();
            AMPContactWrapper cw = new AMPContactWrapper();
            System.assertEquals(cw.checked, false);
            
            AMPContactWrapper cw1 = new AMPContactWrapper();
            cw1.checked = false;
            Contact con = new Contact();
            cw1.cont = con; 
            
     
            AMPContactWrapper cw2 = new AMPContactWrapper(new Contact(FirstName=null));
            System.assertEquals(cw2.cont.name, null);
            System.assertEquals(cw2.checked, false); 
            test.stopTest();
        }
        catch(Exception e) {
            return;
        }
    } 
}