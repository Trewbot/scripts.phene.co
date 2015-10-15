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
 *
 */

var _cm = false;
function gra_cm (e,options) {
	//Do Important Stuff
	if(_cm) gra_cm_hide();
	var opts = options || {};
	e.stopPropagation();
	
	//Create the Element
	var cmo = document.createElement('div');
	cmo.id = 'context';
	cmo.style.position = 'fixed';
	cmo.style.zIndex = '1000';
	
	//Position the Element
	var sy = document.documentElement.scrollTop?document.documentElement.scrollTop:scrollY,
		sx = document.documentElement.scrollLeft?document.documentElement.scrollLeft:scrollX,
		ih = window.innerHeight,
		iw = window.innerWidth,
		my = e.pageY - sy,
		mx = e.pageX - sx;
	cmo.style.top = e.pageY - ((document.documentElement.scrollTop)?document.documentElement.scrollTop:scrollY) + 'px';
	cmo.style.left = e.pageX - ((document.documentElement.scrollLeft)?document.documentElement.scrollLeft:scrollX) + 'px';
	
	//Default Options
	var dops = {
		"Back":	"history.back()",
		"Reload": "location.reload()",
		"Forward": "history.forward()",
		"Scroll to Top": (sy>window.innerHeight/2)?"scrollToPos(0)":""
	};
	for(var op in dops) {
		if(dops[op]!=='') cmo.innerHTML += '<div class="context-option" onclick="'+dops[op]+';gra_cm_hide();">'+op+'</div>';
		else cmo.innerHTML += '<div class="context-disabled">'+op+'</div>';
	}
	cmo.innerHTML += '<a href="view-source:'+window.location+'" target="_blank" onclick="gra_cm_hide();"><div class="context-option">View Source</div></a>';
	cmo.innerHTML += '<div style="margin:2px 4px;height:1px;background:#ddd;"></div>'
	
	//Link Options
	var el = e.target, pa;
	if(pa = el.parentAnchor()) {
		var hr = pa.href;
		if(~hr.indexOf(gra.url)) cmo.innerHTML += '<a href="'+hr+'" permalink onclick="gra_cm_hide();"><div class="context-option">Open Link as Permalink</div></a>';
		cmo.innerHTML += '<a href="'+hr+'" target="_blank" onclick="gra_cm_hide();"><div class="context-option">Open Link in New Tab</div></a>';
		cmo.innerHTML += '<div class="context-option" onclick="window.open(\''+hr+'\', \'new_window\', \'menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0\');gra_cm_hide();">Open Link in New Window</div>';
		cmo.innerHTML += '<div style="margin:2px 4px;height:1px;background:#ddd;"></div>'
	}
	
	//Script Set Options
	for(var op in opts) {
		if(opts[op]!=='') cmo.innerHTML += '<div class="context-option" onclick="'+opts[op]+';gra_cm_hide();">'+op+'</div>';
		else cmo.innerHTML += '<div class="context-disabled">'+op+'</div>';
	}
	if(opts.length > 0) cmo.innerHTML += '<div style="margin:2px 4px;height:1px;background:#ddd;"></div>';
	
	//Dev Options
	if(window.outerHeight - window.innerHeight > 150 || window.outerWdith - window.innerWidth > 150) {
		window.contextTarget = e.target;
		cmo.innerHTML += '<div class="context-option" onclick="console.log(contextTarget);gra_cm_hide();">Log Element</div>';
		cmo.innerHTML += '<div class="context-option" onclick="console.dir(contextTarget);gra_cm_hide();">Log Propeties</div>';
	}
	cmo.innerHTML += '<a href="'+gra.url+'/changes" onclick="gra_cm_hide();"><div class="context-disabled"><i>Graphene '+gra.v+'</i></div></a>';
	
	//Show Element
	_cm = true;
	document.body.appendChild(cmo);
	return false;
}
document.documentElement.oncontextmenu = gra_cm;
function gra_cm_hide () {
	_cm = false;
	document.getElementById('context').remove();
}
Element.prototype.remove = function() {
	this.parentElement.removeChild(this);
}
Element.prototype.parentAnchor = function() {
	var top = this;
	while(top.tagName.toLowerCase()!=='html') {
		if(typeof top.href == 'string') return top;
		top = top.parentElement;
	} return false;
}
document.addEventListener('click', function(e){
	if(_cm) {
		var cmo = document.getElementById('context'),cmb = cmo.getBoundingClientRect(), y = e.pageY - ((document.documentElement.scrollTop)?document.documentElement.scrollTop:scrollY), x = e.pageX - ((document.documentElement.scrollLeft)?document.documentElement.scrollLeft:scrollX);
		if(x < cmb.left || x > cmb.right || y < cmb.top || y > cmb.bottom) gra_cm_hide();
	}
});
document.addEventListener('scroll', function() {
	if(_cm) gra_cm_hide();
});	
document.addEventListener('contextmenu', function() {
	if(_cm) gra_cm_hide();
});