const medals = ["🥇", "🥈", "🥉"];
const revealSound = new Audio("/applause.mp3");

function playRevealSound() {
  revealSound.currentTime = 0;
  revealSound.volume = 0.55;
  revealSound.play().catch(() => {});
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

    const orderedReveal = [...category.top3].reverse();

    html += `
      <div class="panel result-card" onclick="reveal(${index})">
        <div class="badge">CATÉGORIE ${index + 1}</div>

        <h2>${category.name}</h2>

        <p class="hint" id="hint-${index}">
          Clique pour découvrir le classement...
        </p>

        <div class="winner-box" id="cat-${index}">
          ${orderedReveal.map((user, i) => {
            const realRank = category.top3.length - i - 1;

            return `
              <div class="winner delayed-winner delay-${i}">
                <div class="winner-name">
                  <span class="medal">${medals[realRank]}</span>
                  <span>${user.name}</span>
                </div>

                <div class="winner-votes">
                  ${user.votes} votes
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function reveal(index) {
  const box = document.getElementById(`cat-${index}`);
  const hint = document.getElementById(`hint-${index}`);

  if (box.classList.contains("open")) {
    box.classList.remove("open");
    hint.textContent = "Clique pour découvrir le classement...";
    return;
  }

  box.classList.add("open");
  hint.textContent = "Révélation du top 3...";
  playRevealSound();
}

loadResults();
