var Sound = new Phaser.Class({
	initialize:
		function Sound(game) {
			this.game = game;
			this.game.sound.volume = 0.2
			this.sound
	},
	addSound: function(file){
		this.sound = this.game.sound.add(file);
		return this.sound;
	},
	addMarker: function(markers){
		for (var i = 0; i < markers.length; i++) {
			var marker = markers[i];
			this.sound.addMarker(marker);
		}	
	},
	play: function () {
		this.sound.play()
	},
	playMarker: function (marker) {
		this.sound.play(marker)
	},
	pause: function () {
		this.sound.pause()
	},
})