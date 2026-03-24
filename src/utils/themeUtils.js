export const applyThemeToDom = (settings) => {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;

  // 1. Theme Mode
  if (settings.themeMode === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.removeAttribute('data-theme');
  }

  // 2. Header Background Image
  if (settings.headerBgImage) {
    root.style.setProperty('--header-bg-image', `url(${settings.headerBgImage})`);
  } else {
    root.style.removeProperty('--header-bg-image');
  }

  // 3. Body Background Images (Left and Right)
  const bgLayers = [];
  if (settings.bodyBgImageLeft) {
    const pos = settings.bodyBgPositionLeft || 'left top';
    const size = settings.bodyBgSizeLeft || 'auto';
    bgLayers.push(`url(${settings.bodyBgImageLeft}) ${pos} / ${size} no-repeat`);
  }
  if (settings.bodyBgImageRight) {
    const pos = settings.bodyBgPositionRight || 'right top';
    const size = settings.bodyBgSizeRight || 'auto';
    bgLayers.push(`url(${settings.bodyBgImageRight}) ${pos} / ${size} no-repeat`);
  }

  if (bgLayers.length > 0) {
    // Also include a fallback background color layer if needed
    // The CSS var --bg-color will handle the base layer.
    root.style.setProperty('--body-bg-custom', bgLayers.join(', ') + ', var(--bg-color)');
  } else {
    root.style.removeProperty('--body-bg-custom');
  }
};
