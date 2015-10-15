//Graphene Audio Player
//Written By Savoron September 30, 2014
//
//
//	Options:
//		
//		

var gra_aud = function(element, audio, options) {
	if(typeof window.gra_aud_int =='undefined') this.int = window.gra_aud_int = 0, window.gra_crop_this = [];
	else this.int = ++window.gra_aud_int;
	if(typeof aud !== 'string') return false;
	
	this.ops 	= (typeof options == "object")?options:{};
	this.elem 	= element;
	
	this.init = function() {
		this.sound 						= document.createElement('audio');
		sound.src 						= audio;
	
		this.elem.className 			= 'audio-player';
		this.elem.style.position 		= 'relative';
		this.elem.style.marginLeft 		= '-15px';
		this.elem.style.marginBottom 	= '10px';
		this.elem.style.background 		= '#94D2FF';
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
		this.tail.style.borderColor 	= 'transparent #6E9EBF transparent transparent';
		this.elem.appendChild(this.tail);
		
		this.pprb 						= document.createElement('div');
		this.pprb.className 			= 'ppr-button';
		this.pprb.style.position 		= 'relative';
		this.pprb.style.display  		= 'inline-block';
		this.pprb.style.width 			= '19px';
		this.pprb.style.height 			= '19px';
		this.pprb.style.marginRight 	= '10px'; 
		this.pprb.style.textAlign 		= 'center'
		this.pprb.innerHTML 			= '&#9654;';
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
		this.barcur.style.left 			= '50%';
		this.barcur.style.border 		= '1px #fff solid';
		this.barcur.style.background 	= '#93D2FF';
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
	};
	this.init();
}