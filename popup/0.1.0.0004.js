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
 */

if(typeof Graphene !== 'object'){
	var Graphene = new(function(){
		this.pop = true;
		this.v = '';
		this.url = 'http://gra.phene.co';
	})(),
		_g = Graphene;
}

_g.pu = (_g.popup = {
	lbOpen		: false,
	lbBase		: document.URL.split('://')[0] + '://' + document.domain,
	lbBack		: document.URL,
	lbInfo		: {},
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
	lightbox	: function(){
	}
})