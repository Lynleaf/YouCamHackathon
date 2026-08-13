export const seasonGuides = {
  "Light Spring": {
    summary: "Light, warm, and delicate — your coloring thrives in clear pastel warmth.",
    traits: "Fair-to-light features with golden undertones and soft contrast.",
    styling:
      "Choose peach, apricot, buttercream, and light aqua. Favor airy fabrics, soft makeup, and warm metallics like gold. Skip heavy blacks and icy pastels.",
  },
  "True Spring": {
    summary: "Warm, clear, and lively — bright golden tones make you look energized.",
    traits: "Warm undertones with medium clarity and natural glow.",
    styling:
      "Reach for coral, warm emerald, golden jade, and clear turquoise. Keep looks fresh and crisp. Avoid muted dusty shades and cool blue-based pinks.",
  },
  "Bright Spring": {
    summary: "Vivid and high-energy — saturated warm colors bring out your sparkle.",
    traits: "Clear, bright features with noticeable contrast and warmth.",
    styling:
      "Wear bold coral, bright turquoise, warm poppy, and clear yellow-green. Clean lines and glossy finishes suit you. Avoid grayed, dusty, or overly soft neutrals.",
  },
  "Light Summer": {
    summary: "Cool, soft, and luminous — gentle blue-based pastels flatter you most.",
    traits: "Light coloring with cool undertones and low-to-medium contrast.",
    styling:
      "Choose powder blue, soft rose, lavender, and cool mint. Keep fabrics light and finishes matte-to-satin. Soft silver works better than yellow gold.",
  },
  "True Summer": {
    summary: "Cool, balanced, and gracefully muted — blue-based colors keep you harmonious.",
    traits: "Cool undertones with medium lightness and soft clarity.",
    styling:
      "Lean into rose, periwinkle, soft teal, and cool berry. Prefer soft contrast and refined silhouettes. Avoid orange-leaning warms and stark neon brights.",
  },
  "Soft Summer": {
    summary: "Gentle, dusty, and cool — blended muted tones look most natural on you.",
    traits: "Soft contrast with cool-neutral undertones and subdued chroma.",
    styling:
      "Wear taupe rose, sage, muted periwinkle, and soft plum. Layer close-value colors for ease. Skip high-contrast black-and-white and warm spicy hues.",
  },
  "Soft Autumn": {
    summary: "Warm, muted, and earthy — soft golden neutrals give you quiet richness.",
    traits: "Warm undertones with gentle contrast and blended depth.",
    styling:
      "Choose camel, soft olive, terracotta, and warm taupe. Textures like knit, suede, and linen flatter you. Avoid icy pastels and neon brights.",
  },
  "True Autumn": {
    summary: "Rich, warm, and grounded — golden harvest colors deepen your natural glow.",
    traits: "Warm coloring with medium depth and earthy clarity.",
    styling:
      "Build outfits around rust, mustard, olive, warm teal, and chocolate brown. Gold jewelry and matte finishes shine. Cool pinks and stark black can wash you out.",
  },
  "Dark Autumn": {
    summary: "Deep, warm, and dramatic — dense earth tones and rich jewel shades suit you.",
    traits: "Darker features with warm undertones and strong depth.",
    styling:
      "Wear deep rust, forest green, espresso, burgundy, and warm bronze. Structured pieces and richer fabrics work well. Soft pastels and cool silvers are usually less flattering.",
  },
  "Dark Winter": {
    summary: "Deep, cool, and high-contrast — jewel tones against clear darks look striking.",
    traits: "Dark features with cool undertones and strong contrast.",
    styling:
      "Choose black, deep emerald, ruby, icy white, and sapphire. High-contrast outfits feel intentional. Avoid warm beiges, orange tones, and muted dusty colors.",
  },
  "True Winter": {
    summary: "Cool, clear, and bold — pure contrast and icy brights sharpen your look.",
    traits: "Cool undertones with crisp clarity and strong contrast.",
    styling:
      "Reach for true red, royal blue, emerald, black, and pure white. Sleek lines and polished finishes suit you. Soft warm earth tones tend to dull your coloring.",
  },
  "Bright Winter": {
    summary: "Icy, vivid, and electric — clear cool brights make your features pop.",
    traits: "Cool undertones with bright clarity and high contrast.",
    styling:
      "Wear fuchsia, cobalt, icy pink, clear emerald, and crisp black-white. Keep colors clean and saturated. Skip muted olives, camel, and soft warm pastels.",
  },
};

export function getSeasonGuide(season) {
  return seasonGuides[season] || null;
}
