import React from "react";
import { View, Text, StyleSheet } from "react-native";

import {styles as globalStyles} from "../styles";
export default function ColorPalette({ title, colorData = [] }) {
  return (
    <View style={styles.container}>
      <Text style={globalStyles.bodyTextLarge}>{title}</Text>

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
              <Text style={globalStyles.bodyTextMed}>{color.name}</Text>
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
    backgroundColor: "#2d2d4e",
    borderRadius: 16,
    padding: 10,
    marginVertical:10
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  item: {
    width: "48%", // Two per row with a little spacing
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  colorSquare: {
    width: 40,
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#DDD",
    marginRight: 10,
  },

  textContainer: {
    flex: 1,
  },
  description: {
    marginTop: 2,
    fontSize: 14,
    color: "#DDD",
  },
});