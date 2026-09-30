import { applyThemeVariables, themeConfig } from "../../src/theme/themeConfig.js";

export function createWidgetShell({
  target = document.body,
  theme = themeConfig,
  title = "Finn ukens kupp",
  initialInterest = "Gaming",
  initialBudget = "any",
  onSpin = null
} = {}) {
  const shell = document.createElement("aside");
  shell.className = "ie-widget-shell collapsed";
  shell.setAttribute("aria-live", "polite");

  const card = document.createElement("div");
  card.className = "ie-widget-card";

  card.innerHTML = `
    <div class="ie-widget-header">
      <div class="ie-widget-label">
        <div class="ie-widget-wheel-wrap">
          <div class="ie-widget-wheel-label" aria-hidden="true">FINN UKENS KUPP</div>
          <span class="ie-widget-badge" aria-hidden="true"></span>
        </div>
      </div>
    </div>

    <div class="ie-widget-body">
      <p class="ie-widget-copy">Finn et kupp som passer deg.</p>

      <div class="ie-widget-controls">
        <div class="ie-widget-field">
          <label for="ie-interest">Interessert i</label>
          <select id="ie-interest" class="ie-widget-select">
            <option value="Gaming" selected>Gaming</option>
            <option value="TV & Audio">TV & Audio</option>
            <option value="Computers">Computers</option>
            <option value="Mobile">Mobile</option>
            <option value="Home">Home</option>
            <option value="Surprise me">Surprise me</option>
          </select>
        </div>

        <div class="ie-widget-field">
          <label for="ie-budget">Budsjett</label>
          <select id="ie-budget" class="ie-widget-select">
            <option value="under-1000">Under 1 000</option>
            <option value="1000-5000">1 000–5 000</option>
            <option value="5000-plus">5 000+</option>
            <option value="any" selected>Valgfritt</option>
          </select>
        </div>

        <button class="ie-widget-cta" type="button">SPINN</button>
        <div class="ie-widget-status" aria-live="polite"></div>
      </div>
    </div>
  `;

  shell.appendChild(card);
  target.appendChild(shell);

  applyThemeVariables(shell, theme);

  const toggleButton = shell.querySelector(".ie-widget-toggle");
  const header = shell.querySelector(".ie-widget-header");
  const spinButton = shell.querySelector(".ie-widget-cta");
  const interestSelect = shell.querySelector("#ie-interest");
  const budgetSelect = shell.querySelector("#ie-budget");
  const statusText = shell.querySelector(".ie-widget-status");

  interestSelect.value = initialInterest;
  budgetSelect.value = initialBudget;

  const setExpanded = (isExpanded) => {
    shell.classList.toggle("expanded", isExpanded);
    shell.classList.toggle("collapsed", !isExpanded);
    if (toggleButton) {
      toggleButton.setAttribute("aria-expanded", String(isExpanded));
    }
  };

  const openWidget = () => {
    if (!shell.classList.contains("expanded")) {
      setExpanded(true);
    }
  };

  const closeWidget = () => {
    if (shell.classList.contains("expanded")) {
      setExpanded(false);
    }
  };

  header.addEventListener("click", (event) => {
    if (event.target.closest(".ie-widget-cta")) return;
    if (event.target.closest("select")) return;
    if (shell.classList.contains("collapsed")) {
      openWidget();
    }
  });

  document.addEventListener("click", (event) => {
    if (!shell.contains(event.target)) {
      closeWidget();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeWidget();
    }
  });

  spinButton.addEventListener("click", () => {
    const interest = interestSelect.value;
    const budget = budgetSelect.value;

    statusText.textContent = `${interest} • ${budget}`;

    if (typeof onSpin === "function") {
      onSpin({ interest, budget });
    }
  });

  setExpanded(false);

  return shell;
}
