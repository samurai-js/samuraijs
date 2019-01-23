var Dummy = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,
    initialize:
        function Dummy(scene, x, y, texture, frame) {
            Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame)
            scene.add.existing(this);
            scene.physics.add.existing(this);
            scene.physics.add.collider(this, ground);
            this.scene = scene
            this.body.setSize(this.width, this.width);
            this.body.setCollideWorldBounds(true);
            this.setVisible(false)
        }
})