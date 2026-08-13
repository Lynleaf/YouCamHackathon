import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Dimensions, Easing, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getSeasonFamily, SEASON_CONFETTI } from "../utils/seasonFamily";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const PARTICLE_COUNT = 36;

function createParticles(family) {
  const config = SEASON_CONFETTI[family] || SEASON_CONFETTI.spring;

  return Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
    id: `${family}-${index}`,
    icon: config.icon,
    color: config.colors[index % config.colors.length],
    size: 14 + (index % 5) * 4,
    startX: Math.random() * SCREEN_WIDTH,
    drift: (Math.random() - 0.5) * 90,
    delay: Math.random() * 900,
    duration: 2200 + Math.random() * 1800,
    spin: (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 360),
  }));
}

function ConfettiPiece({ particle }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(particle.delay),
        Animated.timing(progress, {
          toValue: 1,
          duration: particle.duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [particle, progress]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-40, SCREEN_HEIGHT + 40],
  });

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, particle.drift],
  });

  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", `${particle.spin}deg`],
  });

  const opacity = progress.interpolate({
    inputRange: [0, 0.1, 0.85, 1],
    outputRange: [0, 1, 1, 0],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.piece,
        {
          left: particle.startX,
          opacity,
          transform: [{ translateY }, { translateX }, { rotate }],
        },
      ]}
    >
      <Ionicons name={particle.icon} size={particle.size} color={particle.color} />
    </Animated.View>
  );
}

export default function SeasonConfetti({ season, active = true }) {
  const family = getSeasonFamily(season);
  const particles = useMemo(() => createParticles(family), [family]);

  if (!active) {
    return null;
  }

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {particles.map((particle) => (
        <ConfettiPiece key={particle.id} particle={particle} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  piece: {
    position: "absolute",
    top: 0,
  },
});
