// fusion.js mit verbesserter Animation

const EFFECT_ICONS = {
    damage: '💥',
    block: '🛡️',
    heal: '❤️',
    lifesteal: '🧛',
    poison: '☠️',
    damage_paralyze: '⚡',
    whirlwind: '🌀',
    firearrow: '🔥',
    gamble: '🎲'
  };
  
  function fuseCards(cardA, cardB) {
    const power = {};
    const durations = {};
  
    // Effektwerte vorbereiten
    for (const card of [cardA, cardB]) {
      const effect = card.effect;
      const value = card.power ?? card.healAmount ?? 0;
      power[effect] = (power[effect] || 0) + value;
  
      // Dauer für Status-Effekte merken
      if (card.duration) {
        durations[effect] = Math.max(durations[effect] || 0, card.duration);
      }
    }
  
    // Bonus nur einmal bei damage
    if (power['damage'] && state.player.swordBonus) {
      power['damage'] += state.player.swordBonus;
    }
  
    const description = `${cardA.description}<br><br>${cardB.description}`;
  
    return {
      id: `fusion-${cardA.id}-${cardB.id}`,
      uniqueId: crypto.randomUUID(),
      name: `${cardA.name}-${cardB.name}`,
      icon: `${cardA.icon}${cardB.icon}`,
      effect: `${cardA.effect}_${cardB.effect}`,
      manaCost: Math.max(0, (cardA.manaCost || 0) + (cardB.manaCost || 0) - 1),
      power,
      effectDurations: durations,
      rarity: 'fusion',
      description,
      healAmount: (cardA.healAmount || 0) + (cardB.healAmount || 0),
      duration: Math.max(cardA.duration || 0, cardB.duration || 0), // optional global
      isFusion: true
    };
  }
  
  
  // CSS für die Animationen einfügen
  function insertFusionStyles() {
    if (!document.getElementById('fusionAnimationStyles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'fusionAnimationStyles';
      styleSheet.innerHTML = `
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 5px gold; }
          50% { transform: scale(1.05); box-shadow: 0 0 20px gold; }
          100% { transform: scale(1); box-shadow: 0 0 5px gold; }
        }
        
        @keyframes selectedPulse {
          0% { box-shadow: 0 0 10px gold; }
          50% { box-shadow: 0 0 25px gold; }
          100% { box-shadow: 0 0 10px gold; }
        }
        
        @keyframes spinAndZoom {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(0.6); }
          100% { transform: rotate(360deg) scale(1); }
        }
        
        @keyframes floatIn {
          0% { transform: translateY(50px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes glowPulse {
          0% { box-shadow: 0 0 15px gold; }
          50% { box-shadow: 0 0 50px gold; }
          100% { box-shadow: 0 0 15px gold; }
        }
        
        @keyframes cardFlip {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(180deg); }
        }
  
        @keyframes particleAnimation {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--end-x), var(--end-y)) scale(0); opacity: 0; }
        }
  
        .fusion-ready {
          animation: selectedPulse 1.5s infinite;
          border: 3px solid gold !important;
          transform: translateY(-10px);
          transition: all 0.3s ease;
        }
        
        .fusion-card {
          transition: all 0.5s ease;
          transform-style: preserve-3d;
          position: relative;
        }
        
        .fusion-card:hover {
          animation: pulse 1.5s infinite;
        }
  
        .fusion-result {
          animation: floatIn 0.8s ease-out, glowPulse 2s infinite;
          border: 3px solid gold !important;
        }
  
        .fusion-particle {
          position: absolute;
          width: 10px;
          height: 10px;
          background: gold;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          animation: particleAnimation 1s forwards;
        }
      `;
      document.head.appendChild(styleSheet);
    }
  }
  
  // Partikel-Effekte erstellen
  function createParticles(element, count) {
    const rect = element.getBoundingClientRect();
  
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.classList.add('fusion-particle');
  
      const startX = Math.random() * rect.width;
      const startY = Math.random() * rect.height;
  
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 100;
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;
  
      // Relative Position zum Elternelement
      particle.style.left = `${startX}px`;
      particle.style.top = `${startY}px`;
      particle.style.setProperty('--end-x', `${endX}px`);
      particle.style.setProperty('--end-y', `${endY}px`);
  
      const size = 3 + Math.random() * 8;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
  
      const colors = ['gold', '#FFD700', '#FFA500', '#FFDF00'];
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
  
      element.appendChild(particle); // statt document.body
  
      setTimeout(() => {
        particle.remove();
      }, 1000);
    }
  }
  
  
  // Energielinien zwischen Elementen erstellen
  function createEnergyLines(elementA, elementB, container) {
    const rectA = elementA.getBoundingClientRect();
    const rectB = elementB.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    const startX = rectA.left + rectA.width/2 - containerRect.left;
    const startY = rectA.top + rectA.height/2 - containerRect.top;
    const endX = rectB.left + rectB.width/2 - containerRect.left;
    const endY = rectB.top + rectB.height/2 - containerRect.top;
    
    // Mehrere Energielinien erstellen
    for (let i = 0; i < 5; i++) {
      const line = document.createElement('div');
      const lineWidth = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
      const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
      
      line.style = `
      position: absolute;
      left: ${startX}px;
      top: ${startY}px;
      width: 0px;
      height: 2px;
      background: linear-gradient(to right, gold, white);
      transform: rotate(${angle}deg);
      transform-origin: left center;
      opacity: 0.7;
      z-index: 10;
      transition: width 0.8s ease;
    `;
    
      
      container.appendChild(line);
      
      // Leicht verzögerte Animation für jede Linie
      setTimeout(() => {
        line.style.width = `${lineWidth}px`;
        
        // Pulsieren hinzufügen
        let opacity = 0.7;
        let growing = false;
        
        const pulse = setInterval(() => {
          if (growing) {
            opacity += 0.05;
            if (opacity >= 0.9) growing = false;
          } else {
            opacity -= 0.05;
            if (opacity <= 0.5) growing = true;
          }
          
          line.style.opacity = opacity.toString();
        }, 50);
        
        // Bereinigen nach der Animation
        setTimeout(() => {
          clearInterval(pulse);
          line.remove();
        }, 2300);
      }, i * 150);
    }
  }
  
  function showFusionModal() {
    if (upgradeContainerElem) upgradeContainerElem.style.display = 'none';
    const existing = document.getElementById('fusionOverlay');
    if (existing) existing.remove();
  
    // CSS für die Animationen einfügen
    insertFusionStyles();
  
    const overlay = document.createElement('div');
    overlay.id = 'fusionOverlay';
    overlay.style = `
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background-color: rgba(0, 0, 0, 0.8);
      z-index: 999;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      transition: background-color 0.5s ease;
    `;
  
    const container = document.createElement('div');
    container.id = 'fusionModal';
    container.style = `
      background: linear-gradient(135deg, #1a1a24 0%, #2d2d40 100%);
      padding: 30px;
      border: 2px solid gold;
      border-radius: 12px;
      max-width: 850px;
      max-height: 80vh;
      overflow-y: auto;
      color: white;
      text-align: center;
      box-shadow: 0 0 25px rgba(255, 215, 0, 0.5);
      transition: all 0.5s ease;
    `;
  
    const title = document.createElement('h3');
    title.innerHTML = '🧬 <span style="background: linear-gradient(to right, #FFD700, #FFA500); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Wähle 2 Karten zur Fusion</span>';
    title.style = `
      margin-bottom: 20px;
      font-size: 24px;
      text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
    `;
  
    const cardList = document.createElement('div');
    cardList.style = `
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      justify-content: center;
      padding: 10px;
    `;

    container.style.position = 'relative';

    const excludedIds = [15, 17, 18, 19, 22, 23, 21, 26];
    const baseCards = CARD_TYPES.filter(c =>
        state.unlockedCardIds.has(c.id) &&
        !String(c.id).startsWith('fusion-') &&
        !excludedIds.includes(c.id)
    );    
      
    if (baseCards.length < 2) {
      const message = document.createElement('p');
      message.textContent = 'Nicht genug Karten für eine Fusion.';
      container.appendChild(title);
      container.appendChild(message);
      overlay.appendChild(container);
      document.body.appendChild(overlay);
      return;
    }
  
    shuffleArray(baseCards);
  
    // Sicherstellen, dass genau 4 Karten angezeigt werden – ggf. duplizieren
    const shownCards = [];
    while (shownCards.length < 4) {
      const card = baseCards[shownCards.length % baseCards.length];
      shownCards.push(card);
    }
  
    // Notwendige Variablen für die Animation
    const fusionData = {
      selectedCards: [],
      cardElements: []
    };
  
    shownCards.forEach(card => {
      const cardDiv = createCardElement(card);
      cardDiv.classList.add('fusion-card');
      cardDiv.style = `
        cursor: pointer;
        transition: all 0.3s ease;
        border: 2px solid #555;
        border-radius: 8px;
        position: relative;
        overflow: hidden;
      `;
      
      // Speichere die Referenz auf die Karte
      cardDiv.cardData = card;
      
      // Hinzufügen eines subtilen Glow-Effekts
      cardDiv.addEventListener('mouseenter', () => {
        cardDiv.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.3)';
      });
      
      cardDiv.addEventListener('mouseleave', () => {
        cardDiv.style.boxShadow = 'none';
      });
  
      cardDiv.addEventListener('click', () => {
        if (fusionData.selectedCards.includes(card)) {
          // Karte abwählen
          fusionData.selectedCards.splice(fusionData.selectedCards.indexOf(card), 1);
          cardDiv.classList.remove('fusion-ready');
        } else if (fusionData.selectedCards.length < 2) {
          // Karte auswählen
          fusionData.selectedCards.push(card);
          cardDiv.classList.add('fusion-ready');
          
          // Hinzufügen von Partikeleffekten beim Auswählen
          createParticles(cardDiv, 15);
          
          // Wenn zwei Karten ausgewählt sind, starte die Animation
          if (fusionData.selectedCards.length === 2) {
            console.log("Zwei Karten ausgewählt:", fusionData.selectedCards);
            // Kurze Verzögerung vor dem Start der Animation
            setTimeout(() => {
              animateFusion(fusionData.selectedCards, fusionData.cardElements, overlay, container, cardList, title);
            }, 300);
          }
        }
      });
  
      fusionData.cardElements.push(cardDiv);
      cardList.appendChild(cardDiv);
    });
  
    container.appendChild(title);
    container.appendChild(cardList);
    overlay.appendChild(container);
    document.body.appendChild(overlay);
  }
  
  function animateFusion(selectedCards, cardElements, overlay, container, cardList, title) {
    console.log("Animation gestartet mit:", selectedCards);
    
    // Finde die ausgewählten Elemente
    const selectedElements = cardElements.filter(elem => selectedCards.includes(elem.cardData));
    
    if (selectedElements.length !== 2) {
      console.error("Nicht genug ausgewählte Elemente gefunden:", selectedElements.length);
      return;
    }
    
    console.log("Ausgewählte Elemente:", selectedElements);
  
    // Nicht ausgewählte Karten verstecken
    cardElements.forEach(elem => {
      if (!selectedElements.includes(elem)) {
        elem.style.opacity = '0';
        elem.style.transform = 'scale(0.8)';
        elem.style.pointerEvents = 'none';
      }
    });
  
    // Container-Animation
    container.style.boxShadow = '0 0 50px gold';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    
    // Titel ändern
    title.innerHTML = '🧬 <span style="background: linear-gradient(to right, #FFD700, #FFA500); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Fusion läuft...</span>';
    
    // Karten zur Mitte bewegen
    cardList.style.height = `${cardList.offsetHeight}px`; // Höhe fixieren
    
    selectedElements[0].style.transition = 'all 1s ease';
    selectedElements[1].style.transition = 'all 1s ease';
    
    setTimeout(() => {
      // Erste Karte links positionieren
      selectedElements[0].style.transform = 'translateX(-100px)';
      // Zweite Karte rechts positionieren
      selectedElements[1].style.transform = 'translateX(100px)';
      
      // Intensiveres Leuchten hinzufügen
      selectedElements.forEach(elem => {
        elem.style.boxShadow = '0 0 30px gold';
      });
      
      // Fusionskreis in der Mitte erstellen
      const fusionCircle = document.createElement('div');
      fusionCircle.style = `
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) scale(0);
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: radial-gradient(circle, gold, transparent);
        box-shadow: 0 0 50px gold;
        z-index: 10;
        opacity: 0;
        transition: all 0.8s ease;
      `;
      cardList.appendChild(fusionCircle);
      
      // Energielinien zwischen den Karten erstellen
     // createEnergyLines(selectedElements[0], selectedElements[1], cardList);
      
      setTimeout(() => {
        fusionCircle.style.transform = 'translate(-50%, -50%) scale(1)';
        fusionCircle.style.opacity = '1';
        
        // Massenhafte Partikel erzeugen
        for (let i = 0; i < 50; i++) {
          setTimeout(() => {
            createParticles(fusionCircle, 3);
          }, i * 20);
        }
        
        setTimeout(() => {
          // Karten zur Mitte bewegen und verblassen
          selectedElements.forEach(elem => {
            elem.style.transform = 'translate(0, 0) scale(0.8)';
            elem.style.opacity = '0';
          });
          
          // Fusionskreis wachsen lassen
          fusionCircle.style.transform = 'translate(-50%, -50%) scale(2)';
          fusionCircle.style.boxShadow = '0 0 100px gold';
          
          setTimeout(() => {
            // Fusionsergebnis erstellen
            const fusedCard = fuseCards(selectedCards[0], selectedCards[1]);
            
            // Fusion durchführen im Spielzustand
            state.player.deck = state.player.deck.filter(c => 
              c !== selectedCards[0] && c !== selectedCards[1]
            );
            state.player.deck.push(fusedCard);
            
            // Fusionsergebnis anzeigen
            fusionCircle.style.opacity = '0';
            selectedElements.forEach(elem => elem.remove());
            
            const resultCardElement = createCardElement(fusedCard);
            resultCardElement.classList.add('fusion-result');
            resultCardElement.style = `
              transform: scale(0);
              opacity: 0;
              transition: all 0.8s ease;
              border: 3px solid gold;
              border-radius: 8px;
              box-shadow: 0 0 30px gold;
            `;
            
            // Alten Inhalt leeren und Ergebnis einfügen
            while (cardList.firstChild) {
              cardList.firstChild.remove();
            }
            
            title.innerHTML = '🧬 <span style="background: linear-gradient(to right, #FFD700, #FFA500); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Fusion komplett!</span>';
            
            cardList.appendChild(resultCardElement);
            
            setTimeout(() => {
              resultCardElement.style.transform = 'scale(1.2)';
              resultCardElement.style.opacity = '1';
              
              // Finale Partikelexplosion
              createParticles(resultCardElement, 30);
              
              // Logmeldung
              logMessage(`🧬 Fusioniert: ${fusedCard.name}`, 'system');
              
              // Nach 2 Sekunden ausblenden
              setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => {
                  overlay.remove();
                  updateUIDisplay();
                  updateHandUI();
                  endUpgrade();
                }, 500);
              }, 2000);
            }, 200);
          }, 1600);
        }, 1000);
      }, 100);
    }, 500);
  }
  
  window.showFusionModal = showFusionModal;
  window.fuseCards = fuseCards;