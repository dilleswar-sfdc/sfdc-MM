({	
    scriptLoaded : function(component,event,helper){
        component.set("v.spinner",true);
        component.set("v.nodata",false);
        $A.util.addClass(component.find("TabDataId"),'tabborder'); 
        helper.assetrecord =  $(".assetrecord");
        $(helper.assetrecord).find('.rotate').addClass("rotate-me");
    },
    onconditionclick :function(component, event, helper) {
        helper.onconditionclick(component,event,helper);
    },
    filterclick  : function(component, event, helper) {
        helper.filterclick(component,event,helper);           
    },
    allfilterClear :function(component, event, helper) {
        component.set("v.itemss",null);
        component.set("v.spinner",true);
        component.set("v.nodata",false);
        $(helper.assetrecord).find('.rotate').addClass("rotate-me");
        if(helper.filterIds.length != 0){
            for(var i=0;i<helper.filterIds.length;i++){
                if ($("#"+helper.filterIds[i]).css('color')=="rgb(0, 0, 255)") { 
                    $("#"+helper.filterIds[i]).css('color',"black" );
                    $("#"+helper.filterIds[i]).css('background-color', 'white');
                   
                }
            }
        }
        helper.filterIds = [];
        var isMedia ;
        if (component.get("v.select") == "Include Mine")
            isMedia=1;
        else
            isMedia=0
            var id = component.get("v.selTabId");
        var tabsData = component.get("v.tabs");
        var tabSelected = $.grep(component.get('v.tabs'), function (element, index) {
            return element.TabName == id;
        });
        var tabName = tabSelected[0].TabName;
        if( tabName == "All"){                                             
            var cmpEvent = component.getEvent("CmpmodalEvent"); 
            cmpEvent.setParams({
                "filterId" :helper.filterIds,
                "tabNameData" : tabName,
                "searchtextModal" :component.get("v.searchtxt"),
                "currentFolder" : component.get("v.currentFolder"),
                "cmpPages" : component.get("v.page"),
                "isMedia" : isMedia,
                "flagcountVal":false,
                "filterflag":false,
            }); 
            cmpEvent.fire();                                               
        }else{
            var cmpEvent = component.getEvent("CmpmodalEvent"); 
            cmpEvent.setParams({
                "filterId" :helper.filterIds,
                "tabNameData" : tabName,
                "searchtextModal" :component.get("v.searchtxt"),
                "currenttabfolderENum" :component.get("v.currentTabFolderEnum"),
                "cmpPages" : component.get("v.page"),
                "isMedia" : isMedia,
                "flagcountVal":false,
                "filterflag":false,
            }); 
            cmpEvent.fire(); 
            var cmpEvent = component.getEvent("viewModalEvent"); 
            cmpEvent.setParams({
                "filterId" :helper.filterIds,
                "tabNameData" : tabName,
                "modalSearchtxt" :component.get("v.searchtxt"),
                "modalFolderEnum" : component.get("v.currentTabFolderEnum"),
                "modalPage" : component.get("v.page"),
                "modlaisMedia" : isMedia,
                "filterflag":false,
               
            }); 
            cmpEvent.fire();
        }
    },
    filtermouseOver : function(component, event, helper) {
        var target = event.currentTarget;
        var targetId = target.getAttribute("id");
        $("#"+targetId).css('background-color', 'grey');
    },
    filtermouseOut : function(component, event, helper) {
        var target = event.currentTarget;
        var targetId = target.getAttribute("id");
        if ($("#"+targetId).css('color')=="rgb(0, 0, 0)") 
            $("#"+targetId).css('background-color', 'white');
    },
    NonCategorized :function(component, event, helper) {
        var buttonstate = component.get('v.NonCategorizedbuttonstate');
        component.set('v.NonCategorizedbuttonstate', !buttonstate);
        if($('#nonCategorisedState').hasClass('slds-hide'))
            $('#nonCategorisedState').removeClass('slds-hide'); 
        else
            $('#nonCategorisedState').addClass('slds-hide');  
    },
    Categorized :function(component, event, helper) {
        var buttonstate = component.get('v.Categorizedbuttonstate');
        component.set('v.Categorizedbuttonstate', !buttonstate);
        if($('#CategorisedState').hasClass('slds-hide'))
            $('#CategorisedState').removeClass('slds-hide'); 
        else
            $('#CategorisedState').addClass('slds-hide');
                                     
    },
    modalViewAction : function(component, event, helper) 
    {
        
        helper.assetrecord =  $(".assetrecord");
        var params = event.getParam('arguments');
     	component.set("v.tabs",params.modaltabs);
         helper.eltandeln = params.eltandeln;
            if(component.get("v.tabs") == null){
                component.set("v.spinner",false);
                component.set("v.itemss",undefined);
                helper.assetrecord.find('.rotate').removeClass("rotate-me");
                component.set("v.nodata",true);
                component.set("v.viewAssetHeader",params.header);
                if(params.ErrorMsg1 == '')
            	{
            	component.set('v.ErrorMsg','Sorry! We could not find any data to show you')
            	}
            	else
            	{
            	component.set("v.ErrorMsg", params.ErrorMsg1);
            	}
            }
     else{
        	if(params.check){
            
            $(helper.assetrecord).find('.rotate').addClass("rotate-me");
            component.set("v.viewAssetHeader",params.header);
            
            $A.util.removeClass(component.find("arrowleft"),'slds-hide');
            $A.util.removeClass(component.find("arrowright"),'slds-hide');
            
            if (component.get("v.tabcss") == 0)
                $A.util.addClass(component.find("arrowleft"),'disabled');
            var rotateid = component.find("selTAbColor");
            $A.util.addClass(rotateid[0], "tabcolor");
            component.set("v.selTabId",params.tabName);
            var rotateid = component.find("tabrotate");
            for(var i=0;i< rotateid.length;i++){
                $A.util.addClass(rotateid[i], "rotate-icon");
            }
            
            component.set("v.searchtxt",params.modalsearchtxt);
            if(params.modalsearchtxt != "" && params.modalsearchtxt != " " ){
                $('.clear').show();
                $(".search").hide();
            }else{
                $(".search").show();
                $('.clear').hide();
            }
            component.set("v.options",params.modaloption);
            component.set("v.currentFolderwithID",params.modalfolder);
            component.set("v.permission",params.modalpermission);
            component.set("v.currentFolder",params.modalfolderEnum);
            var cmpEvent = component.getEvent("CmpmodalEvent"); 
            cmpEvent.setParams({
                "tabNameData" : params.tabName,
                "searchtextModal" :component.get("v.searchtxt"),
                "currentFolder" : component.get("v.currentFolder"),
                "cmpPages" : component.get("v.page"),
                "isMedia" : 0,
                "filterflag":true,
               
            }); 
            cmpEvent.fire(); 
            }
            if(!params.check){
                var mainnavbgcolor =params.mainnavbgcolor;
                var mainnavfontcolor = params.mainnavfontcolor;
                document.documentElement.style.setProperty('--mainnavbgcolor', mainnavbgcolor);
                document.documentElement.style.setProperty('--mainnavfontcolor', mainnavfontcolor);
            	if((params.modalsearchtxt != "" && params.modalItem != null)||params.modalsearchtxt == "" ){
                component.set("v.itemss",params.modalItem);
                component.set("v.nodata",false);
                component.set("v.spinner",false);
                $(helper.assetrecord).find('.rotate').removeClass("rotate-me");
                     component.set("v.categorizedfilters",params.categorizedfilter);
                        component.set("v.Noncategorizedfilters",params.Noncategorizedfilter);
                        if (component.get("v.categorizedfilters") != null)
                            component.set("v.ifCategorizedData",true);
                        if (component.get("v.Noncategorizedfilters") != null)
                            component.set("v.ifnonCategorizedData",true);
                        component.set("v.linkid",params.linkid);
                        component.set("v.sourceType",params.source);
                        component.set("v.projectTypeId",params.projecttypeid);
                        component.set("v.isShownInModal",false);
                        component.set("v.dataRoomID",0);
                        component.set("v.tabcountData",params.tabcountVal);
                        
                        for(var i=0;i<params.modaltabs.length;i++){
                            if(params.modaltabs[i].TabName == params.tabName)
                                params.modaltabs[i].countdisplay='('+params.modalRowCount+')';
                        }
                        component.set("v.showTabs", false);
                        component.set("v.tabs",params.modaltabs);
                        setTimeout($A.getCallback(() => component.set("v.showTabs", true)));
                        
                        component.set("v.rowcount",params.modalRowCount);
                        component.set("v.install",params.modalInstallName);
                        component.set("v.pages",params.modalPages);
                        if(component.get("v.pages") > 0){
                            component.set("v.currentpage",component.get("v.currentpage"));
                        }
                        var cmpEvent = component.getEvent("CmpmodalEvent"); 
                        cmpEvent.setParams({
                            "tabNameData" : params.tabName,
                            "searchtextModal" :component.get("v.searchtxt"),
                            
                            "cmpPages" : component.get("v.page"),
                            "isMedia" : 0,
                            "flagcountVal":true
                        }); 
                        cmpEvent.fire();
            }
                else{
                component.set("v.spinner",false);
                component.set("v.nodata",true);
                    if(params.ErrorMsg1 == ''){
                        component.set('v.ErrorMsg','Sorry! We could not find any data to show you')
                    }else{
                		component.set("v.ErrorMsg", params.ErrorMsg1);  
                    }
                helper.assetrecord.find('.rotate').removeClass("rotate-me");
                    var rotateid = component.find("tabrotate");
                    for(var i=0;i< rotateid.length;i++){
                        $A.util.addClass(rotateid[i], "slds-hide");
                    }
                }
            }
     }
    
    },
    modalViewTabMethod : function (component, event, helper) {
        var params = event.getParam('arguments');
        if(params.tabcountVal == null){
             var rotateid = component.find("tabrotate");
            for(var i=0;i< rotateid.length;i++){
                $A.util.addClass(rotateid[i], "slds-hide");
            }                                                      
         }
        else{
            var tabData =component.get("v.tabs");
            for(var i=0;i<tabData.length;i++){
                for( var j=0;j<params.tabcountVal.length;j++){
                    if(tabData[i].TabName == params.tabcountVal[j].TabName){
                        
                        tabData[i].countdisplay='('+params.tabcountVal[j].count+')';
                    }
                }
            } 
            component.set("v.showTabs", false);
            component.set("v.tabs",tabData);
            setTimeout($A.getCallback(() => component.set("v.showTabs", true)));
            var rotateid = component.find("tabrotate");
            for(var i=0;i< rotateid.length;i++){
                $A.util.addClass(rotateid[i], "slds-hide");
            } 
        }
        
    },
    modalViewAnotherAction : function (component, event, helper) {
        var params = event.getParam('arguments');
        
        component.set("v.categorizedfilters",params.categorizedfil);
        component.set("v.Noncategorizedfilters",params.Noncategorizedfil);
        if (component.get("v.categorizedfilters") != null)
            component.set("v.ifCategorizedData",true);
        else
            component.set("v.ifCategorizedData",false);
        if (component.get("v.Noncategorizedfilters") != null)
            component.set("v.ifnonCategorizedData",true);
        else
            component.set("v.ifnonCategorizedData",false);   
        
        component.set("v.isShownInModal",false);
        component.set("v.dataRoomID",0);
        component.set("v.itemss",params.modalItem);
        component.set("v.rowcount",params.modalRowCount);
        if(component.get("v.rowcount")<=component.get("v.pagesize")){
            component.set("v.currentpage",1);
            component.set("v.page",0);
        }
        component.set("v.install",params.modalInstall);
        component.set("v.spinner",false);
        if(params.modalItem == null){
            component.set("v.nodata",true);
            if(params.ErrorMsg1 == '')
            {
            component.set('v.ErrorMsg','Sorry! We could not find any data to show you')
            }
            else
            {
            component.set("v.ErrorMsg",  params.ErrorMsg1);
            }
        }
        $(helper.assetrecord).find('.rotate').removeClass("rotate-me");
        component.set("v.pages",params.modalPages);
        if(component.get("v.pages") > 0){
            component.set("v.currentpage",component.get("v.currentpage"));
        }
        var tabData = component.get("v.tabs");
        if(!params.flagcountVal){
            var cmpEvent = component.getEvent("CmpmodalEvent"); 
            cmpEvent.setParams({
                "tabNameData" : params.tabName,
                "searchtextModal" :component.get("v.searchtxt"),
               
                "cmpPages" : component.get("v.page"),
                "isMedia" : component.get("v.isMedia"),
                "flagcountVal":true
            }); 
            cmpEvent.fire();
        }else{
            for(var i=0;i<tabData.length;i++){
                if(tabData[i].TabName == params.tabName)
                    tabData[i].countdisplay='('+params.modalRowCount+')';
                
            } 
            component.set("v.showTabs", false);
            component.set("v.tabs",tabData);
            setTimeout($A.getCallback(() => component.set("v.showTabs", true)));
        }
    },
    viewAssetMethod : function (component, event, helper) {
        
        helper.assetrecord =  $(".assetrecord");
        var params = event.getParam('arguments');
        
        $(component.find("changeHeader").getElement()).find('.headerChange').html("New Assets");
        $(component.find("changeSearchHeader").getElement()).find('.changeSearchHeader').html("New Assets");
        $A.util.addClass(component.find("dropdownId"),"slds-hide");
        if((params.ErrorMsg1 != '' && params.viewTab == null)||(params.ErrorMsg1 != '' && params.viewSearchtxt != null)){
            
            component.set("v.nodata",true);
            component.set("v.spinner",false);  
            component.set("v.ErrorMsg",params.ErrorMsg1);
            $(helper.assetrecord).find('.rotate').removeClass("rotate-me");
            if(params.viewTab.length == 1){
                var tabrotate=component.find("tabrotate");
                $A.util.addClass(tabrotate, "slds-hide");
            }
            else{
                var rotateid = component.find("tabrotate");
                for(var i=0;i< rotateid.length;i++){
                    $A.util.addClass(rotateid[i], "slds-hide");
                } 
            }
        }  
        else{                                                 
            if(params.check){     
                $(helper.assetrecord).find('.rotate').addClass("rotate-me");
                component.set("v.searchtxt",params.viewSearchtxt);
                if(params.viewSearchtxt != ""){
                    $('.clear').show();
                    $(".search").hide();
                }else{
                    $(".search").show();
                    $('.clear').hide();
                }
                component.set("v.tabs",params.viewTab);
                var selecttab=component.find("selTAbColor");
                $A.util.addClass(selecttab, "tabcolor");
                component.set("v.selTabId",params.tabName);    
                component.set("v.currentFolderwithID",params.viewFolderId);
                component.set("v.permission",params.viewPermission);
                component.set("v.options",params.viewOption);
                component.set("v.currentTabFolderEnum",params.viewFolderEnum);
                
                if(params.tabName == 'All'){
                    
                    $A.util.removeClass(component.find("arrowleft"),'slds-hide');
                    $A.util.addClass(component.find("arrowleft"),'disabled');
                    $A.util.removeClass(component.find("arrowright"),'slds-hide');
                    var tabcolor = component.find("selTAbColor");
                    $A.util.addClass(tabcolor[0], "tabcolor");
                    $("#showTabs").removeClass("colorbinder");
                    var rotateid = component.find("tabrotate");
                    for(var i=0;i< rotateid.length;i++){
                        $A.util.addClass(rotateid[i], "rotate-icon");
                    }
                }
                
                $A.util.addClass(component.find("tabrotate"), "rotate-icon");
                var cmpEvent = component.getEvent("viewModalEvent"); 
                cmpEvent.setParams({
                    "tabNameData" : params.tabName,
                    "modalSearchtxt" :component.get("v.searchtxt"),
                    "modalFolderEnum" : component.get("v.currentTabFolderEnum"),
                    "modalPage" : component.get("v.page"),
                    "modlaisMedia" : 0,
                    "filterflag":true,
                    "flagcountVal":true
                    
                    
                }); 
                cmpEvent.fire();
                
            }
            if(!params.check){
                var mainnavbgcolor =params.mainnavbgcolor;
                var mainnavfontcolor = params.mainnavfontcolor;
                document.documentElement.style.setProperty('--mainnavbgcolor', mainnavbgcolor);
                document.documentElement.style.setProperty('--mainnavfontcolor', mainnavfontcolor);
                component.set("v.itemss",params.viewItemss);
                
                if(component.get("v.itemss") == null){
                    component.set("v.nodata",true);
                    component.set('v.ErrorMsg','Sorry! We could not find any data to show you')
                    component.set("v.spinner",false);  
                }else{
                    component.set("v.nodata",false);
                    component.set("v.spinner",false);
                    
                }
                $(helper.assetrecord).find('.rotate').removeClass("rotate-me");
                component.set("v.categorizedfilters",params.categorizedfilter);
                component.set("v.Noncategorizedfilters",params.Noncategorizedfilter);
                if (component.get("v.categorizedfilters") != null)
                    component.set("v.ifCategorizedData",true);
                else
                    component.set("v.ifCategorizedData",false);
                if (component.get("v.Noncategorizedfilters") != null)
                    component.set("v.ifnonCategorizedData",true);
                else
                    component.set("v.ifnonCategorizedData",false);
                
                component.set("v.isShownInModal",true);
                component.set("v.dataRoomID",0);
                component.set("v.rowcount",params.viewrowcount);
                component.set("v.install",params.viewInstall);
                component.set("v.pages",params.viewPages);
                var tabData = component.get("v.tabs");
                tabData[0].countdisplay='('+params.viewrowcount+')';
                component.set("v.tabs",tabData);
                $(helper.assetrecord).find('.rotate').removeClass("rotate-me");
                $A.util.addClass(component.find("tabrotate"), "slds-hide");
                if(component.get("v.pages") > 0){
                    component.set("v.currentpage",component.get("v.currentpage"));
                }
                
                if(params.flagcountVal){
                    var cmpEvent = component.getEvent("viewModalEvent"); 
                    cmpEvent.setParams({
                        "tabNameData" : params.tabName,
                        "modalSearchtxt" :component.get("v.searchtxt"),
                        "modalFolderEnum" : component.get("v.currentTabFolderEnum"),
                        "modalPage" : component.get("v.page"),
                        "modlaisMedia" : 0,
                        "flag":true,
                        
                    }); 
                    cmpEvent.fire();
                    
                }
                
            }
            
        }
    },
     ViewAssetTabMethod : function (component, event, helper) {
         
        var params = event.getParam('arguments');
        if(params.tabcountVal == null){
             var rotateid = component.find("tabrotate");
            for(var i=0;i< rotateid.length;i++){
                $A.util.addClass(rotateid[i], "slds-hide");
            }                                                      
         }
        else{
            var tabData =component.get("v.tabs");
            for(var i=0;i<tabData.length;i++){
                for( var j=0;j<params.tabcountVal.length;j++){
                    if(tabData[i].TabName == params.tabcountVal[j].TabName){
                        
                        tabData[i].countdisplay='('+params.tabcountVal[j].count+')';
                    }
                }
            } 
            component.set("v.showTabs", false);
            component.set("v.tabs",tabData);
            setTimeout($A.getCallback(() => component.set("v.showTabs", true)));
            var rotateid = component.find("tabrotate");
            for(var i=0;i< rotateid.length;i++){
                $A.util.addClass(rotateid[i], "slds-hide");
            } 
        }
         
    },
   
    viewModalClose : function(component,event,helper){
        component.set("v.searchtxt",null);
        component.set("v.tabs",null);
        component.set("v.currentFolderwithID",null);
        
        component.set("v.selectedValue","Public");
        component.set("v.itemss",null);
        component.set("v.currentTabFolderEnum",null);
        component.set("v.page",0);
        component.set("v.currentpage",1);
        component.set("v.pages",0);
        component.set("v.spinner",true);
        component.set("v.nodata",false);
        
    },
    onUncheck : function(component,event,helper){
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
        if (event.which == 13){
           
            component.set("v.nodata",false);
            component.set("v.spinner",true);
            component.set("v.itemss",null);
            window.setTimeout(
                $A.getCallback(function() {
                     var rotateid = component.find("tabrotate");
                    if(rotateid == undefined){
                        component.set("v.nodata",true);
                        component.set("v.spinner",false);
                    }
                    else{
                        $(".search").hide();
                        $('.clear').show();
                        var rotateid = component.find("tabrotate");
                        for(var i=0;i< rotateid.length;i++)
                            $A.util.removeClass(rotateid[i],"slds-hide");
                        helper.search(component,event,helper);
                    }
                }),1000)
        }
        
    },
    searchIcon : function(component,event,helper){
        var rotateid = component.find("tabrotate");
            component.set("v.nodata",false);
        	component.set("v.spinner",true);
        	component.set("v.itemss",null);
            window.setTimeout(
                $A.getCallback(function() {
                    if(rotateid == undefined){
                    component.set("v.nodata",true);
                    component.set("v.spinner",false);
                   return; 
                    }
                    else{
                        $(".search").hide();
                        $('.clear').show();
                        //var rotateid = component.find("tabrotate");
                        for(var i=0;i< rotateid.length;i++)
                            $A.util.removeClass(rotateid[i],"slds-hide");
                        helper.search(component,event,helper);
                    }
                }),1000)
         
        
    },
    clearIcon : function(component,event,helper){
        component.set("v.nodata",false);
       	component.set("v.spinner",true);
        component.set("v.itemss",null);
        var e = event.currentTarget;
        $(".search").show();
        $(e).hide();
        var rotateid = component.find("tabrotate");
        for(var i=0;i< rotateid.length;i++)
            $A.util.removeClass(rotateid[i],"slds-hide");
        
        component.find("searchfilter").set("v.value","");
        helper.search(component,event,helper);
    },
    tabSelected:function(component, event, helper){
    },
    handleActive:function(component,event,helper)
    {
        helper.handleActive(component,event,helper);
    },
   
    next:function(component,event,helper){
        component.set("v.spinner",true);
        component.set("v.itemss",null);
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
        if(component.get("v.select") == "Include Mine"){
            if( tabName == "All"){
                var cmpEvent = component.getEvent("CmpmodalEvent"); 
                cmpEvent.setParams({
                    "tabNameData" : tabName,
                    "searchtextModal" :component.get("v.searchtxt"),
                    "currentFolder" : component.get("v.currentFolder"),
                    "cmpPages" : component.get("v.page"),
                    "isMedia" : 1,
                    "filterflag":false,
                    "flagcountVal":false
                    
                    
                }); 
                cmpEvent.fire();
            }else{
                var cmpEvent = component.getEvent("CmpmodalEvent"); 
                cmpEvent.setParams({
                    "tabNameData" : tabName,
                    "searchtextModal" :component.get("v.searchtxt"),
                    "currenttabfolderENum" : component.get("v.currentTabFolderEnum"),
                    "cmpPages" : component.get("v.page"),
                    "isMedia" : 1,
                    "filterflag":false,
                    "flagcountVal":false
                }); 
                cmpEvent.fire();
                var modalEvent = component.getEvent("viewModalEvent"); 
                modalEvent.setParams({
                     "tabNameData" : tabName,
                    "modalFolderEnum" : component.get("v.currentTabFolderEnum"),
                    "modlaisMedia" : 1,
                    "modalSearchtxt" : component.get("v.searchtxt"),
                   "filterflag":false,
                    "modalPage": component.get("v.page"),
                    
                }); 
                modalEvent.fire(); 
            }
        }else{
            if( tabName == "All"){
                var cmpEvent = component.getEvent("CmpmodalEvent"); 
                cmpEvent.setParams({
                    "tabNameData" : tabName,
                    "searchtextModal" :component.get("v.searchtxt"),
                    "currentFolder" : component.get("v.currentFolder"),
                    "cmpPages" : component.get("v.page"),
                    "isMedia" : 0,
                    "filterflag":false,
                    "flagcountVal":false
                }); 
                cmpEvent.fire(); 
                
            }else{
                var cmpEvent = component.getEvent("CmpmodalEvent"); 
                cmpEvent.setParams({
                    "tabNameData" : tabName,
                    "searchtextModal" :component.get("v.searchtxt"),
                    "currenttabfolderENum" : component.get("v.currentTabFolderEnum"),
                    "cmpPages" : component.get("v.page"),
                    "isMedia" : 0,
                    "filterflag":false,
                    "flagcountVal":false
                }); 
                cmpEvent.fire();
                var modalEvent = component.getEvent("viewModalEvent"); 
                modalEvent.setParams({
                     "tabNameData" : tabName,
                    "modalFolderEnum" : component.get("v.currentTabFolderEnum"),
                    "modlaisMedia" : 0,
                    "modalSearchtxt" : component.get("v.searchtxt"),
                    "filterflag":false,
                    "modalPage": component.get("v.page"),
                   
                }); 
                modalEvent.fire(); 
            }
        }
    },
    prev:function(component,event,helper){
        component.set("v.spinner",true);
        component.set("v.itemss",null);
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
        if(component.get("v.select") == "Include Mine"){
            if( tabName == "All"){
                var cmpEvent = component.getEvent("CmpmodalEvent"); 
                cmpEvent.setParams({
                    "tabNameData" : tabName,
                    "searchtextModal" :component.get("v.searchtxt"),
                    "currentFolder" : component.get("v.currentFolder"),
                    "cmpPages" : component.get("v.page"),
                    "isMedia" : 1,
                    "filterflag":false,
                    "flagcountVal":false
                }); 
                cmpEvent.fire(); 
                
            }else{
                var cmpEvent = component.getEvent("CmpmodalEvent"); 
                cmpEvent.setParams({
                    "tabNameData" : tabName,
                    "searchtextModal" :component.get("v.searchtxt"),
                    "currenttabfolderENum" : component.get("v.currentTabFolderEnum"),
                    "cmpPages" : component.get("v.page"),
                    "isMedia" : 1,
                    "filterflag":false,
                    "flagcountVal":false
                }); 
                cmpEvent.fire();
                var modalEvent = component.getEvent("viewModalEvent"); 
                modalEvent.setParams({
                    "tabNameData" : tabName,
                    "modalFolderEnum" : component.get("v.currentTabFolderEnum"),
                    "modlaisMedia" : 1,
                    "modalSearchtxt" : component.get("v.searchtxt"),
                   "filterflag":false,
                    "modalPage": component.get("v.page"),
                   
                }); 
                modalEvent.fire(); 
            }
        }else{
            if( tabName == "All"){
                var cmpEvent = component.getEvent("CmpmodalEvent"); 
                cmpEvent.setParams({
                    "tabNameData" : tabName,
                    "searchtextModal" :component.get("v.searchtxt"),
                    "currentFolder" : component.get("v.currentFolder"),
                    "cmpPages" : component.get("v.page"),
                    "isMedia" : 0,
                    "filterflag":false,
                    "flagcountVal":false
                }); 
                cmpEvent.fire(); 
                
            }else{
                var cmpEvent = component.getEvent("CmpmodalEvent"); 
                cmpEvent.setParams({
                    "tabNameData" : tabName,
                    "searchtextModal" :component.get("v.searchtxt"),
                    "currenttabfolderENum" : component.get("v.currentTabFolderEnum"),
                    "cmpPages" : component.get("v.page"),
                    "isMedia" : 0,
                    "filterflag":false,
                    "flagcountVal":false
                }); 
                cmpEvent.fire();
                var modalEvent = component.getEvent("viewModalEvent"); 
                modalEvent.setParams({
                    "tabNameData" : tabName,
                    "modalFolderEnum" : component.get("v.currentTabFolderEnum"),
                    "modlaisMedia" : 0,
                    "modalSearchtxt" : component.get("v.searchtxt"),
                   "filterflag":false,
                    "modalPage": component.get("v.page"),
                   
                }); 
                modalEvent.fire(); 
            }
        }
    },
   
    rotatesysclick : function(component,event,helper){
        helper.rotatesysclick(component,event,helper);
    },
    selectOption : function(component,event,helper){
        
        component.set("v.itemss",null);
        component.set("v.spinner",true);
        component.set("v.nodata",false);
        var rotateid = component.find("tabrotate");
        for(var i=0;i< rotateid.length;i++)
            $A.util.removeClass(rotateid[i],"slds-hide");
         if(rotateid.length == null) 
              $A.util.removeClass(component.find("tabrotate"),"slds-hide");
        $(helper.assetrecord).find('.rotate').addClass("rotate-me");
        var id = component.get("v.selTabId");
        var tabsData = component.get("v.tabs");
        var tabSelected = $.grep(component.get('v.tabs'), function (element, index) {
            return element.TabName == id;
        });
        var tabName = tabSelected[0].TabName;                                         
        var select = component.find("dropdownId").get("v.value");
        var selectOption = component.set("v.select",select);
        component.set("v.selectedValue",select);
        //component.get("v.currentFolderwithID");
        component.get("v.currentTabFolderEnum");
        if(component.get("v.select") == "Include Mine"){
            if(tabName == "All"){
                component.set("v.isMedia",1);
                var cmpEvent = component.getEvent("CmpmodalEvent"); 
                cmpEvent.setParams({
                    "tabNameData" : tabName,
                    "searchtextModal" :component.get("v.searchtxt"),
                    "currentFolder" : component.get("v.currentFolder"),
                    "isMedia" : component.get("v.isMedia"),
                    "selectOption":component.get("v.select"),
                    "flagcountVal":false,
                    "filterflag":false,
                    "check":0
                }); 
                cmpEvent.fire(); 
            }else{
                component.set("v.isMedia",1);
                var cmpEvent = component.getEvent("CmpmodalEvent");
                cmpEvent.setParams({
                    "tabNameData" : tabName,
                    "searchtextModal" :component.get("v.searchtxt"),
                    "currenttabfolderENum" : component.get("v.currentTabFolderEnum"),
                    "isMedia" : component.get("v.isMedia"),
                    "selectOption":component.get("v.select"),
                    "flagcountVal":false,
                    "filterflag":false,
                    "check":0
                }); 
                cmpEvent.fire(); 
                var modalEvent = component.getEvent("viewModalEvent"); 
                modalEvent.setParams({
                    "tabNameData" : tabName,
                    "modalFolderEnum" : component.get("v.currentTabFolderEnum"),
                    "modlaisMedia" : component.get("v.isMedia"),
                    "modalSearchtxt" : component.get("v.searchtxt"),
                    "filterflag":false,
                }); 
                modalEvent.fire(); 
            }
            
        }else{
            if(tabName == "All"){
                component.set("v.isMedia",0);
               
                var cmpEvent = component.getEvent("CmpmodalEvent");
                cmpEvent.setParams({
                    "tabNameData" : tabName,
                    "searchtextModal" :component.get("v.searchtxt"),
                    "currentFolder" : component.get("v.currentFolder"),
                    "isMedia" : component.get("v.isMedia"),
                    "flagcountVal":false,
                    "filterflag":false,
                    "check":0
                }); 
                cmpEvent.fire(); 
            }
            else{
                component.set("v.isMedia",0);
                var cmpEvent = component.getEvent("CmpmodalEvent"); 
                
                cmpEvent.setParams({
                    "tabNameData" : tabName,
                    "searchtextModal" :component.get("v.searchtxt"),
                    "currenttabfolderENum" : component.get("v.currentTabFolderEnum"),
                    "isMedia" : component.get("v.isMedia"),
                    "selectOption":component.get("v.select"),
                    "flagcountVal":false,
                    "filterflag":false,
                    "check":0
                }); 
                cmpEvent.fire(); 
                var modalEvent = component.getEvent("viewModalEvent"); 
                modalEvent.setParams({
                    "modalFolderEnum" : component.get("v.currentTabFolderEnum"),
                    "modlaisMedia" : component.get("v.isMedia"),
                    "modalSearchtxt" : component.get("v.searchtxt"),
                    "filterflag":false,
                }); 
                modalEvent.fire(); 
            }
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
        helper.addToRoom(component,event,helper);
    },
    associatedAssets : function(component,event,helper){
		helper.associatedAssets(component,event,helper)
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
    },
    tabarrowRight : function(component,event,helper){
        
        var defaultslideSize = component.get("v.tabcss");
        var increaseslideSize = defaultslideSize+(-100);
        component.set("v.tabcss",increaseslideSize);
        if (component.get("v.tabcss") != 0)
            $A.util.removeClass(component.find("arrowleft"),'disabled');
        var width =0; 
        var lastWidth=0;
        $('.tabUL li').each(function(i)
                            {
                                width+=$(this).width();
                                lastWidth = $(this).width();
                            });
        var toRight = 100;
        var diff = 0;
        var outerwidth =$('.outerdiv').width();
        var oWidth = width + lastWidth;
        if(outerwidth > oWidth)
            diff = outerwidth - oWidth;
        else
            diff = (oWidth-outerwidth)-(lastWidth-100);                                           
        var lastleft= $('.tabUL li:last-child').css("left").replace("px","");
        if(-lastleft + toRight > diff){
            toRight = (diff + lastleft);
            $A.util.addClass(component.find('arrowright'),'disabled');
        }
    },
    tabarrowLeft :  function(component,event,helper){
        var defaultslideSize = component.get("v.tabcss");
        var decreaseslideSize = defaultslideSize+(100);
        component.set('v.tabcss',decreaseslideSize);
        $A.util.removeClass(component.find('arrowright'),'disabled');
        if (component.get("v.tabcss") == 0)
            $A.util.addClass(component.find("arrowleft"),'disabled');
        
    },
    
})