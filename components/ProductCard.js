import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, Pressable, Linking, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../styles";

export default function ProductCard({ product, clothingType, saved, onSave }) {
  const { width } = useWindowDimensions();
  const [aspectRatio, setAspectRatio] = useState(3 / 4);

  const cardWidth = width - theme.spacing.xl * 2;
  const maxImageHeight = Math.min(width * 0.9, 360);
  const naturalHeight = cardWidth / aspectRatio;
  const imageHeight = Math.min(naturalHeight, maxImageHeight);

  useEffect(() => {
    if (!product.image) {
      setAspectRatio(3 / 4);
      return;
    }

    let cancelled = false;

    Image.getSize(
      product.image,
      (imageWidth, imageHeight) => {
        if (cancelled || !imageWidth || !imageHeight) return;
        setAspectRatio(imageWidth / imageHeight);
      },
      () => {
        if (!cancelled) setAspectRatio(3 / 4);
      }
    );

    return () => {
      cancelled = true;
    };
  }, [product.image]);

  const handleBuyPress = () => {
    if (product.buyUrl) {
      Linking.openURL(product.buyUrl);
    }
  };

  return (
    <View style={styles.card}>
      <View style={[styles.imageContainer, { height: imageHeight }]}>
        {product.image ? (
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={28} color={theme.colors.textDim} />
          </View>
        )}
        <Pressable
          style={styles.heartButton}
          onPress={() => onSave(product, clothingType)}
          accessibilityLabel={saved ? "Remove from closet" : "Save to closet"}
        >
          <Ionicons
            name={saved ? "heart" : "heart-outline"}
            size={22}
            color={saved ? theme.colors.danger : theme.colors.textMuted}
          />
        </Pressable>
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.price}>
            {product.currency} {product.price}
          </Text>
          {saved && (
            <Text style={styles.savedLabel}>Saved</Text>
          )}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.75 },
          ]}
          onPress={handleBuyPress}
        >
          <Text style={styles.buttonText}>View product</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    marginVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderMuted,
  },

  imageContainer: {
    position: "relative",
    width: "100%",
    backgroundColor: theme.colors.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  imagePlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  info: {
    padding: theme.spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.divider,
  },

  title: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    lineHeight: 22,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: theme.spacing.sm,
  },

  price: {
    fontSize: 15,
    fontFamily: theme.fonts.regular,
    color: theme.colors.accentSoft,
  },

  savedLabel: {
    fontSize: 12,
    fontFamily: theme.fonts.bold,
    color: theme.colors.success,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },

  button: {
    marginTop: theme.spacing.md,
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.accent,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },

  buttonText: {
    color: "#FFFFFF",
    fontFamily: theme.fonts.bold,
    fontSize: 14,
  },

  heartButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});
