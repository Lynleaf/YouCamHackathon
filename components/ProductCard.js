import React from "react";
import { StyleSheet, View, Text, Image, Pressable, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProductCard({ product, clothingType, saved, onSave }) {
  const handleBuyPress = () => {
    if (product.buyUrl) {
      Linking.openURL(product.buyUrl);
    }
  };

  return (
    <View style={styles.card}>

      <View style={styles.imageContainer}>
        <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
        />
        <Pressable
            style={styles.heartButton}
            onPress={() => onSave(product, clothingType)}
        >
            <Ionicons
                name={saved ? "heart" : "heart-outline"}
                size={28}
                color={saved ? "#E63946" : "#444"}
            />
        </Pressable>
    </View>
    {/*
      <Image
        source={{ uri: product.image }}
        style={styles.image}
        resizeMode="cover"
      />*/}

      <View style={styles.info}>

        <Text style={styles.title}>
          {product.title}
        </Text>

        <Text style={styles.price}>
          {product.currency} {product.price}
        </Text>

        <Pressable 
          style={styles.button}
          onPress={handleBuyPress}
        >
          <Text style={styles.buttonText}>
            View Product
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    margin: 10,
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 250,
  },

  info: {
    padding: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 4,
  },

  price: {
    fontSize: 16,
    marginTop: 8,
    fontWeight: "bold",
  },

  button: {
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#111",
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  imageContainer: {
    position: "relative",
  },
  heartButton: {
      position: "absolute",
      top: 12,
      right: 12,
      backgroundColor: "rgba(255,255,255,0.8)",
      borderRadius: 20,
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
  },
  heart: {
      fontSize: 24,
  },
});