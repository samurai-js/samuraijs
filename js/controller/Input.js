var Input = new Phaser.Class({
	initialize:
		function Input(input, scene) {
			this.input = input;
			this.random = 1
			this.timeout = scene.time.addEvent({
				delay: 1000, repeat: 99, callback: function () {
					this.random = Phaser.Math.Between(1, 5)
				}, callbackScope: this
			});
		},
	lockKeys: function (boolean) {
		boolean == true ? this.input.keyboard.enabled = false : this.input.keyboard.enabled = true
	},
	createCombos: function () {
		this.dashfwd = this.input.keyboard.createCombo('DD', { resetOnMatch: true });
		this.dashbwd = this.input.keyboard.createCombo('AA', { resetOnMatch: true });
		this.shofwd = this.input.keyboard.createCombo('DSD', { resetOnMatch: true });
		this.shobwd = this.input.keyboard.createCombo('ASA', { resetOnMatch: true });
		this.dshofwd = this.input.keyboard.createCombo('DDSD', { resetOnMatch: true });
		this.dshobwd = this.input.keyboard.createCombo('AASA', { resetOnMatch: true });
		this.hfbfwd = this.input.keyboard.createCombo('SDP', { resetOnMatch: true });
		this.hfbbwd = this.input.keyboard.createCombo('SAP', { resetOnMatch: true });
		this.lfbfwd = this.input.keyboard.createCombo('SDI', { resetOnMatch: true });
		this.lfbbwd = this.input.keyboard.createCombo('SAI', { resetOnMatch: true });
		this.mfbfwd = this.input.keyboard.createCombo('SDO', { resetOnMatch: true });
		this.mfbbwd = this.input.keyboard.createCombo('SAO', { resetOnMatch: true });
		this.cafwd = this.input.keyboard.createCombo('EE', { resetOnMatch: true });
		this.cabwd = this.input.keyboard.createCombo('EE', { resetOnMatch: true });
	},
	createKeys: function () {
		this.u = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
		this.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
		this.l = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		this.r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		this.lp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
		this.mp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
		this.hp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
		this.lk = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
		this.mk = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
		this.hk = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
	},
	controlPlayer: function (player) {
		//flip direction 
		opponent = (player.id == 'p1_') ? player2 : player1
		if (player.state != 's_run') { invertControls(player, player.opponent) }
		//direction buttons
		if (this.l.isDown && this.u.isDown) { player.jump() }
		else if (this.r.isDown && this.u.isDown) { player.jump() }
		else if (this.l.isDown && this.d.isDown) { player.block() }
		else if (this.r.isDown && this.d.isDown) { player.block() }
		else if (this.l.isDown) { player.walk(player.bwd) }
		else if (this.r.isDown) { player.walk(player.fwd) }
		else if (this.u.isDown) { player.jump() }
		else if (player.body.touching.down) { 
			if (player.state == 's_block' || player.state == 's_walk_fwd' || 
			    player.state == 's_walk_bwd' || player.state == 's_run') { 
				player.idle(); } 
		}
		//slash buttons
		if (this.hp.isDown) { player.state == 's_jump' ? player.attack('jhp') : player.attack('shp'); }
		if (this.mp.isDown) { player.state == 's_jump' ? player.attack('jhp') : player.attack('smp'); }
		if (this.lp.isDown) { player.state == 's_jump' ? player.attack('jhp') : player.attack('slp'); }
		if (this.mk.isDown) { player.state == 's_jump' ? player.attack('chk') : player.attack('chk'); }
		//special moves
		if (player.body.touching.down) {
			this.input.keyboard.on('keycombomatch', function (event) {
				this['dash' + player.fwd].matched ? player.run('fwd') : null
				this['dash' + player.bwd].matched ? player.run('bwd') : null
				this['lfb' + player.fwd].matched ? player.spattack('shoot','low') : null
				this['mfb' + player.fwd].matched ? player.spattack('shoot','medium') : null
				this['hfb' + player.fwd].matched ? player.spattack('shoot','high') : null
				this['sho' + player.fwd].matched ? player.spattack('uppercut') : null
				this['dsho' + player.fwd].matched ? player.spattack('uppercut') : null
				if(player.power >= 1000){
					if(this['ca' + player.fwd].matched){
						player.spattack(player.special)	
					} 
				}
			}, this)
		}
	},
	dummy: function (player, enabled) {
		opponent = (player.id == 'p1_') ? player2 : player1
		if (player.state != 's_run') { invertControls(player, player.opponent) }
		if (!enabled) { this.timeout.paused = true; opponent.idle() }
		switch (player.state) {
			case 's_attack':
				//opponent.attack('shp')
				break;
		}
	},
	simulate: function (player, enabled) {
		opponent = (player.id == 'p1_') ? player2 : player1
		if (player.state != 's_run') { invertControls(player.opponent, player) }
		if (!enabled) { this.timeout.paused = true; opponent.idle() }
		switch (player.state) {
			case 's_attack':
			if (distanceBet(player, opponent) < 60000) {
				if (player.hitbox.collides) {
					this.random == 2 ? opponent.attack('shp') : null
					this.random > 2 ? opponent.swordhit() : null
				} else {
					opponent.power >= 1000 ? opponent.spattack(opponent.special) : null
					opponent.block(); 
				}
			} else {
				this.random == 1 ? opponent.spattack('shoot','high') : null
			} break;
			case 's_walk_fwd':
				this.random == 1 ? opponent.walk('bwd') : null;
				this.random == 2 ? opponent.walk('fwd') : null; 
			case 's_walk_bwd':
				this.random == 1 ? opponent.walk('fwd') : null;
				this.random == 2 ? opponent.walk('bwd') : null; break;
			case 's_idle':
				this.random == 1 ? opponent.walk('fwd') : null;
				this.random == 2 ? opponent.walk('bwd') : null; break;
			case 's_jump':
				this.random == 1 ? opponent.block() : null
				this.random == 2 ? opponent.attack('shp') : null
				this.random == 3 ? opponent.body.touching.down ? opponent.spattack('uppercut') : opponent.walk('bwd') : null
				this.random == 5 ? opponent.attack('smp') : null
			case 's_block':
				this.random == 3 ? opponent.attack('slp') : null
				this.random == 2 ? opponent.attack('shp') : null
				this.random == 5 ? opponent.attack('smp') : null
				this.random == 4 ? opponent.attack('chk') : null
		}
	},
	centerFocus: function () {
		center.setX((player1.x + player2.x) / 2)
		this.u.isDown && center.body.touching.down ? center.body.setVelocityY(-450) : null
	}
})