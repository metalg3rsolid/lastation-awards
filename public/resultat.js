const medals = ["🥇", "🥈", "🥉"];

async function loadResults() {

  const res = await fetch("/api/results");
  const data = await res.json();

  const container = document.getElementById("resultsContainer");

  let html = "";

  data.forEach((category, index) => {

    html += `
      <div class="panel reveal-card" onclick="reveal(${index})">

        <div class="badge">
          CATÉGORIE ${index + 1}
        </div>

        <h2>${category.name}</h2>

        <p class="hidden-text">
          Clique pour découvrir le vainqueur...
        </p>

        <div class="winner-box" id="cat-${index}">

          ${category.top3.map((user, i) => `
            <div class="winner">
              <div>
                <span class="medal">${medals[i]}</span>
                ${user.name}
              </div>

              <div>
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

function reveal(index){

  const box = document.getElementById(`cat-${index}`);

  if(box.style.display === "block"){
    box.style.display = "none";
  } else {
    box.style.display = "block";
  }
}

loadResults();
