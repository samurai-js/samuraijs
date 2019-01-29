// Frame data
var frames = [
    { name: 'idle', data: { start: 0, end: 8, frameRate: 8, repeat: -1, frameWidth: 97, frameHeight: 134 } },
    { name: 'walk_fwd', data: { start: 0, end: 7, frameRate: 7, repeat: -1, frameWidth: 130, frameHeight: 117 } },
    { name: 'walk_bwd', data: { start: 0, end: 6, frameRate: 6, repeat: -1, frameWidth: 112, frameHeight: 125 } },
    { name: 'jump', data: { start: 0, end: 12, frameRate: 10, repeat: 0, frameWidth: 96, frameHeight: 175, } },
    { name: 'run_fwd', data: { start: 3, end: 11, frameRate: 7, repeat: -1, frameWidth: 142, frameHeight: 122 } },
    { name: 'run_bwd', data: { start: 0, end: 6, frameRate: 6, repeat: -1, frameWidth: 112, frameHeight: 125 } },
    { name: 'shp', data: { start: 0, end: 15, frameRate: 15, repeat: 0, frameWidth: 250, frameHeight: 137 }, hitbox: { start: 5, end: 10, width: 150, height: 40, damage: 80 } },
    { name: 'smp', data: { start: 0, end: 10, frameRate: 12, repeat: 0, frameWidth: 293, frameHeight: 111 }, hitbox: { start: 3, end: 7, width: 100, height: 40, speedX: 40, damage: 60 } },
    { name: 'slp', data: { start: 3, end: 9, frameRate: 12, repeat: 0, frameWidth: 157, frameHeight: 111 }, hitbox: { start: 1, end: 4, width: 100, height: 40, damage: 60 } },
    { name: 'chk', data: { start: 0, end: 7, frameRate: 12, repeat: 0, frameWidth: 176, frameHeight: 160 }, hitbox: { start: 2, end: 8, y: -50, width: 85, height: 30, damage: 60 } },
    { name: 'jhp', data: { start: 0, end: 12, frameRate: 10, repeat: 0, frameWidth: 200, frameHeight: 179 }, hitbox: { start: 4, end: 8, y: -50, width: 70, height: 70, damage: 80 } },
    { name: 'block', data: { start: 0, end: 5, frameRate: 12, repeat: 0, frameWidth: 100, frameHeight: 147 } },
    { name: 'hit', data: { start: 0, end: 7, frameRate: 12, repeat: 0, frameWidth: 144, frameHeight: 152 } },
    { name: 'hitair', data: { start: 0, end: 3, frameRate: 12, repeat: -1, frameWidth: 144, frameHeight: 112 } },
    { name: 'hitground', data: { start: 0, end: 5, frameRate: 12, repeat: 0, frameWidth: 144, frameHeight: 128 } },
    { name: 'uppercut', data: { start: 5, end: 14, frameRate: 12, repeat: 0, frameWidth: 200, frameHeight: 242 }, hitbox: { start: 4, end: 9, y: 20, width: 65, height: 100, damage: 100 } },
    { name: 'shoot', data: { start: 0, end: 10, frameRate: 10, repeat: 0, frameWidth: 157, frameHeight: 247 } },
    { name: 'raging-uppercut', data: { start: 5, end: 14, frameRate: 12, repeat: 10, frameWidth: 200, frameHeight: 250 }, hitbox: { width: 90, height: 80, damage: 40 } },
    { name: 'risinguppercut', data: { start: 0, end: 14, frameRate: 14, repeat: 0, frameWidth: 200, frameHeight: 222 }, hitbox: { width: 90, height: 80, damage: 80 } },
    { name: 'fireball', data: { start: 0, end: 5, frameRate: 7, repeat: -1, frameWidth: 176, frameHeight: 192 }, hitbox: { width: 75, height: 155, y: 0, ldmg: 30, mdmg: 50, hdmg: 80, ldist: 12000, mdist: 9000, hdist: 8000 } }];
// Audio
var audio = [
    { name: 'shp', start: 12, duration: 1.5, config: {} },
    { name: 'slp', start: 10, duration: 1, config: {} },
    { name: 'smp', start: 11, duration: 1, config: {} },
    { name: 'chk', start: 19, duration: 1, config: {} },
    { name: 'shoot', start: 0.1, duration: 1.2, config: {} },
    { name: 'uppercut', start: 1.3, duration: 1, config: {} }];
// State
var transitions = [
    { name: 'idle', from: '*', to: 's_idle' },
    { name: 'swordhit', from: ['s_idle', 's_walk_fwd', 's_walk_bwd', 's_block'], to: 's_swordhit' },
    { name: 'walk', from: ['s_idle', 's_walk_fwd', 's_walk_bwd'], to: function (dir) { return 's_walk_' + dir } },
    { name: 'run', from: ['s_idle', 's_walk_fwd', 's_walk_bwd'], to: 's_run' },
    { name: 'jump', from: ['s_idle', 's_walk_fwd', 's_walk_bwd', 's_run'], to: 's_jump' },
    { name: 'attack', from: ['s_idle', 's_walk_fwd', 's_walk_bwd', 's_run', 's_jump'], to: 's_attack' },
    { name: 'spattack', from: ['s_idle', 's_walk_fwd', 's_walk_bwd', 's_run'], to: 's_attack' },
    { name: 'block', from: ['s_idle', 's_walk_fwd', 's_walk_bwd'], to: 's_block' },
    { name: 'hit', from: ['s_idle', 's_walk_fwd', 's_walk_bwd', 's_run', 's_jump', 's_attack','s_immobile'], to: 's_hit' },
    { name: 'setState', from: '*', to: function (state) { return state } }];

// Basic config
var haohmaru = {
    name: 'haohmaru', id: 'p2', fullname: 'Haohmaru',
    width: 65, height: 90, health: 1000,
    projectile: 'hurricane', special: 'raging-uppercut',
    speedX: 100, speedY: -380, uppercutY: -270, slideSpeed: 80,
    frames, audio, transitions
}