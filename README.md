# Integrating Plotly and Spotfire Visualizations


[Overview](#overview)
[Compatibility](#compatibility)
[Required Scripts](#requiredscripts)

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

