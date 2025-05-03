// --- Shop-Daten & Logik (shop.js) ---

const SHOP_ITEMS = [
    {
      id: 'blut',
      name: 'Doanels Blutrüstung',
      cost: 1000,
      description: 'Regeneriert jede Runde 2 Leben.',
      icon: 'images/blutrüstung.png',
      effect: 'regen'
    },
    {
      id: 'donner',
      name: 'Donner-Zauber',
      cost: 500,
      description: 'Einmalige Karte: 25 Schaden, kein Mana.',
      icon: 'images/donner.png',
      effect: 'spell'
    },
    {
      id: 'axt',
      name: 'Katryns Axt',
      cost: 2500,
      description: '30 % Chance auf kritischen Treffer (Krtisiche Treffer erhöhen deinen Schaden um 1,5x).',
      icon: 'images/katryns-axt.png',
      effect: 'crit'
    }
  ];
  
  const playerInventory = new Set(); // Gekaufte Items speichern
  
  // Shop-Overlay vorbereiten
  const shopContainer = document.createElement('div');
  shopContainer.id = 'shopContainer';
  shopContainer.style.display = 'none';
  document.body.appendChild(shopContainer);
  
  // Shop-Öffnungsfrage
  function promptShopQuestion() {
    const confirmOverlay = document.createElement('div');
    confirmOverlay.style.position = 'fixed';
    confirmOverlay.style.top = '0';
    confirmOverlay.style.left = '0';
    confirmOverlay.style.width = '100%';
    confirmOverlay.style.height = '100%';
    confirmOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    confirmOverlay.style.display = 'flex';
    confirmOverlay.style.justifyContent = 'center';
    confirmOverlay.style.alignItems = 'center';
    confirmOverlay.style.zIndex = '1000';
  
    const box = document.createElement('div');
    box.style.background = '#333';
    box.style.color = 'white';
    box.style.padding = '30px';
    box.style.borderRadius = '12px';
    box.style.textAlign = 'center';
    box.innerHTML = `<h2>🛒 Shop öffnen?</h2><p>Alle 3 Level kannst du den Shop öffnen. Möchtest du Goldmünzen ausgeben?</p>`;
  
    const yesBtn = document.createElement('button');
    yesBtn.textContent = 'Ja';
    yesBtn.style.margin = '10px';
    yesBtn.onclick = () => {
      document.body.removeChild(confirmOverlay);
      openShop();
    };
  
    const noBtn = document.createElement('button');
    noBtn.textContent = 'Nein';
    noBtn.style.margin = '10px';
    noBtn.onclick = () => {
      document.body.removeChild(confirmOverlay);
      proceedToUpgrade();
    };
  
    box.appendChild(yesBtn);
    box.appendChild(noBtn);
    confirmOverlay.appendChild(box);
    document.body.appendChild(confirmOverlay);
  }
  
    // Shop anzeigen
    let afterShopCallback = null; // ← global definieren

    // Shop öffnen mit optionalem Callback
    function openShop(callback) {
        afterShopCallback = callback || null;
        showShopItems();
    }
    
    // Shop-UI anzeigen
    function showShopItems() {
        shopContainer.innerHTML = '<h2>Shop: Wähle ein Item</h2>';
    
        const itemList = document.createElement('div');
        itemList.style.display = 'flex';
        itemList.style.flexDirection = 'column';
        itemList.style.gap = '20px';
    
        SHOP_ITEMS.forEach(item => {
            const itemBox = document.createElement('div');
            itemBox.classList.add('shop-item');
            itemBox.setAttribute('data-tooltip', item.description);
    
            itemBox.innerHTML = `
                <img src="${item.icon}" class="shop-image" alt="${item.name}">
                <div class="shop-info">
                    <h3>${item.name}</h3>
                    <div class="shop-price">${item.cost} Gold</div>
                </div>
            `;
    
            itemBox.addEventListener('click', () => buyItem(item));
            itemList.appendChild(itemBox);
        });
    
        // "Shop überspringen"-Button
        const skipBtn = document.createElement('button');
        skipBtn.textContent = 'Shop überspringen';
        skipBtn.style.marginTop = '20px';
        skipBtn.onclick = () => closeShop();
    
        shopContainer.appendChild(itemList);
        shopContainer.appendChild(skipBtn);
        shopContainer.style.display = 'flex';
    }
    
    // Shop schließen und ggf. Callback ausführen
    function closeShop() {
        shopContainer.style.display = 'none';
        if (typeof afterShopCallback === 'function') {
            afterShopCallback(); // z. B. Upgrade anzeigen
            afterShopCallback = null; // zurücksetzen
        }
    }
    
  
  function buyItem(item) {
    if (state.player.gold >= item.cost && !playerInventory.has(item.id)) {
      state.player.gold -= item.cost;
      playerInventory.add(item.id);
      logMessage(`🛒 Gekauft: ${item.name}`, 'system');
      applyShopItemEffect(item);
      closeShop();
    } else {
      logMessage('Nicht genug Gold oder bereits gekauft.', 'system');
    }
  }
  
  function applyShopItemEffect(item) {
    switch (item.effect) {
      case 'regen':
        state.player.hasBloodArmor = true;
        break;
      case 'spell':
        case 'spell':
            const spell = {
                id: 999,
                name: 'Donner-Zauber',
                icon: 'images/donner.png',
                description: 'Einmal 25 Schaden, kein Mana.',
                power: 25,
                effect: 'damage',
                manaCost: 0,
                tags: ['spell'],
                oneShot: true
              };              
              state.player.deck.push(createCardInstance(spell));
              playerInventory.add(item.id); // sichert, dass 'donner' korrekt gespeichert ist              
            break;
          
      case 'crit':
        state.player.critChance = 0.3;
        break;
    }
    updateUIDisplay();
    updatePlayerItemIcons();
  }
  
  function updatePlayerItemIcons() {
    const container = document.getElementById('playerStatusDisplay');
    if (!container) return;
  
    const icons = [];
  
    if (state.player.hasBloodArmor) {
      icons.push('<img src="images/blutrüstung.png" alt="Blutrüstung" title="Regeneriert jede Runde 2 Leben." class="item-icon" />');
    }
    if (state.player.critChance) {
      icons.push('<img src="images/katryns-axt.png" alt="Katryns Axt" title="30 % kritische Trefferchance" class="item-icon" />');
    }
    if (playerInventory.has('donner')) {
      icons.push('<img src="images/donner.png" alt="Donner-Zauber" title="Einmalige Karte: 25 Schaden, kein Mana" class="item-icon" />');
    }
  
    container.innerHTML = icons.join('');
  }
  