//start screen
var splashscene = new Phaser.Class({
	Extends: Phaser.Scene,
	initialize:
		function splashScene() {
			Phaser.Scene.call(this, { key: 'splashscene', active: true });
		},
	preload: function () {
		this.load.image('logo', 'assets/images/logo.png');
		//this.load.audio('voiceover', 'assets/sounds/voiceover.mp3');
		this.load.spritesheet('splashbg', 'assets/stages/haoh.png', { frameWidth: 800, frameHeight: 600 });
		this.load.image('leaf', 'assets/particles/leaf.png');
	},
	create: function () {
		var background = this.add.sprite(400, 300, 'splashbg').setScale(1.0);
		this.anims.create({ key: 'bg_anim', frames: this.anims.generateFrameNumbers('splashbg', { start: 0, end: 19 }), frameRate: 10, repeat: -1 });
		this.add.image(400, 250, 'logo');
		background.anims.play('bg_anim',true);
		this.load.spritesheet('leaf', 'assets/particles/leaf.png', { frameWidth: 22, frameHeight: 14 });
		this.add.particles('leaf').createEmitter({
			x: 600, y: 200,
			rotate: { min: 90, max: 360 },
			speed: { min: -200, max: 700 },
			angle: { min: 0, max: 180 },
			scale: { min: 0.01, max: 0.01 },
			alpha: { min: 1, max: 4 },
			frequency: 2000, lifespan: 4000,
			quantity: 50, tint: 0xffffff
		});
		this.add.text(400, 400, 'PRESS ANY BUTTON TO START', { fontFamily: 'Arial', fontSize: 25, color: '#fff' }).setOrigin(0.5).setStroke('#000000', 5)
		this.input.keyboard.on('keydown', function (event) {
			this.scene.transition({ target: 'loadscene', duration: 500 });
        }, this);
	}
});