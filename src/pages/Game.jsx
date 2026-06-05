import React, { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Package } from 'lucide-react';
import { createPageUrl } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CLASSES, RARITY_COLORS,
  ALL_CARDS, rollDie, getMonsterDeck, rollLoot, getEquipmentBonuses, getSellValue, rollTreasure
} from '../lib/gameData';
import {
  ATTACK_RESULT,
  formatDiceRolls,
  sumDice,
} from '../lib/combatRules';
import {
  createDoomTowerFloor,
  enterTowerCell,
  getReachableTowerCellIds,
  getTowerCell,
  TOWER_CELL_EVENT,
} from '../lib/towerMap';
import { PlayerAttackOverlay, EnemyAttackOverlay } from '../components/game/CombatOverlays.jsx';
import InventoryPanel from '../components/game/InventoryPanel';
import MerchantScreen from '../components/game/MerchantScreen';
import PlayerCard from '../components/game/PlayerCard';
import MonsterCardComponent from '../components/game/MonsterCard';
import PortraitToken from '../components/game/PortraitToken';
import TowerMap from '../components/game/TowerMap';
import { getHeroPortrait } from '../lib/portraitAssets';

const PHASE = { CLASS_SELECT:'class_select', MAP:'map', BATTLE:'battle', MERCHANT:'merchant', GAME_OVER:'game_over', VICTORY:'victory' };
const TURN  = { PLAYER:'player', ENEMY:'enemy' };

const CinzelFont = null;

function getClassSkills(classId) {
  return ALL_CARDS.filter(card => card.class === classId).map(card => ({ ...card }));
}

function getSkillCooldown(card) {
  if (typeof card.cooldown === 'number') return card.cooldown;
  if (card.special === 'draw2') return 2;
  if (card.special === 'draw') return 1;
  if (card.type === 'defense' || card.type === 'utility') return 0;
  if (card.cost <= 1) return 0;
  return Math.min(3, card.cost);
}

function reduceCooldowns(cooldowns) {
  return Object.fromEntries(
    Object.entries(cooldowns)
      .map(([skillId, turns]) => [skillId, Math.max(0, turns - 1)])
      .filter(([, turns]) => turns > 0)
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// ─── Reusable UI ─────────────────────────────────────────────────────────────

function CardView({ card, playable, cooldown = 0, onPlay }) {
  const typeColors = { attack: '#8b1a1a', defense: '#1a4a8b', buff: '#8b7a1a', debuff: '#4a1a8b', heal: '#1a8b4a', utility: '#1a8b4a' };
  const bg = typeColors[card.type] || '#3a3a3a';
  return (
    <motion.button
      onClick={playable ? onPlay : undefined}
      whileHover={playable ? { y: -10, scale: 1.06 } : {}}
      whileTap={playable ? { scale: 0.96 } : {}}
      className="relative flex flex-col items-center rounded-xl border-2 p-2 gap-1 w-24 select-none"
      style={{
        background: `linear-gradient(145deg, ${bg}cc, ${bg}55)`,
        borderColor: playable ? card.color : '#444',
        cursor: playable ? 'pointer' : 'default',
        opacity: playable ? 1 : 0.55,
        boxShadow: playable ? `0 0 12px ${card.color}44` : 'none',
      }}
    >
      <div className="absolute top-1 right-1 bg-blue-700 rounded-full w-5 h-5 text-[10px] font-bold text-white flex items-center justify-center">{card.cost}</div>
      <div className="text-2xl mt-1">{card.emoji}</div>
      <div className="text-[10px] font-bold text-stone-100 text-center leading-tight">{card.name}</div>
      <div className="text-[8px] text-stone-400 text-center leading-tight">{card.desc}</div>
      {card.needsHit && <div className="text-[8px] text-amber-400 font-bold">🎲 d20 to hit</div>}
      <div className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: card.color + '44', color: card.color }}>
        {card.type === 'attack' ? `⚔️ ${card.value}` : card.type === 'defense' ? `🛡️ ${card.value}` : card.type === 'debuff' ? `☠️ ${card.value}/t` : `✨`}
      </div>
      {cooldown > 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-black/75 text-center">
          <div className="text-xl font-black text-amber-300">{cooldown}</div>
          <div className="text-[9px] uppercase tracking-wider text-stone-400">Cooldown</div>
        </div>
      )}
    </motion.button>
  );
}



function LootScreen({ lootItem, onTake, onSkip }) {
  const rc = RARITY_COLORS[lootItem.rarity] || '#aaa';
  return (
    <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.7, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="flex flex-col items-center gap-5 p-8 rounded-2xl border-2 text-center"
        style={{ background: '#100820', borderColor: rc, boxShadow: `0 0 40px ${rc}66`, maxWidth: 320 }}>
        <div className="text-xs text-stone-500 uppercase tracking-widest">Item Found!</div>
        <motion.div animate={{ rotate: [0, 5, -5, 0], y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-7xl">{lootItem.emoji}</motion.div>
        <div>
          <div className="text-2xl font-bold" style={{ color: rc, fontFamily: "'Cinzel',serif" }}>{lootItem.name}</div>
          <div className="text-xs uppercase tracking-wider mt-1" style={{ color: rc }}>{lootItem.rarity}</div>
          <div className="text-sm text-stone-300 mt-2">{lootItem.desc}</div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => onTake(lootItem)} className="px-6 py-2 rounded-lg text-sm font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${rc}88, ${rc}55)`, border: `1px solid ${rc}` }}>
            Take Item
          </button>
          <button onClick={() => onSkip(lootItem)} className="px-6 py-2 rounded-lg text-sm text-stone-400 border border-stone-700 hover:border-stone-500 transition-all">
            Leave
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Game Component ──────────────────────────────────────────────────────

export default function Game() {
  const [phase, setPhase]               = useState(PHASE.CLASS_SELECT);
  const [playerClass, setPlayerClass]   = useState(null);
  const [player, setPlayer]             = useState(null);
  const [equipped, setEquipped]         = useState({ weapon: null, armor: null, accessory: null });
  const [inventory, setInventory]       = useState([]);
  const [hand, setHand]                 = useState([]);
  const [cooldowns, setCooldowns]       = useState({});
  const [monsters, setMonsters]         = useState([]);
  const [monsterIdx, setMonsterIdx]     = useState(0);
  const [floor, setFloor]               = useState(1);
  const [towerState, setTowerState]     = useState(() => createDoomTowerFloor(1));
  const [gold, setGold]                 = useState(0);
  const [turn, setTurn]                 = useState(TURN.PLAYER);
  const [log, setLog]                   = useState([]);
  const [playerBlock, setPlayerBlock]   = useState(0);
  const [enemyBlock, setEnemyBlock]     = useState(0);
  const [enemyPoison, setEnemyPoison]   = useState(0);
  const [playerBuff, setPlayerBuff]     = useState(0);
  const [enemySlowed, setEnemySlowed]   = useState(false);
  const [enemyConfused, setEnemyConfused] = useState(false);
  const [playerHurt, setPlayerHurt]     = useState(false);
  const [enemyHurt, setEnemyHurt]       = useState(false);
  const [pendingLoot, setPendingLoot]   = useState(null);
  const [showInventory, setShowInventory] = useState(false);
  const [animMsg, setAnimMsg]           = useState(null);
  // Combat overlays
  const [playerAttackOverlay, setPlayerAttackOverlay] = useState(null);
  const [enemyAttackOverlay, setEnemyAttackOverlay]   = useState(null);
  // Pending combat context to resolve after visual dice settle.
  const [pendingAttackResult, setPendingAttackResult] = useState(null);
  const [pendingEnemyResult, setPendingEnemyResult]   = useState(null);

  const [bestFloor, setBestFloor] = useState(() => parseInt(localStorage.getItem('dndBestFloor') || '1', 10));
  const [bestGold, setBestGold]   = useState(() => parseInt(localStorage.getItem('dndBestGold')  || '0', 10));

  // Refs so callbacks always see latest state without stale closures
  const inventoryRef = useRef([]);
  const equippedRef  = useRef({ weapon: null, armor: null, accessory: null });
  inventoryRef.current = inventory;
  equippedRef.current  = equipped;

  const addLog = useCallback((msg, color = '#c0b898') => {
    setLog(l => [{ msg, color, id: Date.now() + Math.random() }, ...l].slice(0, 12));
  }, []);

  const showMsg = useCallback((msg, color) => {
    setAnimMsg({ msg, color });
    setTimeout(() => setAnimMsg(null), 900);
  }, []);

  function getPlayerStats(p, eq) {
    const b = getEquipmentBonuses(eq || equipped);
    return {
      attack:   (p.attack   || 0) + b.attack,
      defense:  (p.defense  || 0) + b.defense,
      maxHp:    (p.maxHp    || 0) + b.maxHp,
      maxMana:  (p.maxMana  || 0) + b.maxMana,
      hitBonus: (p.hitBonus || 0) + b.hitBonus,
    };
  }

  function startGame(cls) {
    const p = { ...cls };
    setPlayer(p); setPlayerClass(cls);
    setHand(getClassSkills(cls.id));
    setCooldowns({});
    setFloor(1); setGold(0); setLog([]);
    setTowerState(createDoomTowerFloor(1));
    setEquipped({ weapon: null, armor: null, accessory: null });
    setInventory([]);
    setPhase(PHASE.MAP);
  }

  function startBattle(isBoss = false) {
    const mList = getMonsterDeck(floor);
    // If boss node, ensure a boss appears
    const finalList = isBoss
      ? mList.some(m => m.boss) ? mList : [{ ...mList[0], boss: true, name: mList[0].name + ' (Champion)', attack: mList[0].attack + 3, hp: mList[0].maxHp + 10, maxHp: mList[0].maxHp + 10 }]
      : mList.filter(m => !m.boss).slice(0, 2).concat([]).length > 0
        ? mList.filter(m => !m.boss).slice(0, Math.max(1, mList.filter(m => !m.boss).length))
        : mList.slice(0, 1);
    setMonsters(finalList.length ? finalList : mList.slice(0, 1));
    setMonsterIdx(0);
    setTurn(TURN.PLAYER);
    setPlayerBlock(0); setEnemyBlock(0); setEnemyPoison(0);
    setPlayerBuff(0); setEnemySlowed(false); setEnemyConfused(false);
    setHand(getClassSkills(playerClass?.id || player?.id));
    setPhase(PHASE.BATTLE);
    const first = (finalList.length ? finalList : mList)[0];
    addLog(`⚔️ Floor ${floor} — ${first.name} appears! AC ${first.ac}`, '#e08040');
  }

  function handleTreasure() {
    const treasure = rollTreasure(floor);
    if (treasure.type === 'gold') {
      setGold(g => g + treasure.value);
      addLog(`💰 Treasure! Found ${treasure.value} gold!`, '#ffd700');
      showMsg(`+${treasure.value} 🪙`, '#ffd700');
      setPhase(PHASE.MAP);
    } else if (treasure.type === 'heal') {
      setPlayer(p => ({ ...p, hp: Math.min(p.maxHp + getEquipmentBonuses(equippedRef.current).maxHp, p.hp + treasure.value) }));
      addLog(`💚 Treasure! Healed ${treasure.value} HP!`, '#40ff80');
      showMsg(`+${treasure.value} ❤️`, '#40ff80');
      setPhase(PHASE.MAP);
    } else if (treasure.type === 'item' && treasure.item) {
      setPendingLoot({ ...treasure.item, _afterPhase: PHASE.MAP });
    } else {
      setPhase(PHASE.MAP);
    }
  }

  function playCard(cardIdx) {
    if (turn !== TURN.PLAYER) return;
    const card = hand[cardIdx];
    if (!card) return;
    if ((cooldowns[card.id] || 0) > 0) return;
    if (player.mana < card.cost) return;

    const newPlayer  = { ...player, mana: player.mana - card.cost };
    const monster    = monsters[monsterIdx];
    if (!monster) return;

    let newMon          = { ...monster };
    let newMonsters     = [...monsters];
    let newBlock        = playerBlock;
    let newEnemyBlock   = enemyBlock;
    let newPBuff        = playerBuff;
    let newEnemyPoison  = enemyPoison;
    let newEnemySlowed  = enemySlowed;
    let newEnemyConfused = enemyConfused;

    setPlayer(newPlayer);

    // Always use ref for latest equipped state (avoids stale closure)
    const currentEquipped = equippedRef.current;
    const eqBonuses = getEquipmentBonuses(currentEquipped);
    const skillCooldown = getSkillCooldown(card);
    if (skillCooldown > 0) {
      setCooldowns(prev => ({ ...prev, [card.id]: skillCooldown }));
    }

    if (card.type === 'attack') {
      const hitBonus = (player.hitBonus || 0) + eqBonuses.hitBonus;
      const hitDiceCount = card.needsHit && playerClass?.id === 'rogue' ? 2 : 1;
      const damageModifier = eqBonuses.attack + newPBuff;

      setPlayerAttackOverlay({
        cardName: card.name,
        cardValue: card.value,
        needsHit: card.needsHit,
        hitDiceCount,
        hitBonus,
        targetArmorClass: monster.ac,
        damageModifier,
        blockedByTarget: card.id === 'shadowstep' ? 0 : newEnemyBlock,
      });
      setPendingAttackResult({
        card,
        newPlayer,
        monster,
        monstersSnapshot: [...monsters],
        enemyBlock: newEnemyBlock,
        enemyPoison: newEnemyPoison,
        enemySlowed: newEnemySlowed,
        enemyConfused: newEnemyConfused,
        playerBuff: newPBuff,
        eqBonuses,
        hitBonus,
      });
      return;
    } else if (card.type === 'defense') {
      const eqDefBonus = eqBonuses.defense;
      const total = card.value + eqDefBonus;
      newBlock = playerBlock + total;
      addLog(`🛡️ ${card.name}: +${card.value}${eqDefBonus>0?`+${eqDefBonus}🛡️`:''} = ${total} block`, '#6090c0');
      showMsg(`+${total} 🛡️`, '#4080ff');
      if (card.special === 'draw') {
        newPlayer.mana = Math.min(newPlayer.mana + 1, newPlayer.maxMana + eqBonuses.maxMana);
        setPlayer(newPlayer);
        addLog(`✨ ${card.name} refreshes 1 mana.`, '#c0a0ff');
      }
    } else if (card.type === 'buff') {
      newPBuff = card.value;
      addLog(`📯 ${card.name}! +${card.value} bonus next hit`, '#ffd700');
      showMsg(`+${card.value} ⚔️`, '#ffd700');
      if (card.special === 'draw') {
        newPlayer.mana = Math.min(newPlayer.mana + 1, newPlayer.maxMana + eqBonuses.maxMana);
        setPlayer(newPlayer);
        addLog('🃏 Tempo restored 1 mana.', '#c0a0ff');
      }
    } else if (card.type === 'heal') {
      const healAmt = card.value;
      const maxHp = newPlayer.maxHp + eqBonuses.maxHp;
      newPlayer.hp = Math.min(newPlayer.hp + healAmt, maxHp);
      setPlayer(newPlayer);
      addLog(`💚 ${card.name}: +${healAmt} HP restored`, '#40ff80');
      showMsg(`+${healAmt} ❤️`, '#40ff80');
    } else if (card.type === 'debuff') {
      newEnemyPoison = enemyPoison + card.value;
      addLog(`☠️ ${card.name}: ${newEnemyPoison}/turn poison applied!`, '#80c020');
      if (card.special === 'slow') newEnemySlowed = true;
      if (card.special === 'stun') newEnemyConfused = true;
    } else if (card.type === 'utility') {
      if (card.id === 'pickpocket') {
        newPlayer.mana = Math.min(newPlayer.mana + 2, newPlayer.maxMana + eqBonuses.maxMana);
        setPlayer(newPlayer);
        addLog('💰 Stole 2 mana!', '#ffd700');
      }
      if (card.special === 'draw2') {
        newPlayer.mana = Math.min(newPlayer.mana + 2, newPlayer.maxMana + eqBonuses.maxMana);
        setPlayer(newPlayer);
        addLog(`🎴 ${card.name}: restored 2 mana.`, '#c0a0ff');
      }
    }

    newMonsters[monsterIdx] = newMon;
    setMonsters(newMonsters);
    setPlayerBlock(newBlock);
    setEnemyBlock(newEnemyBlock);
    setPlayerBuff(newPBuff);
    setEnemyPoison(newEnemyPoison);
    setEnemySlowed(newEnemySlowed);
    setEnemyConfused(newEnemyConfused);
    if (newMon.hp <= 0) handleMonsterDeath(newMon, newMonsters, newPlayer);
  }

  function dismissPlayerAttack(rollResult = {}) {
    const r = pendingAttackResult;
    if (!r) { setPlayerAttackOverlay(null); return; }

    setPlayerAttackOverlay(null);
    setPendingAttackResult(null);

    const {
      card,
      newPlayer,
      monster,
      monstersSnapshot,
      enemyBlock: previousEnemyBlock,
      enemyPoison: nextEnemyPoison,
      enemySlowed: previousEnemySlowed,
      enemyConfused: previousEnemyConfused,
      playerBuff: usedPlayerBuff,
      eqBonuses,
      hitBonus,
    } = r;

    const isMiss = rollResult.result === ATTACK_RESULT.MISS;
    const isCrit = rollResult.result === ATTACK_RESULT.CRIT;
    const diceTotal = rollResult.diceTotal || sumDice(rollResult.damageRolls);
    const damageModifier = eqBonuses.attack + usedPlayerBuff;
    const rawAttack = diceTotal + damageModifier;
    const blockUsed = card.id === 'shadowstep' ? 0 : Math.min(previousEnemyBlock, rawAttack);
    const finalDamage = isMiss ? 0 : Math.max(0, rawAttack - blockUsed);
    const newMon = { ...monster, hp: Math.max(0, monster.hp - finalDamage) };
    const newMonsters = [...monstersSnapshot];
    let resolvedPlayer = { ...newPlayer };
    let nextEnemyBlock = card.id === 'shadowstep' ? previousEnemyBlock : Math.max(0, previousEnemyBlock - rawAttack);
    let nextEnemySlowed = previousEnemySlowed;
    let nextEnemyConfused = previousEnemyConfused;

    if (!isMiss) {
      if (card.special === 'stun' || card.id === 'shield_bash' || card.id === 'frost_nova') nextEnemyConfused = true;
      if (card.special === 'slow' || card.id === 'ice_lance') nextEnemySlowed = true;
      if (card.special === 'lifesteal3') {
        resolvedPlayer.hp = Math.min(resolvedPlayer.hp + 3, resolvedPlayer.maxHp + eqBonuses.maxHp);
        addLog('Drained 3 HP.', '#ff6080');
      }
      if (card.special === 'lifesteal5') {
        resolvedPlayer.hp = Math.min(resolvedPlayer.hp + 5, resolvedPlayer.maxHp + eqBonuses.maxHp);
        addLog('Drained 5 HP.', '#ff6080');
      }
    }

    const hitText = card.needsHit
      ? `d20 ${formatDiceRolls(rollResult.hitRolls)} + ${hitBonus}${isCrit ? ' critical' : ''}`
      : 'auto-hit';
    const damageText = isMiss
      ? `${card.name}: ${hitText} missed.`
      : `${card.name}: ${hitText}; d6 ${formatDiceRolls(rollResult.damageRolls)} = ${diceTotal}, final ${finalDamage} damage.`;
    addLog(damageText, isMiss ? '#ff6060' : isCrit ? '#ffd700' : card.color);

    newMonsters[monsterIdx] = newMon;
    setPlayer(resolvedPlayer);
    setMonsters(newMonsters);
    setEnemyBlock(nextEnemyBlock);
    setPlayerBuff(0);
    setEnemyPoison(nextEnemyPoison);
    setEnemySlowed(nextEnemySlowed);
    setEnemyConfused(nextEnemyConfused);

    if (!isMiss) { setEnemyHurt(true); setTimeout(() => setEnemyHurt(false), 400); }
    if (newMon.hp <= 0) handleMonsterDeath(newMon, newMonsters, resolvedPlayer);
  }

  function handleMonsterDeath(deadMon, allMonsters, p) {
    const reward = deadMon.reward + rollDie(6);
    const newGold = gold + reward;
    addLog(`💀 ${deadMon.name} defeated! +${reward} gold`, '#ffd700');
    showMsg(`+${reward} 🪙`, '#ffd700');
    setGold(newGold);

    const loot = rollLoot(deadMon.id);
    const nextIdx = monsterIdx + 1;

    if (nextIdx < allMonsters.length) {
      setMonsterIdx(nextIdx);
      setEnemyBlock(0); setEnemyPoison(0); setEnemySlowed(false); setEnemyConfused(false);
      addLog(`👾 ${allMonsters[nextIdx].name} appears! AC ${allMonsters[nextIdx].ac}`, '#e08040');
      if (loot) setPendingLoot({ ...loot, _afterPhase: PHASE.BATTLE });
    } else {
      // All monsters on this node defeated — return to map
      setGold(newGold);
      if (newGold > bestGold) { localStorage.setItem('dndBestGold', newGold); setBestGold(newGold); }
      if (floor > bestFloor) { localStorage.setItem('dndBestFloor', floor); setBestFloor(floor); }
      // Small HP regen per battle win
      setPlayer(prev => ({ ...prev, hp: Math.min(prev.maxHp + getEquipmentBonuses(equippedRef.current).maxHp, prev.hp + 3) }));
      setPendingLoot(loot ? { ...loot, _afterPhase: PHASE.MAP } : null);
      if (!loot) setPhase(PHASE.MAP);
    }
  }

  function takeLoot(item) {
    const afterPhase = item._afterPhase || PHASE.MAP;
    const cleanItem = { ...item };
    delete cleanItem._afterPhase;
    if (cleanItem.id && cleanItem.name) {
      setInventory(inv => [...inv, cleanItem]);
    }
    setPendingLoot(null);
    setPhase(afterPhase);
  }

  function skipLoot(item) {
    const afterPhase = item._afterPhase || PHASE.MAP;
    setPendingLoot(null);
    setPhase(afterPhase);
  }

  function equipItem(item, invIdx) {
    // Always read from refs to avoid stale closure
    const currentEquipped  = equippedRef.current;
    const currentInventory = inventoryRef.current;

    const slot = item.slot;
    const oldItem = currentEquipped[slot];
    const newEquipped = { ...currentEquipped, [slot]: item };

    // Remove item from bag by index, return old equipped item to bag if any
    const newInventory = currentInventory.filter((_, i) => i !== invIdx);
    if (oldItem) newInventory.push(oldItem);

    const oldB = getEquipmentBonuses(currentEquipped);
    const newB = getEquipmentBonuses(newEquipped);
    const hpDelta   = newB.maxHp   - oldB.maxHp;
    const manaDelta = newB.maxMana - oldB.maxMana;

    setEquipped(newEquipped);
    setInventory(newInventory);
    setPlayer(p => ({
      ...p,
      hp:   Math.min(p.hp   + hpDelta,   p.maxHp   + newB.maxHp),
      mana: Math.min(p.mana + manaDelta,  p.maxMana + newB.maxMana),
    }));
    addLog(`🎒 Equipped ${item.name}! ${item.desc}`, RARITY_COLORS[item.rarity]);
  }

  function unequipItem(slot) {
    const currentEquipped = equippedRef.current;
    const item = currentEquipped[slot];
    if (!item) return;
    const newEquipped = { ...currentEquipped, [slot]: null };
    setEquipped(newEquipped);
    setInventory(inv => [...inv, item]);
    const oldB = getEquipmentBonuses(currentEquipped);
    const newB = getEquipmentBonuses(newEquipped);
    setPlayer(p => ({
      ...p,
      hp:   Math.min(p.hp,   p.maxHp   + newB.maxHp),
      mana: Math.min(p.mana, p.maxMana  + newB.maxMana),
    }));
    addLog(`📦 Unequipped ${item.name}`, '#888');
  }

  function sellItem(item, invIdx) {
    const val = getSellValue(item);
    setInventory(inv => inv.filter((_, i) => i !== invIdx));
    setGold(g => g + val);
    addLog(`🪙 Sold ${item.name} for ${val} gold`, '#ffd700');
    showMsg(`+${val} 🪙`, '#ffd700');
  }

  function endTurn() {
    if (turn !== TURN.PLAYER) return;
    const restoredPlayer = { ...player, mana: player.maxMana + getEquipmentBonuses(equipped).maxMana };
    setCooldowns(prev => reduceCooldowns(prev));
    setPlayer(restoredPlayer);
    setPlayerBlock(0); setPlayerBuff(0);
    setTurn(TURN.ENEMY);
    setTimeout(() => doEnemyTurn(restoredPlayer), 500);
  }

  function doEnemyTurn(currentPlayer) {
    const monster = monsters[monsterIdx];
    if (!monster || monster.hp <= 0) { setTurn(TURN.PLAYER); return; }

    let newPlayer   = { ...currentPlayer };
    let newMon      = { ...monster };
    let newMonsters = [...monsters];
    let newEnemyPoison = enemyPoison;

    // Poison tick
    if (newEnemyPoison > 0) {
      newMon.hp = Math.max(0, newMon.hp - newEnemyPoison);
      addLog(`☠️ Poison deals ${newEnemyPoison} to ${monster.name}`, '#80c020');
      newEnemyPoison = Math.max(0, newEnemyPoison - 1);
      if (newMon.hp <= 0) {
        newMonsters[monsterIdx] = newMon;
        setMonsters(newMonsters); setEnemyPoison(newEnemyPoison);
        handleMonsterDeath(newMon, newMonsters, newPlayer);
        setTurn(TURN.PLAYER); return;
      }
    }

    // Monster regen
    if (monster.regen) {
      newMon.hp = Math.min(newMon.maxHp, newMon.hp + monster.regen);
      addLog(`💚 ${monster.name} regenerates ${monster.regen} HP`, '#40c040');
    }
    newMonsters[monsterIdx] = newMon;
    setMonsters(newMonsters);
    setEnemyPoison(newEnemyPoison);

    if (enemyConfused) {
      addLog(`😵 ${monster.name} is stunned and loses its turn!`, '#ffd700');
      setEnemyConfused(false); setEnemySlowed(false);
      setTurn(TURN.PLAYER); return;
    }

    // Enemy attack — roll d20 vs player AC (includes armor defense bonus)
    const playerDefense = (currentPlayer.defense || 0) + getEquipmentBonuses(equippedRef.current).defense;
    const playerAC = 10 + playerDefense;

    setEnemyAttackOverlay({
      monster,
      playerAC,
      hitBonus: 2,
      enemySlowed,
      playerBlock,
    });
    setPendingEnemyResult({
      newPlayer,
      newMon,
      newMonsters,
      playerAC,
      enemySlowed,
    });
  }

  function dismissEnemyAttack(rollResult = {}) {
    const r = pendingEnemyResult;
    if (!r) { setEnemyAttackOverlay(null); return; }
    setEnemyAttackOverlay(null);
    setPendingEnemyResult(null);

    const { newPlayer, newMon, newMonsters, enemySlowed: wasEnemySlowed } = r;
    const isMiss = rollResult.result === ATTACK_RESULT.MISS;
    const diceTotal = rollResult.diceTotal || sumDice(rollResult.damageRolls);
    const slowedPenalty = wasEnemySlowed ? 2 : 0;
    const rawAttack = isMiss ? 0 : Math.max(0, diceTotal - slowedPenalty);
    const blocked = Math.min(playerBlock, rawAttack);
    const dmg = Math.max(0, rawAttack - playerBlock);
    const resolvedPlayer = { ...newPlayer, hp: Math.max(0, newPlayer.hp - dmg) };
    const resolvedMonster = { ...newMon };
    const hits = !isMiss;

    if (hits && resolvedMonster.lifesteal && dmg > 0) {
      resolvedMonster.hp = Math.min(resolvedMonster.maxHp, resolvedMonster.hp + resolvedMonster.lifesteal);
      addLog(`${resolvedMonster.name} heals ${resolvedMonster.lifesteal} from lifesteal.`, '#ff6080');
    }

    addLog(hits
      ? `${resolvedMonster.name} ${rollResult.isCrit ? 'critically ' : ''}hits for ${dmg} damage${blocked > 0 ? ` (${blocked} blocked)` : ''}.`
      : `${resolvedMonster.name} misses you.`,
      hits ? (resolvedMonster.color || '#e05020') : '#888');

    newMonsters[monsterIdx] = resolvedMonster;
    setMonsters(newMonsters);
    setEnemyConfused(false); setEnemySlowed(false);
    if (hits && dmg > 0) { setPlayerHurt(true); setTimeout(() => setPlayerHurt(false), 400); }
    if (resolvedPlayer.hp <= 0) {
      setPlayer(resolvedPlayer);
      if (gold > bestGold) { localStorage.setItem('dndBestGold', gold); setBestGold(gold); }
      if (floor > bestFloor) { localStorage.setItem('dndBestFloor', floor); setBestFloor(floor); }
      setPhase(PHASE.GAME_OVER); return;
    }
    setPlayer(resolvedPlayer);
    setTurn(TURN.PLAYER);
  }
  const currentMonster = monsters[monsterIdx];
  const stats = player ? getPlayerStats(player) : null;

  // ── Inventory panel — available in ALL phases when player exists ─────────
  const inventoryPanel = player && (
    <InventoryPanel
      open={showInventory}
      onClose={() => setShowInventory(false)}
      inventory={inventory}
      equipped={equipped}
      onEquip={equipItem}
      onUnequip={unequipItem}
      onSell={sellItem}
      player={player}
      playerClass={playerClass}
    />
  );

  // ─── CLASS SELECT ──────────────────────────────────────────────────────────
  if (phase === PHASE.CLASS_SELECT) return (
    <div className="min-h-screen text-stone-300" style={{ background: '#0a080e' }}>
      <div className="fixed inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%,#1a1028 0%,#0a080e 70%)' }} />
      <header className="relative z-10 px-4 py-3 border-b border-stone-900/60 bg-black/30">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link to={createPageUrl('Home')} className="flex items-center gap-2 text-stone-500 hover:text-amber-500 text-sm"><ArrowLeft className="w-4 h-4" /><span>Back</span></Link>
          <div className="flex gap-4 text-xs text-stone-600"><span>🏆 Best Floor: {bestFloor}</span><span>🪙 Best Gold: {bestGold}</span></div>
        </div>
      </header>
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-10 text-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-5xl text-stone-100 mb-1 tracking-widest" style={{ fontFamily: "'Cinzel',serif", textShadow: '0 0 40px rgba(150,80,255,0.4)' }}>Dungeon & Dice</h1>
          <p className="text-stone-500 mb-8 text-sm">D&D card battle · Roll d20 to hit · Damage dice · Find loot · Equip gear · 8 floors</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {CLASSES.map((cls, i) => (
            <motion.button
              key={cls.id}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.12 }}
              whileHover={{ scale: 1.03, y: -6 }} whileTap={{ scale: 0.97 }}
              onClick={() => startGame(cls)}
              className="relative flex flex-col rounded-2xl border-2 cursor-pointer overflow-hidden text-left"
              style={{
                background: `linear-gradient(160deg, ${cls.color}18 0%, #120820 60%, #080510 100%)`,
                borderColor: cls.color,
                boxShadow: `0 0 30px ${cls.color}33, inset 0 0 40px rgba(0,0,0,0.5)`,
              }}
            >
              {/* Corner ornaments */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: cls.color + '88' }} />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: cls.color + '88' }} />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: cls.color + '88' }} />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: cls.color + '88' }} />

              {/* Art area */}
              <div className="relative flex items-center justify-center py-8" style={{ minHeight: 140 }}>
                <div className="absolute inset-0 opacity-15" style={{ background: `radial-gradient(ellipse at 50% 60%, ${cls.color} 0%, transparent 70%)` }} />
                <PortraitToken
                  src={getHeroPortrait(cls.id)}
                  alt={cls.name}
                  fallback={cls.emoji}
                  borderColor={cls.color}
                  className="h-28 w-28"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3 + i * 0.5, ease: 'easeInOut' }}
                />
                {/* Halo ring for visual richness */}
                <motion.div
                  animate={{ scale: [0.9, 1.05, 0.9], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="absolute w-24 h-24 rounded-full border"
                  style={{ borderColor: cls.color + '66' }}
                />
              </div>

              {/* Info */}
              <div className="px-5 pb-5 space-y-3">
                <div>
                  <div className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: cls.color }}>Choose Class</div>
                  <div className="text-2xl font-bold text-stone-100" style={{ fontFamily: "'Cinzel',serif" }}>{cls.name}</div>
                  <div className="text-xs text-stone-400 mt-1">{cls.desc}</div>
                </div>

                {/* Stat bars */}
                <div className="space-y-1.5">
                  {[
                    { label: '❤️ HP',     value: cls.maxHp,    max: 40 },
                    { label: '⚔️ ATK',    value: cls.attack,   max: 10 },
                    { label: '💧 Mana',   value: cls.maxMana,  max: 8 },
                    { label: '🎲 +Hit',   value: cls.hitBonus, max: 6 },
                  ].map(({ label, value, max }) => (
                    <div key={label}>
                      <div className="flex justify-between text-[9px] text-stone-400 mb-0.5">
                        <span>{label}</span>
                        <span style={{ color: cls.color }}>{value}</span>
                      </div>
                      <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(value / max) * 100}%`, background: cls.color, boxShadow: `0 0 6px ${cls.color}` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-1 text-center text-xs font-bold py-2 rounded-lg" style={{ background: cls.color + '22', color: cls.color, border: `1px solid ${cls.color}44` }}>
                  Select {cls.name} →
                </div>
              </div>
            </motion.button>
          ))}
        </div>
        <div className="text-xs text-stone-600 italic">Attack cards roll d20 vs AC · Damage = multiple d6 dice · Spells auto-hit · Gear drops from enemies</div>
      </div>
      {CinzelFont}
    </div>
  );

  function buyFromMerchant(item, price) {
    if (gold < price) return;
    setGold(g => g - price);
    setEquipped(prevEquipped => {
      const oldItem = prevEquipped[item.slot];
      const newEquipped = { ...prevEquipped, [item.slot]: item };
      if (oldItem) setInventory(inv => [...inv, oldItem]);
      const oldB = getEquipmentBonuses(prevEquipped);
      const newB = getEquipmentBonuses(newEquipped);
      const hpDelta  = newB.maxHp   - oldB.maxHp;
      const manaDelta = newB.maxMana - oldB.maxMana;
      setPlayer(p => ({
        ...p,
        hp:   Math.min(p.hp   + hpDelta,   p.maxHp   + newB.maxHp),
        mana: Math.min(p.mana + manaDelta,  p.maxMana + newB.maxMana),
      }));
      addLog(`🛒 Bought & equipped ${item.name}! ${item.desc}`, RARITY_COLORS[item.rarity]);
      return newEquipped;
    });
  }

  function completeFloor() {
    if (floor >= 8) {
      if (gold > bestGold) { localStorage.setItem('dndBestGold', gold); setBestGold(gold); }
      localStorage.setItem('dndBestFloor', '8'); setBestFloor(8);
      setPhase(PHASE.VICTORY);
      return;
    }

    const nextFloor = floor + 1;
    if (nextFloor > bestFloor) {
      localStorage.setItem('dndBestFloor', String(nextFloor));
      setBestFloor(nextFloor);
    }

    setFloor(nextFloor);
    setTowerState(createDoomTowerFloor(nextFloor));
    setPlayer(prev => ({ ...prev, hp: Math.min(prev.maxHp + getEquipmentBonuses(equippedRef.current).maxHp, prev.hp + 5) }));
    addLog(`Floor ${floor} complete. Restored 5 HP and descended to floor ${nextFloor}.`, '#ffd700');
    setPhase(PHASE.MAP);
  }

  function handleEnterTowerCell(cellId) {
    const reachable = new Set(getReachableTowerCellIds(towerState));
    if (!reachable.has(cellId)) return;

    const cell = getTowerCell(towerState, cellId);
    if (!cell) return;

    const wasVisited = towerState.visitedIds.includes(cellId);
    setTowerState(prev => enterTowerCell(prev, cellId));

    if (cell.event === TOWER_CELL_EVENT.GATE) {
      completeFloor();
      return;
    }

    if (wasVisited && cell.event !== TOWER_CELL_EVENT.MERCHANT) {
      setPhase(PHASE.MAP);
      return;
    }

    if (cell.event === TOWER_CELL_EVENT.BATTLE) {
      startBattle(false);
      return;
    }

    if (cell.event === TOWER_CELL_EVENT.MERCHANT) {
      setPhase(PHASE.MERCHANT);
      return;
    }

    if (cell.event === TOWER_CELL_EVENT.TREASURE) {
      handleTreasure();
    }
  }

  // ─── MAP ───────────────────────────────────────────────────────────────────
  if (phase === PHASE.MAP && player) return (
    <>
      <TowerMap
        towerState={towerState}
        floor={floor}
        playerHp={player.hp}
        playerMaxHp={player.maxHp + getEquipmentBonuses(equipped).maxHp}
        gold={gold}
        onEnterCell={handleEnterTowerCell}
        onOpenInventory={() => setShowInventory(true)}
        inventoryCount={inventory.length}
        onAbandon={() => setPhase(PHASE.CLASS_SELECT)}
      />
      {/* Loot screen from treasure chests */}
      <AnimatePresence>{pendingLoot && <LootScreen lootItem={pendingLoot} onTake={takeLoot} onSkip={skipLoot} />}</AnimatePresence>
      {inventoryPanel}
      {CinzelFont}
    </>
  );

  // ─── MERCHANT ──────────────────────────────────────────────────────────────
  if (phase === PHASE.MERCHANT && player) return (
    <>
      <MerchantScreen
        floor={floor}
        gold={gold}
        equipped={equipped}
        inventory={inventory}
        onBuy={buyFromMerchant}
        onLeave={() => setPhase(PHASE.MAP)}
      />
      {inventoryPanel}
    </>
  );

  // ─── BATTLE ───────────────────────────────────────────────────────────────
  if (phase === PHASE.BATTLE && player && currentMonster) return (
    <div className="min-h-screen text-stone-300 overflow-x-hidden" style={{ background: '#0a080e' }}>
      <div className="fixed inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%,#1a1028 0%,#0a080e 70%)' }} />

      {/* Combat overlays */}
      <AnimatePresence>{playerAttackOverlay && <PlayerAttackOverlay data={playerAttackOverlay} onDone={dismissPlayerAttack} />}</AnimatePresence>
      <AnimatePresence>{enemyAttackOverlay  && <EnemyAttackOverlay  data={enemyAttackOverlay}  onDone={dismissEnemyAttack}  />}</AnimatePresence>

      {/* Loot */}
      <AnimatePresence>{pendingLoot && <LootScreen lootItem={pendingLoot} onTake={takeLoot} onSkip={skipLoot} />}</AnimatePresence>

      {/* Inventory */}
      {inventoryPanel}

      {/* Floating message */}
      <AnimatePresence>{animMsg && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-30 text-2xl font-bold pointer-events-none"
          style={{ color: animMsg.color, textShadow: `0 0 20px ${animMsg.color}`, fontFamily: "'Cinzel',serif" }}>
          {animMsg.msg}
        </motion.div>
      )}</AnimatePresence>

      <header className="relative z-10 px-4 py-2 border-b border-stone-900/60 bg-black/30">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { if (window.confirm('Retreat to map? Combat will be abandoned.')) setPhase(PHASE.MAP); }}
              className="flex items-center gap-1.5 text-stone-500 hover:text-red-400 text-xs transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Retreat
            </button>
            <span className="text-stone-700">|</span>
            <span className="text-xs text-stone-600 uppercase">Floor</span>
            <span className="text-amber-400 font-bold" style={{ fontFamily: "'Cinzel',serif" }}>{floor}/8</span>
            <span className="text-xs text-stone-600">🪙{gold}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-500">Skills {hand.length}</span>
            <span className={`text-xs font-bold ${turn === TURN.PLAYER ? 'text-green-400' : 'text-red-400'}`}>
              {turn === TURN.PLAYER ? '✅ Your Turn' : '⏳ Enemy Turn'}
            </span>
            <button onClick={() => setShowInventory(true)} className="flex items-center gap-1 text-xs px-2 py-1 rounded border border-stone-700 hover:border-amber-500 transition-colors">
              <Package className="w-3 h-3" /> Bag ({inventory.length})
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto px-3 py-4 space-y-4">
        {/* Battlefield */}
        <div className="grid grid-cols-2 gap-4">
          {/* Player */}
          <PlayerCard
            playerClass={playerClass}
            player={player}
            playerBlock={playerBlock}
            playerBuff={playerBuff}
            equipped={equipped}
            stats={stats}
            hurt={playerHurt}
            onOpenInventory={() => setShowInventory(true)}
          />

          {/* Enemy */}
          <div className="flex flex-col gap-1.5">
            <MonsterCardComponent
              monster={currentMonster}
              hurt={enemyHurt}
              statusBadges={<>
                {enemyBlock > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50">🛡️{enemyBlock}</span>}
                {enemyPoison > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-900/60 text-green-300 border border-green-700/50">☠️{enemyPoison}/t</span>}
                {enemySlowed && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-900/60 text-cyan-300 border border-cyan-700/50">🧊Slowed</span>}
                {enemyConfused && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-yellow-900/60 text-yellow-300 border border-yellow-700/50">😵Stunned</span>}
              </>}
            />
            {monsters.length > 1 && <div className="text-xs text-stone-600 text-center">{monsterIdx + 1}/{monsters.length} enemies</div>}
          </div>
        </div>

        {/* Hand */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-stone-500 uppercase tracking-wider">Skills ({hand.length})</div>
            {turn === TURN.PLAYER && (
              <button onClick={endTurn} className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg"
                style={{ background: 'linear-gradient(135deg,#7a3800,#c97020)', color: '#ffe0b0', boxShadow: '0 0 10px rgba(180,100,20,0.4)' }}>
                End Turn ⏩
              </button>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {hand.map((card, i) => (
              <CardView key={card.id + i} card={card}
                cooldown={cooldowns[card.id] || 0}
                playable={turn === TURN.PLAYER && player.mana >= card.cost && (cooldowns[card.id] || 0) === 0 && !playerAttackOverlay && !enemyAttackOverlay}
                onPlay={() => playCard(i)} />
            ))}
            {turn === TURN.ENEMY && <div className="text-stone-600 italic text-sm py-3 w-full text-center">⏳ Enemy is attacking...</div>}
          </div>
        </div>

        {/* Battle Log */}
        <div className="bg-black/40 rounded-xl border border-stone-800 p-3 h-28 overflow-y-auto">
          <div className="text-[10px] text-stone-600 uppercase tracking-wider mb-1">Battle Log</div>
          {log.map(e => <div key={e.id} className="text-xs leading-relaxed" style={{ color: e.color }}>{e.msg}</div>)}
        </div>
      </div>
      {CinzelFont}
    </div>
  );

  // ─── GAME OVER ─────────────────────────────────────────────────────────────
  if (phase === PHASE.GAME_OVER) return (
    <div className="min-h-screen text-stone-300 flex items-center justify-center" style={{ background: '#0a080e' }}>
      <div className="fixed inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%,#2a0808 0%,#0a080e 70%)' }} />
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 text-center space-y-5 max-w-sm mx-auto px-6">
        <div className="text-6xl">💀</div>
        <h2 className="text-4xl text-stone-100" style={{ fontFamily: "'Cinzel',serif" }}>Fallen</h2>
        <p className="text-stone-500">You were slain on Floor {floor}.</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-stone-900/60 border border-stone-700 rounded-lg p-3"><div className="text-stone-500 text-xs">Floor</div><div className="text-amber-400 text-2xl font-bold">{floor}</div></div>
          <div className="bg-stone-900/60 border border-stone-700 rounded-lg p-3"><div className="text-stone-500 text-xs">Gold</div><div className="text-yellow-400 text-2xl font-bold">🪙{gold}</div></div>
        </div>
        <div className="text-xs text-stone-600">Best: Floor {bestFloor} · 🪙{bestGold}</div>
        <button onClick={() => setPhase(PHASE.CLASS_SELECT)} className="flex items-center gap-2 px-8 py-3 text-amber-100 rounded-lg font-bold uppercase tracking-wider mx-auto" style={{ background: 'linear-gradient(135deg,#7a3800,#c97020)' }}>
          <RotateCcw className="w-4 h-4" /> New Run
        </button>
      </motion.div>
      {CinzelFont}
    </div>
  );

  // ─── VICTORY ───────────────────────────────────────────────────────────────
  if (phase === PHASE.VICTORY) return (
    <div className="min-h-screen text-stone-300 flex items-center justify-center" style={{ background: '#0a080e' }}>
      <div className="fixed inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%,#1a2808 0%,#0a080e 70%)' }} />
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 text-center space-y-5 max-w-sm mx-auto px-6">
        <motion.div animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 3 }}>
          <div className="text-7xl">👑</div>
        </motion.div>
        <h2 className="text-4xl text-amber-400" style={{ fontFamily: "'Cinzel',serif" }}>Victory!</h2>
        <p className="text-stone-400">All 8 floors conquered! The dungeon is yours.</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-stone-900/60 border border-amber-700/50 rounded-lg p-3"><div className="text-stone-500 text-xs">Floors</div><div className="text-amber-400 text-2xl font-bold">8/8</div></div>
          <div className="bg-stone-900/60 border border-amber-700/50 rounded-lg p-3"><div className="text-stone-500 text-xs">Gold</div><div className="text-yellow-400 text-2xl font-bold">🪙{gold}</div></div>
        </div>
        <button onClick={() => setPhase(PHASE.CLASS_SELECT)} className="flex items-center gap-2 px-8 py-3 text-amber-100 rounded-lg font-bold uppercase tracking-wider mx-auto" style={{ background: 'linear-gradient(135deg,#7a3800,#c97020)' }}>
          <RotateCcw className="w-4 h-4" /> Play Again
        </button>
      </motion.div>
      {CinzelFont}
    </div>
  );

  return null;
}
