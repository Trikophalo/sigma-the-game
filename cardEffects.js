// cardEffects.js
function getRandomCard() {
  if (!window.cards || window.cards.length === 0) {
    console.warn("⚠️ Keine Karten im globalen Pool gefunden.");
    return null;
  }

  const eligible = window.cards.filter(c => c.name !== 'Anomalie'); // sich selbst ausschließen
  const randomIndex = Math.floor(Math.random() * eligible.length);
  return eligible[randomIndex];
}


export const cardEffects = {
  damage(card, state) {
    let rawDamage = typeof card.basePower === 'number' ? card.basePower : card.power;
    if (card.name === 'Schwert') {
      if (state.player.swordBonus) rawDamage += state.player.swordBonus;
      if (state.player.isShieldmaster) {
        rawDamage -= 1;
        logMessage('⚠️ Schildmeister: Schwert macht 1 weniger Schaden.', 'system');
      }
    }
    let damageDealt = applyDamageBonuses(rawDamage);
    if (state.player.critChance && Math.random() < state.player.critChance) {
      const critBonus = Math.floor(damageDealt * 0.5);
      damageDealt += critBonus;
      logMessage(`💥 Kritischer Treffer! Schaden um +${critBonus} erhöht!`, 'player');
    }

    let remainingDamage = 0;
    if (state.currentEnemy.minions?.length > 0) {
      const target = state.currentEnemy.minions[0];
      target.health -= damageDealt;
      remainingDamage = damageDealt;
      logMessage(`💀 ${target.name} erleidet ${damageDealt} Schaden.`, 'enemy');
      if (target.health <= 0) {
        logMessage(`${target.name} wurde zerstört!`, 'enemy');
        state.currentEnemy.minions.shift();
      }
    } else {
      const blockUsed = Math.min(state.currentEnemy.block || 0, damageDealt);
      if (blockUsed > 0) {
        state.currentEnemy.block -= blockUsed;
        logMessage(`${state.currentEnemy.name} blockt ${blockUsed} Schaden.`, 'block');
      }
      remainingDamage = applyTankTraitReduction(state.currentEnemy, damageDealt - blockUsed, card);
      if (remainingDamage > 0) {
        state.currentEnemy.health -= remainingDamage;
        logMessage(`${state.currentEnemy.name} erleidet ${remainingDamage} Schaden.`, 'enemy');
      } else {
        logMessage(`${state.currentEnemy.name} blockt den gesamten Schaden!`, 'block');
      }
    }
    applyLifesteal(remainingDamage);
    if (state.player.hasDragonscale) {
      const target = state.currentEnemy.minions?.[0] || state.currentEnemy;
      applyDragonScaleBurn(target);
    }
    enemyContainerElem.classList.add('hit');
    setTimeout(() => enemyContainerElem.classList.remove('hit'), 300);
  },

  heal(card, state) {
    if (state.player.hasAntiHeal) {
      logMessage(`❌ Deine Heilung wird durch Anti-Heilung blockiert!`, 'debuff');
      return;
    }
    const healAmount = Math.min(card.power, state.player.maxHealth - state.player.health);
    if (healAmount > 0) {
      state.player.health += healAmount;
      logMessage(`Spieler heilt ${healAmount} Leben.`, 'heal');
    } else {
      logMessage(`Spieler ist bereits bei vollem Leben.`, 'heal');
    }
  },

  block(card, state) {
    state.player.block += card.power;
    logMessage(`Spieler erhält ${card.power} Block.`, 'block');
  },

  draw(card, state) {
    const drawn = drawCards(card.power);
    if (drawn > 0) {
      logMessage(`Ziehe ${drawn} Karte(n).`, 'system');
    } else {
      logMessage(`Keine Karten gezogen – Hand ist voll oder Deck leer.`, 'discard');
    }
    updateHandUI();
  },

  gain_mana(card, state) {
    const manaGained = Math.min(card.power, state.player.maxMana - state.player.mana);
    if (manaGained > 0) {
      state.player.mana += manaGained;
      logMessage(`Erhalte ${manaGained} Mana.`, 'mana');
    } else {
      logMessage(`Mana ist bereits voll.`, 'mana');
    }
  },

  lifesteal(card, state) {
    let lsDamage = applyDamageBonuses(card.power);
    logMessage(`${state.currentEnemy.name} erleidet ${lsDamage} Schaden.`, 'enemy');
    const block = Math.min(state.currentEnemy.block || 0, lsDamage);
    if (block > 0) {
      state.currentEnemy.block -= block;
      logMessage(`${state.currentEnemy.name} blockt ${block} Schaden.`, 'block');
    }
    const remaining = lsDamage - block;
    if (remaining > 0) {
      const final = applyTankTraitReduction(state.currentEnemy, remaining, card);
      state.currentEnemy.health -= final;
    }
    if (!state.player.hasAntiHeal) {
      const heal = Math.min(card.healAmount || 0, state.player.maxHealth - state.player.health);
      if (heal > 0) {
        state.player.health += heal;
        logMessage(`🧛 Du heilst ${heal} Leben durch Vampirbiss.`, 'lifesteal');
      }
    } else {
      logMessage(`❌ Vampirbiss wird durch Anti-Heilung blockiert.`, 'debuff');
    }
    enemyContainerElem.classList.add('hit');
    setTimeout(() => enemyContainerElem.classList.remove('hit'), 300);
  },

  firearrow(card, state) {
    let base = card.power;
    if (state.currentEnemy.traits?.includes('Eis-Elementar')) {
      base *= 2;
      logMessage(`🔥 Effektiv! ${state.currentEnemy.name} erhält doppelten Schaden durch Feuer.`, 'system');
    }
    const damage = applyDamageBonuses(base);
    const block = Math.min(state.currentEnemy.block || 0, damage);
    const final = applyTankTraitReduction(state.currentEnemy, Math.max(0, damage - block, card));
    if (block > 0) state.currentEnemy.block -= block;
    state.currentEnemy.health -= final;
    logMessage(`${state.currentEnemy.name} erleidet ${final} Schaden durch Feuerpfeil.`, 'enemy');
    applyLifesteal(final);
    enemyContainerElem.classList.add('hit');
    setTimeout(() => enemyContainerElem.classList.remove('hit'), 300);
    if (Math.random() < 0.5) {
      if (!state.currentEnemy.statusEffects?.some(e => e.type === 'burn')) {
        state.currentEnemy.statusEffects.push({ type: 'burn', power: 5, duration: 2 });
        logMessage(`${state.currentEnemy.name} wird verbrannt! (5 Schaden für 2 Runden)`, 'burn');
      } else {
        logMessage(`${state.currentEnemy.name} ist bereits verbrannt.`, 'system');
      }
      updateEnemyUI();
    }
  },

  gamble(card, state) {
    if (Math.random() < 0.5) {
      state.player.health -= card.power;
      logMessage(`💥 Pech gehabt! Du verlierst ${card.power} Leben.`, 'player');
    } else {
      let damage = applyDamageBonuses(card.power);
      state.currentEnemy.health -= damage;
      state.player.gold += 100;
      logMessage(`🍀 Glück gehabt! Gegner erleidet ${damage} Schaden und du erhältst 100 Gold.`, 'system');
      enemyContainerElem.classList.add('hit');
      setTimeout(() => enemyContainerElem.classList.remove('hit'), 300);
    }
  },
    bleed(card, state) {
    let rawDamage = card.power;
    const alreadyDamaged = state.currentEnemy.damagedThisTurn === true;

    if (alreadyDamaged) {
      rawDamage *= 2;
      logMessage(`🩸 Blutung! Schaden verdoppelt.`, 'effect');
    }

    const totalDamage = applyDamageBonuses(rawDamage);
    const blockUsed = Math.min(state.currentEnemy.block || 0, totalDamage);
    if (blockUsed > 0) {
      state.currentEnemy.block -= blockUsed;
      logMessage(`${state.currentEnemy.name} blockt ${blockUsed} Schaden.`, 'block');
    }

    const netDamage = totalDamage - blockUsed;

    if (netDamage > 0) {
      const adjustedDamage = applyTankTraitReduction(state.currentEnemy, netDamage, card);
      state.currentEnemy.health -= adjustedDamage;
      logMessage(`${state.currentEnemy.name} erleidet ${adjustedDamage} Schaden durch Blutung.`, 'enemy');
      applyLifesteal(adjustedDamage);
    } else {
      logMessage(`${state.currentEnemy.name} blockt den gesamten Blutungsschaden!`, 'block');
    }

    state.currentEnemy.damagedThisTurn = true;

    if (!state.currentEnemy.statusEffects) {
      state.currentEnemy.statusEffects = [];
    }
    const alreadyBleeding = state.currentEnemy.statusEffects.some(e => e.type === 'bleed');
    if (!alreadyBleeding) {
      state.currentEnemy.statusEffects.push({ type: 'bleed', permanent: true });
    }

    enemyContainerElem.classList.add('hit');
    setTimeout(() => enemyContainerElem.classList.remove('hit'), 300);

    if (state.player.hasDragonscale) {
      const target = state.currentEnemy.minions?.[0] || state.currentEnemy;
      applyDragonScaleBurn(target);
    }

    applyLifesteal(netDamage);
  },

counter(card, state) {
    logMessage("🛡 Du bereitest einen Konter vor...", 'player');
    state.player.isCountering = true;
    state.turnInProgress = true;

    setTimeout(() => {
      state.turnInProgress = false;
      endTurn();
    }, 500);
  },

multi_hit(card, state) {
  let hits = (card.minHits && card.hits) ? getRandomInt(card.minHits, card.hits) : 2 + Math.floor(Math.random() * 2);
  let damageDealt = 0;

  const zeitklingeRawBonus = state.player.hasZeitklinge ? 5 : 0; // nur roher Bonus
  const baseDamageWithBonus = applyDamageBonuses(card.power + zeitklingeRawBonus); // einmalig berechnet
  const baseDamageWithoutBonus = applyDamageBonuses(card.power);

  for (let i = 0; i < hits; i++) {
    if (!state.currentEnemy || state.currentEnemy.health <= 0) break;

    const baseDamage = i === 0 ? baseDamageWithBonus : baseDamageWithoutBonus;

    const block = card.ignoreBlock ? 0 : Math.min(state.currentEnemy.block || 0, baseDamage);
    if (block > 0) {
      state.currentEnemy.block -= block;
      logMessage(`${state.currentEnemy.name} blockt ${block} Schaden.`, 'block');
    }

    let raw = baseDamage - block;
    const final = applyTankTraitReduction(state.currentEnemy, raw, card);
    if (final > 0) {
      state.currentEnemy.health -= final;
      damageDealt += final;
      logMessage(`Multihit trifft (${i + 1}) – ${state.currentEnemy.name} nimmt ${final} Schaden.`, 'enemy');
    }

    enemyContainerElem.classList.add('hit');
    setTimeout(() => enemyContainerElem.classList.remove('hit'), 300);
  }

  if (state.player.hasDragonscale && state.currentEnemy) {
    const target = state.currentEnemy.minions?.[0] || state.currentEnemy;
    applyDragonScaleBurn(target);
  }

  applyLifesteal(damageDealt);
},

  poison(card, state) {
    const enemy = state.currentEnemy;
    if (enemy.traits?.includes('Gepanzerte Schuppen') || enemy.traits?.includes('Massiv')) {
      logMessage(`${enemy.name} ist immun gegen Vergiftung!`, 'enemy');
      return;
    }
    const existing = enemy.statusEffects?.find(e => e.type === 'poison');
    if (existing) {
      existing.power = Math.max(existing.power, card.power || 4);
      existing.duration = Math.max(existing.duration, 3);
      logMessage(`☠️ ${enemy.name} ist bereits vergiftet – Effekt verstärkt/verlängert.`, 'poison');
    } else {
      if (!enemy.statusEffects) enemy.statusEffects = [];
      enemy.statusEffects.push({ type: 'poison', power: card.power || 4, duration: 3 });
      logMessage(`☠️ ${enemy.name} wird vergiftet (${card.power || 4} Schaden für 3 Runden).`, 'poison');
    }
    updateEnemyUI();
  },

  paralyze(card, state) {
    const enemy = state.currentEnemy;
    const alreadyParalyzed = enemy.statusEffects?.some(e => e.type === 'paralyze');
    if (alreadyParalyzed) {
      logMessage(`⚡ ${enemy.name} ist bereits paralysiert.`, 'effect');
      return;
    }
    if (!enemy.statusEffects) enemy.statusEffects = [];
    enemy.statusEffects.push({ type: 'paralyze', duration: 2 });
    logMessage(`⚡ ${enemy.name} wird paralysiert! (Angriff halbiert)`, 'effect');

    if (state.player.hasElementalLifesteal && enemy.attack > 0) {
      const heal = Math.floor(enemy.attack / 2);
      const actualHeal = Math.min(heal, state.player.maxHealth - state.player.health);
      state.player.health += actualHeal;
      logMessage(`✨ Elementar-Amulett heilt dich um ${actualHeal} Leben durch Paralyse.`, 'heal');
    }
    updateEnemyUI();
  },

  damage_paralyze(card, state) {
    dealDamage(state.currentEnemy, card.power);
    tryApplyParalyze(state.currentEnemy, 0.45);
  },

  power_surge(card, state) {
    const spentMana = state.player.mana;
    if (spentMana > 0) {
      state.player.mana = 0;
      const healAmount = Math.min(spentMana, state.player.maxHealth - state.player.health);
      state.player.health += healAmount;
      logMessage(`💚 Kraft Sammeln heilt dich um ${healAmount} Leben.`, 'heal');
      state.player.tempAttackBonus = (state.player.tempAttackBonus || 0) + spentMana;
      logMessage(`⚔️ Du bekommst +${spentMana} Angriff für deine nächste Runde.`, 'buff');
    } else {
      logMessage(`🌀 Kein Mana verfügbar – Effekt von Kraft Sammeln entfällt.`, 'system');
    }
  },

  whirlwind(card, state) {
    let totalDamage = applyDamageBonuses(card.power);
    let damageDealt = 0;

    if (state.currentEnemy.minions?.length > 0) {
      state.currentEnemy.minions.forEach((minion) => {
        minion.health -= totalDamage;
        damageDealt += totalDamage;
        logMessage(`🌀 ${minion.name} erleidet ${totalDamage} Schaden (ignoriert Block).`, 'enemy');
      });
      state.currentEnemy.minions = state.currentEnemy.minions.filter(m => m.health > 0);
    }

    const adjustedDamage = applyTankTraitReduction(state.currentEnemy, totalDamage, card);
    state.currentEnemy.health -= adjustedDamage;
    damageDealt += adjustedDamage;
    logMessage(`🌀 ${state.currentEnemy.name} erleidet ${adjustedDamage} Schaden durch Klingenwirbel (ignoriert Block).`, 'enemy');

    enemyContainerElem.classList.add('hit');
    setTimeout(() => enemyContainerElem.classList.remove('hit'), 300);

    if (state.player.hasDragonscale) {
      const target = state.currentEnemy.minions?.[0] || state.currentEnemy;
      applyDragonScaleBurn(target);
    }

    applyLifesteal(damageDealt);
  },

  damage_selfhit(card, state) {
    let damage = applyDamageBonuses(card.power);
    let recoil = card.selfDamage || 0;
    let blockUsed = Math.min(state.currentEnemy.block || 0, damage);
    if (blockUsed > 0) {
      state.currentEnemy.block -= blockUsed;
      logMessage(`${state.currentEnemy.name} blockt ${blockUsed} Schaden.`, 'block');
    }
    const finalDamage = damage - blockUsed;
    if (finalDamage > 0) {
      const adjustedDamage = applyTankTraitReduction(state.currentEnemy, finalDamage, card);
      state.currentEnemy.health -= adjustedDamage;
      logMessage(`${state.currentEnemy.name} erleidet ${adjustedDamage} Schaden durch Ansturm.`, 'enemy');
      applyLifesteal(adjustedDamage);
    } else {
      applyLifesteal(0);
    }
    if (recoil > 0) {
      state.player.health -= recoil;
      logMessage(`💢 Du erleidest ${recoil} Rückstoß-Schaden.`, 'player');
    }
    enemyContainerElem.classList.add('hit');
    setTimeout(() => enemyContainerElem.classList.remove('hit'), 300);
    if (state.player.hasDragonscale) {
      const target = state.currentEnemy.minions?.[0] || state.currentEnemy;
      applyDragonScaleBurn(target);
    }
    applyLifesteal(finalDamage);
  },

  full_heal(card, state) {
    const amount = state.player.maxHealth - state.player.health;
    if (amount > 0) {
      state.player.health = state.player.maxHealth;
      logMessage(`🌸 Lotus Trank heilt dich vollständig (${amount} Leben).`, 'heal');
    } else {
      logMessage(`🌸 Lotus Trank: Du bist bereits voll geheilt.`, 'system');
    }
  },
    soul_rip(card, state) {
    const rawDamage = card.power || 10;
    const damage = applyDamageBonuses(rawDamage);
    const enemy = state.currentEnemy;

    const blockUsed = Math.min(enemy.block || 0, damage);
    if (blockUsed > 0) {
      enemy.block -= blockUsed;
      logMessage(`${enemy.name} blockt ${blockUsed} Schaden.`, 'block');
    }

    const finalDamage = applyTankTraitReduction(enemy, damage - blockUsed, card);
    enemy.health -= finalDamage;
    logMessage(`💀 ${enemy.name} erleidet ${finalDamage} Schaden durch Seelenriss.`, 'enemy');

    enemyContainerElem.classList.add('hit');
    setTimeout(() => enemyContainerElem.classList.remove('hit'), 300);

    if (enemy.health <= 0) {
      const healAmount = Math.floor(state.player.maxHealth * 0.2);
      const actualHeal = Math.min(healAmount, state.player.maxHealth - state.player.health);
      if (!state.player.hasAntiHeal && actualHeal > 0) {
        state.player.health += actualHeal;
        logMessage(`🌙 Du absorbierst die Seele und heilst ${actualHeal} Leben.`, 'heal');
      } else if (state.player.hasAntiHeal) {
        logMessage(`❌ Seelenriss-Heilung wird durch Anti-Heilung blockiert!`, 'debuff');
      }
    }

    applyLifesteal(finalDamage);
    updateEnemyUI();
  },

  mewing(card, state) {
    state.player.mewingStage = 1; // 1 = Mewing wurde aktiviert
    logMessage(`😼 Du beginnst mit dem Mewing... (Effekt in 2 Runden)`, 'system');
  },

  sigma(card, state) {
    state.player.hasSigmaShield = true;
    logMessage(`🛡 SIGMA-Modus aktiviert! Du kannst diese Runde nicht sterben.`, 'buff');
  },

anomaly(card, state) {
  const random = getRandomCard();

  if (!random) {
    logMessage(`❌ Keine zufällige Karte gefunden.`, 'system');
    return;
  }

  // Erzeuge eine eindeutige ID
  const uniqueId = `anomaly-${Date.now()}`;

  // Erstelle die temporäre Karte
  const generatedCard = {
    ...random,
    id: uniqueId, // zur Sicherheit (falls du id nutzt)
    uniqueId: uniqueId,
    generatedByAnomaly: true // wird beim Ausspielen zu oneShot
  };

  const hand = state.player.hand;
  const index = hand.findIndex(c => c === card);
  if (index === -1) {
    logMessage(`❌ Anomalie-Karte nicht in der Hand gefunden.`, 'system');
    return;
  }

  hand.splice(index, 1, generatedCard);
  logMessage(`🌀 Anomalie transformiert sich zu: ${generatedCard.name}`, 'system');

  updateHandUI();
  state.turnInProgress = false;
}


};
