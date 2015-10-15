/*	
 *	Graphene Audio Player
 *	Written By Savoron and Trewbot
 *	Oct 05, 2014
 *
 *	Options:				Type:				Description:
 *		color					string				defines the accent color
 *		
 *	Control:				Action:
 *		Left Arrow				Rewind 4s
 *		Right Arrow				Forward 4s
 *		Up Arrow				Volume up 10%
 *		Down Arrow				Volume down 10%
 *		Home					Rewind to beginning
 *		End						Forward to end
 *		Enter					Same as play/pause button
 *		Space					Same as play/pause button
 *
 *	Version:				Date:				Description:
 *		a0.0.0.0001				Sep 30, 2014		Created new JS based audio player.
 *		a0.0.0.0002				Sep 30, 2014		Added styling.
 *		a0.0.0.0003				Sep 30, 2014		Set up core JavaScript.
 *		a0.0.0.0004				Sep 30, 2014		Added play, pause, and replay.
 *		a0.0.0.0005				Sep 30, 2014		Added close function to fix multipage playing.
 *		a0.0.0.0006				Oct 01, 2014		-
 *		a0.0.0.0007				Oct 02, 2014		-
 *		a0.0.0.0007.5			Oct 03, 2014		Added dragging time bar
 *													Added pause while dragging
 *													Added keyboard controls to time
 *													Added volume control
 *													Added keyboard controls to volume
 *		a0.0.0.0008				Oct 05, 2014		-
 *		a0.0.0.0008.5			Oct 07, 2014		-
 *
 */
 
Number.prototype.toTime = function() {
	var n,m;
	return ((n = Math.floor(this/60)).toString().length<2?'0':'')+n+":"+((m = Math.floor(this%60)).toString().length<2?'0':'')+m;
}
var gra_aud = function(element, audio, options) {
	
	//Major variables
	
		if(typeof window.gra_aud_int =='undefined') this.int = window.gra_aud_int = 0, window.gra_crop_this = [];
		else this.int = ++window.gra_aud_int;
		if(typeof audio !== 'string') return false;
		this.ops 	= options || {};
		this.elem 	= element;
		this.li     = 0;
		
	//Event variables
	
		this.d_time = false;			//Dragging Time Bar
		this.d_volume = false;			//Dragging Volume Bar
		this.d_paused = false;			//Dragging was paused
		this.to_vol = false;
		this.vol_to = 0;
	
	this.curtim = function() {			//Renders elements per time
		this.audtim.innerHTML = this.sound.currentTime.toTime();
		this.barcur.style.left = (this.sound.currentTime/this.sound.duration)*100 + "%";
		this.volmcur.style.left = this.sound.volume*100 + "%";
		if(this.sound.ended) {
			this.pprb.innerHTML='<svg viewBox="0 0 16 16"><path fill="#FFFFFF" d="M12.5,8.9c0,2.5-2,4.5-4.5,4.5s-4.5-2-4.5-4.5s2-4.5,4.5-4.5v1.8l5.4-3.1L8,0v1.7c-3.9,0-7.1,3.2-7.1,7.1 S4.1,16,8,16s7.1-3.2,7.1-7.1H12.5z"/></svg>';
			window.clearInterval(this.li);
		}
	}
	this.pprSound = function(doIcon) {	//Play/Pause
		this.audtot.innerHTML = this.sound.duration.toTime();
		this.sound[this.sound.paused?'play':'pause']();
		if(typeof doIcon === 'undefined' || doIcon)this.sound.paused?(this.pprb.innerHTML='<svg viewBox="0 0 16 16"><polygon fill="#FFFFFF" points="0,0 16,8 0,16 "/></svg>'):(this.pprb.innerHTML='<svg viewBox="0 0 16 16"><rect x="0" y="0" fill="#FFFFFF" width="6.8" height="16"/><rect x="9.2" fill="#FFFFFF" width="6.8" height="16"/></svg>');
		this.sound.paused?window.clearInterval(this.li):this.li=window.setInterval(this.curtim.bind(this),200);
	}
	this.close = function() {			//Closes the player
		this.sound.src = '';
		window.clearInterval(this.li);
	}
	this.md_seek = function(e) {		//Mousedown > seeking
		this.d_time = true;
		if(!this.sound.paused){this.pprSound(false);this.d_paused=true;}
		var _r = this.bar.getBoundingClientRect(),
			_x = Math.min(Math.max((e.pageX-_r.left)/(_r.width),0),1);
		this.barcur.style.left = _x*100+'%';
		this.sound.currentTime = _x*this.sound.duration;
		document.documentElement.style.cursor = "pointer";
	}
	this.md_volm = function(e) {		//Mousedown > volume
		this.d_volume = true;
		var _r = this.volmbar.getBoundingClientRect(),
			_x = Math.min(Math.max((e.pageX-_r.left)/(_r.width),0),1);
		this.volmcur.style.left = _x*100+'%';
		this.sound.volume = _x;
		document.documentElement.style.cursor = "pointer";
		this.volm_icon();
	}
	this.mm = function(e) {				//Mousemove > general
		if(this.d_time){
			var _r = this.bar.getBoundingClientRect(),
				_x = Math.min(Math.max((e.pageX-_r.left)/(_r.width),0),1);
			this.barcur.style.left = _x*100+'%';
			this.sound.currentTime = _x*this.sound.duration;
		} else if(this.d_volume) {
			var _r = this.volmbar.getBoundingClientRect(),
				_x = Math.min(Math.max((e.pageX-_r.left)/(_r.width),0),1);
			this.volmcur.style.left = _x*100+'%';
			this.sound.volume = _x;
			document.documentElement.style.cursor = "pointer";
		}
		this.volm_icon();
	}
	this.mu = function(e) {				//Mouseup   > general
		if(this.d_time && this.d_paused) this.pprSound(false);
		document.documentElement.style.cursor = "";
		this.d_time = false;
		this.d_volume = false;
		this.d_paused = false;
		this.vol_mt();
	}
	this.vo = false;
	this.vol_mt = function(e) {			//Mouseout of volume
		if(this.d_volume) return;
		var _r = this.vol.getBoundingClientRect(),
			_t,
			_y = e.pageY - ((t = document.documentElement.scrollTop)?t:scrollY),
			_x = e.pageX - ((t = document.documentElement.scrollLeft)?t:scrollX);
		if(_x > _r.left && _x < _r.right && _y > _r.top && _y < _r.bottom) {
			if(this.vo) return;
			this.vo = true;
			this.volmbox.style.width = '117px';
			this.mainbar.style.width = 'calc(100% - 162px)';
			this.to_vol = true;
			this.vol_to = window.setTimeout(function(){this.volmbox.style.overflow = '';this.to_vol = false;}.bind(this),300);
		}else{
			this.vo = false;
			if(this.to_vol) {window.clearTimeout(this.vol_to); this.to_vol = false;}
			this.volmbox.style.overflow = 'hidden';
			this.volmbox.style.width = '0';
			this.mainbar.style.width = 'calc(100% - 45px)';
		}
	}
	this.jump = function(e) {			//Keyboard Controls
		if([13,32,35,36,37,38,39,40].indexOf(e.keyCode)>0) { e.preventDefault(); }
		if(e.keyCode==32 || e.keyCode==13) this.pprSound();
		else if(e.keyCode==39) this.sound.currentTime += 4;
		else if(e.keyCode==37) this.sound.currentTime -= 4;
		else if(e.keyCode==36) this.sound.currentTime = 0;
		else if(e.keyCode==35) this.sound.currentTime = this.sound.duration;
		else if(e.keyCode==38) this.sound.volume = Math.min(this.sound.volume + 0.1,1);
		else if(e.keyCode==40) this.sound.volume = Math.max(this.sound.volume - 0.1,0);
		else return;
		e.stopPropogation();
		this.curtim();
	}
	this.volm_mute = function() {		//Mute volume
		this.sound.muted=!this.sound.muted; 
		this.volm_icon();
	}
	this.volm_icon = function() {		//Set icons for volume
		if(this.sound.muted ||  this.volmcur.style.left == '0%') {
			this.volm.innerHTML = '<svg viewBox="0 0 16 16"><polygon fill="#FFFFFF" points="0,4.6 0,11.4 3.7,11.4 8.6,16 8.6,0 3.7,4.6 "/></svg>';
		}else {
			this.volm.innerHTML = '<svg viewBox="0 0 16 16"><path fill="#FFFFFF" d="M13.5,2.5l-1.1,1.7C13.3,5,13.9,6.4,13.9,8c0,1.5-0.6,2.9-1.4,3.7l1.1,1.8C15,12.3,16,10.3,16,8 C16,5.7,15,3.7,13.5,2.5z"/><polygon fill="#FFFFFF" points="0,4.6 0,11.4 3.7,11.4 8.6,16 8.6,0 3.7,4.6 "/></svg>';
		}
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
		this.elem.style.MozUserSelect	= "none";
		this.elem.style.webkitUserSelect= "none";
		this.elem.style.outline			= "none";
		this.elem.tabIndex				= -1
		
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
		this.pprb.style.marginTop	 	= '2px'; 
		this.pprb.style.textAlign 		= 'center';
		this.pprb.style.cursor 			= 'pointer';
		this.pprb.innerHTML 			= '<svg viewBox="0 0 16 16"><polygon fill="#FFFFFF" points="0,0 16,8 0,16 "/></svg>';
		this.pprb.onclick 				= this.pprSound.bind(this);
		this.elem.appendChild(this.pprb);
		this.vol 						= document.createElement('div');
		this.vol.className 				= 'vol-cotainer';
		this.vol.style.position 		= 'relative';
		this.vol.style.display  		= 'inline-block';
		this.elem.appendChild(this.vol);
		
		this.volm 						= document.createElement('div');
		this.volm.className 			= 'vol-button';
		this.volm.style.position 		= 'relative';
		this.volm.style.display  		= 'inline-block';
		this.volm.style.width 			= '10px';
		this.volm.style.height 			= '10px';
		this.volm.style.marginRight 	= '10px'; 
		this.volm.style.textAlign 		= 'center';
		this.volm.style.cursor 			= 'pointer';
		this.volm.onclick				= this.volm_mute.bind(this);
		this.volm.innerHTML 			= '<svg viewBox="0 0 16 16"><path fill="#FFFFFF" d="M13.5,2.5l-1.1,1.7C13.3,5,13.9,6.4,13.9,8c0,1.5-0.6,2.9-1.4,3.7l1.1,1.8C15,12.3,16,10.3,16,8 C16,5.7,15,3.7,13.5,2.5z"/><polygon fill="#FFFFFF" points="0,4.6 0,11.4 3.7,11.4 8.6,16 8.6,0 3.7,4.6 "/></svg>';
		this.vol.appendChild(this.volm);
		
		this.volmbox					= document.createElement('div');
		this.volmbox.style.position 	= 'relative';
		this.volmbox.style.display 		= 'inline-block';
		this.volmbox.style.width 		= '0';
		this.volmbox.style.height 		= '8px';
		this.volmbox.style.overflow 	= 'hidden';
		this.volmbox.style.transition	= 'width 0.5s';
		this.volmbox.style.webkitTransition	= 'width 0.5s';
		this.vol.appendChild(this.volmbox);
		
		this.volmbar 					= document.createElement('div');
		this.volmbar.className 			= 'volume-bar';
		this.volmbar.style.position 	= 'relative';
		this.volmbar.style.cursor 		= 'pointer';
		this.volmbar.style.height 		= '8px';
		this.volmbar.style.width 		= '100px';
		this.volmbar.style.marginRight 	= '10px';
		this.volmbar.style.background	= '#fff';
		this.volmbox.appendChild(this.volmbar);
		
		this.volmcur 					= document.createElement('div');
		this.volmcur.className 			= 'volume-bar-current';
		this.volmcur.style.position 	= 'absolute';
		this.volmcur.style.width 		= '5px';
		this.volmcur.style.height 		= '10px';
		this.volmcur.style.top 			= '-2px';
		this.volmcur.style.left 		= '100%';
		this.volmcur.style.border 		= '1px #fff solid';
		this.volmcur.style.background 	= (typeof this.ops.color=='string')?this.ops.color:'#94D2FF';
		this.volmcur.style.cursor 		= 'pointer';
		this.volmbar.appendChild(this.volmcur);
		
		this.mainbar					= document.createElement('div');
		this.mainbar.style.position 	= 'relative';
		this.mainbar.style.display 		= 'inline-block';
		this.mainbar.style.width 		= 'calc(100% - 45px)';
		this.mainbar.style.transition	= 'width 0.5s';
		this.mainbar.style.webkitTransition	= 'width 0.5s';
		this.elem.appendChild(this.mainbar);
		
		this.audtim 					= document.createElement('div');
		this.audtim.className 			= 'audio-current';
		this.audtim.style.position 		= 'relative';
		this.audtim.style.display 		= 'inline-block';
		this.audtim.style.width 		= '32px';
		this.audtim.style.height 		= '19px';
		this.audtim.style.marginRight 	= '10px';
		this.audtim.innerHTML 			= '00:00';
		this.mainbar.appendChild(this.audtim);
		
		this.bar 						= document.createElement('div');
		this.bar.className 				= 'audio-bar';
		this.bar.style.position 		= 'relative';
		this.bar.style.display 			= 'inline-block';
		this.bar.style.cursor 			= 'pointer';
		this.bar.style.height 			= '8px';
		this.bar.style.width 			= 'calc(100% - 84px)';
		this.bar.style.marginRight 		= '10px';
		this.bar.style.background		= '#fff';
		this.mainbar.appendChild(this.bar);
		
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
		this.audtot.innerHTML 			= '00:00';
		this.mainbar.appendChild(this.audtot);
		
		this.bar.addEventListener('mousedown', this.md_seek.bind(this));
		this.volmbar.addEventListener('mousedown', this.md_volm.bind(this));
		document.addEventListener('mousemove', this.mm.bind(this));
		document.addEventListener('mousemove', this.vol_mt.bind(this));
		document.addEventListener('mouseup', this.mu.bind(this));
		this.elem.addEventListener('keyup', this.jump.bind(this));
		
		window.setTimeout(function(){this.pprSound();this.pprSound();}.bind(this),100);
	};
	this.init();
}