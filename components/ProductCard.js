import React from "react";
import { StyleSheet, View, Text, Image, Pressable, Linking } from "react-native";

export default function ProductCard({ product }) {
  const handleBuyPress = () => {
    if (product.buyUrl) {
      Linking.openURL(product.buyUrl);
    }
  };

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: product.image }}
        style={styles.image}
        resizeMode="cover"
      />

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
});