({
	doInit : function(component, event, helper) {
		var action = component.get("c.getAccountOpportunity");
        action.setParams({
            accountId : component.get("v.recordId"),
            page : component.get("v.page")
        });
        action.setCallback(this,function(response){
			var state = response.getState();
            if(state === "SUCCESS"){
                var paginationList = [];
               var accountOpp = response.getReturnValue();
                if(accountOpp.length > 0){
                    component.set("v.Boolean",true);
                    component.set("v.rowcount",response.getReturnValue().length);
                    component.set("v.pages",Math.ceil(response.getReturnValue().length/component.get("v.pagesize")));
                    component.set("v.allOpportunity",accountOpp);
                    var pageSize = component.get("v.pagesize");
                    for(var i=0;i<accountOpp.length;i++){
                        paginationList.push(response.getReturnValue()[i]);
                    }
                    component.set("v.paginationList",paginationList);
                }
            }
		});
        $A.enqueueAction(action);
    },
    next : function(component,event,helper){
        var page = component.get("v.page");
        if(page + 1 == component.get("v.pages")/component.get("v.pagesize"))
            return;
        component.set("v.page",++page);
        component.set("v.currentpage",(component.get("v.page")+1));
        var opportunityList = component.get("v.allOpportunity");
        var paginationList = [];
        var x = (component.get("v.page"))*component.get("v.pagesize");
        for(; x<(component.get("v.currentpage"))*component.get("v.pagesize"); x++){
            if(opportunityList[x]){
            	paginationList.push(opportunityList[x]);
            }
        }
        component.set("v.paginationList",paginationList);
    },
    prev : function(component,event,helper){
        var page = component.get("v.page");
        if(page == 0)
            return;
        component.set("v.page",--page);
        component.set("v.currentpage",(component.get("v.page")+1));
        var opportunityList = component.get("v.allOpportunity");
        var paginationList = [];
        var x = (component.get("v.page"))*component.get("v.pagesize");
        for(; x<(component.get("v.currentpage"))*component.get("v.pagesize"); x++){
            if(opportunityList[x]){
            	paginationList.push(opportunityList[x]);
            }
        }
        component.set("v.paginationList",paginationList);
    }
})