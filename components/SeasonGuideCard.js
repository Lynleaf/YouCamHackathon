import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getSeasonGuide } from "../utils/seasonGuidesData";
import { getSeasonFamily, SEASON_CONFETTI } from "../utils/seasonFamily";
import { theme } from "../styles";

export default function SeasonGuideCard({ season, compact = false }) {
  const guide = getSeasonGuide(season);

  if (!guide) {
    return null;
  }

  const family = getSeasonFamily(season);
  const accent = SEASON_CONFETTI[family]?.colors?.[0] || theme.colors.accentSoft;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={[styles.iconWrap, { borderColor: accent }]}>
          <Ionicons
            name={SEASON_CONFETTI[family]?.icon || "color-palette-outline"}
            size={18}
            color={accent}
          />
        </View>
        <Text style={styles.header}>{compact ? "About your season" : "Season guide"}</Text>
      </View>

      <Text style={styles.summary}>{guide.summary}</Text>

      {!compact && (
        <>
          <View style={styles.rule} />
          <Text style={styles.label}>Your coloring</Text>
          <Text style={styles.body}>{guide.traits}</Text>
        </>
      )}

      <View style={styles.rule} />
      <Text style={styles.label}>Styling tips</Text>
      <Text style={styles.body}>{guide.styling}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderMuted,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceElevated,
    borderWidth: 1,
  },
  header: {
    color: theme.colors.text,
    fontFamily: theme.fonts.bold,
    fontSize: 16,
  },
  summary: {
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    lineHeight: 22,
  },
  rule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.divider,
    marginVertical: theme.spacing.md,
  },
  label: {
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.bold,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: theme.spacing.xs,
  },
  body: {
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    lineHeight: 22,
  },
});
