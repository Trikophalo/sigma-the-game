// indexshop.js
// Shop für Karten und Skins mit SigmaCoins

document.addEventListener("DOMContentLoaded", () => {
    // Skin-Auswahl speichern / lesen
        function setActiveSkin(path) {
            localStorage.setItem('selectedSkinPath', path);
        }
        function getActiveSkin() {
            return localStorage.getItem('selectedSkinPath') || null;
        }       
    // Shop-Button ins Dropdown-Menü einfügen
    const menuDropdown = document.getElementById("menuDropdown");
    if (menuDropdown) {
      const shopBtn = document.createElement("button");
      shopBtn.textContent = "🛒 Shop";
      shopBtn.style = "display:block; width:100%; margin-bottom:6px; text-align:left;";
      shopBtn.addEventListener("click", () => {
        toggleDropdown();
        openShopModal();
      });
      menuDropdown.appendChild(shopBtn);
    }
  
    // Definiere für jeden Skin seinen individuellen Preis:
    const skinPriceMap = {
        hoodie:   100,
        assasin:  250,
        gamer:    100,
        lion:     500,
        emoji:    1000,
        goofy:    300,
        reddragon: 1000,
        gamerchad: 1000,
        fighter: 200,
        qualle: 500,
        greendragon: 1000,
        paladin: 5000,
    };

    const cardPriceMap = {
        22: 500, 
        4: 100,
        5: 150,
        8: 500,
        12: 250,
      };       
  
    // Hier die Dateinamen deiner Skins im Ordner images/players
    const playerSkinFiles = [
      "hoodie.png",
      "gamer.png",
      "goofy.png",
      "fighter.png",
      "assasin.png",
      "lion.png",
      "emoji.png",
      "gamerchad.png",
      "reddragon.png",
      "qualle.png",
      "greendragon.png",
      "paladin.png"
    ];
  
    // Shop-Items: Karten und Skins
    const shopItems = [
        { id: "card_22", type: "card", cardId: 22, name: "Tornado", price: cardPriceMap[22], description: "Trifft 2–3× mit je 5 Schaden. Ignoriert Block.", icon: "🌪️" },
        { id: "card_4", type: "card", cardId: 4, name: "Gift", price: cardPriceMap[4], description: "Vergiftet den Gegner", icon: "☠️" },
        { id: "card_5", type: "card", cardId: 5, name: "Blitz", price: cardPriceMap[5], description: "12 dmg. Kann Gegner Paralysieren.", icon: "⚡" },
        { id: "card_8", type: "card", cardId: 8, name: "Vampirbiss", price: cardPriceMap[8], description: "8 schaden, heilt 8", icon: "🧛" },
        { id: "card_12", type: "card", cardId: 12, name: "Vampirbiss", price: cardPriceMap[12], description: "Heilt 15 Leben", icon: "💖" },
      ...playerSkinFiles.map(filename => {
        const id = filename.replace(/\.[^/.]+$/, "");
        return {
          id:          `skin_${id}`,
          type:        "skin",
          name:        `${id.charAt(0).toUpperCase() + id.slice(1)} Skin`,
          price:       skinPriceMap[id] || 200,   // Fallback-Preis 200
          image:       `images/players/${filename}`,
          icon:        ""
        };
      })
    ];
  
    function getSigmaCoins() {
      return parseInt(localStorage.getItem("sigmaCoins") || "0", 10);
    }
    function setSigmaCoins(amount) {
      localStorage.setItem("sigmaCoins", amount);
      window.updateSigmaDisplay?.();
    }
  
    function unlockCard(cardId) {
      const unlocked = new Set(JSON.parse(localStorage.getItem("wonCards") || "[]"));
      unlocked.add(cardId);
      localStorage.setItem("wonCards", JSON.stringify(Array.from(unlocked)));
    }
  
    function unlockSkin(skinId) {
      const skins = new Set(JSON.parse(localStorage.getItem("unlockedSkins") || "[]"));
      skins.add(skinId);
      localStorage.setItem("unlockedSkins", JSON.stringify(Array.from(skins)));
    }
  
    function openShopModal() {
      if (document.getElementById("shopModal")) return;
  
      const modal = document.createElement("div");
      modal.id = "shopModal";
      modal.style = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.8); display:flex; justify-content:center; align-items:center; z-index:10000;";
  
      const container = document.createElement("div");
      container.style = "background:#1a1a24; border:2px solid gold; padding:20px; border-radius:8px; width:90%; max-width:600px; max-height:80vh; overflow-y:auto;";
  
      const title = document.createElement("h2");
      title.textContent = "🛒 Sigma Shop";
      container.appendChild(title);
  
      const coinsDisplay = document.createElement("div");
      coinsDisplay.textContent = `🪙 Deine SigmaCoins: ${getSigmaCoins()}`;
      coinsDisplay.style = "margin-bottom:15px; font-size:16px;";
      container.appendChild(coinsDisplay);
  
      const grid = document.createElement("div");
      grid.style = "display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:10px;";
    
      shopItems.forEach(item => {
        const unlockedSkins = new Set(JSON.parse(localStorage.getItem('unlockedSkins') || '[]'));
        const currentSkin = getActiveSkin();
      
        const card = document.createElement('div');
        card.style = 'background:#2a2a3a; border:1px solid #444; padding:10px; border-radius:6px; text-align:center;';
      
        const imgHtml = item.image
          ? `<div style="height:80px; margin-bottom:5px;">
               <img src="${item.image}" alt="${item.name}" style="max-width:100%; max-height:100%;">
             </div>`
          : `<div style="font-size:24px;">${item.icon}</div>`;
      
        card.innerHTML = `
          ${imgHtml}
          <strong>${item.name}</strong><br>
          ${item.description ? `<small>${item.description}</small><br>` : ''}
          <div style="margin:6px 0;">Preis: ${item.price} 🪙</div>
        `;
      
    
        // ── 1) CARD ELEMENT ERSTELLEN ──────────────────────────
        const btn = document.createElement('button');
        Object.assign(btn.style, {
          marginTop:    '5px',
          padding:      '6px 12px',
          border:       'none',
          borderRadius: '4px',
          cursor:       'pointer',
          fontWeight:   'bold'
        });
        
        // ── SKIN-LOGIK ─────────────────────
        if (item.type === 'skin') {
          const owned = unlockedSkins.has(item.id);
          const isActive = item.image === currentSkin;
        
          if (owned) {
            if (isActive) {
              btn.textContent = 'Aktiv';
              btn.disabled = true;
              Object.assign(btn.style, {
                backgroundColor: '#555',
                color: '#ddd'
              });
            } else {
              btn.textContent = 'Anlegen';
              btn.disabled = false;
              Object.assign(btn.style, {
                backgroundColor: '#28a745',
                color: '#fff'
              });
              btn.addEventListener('click', () => {
                setActiveSkin(item.image);
        
                const updatedUnlocked = new Set(JSON.parse(localStorage.getItem('unlockedSkins') || '[]'));
                document.querySelectorAll('[data-skin-btn]').forEach(b => {
                  const btnId = b.getAttribute('data-skin-btn');
                  if (!updatedUnlocked.has(btnId)) return;
        
                  if (btnId === item.id) {
                    b.textContent = 'Aktiv';
                    b.disabled = true;
                    Object.assign(b.style, {
                      backgroundColor: '#006808',
                      color: '#006808'
                    });
                  } else {
                    b.textContent = 'Anlegen';
                    b.disabled = false;
                    Object.assign(b.style, {
                      backgroundColor: '#28a745',
                      color: '#fff'
                    });
                  }
                });
              });
            }
          } else {
            btn.textContent = 'Kaufen';
            btn.disabled = getSigmaCoins() < item.price;
            Object.assign(btn.style, {
              backgroundColor: '#ff9800',
              color: '#000'
            });
            btn.addEventListener('click', () => {
              let coins = getSigmaCoins();
              if (coins >= item.price) {
                coins -= item.price;
                setSigmaCoins(coins);
                unlockSkin(item.id);
                coinsDisplay.textContent = `🪙 Deine SigmaCoins: ${coins}`;
                updateSigmaDisplay?.();
                btn.textContent = '✓';
                btn.disabled = true;
              }
            });
          }
        
          btn.setAttribute('data-skin-btn', item.id);
        
        // ── KARTEN-LOGIK ─────────────────────
        } else if (item.type === 'card') {
          const wonCards = new Set(JSON.parse(localStorage.getItem("wonCards") || "[]"));
          const alreadyUnlocked = wonCards.has(item.cardId);
        
          if (alreadyUnlocked) {
            btn.textContent = 'Gekauft';
            btn.disabled = true;
            Object.assign(btn.style, {
              backgroundColor: '#555',
              color: '#ddd',
              fontSize: '13px'
            });
          } else {
            btn.textContent = 'Kaufen';
            btn.disabled = getSigmaCoins() < item.price;
            Object.assign(btn.style, {
              backgroundColor: '#ff9800',
              color: '#000',
            });
            btn.addEventListener('click', () => {
              let coins = getSigmaCoins();
              if (coins >= item.price) {
                coins -= item.price;
                setSigmaCoins(coins);
                unlockCard(item.cardId);
                coinsDisplay.textContent = `🪙 Deine SigmaCoins: ${coins}`;
                updateSigmaDisplay?.();
                btn.textContent = 'Gekauft';
                btn.disabled = true;
                Object.assign(btn.style, {
                  backgroundColor: '#555',
                  color: '#ddd'
                });
              }
            });
          }
        }
            
        card.appendChild(btn);
        grid.appendChild(card);
      });
    
      container.appendChild(grid);
  
      const close = document.createElement("button");
      close.textContent = "Schließen";
      close.style = "margin-top:15px; padding:6px 12px;";
      close.addEventListener("click", () => modal.remove());
      container.appendChild(close);
  
      modal.appendChild(container);
      document.body.appendChild(modal);
    }
  
    // Dropdown aus-/einblenden
    function toggleDropdown() {
      const menu = document.getElementById("menuDropdown");
      if (!menu) return;
      menu.style.display = menu.style.display === "block" ? "none" : "block";
    }
  });
  