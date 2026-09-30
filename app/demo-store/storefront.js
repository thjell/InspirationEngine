import { createWidgetShell } from "../widget/widget-shell.js";
import { themeConfig } from "../../src/theme/themeConfig.js";
import { applyThemeVariables } from "../../src/theme/themeConfig.js";

applyThemeVariables(document.documentElement, themeConfig);

const widgetMount = document.getElementById("ie-widget-root");
if (widgetMount) {
  createWidgetShell({
    target: widgetMount,
    theme: themeConfig,
    title: "Finn ukens kupp",
    initialInterest: "Gaming",
    initialBudget: "any",
    onSpin: ({ interest, budget }) => {
      console.log("Demo spin clicked", { interest, budget });
    }
  });
}
