# Integrating Plotly and Spotfire Visualizations


[Overview](#overview)

[Compatibility](#compatibility)

[Required Scripts](#requiredscripts)

[Constants](#constants)

[Fields](#fields)

[Properties](#properties)

[Customization Attributes](#customizationattributes)

<a name="overview"/>
### Overview 

Spotfire is a business intelligence tool developed by TIBCO that is used primarily as an enterprise tool to visualize and analyze sets of data. Plotly is an online analytics and data visualization tool available for both public and enterprise use that is extremely robust with graphing libraries for Python, R, MATLAB, Perl, Julia, Arduino, and REST. Both the Spotfire Web Player and Plotly allow customizations through their APIs and interactive visualizations and dashboards can be created using the two. 

This documentation and associated examples assume that the Spotfire Web Player has been installed and configured to build mash-ups using the Spotfire API. More information on Spotfire and the Web Player can be found at the Spotfire Technology Network. For more information about Plotly, visit the API site.  

<a name="compatibility"/>
### Compatibility 

This code has been tested using Spotfire 7 and using both Chrome and Firefox. 
Spotfire - Customizing Visualizations

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

