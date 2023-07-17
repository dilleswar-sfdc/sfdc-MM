({
    quickaction:'',
    showquickmodal:'',
    quickactioncontainer:'',
    bindcomponent : function(component, event, helper) {
        if(component.get("v.isFirst"))
        {
            component.set("v.isFirst","false");
            $(helper.showquickmodal).show();
        }
        //helper.getContactDetails(component, event, helper);
        $(".amptype").click(function(){
            component.set("v.iframesrc",component.get("v."+$(this).attr("id")+"url"));
            component.set("v.classtohide",'show');
            $(helper.quickaction).show();
            $(helper.showquickmodal).hide();
        });
    },
})