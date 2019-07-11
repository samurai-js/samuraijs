var Character = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,
    initialize:
        function Character(scene, x, y, texture, frame, config) {
            Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame)
            this.config = config
            this.id = config.id + '_';
            this.name = config.name;
            this.opponent = null
            this.id == 'p2_' ? this.flipX = true : null;
            this.xInd = 1
            this.health = config.health;
            this.isControlled = false
            this.speedX = this.config.speedX * this.xInd;
            this.speedY = this.config.speedY;
            this.uppercutY = config.uppercutY;
            this.special = config.special
            this.power = 0
            this.fwd = 'fwd'
            this.bwd = 'bwd'
            this.setScale(1.35).setDepth(2)
            var fb_config = this.config.frames.filter(a => { return a.name === 'fireball' });
            this.projectile = new Projectile(scene, this.id == 'p2_' ? 800 : 0, 0, this.id + 'fireball', null, config.projectile, fb_config);
            this.hitbox = new Hitbox(scene, this.id == 'p2_' ? 800 : 0, 0, this.id + 'yellowhit', null, this);
            this.audio = new Sound(game);
            this.soundfx = new Sound(game);
            this.loadAnims(scene)
            this.play(this.id + 'idle');
            this.fsm = this._fsm();
            this.scene = scene;
            this.scene.add.existing(this);
            this.scene.physics.add.existing(this);
            this.scene.physics.add.collider(this, ground);
            this.body.setSize(config.width, config.height);
            this.body.setCollideWorldBounds(true);
            this.body.setBounce(0, 0.2)
            this.on('animationcomplete', this.animComplete, this);
            this.on('animationupdate', this.animUpdate, this);
            this.data = {}
    },
    fixDirection: function(){
        if( !this.isControlled && !isRight(this,this.opponent)){
            this.xInd = 1
        }
        if( !this.isControlled && isRight(this,this.opponent)){
            this.xInd = -1
        }
    },
    loadAnims: function (scene) {
        for (var i = 0; i < this.config.frames.length; i++) {
            var frame = this.config.frames[i];
            scene.anims.create({ key: this.id + frame.name, frames: scene.anims.generateFrameNumbers(this.id + frame.name, { start: frame.data.start, end: frame.data.end }), frameRate: frame.data.frameRate, repeat: frame.data.repeat });
        }
        this.audio.addSound(this.config.name)
        this.audio.addMarker(this.config.audio)
        markers = [{ name: 'clash', start: 14, duration: 1.5, config: {} },
        { name: 'run', start: 35.2, duration: 1.5, config: { loop: true } },
        { name: 'hit', start: 5.2, duration: 1, config: {} }];
        this.soundfx.addSound('effects');
        this.soundfx.addMarker(markers);
    },
    animComplete: function (animation) {
        this.idle()
        this.emit('animationcomplete_' + animation.key, this);
    },
    animUpdate: function (animation) {
        this.emit('animationupdate_' + animation.key, this);
    },
    addSparks: function (color) {
        this.spark = this.scene.add.particles(color + '_spark').createEmitter({
            speed: { min: 200, max: 1000 }, angle: { min: 200, max: 270 }, quantity: 15,
            scale: { start: -0.1, end: 0.25 }, lifespan: 1000, gravityY: 900
        });
        this.spark.explode(20, this.x, this.y);
    },
    addBlood: function () {
        this.blood = this.scene.add.particles('blood').createEmitter({
            speed: { min: 200, max: 500 }, angle: { min: 200, max: 270 },
            rotate: { min: 90, max: 180 }, scale: { start: -0.1, end: 0.22 },
            lifespan: 800, gravityY: 900
        });
        this.blood.explode(20, this.x, this.y);
    }
})
StateMachine.factory(Character, { //actions state machine
    init: 's_idle',
    transitions: transitions,
    methods: {
        onIdle: function (data) {
            this.isControlled ? client.sendData(this.id, data.transition, this.data) : null
            this.play(this.id + 'idle', true);
            this.body.setVelocityX(0);
        },
        onJump: function (data) {
            this.play(this.id + 'jump', true);
            this.body.setVelocityY(this.speedY);
            this.isControlled ? client.sendData(this.id, data.transition, this.data) : null
        },
        onBeforeWalk: function (lc, action) {
            this.data = action
        },
        onWalk: function (data, action) {
            this.isControlled ? client.sendData(this.id, data.transition, this.data) : null
            this.play(this.id + 'walk_' + action, true);
            switch (action) {
                case 'fwd': this.body.setVelocityX(this.config.speedX * this.xInd); break;
                case 'bwd': this.body.setVelocityX(-this.config.speedX * this.xInd); break;
            }
        },
        onBeforeRun: function (lc, action) {
            this.data = action
        },
        onRun: function (data, action) {
            this.isControlled ? client.sendData(this.id, data.transition, this.data) : null
            this.data = null
            this.play(this.id + 'run_' + action, true);
            this.soundfx.playMarker('run');
            switch (action) {
                case 'fwd': this.body.setVelocityX(this.config.speedX * 2  * this.xInd); break;
                case 'bwd': this.body.setVelocityX(-this.config.speedX * 1.5  * this.xInd); break;
            }
        },
        onLeaveSRun: function () {
            this.soundfx.pause();
        },
        onBlock: function (data) {
            this.isControlled ? client.sendData(this.id, data.transition, this.data) : null
            this.play(this.id + 'block', true)
            console.log(data)
            this.body.setVelocityX(0);
            this.on('animationcomplete_' + this.id + 'block', function () {
                this.play(this.id + 'block', true, 5)
            });
        },
        onBeforeSwordhit: function (lc, damage) {
            this.data = damage
        },
        onSwordhit: function (lc, damage) {
            this.data = null
            this.anims.delayedPlay(600, this.id + 'block', 5)
            this.soundfx.playMarker('clash');
            this.body.setVelocityX(0);
            this.x -= 7 * this.xInd
            this.addSparks('white'); this.addSparks('red');
            match.increasePower(this.id, damage);
            this.power += damage
        },
        onBeforeAttack: function (lc, type) {
            this.data = type
        },
        onAttack: function (data, type) {
            this.isControlled ? client.sendData(this.id, data.transition, this.data) : null
            this.data = null;
            this.play(this.id + type, false)
            var frame = this.config.frames.filter(a => { return a.name === type });
            switch (type) {
                case 'shp': this.audio.playMarker(type);
                    this.body.setVelocityX(0);
                    this.hitbox.setDamage(frame[0].hitbox.damage, type)
                    this.on('animationupdate_' + this.id + type, function () { this.hitbox.display(frame[0].hitbox) });
                    break;
                case 'jhp': this.audio.playMarker('shp');
                    this.hitbox.setDamage(frame[0].hitbox.damage, type)
                    this.on('animationupdate_' + this.id + type, function () { this.hitbox.display(frame[0].hitbox) });
                    break;
                case 'smp': this.audio.playMarker(type);
                    this.body.setVelocityX(frame[0].hitbox.speedX * this.xInd);
                    this.hitbox.setDamage(frame[0].hitbox.damage, type)
                    this.on('animationupdate_' + this.id + type, function () { this.hitbox.display(frame[0].hitbox) });
                    break;
                case 'slp': this.audio.playMarker(type);
                    this.body.setVelocityX(0);
                    this.hitbox.setDamage(frame[0].hitbox.damage, type)
                    this.on('animationupdate_' + this.id + type, function () { this.hitbox.display(frame[0].hitbox) });
                    break;
                case 'chk': this.audio.playMarker(type);
                    this.body.setVelocityX(this.config.slideSpeed * this.xInd);
                    this.hitbox.setDamage(frame[0].hitbox.damage, type)
                    this.on('animationupdate_' + this.id + type, function () { this.hitbox.display(frame[0].hitbox) });
                    break;
            }
        },
        onBeforeSpattack: function (lc, type, strength) {
            this.data = typeof strength !== 'undefined'? [type, strength] : type
        },
        onSpattack: function (data, type, strength) {
            this.isControlled ? client.sendData(this.id, data.transition, this.data) : null
            this.play(this.id + type, true)
            var frame = this.config.frames.filter(a => { return a.name === type });
            switch (type) {
                case 'shoot':
                    this.audio.playMarker('shoot');
                    if (this.projectile.state != 'start') {
                        var fbconfig = this.config.frames.filter(a => { return a.name === 'fireball' });
                        this.body.setVelocityX(0);
                        switch (strength) {
                            case 'low': this.projectile.setPosition(this.x, this.y + fbconfig[0].hitbox.y).shoot(this.xInd, fbconfig[0].hitbox.ldist, fbconfig[0].hitbox.ldmg); break;
                            case 'medium': this.projectile.setPosition(this.x, this.y + fbconfig[0].hitbox.y).shoot(this.xInd, fbconfig[0].hitbox.mdist, fbconfig[0].hitbox.mdmg); break;
                            case 'high': this.projectile.setPosition(this.x, this.y + fbconfig[0].hitbox.y).shoot(this.xInd, fbconfig[0].hitbox.hdist, fbconfig[0].hitbox.hdmg); break;
                        }
                    } break;
                case 'uppercut':
                    this.hitbox.setDamage(frame[0].hitbox.damage, type)
                    this.body.setVelocityY(this.uppercutY);
                    this.on('animationupdate_' + this.id + type, function () { this.hitbox.display(frame[0].hitbox) });
                    this.audio.playMarker('uppercut'); break;
                case 'risinguppercut':
                    this.hitbox.setDamage(frame[0].hitbox.damage, type)
                    this.body.setVelocityY(this.uppercutY * 2.2);
                    this.on('animationupdate_' + this.id + type, function () { this.hitbox.display(frame[0].hitbox) });
                    this.audio.playMarker('uppercut'); break;
                case 'risingcard': //genjuro critical art
                    this.y = 425
                    match.resetPower(this.id)
                    this.power = 0
                    this.hitbox.setDamage(frame[0].hitbox.damage, type)
                    this.opponent.play(this.opponent.id + 'hitair', true);
                    this.on('animationupdate_' + this.id + type, function () {
                        this.body.allowGravity = false
                        this.body.setVelocityY(-7).setVelocityX(0)
                        this.hitbox.quickDisplay(frame[0].hitbox)
                        this.body.setBounce(0, 0)
                        this.opponent.setDepth(1)
                        if(this.opponent.state != 's_block'){
                            this.opponent.setState('s_immobile')
                            this.opponent.body.setBounce(0, 0)
                            this.opponent.body.allowGravity = false
                            this.opponent.body.setVelocityY(-33).setVelocityX(0)
                        }
                    });
                    this.on('animationcomplete_' + this.id + type, function () {
                        this.scene.cameras.main.flash(1200);
                        this.scene.cameras.main.shake(2000, 0.005);
                        this.play(this.id + 'jump', true, 7)
                        this.body.allowGravity = true
                        this.opponent.body.allowGravity = true
                    }); break;
                case 'raging-uppercut': //haohmaru critical art
                    match.resetPower(this.id)
                    this.power = 0
                    this.scene.setControls(false)
                    this.scene.cameras.main.flash(500);
                    this.hitbox.setDamage(frame[0].hitbox.damage, type);
                            this.body.setVelocityX(this.speedX)
                            this.scene.cameras.main.flash(800);
                            this.scene.cameras.main.shake(800, 0.003);
                            this.play(this.id + 'raging-uppercut', true)
                            this.on('animationupdate_' + this.id + 'raging-uppercut', function () {
                                this.hitbox.setCoord(this.x + 50 * this.xInd, this.y, frame[0].hitbox.width, frame[0].hitbox.height);
                            })
                            this.opponent.setState('s_immobile')
                            this.on('animationcomplete_' + this.id + 'raging-uppercut', function () {
                                this.spattack('risinguppercut')
                                this.opponent.body.setVelocityY(-500)
                                this.opponent.body.setBounce(0, 0.3)
                                this.on('animationcomplete_' + this.id + 'risinguppercut', function () {
                                    this.play(this.id + 'jump', true)
                                })
                                this.scene.cameras.main.flash(1200);
                                this.scene.cameras.main.shake(1200, 0.003);
                            })
                    }
        },
        onLeaveSAttack: function (lc, type) {
            this.data = null
            this.hitbox.clear()
        },
        onBeforeHit: function(lc,type, damage){
            this.data = [type,damage]
            this.health -= damage
            match.decreaseHealth(this.id, damage)
            match.increasePower(this.id, damage * 1.6)
            this.power += damage * 1.6
            this.data = null
        },
        onHit: function (lc, type) {
            this.data = null
            switch (type) {
                case 'mirror':
                    this.play(this.id + 'hitground', true); 
                    this.scene.cameras.main.shake(500, 0.004); break;                    
                case 'hurricane':
                    this.play(this.id + 'hitair', false);
                    this.body.setVelocityY(-370);
                    this.on('animationupdate_' + this.id + 'hitair', function () {
                        if (this.body.touching.down) { 
                            this.scene.cameras.main.shake(500, 0.004);
                            this.play(this.id + 'hitground', true) 
                        }
                    }); break;
                default:
                    if (!this.body.touching.down) {
                        this.scene.cameras.main.shake(500, 0.004);
                        this.play(this.id + 'hitair', false)
                        this.body.setBounce(0, 0.3);
                        this.body.setVelocityY(-200 )
                        this.body.setVelocityX(-100 * this.xInd) ;
                    } else {
                        this.play(this.id + 'hit', true)
                    }
                    this.on('animationupdate_' + this.id + 'hitair', function () {
                        if (this.body.touching.down) { this.play(this.id + 'hitground', true) }
                        this.on('animationcomplete_' + this.id + 'hitground', function () {
                            this.play(this.id + 'hitground', true, 5)
                        });
                    }); break;
            }
            this.soundfx.playMarker('hit');
            this.addBlood()
        },
        onInvalidTransition: function (transition, from, to) { },
        onPendingTransition: function (transition, from, to) { },
    }
});