import React, { useState, useEffect } from "react";
import {View,Text,Pressable,FlatList,StyleSheet} from "react-native";

export default function ColorPicker({
    palette,
    selectedColors,
    setSelectedColors
}) {
    const [open, setOpen] = useState(false);
    const [colorGroup, setColorGroup] = useState("main");
    
    //make previously selected colors not show
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

    //get colors based group selected
    const colors = palette ? (colorGroup === "main" ? palette.mainColors : palette.neutrals) : [];
    if (!palette || colors.length === 0) {return null;}

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

            {/* Header */}
            <Pressable
                style={styles.selected}
                onPress={() => setOpen(!open)}
            >
                {selectedColors.length === 0 ? (
                    <Text>Select Colors</Text>
                ) : (
                    <View style={styles.selectedRow}>
                        {selectedColors.slice(0, 5).map(color => (
                            <View
                                key={color.name}
                                style={[
                                    styles.circle,
                                    {
                                        backgroundColor: color.hex,
                                        marginRight: -8, // overlap circles
                                        borderWidth: 2,
                                        borderColor: "white",
                                    }
                                ]}
                            />
                        ))}

                        {selectedColors.length > 5 && (
                            <Text style={styles.moreText}>
                                +{selectedColors.length - 5}
                            </Text>
                        )}

                        <Text style={styles.arrow}>
                            ▼
                        </Text>
                    </View>
                )}
            </Pressable>

            {open && (
                <View style={styles.dropdown}>
                    <View style={styles.groupSelector}>
                        <Pressable
                            style={[
                                styles.groupButton,
                                colorGroup === "main" && styles.activeGroup
                            ]}
                            onPress={() => setColorGroup("main")}
                        >
                            <Text>Main Colors</Text>
                        </Pressable>

                        <Pressable
                            style={[
                                styles.groupButton,
                                colorGroup === "neutral" && styles.activeGroup
                            ]}
                            onPress={() => setColorGroup("neutral")}
                        >
                            <Text>Neutrals</Text>
                        </Pressable>
                    </View>

                    <FlatList
                        data={colors}
                        keyExtractor={(item) => item.name}
                        renderItem={({ item }) => {

                            const selected = selectedColors.some(
                                c => c.name === item.name
                            );

                            return (
                                <Pressable
                                    style={styles.option}
                                    onPress={() => toggleColor(item)}
                                >

                                    <View
                                        style={[
                                            styles.circle,
                                            { backgroundColor: item.hex }
                                        ]}
                                    />

                                    <Text style={{ flex: 1 }}>
                                        {item.name}
                                    </Text>

                                    {selected && (
                                        <Text style={styles.check}>
                                            ✓
                                        </Text>
                                    )}

                                </Pressable>
                            );
                        }}
                    />

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
        width: 220,
    },

    selected: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        minHeight: 50,
    },

    dropdown: {
        position: "absolute",
        top: 55,
        width: "100%",
        maxHeight: 300,
        backgroundColor: "white",
        borderWidth: 1,
        borderRadius: 10,
        zIndex: 10,
    },

    option: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
    },

    circle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        marginRight: 10,
        borderWidth: 1,
        borderColor: "#999",
    },

    check: {
        fontSize: 18,
        fontWeight: "bold",
    },

    doneButton: {
        padding: 12,
        alignItems: "center",
        borderTopWidth: 1,
    },

    doneText: {
        fontWeight: "600",
    },
    selectedRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    moreText: {
        marginLeft: 12,
        fontWeight: "600",
    },

    arrow: {
        marginLeft: "auto",
        fontSize: 12,
    },
    groupSelector: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#DDD",
    },

    groupButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: "center",
    },

    activeGroup: {
        backgroundColor: "#F2F2F2",
    },
});