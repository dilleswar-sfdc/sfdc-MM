({
    enablement:'',
    iplaybookv1body:'',
    internalplaybook:'',
    ampdashboard:'',
    enablementtag:'',
    independentmodal:'',
    ampdashboardwithmenu:'',
    commentmodal:'',
    comment:'',
    filter:'',
    playbook:'',
    sessionID:'',
    AuthenticateCurrentUser:function(component, event, helper){
        var action = component.get("c.AuthenticateSFUser");
        action.setParams({
            "createuserviasso": component.get("v.createuserviasso")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var getapiState=JSON.parse(response.getReturnValue()).status;
                if(getapiState==1)
                {
                    component.set("v.nodata",true);
                    component.set("v.errorMsg","Please wait while we're updating your profile.");
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title : 'Processing...',
                        message: "Please wait while we're updating your profile.",
                        duration:' 5000',
                        key: 'info_alt',
                        type: 'info',
                        mode: 'dismissible' 
                    });
                    toastEvent.fire();
                }
                else{
                   	var data = JSON.parse(response.getReturnValue());
                    if(data.result.userfound == true){
                        if(data.result.tos == false){
                            component.set('v.isOpen',true);
                            var url = data.result.installurl + "/?elt=" + data.result.usersessionid + "&returnurl=toschangepasswordsetting";
                            component.set("v.iframesrc",url);
                        }
                    }
                    var finalresponse=data.result.code;
                    var finalmessage=data.result.msg;
                    if(finalresponse==false)
                     {
                         component.set("v.nodata",true);
                         component.set("v.errorMsg","Sorry!"+""+"In DashboardInternalPlaybook"+""+finalmessage);
                         var toastEvent = $A.get("e.force:showToast");
                         toastEvent.setParams({
                             title : 'Info Message',
                             message: finalmessage,
                             duration:' 5000',
                             key: 'info_alt',
                             type: 'info',
                             mode: 'dismissible' 
                         });
                         toastEvent.fire();
                     }
                    else{
                        if(data.result.authentic)
                        {
                            helper.sessionID = data.result.usersessionid;
                            helper.UpdateToken(component,helper,data.result.usertoken,data.result.newuser);
                            component.set("v.showwidget","block");
                            if(!data.result.newuser){
                                helper.processcmp(component,helper);
                            }                            
                        }
                    }
                }
            }
        });
        $A.enqueueAction(action);
    },
    processcmp:function(component,helper){
        if(component.get("v.dependantwidget") == "oneapp")
        {
            helper.getInternalPlaybookForUser(component, event, helper);
        }
        else
            helper.getDetails(component, helper);
    },
    UpdateToken:function(component,helper,token,newuser){
        var action = component.get("c.UpdateToken");
        action.setParams({
            "token": token
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                if(newuser){
                    helper.processcmp(component,helper);
                }
            }
        });
        $A.enqueueAction(action);
    },
    createAuthorizedComponent : function(component)
    {
        $A.createComponent('c:AMPAuthorized',{} , function (contentComponent, status, error) {
            if (status === "SUCCESS") {
                component.set('v.unauthorized', contentComponent);
            } else {
                throw new Error(error);
            }
        });
	},
    getInternalPlaybookForUser : function(component, event, helper){
        this.callApi(component, helper,"getPlaybooksForCurrentUser",'','');
        
    },
    //call api to get data of internalplaybook
    callApi : function(component, helper,method,itemid,comment)
    {
        helper.dynamicColorBinding(component,event,helper);
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
        var apiName = "";
        if(method == "getplaybookUpdateComments")
        {
            apiName = "c.getplaybookUpdateComments";
        }
        else
            apiName = "c.getPlaybooksForCurrentUser";
        var action = component.get(apiName);
        if(method == "getplaybookUpdateComments"){
            action.setParams({
                "itemid": itemid,
                "comment": comment,
                "userid":component.get("v.userid")
            });
        }
        else
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
                var getapiState = JSON.parse(response.getReturnValue()).status;
                if(getapiState == 1){
                    component.set("v.nodata",true);
                    component.set("v.errorMsg","An issue occured with the Mindmatrix widget, please contact admin");
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title : 'Error Message',
                        message: "An issue occured with the Mindmatrix widget, please contact admin",
                        duration:' 5000',
                        key: 'info_alt',
                        type: 'info',
                        mode: 'dismissible' 
                    });
                    toastEvent.fire(); 
                }else{
                    var data = JSON.parse(response.getReturnValue());
                    var finalresponse=data.result.code;
                    var finalmessage=data.result.msg;
                     if(finalresponse==false)
                     {
                         var toastEvent = $A.get("e.force:showToast");
                         toastEvent.setParams({
                             title : 'Info Message',
                             message: finalmessage,
                             duration:' 5000',
                             key: 'info_alt',
                             type: 'info',
                             mode: 'dismissible' 
                         });
                         toastEvent.fire();
                         $(helper.internalplaybook).find(".paginate").hide();
                         $(helper.internalplaybook).find(".divspinner").hide();
                         $(helper.internalplaybook).find(".errorMsg").show();
                         $(helper.internalplaybook).find('.errorMsg').html("Sorry!"+" "+finalmessage);
                         $(helper.playbook).find('.refresh-me').removeClass("rotate-me");
                     }else{
                         if(method == "getplaybookUpdateComments"){
                             var toastEvent = $A.get("e.force:showToast");
                             if(toastEvent){
                                 toastEvent.setParams({
                                     "title": "Success!",
                                     "message": "Your comment has been updated successfully.",
                                     type:'success'
                                     
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
                         //var data = JSON.parse(response.getReturnValue());
                         var failed = data.status == 1 || data.result.item == undefined;
                         if(!failed)
                             failed = data.result.item.length < 1;
                         if(failed)
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
                                 if(_data.original.indexOf('no-image') > -1)
                                     item['noImage']=true;
                                 else
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
                                 item["activecontacts"]=_data.activecontacts;
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
                             var length = jo.item.length;
                             //(length > 3) ? $(".internalPlaybooksection").addClass("enableplaybookslider") : $(".internalPlaybooksection").addClass("disableplaybookslider");
                             setTimeout(function() {
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
                                 try{
                                     
                                     if ($('.slickslider').hasClass('slick-initialized')) {
                                         $('.slickslider').slick('destroy');
                                     }
                                     $('.slickslider').slick({
                                         dots: true,
                                         infinite: true,
                                         speed: 300,
                                         slidesToShow: component.get("v.sliderlength"),
                                         slidesToScroll: component.get("v.sliderlength"),
                                     });
                                 }
                                 catch(e){
                                     e.message;
                                 }   
                             },100);
                         }
                         $(helper.internalplaybook).find(".paginate").show();
                         $(helper.internalplaybook).find(".divspinner").hide();
                         $(helper.iplaybookv1body).show();
                         $(helper.playbook).find('.refresh-me').removeClass("rotate-me");
                         //$(helper.internalplaybook).removeClass("slds-hide");
                         return;
                     }
                }
            }
    },
    closeToast:function(component){$A.util.addClass(component.find("successToast"), "slds-hide");},
    //display data in a tab
    displayenablement : function(component,event,helper,index,e){
        event.stopImmediatePropagation();                                              
        var e = event.currentTarget;                            
        var _class = $(e).attr("class");
        var index = _class.indexOf("thumb-wrap");
        var url = '';
        var install = component.get("v.install") + '//?elt=' + helper.sessionID;
        if(index == 0)
        {
            var templateid = $(e).attr("id");
         	url = install+"&clean#internalplaybook/"+templateid;
        }
        else
            url = install+$(e).find(".src").html();
        	helper.showEnablement(helper,component,url);
    },
    showEnablement:function(helper,component,src)
    {
        window.name = src;
        if(component.get("v.dependantwidget") == "oneapp")
        {
            helper.setCookie("showplaybook", false);
            var urlEvent = $A.get("e.force:navigateToURL");
            urlEvent.setParams({
                "url": "/one/one.app#/n/Enablement"
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
        var install = component.get("v.install") + '//?elt=' + helper.sessionID;
        var url = install+"&clean#internalplaybook/"+templateid;
        $(helper.enablement).attr('src',url);
        $(helper.ampdashboard).hide();
        $(helper.enablementtag).show();
    },
    //open comment modal in internalplaybook
    opencommentmodal : function(component,event,helper){
        var e = event.currentTarget;
        var itemid = $(e).attr("id");
        $(helper.commentmodal).find("#uiqueitemid").html(itemid);
        $(helper.comment).val("");
        $(helper.commentmodal).show();
    },
    //submit button of  comment modal
    submitmodal : function(component,event,helper){
        var commentid = $(helper.commentmodal).find("#uiqueitemid").html();
        var comment = $(helper.comment).val();
        
        
        var action = component.get("c.getplaybookUpdateComments");
        action.setParams({
            "itemid": commentid,
            "comment": comment,
            "userid":component.get("v.userid")
        });
        action.setCallback(this, function(response){
            
            var message = ""
            var title = "";
            var type = "";
            var state = response.getState();
            if(state === "SUCCESS")
            {
                title = "Success!";
                message = "Your comment has been updated successfully.";
                type = 'success';
                
            }
            else{
                title = "Failed!";
                message = "Your comment was not saved.";
                type = 'failed';
            }
            var toastEvent = $A.get("e.force:showToast");
            if(toastEvent){
                toastEvent.setParams({
                    "title": title,
                    "message": message,
                    type:type
                    
                });
                toastEvent.fire();
            }
            else
            {
                component.set("v.message",message);
                $A.util.removeClass(component.find("successToast"), "slds-hide");
                setTimeout(function(){
                    helper.closeToast(component);
                },1000);   
            }
            $(helper.commentmodal).hide();
        });
        $A.enqueueAction(action);
    },
    getDetails:function(component,helper)
    {
        var action = component.get("c.GetPersonaThemeForCurrentUser");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var apigetState = JSON.parse(response.getReturnValue()).status;
                if(apigetState == 1){
                      component.set("v.nodata",true);
                    	component.set("v.errorMsg","Please contact Admin for further ");
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
                else{
                    var data = JSON.parse(response.getReturnValue());
                     var finalresponse=data.result.code;
                     var finalmessage=data.result.msg;
                    if(finalresponse==false)
                     {
                         component.set("v.nodata",true);
                         component.set("v.errorMsg","Sorry!"+""+"In DashboardInternalPlaybook"+""+finalmessage);
                         var toastEvent = $A.get("e.force:showToast");
                         toastEvent.setParams({
                             title : 'Info Message',
                             message: finalmessage,
                             duration:' 5000',
                             key: 'info_alt',
                             type: 'error',
                             mode: 'dismissible' 
                         });
                         toastEvent.fire();
                     }
                    else{
                         var result = data.result;
                         var pagecss = result.pagecss;
                         component.set("v.userid",result.userid.toString());
                         component.set("v.mainnavfontcolor",pagecss.mainnavfontcolor);
                         component.set("v.mainnavbgcolor",pagecss.mainnavbgcolor);
                         component.set("v.subnavbgcolor",pagecss.subnavbgcolor);
                         component.set("v.install",result.install);
                         helper.callApi(component, helper,"getPlaybooksForCurrentUser",'','');
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
        document.documentElement.style.setProperty('--playbookwidth', component.get("v.playbookwidth"));
    }
})