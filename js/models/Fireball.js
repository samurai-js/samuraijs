var Projectile = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,
    initialize:
        function Projectile(scene, x, y, texture, frame, type, config) {
            Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame)
            scene.add.existing(this);
            scene.physics.add.existing(this);
            this.body.allowGravity = false
            this.type = type
            this.texture = texture
            this.setDepth(1);
            this.setVisible(false)
            this.body.setSize(config[0].hitbox.width, config[0].hitbox.height);
            this.duration = config[0].hitbox.duration
            this.state = 'none'
            this.damage = 0
        },
    setState: function (state) {
        this.state = state
    },
    shoot: function (xInd, speed, damage) {
        this.damage = damage;
        xInd == -1 ? xInd = 0 : xInd
        switch (this.type) {
        case 'mirror':
            this.play(this.texture, true);
            this.scene.tweens.add({
                targets: this, x: 800 * xInd, ease: 'Power2', duration: speed, angle: 9000,
                onStart: function (tween, targets) {
                    targets[0].setVisible(true);
                    targets[0].setState('start')
                },
                onUpdate: function (tween, targets) {
                    if (targets.state == 'hit') {
                        targets.setVisible(false)
                        targets.body.reset(0, 0)
                        tween.stop(0)
                    }
                }
            }); break;
        case 'hurricane':
            this.play(this.texture, true);
            this.scene.tweens.add({
                targets: this, x: 800 * xInd, ease: 'Power2', duration: speed,
                onStart: function (tween, targets) {
                    targets[0].setVisible(true);
                    targets[0].setState('start')
                },
                onUpdate: function (tween, targets) {
                    if (targets.state == 'hit') {
                        tween.stop(0)
                        targets.setVisible(false)
                        targets.body.reset(0.0)
                    }
                }
            }); break;
        }
    }
})