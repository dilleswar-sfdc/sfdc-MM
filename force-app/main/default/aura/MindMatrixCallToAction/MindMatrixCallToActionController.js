({
    doInit : function(component, event, helper) {
        component.set('v.loadedText',component.get("v.Text"));
    },
    
    closeModel: function(component, event, helper) {
        // Set isModalOpen attribute to false  
        component.set("v.isModalOpen", false);
    },
    
    handleClick : function(component, event, helper) {
        
        component.set('v.loadedText','Loading...');
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title : 'Processing...',
            message: "Please wait while we're updating your profile.",
            duration:' 10000',
            type: 'success',
            mode: 'pester'
        });
        toastEvent.fire();
        helper.AuthenticateCurrentUser(component, event, helper) ;
    }
    
})