const achievements = [
  { id: 'freeGift', name: 'Willkommensgeschenk', desc: 'Ein Geschenk nur für dich!', gems: 5 },
  { id: 'goblin100', name: 'Goblinkiller', desc: 'Besiege 50 Goblins.', gems: 15 },
  { id: 'dragonHunter', name: 'Drachenjäger', desc: 'Besiege 10 Drachen.', gems: 50 },
  { id: 'bagdoDown', name: 'Bagdo Bezwinger', desc: 'Besiege Bagdo im Kampf.', gems: 75 },
];

function openAchievementsModal() {
  const container = document.getElementById('achievementList');
  const unlocked = new Set(JSON.parse(localStorage.getItem('unlockedAchievements') || '[]'));
  const claimed = new Set(JSON.parse(localStorage.getItem('claimedAchievements') || '[]'));

  const goblinKills = parseInt(localStorage.getItem('goblinKills') || '0');
  const dragonKills = parseInt(localStorage.getItem('dragonKills') || '0');

  container.innerHTML = `
    <h2 style="font-size: 28px; color: gold; margin-bottom: 20px;">🏆 Erfolge & Belohnungen</h2>
    ${achievements.map(ach => {
      const isUnlocked = unlocked.has(ach.id);
      const isClaimed = claimed.has(ach.id);

      // Dynamische Fortschrittsanzeige je nach ID
      let progressText = '';
      if (ach.id === 'goblin100') {
       progressText = `<br/><small style="color:#888;">Fortschritt: ${goblinKills}/50 Goblins</small>`;
      }
      if (ach.id === 'dragonHunter') {
        progressText = `<br/><small style="color:#888;">Fortschritt: ${dragonKills}/10 Drachen</small>`;
      }

      return `
        <div style="
          padding: 18px;
          margin-bottom: 14px;
          border-radius: 14px;
          background: ${isUnlocked ? '#222' : '#111'};
          border: 3px solid ${isUnlocked ? (isClaimed ? '#444' : 'gold') : '#333'};
          box-shadow: ${isUnlocked ? '0 0 15px rgba(255, 215, 0, 0.4)' : 'none'};
          font-size: 18px;
          text-align: left;
        ">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong style="color: ${isUnlocked ? 'gold' : '#666'}; font-size: 20px;">${ach.name}</strong><br/>
              <span style="color: #ccc; font-size: 15px;">${ach.desc}</span>
              ${progressText}
            </div>
            <div style="text-align: center;">
              <div style="font-size: 20px; color: ${isUnlocked ? 'gold' : '#555'};">💎 ${ach.gems}</div>
              ${isUnlocked && !isClaimed ? `
                <button onclick="claimAchievement('${ach.id}', ${ach.gems})"
                  style="margin-top: 5px; padding: 10px 14px; font-size: 16px; border-radius: 10px;
                         border: none; background: gold; color: black; font-weight: bold; cursor: pointer;">
                  Abholen
                </button>
              ` : isClaimed ? `<div style="color: #0f0; font-size: 15px;">✅ Abgeholt</div>` : `<div style="color: #888;">🔒 Gesperrt</div>`}
            </div>
          </div>
        </div>
      `;
    }).join('')}
    <button onclick="closeAchievementsModal()" style="
      margin-top: 20px;
      padding: 12px 24px;
      font-size: 18px;
      font-weight: bold;
      border-radius: 10px;
      background: #555;
      color: white;
      border: 2px solid #999;
      cursor: pointer;
    ">Schließen</button>
  `;

  document.getElementById('achievementsModal').style.display = 'block';
}


function closeAchievementsModal() {
  const modal = document.getElementById('achievementsModal');
  if (modal) {
    modal.style.display = 'none';
  }
}
window.closeAchievementsModal = closeAchievementsModal;

// Immer ganz unten im achievements.js oder direkt im <script>, aber NACH der Definition
  function claimAchievement(id, gems) {
    const claimed = new Set(JSON.parse(localStorage.getItem('claimedAchievements') || '[]'));
    if (claimed.has(id)) return;

    claimed.add(id);
    localStorage.setItem('claimedAchievements', JSON.stringify([...claimed]));

    const currentGems = parseInt(localStorage.getItem('gems') || '0', 10);
    localStorage.setItem('gems', currentGems + gems);

    console.log(`🎁 ${gems} Gems erhalten für ${id}`);
    if (typeof updateGemDisplay === 'function') updateGemDisplay();

    openAchievementsModal(); // Neu rendern
  }

  function unlockAchievement(id) {
    const unlocked = new Set(JSON.parse(localStorage.getItem('unlockedAchievements') || '[]'));
    if (!unlocked.has(id)) {
      unlocked.add(id);
      localStorage.setItem('unlockedAchievements', JSON.stringify([...unlocked]));
      console.log("🏆 Achievement freigeschaltet:", id);
    }
  }

  // 🔓 MACH SIE GLOBAL VERFÜGBAR
  window.claimAchievement = claimAchievement;
  window.unlockAchievement = unlockAchievement;
