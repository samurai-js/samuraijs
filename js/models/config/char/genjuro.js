// Frame data
var frames = [
    { name: 'idle', data: { start: 0, end: 12, frameRate: 10, repeat: -1, frameWidth: 108, frameHeight: 112 } },
    { name: 'walk_fwd', data: { start: 0, end: 7, frameRate: 7, repeat: -1, frameWidth: 120, frameHeight: 107 } },
    { name: 'walk_bwd', data: { start: 0, end: 7, frameRate: 7, repeat: -1, frameWidth: 113, frameHeight: 120 } },
    { name: 'jump', data: { start: 0, end: 14, frameRate: 10, repeat: 0, frameWidth: 123, frameHeight: 209, } },
    { name: 'run_fwd', data: { start: 4, end: 19, frameRate: 12, repeat: -1, frameWidth: 152, frameHeight: 118 } },
    { name: 'run_bwd', data: { start: 0, end: 20, frameRate: 20, repeat: 0, frameWidth: 207, frameHeight: 126 } },
    { name: 'shp', data: { start: 0, end: 12, frameRate: 13, repeat: 0, frameWidth: 170, frameHeight: 191 }, hitbox: { start: 4, end: 9, width: 110, height: 80, damage: 80 } },
    { name: 'smp', data: { start: 0, end: 7, frameRate: 12, repeat: 0, frameWidth: 206, frameHeight: 134 }, hitbox: { start: 0, end: 4, width: 100, height: 30, speedX: 0, damage: 60 } },
    { name: 'slp', data: { start: 0, end: 6, frameRate: 12, repeat: 0, frameWidth: 171, frameHeight: 174 }, hitbox: { start: 1, end: 4, width: 90, height: 40, damage: 40 } },
    { name: 'chk', data: { start: 0, end: 7, frameRate: 12, repeat: 0, frameWidth: 147, frameHeight: 102 }, hitbox: { start: 2, end: 8, y: 20, width: 85, height: 30, damage: 60 } },
    { name: 'jhp', data: { start: 0, end: 15, frameRate: 15, repeat: 0, frameWidth: 170, frameHeight: 196 }, hitbox: { start: 4, end: 12, width: 80, height: 90, damage: 80 } },
    { name: 'block', data: { start: 0, end: 5, frameRate: 12, repeat: 0, frameWidth: 110, frameHeight: 109 } },
    { name: 'hit', data: { start: 0, end: 6, frameRate: 10, repeat: 0, frameWidth: 128, frameHeight: 137 } },
    { name: 'hitair', data: { start: 0, end: 3, frameRate: 12, repeat: -1, frameWidth: 144, frameHeight: 112 } },
    { name: 'hitground', data: { start: 0, end: 5, frameRate: 12, repeat: 0, frameWidth: 144, frameHeight: 123 } },
    { name: 'uppercut', data: { start: 0, end: 18, frameRate: 15, repeat: 0, frameWidth: 199, frameHeight: 290 }, hitbox: { start: 4, end: 10, y: 50, width: 60, height: 80, damage: 70 } },
    { name: 'shoot', data: { start: 0, end: 16, frameRate: 16, repeat: 0, frameWidth: 165, frameHeight: 242 } },
    { name: 'risingcard', data: { start: 0, end: 72, frameRate: 12, repeat: 0, frameWidth: 201, frameHeight: 312 }, hitbox: { frameHits: [0, 22, 30, 39, 45, 55, 64], width: 60, height: 80, damage: 80 } },
    { name: 'fireball', data: { start: 0, end: 5, frameRate: 7, repeat: -1, frameWidth: 100, frameHeight: 123 }, hitbox: { width: 60, height: 60, y: 23, ldmg: 30, mdmg: 50, hdmg: 80, ldist: 9000, mdist: 8000, hdist: 6000 } }];
// Audio
var audio = [
    { name: 'shp', start: 14, duration: 1.5, config: {} },
    { name: 'slp', start: 15.2, duration: 1, config: {} },
    { name: 'smp', start: 16, duration: 1, config: {} },
    { name: 'chk', start: 17, duration: 1, config: {} },
    { name: 'shoot', start: 6.5, duration: 1, config: {} },
    { name: 'uppercut', start: 4, duration: 1, config: {} }];
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
    { name: 'hit', from: ['s_idle', 's_walk_fwd', 's_walk_bwd', 's_run', 's_jump', 's_attack'], to: 's_hit' },
    { name: 'setState', from: '*', to: function (state) { return state } }];
// Basic config
var genjuro = {
    name: 'genjuro', id: 'p1', fullname: 'Genjuro Kibagami',
    width: 60, height: 90, health: 1000,
    projectile: 'mirror', special: 'risingcard',
    speedX: 100, speedY: -370, uppercutY: -150, slideSpeed: 10,
    frames, audio, transitions
}