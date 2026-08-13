import React, { useState } from 'react';
import { View, Text, Pressable, useWindowDimensions, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { styles, theme } from "./styles";
import ImageUploadBox from './components/ImageUploadBox';
import LoadingOverlay from './components/LoadingOverlay';
import determineSeason from './utils/determineSeason';
import { savePermanentImage } from "./utils/savePermanentImage";
import { analyzeImage } from "./api/analyzeImage";

import AsyncStorage from "@react-native-async-storage/async-storage";

const AnalysisScreen = ({ navigation }) => {
    const { width, height } = useWindowDimensions();
    const uploadWidth = Math.min(width - 40, 420);
    const uploadHeight = Math.min(height * 0.42, 360);
    const [analyzing, setAnalyzing] = useState(false);

    return (
        <SafeAreaView style={styles.screen} edges={["top", "right", "bottom", "left"]}>
            <LoadingOverlay visible={analyzing} message="Analyzing your colors…" />

            <View style={styles.heading}>
                <View style={styles.headingRow}>
                    <Pressable
                        onPress={() => navigation.goBack()}
                        style={({ pressed }) => [
                            styles.backButton,
                            pressed && styles.buttonPressed,
                        ]}
                        accessibilityLabel="Go back"
                        disabled={analyzing}
                    >
                        <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
                    </Pressable>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.headingText}>Upload a photo</Text>
                        <Text style={styles.headingSubtext}>
                            Use natural light and a clear view of your face
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={[styles.scrollContent, { flexGrow: 1 }]}
            >
                <View style={{
                    backgroundColor: theme.colors.surfaceElevated,
                    borderRadius: theme.radius.md,
                    padding: theme.spacing.md,
                    borderWidth: 1,
                    borderColor: theme.colors.borderMuted,
                    marginBottom: theme.spacing.lg,
                }}>
                    <Text style={styles.bodyTextMed}>
                        Tip: Avoid heavy filters or strong shadows. After you choose a photo, tap Save to start the analysis.
                    </Text>
                </View>

                <View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
                    <ImageUploadBox
                        width={uploadWidth}
                        height={uploadHeight}
                        onSavingChange={setAnalyzing}
                        savingMessage="Analyzing your colors…"
                        onImageSaved={async (uri, restorePreviousImage) => {
                            try {
                                const analysis = await analyzeImage(uri);
                                const season = determineSeason(
                                    analysis.color.hair_color,
                                    analysis.color.eye_color,
                                    analysis.color.skin_color
                                );
                                await AsyncStorage.setItem("season", season);
                                await savePermanentImage(uri, "profileImage");
                                console.log("Season is: ", season);

                                navigation.replace("SeasonCongrats", { season });
                            } catch (err) {
                                console.error(err);
                                restorePreviousImage();
                                Alert.alert("Photo Analysis Failed", err.message);
                            }
                        }}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AnalysisScreen;
