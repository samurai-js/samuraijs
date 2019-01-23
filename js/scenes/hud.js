
//Hud, match
var hudscene = new Phaser.Class({
	Extends: Phaser.Scene,
	initialize:
		function hudScene() {
			Phaser.Scene.call(this, { key: 'hudscene', active: false });
		},
	preload: function () {
		var mainscene = this.scene.get('mainscene');
		players = mainscene.getPlayers();
		this.load.script('bar_js', 'js/models/StatusBar.js');
		this.load.script('match_js', 'js/controller/Match.js');
		this.load.audio('background', 'assets/sounds/background.mp3');
		this.load.audio('voiceover', 'assets/sounds/voiceover.mp3');
	},
	create: function () {
		match = new Match(this);
		match.createHud();
		sound = new Sound(game);
		bg_music = sound.addSound('background')
		bg_music.volume = 0.3
		bg_music.play()
	},
	update: function () {
		match.startRound();
	}
});