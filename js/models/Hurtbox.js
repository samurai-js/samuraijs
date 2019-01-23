var Container = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,
    initialize:
        function Container(scene, x, y, children) {
            Phaser.GameObjects.Sprite.call(this, scene, x, y, children)
            scene.add.existing(this);
            scene.physics.add.existing(this);
            scene.physics.add.collider(this, ground);
            this.scene = scene
        }
})