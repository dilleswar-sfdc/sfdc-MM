({
    getAssetRecord:function(component,event,helper)
    {
     	var data = component.get("v.data");
     	var account = '';
        var industry = '';
        account = data.Company == undefined || data.Company == null ? '':data.Company.toString();
        if(data.Account != null){
            account = data.Account.Name;
            industry = data.Account.Industry == undefined || data.Account.Industry == null ? '':data.Account.Industry.toString();
        }
        var filterparam = '';
        var email = data.Email == undefined || data.Email == null ? '' : data.Email.toString();
        var firstname = data.FirstName == undefined || data.FirstName == null ? '' : data.FirstName.toString();
        var lastname = data.LastName == undefined || data.LastName == null ? '' :data.LastName.toString();
        var crmid = data.Id == undefined || data.Id == null ? '' : data.Id.toString();
        var source = component.get("v.source");
     	if(source == "opportunity")
            filterparam = component.get("v.filter");
        //var url = install+"/handleapprequests?task=assets&email="+contact.Email+"&firstname="+contact.FirstName+"&lastname="+contact.LastName+"&company="+account+"&industry="+industry+"&crmid="+contact.Id+"&source=contact&updatedon=2017-04-09+13%3A53%3A28&tpapp=sfdc";
        var action = component.get("c.getAssetsSearchRecord");
        action.setParams({
             "email":email,
             "firstName":firstname,
             "lastName":lastname,
             "company":account,
             "industry":industry,
             "crmContactId":crmid,
             "source":source,
             "updatedon":"2017-04-09+13:53:28",
             "tpapp":"sfdc",
             "searchtext":"",
             "filterparam":"",
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data = JSON.parse(response.getReturnValue());
                component.set("v.userdata",data);
                var result = data.result;
                if(component.get("v.isfilter") && result.textToShow != "" && result.textToShow != undefined)
                {
                    component.set("v.searchtext",result.textToShow);
                    component.set("v.isfilter",true);
                }
                else
                    component.set("v.isfilter",false);                      
                helper.handleActive(component,event,helper);
            }
        });
        $A.enqueueAction(action);
    },
    getDetails:function(component,event,helper)
    {
        var action = component.get("c.getPersonaThemeViaEmail");
        action.setCallback(this, function(response) {
            
            var state = response.getState();
            if (state === "SUCCESS") {
                var data = JSON.parse(response.getReturnValue());
                var result = data.result;
                var pagecss = result.pagecss;
                component.set("v.userid",result.userid.toString());
                component.set("v.mainnavfontcolor",pagecss.mainnavfontcolor);
                component.set("v.mainnavbgcolor",pagecss.mainnavbgcolor);
                component.set("v.subnavbgcolor",pagecss.subnavbgcolor);
                component.set("v.install",result.install);
                helper.getAssetRecord(component,event, helper);
            }
        });
        action.setBackground();
        $A.enqueueAction(action);
    },
    handleActive:function(component,event,helper)
    {
     	component.set("v.pagesize","10");
     	var id = component.get("v.selTabId");
     	var tab = component.find(id);
        if(component.get("v.isfirst"))
            component.set("v.isfirst",false);
        var name = "";
        switch (id) {
            case 'printtemp' :
                name = 'c:AMPPrintTemplate';
                break;
            case 'ppttemp' :
                name = 'c:AMPPresentationTemplate';
                break;
            case 'dataroomtemp' :
                name = 'c:AMPDataRoomTemplate';
                break;
            case 'documenttemp' :
                name = 'c:AMPDocumentTemplate';
                break;
            case 'videotemp' :
                name = 'c:AMPVideoTemplate';
                component.set("v.pagesize","6");
                break;
            case 'ebooktemp' :
                name = 'c:AMPEbookTemplate';
                break;
        }
        if(name == '') return;
     var page = component.get("v.page");
     var pages = component.get("v.pages");
     var pagesize = component.get("v.pagesize");
     var currentpage = component.get("v.currentpage");
     var currrentnav = component.get("v.currentNav");
     var isfirst = component.get("v.isfirst");
     component.set("v.istab",false);
     var sort = component.get("v.sortfield");
     var order = component.get("v.sortorder");
     var istab = component.get("v.istab");
     var jo = {
         "searchtext":component.get("v.searchtext"),
         "userdata":component.get("v.userdata"),
         "userid":component.get("v.userid"),
         "install":component.get("v.install"),
         "page":page,
         "pagesize":pagesize,
         "pages":pages,
         "currentpage":currentpage,
         "currentNav":currrentnav,
         "isfirst":isfirst,
         "istab":istab,
         "sortfield":sort,
         "sortorder":order,
     };
        $A.createComponent(name, jo, function (newCard, status, error) {
            if (status === "SUCCESS") {
                tab.set('v.body', newCard);
                
            } else {
                throw new Error(error);
            }
        });
    },
})