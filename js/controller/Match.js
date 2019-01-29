var Match = new Phaser.Class({
	initialize:
		function Match(scene) {
			this.winner;
			this.loser;
			this.scene = scene
			this.matchTime = 99
			this.prepTime = 6
			this.postTime = 6
			this.time = 0;
			this.started = false;
			this.ended = false;
			this.timeout;
			this.p1_hitcounter = 1
			this.p2_hitcounter = 1
			this.timeout_config = { delay: 2000, repeat: this.matchTime, callback: this.clearText, callbackScope: this }
			this.counter_config = { x: 400, y: 100, text: this.matchTime, scrollFactor: 0, fontSize: 75, font: 'Arial', shadow: '', color: '#EDD161', stroke: '#3D1300', strokeWidth: 8, origin: 0.5, visible: true }
			this.centertxt_config = { x: 400, y: 250, text: '', scrollFactor: 0, fontSize: 89, font: 'Arial', shadow: '', color: '#EDD161', stroke: '#3D1300', strokeWidth: 8, origin: 0.5, align: 'center', visible: true }
			this.p1hit_config = { x: 650, y: 250, text: this.p1_hitcounter + ' SLASH!', scrollFactor: 0, fontSize: 45, font: 'Arial', shadow: '', color: '#a0f7b7', stroke: '#027721', strokeWidth: 8, origin: 0.5, align: 'right', visible: false }
			this.p2hit_config = { x: 150, y: 250, text: this.p2_hitcounter + ' SLASH!', scrollFactor: 0, fontSize: 45, font: 'Arial', shadow: '', color: '#a0f7b7', stroke: '#027721', strokeWidth: 8, origin: 0.5, align: 'left', visible: false }
			this.p1counter_config = { x: 680, y: 290, text: 'COUNTER!', scrollFactor: 0, fontSize: 25, font: 'Arial', shadow: '', color: '#ffffff', stroke: '#ff0000', strokeWidth: 8, origin: 0.5, align: 'right', visible: false }
			this.p2counter_config = { x: 120, y: 290, text: 'COUNTER!', scrollFactor: 0, fontSize: 25, font: 'Arial', shadow: '', color: '#ffffff', stroke: '#ff0000', strokeWidth: 8, origin: 0.5, align: 'left', visible: false }
			//music
			this.audio = new Sound(game);
			marker = [{ name: 'ready', start: 39, duration: 1.5, config: {} },
			{ name: 'round1', start: 41, duration: 1.5, config: {} },
			{ name: 'go', start: 40.2, duration: 1, config: {} },
			{ name: 'genjuro', start: 31, duration: 1.6, config: {} },
			{ name: 'haohmaru', start: 12, duration: 1.5, config: {} },
			{ name: 'draw', start: 54, duration: 1.5, config: {} },
			{ name: 'winner', start: 46.5, duration: 1, config: {} }];
			this.audio.addSound('voiceover')
			this.audio.addMarker(marker)
		},
	createHud: function () {
		//texts
		this.p1name_config = { x: 105, y: 50, text: players[0].name.toUpperCase(), scrollFactor: 0, fontSize: 20, font: 'Arial', shadow: '', color: '#fff', stroke: '#000', strokeWidth: 4, origin: 0.5, visible: true }
		this.p2name_config = { x: 700, y: 50, text: players[1].name.toUpperCase(), scrollFactor: 0, fontSize: 20, font: 'Arial', shadow: '', color: '#fff', stroke: '#000', strokeWidth: 4, origin: 0.5, visible: true }
		this.timeout = this.scene.time.addEvent(this.timeout_config);
		this.pretimer = this.scene.time.addEvent({ delay: 1000, repeat: this.prepTime });
		this.timer = this.scene.time.addEvent({ delay: 1100, repeat: this.matchTime, paused: true });
		this.postTimer = this.scene.time.addEvent({ delay: 1000, repeat: this.postTime, paused: true });
		//texts
		this.counter = this.createText(this.counter_config)
		this.centerText = this.createText(this.centertxt_config)
		this.player1_name = this.createText(this.p1name_config)
		this.player2_name = this.createText(this.p2name_config) 
		this.p1_hittext = this.createText(this.p1hit_config)
		this.p2_hittext = this.createText(this.p2hit_config)
		this.p1_countertext = this.createText(this.p1counter_config)
		this.p2_countertext = this.createText(this.p2counter_config)
		//health bars
		this.p1_healthbar = new StatusBar(this.scene, 45, 70, 300, 25, true, 1000)
		this.p2_healthbar = new StatusBar(this.scene, 450, 70, 300, 25, false, 1000);
		this.p1_powerbar = new StatusBar(this.scene, 95, 105, 250, 15, true, 0);
		this.p2_powerbar = new StatusBar(this.scene, 450, 105, 250, 15, false, 0);
		this.p1_healthbar.draw(0xD9B931, 0xedd161, 300, 25);
		this.p2_healthbar.draw(0xD9B931, 0xedd161, 300, 25);
		this.p1_powerbar.draw(0xffffff, 0xdddddd, 250, 15);
		this.p2_powerbar.draw(0xffffff, 0xdddddd, 250, 15);
		this.p1_healthbar.addWinnerMark(300, 40, '*', '#898989')
		this.p1_healthbar.addWinnerMark(330, 40, '*', '#898989')
		this.p1_healthbar.addWinnerMark(450, 40, '*', '#898989')
		this.p1_healthbar.addWinnerMark(480, 40, '*', '#898989')
	},
	createText: function (config) {
		var text = this.scene.add.text(config.x, config.y)
			.setText(config.text).setScrollFactor(config.scrollFactor)
			.setFontSize(config.fontSize).setFontFamily(config.font)
			.setShadow(config.shadow).setColor(config.color)
			.setStroke(config.stroke, config.strokeWidth).setOrigin(config.origin)
			.setAlign(config.align).setVisible(config.visible)
		return text;
	},
	clearText: function () {
		this.p1_hittext.setVisible(false).setText('')
		this.p2_hittext.setVisible(false).setText('')
		this.p1_hitcounter = 1
		this.p2_hitcounter = 1
		this.p1_countertext.setVisible(false)
		this.p2_countertext.setVisible(false)
	},
	decreaseHealth: function (id, amount) {
		this[id + 'healthbar'].decrease(amount)
		this[id + 'hittext'].setVisible(true).setText(this[id + 'hitcounter'] + ' SLASH!')
		if (this[id + 'hittext'].visible) {
			this.timeout.reset(this.timeout_config)
			this[id + 'hitcounter'] += 1
		}
	},
	counterAttack: function(id){
		this[id + 'countertext'].setVisible(true)
	},
	increasePower: function (id, amount) {
		this[id + 'powerbar'].increase(amount)
	},
	resetPower: function (id) {
		this[id + 'powerbar'].clear()
	},
	startTimer: function () {
		this.time = this.timer.repeatCount
		this.time < 10 ? this.counter.setColor('#E53941').setText('0' + this.timer.repeatCount) : this.counter.setText(this.timer.repeatCount);
	},
	playerStance: function () {
		player1.idle()
		player2.idle()
	},
	startRound: function () {
		if (this.pretimer.repeatCount == 6) {//ready
			this.audio.playMarker('ready')
			this.centerText.setText('一本目')
		}
		if (this.pretimer.repeatCount == 4) {//get set
			this.audio.playMarker('round1')
			this.centerText.setText("回戦" + 1)
		}
		if (this.pretimer.repeatCount == 1) { //go
			this.centerText.setText("斬撃!!!")
			this.audio.playMarker('go')
		}
		if (this.pretimer.repeatCount == 0) {//start timer
			this.timer.paused = false;
			this.centerText.setVisible(false)
			this.startTimer();
			this.started = true;
		}
		if (this.time == 0 && this.started) { //time over
			this.postTimer.paused = false
			this.endRound()
		}
		if (player1.health <= 0 || player2.health <= 0) { //victory
			this.timer.paused = true
			this.postTimer.paused = false
			this.endRound()
		}
	},
	endRound: function () {
		//winner
		this.ended = true
		input.lockKeys(true)
		if (player1.health == player2.health) {
			this.winner = 'none'
		} else if (player1.health > player2.health) {
			this.winner = players[0]
			this.loser = players[1]
		} else {
			this.winner = players[1]
			this.loser = players[0]
		}
		this.clearText()
		player1.on('animationcomplete', this.playerStance, this);
		player2.on('animationcomplete', this.playerStance, this);
		this.postTimer.repeatCount == 6 ? this.audio.playMarker('winner') : ''
		this.postTimer.repeatCount == 5 ? this.centerText.setVisible(true).setText("勝負あり!") : null
		//winner stance
		if (this.winner == 'none') {
			this.postTimer.repeatCount == 3 ? this.audio.playMarker('draw') : null
			this.postTimer.repeatCount == 2 ? this['p1_healthbar'].addWinnerMark(330, 40, 'D', '#E1363E') : null
			this.postTimer.repeatCount == 2 ? this['p1_healthbar'].addWinnerMark(450, 40, 'D', '#E1363E') : null
			this.postTimer.repeatCount == 2 ? this.centerText.setVisible(true).setFontSize(65).setText("DRAW GAME".toUpperCase()) : null
		} else {
			this.winner.id == 'p1_' ? x = 320 : x = 450;
			this.postTimer.repeatCount == 5 ? this[this.loser.id + 'healthbar'].clearDamage() : null
			this.postTimer.repeatCount == 3 ? this.audio.playMarker(this.winner.name) : null
			this.postTimer.repeatCount == 2 ? this[this.winner.id + 'healthbar'].addWinnerMark(x, 40, 'W', '#E1363E') : null
			this.postTimer.repeatCount == 2 ? this.centerText.setVisible(true).setFontSize(65).setText(this.winner.name.toUpperCase()) : null
		}
	}
})