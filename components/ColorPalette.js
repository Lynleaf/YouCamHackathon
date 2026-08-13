import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { styles as globalStyles, theme } from "../styles";

export default function ColorPalette({ title, colorData = [] }) {
  return (
    <View style={styles.container}>
      <Text style={globalStyles.bodyTextLarge}>{title}</Text>
      <View style={styles.rule} />

      <View style={styles.grid}>
        {colorData.map((color) => (
          <View key={color.name} style={styles.item}>
            <View
              style={[
                styles.colorSquare,
                { backgroundColor: color.hex },
              ]}
            />

            <View style={styles.textContainer}>
              <Text style={globalStyles.bodyTextMed} numberOfLines={2}>
                {color.name}
              </Text>
              <Text style={globalStyles.bodyTextSmall}>{color.hex}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderMuted,
  },

  rule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.divider,
    marginBottom: theme.spacing.md,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  item: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  colorSquare: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.sm,
  },

  textContainer: {
    flex: 1,
  },
});
