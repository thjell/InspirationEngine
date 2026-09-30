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
          <svg class="ie-widget-wheel-label" viewBox="0 0 220 120" aria-hidden="true" focusable="false">
            <defs>
              <path id="ieWheelTitlePath" d="M 20 82 A 90 90 0 0 1 200 82" />
            </defs>
            <text>
              <textPath href="#ieWheelTitlePath" startOffset="50%" text-anchor="middle">
                FINN UKENS TILBUD
              </textPath>
            </text>
          </svg>
          <span class="ie-widget-badge" aria-hidden="true"></span>
        </div>
      </div>
    </div>

    <div class="ie-widget-body">
      <p class="ie-widget-copy">Finn et tilbud som passer deg</p>

      <div class="ie-widget-option-group">
        <div class="ie-widget-option-label">Interessert i</div>
        <div class="ie-widget-option-list ie-interest-group">
          <button class="ie-widget-chip selected" type="button" data-group="interest" data-value="Gaming">
            <span class="ie-widget-chip-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 9.5h9a3 3 0 0 1 3 3v1.5a3 3 0 0 1-3 3h-1.2a2 2 0 0 1-1.8-1.1L12.5 12l-1.8 3.9A2 2 0 0 1 8.9 17H7.5a3 3 0 0 1-3-3V12.5a3 3 0 0 1 3-3Zm2.2 5.6h.1M9 7.5V6m6 1.5V6"/></svg>
            </span>
            <span class="ie-widget-chip-text">Gaming</span>
          </button>
          <button class="ie-widget-chip" type="button" data-group="interest" data-value="TV & lyd">
            <span class="ie-widget-chip-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="12" rx="2"/><path d="M8 19h8M10 9h4v6h-4z"/></svg>
            </span>
            <span class="ie-widget-chip-text">TV & lyd</span>
          </button>
          <button class="ie-widget-chip" type="button" data-group="interest" data-value="Data">
            <span class="ie-widget-chip-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="14" height="10" rx="2"/><path d="M9 19h6M12 15v4"/></svg>
            </span>
            <span class="ie-widget-chip-text">Data</span>
          </button>
          <button class="ie-widget-chip" type="button" data-group="interest" data-value="Mobil">
            <span class="ie-widget-chip-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M10 18h4"/></svg>
            </span>
            <span class="ie-widget-chip-text">Mobil</span>
          </button>
          <button class="ie-widget-chip" type="button" data-group="interest" data-value="Hjem">
            <span class="ie-widget-chip-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10.5V20h14v-9.5"/></svg>
            </span>
            <span class="ie-widget-chip-text">Hjem</span>
          </button>
          <button class="ie-widget-chip" type="button" data-group="interest" data-value="Overrask meg">
            <span class="ie-widget-chip-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 11.5c0-2.5 2-4.5 4.5-4.5a4 4 0 0 1 4 2.5 4 4 0 0 1 4-2.5c2.5 0 4.5 2 4.5 4.5 0 5-8 8.5-8 8.5S4.5 16.5 4.5 11.5Z"/><path d="M12 8.5v4.5"/><path d="M9.5 11h5"/></svg>
            </span>
            <span class="ie-widget-chip-text">Overrask meg</span>
          </button>
        </div>
      </div>

      <div class="ie-widget-option-group">
        <div class="ie-widget-option-label">Budsjett</div>
        <div class="ie-widget-option-list ie-budget-group">
          <button class="ie-widget-chip" type="button" data-group="budget" data-value="under-1000">Under 1 000</button>
          <button class="ie-widget-chip" type="button" data-group="budget" data-value="1000-5000">1 000–5 000</button>
          <button class="ie-widget-chip" type="button" data-group="budget" data-value="5000-plus">5 000+</button>
          <button class="ie-widget-chip selected" type="button" data-group="budget" data-value="any">Alle</button>
        </div>
      </div>

      <div class="cta-wrapper">
        <button class="ie-widget-cta" type="button">SPINN</button>
      </div>
      <div class="ie-widget-status" aria-live="polite"></div>
    </div>
  `;

  shell.appendChild(card);
  target.appendChild(shell);

  applyThemeVariables(shell, theme);

  const toggleButton = shell.querySelector(".ie-widget-toggle");
  const header = shell.querySelector(".ie-widget-header");
  const spinButton = shell.querySelector(".ie-widget-cta");
  const statusText = shell.querySelector(".ie-widget-status");
  const interestChips = shell.querySelectorAll(".ie-widget-chip[data-group='interest']");
  const budgetChips = shell.querySelectorAll(".ie-widget-chip[data-group='budget']");

  let selectedInterest = initialInterest;
  let selectedBudget = initialBudget;

  const applyChipSelection = (group, value) => {
    const collection = group === "interest" ? interestChips : budgetChips;
    collection.forEach((chip) => {
      const isSelected = chip.dataset.value === value;
      chip.classList.toggle("selected", isSelected);
      chip.setAttribute("aria-pressed", String(isSelected));
    });
    if (group === "interest") {
      selectedInterest = value;
    } else {
      selectedBudget = value;
    }
  };

  interestChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      applyChipSelection("interest", chip.dataset.value);
    });
  });

  budgetChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      applyChipSelection("budget", chip.dataset.value);
    });
  });

  applyChipSelection("interest", selectedInterest);
  applyChipSelection("budget", selectedBudget);

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
    const clickedInsideWidget = event.target.closest(".ie-widget-card");
    if (shell.classList.contains("expanded") && !clickedInsideWidget) {
      closeWidget();
      return;
    }

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
    statusText.textContent = `${selectedInterest} • ${selectedBudget}`;

    if (typeof onSpin === "function") {
      onSpin({ interest: selectedInterest, budget: selectedBudget });
    }
  });

  setExpanded(false);

  return shell;
}
