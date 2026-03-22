const defaults = {
  themeName: 'Clean Insight',
  fontFamily: "'Segoe UI', sans-serif",
  primaryColor: '#3b82f6',
  secondaryColor: '#8b5cf6',
  backgroundColor: '#f8fafc',
  surfaceColor: '#ffffff',
  textColor: '#0f172a',
  mutedTextColor: '#64748b',
  accentColor: '#14b8a6',
  alertColor: '#f97316',
  dataColor1: '#3b82f6',
  dataColor2: '#8b5cf6',
  dataColor3: '#14b8a6',
  dataColor4: '#f59e0b',
  borderRadius: 18,
  shadowStrength: 16,
};

const form = document.getElementById('themeForm');
const dashboardPreview = document.getElementById('dashboardPreview');
const jsonOutput = document.getElementById('jsonOutput');
const copyJsonButton = document.getElementById('copyJson');
const downloadJsonButton = document.getElementById('downloadJson');
const resetButton = document.getElementById('resetTheme');
const jsonStatus = document.getElementById('jsonStatus');
const borderRadiusValue = document.getElementById('borderRadiusValue');
const shadowStrengthValue = document.getElementById('shadowStrengthValue');

const setStatus = (message) => {
  jsonStatus.textContent = message;
};

const getThemeState = () => {
  const formData = new FormData(form);
  return {
    themeName: formData.get('themeName'),
    fontFamily: formData.get('fontFamily'),
    primaryColor: formData.get('primaryColor'),
    secondaryColor: formData.get('secondaryColor'),
    backgroundColor: formData.get('backgroundColor'),
    surfaceColor: formData.get('surfaceColor'),
    textColor: formData.get('textColor'),
    mutedTextColor: formData.get('mutedTextColor'),
    accentColor: formData.get('accentColor'),
    alertColor: formData.get('alertColor'),
    dataColor1: formData.get('dataColor1'),
    dataColor2: formData.get('dataColor2'),
    dataColor3: formData.get('dataColor3'),
    dataColor4: formData.get('dataColor4'),
    borderRadius: Number(formData.get('borderRadius')),
    shadowStrength: Number(formData.get('shadowStrength')),
  };
};

const buildThemeJson = (theme) => ({
  name: theme.themeName,
  foreground: theme.textColor,
  foregroundNeutralSecondary: theme.mutedTextColor,
  background: theme.backgroundColor,
  tableAccent: theme.primaryColor,
  dataColors: [theme.dataColor1, theme.dataColor2, theme.dataColor3, theme.dataColor4],
  visualStyles: {
    '*': {
      '*': {
        color: [{ solid: { color: theme.textColor } }],
        fontFamily: theme.fontFamily,
        background: [{ solid: { color: theme.surfaceColor } }],
      },
    },
    page: {
      '*': {
        background: [{ solid: { color: theme.backgroundColor } }],
      },
    },
  },
  custom: {
    borderRadius: `${theme.borderRadius}px`,
    shadowBlur: `${theme.shadowStrength}px`,
    semanticColors: {
      primary: theme.primaryColor,
      secondary: theme.secondaryColor,
      accent: theme.accentColor,
      alert: theme.alertColor,
    },
  },
});

const applyThemeToPreview = (theme) => {
  document.body.style.fontFamily = theme.fontFamily;
  document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
  document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
  document.documentElement.style.setProperty('--background-color', theme.backgroundColor);
  document.documentElement.style.setProperty('--surface-color', theme.surfaceColor);
  document.documentElement.style.setProperty('--text-color', theme.textColor);
  document.documentElement.style.setProperty('--muted-text-color', theme.mutedTextColor);
  document.documentElement.style.setProperty('--accent-color', theme.accentColor);
  document.documentElement.style.setProperty('--alert-color', theme.alertColor);
  document.documentElement.style.setProperty('--data-color-1', theme.dataColor1);
  document.documentElement.style.setProperty('--data-color-2', theme.dataColor2);
  document.documentElement.style.setProperty('--data-color-3', theme.dataColor3);
  document.documentElement.style.setProperty('--data-color-4', theme.dataColor4);
  document.documentElement.style.setProperty('--border-radius', `${theme.borderRadius}px`);
  document.documentElement.style.setProperty('--shadow-blur', `${theme.shadowStrength}px`);
  document.documentElement.style.setProperty(
    '--page-shadow',
    `0 18px ${Math.max(theme.shadowStrength * 2, 18)}px rgba(15, 23, 42, 0.08)`
  );

  dashboardPreview.querySelector('#heroValue').textContent =
    theme.primaryColor === defaults.primaryColor ? '¥ 1,284,000' : '¥ 1,367,000';
  dashboardPreview.querySelector('#heroDelta').textContent =
    theme.accentColor === defaults.accentColor ? '同比增长 12.8%' : '重点指标已更新';

  borderRadiusValue.textContent = `${theme.borderRadius}px`;
  shadowStrengthValue.textContent = `${theme.shadowStrength}px`;
};

const renderJson = (theme) => {
  const output = JSON.stringify(buildThemeJson(theme), null, 2);
  jsonOutput.textContent = output;
  return output;
};

const updateTheme = () => {
  const theme = getThemeState();
  applyThemeToPreview(theme);
  renderJson(theme);
  setStatus('Updated');
};

form.addEventListener('input', updateTheme);
form.addEventListener('change', updateTheme);

copyJsonButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(jsonOutput.textContent);
    setStatus('Copied');
  } catch {
    setStatus('Copy failed');
  }
});

downloadJsonButton.addEventListener('click', () => {
  const theme = getThemeState();
  const blob = new Blob([JSON.stringify(buildThemeJson(theme), null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const filename = `${theme.themeName.trim().replace(/\s+/g, '-').toLowerCase() || 'powerbi-theme'}.json`;

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  setStatus('Downloaded');
});

resetButton.addEventListener('click', () => {
  Object.entries(defaults).forEach(([key, value]) => {
    const field = form.elements.namedItem(key);
    if (field) {
      field.value = value;
    }
  });

  updateTheme();
  setStatus('Reset');
});

updateTheme();
