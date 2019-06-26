//Loader scene
var loadscene = new Phaser.Class({
	Extends: Phaser.Scene,
	initialize:
		function loadscene() {
        Phaser.Scene.call(this, { key: 'loadscene', active: false });
    },
    chars: [],
	preload: function () {
        //player config
        this.load.script('genjuro_js', 'js/models/config/char/genjuro.js');
        this.load.script('haohmaru_js', 'js/models/config/char/haohmaru.js');
        //sounds
		this.load.audio('hit', 'assets/sounds/hit.mp3');
		this.load.audio('effects', 'assets/sounds/effects.mp3');
		this.load.audio('voiceover', 'assets/sounds/voiceover.mp3');
		//background
		this.load.image('ground', 'assets/stages/ground.png');
		this.load.image('white_spark', 'assets/particles/white.png');
		this.load.image('red_spark', 'assets/particles/red.png');
		this.load.image('blood', 'assets/particles/blood.png');
        this.load.image('rain', 'assets/particles/rain.png');
        this.load.spritesheet('yellowhit', 'assets/particles/yellowhit.png', { frameWidth: 55, frameHeight: 68 });
        this.load.spritesheet('bluehit', 'assets/particles/bluehit.png', { frameWidth: 55, frameHeight: 68 });
        this.load.spritesheet('leaf', 'assets/particles/leaf.png', { frameWidth: 22, frameHeight: 14 });
		this.load.spritesheet('background', 'assets/stages/basara.png', { frameWidth: 800, frameHeight: 600 });
		//objects
		this.load.script('stage_js', 'js/models/Stage.js');
        this.load.script('player_js', 'js/models/Character.js');
        this.load.script('dummy_js', 'js/models/Dummy.js');
		this.load.script('hitbox_js', 'js/models/Hitbox.js');
		this.load.script('hurtbox_js', 'js/models/Hurtbox.js');
        this.load.script('fireball_js', 'js/models/Fireball.js');
        //controllers
        this.load.script('input_js', 'js/controller/Input.js');
        this.load.script('sound_js', 'js/controller/Sound.js');
    },
    create: function(){
        random = Phaser.Math.Between(1, 2)
        if (random == 1){
            this.chars.push(haohmaru); haohmaru.id = 'p1'
            this.chars.push(genjuro); genjuro.id = 'p2'
        }else{
            this.chars.push(genjuro); genjuro.id = 'p1'
            this.chars.push(haohmaru); haohmaru.id = 'p2'
        }
        this.scene.start('mainscene');
        this.scene.start('hudscene');
    }
});