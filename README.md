# Integrating Plotly and Spotfire Visualizations


[Overview](#overview)

[Compatibility](#compatibility)

[Spotfire Customization](#spotfire)

[Required Scripts](#requiredscripts)

[Constants](#constants)

[Fields](#fields)

[Properties](#properties)

[Customization Attributes](#customizationattributes)

[Callbacks](#callbacks)

[Open the Analysis](#openanalysis)

[Helper Functions](#helperfunctions)

[Passing/Receiving Parameters](#parameters)

[Plotly Customization](#plotly)

[Walkthrough - Example - ControlChartHeatMap](#puttingitalltogether)

<a name="overview"/>
### Overview 

Spotfire is a business intelligence tool developed by TIBCO that is used primarily as an enterprise tool to visualize and analyze sets of data. Plotly is an online analytics and data visualization tool available for both public and enterprise use that is extremely robust with graphing libraries for Python, R, MATLAB, Perl, Julia, Arduino, and REST. Both the Spotfire Web Player and Plotly allow customizations through their APIs and interactive visualizations and dashboards can be created using the two. 

This documentation and associated examples assume that the Spotfire Web Player has been installed and configured to build mash-ups using the Spotfire API. More information on Spotfire and the Web Player can be found at the Spotfire Technology Network. For more information about Plotly, visit the API site.  

<a name="compatibility"/>
### Compatibility 

This code has been tested using Spotfire 7 and using both Chrome and Firefox. 

<a name="spotfire"/>
##Spotfire - Customizing Visualizations

While this documentation assumes that the Spotfire Web Player has been set up, it is good to first review that the API has been configured to work within Spotfire. 

Within the Web.config file in the Spotfire Web Player directory - the default Web Player directory is at C:\Program Files\TIBCO\Spotfire Web Player\7.0.0\webroot - check to make sure that the JavaScript API is enabled. Without this attribute set to true, you will not have access to Spotfire’s API and not be able to build customized visualizations or be able to pass and receive parameters. 

For more information on setting up the Spotfire Web Player to allow customizations and use the Spotfire API, visit …

There are many examples online of custom Web Player applications. The Spotfire Technology Network contains examples, such as … 

Two Spotfire / Plotly mash-ups have been created to illustrate integration between these visualization tools and this document outlines each. The files needed to follow this documentation reside in the SpotfirePlotlyDemo folder. To start out with, open the ControlChartHeatMap.html file. This is the main driver of the integration between Spotfire and Plotly and the file includes the following code:

<a name="requiredscripts"/>
### Required Scripts

At the top of the html code are required scripts within the `<script>` tags, most of which reside in the js folder of the SpotfirePlotlyDemo folder. One important script is the Spotfire API script, which allows access to the Spotfire Web Player’s API so that the visualization can be customized. 

Within the code the line to include the API script will look similar to this:

`<script type=”text/javascript” src=”http://<server>/SpotfireWeb/GetJavaScriptApi.ashx?Version=1.0”></script>`

Where `<server>` is the server location of the Spotfire Web Player.

<a name="constants"/>
### Constants

The constants within the code are variables that will be used throughout the integration code. The Spotfire server URL, the path in the Spotfire Library to the analysis file and other properties are set here. 

These constants include:

`c_ServerUrl`  		The Spotfire Web Player URL 
`c_AnalysisPath`  		The path within the Spotfire Library to the Spotfire analysis
`c_parameters` 		Parameters to set up upon initialization, e.g. setting the filters
`c_markingColumns` 	Columns within the analysis file which can be marked/passed to Plotly
`c_tableName`  		The underlying data table for the Spotfire visualization
`c_markingName`  		The name of the marking scheme
`c_filteringScheme` 	The name of the filtering scheme associated with the visualization’s page
`c_startPage` 		The name of the page within the analysis file that should be opened when initialized

Note: Not all of these constants are required. `c_startPage` and `c_filteringScheme` will be set to default values. But `c_ServerURL` and `c_AnalysisPath` are two required constants for setting up the visualization properly.

<a name="fields"/>
### Fields

Fields include variables needed to invoke the custom Spotfire analysis file, as well as the slider that is used to toggle between a full-size Spotfire Web Player and full-size Plotly visualization view. 

`slider` 		At the top of the PlotlyDemo.html page there is a slider that allows a user to increase the size of either the Spotfire visualization or the Plotly visualization markings 
`customization`  	Needed to invoke a custom Spotfire Web Player analysis
`app` 			The actual Web Player app, which is created after the page has loaded completely. This groups in all other settings to create the visualization.

<a name="properties"/>
### Properties

Properties are related to the Spotfire Web Player. In our examples, we use property information to grab data from the Web Player so we can later use it within the Plotly visualization. 

`Columns` 	A mapping of columns that we can later grab information from. This is useful to pass information in our integration. DOM Event Handlers

Within this section of code we set up each component of the customization. The slider, the layout/size of each div container, and various attributes that we want to set when the analysis file loads. 

First, window.onload is called to specify that these handlers should be set up when the page is loaded. Each DOM element that we want to manipulate and invoke is set within this section. 

<a name="customizationattributes"/>
### Customization Attributes

`showClose` 			Toggle whether to show the user the close option; options are `true`/`false`
`showAnalysisInfo` 	Toggle whether to show user analysis info about this file; options are `true`/`false`
`showToolBar` 		Toggle whether to show the Spotfire tool bar; options are `true`/`false`

<a name="callbacks"/>
### Callbacks

Within PlotlyDemo.html we have three callback function set up: one for when an error occurs, one for when the analysis file has completely opened, and one for a marking (e.g. a selection within the Spotfire visualization) occurs. 

More specifically, these callbacks include:


`errorCallback`		When an error occurs, this method specifies what steps to take. In the example we display an alert to the user to show them adescription of the error. 

`openedCallback`		When the analysis has been opened, we want to set some properties. In the example, we set the active page and then set up a listener for markings. This listener is useful for interacting with the Plotly visualization and is described in the following callback. 

`markingCallback`		The markingCallback method sets the marked value (from Properties section) and loads the Plotly visualization. This way we can use both the marked value, and the Plotly visualization loads based on the marking. 

<a name="openanalysis"/>
### Open the Analysis

After all fields and attributes have been set, we can now open the analysis. The code called here is:

`app.open(c_analysisPath, <div_container>, c_parameters);`

Where `c_analysisPath` is the location of the analysis file in the Library, the `div_container` is the div we want the analysis to load into, and `c_parameters` are the analysis parameters we specified earlier in our code.

<a name="helperfunctions"/>
### Helper Functions

Helper functions include setting the layout of both the Web Player and Plotly visualization. These include:

`layoutPlotly` 		Set up the layout of the Plotly visualization.
`layoutWebPlayer` 		Set up the layout of the Web Player visualization. 

Other helper functions can be added but within this example, these are the two main ones we use. 

<a name="parameters"/>
### Passing/Receiving Parameters

Since the parent container is accessbile to both the Web Player visualiation and the Plotly visualization, all parameters are accessible from each. For example ...

<a name="plotly">
## Plotly - Customized Visualization

The Plotly.js API should be used as it is standalone and does not rely on Plotly’s servers. All required JavaScript files are included within the package, and visualizations can be hosted directly on the Spotfire Web Player server. The Plotly API allows for visualizations to be quickly setup and is not as complicated as setting up the Spotfire Web Player. The example included within PlotlyHeatmapDemo.html shows that a Plotly visualization can be set up in about 60 lines of code. 

<a name="includedscripts"\>
### Included Scripts

D3.js scripts are needed to properly use Plotly. Additionally...

<a name="creating"\>
### Creating the Visualization

Creating a visualization is simple within Plotly. Within the example, data are first loaded into the data variable. The call to render the heatmap is one line of code:

`Plotly.plot(‘plotlyWrapper’,data,layout);`

<a name="parameters_plotly"/>
### Passing/Receiving Parameters

Since the plotlyWrapper is a div located on the same page as the Spotfire Web Player visualization, parameters can be quickly retrieved and passed to be used between the two applications. 

Within the Spotfire Web Player, the marked value is stored in a variable called `markedSpotfireValue`. this variable can be accessed within the Plotly visualization as well. For example, `console.log(“Marked value: “ + markedSpotfireValue)` will display the markedValue within the console. 

<a name="puttingitalltogether"\>
## Walkthrough - Example - ControlChartHeatmap

In this first example we will take a look at a basic mashup of Spotfire and Plotly. This will be done using a control chart - a line chart, essentially - in Spotfire and a heatmap within Plotly. Selecting a point within Spotfire will trigger a new heatmap to load within Plotly. 

Within the SpotfirePlotlyDemo folder you will find:

* Spotfire control chart analysis file (SpotfireControlChartDemo.dxp)
* Plotly heat map visualization (PlotlyHeatmapDemo.html)
* Custom (Spotfire via JS) code to tie everything together (ControlChartHeatmap.html)
* JavaScript, CSS and image files for components (js, css, img sub-folders)

2. The first step is to upload the package onto the Web Player server, unzip its contents and place the SpotfirePlotlyDemo folder in the Web Player's webroot directory. On a Windows machine, the Spotfire Web Player's webroot directory is, by default, located at `C:\Program Files\TIBCO\Spotfire Web Player\7.0.0\webroot` but you should verify that this is the correct location.

i. If the server admin is not available, you can check the Web Player's directory by opening the IIS Manager (under `Administrator Tools`), selecting the site (e.g. `SpotfireWeb`) and then `Explore` from the menu.

