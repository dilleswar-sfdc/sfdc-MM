({
    scriptLoaded : function(component, event, helper) 
    {
        component.set("v.isShownInModal",true);
        component.set("v.dataRoomID",0);
		helper.assetscontainer = $('.assetscontainer');
        helper.assetrecord =  $(".assetrecord");
		helper.getAssetRecord(component,event,helper);
    
        
    },
    
    parentComponentEvent : function(component,event,helper){
        var tabName = event.getParam("tabNameData");
        var isMedia  = event.getParam("isMedia");
        var page = event.getParam("cmpPages");                                                   
        component.set('v.filterFlag',event.getParam("filterflag"));
        var modalSearchText = event.getParam("searchtextModal");
        var selectOption = event.getParam("selectOption"); 
        component.set("v.flagcount",event.getParam("flagcountVal"));
        var currenttabfolderEnum = event.getParam("currenttabfolderENum");
        var currentFolder = event.getParam("currentFolder");
        var filterIds = event.getParam("filterId");
        component.set("v.filterids",filterIds);
        component.set("v.conditionVal",event.getParam("conditionval"));
        component.set("v.searchtxt",modalSearchText);
        if(tabName == "All" ){
            if(isMedia == 1){
                component.set("v.isMedia",isMedia);
                component.set("v.currentTabFolderEnum",currentFolder);
                if(page > 0){
                    component.set("v.page",page);
                    if(event.getParam("check")== 0)
                            component.set("v.flagcount",false);
                        else
                        	component.set("v.flagcount",true);
                    helper.getAssetSearchRecord(component,event,helper,tabName);
                }else{
                    component.set("v.page",0);
                    if(event.getParam("flagcountVal")){
                        helper.gettabcount(component,event,helper);
                    }else{
                        if(event.getParam("check")== 0)
                            component.set("v.flagcount",false);
                        else
                        	component.set("v.flagcount",true);
                    	helper.getAssetSearchRecord(component,event,helper,tabName);
                    }
                }
            }else if(isMedia == 0) {
                
                component.set("v.isMedia",isMedia);
                component.set("v.currentTabFolderEnum",currentFolder);
                if(page > 0){
                    component.set("v.page",page);
                    if(event.getParam("check")== 0)
                            component.set("v.flagcount",false);
                        else
                        	component.set("v.flagcount",true);
                    helper.getAssetSearchRecord(component,event,helper,tabName);
                }else{
                    component.set("v.page",0);
                    if(event.getParam("flagcountVal")){
                        helper.gettabcount(component,event,helper);
                    }else{
                        if(event.getParam("check")== 0)
                            component.set("v.flagcount",false);
                        else
                        	component.set("v.flagcount",true);
                    helper.getAssetSearchRecord(component,event,helper,tabName);
                    }
                }
            }else{
                 //component.set("v.flag",true);
                component.set("v.currentTabFolderEnum",currentFolder);
                if(page > 0){
                    component.set("v.page",page);
                    helper.getAssetSearchRecord(component,event,helper,tabName);
                }else{
                    component.set("v.page",0);
                    helper.getAssetSearchRecord(component,event,helper,tabName);
                }
            }
        }else{
            if(isMedia == 1){
                component.set("v.isMedia",isMedia);
                component.set("v.currentTabFolderEnum",currenttabfolderEnum);
                if(page > 0){
                    component.set("v.page",page);
                    if(event.getParam("check")== 0)
                            component.set("v.flagcount",false);
                        else
                        	component.set("v.flagcount",true);
                    helper.getAssetSearchRecord(component,event,helper,tabName); 
                }else{
                    component.set("v.page",0);
                     if(event.getParam("flagcountVal")){
                        helper.gettabcount(component,event,helper);
                    }else{
                        if(event.getParam("check")== 0)
                            component.set("v.flagcount",false);
                        else
                        	component.set("v.flagcount",true);
                    helper.getAssetSearchRecord(component,event,helper,tabName,modalSearchText);
                    }
                }
            }else if(isMedia == 0){
                component.set("v.isMedia",isMedia);
                component.set("v.currentTabFolderEnum",currenttabfolderEnum);
                if(page > 0){
                    component.set("v.page",page);
                    if(event.getParam("check")== 0)
                            component.set("v.flagcount",false);
                        else
                        	component.set("v.flagcount",true);
                    helper.getAssetSearchRecord(component,event,helper,tabName); 
                }else{
                    component.set("v.page",0);
                     if(event.getParam("flagcountVal")){
                        helper.gettabcount(component,event,helper);
                    }
                    else{
                        if(event.getParam("check")== 0)
                            component.set("v.flagcount",false);
                        else
                        	component.set("v.flagcount",true);
                    helper.getAssetSearchRecord(component,event,helper,tabName,modalSearchText);
                    }
                }
            }else{
                component.set("v.currentTabFolderEnum",currenttabfolderEnum);
                if(page > 0){
                    component.set("v.page",page);
                    helper.getAssetSearchRecord(component,event,helper,tabName);
                }else{
                    component.set("v.page",0);
                    helper.getAssetSearchRecord(component,event,helper,tabName,modalSearchText); 
                }
            }
        }
    },
  /*  onUncheck : function(component,event,helper){
        component.set("v.spinner",true);
        component.set("v.nodata",false);
        helper.onUncheck(component,event,helper);
    },
    onSelect : function(component,event,helper){
        var currentAsset = event.currentTarget;
        var parentdiv =$(currentAsset).closest('div[class^="slds-box"]');
        if (parentdiv.hasClass("selected")){
            $(currentAsset).text("select");
            parentdiv.removeClass("selected");
        }else{
            parentdiv.addClass("selected"); 
            $(currentAsset).text("deselect");
        }
    },
    cardView : function(component,event,helper){
        $(".slds-box").addClass("cardviewCss");
   },
    thumbnailView : function(component,event,helper){
        $(".slds-box").removeClass("cardviewCss");
    },
    closeModel : function(component,event,helper){
        component.set("v.AdvSearchModal",false);
    },
    AdvSearch : function(component,event,helper){
        helper.AdvSearch(component,event,helper);                                
    },
    submit : function(component,event,helper){
       helper.submit(component,event,helper);
    },
   	dropup : function(component,event,helper){
		helper.dropup(component,event,helper); 
   	},
    handleKeyUp : function(component,event,helper){
        var id = component.get("v.selTabId");
        var tabsData = component.get("v.tabs");
        $(helper.assetrecord).find('.rotate').addClass("rotate-me");
        var tabSelected = $.grep(component.get('v.tabs'), function (element, index) {
            return element.TabName == id;
        });
        var tabName = tabSelected[0].TabName;
        var isEnterKey = event.keyCode === 13;
        var tab = component.get("v.tabs");
        if (isEnterKey) {
            var queryTerm = component.find('entersearch').get('v.value');
            component.set("v.searchtxt",queryTerm);
            component.set("v.spinner",true);
            
            component.set("v.nodata",false);
            helper.getAssetSearchRecord(component,event,helper,tabName);
        }
    },
    tabSelected:function(component, event, helper){},
    clear: function(component, event, helper)
    {
        var e = event.currentTarget;
        $(".search").show();
        $(e).hide();
        //component.find("searchfilter").set("v.value","");
        component.set("v.searchtext","");
        component.set("v.isfilter",false);
        component.set("v.filter","");
        var page =  1;
        component.set("v.page",parseInt(page-1));
        helper.getAssetRecord(component,event,helper);
    },
    handleActive:function(component,event,helper)
    {
        helper.handleActive(component,event,helper);
    },
    handleSorting:function(component,event,helper)
    {
        var page =  1;
        component.set("v.page",parseInt(page-1));
        var sortvalue = event.getSource().get("v.value").toString();
        component.set("v.sortfield",sortvalue);
        helper.getAssetRecord(component,event,helper);
    },
    handleOrder:function(component,event,helper)
    {
        var page =  1;
        component.set("v.page",parseInt(page-1));
        var sortvalue = event.getSource().get("v.value").toString();
        component.set("v.sortorder",sortvalue);
        helper.getAssetRecord(component,event,helper);
    },
    next:function(component,event,helper){
        component.set("v.spinner",true);
		$(helper.assetrecord).find('.rotate').addClass("rotate-me");
        var id = component.get("v.selTabId");
        var tabsData = component.get("v.tabs");
        var tabSelected = $.grep(component.get('v.tabs'), function (element, index) {
            return element.TabName == id;
        });
        var tabName = tabSelected[0].TabName;
        var page = component.get("v.page");
        if(page + 1 == component.get("v.pages")/component.get("v.pagesize"))
            return;
        component.set("v.page",++page);
        component.set("v.currentpage",(component.get("v.page")+1));
        helper.getAssetSearchRecord(component,event,helper,tabName);
    },
    prev:function(component,event,helper){
        component.set("v.spinner",true);
		$(helper.assetrecord).find('.rotate').addClass("rotate-me");
        var id = component.get("v.selTabId");
        var tabsData = component.get("v.tabs");
        
        var tabSelected = $.grep(component.get('v.tabs'), function (element, index) {
            return element.TabName == id;
        });
        var tabName = tabSelected[0].TabName;                                  
        var page = component.get("v.page");
        if(page == 0)
            return;
        component.set("v.page",--page);
        component.set("v.currentpage",(component.get("v.page")+1));
        helper.getAssetSearchRecord(component,event,helper,tabName);
    },
    paginate:function(component,event,helper){
        var page =  event.getSource().get("v.class").replace('page-','');
        component.set("v.page",parseInt(page-1));
        helper.getAssetRecord(component,event,helper);
    },
   handleComponentEvent : function(component, event) {
        var data = event.getParam("data");
		data = JSON.parse(JSON.stringify(data));
        var currentnav = data.currentnav.toString();
        component.set("v.pages", 0);
       // component.set("v.currentNav",currentnav);
        var rowCount= component.get("v.rowcount");
        component.set("v.rowcount",rowCount);
        component.set("v.isfirst",data.isfirst);
        component.set("v.istab",data.istab);
        if(component.get("v.istab"))
        {
            component.set("v.currentpage", 1);
            component.set("v.page", 0);
        }
   },
    rotatesysclick : function(component,event,helper){
        helper.rotatesysclick(component,event,helper);
    },
    selectOption : function(component,event,helper){
        component.set("v.spinner",true);
        $(helper.assetrecord).find('.rotate').addClass("rotate-me");
        var id = component.get("v.selTabId");
        var tabsData = component.get("v.tabs");
        var tabSelected = $.grep(component.get('v.tabs'), function (element, index) {
            return element.TabName == id;
        });
        var tabName = tabSelected[0].TabName;                                         
        var select = component.find("dropdownId").get("v.value");
        var selectOption = component.set("v.select",select);
        if(selectOption == "Include Mine"){
            component.set("v.isMedia",1);
            
            helper.getAssetSearchRecord(component,event,helper,tabName);
        }else{
            component.set("v.isMedia",0);
            helper.getAssetSearchRecord(component,helper,event,tabName);
        }
    },
    publish : function(component,event,helper){
        helper.publish(component,event,helper);
       
    },
    ebook : function(component,event,helper){
         helper.ebook(component,event,helper);
    },
    select : function(component,event,helper){
        var currentSelect = $(event.currentTarget);
        var parentdiv = $(currentSelect).closest("div");
                                              
    },
    send : function(component,event,helper){
        helper.send(component,event,helper);
    },
    customize : function(component,event,helper){
        helper.customize(component,event,helper);
    },
    view : function(component,event,helper){
        helper.view(component,event,helper);
    },
    modalCheck : function(component,event,helper){
        helper.modalCheck(component,event,helper);
    },
    SendToUsers : function(component,event,helper){
        helper.SendToUsers(component,event,helper);
    },
    download : function(component,event,helper){
        helper.download(component,event,helper);
    },
    preview: function(component,event,helper){
        helper.preview(component,event,helper);
    },
    addToRoom : function(component,event,helper){
        helper.addToRoom(component,event,helper)
    },
    report : function(component,event,helper){
        helper.report(component,event,helper);
    },
    loginToActivate : function(component,event,helper){
        
    },
    PrintVendor : function(component,event,helper){
        helper.PrintVendor(component,event,helper);
    },
    rating :function(component,event,helper){
        helper.rating(component,event,helper);
    },
    copy : function(component,event,helper){
        helper.copy(component,event,helper);
    }*/
    
})