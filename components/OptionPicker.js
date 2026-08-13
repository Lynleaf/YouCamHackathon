import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../styles";

export default function OptionPicker({
    options = [],
    selectedValue,
    onValueChange,
    placeholder = "Select an option",
    open,
    onOpenChange,
}) {
    const [internalOpen, setInternalOpen] = useState(false);

    const isControlled = typeof open === "boolean";
    const isOpen = isControlled ? open : internalOpen;

    const setOpen = (next) => {
        if (!isControlled) {
            setInternalOpen(next);
        }
        onOpenChange?.(next);
    };

    const selectedOption = options.find(option => option.value === selectedValue);

    return (
        <View style={styles.container}>
            <Pressable
                style={styles.trigger}
                onPress={() => setOpen(!isOpen)}
            >
                <Text style={selectedOption ? styles.valueText : styles.placeholder}>
                    {selectedOption ? selectedOption.label : placeholder}
                </Text>
                <Ionicons
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={theme.colors.textMuted}
                />
            </Pressable>

            {isOpen && (
                <View style={styles.dropdown}>
                    <ScrollView
                        style={styles.optionsList}
                        nestedScrollEnabled
                        keyboardShouldPersistTaps="handled"
                    >
                        {options.map((option) => {
                            const selected = option.value === selectedValue;

                            return (
                                <Pressable
                                    key={option.value}
                                    style={[
                                        styles.option,
                                        selected && styles.optionSelected,
                                    ]}
                                    onPress={() => {
                                        onValueChange(option.value);
                                        setOpen(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        selected && styles.optionTextSelected,
                                    ]}>
                                        {option.label}
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
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginBottom: theme.spacing.sm,
    },
    trigger: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.md,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
        minHeight: 52,
    },
    valueText: {
        flex: 1,
        color: theme.colors.text,
        fontFamily: theme.fonts.regular,
        fontSize: 15,
    },
    placeholder: {
        flex: 1,
        color: theme.colors.textDim,
        fontFamily: theme.fonts.regular,
        fontSize: 15,
    },
    dropdown: {
        marginTop: theme.spacing.sm,
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
        paddingVertical: 13,
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
    optionTextSelected: {
        fontFamily: theme.fonts.bold,
        color: theme.colors.accent,
    },
});
