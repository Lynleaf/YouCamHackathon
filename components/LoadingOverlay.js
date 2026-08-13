import React from "react";
import { Modal, View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { theme } from "../styles";

export default function LoadingOverlay({ visible, message = "Loading…" }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {}}
    >
      <View style={styles.backdrop} pointerEvents="auto">
        <View style={styles.card}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(250, 250, 248, 0.72)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xxl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    minWidth: 180,
    gap: theme.spacing.md,
  },
  message: {
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
