/*
 *	Graphene Context Menu
 *	Written by Trewbot and Savoron
 *	Dec 26, 2014
 *
 *	Version:				Date:				Description:
 *		v0.1.0.0001				Mar 23, 2015		Moved popup script to separate file.
 *		v0.1.0.0002				Mar 23, 2015		Added lightbox framework.
 *		v0.1.0.0003				Mar 23, 2015		Added lightbox base url.
 *		v0.1.0.0004				Mar 23, 2015		Added lightbox default back URL.
 *		v0.1.0.0005				Mar 23, 2015		Added AJAX to Graphene.
 *		v0.1.0.0006				Mar 23, 2015		Added lightbox parameters.
 *		v0.1.0.0007				Mar 23, 2015		Added lightbox AJAX calling to get lists.
 *		v0.1.0.0008				Mar 24, 2015		Added lightbox layout parsing.
 *		v0.1.0.0009				Mar 24, 2015		Added lightbox opening script.
 *		v0.1.0.0010				Mar 24, 2015		Fixed API calls having credentials set to true.
 *													Added lightbox navigation.
 *													Fixed _g.pu.lbIndx being below 0.
 *													Fixed lightbox navigation direction.
 */

function _i(i){return document.getElementById(i);}
function _c(c){return document.getElementsByClassName(c);}
Element.prototype._c = function(c){return this.getElementsByClassName(c);}
 
if(typeof Graphene !== 'object'){
	var Graphene = new(function(){
		this.pop = true;
		this.v = '';
		this.url = 'http://gra.phene.co';
		this.ajax = function(url, type, header, ops){
			var r = new XMLHttpRequest(),
			o = ops || {};
			r.open(type, url, true);
			r.withCredentials = typeof o.cred == 'boolean' ? o.cred : true;
			r.setRequestHeader("Content-type", typeof o.type == 'string' ? o.type : "application/x-www-form-urlencoded");
			r.send(header);
			if(typeof o.load == 'function')
				r.addEventListener('load', function(){
					o.load(r);
				});
			if(typeof o.change == 'function')
				r.onreadystatechange = o.change;
			return r;
		};
	})(),
		_g = Graphene;
}

_g.pu = (_g.popup = {
	lbOpen		: false,
	lbBase		: document.URL.split('://')[0] + '://' + document.domain,
	lbBack		: document.URL,
	lbSrc		: '',
	lbLayt		: '',
	lbInfo		: {},
	lbList		: [],
	lbIndx		: 0,
	open		: function(ops){
		var fhtm = '<div id="popup-shade"><div style="' + (typeof ops.width == 'string' ? 'width:' + (parseInt(ops.width) + 20) + 'px;' : '') + '" id="popup">' + (typeof ops.title == 'string' ? '<div id="popup-title" style="' + (typeof ops.titleColor == 'string' ? 'background:' + ops.titleColor + ';' : '') + (typeof ops.titleTextColor == 'string' ? 'color:' + ops.titleTextColor + ';' : '') + (typeof ops.width == 'string' ? 'width:' + (parseInt(ops.width) + 8) + 'px;' : '') + '">' + ops.title + '</div>' : '') + '<div id="popup-content" style="' + (typeof ops.textCenter == 'boolean' && ops.textCenter ? 'text-align:center' : '') + '">' + ops.text + (typeof ops.confirm == 'boolean' && ops.confirm ? '<div id="popup-confirm"><div id="popup-yes" class="popup-option" onclick="' + ops.onyes + 'gra_pu_close();">Yes</div><div id="popup-no" class="popup-option" onclick="gra_pu_close();">No</div></div>' : '') + '</div></div></div>';
		document.body.insertAdjacentHTML('afterbegin', fhtm);
		window.setTimeout(function(){
			window.addEventListener('click', function grapopClick(e){
				if(_i('popup') == null){
					window.removeEventListener('click', grapopClick);
					return;
				}
				var rect = _i('popup').getBoundingClientRect();
				if(e.clientY > rect.bottom || e.clientY < rect.top || e.pageX > rect.right || e.pageX < rect.left){
					_i('popup-shade').remove();
					window.removeEventListener('click', grapopClick);
				}
			});
		}, 0);
	},
	lightbox	: function(type,source,layout,index){
		_g.pu.lbBack = document.URL;
		_g.pu.lbIndx = index;
		_g.pu.lbSrc  = source;
		_g.pu.lbLayt = layout;
		var open = function(){
			layout = layout.split('.');
			for(var i = 0, click = !1, list = _g.pu.lbInfo[source]; i < layout.length; i++){
				if(!click && layout[i] !== '*') list = list[layout[i]];
				else {
					click = !0;
					if(layout[i] == '*'){if(list.length == null) list = Object.keys(list).map(function(k){return list[k]});}
					else for(var j = 0; j < list.length; j++) list[j] = list[j][layout[i]];
				}
			}
			_g.pu.lbList = list;
			if(_g.pu.lbIndx < 0) _g.pu.lbIndx = 0;
			if(_g.pu.lbIndx >= list.length) _g.pu.lbIndx = list.length;
			var img = new Image();
			img.src = _g.pu.lbList[_g.pu.lbIndx];
			img.onload = function(){
				var wh = window.innerHeight,
					ww = window.innerWidth,
					ih = img.height,
					iw = img.width,
					lbw,
					lbh,
					j,
					lbe = _i('lightbox'),
					lbv = _i('lightbox-view');
				
				if(iw > (j = Math.max(500, ww - 100))) lbw = j, lbh = (j / iw) * ih;
				else lbw = iw, lbh = ih;
				
				if(lbh > (j = wh - 100)) lbw = (j / ih) * iw, lbh = j;

				var olbi = _i('lightbox-image');
				if(olbi !== null) olbi.remove();

				if(lbv.style.width == '' || parseInt(lbv.style.width) < lbw) lbv.style.width = lbw + "px";
				if(lbv.style.height == '' || parseInt(lbv.style.height) < lbh) lbv.style.height = lbh + "px";
				_i('lightbox-prev').style.width = parseInt(lbv.style.width) - 150 + "px";
				_i('lightbox-prev').parentAnchor().href = "javascript:_g.pu.lightbox('api',_g.pu.lbSrc,_g.pu.lbLayt,++_g.pu.lbIndx);void(0);";
				_i('lightbox-next').parentAnchor().href = "javascript:_g.pu.lightbox('api',_g.pu.lbSrc,_g.pu.lbLayt,--_g.pu.lbIndx);void(0);";
				
				var lbm = document.createElement('img');
				lbm.src = img.src;
				lbm.id = 'lightbox-image';
				lbm.style.width = lbw + 'px';
				lbm.style.height = lbh + 'px';
				lbv.insertBefore(lbm, lbv.children[0]);
			}
		};
		
		if(!_g.pu.lbOpen){
			var lb = document.createElement('div');
			lb.id = 'lightbox-shade';
			lb.innerHTML = '<div id="lightbox"><table><tr><td style="font-size:0px;"><div id="lightbox-view"><a lightbox><div id="lightbox-next"></div></a><a lightbox><div id="lightbox-prev"></div></a></div></td>' + /* '<td style="vertical-align:top;"><div id="lightbox-comments"><div class="post-header"><a><img class="post-avatar"></a><div class="post-name"><a><b>Loading...</b></a></div><div class="post-time"><a>Loading...</a></div></div><div class="post-content"><br><br><br><br><br><br></div></div></td>' + */ '</tr></table></div>';
			body.insertBefore(lb, body.children[0]);
			window.setTimeout(function(){
				window.addEventListener('click', _g.pu.lbClick);
			}, 500);
			_g.pu.lbOpen = true;
		} else var lb = _i('lightbox-shade');
		
		if(type == 'api'){
			if(typeof _g.pu.lbInfo[source] == 'undefined') new ajax(source, 'GET', '', {cred:false,load:function(res){
				_g.pu.lbInfo[source] = JSON.parse(res.response);
				open();
			}}); else open();
		}
	}
})