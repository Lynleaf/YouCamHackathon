function hexToHSL(hex) {
  hex = hex.replace("#", "");

  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;

  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);

  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (max !== min) {
    let d = max - min;

    s = l > 0.5
      ? d / (2 - max - min)
      : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return {
    h: h * 360,
    s,
    l
  };
}

function hueWarmth(h) {
  // warm = +1, cool = -1
  if ((h >= 0 && h <= 70) || (h >= 330 && h <= 360))
    return 1;

  return -1;
}

const SEASONS = [
  {
    name: "Light Spring",
    warmth: 1,
    lightness: 0.85,
    saturation: 0.70,
    contrast: 0.35
  },
  {
    name: "True Spring",
    warmth: 1,
    lightness: 0.65,
    saturation: 0.80,
    contrast: 0.45
  },
  {
    name: "Bright Spring",
    warmth: 0.7,
    lightness: 0.70,
    saturation: 0.95,
    contrast: 0.70
  },

  {
    name: "Light Summer",
    warmth: -1,
    lightness: 0.85,
    saturation: 0.40,
    contrast: 0.25
  },
  {
    name: "True Summer",
    warmth: -1,
    lightness: 0.65,
    saturation: 0.35,
    contrast: 0.20
  },
  {
    name: "Soft Summer",
    warmth: -0.6,
    lightness: 0.60,
    saturation: 0.20,
    contrast: 0.15
  },

  {
    name: "Soft Autumn",
    warmth: 0.6,
    lightness: 0.55,
    saturation: 0.30,
    contrast: 0.20
  },
  {
    name: "True Autumn",
    warmth: 1,
    lightness: 0.45,
    saturation: 0.60,
    contrast: 0.35
  },
  {
    name: "Dark Autumn",
    warmth: 0.7,
    lightness: 0.25,
    saturation: 0.55,
    contrast: 0.80
  },

  {
    name: "Dark Winter",
    warmth: -0.8,
    lightness: 0.20,
    saturation: 0.80,
    contrast: 0.95
  },
  {
    name: "True Winter",
    warmth: -1,
    lightness: 0.40,
    saturation: 0.90,
    contrast: 0.85
  },
  {
    name: "Bright Winter",
    warmth: -0.7,
    lightness: 0.45,
    saturation: 1.00,
    contrast: 0.90
  }
];

function determineSeason(hairHex, eyeHex, skinHex) {

  const hair = hexToHSL(hairHex);
  const eyes = hexToHSL(eyeHex);
  const skin = hexToHSL(skinHex);

  const warmth =
    (
      hueWarmth(hair.h) +
      hueWarmth(eyes.h) +
      hueWarmth(skin.h)
    ) / 3;

  const saturation =
    (hair.s + eyes.s + skin.s) / 3;

  const lightness =
    (hair.l + eyes.l + skin.l) / 3;

  const contrast =
    Math.max(hair.l, eyes.l, skin.l) -
    Math.min(hair.l, eyes.l, skin.l);

  let bestSeason = null;
  let bestScore = Infinity;

  for (const season of SEASONS) {

    const score =
      Math.abs(warmth - season.warmth) * 4 +
      Math.abs(lightness - season.lightness) * 3 +
      Math.abs(saturation - season.saturation) * 2 +
      Math.abs(contrast - season.contrast) * 3;

    if (score < bestScore) {
      bestScore = score;
      bestSeason = season.name;
    }
  }

  return bestSeason;
}

export default determineSeason;
