var StatusBar = new Phaser.Class({
	initialize:
	function StatusBar(scene, x, y, width, height, flipped, value) {
		this.bar = new Phaser.GameObjects.Graphics(scene);
		this.flipped = flipped
		this.flipX = this.flipped ? -1 : 1
		this.width = width;
		this.height = height;
		this.value = value;
		this.damage = 0;
		this.x = x
		this.y = y;	
		this.contentx  = this.flipped ? width + x : x
		this.scene = scene
		this.timeout_config = { delay: 2000, repeat: this.value, callback: this.clearDamage, callbackScope: this }
		this.timeout = this.scene.time.addEvent(this.timeout_config);
		scene.add.existing(this.bar);
	},
	addWinnerMark: function(x,y,text, border){
		this.marker = this.scene.add.text(x, y).setAlign('left').setText(text).setScrollFactor(0).setFontSize(18).setFontFamily("Arial").setStroke(border, 8);
	},
	decrease: function(amount) {
		this.value -= amount
		if (this.value < 1000 && this.value > 300) {
			this.draw(0x23E94F, 0x6EFF5B, this.width * this.value/1000, this.height);
			this.showDamage(amount);
		}else if(this.value < 300 && this.value > 1){
			this.draw(0xff0000, 0xff6b6b, this.width * this.value/1000, this.height);
			this.showDamage(amount);
		}else if(this.value <= 0){
			this.draw(0xffffff, 0xf4efef, this.width, this.height);
		}
	},
	increase: function(amount) {
		this.value += amount
		if(this.value <= 1000){
			this.draw(0xB34DDA, 0xE5AEF7, this.width * this.value/1000, this.height);
		}else if(this.value >= 1000){
			this.draw(0xff0000, 0xff6b6b, this.width, this.height);
		}
	},	
	draw: function(color, gradient, width, height) {
		this.bar.clear();
		this.bar.fillStyle(0x000000); //border
		this.bar.fillRect(this.x, this.y, this.width + 4, this.height + 5); 
		this.bar.fillStyle(0xffffff); //white background
		this.bar.fillRect(this.x + 2, this.y + 2, this.width, this.height);
		this.bar.fillStyle(color); //content
		this.bar.fillRect(this.contentx + 2, this.y + 2, width * this.flipX, height);
		this.bar.fillStyle(gradient); //gradient
		this.bar.fillRect(this.contentx + 2, this.y * 1.10, width * this.flipX, height/2);
	},
	showDamage: function(amount){
		if(this.damage==0){
			this.damage = this.width * amount/1000 
		}else{
			this.timeout.reset(this.timeout_config)
			this.damage += this.width * amount/1000 
		}
		var remaining = this.width * this.value/1000 * this.flipX
		this.bar.fillStyle(0xfc8387); //damage color 
		this.bar.fillRect(this.contentx + 2 + remaining, this.y + 2, this.damage  * this.flipX, this.height);
	},
	clearDamage: function(){
		var remaining = this.width * this.value/1000 * this.flipX
		this.bar.fillStyle(0xffffff);
		this.bar.fillRect(this.contentx + 2 + remaining, this.y + 2, this.damage * this.flipX, this.height);
		this.damage = 0
	},
	clear: function(){
		this.bar.fillStyle(0xffffff);
		this.bar.fillRect(this.x + 2, this.y + 2, this.width, this.height);
		this.value = 0
	}
})