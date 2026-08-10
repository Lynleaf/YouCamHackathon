import React from "react";
import { FlatList } from "react-native";

import ClosetItem from "./ClosetItem";

export default function ClosetGrid({clothes,onRemove,onPress}) {
    return (
        <FlatList
            data={clothes}
            keyExtractor={item => item.id}
            numColumns={3}
            renderItem={({ item }) => (
                <ClosetItem
                    item={item}
                    onPress={onPress}
                    onRemove={onRemove}
                />
            )}
            style={{
                maxHeight: 120, 
            }}
        />
    );
}