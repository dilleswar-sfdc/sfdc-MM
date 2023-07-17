window._MMCLIENTS = {
    EQUINIX:{
        init:(jo)=>{
            _MMCLIENTS.EQUINIX.listenForMMPostMessages(jo);
        },
            listenForMMPostMessages:(jo)=>{
                var pageToDirect = jo.pagetoredirect;
                window.addEventListener('message',function(evt){
                if(jo.installurl != evt.origin)
                return;
                
                var data =  JSON.parse(evt.data);
                
                var from = data.from;
                if(from != "equinixleadtodealredirection")
                return;
                
                var leadId =data.leadid;
                
                var urlEvent = $A.get("e.force:navigateToURL");
                urlEvent.setParams({
                "url": '/'+ pageToDirect +'?leadid='+leadId
            });
            urlEvent.fire();
        },false);
    }
    }
    
  }