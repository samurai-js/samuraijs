var Hitbox = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,
    initialize:
        function Hitbox(scene, x, y, texture, frame, parent) {
            Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame)
            scene.add.existing(this);
            scene.physics.add.existing(this);
            this.texture = texture
            this.parent = parent
            this.scene = scene
            this.setDepth(1);
            this.setVisible(false)
            this.body.allowGravity = false;
            this.damage = 0
            this.type = null
            this.active= false
            this.collides=false
    },
    display: function(config){
        var frame = this.parent.anims.currentFrame.index -1
        if(config.start < frame && frame < config.end){
            configY = config.y == undefined? 0 : config.y
            this.active = true
            this.setCoord(this.parent.x + (this.parent.width * 0.35) * this.parent.xInd, this.parent.y - configY, config.width, config.height); 
        }else if(frame >= config.end){
            this.clear();
        }
    },
    quickDisplay: function(config){
        var currframe = this.parent.anims.currentFrame.index
        if(config.frameHits.includes(currframe)){
            this.setCoord(this.parent.x + (this.parent.width * 0.35) * this.parent.xInd, this.parent.y, config.width, config.height); 
        }else{
            this.clear();
        }
    },
    setCoord: function (x, y, width, height) {
        this.setPosition(x, y);
        this.body.setSize(width, height);
    },
    setDamage: function (damage, type) {
        this.damage = damage
        this.type = type
    },
    clear: function () {
        this.active = false
        this.collides=false
        this.body.reset(0, 0)
    }
})