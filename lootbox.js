if (!window.cards || !window.cards.length) {
  try {
    window.cards = JSON.parse(localStorage.getItem('allCards') || '[]');
  } catch (e) {
    console.warn("⚠️ Konnte Kartenliste nicht laden:", e);
    window.cards = [];
  }
}

function getSigmaCoins() {
  return parseInt(localStorage.getItem('sigmaCoins') || '0', 10);
}

function setSigmaCoins(n) {
  localStorage.setItem('sigmaCoins', n);
  if (typeof updateSigmaDisplay === 'function') updateSigmaDisplay();
}

function addSigmaCoins(n) {
  const newTotal = getSigmaCoins() + n;
  setSigmaCoins(newTotal);
}

function animateSigmaDrop(amount = 1) {
  const coin = document.createElement('div');
  coin.textContent = `🪙 +${amount}`;
  coin.style.position = 'fixed';
  coin.style.left = '50%';
  coin.style.top = '50%';
  coin.style.transform = 'translate(-50%, -50%) scale(2)';
  coin.style.fontSize = '48px';
  coin.style.opacity = '1';
  coin.style.zIndex = 9999;
  coin.style.pointerEvents = 'none';
  coin.style.animation = 'gemPulse 0.4s ease, gemShake 0.6s ease';

  document.body.appendChild(coin);

  const target = document.getElementById('sigmaDisplay');
  if (!target) return;

  const targetRect = target.getBoundingClientRect();

  setTimeout(() => {
    coin.style.transition = 'all 1.2s ease';
    coin.style.left = `${targetRect.left + targetRect.width / 2}px`;
    coin.style.top = `${targetRect.top + targetRect.height / 2}px`;
    coin.style.transform = 'translate(-50%, -50%) scale(0.5)';
    coin.style.opacity = '0';
  }, 700);

  setTimeout(() => {
    coin.remove();
  }, 1800);
}

function animateGemDrop(amount = 1) {
  const gem = document.createElement('div');
  gem.textContent = `💎 +${amount}`;
  gem.style.position = 'fixed';
  gem.style.left = '50%';
  gem.style.top = '50%';
  gem.style.transform = 'translate(-50%, -50%) scale(2)';
  gem.style.fontSize = '48px';
  gem.style.opacity = '1';
  gem.style.zIndex = 9999;
  gem.style.pointerEvents = 'none';
  gem.style.animation = 'gemPulse 0.4s ease, gemShake 0.6s ease';

  document.body.appendChild(gem);

  const target = document.getElementById('gemDisplay'); // ← Stelle sicher, dass du dieses Element hast!
  if (!target) return;

  const targetRect = target.getBoundingClientRect();

  setTimeout(() => {
    gem.style.transition = 'all 1.2s ease';
    gem.style.left = `${targetRect.left + targetRect.width / 2}px`;
    gem.style.top = `${targetRect.top + targetRect.height / 2}px`;
    gem.style.transform = 'translate(-50%, -50%) scale(0.5)';
    gem.style.opacity = '0';
  }, 700);

  setTimeout(() => {
    gem.remove();
  }, 1800);
}


  // Lootbox Items und Seltenheitsstufen
  const ITEMS = {
    common: ['🪨', '🪙','💎'], // Häufige Items
    uncommon: ['🪙', { emoji: '👤', skinId: 'skin_goofy' }, { emoji: '👤', skinId: 'skin_gamer'}, '💎'], // Ungewöhnliche Items
    rare: ['🪙', { emoji: '👤', skinId: 'skin_qualle' }, { emoji: '🌪️', cardId: 22 }, { emoji: '🐗', cardId: 21 }, { emoji: '👤', skinId: 'skin_gamerchad' },'💎'], // Seltene Items
    epic: [{ emoji: '🗡️', cardId: 23 }, '🪙', { emoji: '👤', skinId: 'skin_paladin' }] // Epische Items
  };

  document.addEventListener('DOMContentLoaded', () => {
    const sigmaDisplay = document.createElement('div');
    sigmaDisplay.id = 'sigmaDisplay';
    sigmaDisplay.style = `
      position: fixed;
      top: 60px;
      left: 15px;
      z-index: 999;
      background: rgba(0, 0, 0, 0.5);
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 16px;
      color: lightgreen;
      font-family: 'Orbitron', sans-serif;
      box-shadow: 0 0 8px rgba(144, 238, 144, 0.5);
    `;
    document.body.appendChild(sigmaDisplay);
  
    function updateSigmaDisplay() {
      sigmaDisplay.innerHTML = `🪙 <strong>${getSigmaCoins()}</strong>`;
    }
  
    window.updateSigmaDisplay = updateSigmaDisplay;
    updateSigmaDisplay();
  });
  

  // Lootbox Definitionen mit Wahrscheinlichkeiten für verschiedene Seltenheitsstufen
  const LOOTBOXES = {
    daily: {
      name: 'Free Case (Alle 30 Min.)',
      cost: 0,
      cooldown: 24,
      chances: { common: 730, uncommon: 220, rare: 45, epic: 5 }
    },
    wooden: {
      name: 'Holzcase - 0.1%',
      cost: 1,
      chances: { common: 750, uncommon: 210, rare: 39, epic: 1 }
    },
    silver: {
      name: 'Goldcase - 2%',
      cost: 10,
      chances: { common: 350, uncommon: 500, rare: 130, epic: 20 }
    },
    gold: {
      name: 'Maxcase - 5%',
      cost: 25,
      chances: { common: 0, uncommon: 600, rare: 350, epic: 50 }
    }
  };
  
  function openLootboxMenu() {
    if (document.getElementById('lootboxModal')) return;
  
    const overlay = document.createElement('div');
    overlay.id = 'lootboxModal';
    overlay.style = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.85);
      z-index: 9999;
      display: flex; align-items: center; justify-content: center;
    `;
  
    const container = document.createElement('div');
    container.style = `
      background: #1a1a24;
      border: 2px solid gold;
      border-radius: 12px;
      padding: 30px;
      color: white;
      text-align: center;
      max-width: 600px;
      width: 90%;
    `;
  
    const title = document.createElement('h2');
    title.innerHTML = 'Wähle deine Lootbox';
    container.appendChild(title);
  
    const boxList = document.createElement('div');
    boxList.style = 'display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-top: 20px;';
  
    // Boxen erstellen
    Object.entries(LOOTBOXES).forEach(([boxId, box]) => {
      const boxWrapper = document.createElement('div');
      boxWrapper.style = `
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 120px;
        margin: 10px;
      `;
    
      const boxBtn = document.createElement('button');
      boxBtn.style = `
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        position: relative;
        transition: transform 0.2s ease;
      `;
      boxBtn.title = box.name;
    
      const boxImg = document.createElement('img');
      boxImg.src = `images/boxes/${boxId}.png`;
      boxImg.alt = box.name;
      boxImg.style = `
        width: 100px;
        height: auto;
        border-radius: 10px;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      `;
    
      boxBtn.onmouseenter = () => {
        boxImg.style.transform = 'scale(1.05)';
        boxImg.style.boxShadow = '0 0 12px gold';
      };
    
      boxBtn.onmouseleave = () => {
        boxImg.style.transform = 'scale(1)';
        boxImg.style.boxShadow = 'none';
      };
    
      boxBtn.onclick = () => tryOpenBox(boxId);
    
      if (boxId === 'daily' && !canOpenDaily()) {
        boxBtn.disabled = true;
        boxImg.style.filter = 'grayscale(1) opacity(0.6)';
        const timeLeft = getTimeUntilNextDaily();
        boxBtn.title = `${box.name} – ${formatTimeLeft(timeLeft)}`;
      }
    
      const label = document.createElement('div');
      label.style = `
        margin-top: 8px;
        font-size: 14px;
        color: white;
        text-align: center;
        font-family: 'Orbitron', sans-serif;
      `;
      label.innerHTML = `
        <strong>${box.name}</strong><br>
        ${box.cost > 0 ? `💎 ${box.cost}` : 'Gratis'}
      `;
    
      boxBtn.appendChild(boxImg);
      boxWrapper.appendChild(boxBtn);
      boxWrapper.appendChild(label);
      boxList.appendChild(boxWrapper);
    });
    
    
  
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Schließen';
    closeBtn.style = 'margin-top: 25px; padding: 10px 20px;';
    closeBtn.onclick = () => overlay.remove();
  
    container.appendChild(boxList);
    container.appendChild(closeBtn);
    overlay.appendChild(container);
    document.body.appendChild(overlay);
  }
  
  function getTimeUntilNextDaily() {
    const lastOpen = parseInt(localStorage.getItem('dailyLootbox') || '0', 10);
    const now = Date.now();
    const cooldownMs = 1000 * 60 * 30; // 30 Minuten in Millisekunden
    const timeLeft = cooldownMs - (now - lastOpen);
    return Math.max(0, timeLeft);
  }
  
  function formatTimeLeft(ms) {
    if (ms <= 0) return 'Jetzt verfügbar';
    
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    
    return `Verfügbar in ${hours}h ${minutes}m`;
  }
  
  function getGems() {
    return parseInt(localStorage.getItem('gems') || '0', 10);
  }
  
  function setGems(n) {
    localStorage.setItem('gems', n);
  }
  
  function addGems(n) {
    setGems(getGems() + n);
    if (typeof updateGemDisplay === 'function') updateGemDisplay();
  }
  
  function canOpenDaily() {
    const lastOpen = parseInt(localStorage.getItem('dailyLootbox') || '0', 10);
    const now = Date.now();
    return (now - lastOpen) > 1000 * 60 * 30;
  }
  
  function tryOpenBox(boxId) {
    const box = LOOTBOXES[boxId];
    
    if (boxId === 'daily') {
      if (!canOpenDaily()) {
        alert('Die Free Case ist noch nicht verfügbar!');
        return;
      }
      localStorage.setItem('dailyLootbox', Date.now().toString());
      openLootboxAnimation(box);
    } else {
      const gems = getGems();
      if (gems < box.cost) {
        alert('Nicht genug Edelsteine!');
        return;
      }
      addGems(-box.cost);
      openLootboxAnimation(box);
    }
  
    document.getElementById('lootboxModal')?.remove();
  }
  
  function getRandomItem(boxType) {
    const roll = Math.floor(Math.random() * 1000) + 1;
    const chances = LOOTBOXES[boxType].chances;
  
    let threshold = 0;
  
    const pick = (list, rarity) => {
      const reward = list[Math.floor(Math.random() * list.length)];
      if (typeof reward === 'string') {
        return { item: reward, rarity };
      } else {
        return {
          item: reward.emoji,
          rarity,
          ...(reward.cardId !== undefined ? { cardId: reward.cardId } : {}),
          ...(reward.skinId !== undefined ? { skinId: reward.skinId } : {})
        };
      }
    };
  
    if (roll <= (threshold += chances.common)) {
      return pick(ITEMS.common, 'common');
    }
    if (roll <= (threshold += chances.uncommon)) {
      return pick(ITEMS.uncommon, 'uncommon');
    }
    if (roll <= (threshold += chances.rare)) {
      return pick(ITEMS.rare, 'rare');
    }
    if (roll <= (threshold += chances.epic)) {
      return pick(ITEMS.epic, 'epic');
    }
  }
  
  
  function getRandomItemsForAnimation(boxType, finalItem) {
    // Erstelle eine Liste von Items für die Animation - mehr Items für eine längere Animation
    const itemList = [];
    
    // Füge hauptsächlich häufige Items hinzu, mit ein paar ungewöhnlichen
    for (let i = 0; i < 120; i++) {
      if (i < 85) {
        itemList.push({
          item: ITEMS.common[Math.floor(Math.random() * ITEMS.common.length)],
          rarity: 'common'
        });
      } else {
        itemList.push({
          item: ITEMS.uncommon[Math.floor(Math.random() * ITEMS.uncommon.length)],
          rarity: 'uncommon'
        });
      }
    }
    
    // Füge ein paar seltene/epische Items ein, um Spannung zu erzeugen
    if (Math.random() < 0.4) {
      itemList[25] = {
        item: ITEMS.rare[Math.floor(Math.random() * ITEMS.rare.length)],
        rarity: 'rare'
      };
    }
    
    if (Math.random() < 0.3) {
      itemList[55] = {
        item: ITEMS.rare[Math.floor(Math.random() * ITEMS.rare.length)],
        rarity: 'rare'
      };
    }
    
    if (Math.random() < 0.2) {
      itemList[85] = {
        item: ITEMS.epic[Math.floor(Math.random() * ITEMS.epic.length)],
        rarity: 'epic'
      };
    }
    
    // Füge das finale Item am Ende hinzu
    itemList.push(finalItem);
    
    return itemList;
  }
  
  function openLootboxAnimation(box) {
    const boxType = Object.keys(LOOTBOXES).find(key => LOOTBOXES[key] === box);
    const finalReward = getRandomItem(boxType);
  
    const PRE_ITEMS = 120;
    const POST_ITEMS = 10;
    const ITEM_WIDTH = 130;
    const CENTER_POS = 300;
  
    // --- Items vorbereiten ---
    const items = [];
    for (let i = 0; i < PRE_ITEMS; i++) {
      const rarity = i < 90 ? 'common' : 'uncommon';
      const pool = ITEMS[rarity];
      const reward = pool[Math.floor(Math.random() * pool.length)];
      items.push({
        item: typeof reward === 'string' ? reward : reward.emoji,
        rarity
      });
    }
  
    const winningIndex = items.length;
    items.push(finalReward);
  
    for (let i = 0; i < POST_ITEMS; i++) {
      const rarity = Math.random() < 0.8 ? 'common' : 'uncommon';
      const pool = ITEMS[rarity];
      items.push({ item: pool[Math.floor(Math.random() * pool.length)], rarity });
    }
  
    // --- DOM ---
    const overlay = document.createElement('div');
    overlay.style = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.9); z-index: 9999;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
    `;
  
    const title = document.createElement('h2');
    title.textContent = `Öffne ${box.name}`;
    title.style = 'color: white; margin-bottom: 30px; font-size: 24px;';
    overlay.appendChild(title);
  
    const container = document.createElement('div');
    container.style = `
      position: relative;
      width: 600px;
      height: 120px;
      overflow: hidden;
      border: 3px solid gold;
      border-radius: 10px;
      background: #1a1a24;
    `;
  
    const marker = document.createElement('div');
    marker.style = `
      position: absolute;
      top: 0;
      left: ${CENTER_POS}px;
      width: 4px;
      height: 120px;
      background-color: red;
      z-index: 10;
    `;
    container.appendChild(marker);
  
    const itemsContainer = document.createElement('div');
    itemsContainer.style = `
      display: flex;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      will-change: transform;
    `;
  
    items.forEach(({ item, rarity }) => {
      const el = document.createElement('div');
      el.textContent = typeof item === 'string' ? item : item.emoji;
      el.style = `
      display: flex;
      align-items: center;
      justify-content: center;
      width: 120px;
      height: 100%;
      font-size: 48px;
      margin: 0 5px;
      padding: 0;                    /* ← sicherstellen */
      box-sizing: content-box;      /* ← ganz wichtig */
      border-radius: 5px;
      background-color: ${getRarityColor(rarity)};
    `;
    
      itemsContainer.appendChild(el);
    });
  
    container.appendChild(itemsContainer);
    overlay.appendChild(container);
  
    const result = document.createElement('div');
    result.style = `
      font-size: 28px; color: white; margin-top: 30px;
      display: none; text-align: center;
    `;
    result.innerHTML = `
      <div style="font-size: 80px; margin-bottom: 10px;">${typeof finalReward.item === 'string' ? finalReward.item : finalReward.item?.emoji}</div>
      <div style="color: ${getRarityColor(finalReward.rarity)};
        font-weight: bold; text-shadow: 0 0 5px ${getRarityColor(finalReward.rarity)};">
        ${getRarityName(finalReward.rarity)}
      </div>
    `;
    overlay.appendChild(result);

    // Wahrscheinlichkeiten anzeigen
    const oddsTable = document.createElement('table');
    oddsTable.style = `
      margin-top: 50px;
      border-collapse: collapse;
      font-family: 'Orbitron', sans-serif;
      font-size: 28px;
      color: white;
      background: rgba(0, 0, 0, 0.75);
      border-radius: 8px;
      overflow: hidden;
    `;

    const headerRow = document.createElement('tr');
    ['Gewinne', 'Seltenheit', 'Chance'].forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      th.style = `
        padding: 6px 12px;
        background: rgba(0, 0, 0, 0.9);
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      `;
      headerRow.appendChild(th);
    });
    oddsTable.appendChild(headerRow);

    const total = Object.values(box.chances).reduce((a, b) => a + b, 0);
    Object.entries(box.chances).forEach(([rarity, value]) => {
      const row = document.createElement('tr');

      const percent = (value / total * 100).toFixed(1);
      const sampleItem = ITEMS[rarity]?.[0];
      const emoji = typeof sampleItem === 'string' ? sampleItem : sampleItem?.emoji || '❓';

      [emoji, getRarityName(rarity), `${percent}%`].forEach((text, i) => {
        const td = document.createElement('td');
        td.innerHTML = text;
        td.style = `
          padding: 6px 12px;
          text-align: ${i === 2 ? 'right' : 'left'};
          color: ${getRarityColor(rarity)};
        `;
        row.appendChild(td);
      });

      oddsTable.appendChild(row);
    });

    overlay.appendChild(oddsTable);

  
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Schließen';
    closeBtn.style = `
      margin-top: 20px;
      padding: 10px 25px;
      font-size: 16px;
      background: #333;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      display: none;
    `;
    closeBtn.onclick = () => overlay.remove();
    overlay.appendChild(closeBtn);
  
    document.body.appendChild(overlay);
  
    // --- Animation ---
    let startTime;
    const duration = 9500;
    const startX = 0;
    const endX = CENTER_POS - (winningIndex * ITEM_WIDTH);
    
    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }
    
    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = progress < 1 ? easeOutExpo(progress) : 1;
      
        const pos = startX + (endX - startX) * eased;
        itemsContainer.style.transform = `translateX(${pos}px)`;
      
        if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            itemsContainer.style.transform = `translateX(${endX}px)`; // <– HART FIXIEREN!
            setTimeout(() => {
              result.style.display = 'block';
              closeBtn.style.display = 'block';
              addReward(finalReward);
            }, 1000);
          }
               
      }
      
    requestAnimationFrame(animate);
    
  }
  
  

  
  function getRarityColor(rarity) {
    switch(rarity) {
      case 'common': return '#4b5563'; // Grau
      case 'uncommon': return '#10b981'; // Grün
      case 'rare': return '#8800ff'; // Lila
      case 'epic': return ' #f1c40f '; // Gold
      default: return '#4b5563';
    }
  }
  
  function getRarityName(rarity) {
    switch(rarity) {
      case 'common': return 'Gewöhnlich';
      case 'uncommon': return 'Selten';
      case 'rare': return 'Episch';
      case 'epic': return 'Legendary';
      default: return 'Unbekannt';
    }
  }
  
  function addReward(reward) {
    console.log(`Belohnung erhalten: ${reward.item} (${reward.rarity})`);

    if (reward.skinId) {
      const skins = new Set(JSON.parse(localStorage.getItem('unlockedSkins') || '[]'));
      skins.add(reward.skinId);
      localStorage.setItem('unlockedSkins', JSON.stringify([...skins]));
    
      // Animation anzeigen
      showSkinUnlockAnimation(reward.skinId);
    }    
    
    if (reward.cardId !== undefined) {
      // 1. Karte lokal speichern
      const won = new Set(JSON.parse(localStorage.getItem('wonCards') || '[]'));
      won.add(reward.cardId);
      localStorage.setItem('wonCards', JSON.stringify([...won]));
  
      // 2. State übernehmen, falls Spiel läuft
      if (window.state && state.wonCards) {
        state.wonCards = won;
      }
  
// Versuche Karten aus window zu laden, sonst aus localStorage
if (!Array.isArray(window.cards) || window.cards.length === 0) {
  try {
    const saved = JSON.parse(localStorage.getItem('allCards') || '[]');
    if (Array.isArray(saved) && saved.length > 0) {
      window.cards = saved;
      console.log("✅ Kartenliste aus localStorage geladen:", saved.length, "Karten.");
    } else {
      console.warn("⚠️ Keine Karten im localStorage gefunden (allCards leer oder ungültig).");
    }
  } catch (err) {
    console.error("❌ Fehler beim Parsen von allCards:", err);
  }
}

// CSS für Animation einfügen, falls nicht vorhanden
const style = document.createElement('style');
style.textContent = `
  @keyframes gemPulse {
    0% { transform: scale(1.8); }
    50% { transform: scale(2.2); }
    100% { transform: scale(1.8); }
  }

  @keyframes gemShake {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-10deg); }
    50% { transform: rotate(10deg); }
    75% { transform: rotate(-5deg); }
  }
`;
document.head.appendChild(style);


  
      // 4. Starterdeck oder Freischalt-Animation
      if (!localStorage.getItem('starterDeck')) {
        if (window.cards && window.cards.length) {
          alert("🏆 Neue Karte freigeschaltet! Du kannst sie nun im Starterdeck wählen.");
          showStarterDeckSelection();
        } else {
          alert("🏆 Neue Karte freigeschaltet! Bitte starte einmal ein Spiel, um sie im Starterdeck auswählen zu können.");
        }
      } else {
        if (window.cards && window.cards.length) {
          showCardUnlockAnimation(reward.cardId);
        } else {
          console.warn("⚠️ Kartenliste nicht verfügbar – keine Animation möglich.");
        }
      }
    }
  
    // Belohnung (Gold & Edelsteine)
// Belohnung (Gold & Edelsteine) – nur wenn es sich um ein Emoji handelt, nicht um Karten
if (typeof reward.item === 'string') {
  switch (reward.item) {
    case '🪨':
      addSigmaCoins(10);
      animateSigmaDrop(10);
      break;
    case '🪙':
      switch (reward.rarity) {
        case 'common':
          addSigmaCoins(25);
          animateSigmaDrop(25);
          break;
        case 'uncommon':
          addSigmaCoins(50);
          animateSigmaDrop(50);
          break;
        case 'rare':
          addSigmaCoins(200);
          addGems(1);
          animateSigmaDrop(200);
          break;
        case 'epic':
          addSigmaCoins(500);
          addGems(3);
          animateSigmaDrop(500);
          break;
      }
      break;
    case '💎':
        switch (reward.rarity) {
          case 'common':
            addGems(1);
            animateGemDrop(1);
            break;
          case 'uncommon':
            addGems(3);
            animateGemDrop(3);
            break;
          case 'rare':
            addGems(25);
            animateGemDrop(25);
            break;
          case 'epic':
            addGems(50);
            addSigmaCoins(100);
            animateGemDrop(100);
            animateSigmaDrop(100);
            break;
        }
        break;
  }
  updateSigmaDisplay?.();
}
  
  
  function showCardUnlockAnimation(cardId) {
    const allCards = (window.cards && Array.isArray(window.cards)) ? window.cards :
    JSON.parse(localStorage.getItem('allCards') || '[]');
    const card = allCards.find(c => c.id === cardId);
    if (!card) {
    console.warn("⚠️ Karte mit ID " + cardId + " nicht gefunden.");
    return;
    }

  
    const overlay = document.createElement('div');
    overlay.style = `
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.8);
      z-index: 10000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease-out;
    `;
  
    const box = document.createElement('div');
    box.style = `
      background: linear-gradient(145deg, #1a1a24, #2a2a3a);
      border: 3px solid gold;
      border-radius: 12px;
      padding: 30px;
      text-align: center;
      color: white;
      font-family: 'Orbitron', sans-serif;
      transform: scale(0.8);
      animation: popIn 0.4s ease-out forwards;
    `;
  
    box.innerHTML = `
      <div style="font-size: 60px; margin-bottom: 10px;">${card.icon}</div>
      <h2>🎉 Neue Karte freigeschaltet!</h2>
      <strong style="font-size: 22px;">${card.name}</strong>
      <p style="font-size: 14px; margin-top: 10px;">${card.description}</p>
    `;
  
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Schließen';
    closeBtn.style = `
      margin-top: 20px;
      padding: 10px 20px;
      font-size: 16px;
      border-radius: 8px;
      border: none;
      background: gold;
      color: black;
      cursor: pointer;
    `;
    closeBtn.onclick = () => overlay.remove();
  
    box.appendChild(closeBtn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }
  
  const lootboxStyle = document.createElement('style');
lootboxStyle.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes popIn {
    0% { transform: scale(0.8); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
`;
document.head.appendChild(lootboxStyle);




function showSkinUnlockAnimation(skinId) {
  // Pfad berechnen
  const id = skinId.replace('skin_', '');
  const imageUrl = `images/players/${id}.png`;

  const overlay = document.createElement('div');
  overlay.style = `
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.85);
    z-index: 10000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease-out;
  `;

  const box = document.createElement('div');
  box.style = `
    background: linear-gradient(145deg, #1a1a24, #2a2a3a);
    border: 3px solid gold;
    border-radius: 12px;
    padding: 30px;
    text-align: center;
    color: white;
    font-family: 'Orbitron', sans-serif;
    transform: scale(0.8);
    animation: popIn 0.4s ease-out forwards;
  `;

  box.innerHTML = `
    <img src="${imageUrl}" alt="Skin" style="width: 120px; height: auto; margin-bottom: 15px;">
    <h2>✨ Neuer Skin freigeschaltet!</h2>
    <strong style="font-size: 20px;">${id.charAt(0).toUpperCase() + id.slice(1)}</strong>
    <p style="font-size: 14px; margin-top: 10px;">Jetzt im Shop verfügbar!</p>
  `;

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Schließen';
  closeBtn.style = `
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 8px;
    border: none;
    background: gold;
    color: black;
    cursor: pointer;
  `;
  closeBtn.onclick = () => overlay.remove();

  box.appendChild(closeBtn);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
}


  function addGold(amount) {
    const currentGold = parseInt(localStorage.getItem('gold') || '0', 10);
    localStorage.setItem('gold', currentGold + amount);
    if (typeof updateGoldDisplay === 'function') updateGoldDisplay();
  }}