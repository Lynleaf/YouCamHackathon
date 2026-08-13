import React, { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../styles";

export default function ColorPicker({
    palette,
    selectedColors,
    setSelectedColors,
    open,
    onOpenChange,
}) {
    const [internalOpen, setInternalOpen] = useState(false);
    const [colorGroup, setColorGroup] = useState("main");

    const isControlled = typeof open === "boolean";
    const isOpen = isControlled ? open : internalOpen;

    const setOpen = (next) => {
        if (!isControlled) {
            setInternalOpen(next);
        }
        onOpenChange?.(next);
    };

    useEffect(() => {
        if (!palette) return;

        const currentColors =
            colorGroup === "main"
                ? palette.mainColors
                : palette.neutrals;

        setSelectedColors(previous =>
            previous.filter(selected =>
                currentColors.some(c => c.name === selected.name)
            )
        );
    }, [colorGroup, palette]);

    const colors = palette ? (colorGroup === "main" ? palette.mainColors : palette.neutrals) : [];
    if (!palette || colors.length === 0) { return null; }

    const toggleColor = (color) => {
        const exists = selectedColors.some(c => c.name === color.name);

        if (exists) {
            setSelectedColors(
                selectedColors.filter(c => c.name !== color.name)
            );
        } else {
            setSelectedColors([
                ...selectedColors,
                color
            ]);
        }
    };

    return (
        <View style={styles.container}>
            <Pressable
                style={styles.selected}
                onPress={() => setOpen(!isOpen)}
            >
                {selectedColors.length === 0 ? (
                    <Text style={styles.placeholder}>Select colors</Text>
                ) : (
                    <View style={styles.selectedRow}>
                        {selectedColors.slice(0, 5).map(color => (
                            <View
                                key={color.name}
                                style={[
                                    styles.circle,
                                    {
                                        backgroundColor: color.hex,
                                        marginRight: -8,
                                        borderWidth: 2,
                                        borderColor: theme.colors.surface,
                                    }
                                ]}
                            />
                        ))}

                        {selectedColors.length > 5 && (
                            <Text style={styles.moreText}>
                                +{selectedColors.length - 5}
                            </Text>
                        )}

                        <Text style={styles.selectedCount}>
                            {selectedColors.length} selected
                        </Text>
                    </View>
                )}
                <Ionicons
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={theme.colors.textMuted}
                />
            </Pressable>

            {isOpen && (
                <View style={styles.dropdown}>
                    <View style={styles.groupSelector}>
                        <Pressable
                            style={[
                                styles.groupButton,
                                colorGroup === "main" && styles.activeGroup
                            ]}
                            onPress={() => setColorGroup("main")}
                        >
                            <Text style={[
                                styles.groupText,
                                colorGroup === "main" && styles.activeGroupText,
                            ]}>
                                Main Colors
                            </Text>
                        </Pressable>

                        <Pressable
                            style={[
                                styles.groupButton,
                                colorGroup === "neutral" && styles.activeGroup
                            ]}
                            onPress={() => setColorGroup("neutral")}
                        >
                            <Text style={[
                                styles.groupText,
                                colorGroup === "neutral" && styles.activeGroupText,
                            ]}>
                                Neutrals
                            </Text>
                        </Pressable>
                    </View>

                    <ScrollView
                        style={styles.optionsList}
                        nestedScrollEnabled
                        keyboardShouldPersistTaps="handled"
                    >
                        {colors.map((item) => {
                            const selected = selectedColors.some(
                                c => c.name === item.name
                            );

                            return (
                                <Pressable
                                    key={item.name}
                                    style={[
                                        styles.option,
                                        selected && styles.optionSelected,
                                    ]}
                                    onPress={() => toggleColor(item)}
                                >
                                    <View
                                        style={[
                                            styles.circle,
                                            { backgroundColor: item.hex }
                                        ]}
                                    />

                                    <Text style={styles.optionText}>
                                        {item.name}
                                    </Text>

                                    {selected && (
                                        <Ionicons
                                            name="checkmark"
                                            size={18}
                                            color={theme.colors.accent}
                                        />
                                    )}
                                </Pressable>
                            );
                        })}
                    </ScrollView>

                    <Pressable
                        style={styles.doneButton}
                        onPress={() => setOpen(false)}
                    >
                        <Text style={styles.doneText}>
                            Done
                        </Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },

    selected: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        minHeight: 52,
    },

    placeholder: {
        color: theme.colors.textDim,
        fontFamily: theme.fonts.regular,
        fontSize: 15,
        flex: 1,
    },

    dropdown: {
        marginTop: theme.spacing.sm,
        width: "100%",
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.md,
        overflow: "hidden",
    },

    optionsList: {
        maxHeight: 220,
    },

    option: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: theme.colors.divider,
    },

    optionSelected: {
        backgroundColor: theme.colors.surfaceElevated,
    },

    optionText: {
        flex: 1,
        color: theme.colors.text,
        fontFamily: theme.fonts.regular,
        fontSize: 14,
    },

    circle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        marginRight: theme.spacing.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },

    doneButton: {
        padding: theme.spacing.md,
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: theme.colors.divider,
        backgroundColor: theme.colors.accent,
    },

    doneText: {
        fontFamily: theme.fonts.bold,
        color: "#FFFFFF",
        fontSize: 15,
    },
    selectedRow: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },

    moreText: {
        marginLeft: 12,
        fontFamily: theme.fonts.bold,
        color: theme.colors.textMuted,
        fontSize: 13,
    },

    selectedCount: {
        marginLeft: 12,
        fontFamily: theme.fonts.regular,
        color: theme.colors.textMuted,
        fontSize: 13,
    },

    groupSelector: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: theme.colors.divider,
        backgroundColor: theme.colors.surfaceElevated,
    },

    groupButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: "center",
    },

    activeGroup: {
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.accent,
    },

    groupText: {
        color: theme.colors.textDim,
        fontFamily: theme.fonts.regular,
        fontSize: 13,
    },

    activeGroupText: {
        color: theme.colors.text,
        fontFamily: theme.fonts.bold,
    },
});
