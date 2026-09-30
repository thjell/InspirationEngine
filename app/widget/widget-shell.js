import { applyThemeVariables, themeConfig } from "../../src/theme/themeConfig.js";
import { findRecommendedProducts } from "./products.js";

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

      <div class="ie-widget-results" hidden aria-live="polite">
        <div class="ie-widget-results-header">Anbefalt for deg</div>

        <div class="ie-widget-result-featured">
          <img class="ie-widget-result-image" alt="" />
          <div class="ie-widget-result-copy">
            <div class="ie-widget-result-kicker">Anbefalt for deg</div>
            <h3 class="ie-widget-result-name"></h3>
            <p class="ie-widget-result-description"></p>
            <div class="ie-widget-price-row">
              <span class="ie-widget-old-price"></span>
              <span class="ie-widget-new-price"></span>
            </div>
            <div class="ie-widget-result-savings"></div>
            <div class="ie-widget-result-actions">
              <button class="ie-widget-result-link" type="button">SE PRODUKT</button>
              <button class="ie-widget-reset-link" type="button">ENDRE FILTER</button>
            </div>
          </div>
        </div>

        <div class="ie-widget-alternatives-wrapper">
          <div class="ie-widget-alternatives-title">Andre forslag</div>
          <div class="ie-widget-alternatives"></div>
        </div>
      </div>
    </div>
  `;

  shell.appendChild(card);
  target.appendChild(shell);

  applyThemeVariables(shell, theme);

  const toggleButton = shell.querySelector(".ie-widget-toggle");
  const header = shell.querySelector(".ie-widget-header");
  const spinButton = shell.querySelector(".ie-widget-cta");
  const wheel = shell.querySelector(".ie-widget-badge");
  const body = shell.querySelector(".ie-widget-body");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const statusText = shell.querySelector(".ie-widget-status");
  const resultsContainer = shell.querySelector(".ie-widget-results");
  const featuredImage = shell.querySelector(".ie-widget-result-image");
  const featuredName = shell.querySelector(".ie-widget-result-name");
  const featuredDescription = shell.querySelector(".ie-widget-result-description");
  const featuredOldPrice = shell.querySelector(".ie-widget-old-price");
  const featuredNewPrice = shell.querySelector(".ie-widget-new-price");
  const featuredSavings = shell.querySelector(".ie-widget-result-savings");
  const featuredLink = shell.querySelector(".ie-widget-result-link");
  const resetFilterButton = shell.querySelector(".ie-widget-reset-link");
  const alternativesContainer = shell.querySelector(".ie-widget-alternatives");
  const interestChips = shell.querySelectorAll(".ie-widget-chip[data-group='interest']");
  const budgetChips = shell.querySelectorAll(".ie-widget-chip[data-group='budget']");

  let selectedInterest = initialInterest;
  let selectedBudget = initialBudget;
  let widgetState = "initial";
  let storedScrollY = 0;
  let spinAnimation = null;
  let spinTimer = null;
  let transitionVersion = 0;
  let isTransitioning = false;

  // Measure the new content inside the existing composition, then grow/shrink it.
  const transitionView = async (update) => {
    const version = ++transitionVersion;
    isTransitioning = true;
    const oldHeight = body.getBoundingClientRect().height;
    if (!reducedMotion.matches) {
      await body.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 140, fill: "forwards"
      }).finished.catch(() => {});
    }
    if (version !== transitionVersion) return;
    update();
    const newHeight = body.getBoundingClientRect().height;
    body.getAnimations().forEach((animation) => animation.cancel());
    if (!reducedMotion.matches) {
      body.style.clipPath = "inset(-10px -50px 0)";
      const resize = body.animate([
        { height: `${oldHeight}px` }, { height: `${newHeight}px` }
      ], { duration: 420, easing: "cubic-bezier(.22, 1, .36, 1)" });
      body.animate([
        { opacity: 0, transform: "translateY(6px)" },
        { opacity: 1, transform: "translateY(0)" }
      ], { duration: 320, delay: 100, fill: "backwards", easing: "ease-out" });
      await resize.finished.catch(() => {});
    }
    if (version !== transitionVersion) return;
    body.style.clipPath = "";
    isTransitioning = false;
  };

  const resumeIdleRotation = () => {
    const angle = Number(wheel.dataset.angle || 0);
    wheel.style.animationName = "none";
    wheel.style.animationDelay = `${-angle / 360 * 25}s`;
    // Restart the idle clock at the landing angle before releasing the spin.
    void wheel.offsetWidth;
    wheel.style.animationName = "";
    spinAnimation?.cancel();
    spinAnimation = null;
  };

  const returnToFilters = () => {
    if (isTransitioning || widgetState === "spinning") return;
    transitionView(() => {
      resetToInitialState();
      resumeIdleRotation();
    });
  };

  const formatPrice = (value) => new Intl.NumberFormat("no-NO").format(value);

  const lockBodyScroll = () => {
    storedScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.position = "fixed";
    document.body.style.top = `-${storedScrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    document.body.classList.add("ie-modal-open");
  };

  const unlockBodyScroll = () => {
    const restoredScrollY = Number.parseFloat(document.body.style.top || "0") * -1 || storedScrollY || 0;
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
    document.body.classList.remove("ie-modal-open");
    window.scrollTo(0, restoredScrollY);
  };

  const resetToInitialState = () => {
    widgetState = "initial";
    shell.dataset.state = widgetState;
    shell.classList.remove("has-results");
    shell.classList.remove("is-spinning");
    resultsContainer.hidden = true;
    resultsContainer.setAttribute("aria-hidden", "true");
    statusText.textContent = "";
    featuredImage.src = "";
    featuredImage.alt = "";
    featuredName.textContent = "";
    featuredDescription.textContent = "";
    featuredOldPrice.textContent = "";
    featuredNewPrice.textContent = "";
    featuredSavings.textContent = "";
    featuredLink.textContent = "SE PRODUKT";
    featuredLink.onclick = null;
    resetFilterButton.onclick = null;
    alternativesContainer.innerHTML = "";
  };

  const hideResultView = () => {
    widgetState = "initial";
    shell.dataset.state = widgetState;
    shell.classList.remove("has-results");
    shell.classList.remove("is-spinning");
    resultsContainer.hidden = true;
    resultsContainer.setAttribute("aria-hidden", "true");
    statusText.textContent = "";
    featuredImage.src = "";
    featuredImage.alt = "";
    featuredName.textContent = "";
    featuredDescription.textContent = "";
    featuredOldPrice.textContent = "";
    featuredNewPrice.textContent = "";
    featuredSavings.textContent = "";
    featuredLink.textContent = "SE PRODUKT";
    featuredLink.onclick = null;
    resetFilterButton.onclick = null;
    alternativesContainer.innerHTML = "";
  };

  const renderAlternatives = (items) => {
    if (!items.length) {
      alternativesContainer.innerHTML = "";
      return;
    }

    const cards = items.slice(0, 3).map((product) => `
      <button type="button" class="ie-widget-alt-card" data-product-url="${product.productUrl}">
        <img src="${product.image}" alt="${product.name}" />
        <div class="ie-widget-alt-copy">
          <span class="ie-widget-alt-name">${product.name}</span>
          <strong>${formatPrice(product.price)} kr</strong>
        </div>
      </button>
    `).join("");

    alternativesContainer.innerHTML = cards;
    alternativesContainer.querySelectorAll(".ie-widget-alt-card").forEach((card) => {
      card.addEventListener("click", () => {
        const url = card.dataset.productUrl;
        if (url) {
          window.open(url, "_blank", "noopener,noreferrer");
        }
      });
    });
  };

  const showResultView = (products) => {
    widgetState = "result";
    shell.dataset.state = widgetState;
    shell.classList.remove("is-spinning");

    if (!products.length) {
      shell.classList.add("has-results");
      resultsContainer.hidden = false;
      resultsContainer.removeAttribute("aria-hidden");
      resultsContainer.querySelector(".ie-widget-results-header").textContent = "Ingen treff";
      featuredImage.src = "";
      featuredImage.alt = "";
      featuredName.textContent = "Ingen produkter matcher akkurat nå";
      featuredDescription.textContent = "Prøv et annet budsjett eller velg Overrask meg for flere forslag.";
      featuredOldPrice.textContent = "";
      featuredNewPrice.textContent = "";
      featuredSavings.textContent = "";
      featuredLink.textContent = "ENDRE FILTER";
      featuredLink.onclick = () => {
        returnToFilters();
      };
      resetFilterButton.textContent = "ENDRE FILTER";
      resetFilterButton.onclick = () => {
        returnToFilters();
      };
      alternativesContainer.innerHTML = "";
      return;
    }

    const [recommended, ...alternatives] = products;

    shell.classList.add("has-results");
    resultsContainer.hidden = false;
    resultsContainer.removeAttribute("aria-hidden");
    resultsContainer.querySelector(".ie-widget-results-header").textContent = "Anbefalt for deg";
    featuredImage.src = recommended.image;
    featuredImage.alt = recommended.name;
    featuredName.textContent = recommended.name;
    featuredDescription.textContent = recommended.description;
    featuredOldPrice.textContent = `${formatPrice(recommended.oldPrice)} kr`;
    featuredNewPrice.textContent = `${formatPrice(recommended.price)} kr`;
    featuredSavings.textContent = `Du sparer ${formatPrice(recommended.oldPrice - recommended.price)} kr`;
    featuredLink.textContent = "GÅ TIL PRODUKT";
    featuredLink.onclick = () => {
      if (recommended.productUrl) {
        window.open(recommended.productUrl, "_blank", "noopener,noreferrer");
      }
    };
    resetFilterButton.textContent = "ENDRE FILTER";
    resetFilterButton.onclick = () => {
      returnToFilters();
    };

    renderAlternatives(alternatives);
  };

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
    if (isExpanded) {
      lockBodyScroll();
      resetToInitialState();
      // Leave room for the result below a stable wheel, including on short screens.
      shell.style.setProperty("--ie-modal-top", `${Math.max(24, window.innerHeight * 0.06)}px`);
      shell.classList.add("is-anchored");
    } else {
      shell.classList.remove("is-anchored");
      shell.style.removeProperty("--ie-modal-top");
      unlockBodyScroll();
    }
  };

  const openWidget = () => {
    if (!shell.classList.contains("expanded")) {
      setExpanded(true);
    }
  };

  const closeWidget = () => {
    window.clearTimeout(spinTimer);
    transitionVersion++;
    isTransitioning = false;
    body.getAnimations().forEach((animation) => animation.cancel());
    body.style.clipPath = "";
    if (shell.classList.contains("expanded")) {
      resumeIdleRotation();
      setExpanded(false);
    }
    resetToInitialState();
  };

  header.addEventListener("click", (event) => {
    if (event.target.closest(".ie-widget-cta")) return;
    if (event.target.closest("select")) return;
    if (shell.classList.contains("collapsed")) {
      openWidget();
    } else if (event.target.closest(".ie-widget-badge") && widgetState !== "spinning") {
      spinButton.click();
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
    if (widgetState === "spinning" || isTransitioning) return;
    const matrix = new DOMMatrixReadOnly(getComputedStyle(wheel).transform);
    const startAngle = Math.atan2(matrix.b, matrix.a) * 180 / Math.PI;
    const endAngle = startAngle + 150;
    spinAnimation?.cancel();
    wheel.dataset.angle = String((endAngle % 360 + 360) % 360);
    spinAnimation = wheel.animate([
      { transform: `rotate(${startAngle}deg)` },
      { transform: `rotate(${endAngle}deg)` }
    ], {
      duration: reducedMotion.matches ? 0 : 1800,
      easing: "cubic-bezier(.3, .052, .35, 1)", fill: "forwards"
    });
    widgetState = "spinning";
    shell.dataset.state = widgetState;
    shell.classList.add("is-spinning");
    statusText.textContent = `Sjekker ${selectedInterest.toLowerCase()} • ${selectedBudget}`;

    if (typeof onSpin === "function") {
      onSpin({ interest: selectedInterest, budget: selectedBudget });
    }

    spinTimer = window.setTimeout(() => {
      const recommendedProducts = findRecommendedProducts({
        interest: selectedInterest,
        budget: selectedBudget
      });

      if (recommendedProducts.length) {
        statusText.textContent = `${recommendedProducts.length} forslag funnet`;
      } else {
        statusText.textContent = "Prøv et annet budsjett eller Overrask meg";
      }

      transitionView(() => showResultView(recommendedProducts));
    }, reducedMotion.matches ? 0 : 1900);
  });

  resetToInitialState();
  setExpanded(false);

  return shell;
}
