import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Image, useWindowDimensions } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles, theme } from "./styles";

import ColorPalette from "./components/ColorPalette";
import SeasonGuideCard from "./components/SeasonGuideCard";
import { seasonPalettes, getSeasonKey } from './utils/seasonPalettesData';

const HomeScreen = ({ navigation }) => {
    const { width } = useWindowDimensions();
    const contentWidth = Math.min(width - 40, 520);

    const [imageUri, setImageUri] = useState(null);
    const [imageAspectRatio, setImageAspectRatio] = useState(3 / 4);
    const [season, setSeason] = useState("");

    useFocusEffect(
        React.useCallback(() => {
            const loadData = async () => {
                try {
                    const [savedImage, savedSeason] = await Promise.all([
                        AsyncStorage.getItem("profileImage"),
                        AsyncStorage.getItem("season"),
                    ]);

                    if (savedImage) {
                        setImageUri(`${savedImage}?t=${Date.now()}`);
                    }
                    if (savedSeason) {
                        setSeason(savedSeason);
                    }
                } catch (error) {
                    console.log("Error loading home data:", error);
                }
            };
            loadData();
        }, [])
    );

    useEffect(() => {
        if (imageUri) {
            Image.getSize(
                imageUri,
                (w, h) => setImageAspectRatio(w / h),
                () => setImageAspectRatio(3 / 4)
            );
        }
    }, [imageUri]);

    const hasSeason = Boolean(season);
    const palette = hasSeason ? seasonPalettes[getSeasonKey(season)] : null;

    return (
        <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
            <View style={styles.heading}>
                <Text style={styles.headingText}>SeeOn</Text>
                <Text style={styles.headingSubtext}>
                    Personal color analysis and wardrobe guidance
                </Text>
            </View>

            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={[styles.scrollContent, { alignItems: "center" }]}
            >
                <View style={{ width: contentWidth }}>
                    {hasSeason ? (
                        <>
                            <View style={{ marginBottom: theme.spacing.lg }}>
                                <Text style={styles.sectionLabel}>Your season</Text>
                                <Text style={styles.headingItalicsText}>{season}</Text>
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>Color profile ready</Text>
                                </View>
                            </View>

                            {imageUri && (
                                <View style={{ marginBottom: theme.spacing.lg }}>
                                    <Image
                                        source={{ uri: imageUri }}
                                        style={[
                                            styles.profileImage,
                                            {
                                                aspectRatio: imageAspectRatio,
                                                maxHeight: 320,
                                            },
                                        ]}
                                        resizeMode="cover"
                                    />
                                </View>
                            )}

                            <SeasonGuideCard season={season} compact />

                            <View style={styles.divider} />

                            <ColorPalette
                                title="Best Colors"
                                colorData={palette.mainColors.slice(0, 6)}
                            />
                            <ColorPalette
                                title="Neutrals"
                                colorData={palette.neutrals}
                            />

                            <Pressable
                                onPress={() => navigation.navigate("Analysis")}
                                style={({ pressed }) => [
                                    styles.buttonSecondary,
                                    pressed && styles.buttonPressed,
                                ]}
                            >
                                <Text style={styles.buttonSecondaryText}>
                                    Re-analyze my colors
                                </Text>
                            </Pressable>
                        </>
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons
                                name="color-palette-outline"
                                size={40}
                                color={theme.colors.textDim}
                                style={{ marginBottom: theme.spacing.md }}
                            />
                            <Text style={styles.emptyStateTitle}>
                                Discover your color season
                            </Text>
                            <Text style={styles.emptyStateText}>
                                Upload a clear photo of your face to find the colors that suit you best. Your palette will appear here.
                            </Text>
                            <Pressable
                                onPress={() => navigation.navigate("Analysis")}
                                style={({ pressed }) => [
                                    styles.button,
                                    { alignSelf: "stretch", marginTop: theme.spacing.xl },
                                    pressed && styles.buttonPressed,
                                ]}
                            >
                                <Text style={styles.buttonText}>
                                    Analyze my color season
                                </Text>
                            </Pressable>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeScreen;
