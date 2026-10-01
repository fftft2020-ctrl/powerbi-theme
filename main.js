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

const STORAGE_KEY = 'powerbi-theme-studio:v1';
const presets = {
  business: { ...defaults, themeName: '商务蓝' },
  dark: {
    ...defaults, themeName: '深色', primaryColor: '#60a5fa', secondaryColor: '#a78bfa',
    backgroundColor: '#0f172a', surfaceColor: '#1e293b', textColor: '#f1f5f9',
    mutedTextColor: '#cbd5e1', accentColor: '#2dd4bf', alertColor: '#fb923c',
    dataColor1: '#60a5fa', dataColor2: '#a78bfa', dataColor3: '#2dd4bf', dataColor4: '#fbbf24',
  },
  light: {
    ...defaults, themeName: '简洁白', primaryColor: '#2563eb', secondaryColor: '#475569',
    backgroundColor: '#ffffff', surfaceColor: '#f8fafc', textColor: '#111827',
    mutedTextColor: '#4b5563', accentColor: '#0f766e', alertColor: '#c2410c',
    dataColor1: '#2563eb', dataColor2: '#64748b', dataColor3: '#0f766e', dataColor4: '#d97706',
    borderRadius: 10, shadowStrength: 0,
  },
};
const colorKeys = Object.keys(defaults).filter((key) => key.endsWith('Color') || /^dataColor/.test(key));
const fonts = ["'Segoe UI', sans-serif", 'Inter, sans-serif', 'Arial, sans-serif', "'Microsoft YaHei', sans-serif"];
const isValidTheme = (theme) => Boolean(
  theme && typeof theme === 'object' && !Array.isArray(theme) &&
  typeof theme.themeName === 'string' && theme.themeName.trim().length > 0 && theme.themeName.length <= 100 &&
  fonts.includes(theme.fontFamily) &&
  colorKeys.every((key) => typeof theme[key] === 'string' && /^#[0-9a-f]{6}$/i.test(theme[key])) &&
  Number.isInteger(theme.borderRadius) && theme.borderRadius >= 6 && theme.borderRadius <= 28 &&
  Number.isInteger(theme.shadowStrength) && theme.shadowStrength >= 0 && theme.shadowStrength <= 40
);

const form = document.getElementById('themeForm');
const presetSelect = document.getElementById('themePreset');
const storageStatus = document.getElementById('storageStatus');
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

// Power BI uses a font family name, not a CSS fallback stack.
const buildThemeJson = (theme) => {
  if (!isValidTheme(theme)) throw new Error('主题设置无效');
  const fontFace = theme.fontFamily.split(',')[0].replace(/'/g, '').trim();
  const textStyle = { fontFace, color: theme.textColor };
  return {
    name: theme.themeName.trim(),
    foreground: theme.textColor,
    foregroundNeutralSecondary: theme.mutedTextColor,
    background: theme.backgroundColor,
    secondaryBackground: theme.surfaceColor,
    tableAccent: theme.primaryColor,
    good: theme.accentColor,
    bad: theme.alertColor,
    dataColors: [theme.dataColor1, theme.dataColor2, theme.dataColor3, theme.dataColor4],
    textClasses: {
      title: { ...textStyle }, header: { ...textStyle },
      label: { ...textStyle }, callout: { ...textStyle },
    },
    visualStyles: {
      '*': { '*': { background: [{ show: true, color: { solid: { color: theme.surfaceColor } }, transparency: 0 }] } },
      page: { '*': { background: [{ color: { solid: { color: theme.backgroundColor } }, transparency: 0 }] } },
    },
  };
};

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

  // Example metrics stay fixed in index.html when the theme changes.

  borderRadiusValue.textContent = `${theme.borderRadius}px`;
  shadowStrengthValue.textContent = `${theme.shadowStrength}px`;
};

const renderJson = (theme) => {
  const output = JSON.stringify(buildThemeJson(theme), null, 2);
  jsonOutput.textContent = output;
  return output;
};


const applyForm = (theme) => {
  Object.keys(defaults).forEach((key) => { form.elements.namedItem(key).value = theme[key]; });
};

const syncPreset = (theme) => {
  presetSelect.value = Object.keys(presets).find((id) =>
    Object.keys(defaults).every((key) => presets[id][key] === theme[key])
  ) || '';
};

const saveTheme = (theme) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, theme }));
    storageStatus.textContent = '已自动保存到当前浏览器';
  } catch {
    storageStatus.textContent = '当前浏览器无法保存，刷新前请下载主题';
  }
};

const updateTheme = ({ persist = true } = {}) => {
  const theme = getThemeState();
  applyThemeToPreview(theme);
  syncPreset(theme);
  const valid = isValidTheme(theme);
  copyJsonButton.disabled = !valid;
  downloadJsonButton.disabled = !valid;
  if (!valid) {
    jsonOutput.textContent = '';
    setStatus('请填写 1–100 字的主题名称，并检查颜色和布局设置');
    storageStatus.textContent = '当前设置未保存；保留上次有效设置';
    return;
  }
  renderJson(theme);
  setStatus('可导出');
  if (persist) saveTheme(theme);
};

form.addEventListener('submit', (event) => event.preventDefault());
form.addEventListener('input', () => updateTheme());
form.addEventListener('change', () => updateTheme());

presetSelect.addEventListener('change', () => {
  if (!Object.hasOwn(presets, presetSelect.value)) return;
  applyForm(presets[presetSelect.value]);
  updateTheme();
});

copyJsonButton.addEventListener('click', async () => {
  try {
    const output = JSON.stringify(buildThemeJson(getThemeState()), null, 2);
    await navigator.clipboard.writeText(output);
    setStatus('已复制');
  } catch {
    setStatus('复制失败，请下载 JSON 或手动复制下方内容');
  }
});

downloadJsonButton.addEventListener('click', () => {
  let url;
  let link;
  try {
    const theme = getThemeState();
    const output = JSON.stringify(buildThemeJson(theme), null, 2);
    const blob = new Blob([output], { type: 'application/json' });
    url = URL.createObjectURL(blob);
    link = document.createElement('a');
    link.href = url;
    link.download = (theme.themeName.trim().replace(/[\\/:*?"<>|\u0000-\u001f]/g, '-').replace(/\s+/g, '-').toLowerCase() || 'powerbi-theme') + '.json';
    document.body.appendChild(link);
    link.click();
    setStatus('已发起下载');
  } catch {
    setStatus('下载失败，请检查设置或复制下方 JSON');
  } finally {
    if (link) link.remove();
    if (url) setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
});

resetButton.addEventListener('click', () => {
  applyForm(defaults);
  updateTheme();
  setStatus('已恢复默认');
});

const restoreTheme = () => {
  applyForm(defaults);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      storageStatus.textContent = '修改后自动保存到当前浏览器';
    } else {
      const saved = JSON.parse(raw);
      if (saved?.version !== 1 || !isValidTheme(saved.theme)) throw new Error('Invalid saved theme');
      applyForm(saved.theme);
      storageStatus.textContent = '已恢复上次编辑';
    }
  } catch {
    storageStatus.textContent = '未能恢复保存的设置，已使用默认主题';
  }
  updateTheme({ persist: false });
};

restoreTheme();
