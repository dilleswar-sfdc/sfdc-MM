({
    playbook:'',
    body:'',
    divspinner:'',
	bindVideo : function(component,event,helper) {
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
               var items = [];
               var linkid = $.parseJSON(JSON.stringify(component.get("v.userdata"))).result.linkid;
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
               var isCall = true;
               var vimeoArr = [];
               for(var i = 0; i< dataitem.length; i++)
               {
                   
                   var item = {};
                   var _data = data.result.item[i];
                   var encrepteduserid = component.get("v.userdata").result.encrepteduserid;
                   var install = component.get("v.install");
                   var _metadata = $.parseJSON(_data.metadata);
                   item["id"] = _metadata.id;                   
                   if(_metadata.desc != null)
                   {
                       item["title"] = _metadata.desc;
                       if(_metadata.desc.length <= 130)
                           item["desc"] = _metadata.desc;
                       else
                           item["desc"] = _metadata.desc.substring(0,27);
                   }
                   else
                       item["desc"] = "No Description";
                   var thumb = component.get("v.userdata").result.currentDomain+'/v4u/img/video.jpg';
                   var noThumb = false;
                   var url = _metadata.url;
                   thumb = this.getVideoThumbnail(url);
                   if(thumb == "")
                   {
                       thumb = component.get("v.install") + "/v4u/img/video.jpg";
                       noThumb = true;                       
                   }
                   item["noThumb"] = noThumb;
                   item["imgUrl"] = thumb;
                   item["name"] = _metadata.name;
                   item["fileurl"] = _metadata.fileurl;
                   item["createdon"] = _metadata.createdon.split(' ')[0];
                   item["linkid"] = linkid;
                   item["linktype"] = _data.linktype;
                   item["updatedon"] = _data.updatedon;
                   item["nameurl"] = _metadata.fileurl+'?userid=' +encrepteduserid+ '&rand=1';
                   item["metadata"] = _data.metadata;
                   item["index"] = i;
                   items.push(item);
                   
               }
               jo["items"] = items;
               component.set("v.videos", jo);
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
        
        if(currentNav == "myvid")
        {
            $(".myvid").closest("tr").addClass("activenav");
            $(".myvid").addClass("blue");
            $(".myvid span").removeClass("inactive").addClass("active");
            component.set("v.currentNav","myvid");
            component.set("v.filetype","1");
            component.set("v.templatetype","8388608");
        }
        else if(currentNav == "sharedvid")
        {
            $(".sharedvid").closest("tr").addClass("activenav");
            $(".sharedvid").addClass("blue");
            $(".sharedvid span").removeClass("inactive").addClass("active");
            component.set("v.currentNav","sharedvid");
            component.set("v.filetype","2");
            component.set("v.templatetype","8388608");
        }
        else
        {
            $(".allvid").closest("tr").addClass("activenav");
            $(".allvid").addClass("blue");
            $(".allvid span").removeClass("inactive").addClass("active");
            component.set("v.currentNav","allvid");
            component.set("v.filetype","0");
            component.set("v.templatetype","8388608");
        }
        component.set("v.isfirst",true);
     	component.set("v.pages","0");
        component.set("v.currentpage","1");
        helper.bindVideo(component,event,helper);  
    },
    setCurrentNav:function(component,event,helper,classname)
    {
        if(classname.indexOf("allvid") != -1)
            component.set("v.currentNav","allvid");
     	else if(classname.indexOf("myvid") != -1)
            component.set("v.currentNav","myvid");
     	else if(classname.indexOf("sharedvid") != -1)
            component.set("v.currentNav","sharedvid");
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
    send:function(component,event,helper)
    {
        var _documents = {};
        var userdata = $.parseJSON(JSON.stringify(component.get("v.userdata"))).result;
        var install = component.get("v.install");
     	var index = $(event.currentTarget).attr("data-action");
        var rec = $.parseJSON(JSON.stringify(component.get("v.videos"))).items[index];
        var templatedata = $.parseJSON(rec.metadata);
        var filename = templatedata.name + " (Video)";
        if(rec.linkid == undefined || rec.linkid == null)
            rec.linkid = 0;
        var url = install+'/#v4u/ajax/widgets/sf-handler.cshtml?sftask=CreateAndSaveEmail&linkids='+rec.linkid+'&id='+templatedata.id+'&filename='+filename+'&handler=video&tpapp=sfdc&clean';        
     	helper.showEnablement(helper,component,url);
    },
    preview: function(component,event,helper)
    {
        var install = component.get("v.install");
     	var url = $(event.currentTarget).attr("data-action");
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
    //function to get video src
    getVideoThumbnail:function(url) {
        var src = '';
        if (url.indexOf('youtube.com') > -1) 
        {
            var id = url.split('/')[4]//.split('v=')[1].split('&')[0];
            var thumb = 'http://i2.ytimg.com/vi/' + id + '/hqdefault.jpg';
            src = thumb;
        }
        else if (url.indexOf('vidyard.com') > -1) 
        {
            var id = url.split('/')[3];
            var thumb = "http://play.vidyard.com/" + id + ".jpg"
            src = thumb;
        }
            else if (url.indexOf('wistia.com') > -1) 
            {
                var thumb = url + ".jpg";
                src = thumb;
            }
                else if (url.indexOf('wistia.net') > -1) {
                    $.ajax({
                        url: 'https://fast.wistia.net/oembed?url=' + url + "?embedType=async&videoWidth=640",
                        dataType: 'jsonp',
                        success: function (data) {
                            var thumb = data.thumbnail_url != undefined ? data.thumbnail_url : "//{$Site.HostPath}/v4u/img/video.jpg";
                            src = thumb;
                        }
                    });
                }
                    else if (url.indexOf('videos.amp.vg') > -1) {
                        var thumb = url.replace('.flv', '.png');
                        src = thumb;
                    }
                        else if (url.indexOf('vimeo.com') > -1) {
                            //return new Promise(function(resolve, reject) {
                                id = url.split('/')[4];
                                    $.ajax({
                                        url: 'https://vimeo.com/api/oembed.json?url=' + url,
                                        dataType: 'jsonp',
                                        success: function (data) {
                                            var thumb = data.thumbnail_url != undefined ? data.thumbnail_url : "//{$Site.HostPath}/v4u/img/video.jpg";
                                            src = thumb;
                                            //resolve(data);
                                        },
                                        error: function(res){
                                            //reject(res);
                                        }
                                    });
                            //});
                                                        
                        }
        return src;
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