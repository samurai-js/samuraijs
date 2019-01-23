var Stage = new Phaser.Class({
    initialize:
    function Stage(scene) {
        this.scene = scene;
		this.anims = this.scene.anims;
	},
	createBackground: function(){
		this.background = this.scene.add.sprite(400, 300, 'background').setScale(1.0);
		this.anims.create({ key: 'stage_anim', frames: this.anims.generateFrameNumbers('background', { start: 0, end: 19 }), frameRate: 10, repeat: -1 });
		return this.background
	},
	createGround: function(){
		this.ground = this.scene.physics.add.staticGroup().create(400, 600, 'ground').setScale().refreshBody();
		return this.ground
	},
	animate: function(){
		this.background.anims.play('stage_anim',true);
	},
	addSparks: function(color) {
		this.spark = this.scene.add.particles(color + '_spark').createEmitter({
			speed: { min: 400, max: 800 },
			angle: { min: 45, max: 360 },
			scale: { start: -0.1, end: 0.2 },
			lifespan: 600, gravityY: 800
		});
		this.spark.stop();
		return this.spark;
	},
	addParticles: function(particle, color) {
		this.emitter = this.scene.add.particles(particle).createEmitter({
			x: 600, y: 200,
			rotate: { min: 90, max: 360 },
			speed: { min: -200, max: 700 },
			angle: { min: 0, max: 180 },
			scale: { min: 0.01, max: 0.01 },
			alpha: { min: 1, max: 4 },
			frequency: 2000, lifespan: 4000,
			quantity: 50, tint: color
		});
	},
	addRain: function() {
		var rectangle = new Phaser.Geom.Rectangle(-100, 0, 800, 200)
		this.rain = this.scene.add.particles('rain').createEmitter({
			x: 0, y: -300,
			rotate: { min: -90, max: -240 },
			speedX: { min: 200, max: 400 },
			speedY: { min: 600, max: 900 },
			angle: { min: 90, max: 360 },
			scale: { min: 0.1, max: 0.2 },
			quantity: 2,
			tint: 0xffffff, emitZone: { source: rectangle }
		});
	}
})