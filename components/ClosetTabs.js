import React from "react";
import {
    View,
    Pressable,
    Text,
    StyleSheet,
} from "react-native";

import { CLOTHING_TYPES } from "../utils/clothingTypesData";

export default function ClosetTabs({
    selected,
    onChange,
}) {
    return (
        <View style={styles.container}>
            {CLOTHING_TYPES.map(type => (
                <Pressable
                    key={type.value}
                    style={[
                        styles.tab,
                        selected === type.value &&
                            styles.selected
                    ]}
                    onPress={() => onChange(type.value)}
                >
                    <Text>{type.label}</Text>
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 10,
    },

    tab: {
        backgroundColor: "#EEE",
        paddingHorizontal: 12,
        paddingVertical: 8,
        margin: 4,
        borderRadius: 20,
    },

    selected: {
        backgroundColor: "#CCC",
    },
});