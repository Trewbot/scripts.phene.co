/*	
 *	Graphene Audio Player
 *	Original By Savoron and Trewbot
 *	Rewritten by Trewbot
 *	Jun 20, 2015
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
 *		a0.0.0.0008.5			Feb 05, 2015		Refactored
 *		v0.1.0.0009				Jun 20, 2015		Wrote Number.format() and Number.toTime()
 *		v0.1.0.0010				Jun 20, 2015		Wrote Element.set()
 *		v0.1.0.0011				Jun 20, 2015		Added Graphene object
 *		v0.1.0.0012				Jun 20, 2015		Added _g.player
 */

	Number.prototype.format = function(l){
		var n = this,
			c = l - (""+n).length;
		for(var i = 0; i < c; i++) n = "0" + n;
		return n;
	}
	Number.prototype.toTime = function(){
		var n = ~~(this/60),
			m = ~~(this%60);
		return n.format(2)+":"+m.format(2);
	}
	Element.prototype.set = function(a) {
		for(i in a)
			if(~['styles','style'].indexOf(i) && typeof a[i] === 'object')
				for(var p in a[i])
					this.style[p] = a[i][p];
			else i === 'html'
				? this.innerHTML = a[i]
				: this.setAttribute(i, a[i]);
		return this;
	};
	
	if(typeof Graphene !== 'object') {
		var Graphene = new(function () {
			this.url = 'http://gra.phene.co';
		})(),
			_g = Graphene;
	}
	
	_g.pl = (_g.player = {
		ids		: 0,
		video	: function(src, o){
		},
		audio	: function(src, o){
			
		}
	})