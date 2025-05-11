window.CARD_TYPES = [
    // ... (deine Kartendefinitionen bleiben hier unverändert) ...
                 { id: 1, name: 'Schwert', icon: '⚔️', description: 'Ein einfaches Schwert.', power: 5, effect: 'damage', manaCost: 2, weight: 11, tags: ['damage'] },
                 { id: 2, name: 'Schild', icon: '🛡️', description: 'Erhalte 5 Block', power: 5, effect: 'block', manaCost: 2, weight: 1 },
                 { id: 3, name: 'Heilung', icon: '❤️', description: 'Heilt 8 Leben', power: 8, effect: 'heal', manaCost: 3, weight: 1 },
                 { id: 4, name: 'Gift', icon: '☠️', description: 'Vergiftung (3 Schaden, 3 Rd.)', power: 3, duration: 3, effect: 'poison', manaCost: 2, weight: 1 },
                 { id: 5, name: 'Blitz', icon: '⚡', description: '12 Schaden, Paralysiert Gegner zu 45% (Halbiert den Angriff 2 Runden)', power: 12, effect: 'damage_paralyze', manaCost: 4, weight: 2 },
                 { id: 6, name: 'Großer Schlag', icon: '💥', description: 'Fügt 15 Schaden zu', power: 15, effect: 'damage', manaCost: 4, weight: 2 },
                 { id: 7, name: 'Meditieren', icon: '🧘', description: 'Ziehe 1 Karte', power: 1, effect: 'draw', manaCost: 0, weight: 1 },
                 { id: 8, name: 'Vampirbiss', icon: '🧛', description: '8 Schaden, heilt 8', power: 8, healAmount: 8, effect: 'lifesteal', manaCost: 4, weight: 2 }, // Direkte Heilung statt %
                 { id: 9, name: 'Manatrank', icon: '🧪', description: 'Erhalte 2 Mana', power: 2, effect: 'gain_mana', manaCost: 0, weight: 3 },
                 { id: 10, name: 'Fokus', icon: '🎯', description: 'Ziehe 2 Karten', power: 2, effect: 'draw', manaCost: 1, weight: 1 },
                 { id: 11, name: 'Heilige Macht', icon: '✨', description: 'Fügt 25 Schaden zu', power: 25, effect: 'damage', manaCost: 6, weight: 1 },
                 { id: 12, name: 'Genesung', icon: '💖', description: 'Heilt 15 Leben', power: 15, effect: 'heal', manaCost: 5, weight: 1 },
                 {id: 13, name: 'Feuerpfeil', icon: '🔥', description: 'Fügt 12 Schaden zu. 50% Chance auf Verbrennung (5 Schaden für 2 Runden).', power: 12, effect: 'firearrow', manaCost: 5, weight: 2},
                 {id: 14, name: 'Gambler’s Luck', icon: '🎲', description: 'Gegner nimmt 5 Schaden und du erhältst 100 Gold (Ignoriert Block) oder Du nimmst 5 Schaden.', power: 5, effect: 'gamble', manaCost: 0, weight: 1},
                 { id: 15, name: 'Kraft Sammeln', icon: '🔋', description: 'Heilt dich um dein gesamtes Mana.<br><br>Einmaliger Schadensboost i.H.v. Manakosten -1', power: 0, effect: 'power_surge', manaCost: 'X', weight: 1 },
                 {id: 16, name: 'Klingenwirbel', icon: '🌀', description: 'Greift mehrere Gegner gleichzeitig an. (Ignoriert Block.)', power: 8, effect: 'whirlwind', manaCost: 3, weight: 2},
                 {id: 17, name: 'Todesklinge', icon: '⚔️', description: 'Die stärkste aller Schwerter. 25 Schaden.', power: 25, effect: 'damage', manaCost: 4, weight: 1, tags: ['sword'], rarity: 'superrare'},
                 {id: 18, name: 'Mana Oase', icon: '🧪', description: 'Erhalte 5 Mana', power: 5, effect: 'gain_mana', manaCost: 0, weight: 1, rarity: 'superrare'},
                 {id: 19, name: 'Blutrausch', icon: '🧛', description: '20 Schaden, heilt 12', power: 20, healAmount: 12, effect: 'lifesteal', manaCost: 7, weight: 1, rarity: 'superrare'},
                 {id: 20, name: 'Unwetter', icon: '🌩️', description: 'Paralysiere den Gegner (Halbiert den Angriff 2 Runden)', power: 0, effect: 'paralyze', manaCost: 1, weight: 2 },
                 {id: 21, name: 'Ansturm', icon: '🐗', description: 'Ein Rücksichtsloser Angriff, 15 schaden aber 5 Schaden Rückstoß', power: 15, selfDamage: 5, effect: 'damage_selfhit', manaCost: 3, weight: 1 },
                 {id: 22, name: 'Tornado', icon: '🌪️', description: 'Kann 2-3x treffen je 5 Schaden. Umgeht Block', power: 5, effect: 'multi_hit', hits: 3, minHits: 2, manaCost: 3, weight: 2 },
                 {id: 23, name: 'The Knive', icon: '🗡️', description: 'Verursacht Blutungen. Der Gegner bekommt durch The Knive doppelten Schaden bis zum Tod', power: 12, effect: 'bleed', manaCost: 4, weight: 3 },
                 {id: 24, name: 'Biohazard', icon: '☣️', description: 'Verursacht Schwere Vergiftung.(7 Schaden, 3 Rd.)', power: 7, duration: 3, effect: 'poison', manaCost: 4, weight: 1 },
                 { id: 25, name: 'Grande Schild', icon: '🔰', description: 'Erhalte 15 Block', power: 15, effect: 'block', manaCost: 4, weight: 1 },
                 {id: 26, name: 'Rage', icon: '💢', description: 'Kann bis zu 3-5x treffen je 5 Schaden. Umgeht Block', power: 5, effect: 'multi_hit', hits: 5, minHits: 3, manaCost: 5, weight: 2 },
                 {id: 27, name: 'Slash', icon: '🥏', description: 'Ein schwacher aber effizienter Angriff', power: 2, effect: 'damage', manaCost: 0, weight: 2 },
                 {id: 28, name: 'Konter', icon: '💫', description: 'Beendet deinen Zug. Kontert mit 120% des erlittenen Angriffs.', effect: 'counter', manaCost: 5, weight: 1 },
];

window.cards = window.CARD_TYPES;
localStorage.setItem('allCards', JSON.stringify(window.CARD_TYPES));