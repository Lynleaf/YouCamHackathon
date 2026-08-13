import React from "react";
import {
    View,
    Pressable,
    Text,
    StyleSheet,
    ScrollView,
} from "react-native";

import { CLOTHING_TYPES } from "../utils/clothingTypesData";
import { theme } from "../styles";

export default function ClosetTabs({
    selected,
    onChange,
}) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0 }}
            contentContainerStyle={styles.container}
        >
            {CLOTHING_TYPES.map(type => {
                const isSelected = selected === type.value;
                return (
                    <Pressable
                        key={type.value}
                        style={[
                            styles.tab,
                            isSelected && styles.selected,
                        ]}
                        onPress={() => onChange(type.value)}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                isSelected && styles.selectedText,
                            ]}
                        >
                            {type.label}
                        </Text>
                    </Pressable>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.sm,
        paddingVertical: 0,
    },

    tab: {
        backgroundColor: theme.colors.surface,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 8,
        borderRadius: theme.radius.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },

    selected: {
        backgroundColor: theme.colors.accent,
        borderColor: theme.colors.accent,
    },

    tabText: {
        color: theme.colors.textMuted,
        fontFamily: theme.fonts.regular,
        fontSize: 13,
    },

    selectedText: {
        color: "#FFFFFF",
        fontFamily: theme.fonts.bold,
    },
});
