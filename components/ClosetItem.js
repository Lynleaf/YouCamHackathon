import React from "react";
import { Image, Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../styles";

const SPACING = 8;
const NUM_COLUMNS = 3;
const HORIZONTAL_PADDING = 40;

export default function ClosetItem({
    item,
    onRemove,
    onPress,
}) {
    const { width } = useWindowDimensions();
    const itemSize =
        (width - HORIZONTAL_PADDING - SPACING * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

    return (
        <View style={[styles.container, { width: itemSize, height: itemSize }]}>
            <Pressable
                onPress={() => onPress(item)}
                style={({ pressed }) => [
                    styles.pressable,
                    pressed && { opacity: 0.85 },
                ]}
            >
                <Image
                    source={{ uri: item.image }}
                    style={styles.image}
                />
            </Pressable>

            <Pressable
                style={styles.heartButton}
                onPress={() => onRemove(item)}
                accessibilityLabel="Remove from closet"
            >
                <Ionicons
                    name="heart"
                    size={16}
                    color={theme.colors.danger}
                />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING,
        borderRadius: theme.radius.md,
        overflow: "hidden",
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.borderMuted,
    },

    pressable: {
        width: "100%",
        height: "100%",
    },

    image: {
        width: "100%",
        height: "100%",
    },
    heartButton: {
        position: "absolute",
        top: 6,
        right: 6,
        backgroundColor: theme.colors.surface,
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
});
