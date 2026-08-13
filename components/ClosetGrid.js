import React from "react";
import { FlatList, Text, View } from "react-native";

import ClosetItem from "./ClosetItem";
import { styles as globalStyles, theme } from "../styles";

export default function ClosetGrid({ clothes, onRemove, onPress }) {
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
            ListEmptyComponent={
                <View style={[globalStyles.emptyState, { paddingVertical: theme.spacing.lg }]}>
                    <Text style={globalStyles.emptyStateTitle}>No saved pieces yet</Text>
                    <Text style={globalStyles.emptyStateText}>
                        Heart items from Looks to add them here.
                    </Text>
                </View>
            }
            contentContainerStyle={{ paddingBottom: 24, paddingTop: 0, flexGrow: 1 }}
            columnWrapperStyle={clothes.length ? { gap: theme.spacing.sm } : undefined}
            style={{ flex: 1 }}
        />
    );
}
