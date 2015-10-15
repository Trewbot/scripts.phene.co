//SVG Adaptive Graph Library API v0.0.3
//Written by Trewbot 2014

function sagl() {}

sagl.prototype.axis			   = "#404040";		// Axis Line Color
sagl.prototype.axisWidth	   = 2;				// Axis Line Width

sagl.prototype.toGraph		   = new Array();	// Array of Graphs

sagl.prototype.yMin			   = -3.5;			// Starting Y Value
sagl.prototype.yMax			   = 3.5;			// Ending Y Value
sagl.prototype.yStep		   = 1;				// Y Value per Notch

sagl.prototype.xMin			   = -6;			// Starting X Value
sagl.prototype.xMax			   = 6;				// Ending X Value
sagl.prototype.xStep		   = 1;				// X Value per Notch

sagl.prototype.xRate           = 1;				// Pixels per point of calculation

sagl.prototype.notchHeight     = 3;				// Height of Notch
sagl.prototype.notchLabel      = false;			// Boolean to label Notches

sagl.prototype.zoomSpeed       = 25;			// Percent zoom per scroll

sagl.prototype.subInt          = 10;			// Default amount of Sub-intervals
sagl.prototype.calcMin         = -5;			// Minimum value of operation
sagl.prototype.calcMax         = 5;				// Maximum value of operation
sagl.prototype.dashStroke      = "#ac7272";		// Operation limiter color
sagl.prototype.dashArray       = "5,5";			// Operation limiter dash
sagl.prototype.rectFill        = "#c0ff80";		// Fill color of operational rectangles
sagl.prototype.rectStroke      = "#a6ff4d";		// Stroke color of operational rectangles
sagl.prototype.rectStrokeWidth = 2;				// Stroke width of operational rectangles

sagl.prototype.pan             = true;			// Boolean for toggle panning
var saglmousepan               = false;			// Boolean for panning
var saglmousexstart            = 0;				// Starting mouse X position
var saglmouseystart            = 0;				// Starting mouse Y position
var saglmouseymin              = 0;				// Starting Y min
var saglmousexmin              = 0;				// Starting X min
var saglmouseymax              = 0;				// Starting Y max 
var saglmousexmax              = 0;				// Starting X max

sagl.prototype.start = function() {
	if(typeof this.svg == 'object') {
		if(typeof this.yMin == 'number' && typeof this.yMax == 'number' && typeof this.yStep == 'number' && typeof this.xMin == 'number' && typeof this.xMax == 'number' && typeof this.xStep == 'number') {
			this.svg.addEventListener('mousewheel', function(e) {
				e.preventDefault();
				if(e.wheelDelta < 0) {
					var zoom = ((100 + sagl.zoomSpeed) / 100);
				} else {
					var zoom = (100 / ((100 + sagl.zoomSpeed)));
				}
				sagl.yMin = sagl.yMin * zoom;
				sagl.yMax = sagl.yMax * zoom;
				sagl.xMin = sagl.xMin * zoom;
				sagl.xMax = sagl.xMax * zoom;
				sagl.renderAxes();
				for(var i = 0; i <= sagl.toGraph.length; i++) {
					sagl.graph(i);
				}
			})
			if(this.pan) {
				this.svg.addEventListener('mousedown', function(e) {
					e.preventDefault();
					saglmousepan = true;
					saglmouseystart = e.y;
					saglmousexstart = e.x;
					saglmouseymin   = sagl.yMin;
					saglmousexmin   = sagl.xMin;
					saglmouseymax   = sagl.yMax;
					saglmousexmax   = sagl.xMax;
				})
				window.addEventListener('mouseup', function(e) {
					e.preventDefault();
					saglmousepan = false;
				})
				window.addEventListener('mousemove', function(e) {
					if(saglmousepan) {
						var svgWidth  = sagl.svg.clientWidth;
						var svgHeight = sagl.svg.clientHeight;
						var yRatio    = svgHeight / (sagl.yMax - sagl.yMin);
						var xRatio    = svgWidth / (sagl.xMax - sagl.xMin);
						sagl.yMin     = saglmouseymin + ((e.y - saglmouseystart) / yRatio);
						sagl.yMax     = saglmouseymax + ((e.y - saglmouseystart) / yRatio);
						sagl.xMin     = saglmousexmin - ((e.x - saglmousexstart) / xRatio);
						sagl.xMax     = saglmousexmax - ((e.x - saglmousexstart) / xRatio);
						sagl.renderAxes();
						for(var i = 0; i <= sagl.toGraph.length; i++) {
							sagl.graph(i);
						}
					}
				})
			}
		}
	}
	this.renderAxes();
}
sagl.prototype.renderAxes = function() {
	if(typeof this.svg == 'object') {
		this.clearSVG();
		var svgWidth  = this.svg.clientWidth;
		var svgHeight = this.svg.clientHeight;
		if(typeof this.yMin == 'number' && typeof this.yMax == 'number' && typeof this.yStep == 'number' && typeof this.xMin == 'number' && typeof this.xMax == 'number' && typeof this.xStep == 'number') {
			var yRatio = svgHeight / (this.yMax - this.yMin);
			var xRatio = svgWidth / (this.xMax - this.xMin);
			this.yValueOfZero = svgHeight + (this.yMin * yRatio);
			this.xValueOfZero = -this.xMin * xRatio;
			this.drawLine(this.yValueOfZero, this.yValueOfZero, 0, svgWidth, this.axis, this.axisWidth);
			this.drawLine(0, svgHeight, this.xValueOfZero, this.xValueOfZero, this.axis, this.axisWidth);
			for(var i = 0; i <= this.xMax; i = i + this.xStep) {
				this.drawLine(this.yValueOfZero - this.notchHeight, this.yValueOfZero + this.notchHeight, this.xValueOfZero + (i * xRatio), this.xValueOfZero + (i * xRatio), this.axis, this.axisWidth, 'notch')
			}
			for(var i = 0; i >= this.xMin; i = i - this.xStep) {
				this.drawLine(this.yValueOfZero - this.notchHeight, this.yValueOfZero + this.notchHeight, this.xValueOfZero + (i * xRatio), this.xValueOfZero + (i * xRatio), this.axis, this.axisWidth, 'notch')
			}
			for(var i = 0; i <= this.yMax; i = i + this.yStep) {
				this.drawLine(this.yValueOfZero + (i * yRatio), this.yValueOfZero + (i * yRatio), this.xValueOfZero - this.notchHeight, this.xValueOfZero + this.notchHeight, this.axis, this.axisWidth, 'notch')
			}
			for(var i = 0; i >= this.yMin; i = i - this.yStep) {
				this.drawLine(this.yValueOfZero + (i * yRatio), this.yValueOfZero + (i * yRatio), this.xValueOfZero - this.notchHeight, this.xValueOfZero + this.notchHeight, this.axis, this.axisWidth, 'notch')
			}
		}
	}
}
sagl.prototype.graph = function(graphNum) {
	if(typeof this.svg == 'object' && typeof this.stroke == 'string' && (typeof this.strokeWidth == 'string' || typeof this.strokeWidth == 'number') && typeof this.toGraph[graphNum] == 'string'){
		var svgWidth  = this.svg.clientWidth;
		var svgHeight = this.svg.clientHeight;
		var yRatio    = svgHeight / (this.yMax - this.yMin);
		var xRatio    = svgWidth / (this.xMax - this.xMin);
		var pointStr  = "";
		for(var i = 0; i <= svgWidth; i = i + this.xRate) {
			var x = (i - this.xValueOfZero) / xRatio;
			var y = (this.yValueOfZero - (eval(this.fX(this.toGraph[graphNum])) * yRatio));
			if(!isNaN(y) && y != Infinity) {
				if(i==svgWidth) {
					pointStr += i+" "+y;
				} else {
					pointStr += i+" "+y+",";
				}
			}
		}
		var line = document.createElementNS('http://www.w3.org/2000/svg','polyline');
		line.setAttribute('points', pointStr);
		line.setAttribute('stroke', this.stroke);
		line.setAttribute('stroke-width', this.strokeWidth);
		line.setAttribute('fill', 'none');
		line.setAttribute('id', 'graph'+graphNum);
		this.svg.appendChild(line);
	}
}
sagl.prototype.drawLine = function(y1, y2, x1, x2, stroke, strokeWidth, id) {
	var line = document.createElementNS('http://www.w3.org/2000/svg','line');
	line.setAttribute('y1', y1);
	line.setAttribute('y2', y2);
	line.setAttribute('x1', x1);
	line.setAttribute('x2', x2);
	line.setAttribute('stroke', stroke);
	line.setAttribute('stroke-width', strokeWidth);
	line.setAttribute('fill', 'none');
	line.setAttribute('id', id);
	this.svg.appendChild(line);
}
sagl.prototype.clearGraph = function() {
	if(document.getElementById('graph0')) {
		for(var i = 0; i<this.toGraph.length;i++) {
			this.svg.removeChild(document.getElementById('graph'+i));
		}
	}
}
sagl.prototype.container = function() {
	if(document.getElementById('dash0')) {
		this.svg.removeChild(document.getElementById('dash0'));
	}
	if(document.getElementById('dash1')) {
		this.svg.removeChild(document.getElementById('dash1'));
	}
	var xRatio = this.svg.clientWidth / (this.xMax - this.xMin);
	var yRatio = this.svg.clientHeight / (this.yMax - this.yMin);
	var line0 = document.createElementNS('http://www.w3.org/2000/svg','line');
	line0.setAttribute('y1', "0");
	line0.setAttribute('y2', this.svg.clientHeight);
	var x = this.xValueOfZero + (this.calcMin * xRatio);
	line0.setAttribute('x1', x);
	line0.setAttribute('x2', x);
	line0.setAttribute('stroke', this.dashStroke);
	line0.setAttribute('stroke-width', this.axisWidth);
	line0.setAttribute('stroke-dasharray', this.dashArray)
	line0.setAttribute('fill', 'none');
	line0.setAttribute('id', 'dash0');
	this.svg.appendChild(line0);
	
	var line1 = document.createElementNS('http://www.w3.org/2000/svg','line');
	line1.setAttribute('y1', "0");
	line1.setAttribute('y2', this.svg.clientHeight);
	var x = this.xValueOfZero + (this.calcMax * xRatio);
	line1.setAttribute('x1', x);
	line1.setAttribute('x2', x);
	line1.setAttribute('stroke', this.dashStroke);
	line1.setAttribute('stroke-width', this.axisWidth);
	line1.setAttribute('stroke-dasharray', this.dashArray)
	line1.setAttribute('fill', 'none');
	line1.setAttribute('id', 'dash1');
	this.svg.appendChild(line1);
}
sagl.prototype.RAM = function(type, graph) {
	graph = typeof graph !== 'undefined' ? graph : 0;
	this.clearRam();
	if(typeof this.toGraph[graph] == 'string') {
		var area = 0;
		var xRatio = this.svg.clientWidth / (this.xMax - this.xMin);
		var yRatio = this.svg.clientHeight / (this.yMax - this.yMin);
		var intTotal = this.calcMax - this.calcMin;
		var intWidth = intTotal / this.subInt;
		for(var i = 0; i < this.subInt; i++) {
			var x = this.calcMin + (i * intWidth);
			if(type=="left"){
				var y = (this.yValueOfZero - (eval(this.fX(this.toGraph[graph])) * yRatio));
			} else if (type=="right") {
				var tmpX = x;
				x += intWidth;
				var y = (this.yValueOfZero - (eval(this.fX(this.toGraph[graph])) * yRatio));
				x = tmpX;
			} else {
				var tmpX = x;
				x += (intWidth / 2);
				var y = (this.yValueOfZero - (eval(this.fX(this.toGraph[graph])) * yRatio));
				x = tmpX;
			}
			var litX = (x * xRatio) + this.xValueOfZero;
			var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
			if(this.yValueOfZero - y > 0) {
				rect.setAttribute('y', y);
				rect.setAttribute('height', this.yValueOfZero - y);
			} else {
				rect.setAttribute('y', this.yValueOfZero);
				rect.setAttribute('height', y - this.yValueOfZero);
			}
			rect.setAttribute('x', litX);
			rect.setAttribute('width', intWidth * xRatio);
			rect.setAttribute('fill', this.rectFill);
			rect.setAttribute('stroke', this.rectStroke);
			rect.setAttribute('stroke-width', this.rectStrokeWidth);
			rect.setAttribute('id', 'ramrect'+i);
			console.log(rect);
			this.svg.appendChild(rect);
			area += Math.abs(intWidth * ((this.yValueOfZero - y) / yRatio));
		}
		this.clearGraph();
		this.graph(graph);
		this.container();
		return area;
	}
}
sagl.prototype.clearRam = function() {
	if(document.getElementById('ramrect0')) {
		var i = 0;
		while(document.getElementById('ramrect'+i)) {
			this.svg.removeChild(document.getElementById('ramrect'+i));
			i++;
		}
	}
}
sagl.prototype.clearSVG = function() {
	var toRem = this.svg.children.length;
	for(var i = 1; i <= toRem; i++) {
		this.svg.removeChild(this.svg.children[toRem - i]);
	}
}
sagl.prototype.fX = function(func) {
	var n = func.replace(/(\w+)\^(\w+)/g, "Math.pow($1, $2)")
	.replace(/([0-9]+)([A-z]+)/g, "$1 * $2")
	.replace(/\)([A-z]+)/g, ") * $1")
	.replace(/log\((.+)\)/g, "(Math.log($1) / Math.log(10))")
	.replace(/ln\((.+)\)/g, "Math.log($1)")
	.replace(/logBase\((.+), (.+)\)/g, "(Math.log($2) / Math.log($1))")
	.replace("sqrt", "Math.sqrt")
	.replace(/\|(.+)\|/g, "Math.abs($1)")
	.replace("sin", "Math.sin")
	.replace("cos", "Math.cos")
	.replace("tan", "Math.tan")
	.replace(/csc\((.+)\)/g, "(1/Math.sin($1))")
	.replace(/sec\((.+)\)/g, "(1/Math.cos($1))")
	.replace(/cot\((.+)\)/g, "(1/Math.tan($1))")
	.replace(/ddx\((.+)\)/g, "sagl.nDerive(x, $1)");
	return n;
}
sagl.prototype.nDerive = function(h, graph){
	x=h-((this.xMax-sagl.xMin)/this.svg.clientWidth);
	ptb=eval(this.fX(this.toGraph[graph]));
	x=h+((this.xMax-this.xMin)/this.svg.clientWidth);
	pta=eval(this.fX(this.toGraph[graph]));
	ddx=(pta-ptb)/(2*((this.xMax-this.xMin)/this.svg.clientWidth));
	return ddx;
}
sagl.prototype.extrema = function(graphNum){
	if(typeof this.svg == 'object' && typeof this.stroke == 'string' && (typeof this.strokeWidth == 'string' || typeof this.strokeWidth == 'number') && typeof this.toGraph[graphNum] == 'string'){
		var svgWidth  = this.svg.clientWidth;
		var svgHeight = this.svg.clientHeight;
		var yRatio    = svgHeight / (this.yMax - this.yMin);
		var xRatio    = svgWidth / (this.xMax - this.xMin);
		var ret = [];
		for(var i = 0; i <= svgWidth; i += (this.xRate/2)) {
			var x = (i - this.xValueOfZero) / xRatio;
			var y = (this.yValueOfZero - (eval(this.fX(this.toGraph[graphNum])) * yRatio));
			if(!isNaN(y) && y != Infinity && Math.round(this.nDerive(x, graphNum)*100)/100 == 0) {
				var actualY = (this.yValueOfZero - y) / yRatio;
				ret.push(x+","+actualY);
			}
		}
		return ret;
	} else {
		return false;
	}
}
var sagl = new sagl;