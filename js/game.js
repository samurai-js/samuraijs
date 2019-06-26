//Main game
var game = new Phaser.Game({
	type: Phaser.AUTO, parent: "game", width: 800, height: 600,
	input: { gamepad: true },
	physics: { default: 'arcade', arcade: { gravity: { y: 600 }, debug: false } },
	scene: [splashscene, loadscene, mainscene, hudscene]
});
var gamepad;
//Functions
function weaponHit(hitbox, target) {
	var hitter = hitbox.parent
	hitbox.collides = true
	if (target.state == 's_block' || target.state == 's_walk_bwd') {
		addHitSparks(target.x, target.y, 2, 'yellow')
		target.swordhit(hitbox.damage);
		target.body.setVelocityX(0);
	} else {
		if (hitter.hitbox.active && !target.hitbox.active) {
			addHitSparks(target.x, target.y, 2, 'yellow')
			target.hit(hitbox.type, hitbox.damage);
		} else if (!hitter.hitbox.active && target.hitbox.active) {
			addHitSparks(hitter.x, hitter.y, 2, 'yellow')
			hitter.hit(hitter.hitbox.type, hitter.hitbox.damage);
		} else if (hitter.hitbox.active && target.hitbox.active && hitter.hitbox.collides && target.hitbox.collides) {
			var players = [hitter, target]
			this.events.emit('counterAttack', players);
		} else {
			addHitSparks(target.x, target.y, 2, 'yellow')
			target.hit(hitbox.type, hitbox.damage);
		}
	}
}
function counterAttackHandler(players) {
	var attack = { slp: 1, smp: 2, shp: 3, jhp: 3, chk: 2, uppercut: 4 }
	hitter = players[0].hitbox.parent
	target = players[1].hitbox.parent
	if (attack[hitter.hitbox.type] == attack[target.hitbox.type]) {
		hitter.hit(target.hitbox.type, 1) //reenable when node is working
		target.hit(hitter.hitbox.type, 1)
	} else if (attack[hitter.hitbox.type] > attack[target.hitbox.type]) {
		match.counterAttack(target.fireballsHit.id)
		target.hit(hitter.hitbox.type, 1) //counter text
	}
}
function fireballHit(fireball, target) {
	fireball.setState('hit')
	addHitSparks(target.x, target.y, 2, 'yellow')
	if (target.state == 's_block' || target.state == 's_walk_bwd') {
		target.swordhit();
	} else {
		target.hit(fireball.type, fireball.damage);
	}
}
function fireballsHit(fireball1, fireball2) {
	addHitSparks(fireball1.x, fireball1.y, 2.5, 'blue')
	fireball1.setState('hit')
	fireball2.setState('hit')
}
function addHitSparks(x, y, scale, color) {
	this[color + 'hit'].setPosition(x, y).setScale(scale)
	this[color + 'hit'].setTint(0xF8FBF7).setVisible(true).setDepth(99)
	this[color + 'hit'].play(color + 'hit', true);
	this[color + 'hit'].on('animationcomplete', clearSparks, this);
}
function clearSparks(color) {
	this[color.key].setVisible(false);
}
function distanceBet(object, target) {
	var xDif = object.x - target.x;
	var yDif = object.y - target.y;
	return ((xDif * xDif) + (yDif * yDif));
}
function isRight(object, target) {
	var xDif = object.x - target.x;
	var isRight = ((xDif) > 0) ? true : false
	return isRight;
}
function invertControls(object, target) {
	if (isRight(object, target)) {
		object.flipX = true;
		object.speedX = -100;
		object.xInd = -1
		object.fwd = 'bwd'
		object.bwd = 'fwd'
	} else {
		object.resetFlip()
		object.speedX = 100;
		object.xInd = 1
		object.fwd = 'fwd'
		object.bwd = 'bwd'
	}
};
//Node client
client = {};
client.socket = io.connect();
client.newPlayer = function () {
	this.socket.emit('newPlayer');
};
client.sendData = function (id, action, args) {
	this.socket.emit('sendPlayerData', id, action, args);
};
client.socket.on('newPlayer', function (player) {
	sessionPlayerID = player.id
});	
client.socket.on('sendPlayerData', function (id, data, args) {
	if(controlledPlayer.id !== id){
		if(typeof args !== 'undefined' || args  !== null){	
			//controlledPlayer.opponent.fixDirection()
			//Array.isArray(args) ? controlledPlayer.opponent[data](...args) : controlledPlayer.opponent[data](args)
		}
	}
});

sessionPlayerID = null
client.newPlayer();


