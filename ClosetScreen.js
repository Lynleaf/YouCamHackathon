import React, { useState, useCallback } from "react";
import { useWindowDimensions, Alert, View, Text } from 'react-native';

import { SafeAreaView } from "react-native-safe-area-context";

import ClosetTabs from "./components/ClosetTabs";
import ClosetGrid from "./components/ClosetGrid";
import ImageUploadBox from './components/ImageUploadBox';
import LoadingOverlay from "./components/LoadingOverlay";

import { loadCloset, toggleCloset } from "./utils/closetHelpers";
import { savePermanentImage } from "./utils/savePermanentImage";

import { tryOnClothes } from "./api/tryOnClothes";

import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles, theme } from "./styles";

export default function ClosetScreen() {
    const { width, height } = useWindowDimensions();
    const uploadWidth = Math.min(width * 0.42, 190);
    const uploadHeight = Math.min(uploadWidth * 1.55, height * 0.34);

    const [selectedType, setSelectedType] = useState("all");
    const [clothes, setClothes] = useState([]);
    const [tryOnResult, setTryOnResult] = useState(null);
    const [tryingOn, setTryingOn] = useState(false);
    const [savingPhoto, setSavingPhoto] = useState(false);

    async function handleToggleFavorite(item) {
        await toggleCloset(item, item.clothingType);
        setClothes(previous => previous.filter(clothing => clothing.id !== item.id));
    }

    useFocusEffect(
        useCallback(() => {
            async function load() {
                const saved = await loadCloset();
                setClothes(saved);
            }

            load();
        }, [])
    );

    const filteredClothes =
        selectedType === "all" ? clothes : clothes.filter(item => item.clothingType === selectedType);

    const handleTryOn = async (item) => {
        try {
            const bodyImage = await AsyncStorage.getItem("bodyImage");

            if (!bodyImage) {
                Alert.alert(
                    "Body photo needed",
                    "Upload a full-body photo above first, then tap a saved piece to try it on."
                );
                return;
            }

            setTryingOn(true);
            const result = await tryOnClothes(bodyImage, item.image);
            console.log("Try-on result:", result);
            setTryOnResult(result);
        } catch (error) {
            console.error("Try-on error:", error);
            Alert.alert("Try-On Failed", error.message);
        } finally {
            setTryingOn(false);
        }
    };

    return (
        <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
            <LoadingOverlay
                visible={tryingOn || savingPhoto}
                message={tryingOn ? "Trying on…" : "Saving photo…"}
            />

            <View style={styles.heading}>
                <Text style={styles.headingText}>Your closet</Text>
                <Text style={styles.headingSubtext}>
                    Upload a body photo, then tap a piece to try it on
                </Text>
            </View>

            <View style={{ flex: 1 }}>
                <View style={{ alignItems: "center", paddingTop: theme.spacing.sm }}>
                    <ImageUploadBox
                        width={uploadWidth}
                        height={uploadHeight}
                        imageKey="bodyImage"
                        displayUri={tryOnResult}
                        compact
                        onSavingChange={setSavingPhoto}
                        savingMessage="Saving photo…"
                        onImageSaved={async (uri, restorePreviousImage) => {
                            try {
                                await savePermanentImage(uri, "bodyImage");
                                setTryOnResult(null);
                            } catch (err) {
                                console.error(err);
                                restorePreviousImage();
                                Alert.alert("Image Save Failed", err.message);
                            }
                        }}
                    />
                </View>

                <View style={{
                    flex: 1,
                    paddingHorizontal: theme.spacing.xl,
                    borderTopWidth: 1,
                    borderTopColor: theme.colors.divider,
                    paddingTop: theme.spacing.md,
                    backgroundColor: theme.colors.background,
                }}>
                    <Text style={[styles.sectionLabel, { marginBottom: theme.spacing.xs }]}>
                        Saved pieces
                    </Text>
                    <Text style={[styles.sectionSubtitle, { marginBottom: theme.spacing.sm }]}>
                        Tap a piece to try it on. Heart again to remove.
                    </Text>
                    <ClosetTabs
                        selected={selectedType}
                        onChange={setSelectedType}
                    />
                    <View style={{ marginTop: theme.spacing.sm, flex: 1 }}>
                        <ClosetGrid
                            clothes={filteredClothes}
                            onRemove={handleToggleFavorite}
                            onPress={(item) => {
                                console.log(item.title);
                                handleTryOn(item);
                            }}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
