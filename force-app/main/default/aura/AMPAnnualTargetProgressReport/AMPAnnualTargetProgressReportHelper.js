({
    annualtarget:'',
    sessionID:'',
	AuthenticateCurrentUser:function(component, event, helper){
        var action = component.get("c.AuthenticateSFUser");
        action.setParams({
            "createuserviasso": component.get("v.createuserviasso")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var apigetState = JSON.parse(response.getReturnValue()).status;
                if(apigetState == 1){
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
                         var toastEvent = $A.get("e.force:showToast");
                             toastEvent.setParams({
                            title : 'Error',
                            message: finalmessage,
                            duration:' 5000',
                            key: 'info_alt',
                            type: 'error',
                            mode: 'dismissible' 
               		 		});
        				toastEvent.fire();
                     }
                    else{
                        if(data.result.authentic)
                        {
                            helper.sessionID = data.result.usersessionid;
                            helper.UpdateToken(component,helper,data.result.usertoken,data.result.newuser);
                            if(!data.result.newuser){
                                helper.processcmp(component,helper);
                            }
                            
                            
                        }else{
                            $('.annualtarget').hide();
                        }
                    }
                }
            }
        });
        $A.enqueueAction(action);
    },
	processcmp:function(component,helper){
        if(component.get("v.dependantwidget") == "oneapp")
            var data = helper.getAnnualTargetProgressReport(component,helper);
        else
            helper.getDetails(component,helper);
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
    generateChart : function(component,chartdata,helper) {
        
        var dataset = [];
        for(var i = 0;i<=chartdata.x.length-1;i++)
        {
            var color = chartdata.x[i].color;
            if(chartdata.x[i].name == 'VisitedEbookPage')
                color = '#f7941d';
            var bgcolor = this.hexToRgbA(color,0.5);
            var innerdataset = {
                label:chartdata.x[i].name,
                data: chartdata.x[i].points,
                borderColor:this.hexToRgbA(color,0.8),
                fill: true,
                borderWidth:0.5,
                pointBackgroundColor: color,
                pointBorderWidth: 2,
                pointHoverRadius: 5,
                pointRadius: 3,
                bezierCurve: false,
                lineTension:0,
                backgroundColor:bgcolor,
                pointStyle : 'circle',
                pointHitRadius: 10,
                steppedLine:true,
                legend: {
            		display: true,
            		position:'top',
            	},
            };
            dataset.push(innerdataset);
        }
        
        var chartdata = {
            labels: chartdata.y,
            datasets: dataset
        }
        
        //Get the context of the canvas element we want to select
        var lineChart = this.bindChart(component,chartdata,helper);
        //linChart.destroy();
        //var lineChart = this.bindChart(component,chartdata);
    },
    bindChart:function(component,chartdata,helper)
    {
        var chartobj = component.get("v.chartobj");
		var el = component.find('annactivity-companylist-graph').getElement();
        var ctx = el.getContext('2d'); 
        ctx.lineJoin = 'round';
     	if(chartobj){
            chartobj.destroy();
        }

        chartobj = new Chart(ctx ,{
            type: 'line',
            data: chartdata,
            options: {	
                legend: {
                    position: 'bottom',
                    padding: 10,
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            callback: function(value, index, values) {
                                if(parseInt(value) >= 1000){
                                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                } else {
                                    return value;
                                }
                            }
                        }
                    }]
                },
                responsive: true,
                scaleBeginAtZero: true,
            }
        }); 
        component.set("v.chartobj",chartobj);   
        $(helper.annualtarget).find(".divspinner").hide();
        $(helper.annualtarget).find("canvas").css({"width":"100%","height":"300px"});
    },
    getAnnualTargetProgressReport:function(component,helper)
    {
        helper.dynamicColorBinding(component,event,helper);
        var data = this.callChartApi1(component,helper);
    },
    
    callChartApi1:function(component,helper)
    {
        var action1 = component.get("c.getAnnualTargetProgressReport");
     	var view = component.get("v.view").toString();
     	action1.setParams({view:view});
        action1.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var apigetState = JSON.parse(response.getReturnValue()).status;
                if(apigetState == 1){
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
                }
                else{
                    var data = JSON.parse(response.getReturnValue());
                    var finalresponse=data.result.code;
                     var finalmessage=data.result.msg;
                    if(finalresponse==false)
                     {
                         var toastEvent = $A.get("e.force:showToast");
                             toastEvent.setParams({
                            title : 'Error',
                            message: finalmessage,
                            duration:' 5000',
                            key: 'info_alt',
                            type: 'error',
                            mode: 'dismissible' 
               		 		});
        				toastEvent.fire();
                     }
                    else{
                        var dataStatus =JSON.parse(response.getReturnValue())
                        var _data = data.result;
                        if(dataStatus.status == 0)
                        {
                            //_data._xPoints = helper.formatMoney(_data._xPoints);
                            var achievedData = _data.amount;
                            var tempachievedData = _data.amount;
                            var monthArr  = _data._yRow;
                            var tempActualMonths = monthArr;
                            var actualMonths = monthArr;
                            var tempActualData = _data._xPoints;
                            var actualData = _data._xPoints;
                            var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                            if(actualMonths.length == 1)
                            {   
                                actualData = [];
                                achievedData  = [];
                                actualMonths = [];
                                var monIndex = months.indexOf(tempActualMonths[0]);
                                for(var i = 0; i<=2; i++)
                                {
                                    if(i != 1)
                                    {
                                        actualData.push(0);
                                        achievedData.push(0);
                                        if(monIndex >= 0 )
                                            if(i == 0)
                                            {
                                                if(monIndex == 0)
                                                    actualMonths.push(months[11]);
                                                else
                                                    actualMonths.push(months[monIndex-1]);
                                            }
                                            else
                                                actualMonths.push(months[monIndex+1]);
                                    }
                                    else
                                    {
                                        actualData.push(tempActualData[0]);
                                        achievedData.push(tempachievedData[0]);
                                        actualMonths.push(tempActualMonths[0]);
                                    }
                                }
                            }
                            var view = component.get("v.view");
                            if(monthArr.length == -1 && parseInt(view) == 2)
                            {
                                var x = [];
                                var index = -1;
                                actualMonths.forEach(function(o,i){
                                    if(x.indexOf(o)>=0)
                                    {
                                        index = i; 
                                    }
                                    else
                                        x.push(o);
                                });
                                actualMonths.splice(index, 1);
                                achievedData.splice(index, 1);
                                var _actualMonth = actualMonths;
                                var _achievedData = achievedData;
                                
                                var indices = [];
                                for(var i =0;i<=actualMonths.length-1;i++)
                                {
                                    indices.push(months.indexOf(actualMonths[i]));
                                    
                                }
                                indices.sort(function(a, b){return a-b;});
                                actualMonths = [];
                                achievedData = [];
                                for(var i =0;i<=indices.length-1;i++)
                                {
                                    actualMonths.push(months[indices[i]]); 
                                }
                                for(var i = 0;i<=actualMonths.length-1;i++){
                                    achievedData.push(_achievedData[_actualMonth.indexOf(actualMonths[i])]);
                                }
                                
                            }
                            var _x = [
                                { color: "#70A4D3", name: "Target", points:actualData },
                                { color: "#F7941d", name: "Acheived", points: achievedData }
                            ]
                            var _y = actualMonths;
                            var chartdata = { x: _x, y: _y, opacity: 1, dates: _data.dates, predates: _data.predates };
                            this.generateChart(component,chartdata,helper);
                            
                        }
                    }
                }
            }
        });
        action1.setBackground();
        $A.enqueueAction(action1);
    },
    hexToRgbA:function(hex,opacity){
        var c;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length== 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+opacity+')';
        }
        throw new Error('Bad Hex');
	},
    getDetails:function(component,helper)
    {
        var action = component.get("c.GetPersonaThemeForCurrentUser");
        action.setCallback(this, function(response){ 
            var state = response.getState();
            if (state === "SUCCESS")
            {
                var apigetState = JSON.parse(response.getReturnValue()).status;
                if(apigetState == 1){
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
                }
                else{
                    var data = JSON.parse(response.getReturnValue());
                    var finalresponse=data.result.code;
                     var finalmessage=data.result.msg;
                    if(finalresponse==false)
                     {
                         var toastEvent = $A.get("e.force:showToast");
                             toastEvent.setParams({
                            title : 'Error',
                            message: finalmessage,
                            duration:' 5000',
                            key: 'info_alt',
                            type: 'error',
                            mode: 'dismissible' 
               		 		});
        				toastEvent.fire();
                     }
                    else{
                        component.set("v.userid",data.result.userid.toString());
                        component.set("v.install",data.result.install);
                        component.set("v.mainnavbgcolor",data.result.pagecss.mainnavbgcolor);
                        component.set("v.mainnavfontcolor",data.result.pagecss.mainnavfontcolor);
                        var data = helper.getAnnualTargetProgressReport(component,helper);
                    }
                }
            }  
        });
        action.setBackground();
        $A.enqueueAction(action);
        
    },
    formatMoney:function(amount){
        var xpoint = [];
        $.each(amount,function(i, value){
            xpoint.push(value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
        });
        return xpoint;
    },
	dynamicColorBinding:function(component,event,helper){
        document.documentElement.style.setProperty('--mainnavbgcolor', component.get("v.mainnavbgcolor"));
        document.documentElement.style.setProperty('--mainnavfontcolor', component.get("v.mainnavfontcolor"));
    }
})