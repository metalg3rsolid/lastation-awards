let config = null;
let step = 0;
let votes = {};
let username = "";

const $ = (id) => document.getElementById(id);

async function loadConfig() {
  const res = await fetch("/api/config");
  config = await res.json();

  $("title").textContent = config.title;
  $("subtitle").textContent = config.subtitle;

  const date = new Date(config.deadline);
  $("deadlineText").textContent = date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short"
  }).toUpperCase();
}

function showError(message) {
  $("errorText").textContent = message;
  $("errorPanel").classList.remove("hidden");
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

function renderStep() {
  const category = config.categories[step];
  $("progress").textContent = `${step + 1}/${config.categories.length}`;

  $("categoryWrap").innerHTML = `
    <div class="category-card">
      <div class="category-number">Catégorie ${step + 1}</div>
      <h3>${escapeHtml(category.title)}</h3>
      <p>${escapeHtml(category.description)}</p>
      <select id="choice">
        <option value="">Choisis quelqu'un</option>
        ${config.participants.map(p => `
          <option value="${escapeAttr(p)}" ${votes[category.id] === p ? "selected" : ""}>
            ${escapeHtml(p)}
          </option>
        `).join("")}
      </select>
    </div>
  `;

  $("prevBtn").disabled = step === 0;
  $("nextBtn").classList.toggle("hidden", step === config.categories.length - 1);
  $("submitBtn").classList.toggle("hidden", step !== config.categories.length - 1);

  $("choice").addEventListener("change", (e) => {
    votes[category.id] = e.target.value;
  });
}

function startVote() {
  username = $("username").value.trim();

  if (username.length < 2) {
    showError("Mets un pseudo Discord valide.");
    return;
  }

  $("introPanel").classList.add("hidden");
  $("voteForm").classList.remove("hidden");
  renderStep();
}

function saveCurrentChoice() {
  const category = config.categories[step];
  const choice = $("choice");
  if (choice) votes[category.id] = choice.value;
}

async function submitVotes(e) {
  e.preventDefault();
  saveCurrentChoice();

  const missing = config.categories.filter(cat => !votes[cat.id]);
  if (missing.length > 0) {
    showError("Tu dois voter dans toutes les catégories.");
    return;
  }

  $("submitBtn").disabled = true;
  $("submitBtn").textContent = "Envoi...";

  const res = await fetch("/api/vote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, votes })
  });

  const data = await res.json();

  if (!res.ok) {
    $("submitBtn").disabled = false;
    $("submitBtn").textContent = "Valider mes votes";
    showError(data.message || "Erreur.");
    return;
  }

  $("voteForm").classList.add("hidden");
  $("donePanel").classList.remove("hidden");
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(str) {
  return escapeHtml(str).replaceAll("`", "&#096;");
}

$("startBtn").addEventListener("click", startVote);

$("prevBtn").addEventListener("click", () => {
  saveCurrentChoice();
  if (step > 0) {
    step--;
    renderStep();
  }
});

$("nextBtn").addEventListener("click", () => {
  saveCurrentChoice();
  if (!votes[config.categories[step].id]) {
    showError("Choisis quelqu'un avant de continuer.");
    return;
  }
  if (step < config.categories.length - 1) {
    step++;
    renderStep();
  }
});

$("voteForm").addEventListener("submit", submitVotes);

loadConfig().catch(() => showError("Impossible de charger le site."));
