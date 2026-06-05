// ─── D&D Game Data ────────────────────────────────────────────────────────────

export const CLASSES = [
  { id: 'warrior',   name: 'Warrior',    emoji: '⚔️',  hp: 34, maxHp: 34, attack: 6, defense: 3, mana: 2, maxMana: 2, color: '#c97020', desc: 'High HP & defense. Reliable melee fighter.', hitBonus: 3 },
  { id: 'mage',      name: 'Mage',       emoji: '🔮',  hp: 20, maxHp: 20, attack: 4, defense: 1, mana: 7, maxMana: 7, color: '#7060d0', desc: 'Powerful spells, fragile body. Spells auto-hit.', hitBonus: 1 },
  { id: 'rogue',     name: 'Rogue',      emoji: '🗡️', hp: 24, maxHp: 24, attack: 5, defense: 2, mana: 3, maxMana: 3, color: '#208040', desc: 'High burst damage. Advantage on d20 hit rolls.', hitBonus: 4 },
  { id: 'paladin',   name: 'Paladin',    emoji: '🛡️', hp: 30, maxHp: 30, attack: 5, defense: 4, mana: 3, maxMana: 3, color: '#d0a030', desc: 'Holy warrior — heals, shields, and smites.', hitBonus: 2 },
  { id: 'ranger',    name: 'Ranger',     emoji: '🏹',  hp: 26, maxHp: 26, attack: 5, defense: 2, mana: 4, maxMana: 4, color: '#40a060', desc: 'Precise ranged attacks. Poisons and traps.', hitBonus: 5 },
  { id: 'necromancer', name: 'Necromancer', emoji: '💀', hp: 22, maxHp: 22, attack: 3, defense: 1, mana: 6, maxMana: 6, color: '#904090', desc: 'Commands undead, drains life, curses foes.', hitBonus: 1 },
];

export const ALL_CARDS = [
  // ── Warrior ─────────────────────────────────────────────────────────────
  { id:'slash',          name:'Slash',           class:'warrior',     cost:1, type:'attack',  value:6,  emoji:'⚔️',  color:'#c84020', desc:'Melee strike. Roll d20.', needsHit:true },
  { id:'shield_bash',    name:'Shield Bash',     class:'warrior',     cost:2, type:'attack',  value:8,  emoji:'🛡️', color:'#c84020', desc:'Bash + stun on hit.', needsHit:true },
  { id:'cleave',         name:'Cleave',          class:'warrior',     cost:2, type:'attack',  value:10, emoji:'⚡',  color:'#c84020', desc:'Heavy strike. Roll d20.', needsHit:true },
  { id:'execute',        name:'Execute',         class:'warrior',     cost:3, type:'attack',  value:16, emoji:'🪓',  color:'#ff2020', desc:'Massive blow. Roll d20.', needsHit:true },
  { id:'whirlwind',      name:'Whirlwind',       class:'warrior',     cost:3, type:'attack',  value:12, emoji:'🌀',  color:'#e06000', desc:'Spin attack. Auto-hits.', needsHit:false },
  { id:'iron_wall',      name:'Iron Wall',       class:'warrior',     cost:1, type:'defense', value:6,  emoji:'🏰',  color:'#6080a0', desc:'Block 6 damage.', needsHit:false },
  { id:'fortify',        name:'Fortify',         class:'warrior',     cost:1, type:'defense', value:8,  emoji:'🔒',  color:'#6080a0', desc:'Block 8 damage.', needsHit:false },
  { id:'last_stand',     name:'Last Stand',      class:'warrior',     cost:2, type:'defense', value:14, emoji:'🏛️', color:'#8090c0', desc:'Block 14 damage.', needsHit:false },
  { id:'battle_cry',     name:'Battle Cry',      class:'warrior',     cost:2, type:'buff',    value:5,  emoji:'📯',  color:'#d0a020', desc:'+5 bonus next hit.', needsHit:false },
  { id:'war_stomp',      name:'War Stomp',       class:'warrior',     cost:2, type:'attack',  value:7,  emoji:'👊',  color:'#c84020', desc:'Ground slam. Stuns enemy.', needsHit:true, special:'stun' },
  { id:'taunt',          name:'Taunt',           class:'warrior',     cost:1, type:'buff',    value:3,  emoji:'😤',  color:'#d07010', desc:'+3 next hit & refresh mana.', needsHit:false, special:'draw' },

  // ── Mage ─────────────────────────────────────────────────────────────────
  { id:'fireball',       name:'Fireball',        class:'mage',        cost:2, type:'attack',  value:10, emoji:'🔥',  color:'#e05020', desc:'Auto-hit. Fire damage.', needsHit:false },
  { id:'ice_lance',      name:'Ice Lance',       class:'mage',        cost:1, type:'attack',  value:6,  emoji:'❄️',  color:'#60c0e0', desc:'Auto-hit + slow enemy.', needsHit:false },
  { id:'arcane_bolt',    name:'Arcane Bolt',     class:'mage',        cost:1, type:'attack',  value:8,  emoji:'💫',  color:'#b060e0', desc:'Auto-hit arcane damage.', needsHit:false },
  { id:'meteor',         name:'Meteor',          class:'mage',        cost:3, type:'attack',  value:15, emoji:'☄️',  color:'#e05020', desc:'Auto-hit. Massive damage.', needsHit:false },
  { id:'chain_lightning',name:'Chain Lightning', class:'mage',        cost:2, type:'attack',  value:11, emoji:'⚡',  color:'#80c0ff', desc:'Auto-hit. Electric surge.', needsHit:false },
  { id:'frost_nova',     name:'Frost Nova',      class:'mage',        cost:2, type:'attack',  value:7,  emoji:'🌨️', color:'#a0e0ff', desc:'Auto-hit. Freezes enemy.', needsHit:false, special:'stun' },
  { id:'arcane_surge',   name:'Arcane Surge',    class:'mage',        cost:3, type:'attack',  value:18, emoji:'🌟',  color:'#e0b0ff', desc:'Overload. Max power.', needsHit:false },
  { id:'mana_shield',    name:'Mana Shield',     class:'mage',        cost:2, type:'defense', value:10, emoji:'🔮',  color:'#6080a0', desc:'Block 10 damage.', needsHit:false },
  { id:'blink',          name:'Blink',           class:'mage',        cost:1, type:'defense', value:5,  emoji:'✨',  color:'#b060e0', desc:'Dodge 5 + refresh mana.', needsHit:false, special:'draw' },
  { id:'time_warp',      name:'Time Warp',       class:'mage',        cost:2, type:'defense', value:8,  emoji:'⏳',  color:'#c0a0ff', desc:'Block 8 + refresh mana.', needsHit:false, special:'draw' },
  { id:'mana_burst',     name:'Mana Burst',      class:'mage',        cost:1, type:'buff',    value:4,  emoji:'💧',  color:'#4080ff', desc:'+4 bonus next spell.', needsHit:false },

  // ── Rogue ─────────────────────────────────────────────────────────────────
  { id:'stab',           name:'Stab',            class:'rogue',       cost:1, type:'attack',  value:6,  emoji:'🗡️', color:'#20a040', desc:'Piercing strike. Roll d20.', needsHit:true },
  { id:'backstab',       name:'Backstab',        class:'rogue',       cost:2, type:'attack',  value:12, emoji:'🔪',  color:'#20a040', desc:'Backstab. Advantage d20.', needsHit:true },
  { id:'shadowstep',     name:'Shadowstep',      class:'rogue',       cost:2, type:'attack',  value:9,  emoji:'🌑',  color:'#20a040', desc:'Unblockable. Auto-hit.', needsHit:false },
  { id:'eviscerate',     name:'Eviscerate',      class:'rogue',       cost:3, type:'attack',  value:14, emoji:'💉',  color:'#10c030', desc:'Deep wounds. Advantage.', needsHit:true },
  { id:'fan_knives',     name:'Fan of Knives',   class:'rogue',       cost:2, type:'attack',  value:8,  emoji:'🌟',  color:'#50d060', desc:'Throw blades. Auto-hit.', needsHit:false },
  { id:'ambush',         name:'Ambush',          class:'rogue',       cost:2, type:'attack',  value:11, emoji:'👥',  color:'#20a040', desc:'Strike from shadows. Advantage.', needsHit:true },
  { id:'smoke_bomb',     name:'Smoke Bomb',      class:'rogue',       cost:1, type:'defense', value:6,  emoji:'💨',  color:'#6080a0', desc:'Evade 6 + confuse enemy.', needsHit:false, special:'confuse' },
  { id:'evasion',        name:'Evasion',         class:'rogue',       cost:2, type:'defense', value:10, emoji:'🌪️', color:'#80b090', desc:'Full evasion. Block 10.', needsHit:false },
  { id:'poison',         name:'Poison',          class:'rogue',       cost:2, type:'debuff',  value:3,  emoji:'☠️',  color:'#608020', desc:'3 poison/turn stacking.', needsHit:false },
  { id:'crippling_poison',name:'Cripple',        class:'rogue',       cost:2, type:'debuff',  value:5,  emoji:'🐍',  color:'#508010', desc:'5 poison/turn + slow.', needsHit:false, special:'slow' },
  { id:'pickpocket',     name:'Pickpocket',      class:'rogue',       cost:1, type:'utility', value:2,  emoji:'💰',  color:'#d0a020', desc:'Steal 2 mana.', needsHit:false },
  { id:'preparation',    name:'Preparation',     class:'rogue',       cost:1, type:'utility', value:0,  emoji:'🎴',  color:'#d0a020', desc:'Refresh 2 mana.', needsHit:false, special:'draw2' },

  // ── Paladin ───────────────────────────────────────────────────────────────
  { id:'holy_strike',    name:'Holy Strike',     class:'paladin',     cost:1, type:'attack',  value:7,  emoji:'✝️',  color:'#d0a030', desc:'Divine melee. Roll d20.', needsHit:true },
  { id:'smite',          name:'Smite',           class:'paladin',     cost:2, type:'attack',  value:11, emoji:'☀️',  color:'#ffd700', desc:'Holy smite. Roll d20.', needsHit:true },
  { id:'divine_hammer',  name:'Divine Hammer',   class:'paladin',     cost:3, type:'attack',  value:14, emoji:'🔨',  color:'#ffa020', desc:'Judgment. Roll d20.', needsHit:true },
  { id:'consecrate',     name:'Consecrate',      class:'paladin',     cost:2, type:'attack',  value:8,  emoji:'🌟',  color:'#ffe060', desc:'Sacred ground. Auto-hit.', needsHit:false },
  { id:'shield_of_faith',name:'Shield of Faith', class:'paladin',     cost:1, type:'defense', value:7,  emoji:'🛡️', color:'#a0c0ff', desc:'Holy shield. Block 7.', needsHit:false },
  { id:'divine_barrier', name:'Divine Barrier',  class:'paladin',     cost:2, type:'defense', value:12, emoji:'💫',  color:'#c0d8ff', desc:'Block 12 + stun attacker.', needsHit:false },
  { id:'lay_on_hands',   name:'Lay on Hands',    class:'paladin',     cost:2, type:'heal',    value:8,  emoji:'🙏',  color:'#40ff80', desc:'Heal 8 HP.', needsHit:false },
  { id:'holy_light',     name:'Holy Light',      class:'paladin',     cost:3, type:'heal',    value:14, emoji:'🌅',  color:'#80ff80', desc:'Heal 14 HP.', needsHit:false },
  { id:'aura_of_courage',name:'Aura of Courage', class:'paladin',     cost:1, type:'buff',    value:4,  emoji:'✨',  color:'#ffd070', desc:'+4 bonus + refresh mana.', needsHit:false, special:'draw' },

  // ── Ranger ────────────────────────────────────────────────────────────────
  { id:'arrow_shot',     name:'Arrow Shot',      class:'ranger',      cost:1, type:'attack',  value:6,  emoji:'🏹',  color:'#40a060', desc:'Precise shot. Roll d20.', needsHit:true },
  { id:'aimed_shot',     name:'Aimed Shot',      class:'ranger',      cost:2, type:'attack',  value:11, emoji:'🎯',  color:'#60c070', desc:'Aimed shot. Advantage.', needsHit:true },
  { id:'volley',         name:'Volley',          class:'ranger',      cost:3, type:'attack',  value:12, emoji:'💨',  color:'#40c060', desc:'Arrow barrage. Auto-hits.', needsHit:false },
  { id:'snipe',          name:'Snipe',           class:'ranger',      cost:2, type:'attack',  value:13, emoji:'🔭',  color:'#20e040', desc:'Long range. Advantage.', needsHit:true },
  { id:'explosive_trap', name:'Explosive Trap',  class:'ranger',      cost:2, type:'attack',  value:9,  emoji:'💣',  color:'#e06010', desc:'Set trap. Auto-hit blast.', needsHit:false },
  { id:'poison_arrow',   name:'Poison Arrow',    class:'ranger',      cost:2, type:'debuff',  value:4,  emoji:'🐍',  color:'#80b020', desc:'4 poison/turn. Roll d20.', needsHit:true },
  { id:'camouflage',     name:'Camouflage',      class:'ranger',      cost:1, type:'defense', value:7,  emoji:'🌿',  color:'#608040', desc:'Hide in shadows. Block 7.', needsHit:false },
  { id:'barrage',        name:'Barrage',         class:'ranger',      cost:3, type:'attack',  value:15, emoji:'🌪️', color:'#40d060', desc:'Rapid fire. Auto-hits.', needsHit:false },
  { id:'eagles_eye',     name:'Eagle\'s Eye',    class:'ranger',      cost:1, type:'buff',    value:4,  emoji:'🦅',  color:'#a0c040', desc:'+4 bonus next shot.', needsHit:false },
  { id:'track',          name:'Track',           class:'ranger',      cost:1, type:'utility', value:0,  emoji:'👣',  color:'#80a030', desc:'Refresh 2 mana.', needsHit:false, special:'draw2' },

  // ── Necromancer ───────────────────────────────────────────────────────────
  { id:'shadow_bolt',    name:'Shadow Bolt',     class:'necromancer', cost:1, type:'attack',  value:7,  emoji:'🌑',  color:'#904090', desc:'Dark energy. Auto-hit.', needsHit:false },
  { id:'death_coil',     name:'Death Coil',      class:'necromancer', cost:2, type:'attack',  value:9,  emoji:'💜',  color:'#b040b0', desc:'Drain life. Heal 3.', needsHit:false, special:'lifesteal3' },
  { id:'soul_drain',     name:'Soul Drain',      class:'necromancer', cost:2, type:'attack',  value:10, emoji:'👻',  color:'#a050c0', desc:'Drain soul. Auto-hit.', needsHit:false, special:'lifesteal5' },
  { id:'bone_spear',     name:'Bone Spear',      class:'necromancer', cost:1, type:'attack',  value:8,  emoji:'🦴',  color:'#c0a0d0', desc:'Bone projectile. Auto-hit.', needsHit:false },
  { id:'lich_form',      name:'Lich Form',       class:'necromancer', cost:3, type:'attack',  value:16, emoji:'🧟',  color:'#c040e0', desc:'Unleash death. Auto-hit.', needsHit:false },
  { id:'plague',         name:'Plague',          class:'necromancer', cost:2, type:'debuff',  value:5,  emoji:'🦠',  color:'#70b020', desc:'5 poison/turn stacking.', needsHit:false },
  { id:'death_grip',     name:'Death Grip',      class:'necromancer', cost:2, type:'debuff',  value:3,  emoji:'🖤',  color:'#604080', desc:'3 poison + stun enemy.', needsHit:false, special:'stun' },
  { id:'bone_shield',    name:'Bone Shield',     class:'necromancer', cost:1, type:'defense', value:6,  emoji:'🦷',  color:'#9070a0', desc:'Bone wall. Block 6.', needsHit:false },
  { id:'undying_will',   name:'Undying Will',    class:'necromancer', cost:2, type:'defense', value:10, emoji:'⚰️', color:'#7040a0', desc:'Block 10 + refresh mana.', needsHit:false, special:'draw' },
  { id:'dark_ritual',    name:'Dark Ritual',     class:'necromancer', cost:1, type:'heal',    value:5,  emoji:'🩸',  color:'#c04060', desc:'Sacrifice HP to heal 5.', needsHit:false },
];

export const MONSTERS = [
  // Floor 1-2
  { id:'goblin',        name:'Goblin',         emoji:'👺', hp:16, maxHp:16, attack:3,  defense:1, ac:10, reward:12, desc:'Sneaky little menace',          color:'#40a020' },
  { id:'skeleton',      name:'Skeleton',       emoji:'💀', hp:20, maxHp:20, attack:4,  defense:1, ac:11, reward:15, desc:'Rattling bones of the dead',    color:'#c0b898' },
  { id:'rat_king',      name:'Rat King',       emoji:'🐀', hp:14, maxHp:14, attack:3,  defense:0, ac:9,  reward:10, desc:'Swarm of vicious rats',         color:'#a07040' },
  { id:'zombie',        name:'Zombie',         emoji:'🧟', hp:22, maxHp:22, attack:4,  defense:2, ac:10, reward:14, desc:'Slow but relentless undead',     color:'#608040' },
  // Floor 2-4
  { id:'orc',           name:'Orc Brute',      emoji:'👹', hp:28, maxHp:28, attack:7,  defense:3, ac:13, reward:28, desc:'Massive and brutal fighter',    color:'#808030' },
  { id:'bandit',        name:'Bandit Lord',    emoji:'🏴‍☠️',hp:26, maxHp:26, attack:6,  defense:3, ac:13, reward:28, desc:'Cunning duelist',               color:'#905020' },
  { id:'dark_elf',      name:'Dark Elf',       emoji:'🧝', hp:22, maxHp:22, attack:6,  defense:2, ac:15, reward:32, desc:'Agile shadow archer',           color:'#504080', lifesteal:1 },
  { id:'werewolf',      name:'Werewolf',       emoji:'🐺', hp:26, maxHp:26, attack:8,  defense:2, ac:13, reward:30, desc:'Feral beast, attacks twice',    color:'#806040' },
  // Floor 3-5
  { id:'vampire',       name:'Vampire',        emoji:'🧛', hp:26, maxHp:26, attack:7,  defense:2, ac:14, reward:38, desc:'Drains life with each hit',     color:'#800020', lifesteal:3 },
  { id:'troll',         name:'Cave Troll',     emoji:'🧌', hp:34, maxHp:34, attack:8,  defense:4, ac:14, reward:42, desc:'Regenerates 2 HP per turn',     color:'#506040', regen:2 },
  { id:'golem',         name:'Stone Golem',    emoji:'🗿', hp:38, maxHp:38, attack:7,  defense:6, ac:16, reward:45, desc:'Impenetrable stone armor',      color:'#808080' },
  { id:'wyvern',        name:'Wyvern',         emoji:'🦎', hp:30, maxHp:30, attack:9,  defense:3, ac:14, reward:44, desc:'Winged serpent. Rapid strikes',  color:'#408040' },
  // Floor 4-6
  { id:'dark_knight',   name:'Dark Knight',    emoji:'🖤', hp:32, maxHp:32, attack:9,  defense:5, ac:16, reward:50, desc:'Fallen warrior of shadow',      color:'#4040a0' },
  { id:'witch',         name:'Witch',          emoji:'🧙', hp:24, maxHp:24, attack:10, defense:2, ac:13, reward:48, desc:'Curses and hexes aplenty',      color:'#8040c0' },
  { id:'minotaur',      name:'Minotaur',       emoji:'🐂', hp:36, maxHp:36, attack:10, defense:4, ac:14, reward:52, desc:'Labyrinth guardian',            color:'#805030' },
  { id:'hydra',         name:'Hydra',          emoji:'🐍', hp:35, maxHp:35, attack:9,  defense:3, ac:13, reward:55, desc:'Regrows heads, regen 3/turn',   color:'#206040', regen:3 },
  // Floor 5-7
  { id:'demon',         name:'Pit Demon',      emoji:'😈', hp:38, maxHp:38, attack:11, defense:4, ac:15, reward:60, desc:'Hellfire and fury',             color:'#c02020' },
  { id:'frost_giant',   name:'Frost Giant',    emoji:'🧊', hp:40, maxHp:40, attack:10, defense:5, ac:15, reward:62, desc:'Freezes with every blow',       color:'#60a0d0' },
  { id:'shadow_demon',  name:'Shadow Demon',   emoji:'👤', hp:32, maxHp:32, attack:10, defense:3, ac:16, reward:58, desc:'Phasing entity. Hard to hit.',   color:'#302050', lifesteal:2 },
  // Floor 6-8 Bosses
  { id:'dragon',        name:'Ancient Dragon', emoji:'🐉', hp:50, maxHp:50, attack:12, defense:6, ac:18, reward:100, desc:'Terror of the realm',          color:'#c04020', boss:true },
  { id:'lich',          name:'Lich King',      emoji:'🧟', hp:44, maxHp:44, attack:11, defense:5, ac:17, reward:90, desc:'Undead sorcerer of darkness',   color:'#6030a0', boss:true },
  { id:'demon_lord',    name:'Demon Lord',     emoji:'👿', hp:48, maxHp:48, attack:13, defense:5, ac:17, reward:95, desc:'Ruler of the infernal plane',   color:'#a01010', boss:true, lifesteal:4 },
  { id:'titan',         name:'Stone Titan',    emoji:'🗿', hp:55, maxHp:55, attack:11, defense:8, ac:19, reward:110, desc:'Ancient colossus awakened',    color:'#909090', boss:true, regen:2 },
];

// ─── Items (Loot & Equipment) ─────────────────────────────────────────────────
export const ALL_ITEMS = [
  // Weapons
  { id:'iron_sword',     name:'Iron Sword',      emoji:'🗡️', slot:'weapon',   rarity:'common',    bonusAttack:2,  bonusDefense:0, bonusMaxHp:0,  bonusMana:0, bonusHitBonus:0, sellValue:8,   desc:'+2 Attack' },
  { id:'steel_axe',      name:'Steel Axe',       emoji:'🪓',  slot:'weapon',   rarity:'uncommon',  bonusAttack:4,  bonusDefense:0, bonusMaxHp:0,  bonusMana:0, bonusHitBonus:0, sellValue:18,  desc:'+4 Attack' },
  { id:'rune_blade',     name:'Rune Blade',      emoji:'⚔️', slot:'weapon',   rarity:'rare',      bonusAttack:6,  bonusDefense:0, bonusMaxHp:0,  bonusMana:0, bonusHitBonus:1, sellValue:40,  desc:'+6 Attack, +1 Hit' },
  { id:'flame_sword',    name:'Flame Sword',     emoji:'🔥',  slot:'weapon',   rarity:'epic',      bonusAttack:9,  bonusDefense:0, bonusMaxHp:0,  bonusMana:0, bonusHitBonus:0, sellValue:70,  desc:'+9 Attack, wreathed in flame' },
  { id:'staff_power',    name:'Staff of Power',  emoji:'🪄',  slot:'weapon',   rarity:'rare',      bonusAttack:4,  bonusDefense:0, bonusMaxHp:0,  bonusMana:2, bonusHitBonus:0, sellValue:42,  desc:'+4 Attack, +2 Max Mana' },
  { id:'void_dagger',    name:'Void Dagger',     emoji:'🌑',  slot:'weapon',   rarity:'rare',      bonusAttack:5,  bonusDefense:0, bonusMaxHp:0,  bonusMana:1, bonusHitBonus:2, sellValue:45,  desc:'+5 Attack, +2 Hit, +1 Mana' },
  { id:'longbow',        name:'Longbow',         emoji:'🏹',  slot:'weapon',   rarity:'uncommon',  bonusAttack:3,  bonusDefense:0, bonusMaxHp:0,  bonusMana:0, bonusHitBonus:2, sellValue:20,  desc:'+3 Attack, +2 Hit' },
  { id:'death_staff',    name:'Death Staff',     emoji:'💀',  slot:'weapon',   rarity:'epic',      bonusAttack:7,  bonusDefense:0, bonusMaxHp:0,  bonusMana:3, bonusHitBonus:0, sellValue:80,  desc:'+7 Attack, +3 Max Mana' },
  { id:'holy_sword',     name:'Holy Sword',      emoji:'✝️',  slot:'weapon',   rarity:'epic',      bonusAttack:7,  bonusDefense:1, bonusMaxHp:4,  bonusMana:0, bonusHitBonus:1, sellValue:85,  desc:'+7 Attack, +1 Def, +4 HP, +1 Hit' },
  { id:'thunderstrike',  name:'Thunderstrike',   emoji:'⚡',  slot:'weapon',   rarity:'legendary', bonusAttack:12, bonusDefense:0, bonusMaxHp:0,  bonusMana:2, bonusHitBonus:2, sellValue:150, desc:'+12 Attack, +2 Mana, +2 Hit' },

  // Armor
  { id:'leather_armor',  name:'Leather Armor',   emoji:'🧥',  slot:'armor',    rarity:'common',    bonusAttack:0, bonusDefense:2,  bonusMaxHp:4,  bonusMana:0, bonusHitBonus:0, sellValue:10,  desc:'+2 Defense, +4 Max HP' },
  { id:'chain_mail',     name:'Chain Mail',      emoji:'🛡️', slot:'armor',    rarity:'uncommon',  bonusAttack:0, bonusDefense:4,  bonusMaxHp:6,  bonusMana:0, bonusHitBonus:0, sellValue:22,  desc:'+4 Defense, +6 Max HP' },
  { id:'plate_armor',    name:'Plate Armor',     emoji:'🏛️', slot:'armor',    rarity:'rare',      bonusAttack:0, bonusDefense:6,  bonusMaxHp:10, bonusMana:0, bonusHitBonus:0, sellValue:45,  desc:'+6 Defense, +10 Max HP' },
  { id:'dragon_scale',   name:'Dragon Scale',    emoji:'🐲',  slot:'armor',    rarity:'epic',      bonusAttack:0, bonusDefense:9,  bonusMaxHp:14, bonusMana:0, bonusHitBonus:0, sellValue:90,  desc:'+9 Defense, +14 Max HP' },
  { id:'shadow_cloak',   name:'Shadow Cloak',    emoji:'🌑',  slot:'armor',    rarity:'rare',      bonusAttack:2, bonusDefense:3,  bonusMaxHp:0,  bonusMana:1, bonusHitBonus:1, sellValue:48,  desc:'+2 Atk, +3 Def, +1 Mana, +1 Hit' },
  { id:'mithril_vest',   name:'Mithril Vest',    emoji:'💎',  slot:'armor',    rarity:'epic',      bonusAttack:0, bonusDefense:7,  bonusMaxHp:8,  bonusMana:2, bonusHitBonus:0, sellValue:88,  desc:'+7 Defense, +8 HP, +2 Mana' },
  { id:'void_armor',     name:'Void Armor',      emoji:'🖤',  slot:'armor',    rarity:'legendary', bonusAttack:3, bonusDefense:10, bonusMaxHp:15, bonusMana:0, bonusHitBonus:1, sellValue:160, desc:'+10 Def, +15 HP, +3 Atk, +1 Hit' },

  // Accessories
  { id:'amulet_hp',      name:'Amulet of Life',  emoji:'💎',  slot:'accessory',rarity:'uncommon',  bonusAttack:0, bonusDefense:0,  bonusMaxHp:8,  bonusMana:0, bonusHitBonus:0, sellValue:20,  desc:'+8 Max HP' },
  { id:'ring_mana',      name:'Mana Ring',       emoji:'💍',  slot:'accessory',rarity:'uncommon',  bonusAttack:0, bonusDefense:0,  bonusMaxHp:0,  bonusMana:3, bonusHitBonus:0, sellValue:22,  desc:'+3 Max Mana' },
  { id:'cloak_shadows',  name:'Cloak of Shadows',emoji:'🌑',  slot:'accessory',rarity:'rare',      bonusAttack:2, bonusDefense:2,  bonusMaxHp:0,  bonusMana:1, bonusHitBonus:1, sellValue:50,  desc:'+2 Atk, +2 Def, +1 Mana, +1 Hit' },
  { id:'talisman_luck',  name:'Lucky Talisman',  emoji:'🍀',  slot:'accessory',rarity:'rare',      bonusAttack:0, bonusDefense:0,  bonusMaxHp:0,  bonusMana:0, bonusHitBonus:4, sellValue:44,  desc:'+4 to d20 hit rolls' },
  { id:'ring_power',     name:'Ring of Power',   emoji:'🔴',  slot:'accessory',rarity:'rare',      bonusAttack:4, bonusDefense:0,  bonusMaxHp:0,  bonusMana:0, bonusHitBonus:1, sellValue:46,  desc:'+4 Attack, +1 Hit' },
  { id:'orb_vitality',   name:'Orb of Vitality', emoji:'🔮',  slot:'accessory',rarity:'epic',      bonusAttack:0, bonusDefense:2,  bonusMaxHp:12, bonusMana:2, bonusHitBonus:0, sellValue:80,  desc:'+12 HP, +2 Def, +2 Mana' },
  { id:'phoenix_feather',name:'Phoenix Feather', emoji:'🦅',  slot:'accessory',rarity:'legendary', bonusAttack:3, bonusDefense:3,  bonusMaxHp:10, bonusMana:2, bonusHitBonus:2, sellValue:140, desc:'+3 all stats, +10 HP, +2 Mana' },
];

export const RARITY_COLORS = {
  common:    '#a0a0a0',
  uncommon:  '#40c040',
  rare:      '#4080ff',
  epic:      '#c040e0',
  legendary: '#ffd700',
};

// loot table: which monsters drop what
export const LOOT_TABLE = {
  rat_king:     ['iron_sword','leather_armor'],
  goblin:       ['iron_sword','leather_armor','amulet_hp'],
  zombie:       ['leather_armor','chain_mail'],
  skeleton:     ['iron_sword','chain_mail','amulet_hp'],
  orc:          ['steel_axe','chain_mail','ring_mana'],
  bandit:       ['steel_axe','chain_mail','talisman_luck','void_dagger'],
  dark_elf:     ['void_dagger','shadow_cloak','talisman_luck'],
  werewolf:     ['steel_axe','ring_power','leather_armor'],
  vampire:      ['amulet_hp','cloak_shadows','rune_blade'],
  troll:        ['plate_armor','steel_axe','ring_mana'],
  golem:        ['plate_armor','mithril_vest','orb_vitality'],
  wyvern:       ['rune_blade','dragon_scale','ring_power'],
  dark_knight:  ['rune_blade','plate_armor','void_dagger'],
  witch:        ['staff_power','ring_mana','cloak_shadows'],
  minotaur:     ['steel_axe','plate_armor','talisman_luck'],
  hydra:        ['orb_vitality','dragon_scale','ring_power'],
  demon:        ['flame_sword','dragon_scale','ring_power'],
  frost_giant:  ['mithril_vest','orb_vitality','longbow'],
  shadow_demon: ['shadow_cloak','void_dagger','death_staff'],
  dragon:       ['dragon_scale','flame_sword','thunderstrike','phoenix_feather'],
  lich:         ['death_staff','void_armor','cloak_shadows','holy_sword'],
  demon_lord:   ['flame_sword','void_armor','thunderstrike'],
  titan:        ['void_armor','phoenix_feather','mithril_vest'],
};

export function rollDie(sides = 6) { return Math.floor(Math.random() * sides) + 1; }

export function getMonsterDeck(floor) {
  let pool;
  if (floor <= 2)      pool = MONSTERS.filter(m => !m.boss && (MONSTERS.indexOf(m) < 8));
  else if (floor <= 4) pool = MONSTERS.filter(m => !m.boss && (MONSTERS.indexOf(m) < 14));
  else if (floor <= 6) pool = MONSTERS.filter(m => !m.boss);
  else                 pool = MONSTERS.filter(m => !m.boss);

  const count = floor <= 2 ? 2 : floor <= 5 ? 3 : 4;
  const picked = [];

  // Boss chance: floor 5+ has a chance for a boss to appear
  const bosses = MONSTERS.filter(m => m.boss);
  if (floor >= 5 && Math.random() < 0.45) {
    picked.push({ ...bosses[Math.floor(Math.random() * bosses.length)], hp: bosses[0].maxHp });
  }
  // Floor 8 always has a boss
  if (floor >= 8 && picked.length === 0) {
    picked.push({ ...bosses[Math.floor(Math.random() * bosses.length)] });
  }

  while (picked.length < count) {
    const m = pool[Math.floor(Math.random() * pool.length)];
    if (!picked.find(p => p.id === m.id)) picked.push({ ...m, hp: m.maxHp });
  }
  return picked;
}

export function buildDeck(classId) {
  const classCards = ALL_CARDS.filter(c => c.class === classId);
  const deck = [];
  classCards.forEach(c => { deck.push({ ...c }); deck.push({ ...c }); });
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function drawCards(deckArg, discardArg, handArg, n = 3) {
  let d = [...deckArg], di = [...discardArg], h = [...handArg];
  for (let i = 0; i < n; i++) {
    if (d.length === 0) {
      if (di.length === 0) break;
      d = [...di].sort(() => Math.random() - 0.5);
      di = [];
    }
    h.push(d.pop());
  }
  return { deck: d, discard: di, hand: h };
}

export function rollLoot(monsterId) {
  const table = LOOT_TABLE[monsterId] || [];
  if (!table.length || Math.random() > 0.6) return null; // ~60% drop chance
  const itemId = table[Math.floor(Math.random() * table.length)];
  const found = ALL_ITEMS.find(i => i.id === itemId);
  return found ? { ...found } : null;
}

export function getEquipmentBonuses(equipped) {
  const bonuses = { attack: 0, defense: 0, maxHp: 0, maxMana: 0, hitBonus: 0 };
  Object.values(equipped).forEach(item => {
    if (!item) return;
    bonuses.attack   += item.bonusAttack   || 0;
    bonuses.defense  += item.bonusDefense  || 0;
    bonuses.maxHp    += item.bonusMaxHp    || 0;
    bonuses.maxMana  += item.bonusMana     || 0;
    bonuses.hitBonus += item.bonusHitBonus || 0;
  });
  return bonuses;
}

export function getSellValue(item) {
  return item.sellValue || Math.round((item.bonusAttack || 0) * 4 + (item.bonusDefense || 0) * 4 + (item.bonusMaxHp || 0) + (item.bonusMana || 0) * 6 + (item.bonusHitBonus || 0) * 8);
}

export function rollTreasure(floor) {
  // Returns { type: 'gold'|'item'|'heal', value, item? }
  const roll = Math.random();
  if (roll < 0.35) {
    // Gold
    const amount = 15 + floor * 8 + rollDie(20);
    return { type: 'gold', value: amount };
  } else if (roll < 0.65) {
    // Heal
    const amount = 8 + floor * 2;
    return { type: 'heal', value: amount };
  } else {
    // Random item weighted by floor
    let pool;
    if (floor <= 2) pool = ALL_ITEMS.filter(i => ['common','uncommon'].includes(i.rarity));
    else if (floor <= 5) pool = ALL_ITEMS.filter(i => ['uncommon','rare'].includes(i.rarity));
    else pool = ALL_ITEMS.filter(i => ['rare','epic','legendary'].includes(i.rarity));
    const item = { ...pool[Math.floor(Math.random() * pool.length)] };
    return { type: 'item', value: 0, item };
  }
}
