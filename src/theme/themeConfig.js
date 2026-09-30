export const themeConfig = {
  brandName: "POWER",
  colors: {
    primary: "#ff7a00",
    primaryDark: "#d96a00",
    accent: "#0f172a",
    surface: "#f4f6f9",
    surfaceStrong: "#e9edf3",
    card: "#ffffff",
    text: "#111827",
    textMuted: "#475569",
    border: "#dfe7f0",
    success: "#1f9d61",
    warning: "#f59e0b",
    shadow: "rgba(15, 23, 42, 0.12)"
  },
  radius: {
    widget: 18,
    button: 999,
    card: 16
  },
  spacing: {
    widgetPadding: 16,
    cardPadding: 18,
    controlGap: 10
  },
  typography: {
    fontFamily: 'Inter, "Segoe UI", sans-serif',
    headingWeight: 700,
    bodyWeight: 500,
    labelWeight: 600
  }
};

export function applyThemeVariables(root = document.documentElement, config = themeConfig) {
  const { colors, radius, spacing, typography } = config;

  const variables = {
    "--ie-primary": colors.primary,
    "--ie-primary-dark": colors.primaryDark,
    "--ie-accent": colors.accent,
    "--ie-surface": colors.surface,
    "--ie-surface-strong": colors.surfaceStrong,
    "--ie-card": colors.card,
    "--ie-text": colors.text,
    "--ie-text-muted": colors.textMuted,
    "--ie-border": colors.border,
    "--ie-success": colors.success,
    "--ie-warning": colors.warning,
    "--ie-shadow": colors.shadow,
    "--ie-radius-widget": `${radius.widget}px`,
    "--ie-radius-button": `${radius.button}px`,
    "--ie-radius-card": `${radius.card}px`,
    "--ie-spacing-widget": `${spacing.widgetPadding}px`,
    "--ie-spacing-card": `${spacing.cardPadding}px`,
    "--ie-spacing-control-gap": `${spacing.controlGap}px`,
    "--ie-font-family": typography.fontFamily,
    "--ie-heading-weight": String(typography.headingWeight),
    "--ie-body-weight": String(typography.bodyWeight),
    "--ie-label-weight": String(typography.labelWeight)
  };

  Object.entries(variables).forEach(([name, value]) => {
    root.style.setProperty(name, value);
  });
}
