({
    playbook:'',
    body:'',
    divspinner:'',
	bindPPT : function(component,event,helper) {
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
        var page = component.get("v.page").toString();
     	var pagesize = component.get("v.pagesize").toString();
        var sortfield = component.get("v.sortfield").toString();
        action1.setParams({
            "userid":userid,
            "filetype":"0",
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
               component.set("v.rowcount",data.result.row_count);
               var dataitem  = data.result.item;
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
                   item["name"] = _metadata.name;
                   item["desc"] = _metadata.desc;
                   item["imgUrl"] = "";
                   if(_metadata.thumbnailkey == undefined)
                   {
                       item["imgUrl"] = install+'/page/'+_metadata.firstpage + '/' + _metadata.updatedon + '/thumbnail.jpeg';
                   }
                   else
                       item["imgUrl"] = install+'/timg/'+ _metadata.thumbnailkey +'/img';
                   item["output"] = _metadata.output;
                   item["usedatasource"] = _metadata.usedatasource;
                   item["hasquestionnaire"] = _metadata.hasquestionnaire;
                   item["linkid"] = linkid;
                   item["linktype"] = _data.linktype;
                   item["updatedon"] = _data.updatedon;
                   item["metadata"] = _data.metadata;
                   item["index"] = i;
                   items.push(item);
               }
               jo["items"] = items;
               component.set("v.ppt", jo);
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
    leftnav:function(component,event,helper)
    {
        $(".folderlist").removeClass("activenav");
        $(".leftnavcolor").removeClass("blue");
        $(".leftnavcolor span").addClass("inactive");
        var currentNav = component.get("v.currentNav");        
        if(currentNav == "require")
        {
            $(".require").closest("tr").addClass("activenav");
            $(".require").addClass("blue");
            $(".require span").removeClass("inactive").addClass("active");
            component.set("v.currentNav","require");
            component.set("v.templatetype","16384");
            component.set("v.tabletype","1048577");
            component.set("v.isCustomized","true");
        }
     	else if(currentNav == "customize")
        {
            $(".customize").closest("tr").addClass("activenav");
            $(".customize").addClass("blue");
            $(".customize span").removeClass("inactive").addClass("active");
            component.set("v.currentNav","customize");
            component.set("v.templatetype","16384");
            component.set("v.tabletype","1048584");
            component.set("v.isCustomized","");
        }
     	else if(currentNav == "alldoc")
        {
            $(".alldoc").closest("tr").addClass("activenav");
            $(".alldoc").addClass("blue");
            $(".alldoc span").removeClass("inactive").addClass("active");
            component.set("v.currentNav","alldoc");
            component.set("v.templatetype","16384");
            component.set("v.tabletype","1048584,1048577");
            component.set("v.isCustomized","");
        }
        else
        {
            $(".direct").closest("tr").addClass("activenav");
            $(".direct").addClass("blue");
            $(".direct span").removeClass("inactive").addClass("active");
            component.set("v.currentNav","direct");
            component.set("v.templatetype","16384");
            component.set("v.tabletype","1048577");
            component.set("v.isCustomized","false");
        }
        component.set("v.isfirst",true);
     	component.set("v.pages","0");
        component.set("v.currentpage","1");
        helper.bindPPT(component,event,helper);
    },
    setCurrentNav:function(component,event,helper,classname)
    {
        if(classname.indexOf("direct") != -1)
            component.set("v.currentNav","direct");
     	else if(classname.indexOf("require") != -1)
            component.set("v.currentNav","require");
     	else if(classname.indexOf("customize") != -1)
            component.set("v.currentNav","customize");
     	else if(classname.indexOf("alldoc") != -1)
            component.set("v.currentNav","alldoc");
        helper.leftnav(component,event,helper);
    },
    search: function(component,event,helper)
    {
        $(".search").hide();
        $('.clear').show();
        var searchtext =component.find("searchfilter").get("v.value");
        component.set("v.searchtext",searchtext);
        var classname = $(".activenav").find(".leftnavcolor").attr("class");
        helper.setCurrentNav(component,event,helper,classname);
    },
    send: function(component,event,helper)
    {
        var install = component.get("v.install");
        var index = $(event.currentTarget).attr("data-action");
        var rec = $.parseJSON(JSON.stringify(component.get("v.ppt"))).items[index];
        var linkid = rec.linkid;
        var templatedata = $.parseJSON(rec.metadata);
        templatedata["isSmartlist"]=null;
     	templatedata["linkids"]=linkid;
     	templatedata["isContactcompany"]=null;
     	if (templatedata.output || (!templatedata.usedatasource && templatedata.hasquestionnaire == false))
        {
            var _templatedata = window.btoa(JSON.stringify(templatedata));
            var url = install+"#assets?function=sendPlaybook&templatedata=" + _templatedata+"&tpapp=sfdc&clean";
            helper.showEnablement(helper,component,url);
        }
    },
    sendtouser: function(component,event,helper)
    {
        var install = component.get("v.install");
        var index = $(event.currentTarget).attr("data-action");
        var rec = $.parseJSON(JSON.stringify(component.get("v.ppt"))).items[index];
        var linkid = rec.linkid;     	
        var templatedata = $.parseJSON(rec.metadata);
     	var id = templatedata.id;
        templatedata["isSmartlist"]=null;
     	templatedata["linkids"]="";
     	var url = "";
     	if (templatedata.output || (!templatedata.usedatasource && templatedata.hasquestionnaire == false))
        {
            var _templatedata = window.btoa(JSON.stringify(templatedata));
            var url = install+"#assets?function=sendUserToPartner&templatedata=" + _templatedata+"&tpapp=sfdc&clean";
            helper.showEnablement(helper,component,url);
        }
    },
    download: function(component,event,helper)
    {
        var install = component.get("v.install");
        var index = $(event.currentTarget).attr("data-action");
        var rec = $.parseJSON(JSON.stringify(component.get("v.ppt"))).items[index];
        var templatedata = $.parseJSON(rec.metadata);
        if(templatedata.output == 1 || (templatedata.usedatasource != 1 && templatedata.hasquestionnaire == false))
        {
            window.location = templatedata.downloadurl;
        }
    },
    customize: function(component,event,helper)
    {
        var userdata = component.get("v.userdata").result;
        var install = component.get("v.install");
        var index = $(event.currentTarget).attr("data-action");
        var rec = $.parseJSON(JSON.stringify(component.get("v.ppt"))).items[index];
        var linkid = rec.linkid;
        var templatedata = $.parseJSON(rec.metadata);
     	var url = '';
        if (!templatedata.output)
        {
            if(userdata.canPresentationCreate)
            {
                var name = "New Media";
                url = install+'/#v4u/ajax/widgets/sf-handler.cshtml?sftask=CreateTemporaryMedia&id='+templatedata.id+'&handler=ppt&name='+name+'&usedatasource='+templatedata.usedatasource + '&tpapp=sfdc&clean';
            }
        }
        else if(userdata.canPresentationCreate)
        {
            var _templatedata = window.btoa((JSON.stringify(templatedata)));
            url = install+"/#assets?function=showPresentationView&templatedata=" + _templatedata+"&clean"
        }
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
    setCookie:function(cname, cvalue) {
        document.cookie = cname + "=" + cvalue + ";path=/";
    },
    dropup: function(component,event,helper)
    {
        var index = $(event.currentTarget).attr("data-action");
        var dropup = component.find("dropup");
        var rowcount = component.get("v.rowcount");
        if(rowcount > 1)
        {
            $.each(dropup,function(i,val){
                if(i != index)
                    $A.util.addClass(dropup[i], "toggle");
            });
            $A.util.toggleClass(dropup[index], "toggle");
        }
        else
            $A.util.toggleClass(dropup, "toggle");
         
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