//
// Copyright (c) 2007 Spotfire AB,
// Första Långgatan 26, SE-413 28 Göteborg, Sweden.
// All rights reserved.
//
// This software is the confidential and proprietary information
// of Spotfire AB ("Confidential Information"). You shall not
// disclose such Confidential Information and shall use it only
// in accordance with the terms of the license agreement you
// entered into with Spotfire.
//


//
// Constructor
//
Slider = function(container, leftSlider, rightSlider, leftButton, rightButton)
{
    /// <summary>Creates a new instance of horizontal sliding windows.</summary>
    /// <param name="container" type="string">Id of a container which holds the windows to slide.</param>
    /// <param name="leftSlider" type="string">Id of the left sliding window.</param>
    /// <param name="rightSlider" type="string">Id of the right sliding window.</param>
    /// <param name="leftButton" type="string">Id of the left button which triggers expansion/collaption.</param>
    /// <param name="rightButton" type="string">Id of the right button which triggers expansion/collaption.</param>
    
    Slider.instance = this;
    
    this.delay = 1000; //ms
    this.margin = 25; //px
    
    this.state = Slider.states.Expanded;
    
    this.container = window.document.getElementById(container);
    this.leftSlider = window.document.getElementById(leftSlider);
    this.rightSlider = window.document.getElementById(rightSlider);
    this.leftButton = window.document.getElementById(leftButton);
    this.rightButton = window.document.getElementById(rightButton);
    
    this.layout();
    this.updateButtonImages();
	
	// Register event handlers
    this.leftButton.onclick = function()
    {
	    Slider.instance.expandCollapse("Left");
    };
	
    this.rightButton.onclick = function()
    {
	    Slider.instance.expandCollapse("Right");
    };
    
    // Save any previousely set onresize handler.
    this.windowResizeFunction = window.onresize;

    window.onresize = function()
    {
        Slider.instance.windowResizeFunction();
        
        if (Slider.instance !== null)
        {
            switch (Slider.instance.state)
            {
                case Slider.states.LeftCollapsed:
                    Slider.instance.expandCollapse("Left");
                    break;
                
                case Slider.states.RightCollapsed:
                    Slider.instance.expandCollapse("Right");
                    break;
            }
	        Slider.instance.layout();
	    }
    };
};


//
// Static Fields
//
Slider.instance = null;


//
// Properties
//
Slider.states = 
{
    /// <summary>Defines the states the sliding windows can have.</summary>
    /// <param name="LeftCollapsed" type="string">The left window is collapsed, and the right window is full sized.</param>
    /// <param name="RightCollapsed" type="string">The right window is collapsed, and the left window is full sized.</param>
    /// <param name="Expanded" type="string">Both windows are equally sized.</param>
    
	LeftCollapsed : "LC",
	RightCollapsed : "RC",
	Expanded : "E"
};


//
// Static Methods
//
Slider.parseCssSize = function(cssSize)
{
    /// <summary>Helper function to get CSS defined size as an integer.</summary>
    /// <param name="cssSize" type="string">Size from CSS attribute.</param>
    
    return parseInt(cssSize.substr(0, cssSize.length - 2), 10);
};


//
// Methods
//
Slider.prototype.layout = function()
{
    /// <summary>Fixes the positioning of the internal DIVs of the sliding windows.</summary>
    
	this.container.style.height = getWindowInnerHeight() + "px";
	this.container.style.width = getWindowInnerWidth() + "px";
	
	this.rightSlider.style.left = getWindowInnerWidth()/2 + "px";
	
	this.leftSlider.style.height = getWindowInnerHeight() + "px";
	this.leftSlider.style.width = getWindowInnerWidth()/2 + "px";
	this.rightSlider.style.height = getWindowInnerHeight() + "px";
	this.rightSlider.style.width = getWindowInnerWidth()/2 + "px";
	
	Slider.instance.onExpandCollapse(new Slider.ExpandCollapseEventArgs(
        Slider.parseCssSize(Slider.instance.leftSlider.style.width), 
        Slider.parseCssSize(Slider.instance.rightSlider.style.width), 
        Slider.instance.state));
};

Slider.prototype.expandCollapse = function(source)
{
    /// <summary>Expands/collapses the windows depending on the source button and the current state of the windows.</summary>
    /// <param name="source" type="string">Indicates which button triggered the expansion/collaption.</param>

	if (source != "Left" && source != "Right")
	{
		return;
	}
	
	// Call correct operation depending on the state of the windows.
	switch (this.state)
	{
		case Slider.states.LeftCollapsed:
			source == "Left" ? this.expand("Left") : this.collapseRight("Left");
			break;
			
		case Slider.states.RightCollapsed:
			source == "Left" ? this.collapseLeft("Right") : this.expand("Right");
			break;
			
		case Slider.states.Expanded:
			source == "Left" ? this.collapseLeft("Middle") : this.collapseRight("Middle");
			break;
	}
	
	this.updateButtonImages();
};

Slider.prototype.collapseLeft = function(startPosition)
{
    /// <summary>Collapses the windows to the left.</summary>
    /// <param name="startPosition" type="string">Indicates the state of the windows.</param>
    
    this.rightSlider.style.width = getWindowInnerWidth() - this.margin + "px";
    this.slide(
        this.rightSlider, 
        startPosition == "Right" ? getWindowInnerWidth() - this.margin : getWindowInnerWidth()/2, 
        this.margin,
        this.delay,
        function()
        {
            Slider.instance.leftSlider.style.width = Slider.instance.margin + "px";
            
            Slider.instance.onExpandCollapse(new Slider.ExpandCollapseEventArgs(
	            Slider.parseCssSize(Slider.instance.leftSlider.style.width), 
	            Slider.parseCssSize(Slider.instance.rightSlider.style.width), 
	            Slider.instance.state));
        });
    
	this.state = Slider.states.LeftCollapsed;
};

Slider.prototype.collapseRight = function(startPosition)
{
    /// <summary>Collapses the windows to the right.</summary>
    /// <param name="startPosition" type="string">Indicates the state of the windows.</param>
    
    this.leftSlider.style.width = getWindowInnerWidth() - this.margin + "px";
    this.slide(
        this.rightSlider, 
        startPosition == "Left" ? this.margin : getWindowInnerWidth()/2, 
        getWindowInnerWidth() - this.margin,
        this.delay,
        function() 
        {
            Slider.instance.rightSlider.style.width = Slider.instance.margin + "px";
            
            Slider.instance.onExpandCollapse(new Slider.ExpandCollapseEventArgs(
	            Slider.parseCssSize(Slider.instance.leftSlider.style.width), 
	            Slider.parseCssSize(Slider.instance.rightSlider.style.width), 
	            Slider.instance.state));
        });
        
    this.state = Slider.states.RightCollapsed;
};

Slider.prototype.expand = function(startPosition)
{
    /// <summary>Expands the windows to the middle.</summary>
    /// <param name="startPosition" type="string">Indicates the state of the windows.</param>
    
    if (startPosition == "Left")
    {
        this.leftSlider.style.width = getWindowInnerWidth()/2 + "px";
        this.slide(
            this.rightSlider, 
            this.margin, 
            getWindowInnerWidth()/2,
            this.delay,
            function()
            {
                Slider.instance.rightSlider.style.width = getWindowInnerWidth()/2 + "px";
                
                Slider.instance.onExpandCollapse(new Slider.ExpandCollapseEventArgs(
	                Slider.parseCssSize(Slider.instance.leftSlider.style.width), 
	                Slider.parseCssSize(Slider.instance.rightSlider.style.width), 
	                Slider.instance.state));
            });
    }
    else
    {
        this.rightSlider.style.width = getWindowInnerWidth()/2 + "px";
        this.slide(
            this.rightSlider, 
            getWindowInnerWidth() - this.margin, 
            getWindowInnerWidth()/2,
            this.delay,
            function()
            {
                Slider.instance.leftSlider.style.width = getWindowInnerWidth()/2 + "px";
    
                Slider.instance.onExpandCollapse(new Slider.ExpandCollapseEventArgs(
	                Slider.parseCssSize(Slider.instance.leftSlider.style.width), 
	                Slider.parseCssSize(Slider.instance.rightSlider.style.width), 
	                Slider.instance.state));
            });
    }

	this.state = Slider.states.Expanded;
};

Slider.prototype.slide = function(div, from, to, ms, callback)
{
    /// <summary>Creates the sliding animation.</summary>
    /// <param name="div" elementDomElement="true">Reference to the DIV element to slide.</param>
    /// <param name="from" type="Number" integer="true">Left start position.</param>
    /// <param name="to" type="Number" integer="true">Left end position.</param>
    /// <param name="ms" type="Number" integer="true">The time to animate the slide effect.</param>
    /// <param name="callback" type="function">Function to call when the animation has finised.</param>

	var startTime = (new Date()).valueOf();
	var pixelDelta = to - from;
	var nowRatio;
	
	function animate()
	{
		nowRatio = Math.min(1, ((new Date()).valueOf() - startTime)/ms);
		nowRatio = nowRatio*(3*(1 - nowRatio) + nowRatio*nowRatio);
		div.style.left = (from + pixelDelta*nowRatio) + "px";
		
		if (nowRatio < 1)
		{
			window.setTimeout(animate, 0);
		} 
		else
		{
		    callback();
		}
	}
	
	animate();
};

Slider.prototype.updateButtonImages = function()
{
    /// <summary>Updates the images of the buttons used to slide the windows.</summary>
    
    switch (this.state)
	{
		case Slider.states.LeftCollapsed:
            this.leftButton.style.backgroundImage = "url('../../img/ArrowRight.png')";
	        this.rightButton.style.backgroundImage = "url('../../img/ArrowRightRight.png')";
			break;
			
		case Slider.states.RightCollapsed:
            this.leftButton.style.backgroundImage = "url('img/ArrowLeftLeft.png')";
	        this.rightButton.style.backgroundImage = "url('img/ArrowLeft.png')";
			break;
			
		case Slider.states.Expanded:
            this.leftButton.style.backgroundImage = "url('img/ArrowLeft.png')";
	        this.rightButton.style.backgroundImage = "url('img/ArrowRight.png')";
			break;
	}
	
	fixPng(this.leftButton);
	fixPng(this.rightButton);
};


//
// Events
//
Slider.prototype.onExpandCollapse = function(eventArgs)
{
    /// <summary>Event fired when an expansion or collaption has been made.</summary>
    /// <param name="eventArgs" type="Slider.ExpandCollapseEventArgs">Event args.</param>
};

Slider.ExpandCollapseEventArgs = function(leftWidth, rightWidth, state)
{
    /// <summary>Struct with information of the window states.</summary>
    /// <param name="leftWidth" type="Number" integer="true">The width of the left window.</param>
    /// <param name="rightWidth" type="Number" integer="true">The width of the right window.</param>
    /// <param name="state" type="Slider.states">The state of the windows.</param>
    
    this.leftWidth = leftWidth;
    this.rightWidth = rightWidth;
    this.state = state;
};