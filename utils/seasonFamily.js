export function getSeasonFamily(season = "") {
  const value = season.toLowerCase();

  if (value.includes("summer")) return "summer";
  if (value.includes("winter")) return "winter";
  if (value.includes("spring")) return "spring";
  if (value.includes("autumn") || value.includes("fall")) return "autumn";

  return "spring";
}

export const SEASON_CONFETTI = {
  summer: {
    icon: "sunny",
    label: "sun",
    colors: ["#F4C430", "#FFB347", "#FFE066", "#F7A072", "#FFD166"],
  },
  winter: {
    icon: "snow",
    label: "snowflake",
    colors: ["#7EB6FF", "#B8D4E8", "#E8F1F8", "#5B8DEF", "#C5D5E4"],
  },
  spring: {
    icon: "flower",
    label: "flower",
    colors: ["#F4A6C1", "#B5E48C", "#FFD6A5", "#CDB4DB", "#A8DADC"],
  },
  autumn: {
    icon: "leaf",
    label: "leaf",
    colors: ["#D2691E", "#C45C26", "#E09F3E", "#8B4513", "#BC6C25"],
  },
};
