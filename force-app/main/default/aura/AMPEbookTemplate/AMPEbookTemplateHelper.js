({
    playbook:'',
    body:'',
    divspinner:'',
    bindEbook : function(component,event,helper)
    {
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
                                 //var data = {"result":{"schema":{"linktype":"int64","linkid":"int64","metadata":"string","updatedon":"datetime","flag5":"int32","flag6":"bool","flag7":"datetime","flag0":"int32","flag1":"bool","flag2":"bool","flag3":"datetime","flag4":"datetime","status":"byte","flag8":"int64","flag9":"int64","flag10":"int32","flag11":"int32","flag12":"int64","flag13":"int64","flag14":"float","flag15":"int16","flag16":"int16"},"item":[{"linktype":1048584,"linkid":51606,"metadata":"{\"version\":1,\"id\":51606,\"name\":\"connect it.pdf\",\"desc\":null,\"filters\":\"\",\"templatetype\":\"EBOOK\",\"firstpage\":\"62faa495-47b4-48bb-9664-8c56a69b2da3\",\"updatedon\":\"636657755500000000\",\"hasquestionnaire\":false,\"usedatasource\":false,\"templatekey\":\"cy5r90ldzmmz4\",\"userkey\":\"ddliw5ntm5gw2\",\"output\":true,\"startdate\":null,\"enddate\":null,\"createdon\":\"6/28/2018 9:39:09 AM UTC\",\"flag7\":\"6/28/2018 9:39:10 AM UTC\",\"useprojectsource\":0,\"enablewatermark\":false}","updatedon":"6/28/2018 9:39:22 AM UTC","flag5":0,"flag6":null,"flag7":"6/28/2018 9:39:10 AM UTC","flag0":256,"flag1":true,"flag2":false,"flag3":null,"flag4":null,"status":1,"flag8":210,"flag9":3467,"flag10":0,"flag11":0,"flag12":0,"flag13":0,"flag14":0,"flag15":null,"flag16":null}],"row_count":1},"status":0};
                                 var data = JSON.parse(response.getReturnValue());
                                 var jo = {};
                                 jo["status"] = data.status;
                                 var dataitem = data.result.item;
                                 component.set("v.nodata",false);
                                 component.set("v.rowcount",data.result.row_count);
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
                                 var pagination = [];
                                 for(var z = 0;z<=component.get("v.pages")-1;z++)
                                 {
                                     pagination.push(z+1);
                                 }
                                 component.set("v.pagination",pagination);
                                 component.set("v.hidepagination",true);
                                 var linkid = $.parseJSON(JSON.stringify(component.get("v.userdata"))).result.linkid;
                                 var items = [];
                                 for(var i = 0; i< dataitem.length; i++)
                                 {
                                     var item = {};
                                     var _data = dataitem[i];
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
                                     item["index"] = i;
                                     item["metadata"] = _data.metadata;
                                     items.push(item);
                                 }
                                 jo["items"] = items;
                                 component.set("v.ebookdata", jo);
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
        $(".mycustomized").closest("tr").addClass("activenav");
        $(".mycustomized").addClass("blue");
        $(".mycustomized span").removeClass("inactive").addClass("active");
        component.set("v.currentNav","alldoc");
        component.set("v.templatetype","256");
        component.set("v.tabletype","1048584");
        component.set("v.isCustomized","");
        component.set("v.isfirst",true);
     	component.set("v.pages","0");
        component.set("v.currentpage","1");
        helper.bindEbook(component,event,helper);
    },
    setCurrentNav:function(component,event,helper,classname)
    {
        if(classname.indexOf("mycustomized") != -1)
            component.set("v.currentNav","mycustomized");
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
        var rec = $.parseJSON(JSON.stringify(component.get("v.ebookdata"))).items[index];
        var linkid = rec.linkid;
        var templatedata = $.parseJSON(rec.metadata);
        templatedata["linkids"]=linkid;
        templatedata["isSmartlist"]=null;
        templatedata["isContactcompany"]=null;
        var _templatedata = window.btoa(JSON.stringify(templatedata));
        var url = install+"/#assets?function=sendEbook&templatedata=" + _templatedata +"&tpapp=sfdc&clean";
     	helper.showEnablement(helper,component,url);
    },
    customize:function(component,event,helper)
    {
        var userdata = component.get("v.userdata").result;
        var install = component.get("v.install");
     	var index = $(event.currentTarget).attr("data-action");
        var rec = $.parseJSON(JSON.stringify(component.get("v.ebookdata"))).items[index];
        var linkid = rec.linkid;
        var templatedata = $.parseJSON(rec.metadata);
        
        templatedata["cansend"]= userdata.caneBookSend;
        templatedata["canpublish"]= userdata.caneBookPublish;
        templatedata["canedit"]= userdata.caneBookEdit;
        templatedata["customize"]=true;
        templatedata["linkids"]=linkid;
        templatedata["isSmartlist"]=null;
        templatedata["isContactcompany"]=null;
        templatedata["status"]=1;
        var _templatedata = window.btoa((JSON.stringify(templatedata)));
        var url = install+"/#assets?function=showEbook&templatedata=" + _templatedata+"&tpapp=sfdc&clean";
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