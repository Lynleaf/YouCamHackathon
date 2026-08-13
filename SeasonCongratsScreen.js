import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import SeasonConfetti from "./components/SeasonConfetti";
import { getSeasonFamily, SEASON_CONFETTI } from "./utils/seasonFamily";
import { styles as globalStyles, theme } from "./styles";

export default function SeasonCongratsScreen({ navigation, route }) {
  const season = route.params?.season || "your season";
  const family = getSeasonFamily(season);
  const confetti = SEASON_CONFETTI[family];
  const fadeIn = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(rise, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeIn, rise]);

  const continueToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "MainTabs", params: { screen: "Home" } }],
    });
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "right", "bottom", "left"]}>
      <SeasonConfetti season={season} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeIn,
            transform: [{ translateY: rise }],
          },
        ]}
      >
        <View style={styles.iconBadge}>
          <Ionicons name={confetti.icon} size={36} color={confetti.colors[0]} />
        </View>

        <Text style={styles.eyebrow}>Congratulations</Text>
        <Text style={styles.title}>You are a</Text>
        <Text style={styles.seasonName}>{season}</Text>
        <Text style={styles.body}>
          Your seasonal palette is ready. Explore your best colors, find matching looks, and build your closet.
        </Text>

        <Pressable
          onPress={continueToHome}
          style={({ pressed }) => [
            globalStyles.button,
            styles.cta,
            pressed && globalStyles.buttonPressed,
          ]}
        >
          <Text style={globalStyles.buttonText}>See my palette</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xxl,
  },
  iconBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xl,
  },
  eyebrow: {
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: theme.spacing.sm,
  },
  title: {
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    fontSize: 22,
    textAlign: "center",
  },
  seasonName: {
    color: theme.colors.accentSoft,
    fontFamily: theme.fonts.italic,
    fontSize: 34,
    textAlign: "center",
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
    lineHeight: 42,
  },
  body: {
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.regular,
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
    maxWidth: 320,
    marginBottom: theme.spacing.xl,
  },
  cta: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 320,
    marginTop: theme.spacing.sm,
  },
});
