

var console = {};
console.log = function() {};

function executeScript(name, code, args) {
    var ScriptExectutionInfo = { "ScriptName": name, "ScriptCode": code, "Arguments": args};
    var seiJson = JSON.stringify(ScriptExectutionInfo);
    if (proClient){
        window.Spotfire.RunScript(seiJson);
    }
    else {
        // XMLHTTP Post      
        values = { "script": "script", "ScriptExecutionInfo": seiJson};
        XmlHttp.post(window.location.href, values, CustomVisualization.update);
    }
}

function setRuntimeState(stateObject) {
    var stateJSON = JSON.stringify(stateObject);
    if (proClient) {
        window.Spotfire.SetRuntimeState(stateJSON);
    }
    else {
        // XMLHTTP Post      
        values = { "runtime": stateJSON };
        XmlHttp.post(window.location.href, values, CustomVisualization.update);
    }
}

var normalDistribution = d3.random.normal();
// Time between measurements in minutes
var INTERVAL = 30;
var NUM_MEASUREMENTS = 100;
var NUM_OPERATIONS = 10;

Date.prototype.toMysqlFormat = function() {
	var twoDigits = function(d) {
		 if(0 <= d && d < 10) return "0" + d.toString();
		 if(-10 < d && d < 0) return "-0" + (-1*d).toString();
		 return d.toString();
	}
   return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + 				twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + 		
		twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};


var makeHeatmap = function(myDivId){
	var date = new Date(), dateArray=[], x=[], z=[];
	var operationIds = [];
	
	// Create Y date values
	for(var i=0;i<NUM_MEASUREMENTS;i++){
  		date.setMinutes(date.getMinutes() + INTERVAL); 
  		dateArray.push( date.toMysqlFormat() );
	}
	
	// Create X operation values
	for( var j=0; j<NUM_OPERATIONS; j++ ){
		operationIds.push( Math.floor(Math.random()*8999+1000).toString() );
	}
	
	// Create Z heatmap values
	for(var i=0;i<NUM_MEASUREMENTS;i++){
		var newRow = [];
		for( var j=0; j<NUM_OPERATIONS; j++ ){
			newRow.push( normalDistribution() );
		}
		z.push( newRow );
	}
	
	var data = [ {
		 x: operationIds,
		 y: dateArray,
		 z: z,
		 type: "heatmap"
	  } ];
	
	var layout = {
	    xaxis:{ type: 'category', ticks: '' }
	}
	
	Plotly.plot(myDivId, data, layout);
}

var makeHistogram = function(histogramDiv, heatmapDiv, slice){
	//alert(histogramDiv);
	var heatmapSlice = [];
	var z = heatmapDiv['data'][0]['z']; 
	
	Plotly.plot(histogramDiv,[]);
	
	for( var i=0; i<z.length; i++ ){
		heatmapSlice.push( z[i][slice] );
	}
	
	var data = [ {
		x: heatmapSlice, 
		type: "histogram"
	} ];
	
	var histogramTitle = heatmapDiv['data'][0]['x'][slice];
	var layout = { title: histogramTitle };
		
	if(histogramDiv['data'] === undefined || histogramDiv['data'].length == 0){
		Plotly.plot(histogramDiv, data, layout);	
	} else{
		Plotly.deleteTraces(histogramDiv, 0);
		Plotly.addTraces(histogramDiv, data );
		Plotly.relayout(histogramDiv, {title: histogramTitle });
	}
}

function renderCore(data) {

    if (resizing) {
        debugger;
        return;
    }

    // Extract the columns
    var columns = data.columns;

    // Extract the data array section
    var myData = data.data;

    // count the marked rows in the data set, needed later for marking rendering logic
    var markedRows = 0;
    for (var i = 0; i < myData.length; i++) {
        if (myData[i].hints.marked) {
            markedRows = markedRows + 1;
        }
    }

    var width = window.innerWidth;
    var height = window.innerHeight;

	var js_chart = document.getElementById('js_chart');

    for( var i=1; i<=3; i++ ){
	
		// Create Heatmap divs and set to 33% 
		grid = document.createElement('div');
		grid.setAttribute("id",'grid-'+i+'-1');
		js_chart.appendChild(grid);
		document.getElementById('grid-'+i+'-1').style.width ='33%';
		document.getElementById('grid-'+i+'-1').style.display ='inline-block';
	}

	for( var i=1; i<=3; i++ ){
	
		// Create Histogram divs and set to 33% 
		grid = document.createElement('div');
		grid.setAttribute("id",'grid-'+i+'-2');
		js_chart.appendChild(grid);
		document.getElementById('grid-'+i+'-2').style.width ='33%';
		document.getElementById('grid-'+i+'-2').style.display ='inline-block';
	}

	for( var i=1; i<=3; i++ ){
	
		makeHeatmap('grid-'+i+'-1');
	
		makeHistogram(
			document.getElementById('grid-'+i+'-2'), 
			document.getElementById('grid-'+i+'-1'), 0);
	
		// This makes the plots respond to 
		// window size changes
		$(window).resize(function() {
			setTimeout(function() {
			  Plotly.Plots.resize(document.getElementById('grid-'+i+'-1'));
			  Plotly.Plots.resize(document.getElementById('grid-'+i+'-2'));
			}, 500);
		});
		
		$('#'+'grid-'+i+'-1').bind('plotly_click',function(event,data){

			var slice = data['points'][0]['pointNumber'][1];
			var heatmapDiv = event.currentTarget;
			var histogramDivId = heatmapDiv.id.slice(0,-1)+'2';
			var histogramDiv = document.getElementById( histogramDivId );
		
			makeHistogram(histogramDiv, heatmapDiv, slice);
		});		
	
}



}

var fetchedFirstPlotData = false;

function OnNodeInserted() {
    if ($("#js_chart")) {
        if (!fetchedFirstPlotData) {
            fetchedFirstPlotData = true;
            getPlotData();
        }
    }
}

document.addEventListener('DOMNodeInserted', OnNodeInserted, false); // Start rendering when #js_chart div gets inserted

var resizing = false;

//this is for Spofire Pro only, so that we can inject the data into the renderCore method
$('body').on("spotfireready", function () {
    // Register a function to be invoked by Spotfire when the marking
    // in the table configured for the visualisation changes.
    Spotfire.registerSelectionCallback("renderCore");
});


//Parse the text and render the pie chart
function parseData(data) {
    pData = jQuery.parseJSON(data);
    renderCore(pData);
}

// Ask server for JSON.
function getPlotData() {
    if (!proClient) {
        var values = { data: 'data' }; // just request "data"   
        XmlHttp.post(window.location.href, values, parseData);
    }
}

// Increase imageId parameter in url.
// Image generator not currently used
function increaseImageId(url)
{
    var result = url.match(/^(.*)(imageId=)([0-9]+)(.*)$/);
    if(result == null)
    {
        return url + '&imageId=0';
    }
    else
    {
        return result[1] + result[2] + (parseInt(result[3]) + 1) + result[4];
    }   
}
 
if (!proClient) {
    // Override the invalidate function 
    // getPlotData will be called when the visualization need to update.
    // Pro-client will inject data straight into parseData(data)
    CustomVisualization.onInvalidated = getPlotData;
}


window.onresize = function (event) {
    resizing = true;
    if ($("#js_chart")) {
        //
        // Insert resizing code here
        //
    }
    resizing = false;
}


// Mark an area.
function mark(event)
{
    var e = Event.get(event);
    var target = Event.target(e);
    target.clientRectangle = new Rectangle(0, 0, $("#js_chart").outerWidth(), $("#js_chart").outerHeight());
    var marking = new RectangleOverlay(e, target, handleMouseUp, "dummy");

    function handleMouseUp(id, markMode, rectangle)
    {		   	   	   	   		   
        switch (markMode)
        {
            case "Replace":
            case "Add":
            case "Toggle":
                markModel(markMode, rectangle);
                break;
            case "None":
                break;
        }		   
    } 
    
    return false;
}

// Send marked area to Server or Pro Client.
function markModel(markMode, rectangle) {

    //
    // Insert marking code here
    //
}