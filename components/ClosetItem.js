import React from "react";
import {Image,Pressable,StyleSheet,Text,View} from "react-native";
import { Dimensions } from "react-native";

const SPACING = 8;
const NUM_COLUMNS = 3;

const ITEM_SIZE =
    (Dimensions.get("window").width -
        SPACING * (NUM_COLUMNS + 1)) /
    NUM_COLUMNS;

export default function ClosetItem({
    item,
    onRemove,
    onPress,
}) {
    return (
        <View style={styles.container}>

            <Pressable
                onPress={() => onPress(item)}
            >
                <Image
                    source={{ uri: item.image }}
                    style={styles.image}
                />
            </Pressable>


            <Pressable
                style={styles.heartButton}
                onPress={() => onRemove(item)}
            >
                <Text style={styles.heart}>
                    ❤️
                </Text>
            </Pressable>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        margin: SPACING / 2,
        borderRadius: 12,
        overflow: "hidden",
    },

    image: {
        width: "100%",
        height: "100%",
    },
    heartButton: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "rgba(255,255,255,0.8)",
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
    },

    heart: {
        fontSize: 20,
    },
});