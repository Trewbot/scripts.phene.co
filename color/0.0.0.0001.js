var gra_clr = function(parent, ops) {
	if(typeof window.gra_clr_int=='undefined') this.int = window.gra_clr_int = 0;
	else this.int        = window.gra_clr_int +++ 1;
	if(typeof ops!=='object')var ops={};
	this.input           = typeof ops.input=='object'?ops.input:{};
	this.parent          = parent;
	this.color           = typeof ops.color=='string'?ops.color:'#FF0000';
	this.hue             = function(h) {
		var r,g,b,
			m = Math.floor(h*6),
			f = h*6-m,
			q = 1-f,
			t = 1-q;
		switch(m%6){
			case 0:r=1,g=t,b=0;break;
			case 1:r=q,g=1,b=0;break;
			case 2:r=0,g=1,b=t;break;
			case 3:r=0,g=q,b=1;break;
			case 4:r=t,g=0,b=1;break;
			case 5:r=1,g=0,b=q;break;
		}
		return{
			r:Math.floor(r*255),
			g:Math.floor(g*255),
			b:Math.floor(b*255)
		};
	}
	this.rth             = function(r,g,b) {
			r  /= 255,
			g  /= 255,
			b  /= 255;
		var max = Math.max(r,g,b),
			min = Math.min(r,g,b),
			d   = max - min,
			h,
			s   = max==0?0:d/max,
			v   = max,
			d   = max-min;
			if(max==min){h=0;}
			else{switch(max){
				case r:h=(g-b)/d+(g<b?6:0);break;
				case g:h=(b-r)/d+2;break;
				case b:h=(r-g)/d+4;break;
			}
			h/=6;
		}
		return[h,s,v];
	}
	this.htr             = function(h,s,v) {
		var r,g,b,
			i=Math.floor(h*6),
			f=h*6-i,
			p=v*(1-s),
			q=v*(1-f*s),
			t=v*(1-(1-f)*s);
		switch(i%6){
			case 0:r=v,g=t,b=p;break;
			case 1:r=q,g=v,b=p;break;
			case 2:r=p,g=v,b=t;break;
			case 3:r=p,g=q,b=v;break;
			case 4:r=t,g=p,b=v;break;
			case 5:r=v,g=p,b=q;break;
		}
		return[r*255,g*255,b*255];
	}
	this.thx             = function(n) {
		n = parseInt(n,10);
		if(isNaN(n)) return "00";
		n = Math.max(0,Math.min(n,255));
		return "0123456789ABCDEF".charAt((n-n%16)/16)+"0123456789ABCDEF".charAt(n%16);
	}
	this.hxr             = function(h) {
		return {
			r: (parseInt(((h.charAt(0)=="#") ? h.substring(1,7):h).substring(0,2),16)),
			g: (parseInt(((h.charAt(0)=="#") ? h.substring(1,7):h).substring(2,4),16)),
			b: (parseInt(((h.charAt(0)=="#") ? h.substring(1,7):h).substring(4,6),16))
		}
	}
	this.elem            = document.createElement('table');
	this.elem.id         = 'gra_clr-'+this.int;
	this.elem.style.position     = 'relative';
	this.elem.style.margin       = '-4px 2px 8px 2px';
	this.elem.style.padding      = '8px';
	this.elem.style.paddingRight = '16px';
	this.elem.style.background   = '#fff';
	this.elem.style.border       = '1px solid #ddd';
	this.row                     = this.elem.insertRow();
	this.parent.appendChild(this.elem);
	this.draggingHue             = false;
	this.draggingSat             = false;
	
	//Darkness and Saturation Input
	this.satel                   = document.createElement('div');
	this.satel.className         = 'gra_clr-sat';
	this.satel.id                = 'gra_clr-sat-'+this.int;
	this.satel.style.position    = 'relative';
	this.satel.style.width       = '165px';
	this.satel.style.height      = '165px';
	this.satel.style.marginRight = '6px';
	this.satel.style.cursor      = 'pointer';
	this.satel.style.background  = 'rgb(255,0,0)';
	this.satel.innerHTML         = '<svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gd" x1="0%" y1="100%" x2="0%" y2="0%"><stop offset="0%" stop-color="#000000" stop-opacity="1"></stop><stop offset="100%" stop-color="#000000" stop-opacity="0"></stop></linearGradient><linearGradient id="gs" x1="0%" y1="100%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffffff" stop-opacity="1"></stop><stop offset="100%" stop-color="#ffffff" stop-opacity="0"></stop></linearGradient></defs><rect x="0" y="0" width="100%" height="100%" fill="url(#gs)"></rect><rect x="0" y="0" width="100%" height="100%" fill="url(#gd)"></rect></svg>'
	this.satsl                   = document.createElement('div');
	this.satsl.className         = 'gra_clr-sat-selector';
	this.satsl.id                = 'gra_clr-sat-selector-'+this.int;
	this.satsl.style.position    = 'absolute';
	this.satsl.style.left        = 'calc(100% - 6px)';
	this.satsl.style.top         = '-6px';
	this.satsl.style.width       = '9px';
	this.satsl.style.height      = '9px';
	this.satsl.style.border      = '1px solid #111';
	this.satsl.style.borderRadius= '50%';
	this.satel.appendChild(this.satsl);
	this.satmf                   = function(e) {
		e.preventDefault();
		var r            = this.satel.getBoundingClientRect(),
			t            = e.pageY - r.top,
			l            = e.pageX - r.left;
		if(t > r.height) t = r.height;
		if(l > r.width)  l = r.width;
		if(t < 0) t = 0;
		if(l < 0) l = 0;
		this.s = parseInt(l,10)/r.width;
		this.v = 1-(parseInt(t,10)/r.height);
		this.satsl.style.top  = t - 6 + "px";
		this.satsl.style.left = l - 6 + "px";
		this.update()
	}
	this.satmd                   = function(e) {
		this.draggingSat = true;
		this.satmf(e);
	}
	this.satmm                   = function(e) {
		if(this.draggingSat) this.satmf(e);
	}
	this.satel.addEventListener('mousedown', this.satmd.bind(this));
	document.addEventListener('mousemove', this.satmm.bind(this));
	this.row.insertCell().appendChild(this.satel);
	
	//Hue Input
	this.hueel                   = document.createElement('div');
	this.hueel.className         = 'gra_clr-hue';
	this.hueel.id                = 'gra_clr-hue-'+this.int;
	this.hueel.style.position    = 'relative';
	this.hueel.style.width       = '18px';
	this.hueel.style.height      = '165px';
	this.hueel.style.cursor      = 'pointer';
	this.hueel.innerHTML         = '<svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gh" x1="0%" y1="100%" x2="0%" y2="0%"><stop offset="00.000%" stop-color="#ff0000" stop-opacity="1"></stop><stop offset="16.666%" stop-color="#ff00ff" stop-opacity="1"></stop><stop offset="33.333%" stop-color="#0000ff" stop-opacity="1"></stop><stop offset="50.000%" stop-color="#00ffff" stop-opacity="1"></stop><stop offset="66.666%" stop-color="#00ff00" stop-opacity="1"></stop><stop offset="83.333%" stop-color="#ffff00" stop-opacity="1"></stop><stop offset="100.00%" stop-color="#ff0000" stop-opacity="1"></stop></linearGradient></defs><rect x="0" y="0" width="100%" height="100%" fill="url(#gh)"></rect></svg>'
	this.huesl                   = document.createElement('div');
	this.huesl.className         = 'gra_clr-hue-selector';
	this.huesl.id                = 'gra_clr-hue-selector-'+this.int;
	this.huesl.style.position    = 'absolute';
	this.huesl.style.left        = '100%';
	this.huesl.style.top         = '-4px';
	this.huesl.style.width       = '0px';
	this.huesl.style.height      = '0px';
	this.huesl.style.borderStyle = 'solid';
	this.huesl.style.borderWidth = '5.5px 9.5px 5.5px 0';
	this.huesl.style.borderColor = 'transparent #111 transparent transparent';
	this.hueel.appendChild(this.huesl);
	this.huemd                   = function(e) {
		e.preventDefault();
		this.draggingHue = true;
		var r            = this.hueel.getBoundingClientRect(),
			t            = (e.pageY - r.top);
		if(t > r.height) t = r.height;
		if(t < 0) t = 0;
		var h            = this.hue(t / r.height);
		this.satel.style.background = "rgb("+h.r+","+h.g+","+h.b+")";
		this.huesl.style.top        = t - 4 + "px";
		this.h = parseInt(t,10)/r.height;
		this.update();
	}
	this.huemm                   = function(e) {
		e.preventDefault();
		var r            = this.hueel.getBoundingClientRect(),
			t            = (e.pageY - r.top);
		if(t > r.height) t = r.height;
		if(t < 0) t = 0;
		var h            = this.hue(t / r.height);
		if(this.draggingHue) {
			this.satel.style.background = "rgb("+h.r+","+h.g+","+h.b+")";
			this.huesl.style.top        = t - 4 + "px";
			this.h = parseInt(t,10)/r.height;
			this.update();
		}
	}
	this.hueel.addEventListener('mousedown', this.huemd.bind(this));
	this.hueel.addEventListener('mousemove', this.huemm.bind(this));
	this.row.insertCell().appendChild(this.hueel);
	
	this.undrag          = function(){this.draggingHue = false;this.draggingSat = false;}
	document.addEventListener('mouseup', this.undrag.bind(this));
	
	this.update          = function() {
		var r = this.htr(this.h,this.s,this.v);
		console.log([this.h,this.s,this.v,r]);
		this.color = '#'+this.thx(r[0])+this.thx(r[1])+this.thx(r[2]);
		this.input.value = this.color;
	}
	this.updateSelectors = function(clr) {
		var rgb = this.hxr(clr),
			hsv = this.rth(rgb.r,rgb.g,rgb.b);
		if(typeof hsv[0] == 'number' && !isNaN(hsv[0])) {
			this.h = hsv[0]; this.s = hsv[1]; this.v = hsv[2];
			var r = this.hueel.getBoundingClientRect(),
				t = r.height * hsv[0],
				h = this.hue(hsv[0]);
			this.satel.style.background = "rgb("+h.r+","+h.g+","+h.b+")";
			this.huesl.style.top        = t - 4 + "px";
			var r = this.satel.getBoundingClientRect(),
				l = r.width * hsv[1];
				t = r.height * (1 - hsv[2]);
			this.satsl.style.top  = t - 6 + "px";
			this.satsl.style.left = l - 6 + "px";
			this.update();
		}
	}
	this.updateSelectors(this.color);
}