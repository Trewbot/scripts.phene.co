//Graphene Audio Player
//Written By Savoron AND TREWBOT XD Oct 1, 2014
//
//
//	Option:			Default:		Purpose:
//		color			string			defines the accent color
//		
//		
Number.prototype.toTime = function() {
	var n,m;
	return ((n = Math.floor(this/60)).toString().length<2?'0':'')+n+":"+((m = Math.floor(this%60)).toString().length<2?'0':'')+m;
}
var gra_aud = function(element, audio, options) {
	
	//Major variables
	
		if(typeof window.gra_aud_int =='undefined') this.int = window.gra_aud_int = 0, window.gra_crop_this = [];
		else this.int = ++window.gra_aud_int;
		if(typeof audio !== 'string') return false;
		this.ops 	= (typeof options == "object")?options:{};
		this.elem 	= element;
		this.li     = 0;
		
	//Event variables
	
		this.d_time = false;			//Dragging Time Bar
		this.d_volume = false;			//Dragging Volume Bar
	
	this.curtim = function() {			//Renders elements per time
		this.audtim.innerHTML = this.sound.currentTime.toTime();
		this.barcur.style.left = (this.sound.currentTime/this.sound.duration)*100 + "%";
		if(this.sound.ended) {
			this.pprb.innerHTML='<svg viewBox="0 0 16 16"><path fill="#FFFFFF" d="M12.5,8.9c0,2.5-2,4.5-4.5,4.5s-4.5-2-4.5-4.5s2-4.5,4.5-4.5v1.8l5.4-3.1L8,0v1.7c-3.9,0-7.1,3.2-7.1,7.1 S4.1,16,8,16s7.1-3.2,7.1-7.1H12.5z"/></svg>';
			window.clearInterval(this.li);
		}
	}
	this.pprSound = function() {		//Play/Pause
		this.audtot.innerHTML = this.sound.duration.toTime();
		this.sound[this.sound.paused?'play':'pause']();
		this.sound.paused?(this.pprb.innerHTML='<svg viewBox="0 0 16 16"><polygon fill="#FFFFFF" points="0,0 16,8 0,16 "/></svg>'):(this.pprb.innerHTML='<svg viewBox="0 0 16 16"><rect x="0" y="0" fill="#FFFFFF" width="6.8" height="16"/><rect x="9.2" fill="#FFFFFF" width="6.8" height="16"/></svg>');
		this.sound.paused?window.clearInterval(this.li):this.li=window.setInterval(this.curtim.bind(this),200);
	}
	this.close = function() {			//Closes the player
		this.sound.src = '';
		window.clearInterval(this.li);
	}
	this.md_seek = function(e) {		//Mousedown > seeking
		this.d_time = true;
		var xS = this.bar.getBoundingClientRect().left;
		var xE = this.bar.getBoundingClientRect().right;
		var _x = Math.floor((e.x-xS)/(xE-xS)*100);
		this.barcur.style.left = _x+'%';
		this.sound.currentTime = (_x/100)*this.sound.duration;
	}
	this.mm = function(e) {				//Mousemove > general
		if(this.d_time){
			var xS = this.bar.getBoundingClientRect().left;
			var xE = this.bar.getBoundingClientRect().right;
			var _x = Math.floor((e.x-xS)/(xE-xS)*100);
			this.barcur.style.left = _x+'%';
			if(_x < 0){_x=0; this.barcur.style.left = _x+'%';}
			if(_x > 100){_x=100; this.barcur.style.left = _x+'%';}
			this.sound.currentTime = (_x/100)*this.sound.duration;
		}
	}
	this.mu = function(e) {				//Mouseup   > general
		this.d_time = false;
		this.d_volume = false;
	}
	
	this.init = function() {			//Initialize
		this.sound 						= document.createElement('audio');
		this.sound.src 					= audio;
		this.sound.load();
	
		this.elem.className 			= 'audio-player';
		this.elem.style.position 		= 'relative';
		this.elem.style.marginLeft 		= '-15px';
		this.elem.style.marginBottom 	= '10px';
		this.elem.style.background 		= (typeof this.ops.color=='string')?this.ops.color:'#94D2FF';
		this.elem.style.padding 		= '2px 6px';
		this.elem.style.color 			= '#fff';
		this.elem.style.boxShadow 		= 'rgba(50, 50, 50, 0.1) 2px 2px 3px';
		this.elem.style.width 			= '503px';
		
		this.tail 						= document.createElement('div');
		this.tail.className 			= 'ribbon-tail';
		this.tail.style.position 		= 'absolute';
		this.tail.style.top 			= '100%';
		this.tail.style.left 			= '0';
		this.tail.style.width 			= '0';
		this.tail.style.height 			= '0';
		this.tail.style.borderStyle 	= 'solid';
		this.tail.style.borderWidth 	= '0 5px 5px 0';
		this.tail.style.borderColor 	= 'transparent '+((typeof this.ops.color=='string')?this.ops.color:'#94D2FF')+' transparent transparent';
		this.elem.appendChild(this.tail);
		
		this.pprb 						= document.createElement('div');
		this.pprb.className 			= 'ppr-button';
		this.pprb.style.position 		= 'relative';
		this.pprb.style.display  		= 'inline-block';
		this.pprb.style.width 			= '10px';
		this.pprb.style.height 			= '10px';
		this.pprb.style.marginRight 	= '10px'; 
		this.pprb.style.textAlign 		= 'center';
		this.pprb.style.cursor 			= 'pointer';
		this.pprb.innerHTML 			= '<svg viewBox="0 0 16 16"><polygon fill="#FFFFFF" points="0,0 16,8 0,16 "/></svg>';
		this.pprb.onclick 				= this.pprSound.bind(this);
		this.elem.appendChild(this.pprb);
		
		this.audtim 					= document.createElement('div');
		this.audtim.className 			= 'audio-current';
		this.audtim.style.position 		= 'relative';
		this.audtim.style.display 		= 'inline-block';
		this.audtim.style.width 		= '32px';
		this.audtim.style.height 		= '19px';
		this.audtim.style.marginRight 	= '10px';
		this.audtim.innerHTML 			= '00:00';
		this.elem.appendChild(this.audtim);
		
		this.bar 						= document.createElement('div');
		this.bar.className 				= 'audio-bar';
		this.bar.style.position 		= 'relative';
		this.bar.style.display 			= 'inline-block';
		this.bar.style.height 			= '8px';
		this.bar.style.width 			= '380px';
		this.bar.style.marginRight 		= '10px';
		this.bar.style.background		= '#fff';
		this.elem.appendChild(this.bar);
		
		this.barcur 					= document.createElement('div');
		this.barcur.className 			= 'audio-bar-current';
		this.barcur.style.position 		= 'absolute';
		this.barcur.style.width 		= '5px';
		this.barcur.style.height 		= '10px';
		this.barcur.style.top 			= '-2px';
		this.barcur.style.left 			= '0%';
		this.barcur.style.border 		= '1px #fff solid';
		this.barcur.style.background 	= (typeof this.ops.color=='string')?this.ops.color:'#94D2FF';
		this.barcur.style.cursor 		= 'pointer';
		this.bar.appendChild(this.barcur);
		
		this.audtot 					= document.createElement('div');
		this.audtot.className 			= 'audio-total';
		this.audtot.style.position 		= 'relative';
		this.audtot.style.display 		= 'inline-block';
		this.audtot.style.width 		= '32px';
		this.audtot.style.height 		= '19px';
		this.audtot.style.marginRight 	= '10px';
		this.audtot.innerHTML 			= '00:00';
		this.elem.appendChild(this.audtot);
		
		this.volm 						= document.createElement('div');
		this.elem.appendChild(this.volm);
		
		this.bar.addEventListener('mousedown', this.md_seek.bind(this));
		document.addEventListener('mousemove', this.mm.bind(this));
		document.addEventListener('mouseup', this.mu.bind(this));
	};
	this.init();
}