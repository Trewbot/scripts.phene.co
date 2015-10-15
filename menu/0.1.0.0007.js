/*
 *	Graphene Context Menu
 *
 *	Changelog:
 *		v0.0.0.0000		Script separated from Graphene/scripts.js
 *		v0.0.1.0001		Refactored
 *		v0.0.1.0002		Added Permalink and New Tab options when link targeted
 *		v0.0.1.0003		Added New Window option (opens popup window) when link targeted
 *		v0.0.1.0004		Blocked Permalink option when targeted link is external
 *		v0.0.1.0005		Added Log Element and Log Properties options when console is opened (determined by outerHeight/Width > innerHeight/Width - 150)
 *		v0.0.1.0005.5	Added quick fix for Graphene test build w0.4.0.0392
 *		v0.1.0.0006		Rewrite based on Graphene w0.4.*'s object-orientation as well as fixing compatability with non-Graphene sites
 *		v0.1.0.0007		Refactoring
 *
 */

Element.prototype.remove = function() {
	this.parentElement.removeChild(this);
}
Element.prototype.parentAnchor = function() {
	var t = this;
	while(t.tagName.toLowerCase()!=='html') {
		if(typeof t.href == 'string') return t;
		t = t.parentElement;
	} return false;
}
Element.prototype.isOff = function(x, y) {
	var r  = this.getBoundingClientRect(),a;
		y -= (a=document.documentElement.scrollTop)?a:scrollY;
		x -= (a=document.documentElement.scrollLeft)?a:scrollX;
	return (x < r.left || x > r.right || y < r.top || y > r.bottom);
}

var __gra__ = typeof Graphene == "function" ? Graphene : function(){
	this.cm = true;
	this.v = "v0.1.0.0007";
	this.url = "http://gra.phene.co";
};

if(typeof gra !== 'object') var gra = new __gra__;

gra.context = {
	"isOpen"	: false,
	"open"		: function(e,o){
		//Do important stuff
		if(this.context.isOpen) this.context.close();
		var o = o || {};
		e.stopPropagation();
		
		//Create the Element
		var c = document.createElement('div');
		c.id = "context";
		c.style.position = "fixed";
		c.style.zIndex = "9999999";
		
		//Position the Element
		var a,
			sy = (a=document.documentElement.scrollTop)?a:scrollY,
			sx = (a=document.documentElement.scrollLeft)?a:scrollX,
			ih = window.innerHeight,
			iw = window.innerWidth,
			my = e.pageY - sy,
			mx = e.pageX - sx;
		c.style.top = my + 'px';
		c.style.left = mx + 'px';
		
		//Default Options
		var dops = {
			"Back"		: "history.back()",
			"Reload"	: "location.reload()",
			"Forward"	: "history.forward()",
			"Scroll to Top": (sy>window.innerHeight/2)?"scrollToPos(0)":""
		};
		for(var op in dops) c.innerHTML += dops[op]!==''?'<div class="context-option" onclick="'+dops[op]+';gra.context.close();">'+op+'</div>':'<div class="context-disabled">'+op+'</div>';
		c.innerHTML += '<a href="view-source:'+window.location+'" target="_blank" onclick="gra.context.close();"><div class="context-option">View Source</div></a>';
		c.innerHTML += '<div style="margin:2px 4px;height:1px;background:#ddd;"></div>'
		
		//Link Options
		var el = e.target, pa;
		if(pa = el.parentAnchor()) {
			var hr = pa.href;
			if(~hr.indexOf(gra.url)) c.innerHTML += '<a href="'+hr+'" permalink onclick="gra.context.close();"><div class="context-option">Open Link as Permalink</div></a>';
			c.innerHTML += '<a href="'+hr+'" target="_blank" onclick="gra.context.close();"><div class="context-option">Open Link in New Tab</div></a>';
			c.innerHTML += '<div class="context-option" onclick="window.open(\''+hr+'\', \'new_window\', \'menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0\');gra_cm_hide();">Open Link in New Window</div>';
			c.innerHTML += '<div style="margin:2px 4px;height:1px;background:#ddd;"></div>'
		}
		
		//Script Set Options
		for(var op in o) c.innerHTML += o[op]!==''?'<div class="context-option" onclick="'+o[op]+';gra.context.close();">'+op+'</div>':'<div class="context-disabled">'+op+'</div>';
		if(o.length > 0) c.innerHTML += '<div style="margin:2px 4px;height:1px;background:#ddd;"></div>';
		
		//Dev Options
		if(window.outerHeight - window.innerHeight > 150 || window.outerWdith - window.innerWidth > 150) {
			window.contextTarget = e.target;
			c.innerHTML += '<div class="context-option" onclick="console.log(contextTarget);gra.context.close();">Log Element</div>';
			c.innerHTML += '<div class="context-option" onclick="console.dir(contextTarget);gra.context.close();">Log Propeties</div>';
		}
		c.innerHTML += '<a href="'+this.url+'/changes" onclick="gra.context.close();"><div class="context-disabled"><i>'+(this.cm?'Context Menu':'Graphene')+' '+this.v+'</i></div></a>';
		
		//Show Element
		this.context.isOpen = true;
		document.body.appendChild(c);
		return false;
	}.bind(gra),
	"close"		: function(){if(this.context.isOpen) {
		this.context.isOpen = false;
		document.getElementById('context').remove();
	}}.bind(gra)
};

document.documentElement.oncontextmenu = gra.context.open;
document.addEventListener('scroll', gra.context.close);	
document.addEventListener('contextmenu', gra.context.close);
document.addEventListener('click', function(e){if(this.context.isOpen && document.getElementById('context').isOff(e.pageX,e.pageY)) this.context.close();}.bind(gra));