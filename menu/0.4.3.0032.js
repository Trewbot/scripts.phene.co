/*
 *	Graphene Context Menu
 *	Written by Trewbot and Savoron
 *	Dec 26, 2014
 *
 *	Version:				Date:				Description:
 *		v0.0.0.0000				Oct 21, 2014		Script separated from Graphene/scripts.js
 *		v0.0.1.0001				Oct 21, 2014		Refactored
 *		v0.0.1.0002				Oct 21, 2014		Added Permalink and New Tab options when link targeted
 *		v0.0.1.0003				Oct 21, 2014		Added New Window option (opens popup window) when link targeted
 *		v0.0.1.0004				Oct 21, 2014		Blocked Permalink option when targeted link is external
 *		v0.0.1.0005				Oct 21, 2014		Added Log Element and Log Properties options when console is opened (determined by outerHeight/Width > innerHeight/Width - 150)
 *		v0.0.1.0005.5			Dec 25, 2014		Added quick fix for Graphene test build w0.4.0.0392
 *		v0.1.0.0006				Dec 25, 2014		Rewrite based on Graphene w0.4.*'s object-orientation as well as fixing compatability with non-Graphene sites
 *		v0.1.0.0007				Dec 26, 2014		Refactoring
 *		v0.2.0.0008				Dec 26, 2014		Moved styling into scripts
 *		v0.3.0.0009				Dec 26, 2014		Added positioning to keep menu visible
 *		v0.3.0.0009				Dec 26, 2014		Removed developer options
 *		v0.3.0.0010				Dec 26, 2014		Fixed parentAnchor erroring on null
 *		v0.3.0.0011				Dec 29, 2014		Removed unnecessary quotation marks from object keys. Used automatic formatting on source code for readability.
 *		v0.3.0.0012				Dec 29, 2014		Fixed Scroll to Top button.
 *		v0.4.0.0013				Jan 05, 2015		Added text selection check
 *		v0.4.0.0014				Jan 05, 2015		Fixed error on right-clicking context menu.
 *		v0.4.0.0015				Jan 05, 2015		Added Flash to copy text to clipboard.
 *		v0.4.1.0016				Jan 05, 2015		Added Search Google option for selected text
 *		v0.4.2.0017				Jan 06, 2015		Added copy link locations
 *		v0.4.2.0018				Jan 06, 2015		Fixed copy link location for blank links
 *		v0.4.2.0019				Jan 06, 2015		Added link location copying back in for blank links, switching the adress with the current loction
 *		v0.4.2.0019.5			Jan 15, 2015		Added quick fix for Graphene test build w0.4.0.0419
 *		v0.4.3.0020				Feb 21, 2015		Added video element source copy
 *		v0.4.3.0021				Feb 21, 2015		Added video element pause/play buttons
 *		v0.4.3.0022				Feb 21, 2015		Added video element mute/unmute buttons
 *		v0.4.3.0023				Feb 21, 2015		Fixed menu not closing after pressing copy buttons
 *		v0.4.3.0024				Feb 21, 2015		Added video element source download button
 *		v0.4.3.0025				Feb 21, 2015		Added link download button
 *		v0.4.3.0026				Feb 21, 2015		Fixed scroll to position function (__stp__)
 *		v0.4.3.0027				Feb 21, 2015		Removed download buttons on Firefox (due to non-supporting behavior of CORS download attributes)
 *		v0.4.3.0028				Feb 22, 2015		Fixed script set options bottom border not working
 *		v0.4.3.0029				Feb 22, 2015		Fixed script options not working when isOpen
 *		v0.4.3.0030				Feb 22, 2015		Renamed _g.m to _g/m and _g.context to _g.menu
 *		v0.4.3.0031				Feb 22, 2015		Fixed scrolling not removing context menu
 *		v0.4.3.0032				Feb 22, 2015		Added context menu removal on window blur
 */

Element.prototype.remove = function () {
	this.parentElement.removeChild(this);
}
Element.prototype.parentAnchor = function () {
	var t = this;
	if (t == null)
		return false;
	while (t.tagName.toLowerCase() !== 'html') {
		if (typeof t.href == 'string')
			return t;
		t = t.parentElement;
	}
	return false;
}
Element.prototype.isOff = function (x, y) {
	var r = this.getBoundingClientRect(),
		a;
	y -= (a = document.documentElement.scrollTop) ? a : scrollY;
	x -= (a = document.documentElement.scrollLeft) ? a : scrollX;
	return (x < r.left || x > r.right || y < r.top || y > r.bottom);
}
objectSize = function(o) {
	var s = 0, key;
	for (key in o)
		if(o.hasOwnProperty(key))s++;
	return s;
};
function __stp__(y) {
	var a,
		c = (a = document.documentElement.scrollTop) ? a : scrollY,
		d = y - c,
		i = d / 50;
	window.scrollBy(0, d % 50);
	for (var j = 0; j < 50; j++)
		window.setTimeout(function(){window.scrollBy(0, i)}, j * 10);
}

if(typeof Graphene !== 'object') {
	var Graphene = new(function () {
		this.cm = true;
		this.v = 'v0.4.2.0030';
		this.url = 'http://gra.phene.co';
	})(),
		_g = Graphene;
}

var __cms__ = document.createElement("style");
__cms__.innerHTML	 = '#context {background:#fff;box-shadow:rgba(50, 50, 50, 0.3) 0 0 3px;width:200px;padding:2px;}';
__cms__.innerHTML	+= '.context-option {cursor:pointer;padding:3px 15px;color:#111 !important;}';
__cms__.innerHTML	+= '.context-option:hover	{background:#f8f8f8;}';
__cms__.innerHTML	+= '.context-disabled {cursor:pointer;padding:3px 15px;color:#aaa;}';
document.documentElement.appendChild(__cms__);

_g.m = (_g.menu = {
	isOpen : false,
	open : function (e, o) {
		//	Do important stuff
		if (_g.m.isOpen)
			_g.m.close();
		var o = o || {};
		e.stopPropagation();
		e.preventDefault();
		var a,
			sy = (a = document.documentElement.scrollTop) ? a : scrollY,
			sx = (a = document.documentElement.scrollLeft) ? a : scrollX,
			ih = window.innerHeight,
			iw = window.innerWidth,
			my = e.pageY - sy,
			mx = e.pageX - sx;
		window._g_ctx_te = e.target;
		
		//	Create the Element
		var c = document.createElement('div');
		c.id				= 'context';
		c.style.position	= 'fixed';
		c.style.zIndex		= '9999999';

		//	Default Options
		var dops = {
			Back			: 'history.back()',
			Reload			: 'location.reload()',
			Forward			: 'history.forward()',
			"Scroll to Top"	: (sy > window.innerHeight / 2) ? '__stp__(0)' : ''
		};
		for (var op in dops)
			c.innerHTML += dops[op] !== '' ? '<div class="context-option" onclick="' + dops[op] + ';_g.m.close();">' + op + '</div>' : '<div class="context-disabled">' + op + '</div>';
		c.innerHTML += '<a href="view-source:' + window.location + '" target="_blank" onclick="_g.m.close();"><div class="context-option">View Source</div></a>';
		c.innerHTML += '<div style="margin:2px 4px;height:1px;background:#ddd;"></div>'

		//	Link Options
		var el = e.target,
		pa, hr = false;
		if (pa = el.parentAnchor()) {
			hr = pa.href;
			if (~hr.indexOf(Graphene.url))
				c.innerHTML += '<a href="' + hr + '" permalink onclick="_g.m.close();"><div class="context-option">Open Link as Permalink</div></a>';
			c.innerHTML += '<a href="' + hr + '" target="_blank" onclick="_g.m.close();"><div class="context-option">Open Link in New Tab</div></a>';
			c.innerHTML += '<div class="context-option" onclick="window.open(\'' + hr + '\', \'new_window\', \'menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0\');gra_cm_hide();">Open Link in New Window</div>';
			c.innerHTML += '<div class="context-option" onclick="_g.m.close();">Copy Link Address<div id="context-link-copy"></div></div>';
			if(!/Firefox/i.test(navigator.userAgent)) c.innerHTML += '<a href="' + hr + '" onclick="_g.m.close();" download target="_blank"><div class="context-option">Save Link As...</div></a>';
			c.innerHTML += '<div style="margin:2px 4px;height:1px;background:#ddd;"></div>'
		}
		
		//	Selected Text Options
		var text = typeof window.getSelection !== "undefined" ? window.getSelection().toString() : (typeof document.selection != "undefined" && document.selection.type == "Text") ? document.selection.createRange().text : "";
		if(text !== '') {
			c.innerHTML += '<div class="context-option" onclick="_g.m.close();">Copy<div id="context-copy"></div></div>';
			c.innerHTML += '<a href="https://www.google.com/search?q=' + encodeURIComponent(text) + '" target="_blank" onclick="_g.m.close();"><div class="context-option">Search Google for "' + (text.length > 16 ? text.substring(0,15) + '...' : text) + '"</div></a>';
			c.innerHTML += '<div style="margin:2px 4px;height:1px;background:#ddd;"></div>'
		}
		
		//	Script Set Options
		for(var op in o)
			c.innerHTML += o[op] !== '' ? '<div class="context-option" onclick="' + o[op] + ';_g.m.close();">' + op + '</div>' : '<div class="context-disabled">' + op + '</div>';
		if(objectSize(o) > 0)
			c.innerHTML += '<div style="margin:2px 4px;height:1px;background:#ddd;"></div>';

		//	Video Options
		if(e.target.tagName === 'VIDEO'){
			c.innerHTML += '<div class="context-option" onclick="window._g_ctx_te.p' + (e.target.paused ? 'lay' : 'ause') + '();_g.m.close();">' + (e.target.paused ? 'Play' : 'Pause') + '</div>';
			c.innerHTML += '<div class="context-option" onclick="window._g_ctx_te.muted = !window._g_ctx_te.muted;_g.m.close();">' + (e.target.muted ? 'Unmute' : 'Mute') + '</div>';
			c.innerHTML += '<div class="context-option" onclick="_g.m.close();">Copy Video Source<div id="context-video-copy"></div></div>';
			if(!/Firefox/i.test(navigator.userAgent)) c.innerHTML += '<a href="' + e.target.src + '" onclick="_g.m.close();" download target="_blank"><div class="context-option">Save Video As...</div></a>';
			c.innerHTML += '<div style="margin:2px 4px;height:1px;background:#ddd;"></div>';
		}
		
		//	Dev Options
		c.innerHTML += '<a href="' + _g.url + '/changes" onclick="_g.m.close();"><div class="context-disabled"><i>' + (_g.cm ? 'Context Menu' : 'Graphene') + ' ' + _g.v + '</i></div></a>';

		//	Append Element
		c.style.opacity = 0;
		_g.m.isOpen = true;
		document.body.appendChild(c);
		
		//	Copy Button
		if(text !== '') _g.m.copy('context-copy',text);
		if(hr !== false) _g.m.copy('context-link-copy',hr!=''?hr:location.href);
		if(e.target.tagName === 'VIDEO') _g.m.copy('context-video-copy',e.target.src);
		
		//	Position/Show the Element
		var r	= c.getBoundingClientRect(),
			ch	= r.height,
			cw	= r.width;
		c.style.top		= ((ih > ch && my + ch > ih) ? ih - ch : (ih <= ch) ? 0 : my) + 'px';
		c.style.left	= ((iw > cw && mx + cw > iw) ? iw - cw : (iw <= cw) ? 0 : mx) + 'px';
		c.style.opacity	= 1;

		return false;
	},
	close : function(){
		if (this.isOpen) {
			this.isOpen = false;
			document.getElementById('context').remove();
		}.
	},
	copy : function(elementID,text){
		swfobject.embedSWF('http://scripts.phene.co/menu/include/copy.swf', elementID, "200", "21", "0.0.1", false, {cBoard:text}, {wMode:'transparent'}, {}, function(e){
			e.ref.style.opacity = 0;
			e.ref.style.position = 'absolute';
			e.ref.style.marginTop = '-2px';
			e.ref.style.left = '2px';
		});
	}
});

document.documentElement.oncontextmenu = _g.m.open;
window.addEventListener('blur', function(e){_g.m.close()});
window.addEventListener('scroll', function(e){_g.m.close()});
document.addEventListener('click', function (e) {
	if (_g.m.isOpen && document.getElementById('context').isOff(e.pageX, e.pageY))
		_g.m.close();
});
