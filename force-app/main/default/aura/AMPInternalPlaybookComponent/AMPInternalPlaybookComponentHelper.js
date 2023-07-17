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
    //bind internalplaybook
    getInternalPlaybookForUser : function(component, event, helper){
        this.callApi(component, helper,"getPlaybooksForCurrentUser",'','');        
    },
    //call api to get data of internalplaybook
    callApi : function(component, helper,method,itemid,comment)
    {
        //$(helper.internalplaybook).addClass("slds-hide");
        $(helper.playbook).find('.refresh-me').addClass("rotate-me");
        component.set("v.nodata",false);
        $(helper.iplaybookv1body).hide();
        $(helper.internalplaybook).find(".paginate").hide();
        $(helper.internalplaybook).find(".divspinner").show();
        var filters = component.get("v.selectedfilter");
        if(filters != "")
            filters = component.get("v.selectedfilter").join(",");
        var searchtext = component.get("v.searchtext");
        if(searchtext == null)
            searchtext = "";
        var apiName = "c."+method;
        var action = component.get(apiName);
     	action.setParams(
         {
             "userid":component.get("v.userid"),
             "page":component.get("v.page").toString(),
             "pagesize":component.get("v.pagesize").toString(),
             "searchtext":searchtext,
             "condition":component.get("v.isfilter"),
             "filters":filters
         });
        action.setCallback(this, function(response){
            helper.binddata(component,helper,response,method);
        });
        window.setTimeout(
            $A.getCallback(function() {
                $A.enqueueAction(action);
            }), 100);
    },
    binddata:function(component,helper,response,method){
        var state = response.getState();        
            if(state === "SUCCESS")
            {
                if(method == "getplaybookUpdateComments"){
                    var toastEvent = $A.get("e.force:showToast");
                    if(toastEvent){
                    toastEvent.setParams({
                        "title": "Success!",
                        "message": "Your comment has been updated successfully."
                    });
                    toastEvent.fire();
                    }
                    else
                    {
                        component.set("v.message","Your comment has been updated successfully.");
                        $A.util.removeClass(component.find("successToast"), "slds-hide");
                        setTimeout(function(){
                            helper.closeToast(component);
                        },1000);   
                    }
                    return;
                }
                var data = JSON.parse(response.getReturnValue());
                if(data.status == 1 )
                {
                    try{
                        if(data.status != 1){
                        	component.set("v.pages",Math.ceil(data.result.row_count/component.get("v.pagesize")));
                            component.set("v.pagination",component.get("v.pages"));
                        }
                    }
                    catch(e){}
                    component.set("v.nodata",true);
                 	component.set("v.rowcount","0");
                    $(helper.internalplaybook).find(".paginate").hide();
                    $(helper.internalplaybook).find(".divspinner").hide();
                    $(helper.iplaybookv1body).show();
                    $(helper.playbook).find('.refresh-me').removeClass("rotate-me");
                    return;
                }
                else
                {
                   var finalresponse=data.result.code;
                   var finalmessage=data.result.msg;
                    if(finalresponse==false)
                    {
                      /* var toastEvent = $A.get("e.force:showToast");
                             toastEvent.setParams({
                            title : 'Error',
                            message: finalmessage,
                            duration:' 5000',
                            key: 'info_alt',
                            type: 'error',
                            mode: 'dismissible' 
               		 });
        				toastEvent.fire();
                        $(helper.internalplaybook).find(".paginate").hide();
                            $(helper.internalplaybook).find(".divspinner").hide();
                         $(helper.internalplaybook).find(".errorMsg").show();
                          $(helper.internalplaybook).find('.errorMsg').html("Sorry!"+" "+finalmessage);
                            $(helper.playbook).find('.refresh-me').removeClass("rotate-me");*/
                 }
                  else
                  {
                      if(data.result.item.length < 1){
                          component.set("v.nodata",true);
                          $(helper.internalplaybook).find(".paginate").hide();
                          $(helper.internalplaybook).find(".divspinner").hide();
                          $(helper.iplaybookv1body).show();
                          $(helper.playbook).find('.refresh-me').removeClass("rotate-me");
                return;
                      }
                      else{
                    var jo = {};
                    jo["status"] = data.status;
                    jo["rowcount"] = data.result.row_count;
                    var filterdata = data.result.filters;
                    var filters = [];
                    for(var y=0; y<filterdata.length;y++)
                    {
                        var filter = {};
                        filter["id"] = filterdata[y].id;
                        filter["name"] = filterdata[y].name;
                        filter["isselected"] = '';
                        var selected = component.get("v.selectedfilter");
                        if(selected != undefined)
                        {
                            for(var j =0;j<selected.length;j++)
                            {
                                if(filterdata[y].id == selected[j])
                                    filter["isselected"] = 'isselected';
                            }
                        }                      
                        filters.push(filter);
                    }
                    component.set("v.filters",filters);
                    component.set("v.pages",Math.ceil(jo.rowcount/component.get("v.pagesize")))
                    var pagination = []; 
                    for(var z = 0;z<=component.get("v.pages")-1;z++)
                    {
                        pagination.push(z+1);
                    }
                    component.set("v.pagination",pagination);
                    component.set("v.rowcount",jo.rowcount);
                    var items = [];
                    var index = [];
                    for(var i=0; i<data.result.item.length; i++)
                    {
                        var item = {};
                        index.push(i);
                        var _data = data.result.item[i].item;
                        var ratingdata = data.result.item[i].ratingdata;
                        
                        item["imgUrl"] = _data.original;
                        var description = _data.description;
                        
                        if(description == null || description === undefined || description == "null" || description == "")
                            item["description"] = "NA";
                        else
                            item["description"] = decodeURI(description);
                        item["trimeddesc"] = item["description"];
                        if(item["trimeddesc"].length > 90)
                            item["trimeddesc"] = item["description"].substring(0,90)+'...';
                        item["rating"] = ratingdata.avgrating;
                        item["id"] = _data.id;
                        item["name"] = _data.name;
                        item["hasRatingAccess"] = _data.hasratingAccess;
                        item["ratepopover"] = "ratepop"+i;
                        item["ratingdata"] = ratingdata;
                        if(item["hasRatingAccess"])
                        {
                            var ratings = [];
                            for(var z = 0;z<=4;z++)
                            {
                                var rate = {};
                                var _class = (ratingdata.starrating.rating)>z?ratingdata.starrating.isuserrating?"ratecolor":"noratecolor":"";
                                rate["id"] = "rate"+i+"_"+(z+1);
                                rate["class"] = _class;
                                rate["rating"] = ratingdata.starrating.rating;
                                ratings.push(rate);
                            }
                            item["rate"] = ratings;
                        }
                        item["sliderid"] = 's_'+i;
                        item["count"] = i;
                        
                        var _result = data.result.item[i].result;
                        var results = [];
                        for(var y = 0; y <= _result.length - 1; y++ )
                        {
                            var result = {};
                            result["listName"] = _result[y].name;
                            result["listName"] = result["listName"].toUpperCase(result["listName"]);
                            result["totalContacts"] = _result[y].totalContacts;
                            result["totalActive"] = _result[y].totalActive;
                            result["percent"] = result["totalContacts"] == 0 ? 0 : Math.ceil((result["totalActive"]/result["totalContacts"]) * 100);
                            result["cirDeg"] = Math.ceil((result["percent"]/100)*360);
                            result["listID"] = _result[y].listID;
                            result["circlass"] = '';
                            if(result["cirDeg"] > 179)
                            {
                                result["circlass"] = 'container p50plus small';
                            }
                            else
                                result["circlass"] = 'container small';
                            results.push(result);
                        }
                        
                        item["result"] = results;
                        items.push(item);
                        
                    }
                    jo["item"] = items;
                    component.set("v.quicklink1",jo);
                         //component.set("v.nodata",true);
                          $(helper.internalplaybook).find(".paginate").show();
                          $(helper.internalplaybook).find(".divspinner").hide();
                          $(helper.iplaybookv1body).show();
                         // $(helper.playbook).find('.refresh-me').removeClass("rotate-me");
                    var length = jo.item.length;
                    //(length > 3) ? $(".internalPlaybooksection").addClass("enableplaybookslider") : $(".internalPlaybooksection").addClass("disableplaybookslider");
                    setTimeout(function(){
                        $(helper.iplaybookv1body).find("li:nth-child(3n)").addClass("lastindex");        
                                          
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
                }
                }
                }
                
            }
    },
    closeToast:function(component){$A.util.addClass(component.find("successToast"), "slds-hide");},
    //display data in a tab
    displayenablement : function(component,event,helper,index,e){
        event.stopImmediatePropagation();
        var e = event.currentTarget;
        var url = '';
        var install = component.get("v.install");
        if($(e).hasClass("enable"))
        {
            var templateid = $(e).attr("id");
         	url = install+"/?clean#internalplaybook/"+templateid;
        }
        else
            url = install+$(e).find(".src").html();
        	helper.showEnablement(helper,component,url);
    },
    showEnablement:function(helper,component,src)
    {
        window.name = src;
        if(component.get("v.dependantwidget") == "oneapp" || component.get("v.isEnablement"))
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
        helper.callApi(component, helper,"getPlaybooksForCurrentUser",'','');
    },
    openModal:function(component,src)
    {
        var modal = '';
        if(src == '')
            return;
        modal = $(this.internalplaybook).find(".modal-independant");
        $(modal).find("#iframe-modal").attr("src",src);
        $(modal).show();
    },
    //open image in modal
    openimage : function(component,event,helper){
        var e = event.currentTarget;
        var templateid = $(e).attr("id");
        var url = install+"/?clean#internalplaybook/"+templateid;
        $(helper.enablement).attr('src',url);
        $(helper.ampdashboard).hide();
        $(helper.enablementtag).show();
    },
    //open comment modal in internalplaybook
    opencommentmodal : function(component,event,helper){
        var e = event.currentTarget;
        var itemid = $(e).attr("id");
        $("#commentmodal").find("#uiqueitemid").html(itemid);
        $("#comment").val("");
        $("#commentmodal").show();
    },
    //submit button of  comment modal
    submitmodal : function(component,event,helper){
        var commentid = $("#uiqueitemid").html();
        var comment = $("#comment").val();
        var action = component.get("c.getplaybookUpdateComments");
        action.setParams({
            "itemid": commentid,
            "comment": comment,
            "userid":component.get("v.userid")
        });
        action.setCallback(this, function(response)
        {
           helper.binddata(component,helper,response,"getplaybookUpdateComments");
        });
        $A.enqueueAction(action);
        $("#commentmodal").hide();
    },
    getDetails:function(component,helper)
    {
        
        var action = component.get("c.getPersonaThemeViaEmail");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data = JSON.parse(response.getReturnValue());
                var result = data.result;
                var apiStatus=JSON.parse(response.getReturnValue()).status;
                 if(apiStatus==1)
                {
                   var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                    title : 'Processing...',
                    message: "Please wait while we're updating your profile. This page may refresh after that.",
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'success',
                    mode: 'dismissible' 
                });
        		toastEvent.fire();
                }
            
            else
            {
                var finalresponse=result.code;
                var finalmessage=result.msg;
                if(finalresponse==false)
                {
                       /*  var toastEvent = $A.get("e.force:showToast");
                             toastEvent.setParams({
                            title : 'Error',
                            message: finalmessage,
                            duration:' 5000',
                            key: 'info_alt',
                            type: 'error',
                            mode: 'dismissible' 
               		 });
        				toastEvent.fire();*/
                 }
                else
                {               
                var pagecss = result.pagecss;
                component.set("v.userid",result.userid.toString());
                component.set("v.mainnavfontcolor",pagecss.mainnavfontcolor);
                component.set("v.mainnavbgcolor",pagecss.mainnavbgcolor);
                component.set("v.subnavbgcolor",pagecss.subnavbgcolor);
                component.set("v.install",result.install);
                helper.callApi(component, helper,"getPlaybooksForCurrentUser",'','');
                helper.dynamicColorBinding(component,event,helper);   
                }
            }
            }
        });
        action.setBackground();
        $A.enqueueAction(action);
    },
    setCookie:function(cname, cvalue) {
        document.cookie = cname + "=" + cvalue + ";path=/";
    },
    dynamicColorBinding:function(component,event,helper){
        document.documentElement.style.setProperty('--mainnavbgcolor', component.get("v.mainnavbgcolor"));
    }
})