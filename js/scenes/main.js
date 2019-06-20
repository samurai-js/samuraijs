//Main scene
var mainscene = new Phaser.Class({
	Extends: Phaser.Scene,
	initialize:
		function mainScene() {
			Phaser.Scene.call(this, { key: 'mainscene', active: false });
		},
	players: [],
	preload: function () {
		loadscene = this.scene.get('loadscene');
		this.chars = loadscene.chars
		for (var c = 0; c < this.chars.length; c++) {//load sprites and audio
			var char = this.chars[c];
			for (var i = 0; i < char.frames.length; i++) {
				var frame = char.frames[i];
				this.load.spritesheet(char.id + "_" + frame.name, 'assets/char/'+ char.name+'/' + frame.name + '.png', { frameWidth: frame.data.frameWidth, frameHeight: frame.data.frameHeight });
				this.load.audio(char.name, 'assets/sounds/'+ char.name +'.mp3');
			}
		}
	},
	create: function () {
		stage = new Stage(this);
		stage.createBackground();//background
		//stage.addParticles('leaf', 0xCCB1F8)
		stage.addRain();
		stage.animate();
		ground = stage.createGround();
		match = new Match(this);
		player1 = new Character(this, 300, 300, null, 0, this.chars[0]) //players
		player2 = new Character(this, 500, 300, null, 0, this.chars[1])
		center = new Dummy(this, 400, 300, null, null);
		player1.opponent = player2
		player2.opponent = player1
		this.players.push(player1);
		this.players.push(player2);
		input = new Input(this.input, this)
		input.createCombos();//controller inputs
		input.createKeys();
		input.lockKeys(false);
		//input2.lockKeys(false);
		this.addCollisions(); //collision
		this.cameras.main.setBounds(0, 0, 800, 600); //cameras
		this.cameras.main.zoomTo(1.5, 6000, 'Power2')
		this.cameras.main.startFollow(center, true, 0.8, 1);
		console.log('sessionPlayerID: ' + sessionPlayerID)
		if(sessionPlayerID == 1){
			controlledPlayer =  player1
			player1.isControlled = true;
		}else{
			controlledPlayer =  player2
			player2.isControlled = true;
		}
	},
	addCollisions: function(){
		yellowhit = this.add.sprite(55, 68, 'yellowhit').setVisible(false);
		bluehit = this.add.sprite(55, 68, 'bluehit').setVisible(false);
		this.anims.create({ key: 'yellowhit', frames: this.anims.generateFrameNumbers('yellowhit', { start: 0, end: 5 }), frameRate: 12, repeat: 0 });
		this.anims.create({ key: 'bluehit', frames: this.anims.generateFrameNumbers('bluehit', { start: 0, end: 5 }), frameRate: 12, repeat: 0 });
		this.events.on('counterAttack', counterAttackHandler, this);
		p1hb_collider = this.physics.add.collider(player1.hitbox, player2, weaponHit, null, this)
		p2hb_collider = this.physics.add.collider(player2.hitbox, player1, weaponHit, null, this)
		p1fb_collider = this.physics.add.collider(player1.projectile, player2, fireballHit, null, this)
		p2fb_collider = this.physics.add.collider(player2.projectile, player1, fireballHit, null, this)
		p1p2_collider = this.physics.add.collider(player1, player2, null, null, this)
		fbfb_collider = this.physics.add.collider(player1.projectile, player2.projectile, fireballsHit, null, this)
	},
	addPlayerColl: function(){
		p1p2_collider = this.physics.add.collider(player1, player2, null, null, this)
	},
	removePlayerColl: function(){
		this.physics.world.removeCollider(p1p2_collider);
	},
	getPlayers: function () {
		return this.players;
	},
	setControls: function(state){
		input.lockKeys(state);
	},
	update: function () {
		if (match.started) {
			input.controlPlayer(controlledPlayer);
			input.centerFocus();
			input.lockKeys(false)
			var zoomLevel = distanceBet(player1, player2) > 220000 ? 1.1 : 1.5;
			this.cameras.main.zoomTo(zoomLevel, 500, 'Linear');
			input.simulate(controlledPlayer, true);
		}
		if(match.ended){
			input.simulate(controlledPlayer, false);
		}
	}
});