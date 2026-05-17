const medals = ["🥇", "🥈", "🥉"];

function playRevealSound() {
  const audio = new AudioContext();

  const osc = audio.createOscillator();
  const gain = audio.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(440, audio.currentTime);
  osc.frequency.exponentialRampToValueAtTime(880, audio.currentTime + 0.12);

  gain.gain.setValueAtTime(0.12, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.22);

  osc.connect(gain);
  gain.connect(audio.destination);

  osc.start();
  osc.stop(audio.currentTime + 0.22);
}

async function loadResults() {
  const res = await fetch("/api/vote?public=results");
  const data = await res.json();

  const container = document.getElementById("resultsContainer");

  if (!Array.isArray(data)) {
    container.innerHTML = `
      <div class="panel">
        <h2>Erreur</h2>
        <p>Impossible de charger les résultats.</p>
      </div>
    `;
    return;
  }

  let html = "";

  data.forEach((category, index) => {
    if (!category.top3 || category.top3.length === 0) return;

    html += `
      <div class="panel result-card" onclick="reveal(${index})">

        <div class="badge">
          CATÉGORIE ${index + 1}
        </div>

        <h2>${category.name}</h2>

        <p class="hint">
          Clique pour découvrir le vainqueur...
        </p>

        <div class="winner-box" id="cat-${index}">
          ${category.top3.map((user, i) => `
            <div class="winner">
              <div class="winner-name">
                <span class="medal">${medals[i]}</span>
                <span>${user.name}</span>
              </div>

              <div class="winner-votes">
                ${user.votes} votes
              </div>
            </div>
          `).join("")}
        </div>

      </div>
    `;
  });

  container.innerHTML = html;
}

function reveal(index) {
  const box = document.getElementById(`cat-${index}`);
  box.classList.toggle("open");

  if (box.classList.contains("open")) {
    playRevealSound();
  }
}

loadResults();
