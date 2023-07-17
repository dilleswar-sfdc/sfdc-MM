({
	enablement:'',
    iplaybookv1body:'',
    internalplaybook:'',
    ampdashboard:'',
    enablementtag:'',
    independentmodal:'',
    ampdashboardwithmenu:'',
    filter:'',
    playbook:'',
    eltandeln:'',
    //bind internalplaybook
    getInternalPlaybookForUser : function(component,event, helper){
          helper.callApi(component, helper);
        helper.getElnandElt(component,event,helper);
    },
    getElnandElt : function(component,event,helper){
        var action = component.get('c.geteltandeltn');
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                helper.eltandeln = response.getReturnValue();
            }
        });
        $A.enqueueAction(action);
    },
    //call api to get data of internalplaybook
    callApi : function(component, helper)
    {
        var data = component.get("v.playbookdata");
        var account = '';
        var industry = '';
     	account = data.Company == undefined || data.Company == null ? '':data.Company.toString();
        if(data.Account != null){
            account = data.Account.Name;
            industry = data.Account.Industry == undefined || data.Account.Industry == null ? '':data.Account.Industry.toString();
        }
        //$(helper.internalplaybook).addClass("slds-hide");
        $(helper.playbook).find('.refresh-me').addClass("rotate-me");
        component.set("v.nodata",false);
        $(helper.iplaybookv1body).hide();
     	component.set("v.hidepagination",false);
        $(helper.internalplaybook).find(".demo-only.divspinner").show();
        var filterparam = '';
        var email = data.Email == undefined || data.Email == null ? '' : data.Email.toString();
        var firstname = data.FirstName == undefined || data.FirstName == null ? '' : data.FirstName.toString();
        var lastname = data.LastName == undefined || data.LastName == null ? '' :data.LastName.toString();
        var crmid = data.Id == undefined || data.Id == null ? '' : data.Id.toString();
        var source = component.get("v.source");
     	var searchtext = "";
        if(source == "opportunity")
            filterparam = component.get("v.filter");
        var action = component.get("c.getPlaybookSearchText");//SFGetPlaybookSearchText
     	action.setParams(
         {
             "email":email,
             "firstName":firstname,
             "lastName":lastname,
             "company":account,
             "industry":industry,
             "crmContactId":crmid,
             "source":source,
             "updatedon":"2017-04-09+13:53:28",
             "tpapp":"sfdc",
             "searchtext":searchtext,
             "filterparam":""             
         });
        
        action.setCallback(this, function(response){
            var state = response.getState();   
            if(state === "SUCCESS")
            {
                var apiStatus=JSON.parse(response.getReturnValue()).status;
                if(apiStatus==1)
                {
                  
                    component.set("v.nodata",true);
                    component.set('v.ErrorMsg',"An issue occured with the Mindmatrix widget, please contact admin");
                            component.set("v.rowcount","0");
                            $(helper.internalplaybook).find(".paginate").hide();
                            $(helper.internalplaybook).find(".divspinner").hide();
                            $(helper.iplaybookv1body).show();
                            $(helper.playbook).find('.refresh-me').removeClass("rotate-me");
                            $(helper.internalplaybook).removeClass("slds-hide");
                     var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                    title : 'Error Message',
                    message: "An issue occured with the Mindmatrix widget, please contact admin",
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'error',
                    mode: 'dismissible' 
                });
        		toastEvent.fire(); 
                            return;
                }
                else
                {
                var data = JSON.parse(response.getReturnValue());                   
                var finalresponse=data.result.code;
                var finalmessage=data.result.msg;
                if(finalresponse==false)
                {
                        
                    component.set("v.nodata",true);
                    component.set('v.ErrorMsg',finalmessage);
                            component.set("v.rowcount","0");
                            $(helper.internalplaybook).find(".paginate").hide();
                            $(helper.internalplaybook).find(".divspinner").hide();
                            $(helper.iplaybookv1body).show();
                            $(helper.playbook).find('.refresh-me').removeClass("rotate-me");
                            $(helper.internalplaybook).removeClass("slds-hide");
                     var toastEvent = $A.get("e.force:showToast");
                             toastEvent.setParams({
                            title : 'Error',
                            message: 'In Playbook widget'+' '+finalmessage,
                            duration:' 5000',
                            key: 'info_alt',
                            type: 'error',
                            mode: 'dismissible' 
               		 });
        				toastEvent.fire();
                            return;
                 }
                else
                {
               
                var result = data.result;
                component.set("v.cid",result.linkid);
             	if(source == "opportunity")
                  component.set("v.typeid",result.typeid);
                component.set("v.isPlaybookFilter",true);
                component.set("v.filter",result.searchtext);
                component.set("v.searchtext",result.searchtext);
                if(component.get("v.searchtext") == "" || component.get("v.searchtext") == undefined)
                    component.set("v.isPlaybookFilter",false);
                helper.getPlaybookRecord(component,helper);
                }
               }
               
            }        
            //helper.binddata(component,helper,response);
        }); 
     $A.enqueueAction(action);
    },
    displayenablement : function(component,event,helper,index,e){
        event.stopImmediatePropagation();
        var e = event.currentTarget;
        var url = '';
        var install = component.get("v.install");
        if($(e).hasClass("enable"))
        {
            var linkid = component.get("v.cid");
            var typeid =component.get("v.typeid");
            var templateid = $(e).attr("id");
         	if(component.get("v.source") == "opportunity")
         		//url = install+"/?clean#internalplaybook/"+templateid+"?projecttypeid="+typeid+"&projectid="+linkid;
         		url = install+"?elt="+helper.eltandeln+"&clean#internalplaybook/"+templateid+"?projecttypeid="+typeid+"&projectid="+linkid;
            else
                //url = install+"/?clean#internalplaybook/"+templateid+"?contactid="+linkid;
                url = install+"?elt="+helper.eltandeln+"&clean#internalplaybook/"+templateid+"?contactid="+linkid;
          
            //var linkid = component.get("v.cid");
            //var templateid = $(e).attr("id");
         	//url = install+"/#internalplaybook/"+templateid+"?contactid="+linkid+"&clean";
        }
        else
            url = install+$(e).find(".src").html()+"?clean";
        	helper.showEnablement(helper,component,url);
    },
    showEnablement:function(helper,component,src)
    {
        window.name = src;
        if(component.get("v.dependantwidget") == "oneapp" || !component.get("v.isEnablement"))
        {
            helper.setCookie("showplaybook", false);
            var urlEvent = $A.get("e.force:navigateToURL");
            urlEvent.setParams({
                "url": "/one/one.app#/n/MindMatrix__Enablement"
            });
            urlEvent.fire();  
        }
        else if(component.get("v.dependantwidget") == "apex"){
            $(helper.ampdashboardwithmenu).click();
        }
            else{
                var urlEvent = $A.get("e.force:navigateToURL");
                urlEvent.setParams({
                    "url": '/enablement'
                });
                urlEvent.fire();
                return;
            }
        return;
    },
    search: function(component,event,helper)
    {
        //var e = event.currentTarget;
        $(".search").hide();
        $('.clear').show();
        var searchtext =component.find("searchfilter").get("v.value");
        component.set("v.searchtext",searchtext);
        var page =  1;
        component.set("v.page",parseInt(page-1));
        helper.callApi(component, helper);
    },
    getDetails:function(component,helper)
    {
       
        var action = component.get("c.getPersonaThemeViaEmail");
       
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var apiStatus=JSON.parse(response.getReturnValue()).status;
                if(apiStatus==1)
                {
                  
                    component.set("v.nodata",true);
                    component.set('v.ErrorMsg',"An issue occured with the Mindmatrix widget, please contact admin");
                            component.set("v.rowcount","0");
                            $(helper.internalplaybook).find(".paginate").hide();
                            $(helper.internalplaybook).find(".divspinner").hide();
                            $(helper.iplaybookv1body).show();
                            $(helper.playbook).find('.refresh-me').removeClass("rotate-me");
                            $(helper.internalplaybook).removeClass("slds-hide");
                     var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                    title : 'Error Message',
                    message: "An issue occured with the Mindmatrix widget, please contact admin",
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'error',
                    mode: 'dismissible' 
                });
        		toastEvent.fire(); 
                            return;
                }
                else
                {
                var data = JSON.parse(response.getReturnValue());                   
                var finalresponse=data.result.code;
                var finalmessage=data.result.msg;
                if(finalresponse==false)
                {
                         
                    component.set("v.nodata",true);
                    component.set('v.ErrorMsg',finalmessage);
                            component.set("v.rowcount","0");
                            $(helper.internalplaybook).find(".paginate").hide();
                            $(helper.internalplaybook).find(".divspinner").hide();
                            $(helper.iplaybookv1body).show();
                            $(helper.playbook).find('.refresh-me').removeClass("rotate-me");
                            $(helper.internalplaybook).removeClass("slds-hide");
                    var toastEvent = $A.get("e.force:showToast");
                             toastEvent.setParams({
                            title : 'Error',
                            message:'In Playbook'+ finalmessage,
                            duration:' 5000',
                            key: 'info_alt',
                            type: 'error',
                            mode: 'dismissible' 
               		 });
        				toastEvent.fire();
                            return;
                 }
                else
                {
                var result = data.result;
                var pagecss = result.pagecss;
                component.set("v.userid",result.userid.toString());
                component.set("v.mainnavfontcolor",pagecss.mainnavfontcolor);
                component.set("v.mainnavbgcolor",pagecss.mainnavbgcolor);
                component.set("v.subnavbgcolor",pagecss.subnavbgcolor);
                component.set("v.install",result.install);
                helper.callApi(component, helper);
                helper.dynamicColorBinding(component,event,helper);
                }
                }
                 
            }
        });
        action.setBackground();
        $A.enqueueAction(action);
    },
    getPlaybookRecord: function(component,helper)
    {
        $(helper.playbook).find('.refresh-me').addClass("rotate-me");
        component.set("v.nodata",false);
        $(helper.iplaybookv1body).hide();
     	component.set("v.hidepagination",false);
        $(helper.internalplaybook).find(".demo-only.divspinner").show();
        var searchtext = component.get("v.searchtext");
        var action = component.get("c.getPlaybookRecords");
     	action.setParams(
         {
             "searchtext" : searchtext,
             "page":component.get("v.page").toString(),
             "pagesize":component.get("v.pagesize").toString()
         });
         action.setCallback(this, function(response){
            var state = response.getState();
             
            if(state === "SUCCESS")
            {
                var apiStatus=JSON.parse(response.getReturnValue()).status;
                var data = JSON.parse(response.getReturnValue());
                var finalresponse=data.result.code;
                var finalmessage=data.result.msg;
                if(apiStatus == 1)
                {
                   
                    component.set("v.nodata",true);
                    component.set("v.ErrorMsg","An issue occured with the Mindmatrix widget, please contact admin");
                    component.set("v.rowcount","0");
                    $(helper.internalplaybook).find(".paginate").hide();
                    $(helper.internalplaybook).find(".divspinner").hide();
                    $(helper.iplaybookv1body).show();
                    $(helper.playbook).find('.refresh-me').removeClass("rotate-me");
                    $(helper.internalplaybook).removeClass("slds-hide");
                     var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title : 'Error Message',
                        message: "An issue occured with the Mindmatrix widget, please contact admin",
                        duration:' 5000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'dismissible' 
                    });
                    toastEvent.fire(); 
                    return;
                }
                else if(finalresponse != false)
                {
                    if(data.result.item.length < 1)
                    {
                        if(finalresponse=="failed")
                        {
                            
                            component.set("v.nodata",true);
                            component.set("v.ErrorMsg",finalmessage);
                            component.set("v.rowcount","0");
                            $(helper.internalplaybook).find(".paginate").hide();
                            $(helper.internalplaybook).find(".divspinner").hide();
                            $(helper.iplaybookv1body).show();
                            $(helper.playbook).find('.refresh-me').removeClass("rotate-me");
                            $(helper.internalplaybook).removeClass("slds-hide");
                            var toastEvent = $A.get("e.force:showToast");
                            toastEvent.setParams({
                                title : 'Error',
                                message: 'In Playbook widget'+' '+finalmessage,
                                duration:' 5000',
                                key: 'info_alt',
                                type: 'error',
                                mode: 'dismissible' 
                            });
                            toastEvent.fire();
                            return;
                        }
                        else
                        {
                            try
                            {                     
                                component.set("v.pages",Math.ceil(data.result.row_count/component.get("v.pagesize")));
                                component.set("v.pagination",component.get("v.pages"));
                                component.set("v.hidepagination",false);                                
                            }
                            catch(e){}
                            component.set("v.nodata",true);
                            component.set("v.rowcount","0");
                            $(helper.internalplaybook).find(".paginate").hide();
                            $(helper.internalplaybook).find(".divspinner").hide();
                            $(helper.iplaybookv1body).show();
                            $(helper.playbook).find('.refresh-me').removeClass("rotate-me");
                            $(helper.internalplaybook).removeClass("slds-hide");
                            return;
                        }
                    }
                    else
                    {
                        if(finalresponse==false)
                        {
                            
                            component.set("v.nodata",true);
                            component.set("v.ErrorMsg",finalmessage);
                            component.set("v.rowcount","0");
                            $(helper.internalplaybook).find(".paginate").hide();
                            $(helper.internalplaybook).find(".divspinner").hide();
                            $(helper.iplaybookv1body).show();
                            $(helper.playbook).find('.refresh-me').removeClass("rotate-me");
                            $(helper.internalplaybook).removeClass("slds-hide");
                            var toastEvent = $A.get("e.force:showToast");
                            toastEvent.setParams({
                                title : 'Error',
                                message: 'In Playbook widget'+' '+finalmessage,
                                duration:' 5000',
                                key: 'info_alt',
                                type: 'error',
                                mode: 'dismissible' 
                            });
                            toastEvent.fire();
                            return;
                        }
                        //var result = data.result;
                        //if(component.get("v.isfilter") && result.searchText != "" && result.searchText != undefined)
                        //{
                        //    component.set("v.filter",result.searchText);
                        //} 
                        else {
                            var jo = {};
                            jo["status"] = data.status;
                            jo["rowcount"] = data.result.row_count;
                            component.set("v.pages",Math.ceil(jo.rowcount/component.get("v.pagesize")))
                            var pagination = [];
                            for(var z = 0;z<=component.get("v.pages")-1;z++)
                            {
                                pagination.push(z+1);
                            }
                            component.set("v.pagination",pagination);
                            component.set("v.rowcount",jo.rowcount);
                            component.set("v.hidepagination",true);
                            var items = [];
                            var index = [];
                            for(var i=0; i<data.result.item.length; i++)
                            {
                                var item = {};
                                index.push(i);
                                var _data = data.result.item[i];
                                
                                item["imgUrl"] = _data.original;
                                var description = _data.description;
                                
                                if(description == null || description === undefined || description == "null" || description == "")
                                    item["description"] = "NA";
                                else
                                    item["description"] = decodeURI(description);
                                item["trimeddesc"] = item["description"];
                                if(item["trimeddesc"].length > 90)
                                    item["trimeddesc"] = item["description"].substring(0,90)+'...';
                                //item["rating"] = ratingdata.avgrating;
                                item["id"] = _data.id;
                                item["name"] = _data.name;
                                if(_data.name.length > 15)
                                    item["shortName"] = _data.name.substring(0,15)+"...";
                                else
                                    item["shortName"] = _data.name;
                                
                                
                                item["sliderid"] = 's_'+i;
                                item["count"] = i;
                                items.push(item);
                            }
                            
                            jo["item"] = items;
                            component.set("v.quicklink1",jo);
                            var length = jo.item.length;
                            //(length > 3) ? $(".internalPlaybooksection").addClass("enableplaybookslider") : $(".internalPlaybooksection").addClass("disableplaybookslider");
                            setTimeout(function(){
                                $(helper.iplaybookv1body).find("li:nth-child(5n)").addClass("lastindex");        
                                
                                $(helper.iplaybookv1body).find('.star-rating').hover(function(){
                                    var islastindex = $(this).closest(".lastindex").length;
                                    if(islastindex > 0)
                                    {
                                        if(component.get("v.dependantwidget") == "apex")
                                            $(this).next().removeClass("rateleft slds-nubbin_left").addClass("raterightapex slds-nubbin_right");
                                        else
                                            $(this).next().removeClass("rateleft slds-nubbin_left").addClass("rateright slds-nubbin_right");
                                    }
                                    $(this).next().show();
                                },function(){
                                    //if($(this).next().hasClass("raterightapex"))
                                    //    $(this).next().removeClass("raterightapex  slds-nubbin_left").addClass("rateleft slds-nubbin_right");
                                    //else
                                    //	$(this).next().removeClass("rateright slds-nubbin_right").addClass("rateleft slds-nubbin_left");
                                    $(this).next().hide();
                                });
                            },100);
                            $(helper.internalplaybook).find(".paginate").show();
                            $(helper.internalplaybook).find(".divspinner").hide();
                            $(helper.iplaybookv1body).show();
                            $(helper.playbook).find('.refresh-me').removeClass("rotate-me");
                            $(helper.internalplaybook).removeClass("slds-hide");
                            return;  
                        }
                    }
                }
                else
                {
                     component.set("v.nodata",true);
                    component.set("v.ErrorMsg",finalmessage);
                     $(helper.internalplaybook).find(".paginate").hide();
                    $(helper.internalplaybook).find(".divspinner").hide();
                    $(helper.iplaybookv1body).show();
                    $(helper.playbook).find('.refresh-me').removeClass("rotate-me");
                    $(helper.internalplaybook).removeClass("slds-hide");
                }
            }
        });
        window.setTimeout(
            $A.getCallback(function() {
                $A.enqueueAction(action);
            }), 100);
    },
    setCookie:function(cname, cvalue) {
        document.cookie = cname + "=" + cvalue + ";path=/";
    },
    dynamicColorBinding:function(component,event,helper){
        document.documentElement.style.setProperty('--mainnavbgcolor', component.get("v.mainnavbgcolor"));
    }
})