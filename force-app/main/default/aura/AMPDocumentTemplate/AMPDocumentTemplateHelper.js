({
    playbook:'',
    body:'',
    divspinner:'',
	bindDocument : function(component,event,helper) {
		$(helper.divspinner).show();
        $(helper.body).hide();
        $(helper.playbook).find('.refresh-me').addClass("rotate-me");
        if(!component.get("v.isfirst"))
        	helper.leftnav(component,event,helper);
        var action1 = component.get("c.getAssetsRecords");
        var userid = component.get("v.userid");
        var templatetype = component.get("v.templatetype");
        var tabletype = component.get("v.tabletype");
        var templatesearch = component.get("v.templatesearch");
        var searchtext = component.get("v.searchtext");
        var isCustomized = component.get("v.isCustomized");
        var filetype = component.get("v.filetype");
        var page = component.get("v.page").toString();
     	var pagesize = component.get("v.pagesize").toString();
        var sortfield = component.get("v.sortfield").toString();
        action1.setParams({
            "userid":userid,
            "filetype":filetype,
            "templateType":templatetype,
            "status":"1",
            "tableType":tabletype,
            "isCustomized":isCustomized,
            "templateSearch":templatesearch,
            "searchtext":searchtext,
            "page":page,
         	"pagesize":pagesize,
            "sortfield":"updatedon",
        });
        action1.setCallback(this, function(response)
        {
          var state = response.getState();
           if(state === 'SUCCESS')
           {
               var data = JSON.parse(response.getReturnValue());               
               var jo = {};
               jo["status"] = data.status;
               var dataitem  = data.result.item;
               component.set("v.rowcount",data.result.row_count);
               component.set("v.nodata",false);
               if(dataitem.length < 1 || data.status == 1)
               {
                   try{
                        if(data.status != 1){
                        	component.set("v.pages",Math.ceil(data.result.row_count/component.get("v.pagesize")));
                            component.set("v.pagination",component.get("v.pages"));
                            helper.fireComponentEvent(component,event,helper);
                        }
                    }
                    catch(e){}
                   component.set("v.nodata",true);
                   $(helper.playbook).find('.refresh-me').removeClass("rotate-me");
                   $(helper.divspinner).hide();
        		   $(helper.body).show();
                   return;
               }
               
               var jo = {};
               jo["status"] = data.status;
               var dataitem  = data.result.item;
               var linkid = $.parseJSON(JSON.stringify(component.get("v.userdata"))).result.linkid;
               var items = [];
               var sort = component.get("v.sortfield");
               var order = component.get("v.sortorder");
               dataitem = dataitem.sort(function(a, b){
                   var sortedData = "";
                   if(sort == "updatedon")
                   {
                       if(order == "asc")
                           sortedData =  new Date(a.updatedon) - new Date(b.updatedon);
                       else
                           sortedData =  new Date(b.updatedon) - new Date(a.updatedon);
                   }                      
                   else if(sort == "createdon")
                   {
                       if(order == "asc")
                           sortedData =  new Date($.parseJSON(a.metadata).createdon) - new Date($.parseJSON(b.metadata).createdon);
                       else
                           sortedData =  new Date($.parseJSON(b.metadata).createdon) - new Date($.parseJSON(a.metadata).createdon);
                   }                       
                   else if(sort == "name")
                   {
                       if(order == "asc")
                           sortedData =  ($.parseJSON(a.metadata).name.toLowerCase()) > ($.parseJSON(b.metadata).name.toLowerCase());
                       else
                           sortedData =  ($.parseJSON(a.metadata).name.toLowerCase()) < ($.parseJSON(b.metadata).name.toLowerCase());
                   }
                   return sortedData;
               });
               component.set("v.pages",Math.ceil(data.result.row_count/component.get("v.pagesize")))
               
               for(var i = 0; i< dataitem.length; i++)
               {
                   var item = {};
                   var _data = data.result.item[i];
                   var install = component.get("v.install");
                   var _metadata = $.parseJSON(_data.metadata);
                   item["id"] = _metadata.id;
                   item["title"] = _metadata.name;
                   if(_metadata.name <= 30)
                       item["name"] = _metadata.name;
                   else
                       item["name"] = _metadata.name.substring(0,27);
                   
                   item["desc"] = _metadata.desc;
                   item["filesize"] = _metadata.filesize;
                   item["fileurl"] = _metadata.fileurl;
                   item["createdon"] = _metadata.createdon.split(' ')[0];
                   item["itemupdatedon"] = _metadata.updatedon.split(' ')[0];
                   item["linkid"] = linkid;
                   item["linktype"] = _data.linktype;
                   item["updatedon"] = _data.updatedon;
                   item["metadata"] = _data.metadata;
                   item["index"] = i;
                   items.push(item);
               }
               jo["items"] = items;
               component.set("v.document", jo);
               $(helper.playbook).find('.refresh-me').removeClass("rotate-me");
               $(helper.divspinner).hide();
               $(helper.body).show();
               component.set("v.isfirst",false);
               helper.fireComponentEvent(component,event,helper);
           }
        });
        action1.setBackground();
        $A.enqueueAction(action1);
	},
    leftnav: function(component,event,helper,classname)
    {
        $(".folderlist").removeClass("activenav");
        $(".leftnavcolor").removeClass("blue");
        $(".leftnavcolor span").addClass("inactive");
        var currentNav = component.get("v.currentNav");

     	if(currentNav == "mydoc")
        {
            $(".mydoc").closest("tr").addClass("activenav");
            $(".mydoc").addClass("blue");
            $(".mydoc span").removeClass("inactive").addClass("active");
            component.set("v.currentNav","direct");
            component.set("v.filetype","1");
            component.set("v.templatetype","2097152");
        }
     	else if(currentNav == "shareddoc")
        {
            $(".shareddoc").closest("tr").addClass("activenav");
            $(".shareddoc").addClass("blue");
            $(".shareddoc span").removeClass("inactive").addClass("active");
            component.set("v.currentNav","direct");
            component.set("v.filetype","2");
            component.set("v.templatetype","2097152");
        }
        else
        {
            $(".alldoc").closest("tr").addClass("activenav");
            $(".alldoc").addClass("blue");
            $(".alldoc span").removeClass("inactive").addClass("active");
            component.set("v.currentNav","direct");
            component.set("v.filetype","0");
            component.set("v.templatetype","2097152");
        }
        component.set("v.isfirst",true);
     	component.set("v.pages","0");
        component.set("v.currentpage","1");
        helper.bindDocument(component,event,helper);
    },
    setCurrentNav:function(component,event,helper,classname)
    {
        if(classname.indexOf("alldoc") != -1)
            component.set("v.currentNav","alldoc");
     	else if(classname.indexOf("shareddoc") != -1)
            component.set("v.currentNav","shareddoc");
     	else if(classname.indexOf("mydoc") != -1)
            component.set("v.currentNav","mydoc");
        helper.leftnav(component,event,helper);
    },
    search: function(component,event,helper)
    {
        $(".search").hide();
        $('.clear').show();
        var searchtext =component.find("searchfilter").get("v.value");
        component.set("v.searchtext",searchtext);
        var classname = $(".activenav").find(".leftnavcolor").attr("class");
        helper.leftnav(component,event,helper,classname);
    },
    send:function(component,event,helper)
    {
        var _documents = {};
        var userdata = component.get("v.userdata").result;
        var install = component.get("v.install");
     	var index = $(event.currentTarget).attr("data-action");
        var rec = $.parseJSON(JSON.stringify(component.get("v.document"))).items[index];
        var templatedata = $.parseJSON(rec.metadata);
        var filename = templatedata.name + " (" + helper.getFileSize(templatedata.filesize) + ")";
        var url = install+'/#v4u/ajax/widgets/sf-handler.cshtml?sftask=CreateAndSaveEmail&linkids='+rec.linkid+'&id='+templatedata.id+'&filename='+filename+'&tpapp=sfdc&clean';        
     	helper.showEnablement(helper,component,url);
    },
    preview:function(component,event,helper)
    {
        var userdata = component.get("v.userdata").result;
        if(userdata.canPreviewAssets)
        {
            var url = $(event.currentTarget).attr("data-url");
            helper.showEnablement(helper,component,url);
        }
     	
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
    setCookie:function(cname, cvalue) {
        document.cookie = cname + "=" + cvalue + ";path=/";
    },
    getFileSize:function(size) {
        if (size < 1024) {
            return size + " bytes";
        }
        else if (size < 1024 * 1024) {
            return Math.floor(size / 1024) + "kb";
        }
            else if (size < 1024 * 1024 * 1024) {
                return Math.floor(size / 1024 / 1024) + "mb";
            }
                else if (size < 1024 * 1024 * 1024 * 1024) {
                    return Math.floor(size / 1024 / 1024 / 1024) + "gb";
                }
                    else if (size < 1024 * 1024 * 1024 * 1024 * 1024) {
                        return Math.floor(size / 1024 / 1024 / 1024 / 1024) + "tb";
                    }
        
        return size;
    },
    fireComponentEvent : function(component, event) {
        // Get the component event by using the
        // name value from aura:registerEvent
        var pages = component.get("v.pages");
        var cmpEvent = component.getEvent("cmpEvent");
        var jo = {
            "pages":pages,
            "currentnav":component.get("v.currentNav"),
            "isfirst":component.get("v.isfirst"),
            "currentpage":component.get("v.currentpage"),
            "istab":component.get("v.istab")
        }
        cmpEvent.setParams({
            "data" : jo 
        });
        cmpEvent.fire();
    }
})