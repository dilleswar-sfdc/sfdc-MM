@isTest
Private class AMPPageUrlTest {
    static testMethod void testGetPageUrl() {
        PageReference pageRef = Page.AMPSFContactSync;
        Test.setCurrentPage(pageRef);
        AMPPageUrl.getPageUrl('id');
        System.assertEquals('/apex/mindmatrix__ampsfcontactsync?id=id', AMPPageUrl.getPageUrl('id'));
        
        PageReference pageRef1 = Page.ViewRecipientLists;
        Test.setCurrentPage(pageRef1);
        System.assertEquals('/apex/mindmatrix__viewrecipientlists', AMPPageUrl.getRecipientListPageUrl());
        
        PageReference pageRef2 = Page.ViewRecipientLists;
        Test.setCurrentPage(pageRef2);
        System.assertEquals('', AMPPageUrl.getAMPMediaUrl());

    }
}