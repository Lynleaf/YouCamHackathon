import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { styles, theme } from './styles';

import ColorPalette from "./components/ColorPalette";
import SeasonGuideCard from "./components/SeasonGuideCard";
import { seasonPalettes, getSeasonKey } from './utils/seasonPalettesData';

const PaletteScreen = ({ navigation }) => {
    const [season, setSeason] = useState("");

    useFocusEffect(
        useCallback(() => {
            const loadSeason = async () => {
                const savedSeason = await AsyncStorage.getItem("season");
                if (savedSeason) {
                    setSeason(savedSeason);
                }
            };
            loadSeason();
        }, [])
    );

    return (
        <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
            <View style={styles.heading}>
                <Text style={styles.headingText}>Your palette</Text>
                <Text style={styles.headingSubtext}>
                    {season
                        ? `Full color guide for ${season}`
                        : "Your complete seasonal color guide"}
                </Text>
            </View>

            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
            >
                {season ? (
                    <View style={{ width: "100%" }}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{season}</Text>
                        </View>

                        <View style={{ height: theme.spacing.lg }} />

                        <SeasonGuideCard season={season} />

                        <View style={styles.divider} />

                        <ColorPalette
                            title="Best colors"
                            colorData={seasonPalettes[getSeasonKey(season)].mainColors}
                        />

                        <View style={styles.divider} />

                        <ColorPalette
                            title="Neutrals"
                            colorData={seasonPalettes[getSeasonKey(season)].neutrals}
                        />
                    </View>
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons
                            name="color-filter-outline"
                            size={40}
                            color={theme.colors.textDim}
                            style={{ marginBottom: theme.spacing.md }}
                        />
                        <Text style={styles.emptyStateTitle}>No palette yet</Text>
                        <Text style={styles.emptyStateText}>
                            Analyze your colors on Home to unlock your full seasonal palette.
                        </Text>
                        <Pressable
                            onPress={() => navigation.navigate("Home")}
                            style={({ pressed }) => [
                                styles.button,
                                { alignSelf: "stretch", marginTop: theme.spacing.xl },
                                pressed && styles.buttonPressed,
                            ]}
                        >
                            <Text style={styles.buttonText}>Go to Home</Text>
                        </Pressable>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default PaletteScreen;
