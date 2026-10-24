const MAT = {
  paper:   { smoke: 'light', dust: '#e4ddd2', burn: 1.0,  ign: 1.0, cap: 1.0, fibre: true },
  glossy:  { smoke: 'light', dust: '#d8d4cc', burn: 0.6,  ign: 0.6, cap: 1.3, fibre: false },
  glass:   { smoke: 'dark',  dust: '#e8f2f8', burn: 0,    ign: 0,   cap: 1.6, fibre: false },
  card:    { smoke: 'light', dust: '#cdb894', burn: 0.5,  ign: 0.7, cap: 1.5, fibre: false },
  letters: { smoke: 'none',  dust: '#d0d0d8', burn: 0.3,  ign: 0.2, cap: 0.8, fibre: false },
  metal:   { smoke: 'none',  dust: '#b8bcc8', burn: 0,    ign: 0,   cap: 3.0, fibre: false },
};
const MAT_METAL = /\b(skinHeader|itemProgressBar|progressring|sliderContainer|mdl-slider|emby-slider|MuiAppBar|MuiLinearProgress|MuiSlider)/;
const MAT_GLASS = /\b(paper-icon-button-light|fab|btnPlay|emby-button|button-flat|button-submit|MuiIconButton|MuiFab|MuiButton|cardOverlayButton)/;
const MAT_GLOSSY = /\b(backdropImage|detailImageContainer|itemBackdrop|detailPagePrimaryContainer|logoImage)/;
const MAT_PAPER = /\b(cardImageContainer|cardImage|cardPadder|coveredImage|personCard|listItemImage)/;

function materialOf(block) {
  if (block.mat) return block.mat;
  let material = 'card';
  if (block.kind === 'word') material = 'letters';
  else {
    const el = block.el, tag = el && el.tagName ? el.tagName.toUpperCase() : '';
    const cls = el && typeof el.className === 'string' ? el.className : (el && el.getAttribute ? el.getAttribute('class') || '' : '');
    const area = block.w * block.h;
    if (MAT_METAL.test(cls) || tag === 'PROGRESS') material = 'metal';
    else if (MAT_GLOSSY.test(cls) || (block.kind === 'media' && area > 180000)) material = 'glossy';
    else if (MAT_PAPER.test(cls) || block.kind === 'media') material = 'paper';
    else if (MAT_GLASS.test(cls) || tag === 'BUTTON' || (block.kind === 'ctrl' && area < 20000)) material = 'glass';
  }
  block.mat = material;
  return material;
}
function materialCounts() {
  const counts = {};
  if (!S || !S.blocks) return counts;
  for (const block of S.blocks) if (block.alive) { const material = materialOf(block); counts[material] = (counts[material] || 0) + 1; }
  return counts;
}
