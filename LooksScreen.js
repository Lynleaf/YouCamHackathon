import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import { styles, theme } from './styles';

import { searchProducts } from "./api/searchProducts";
import ProductCard from "./components/ProductCard";
import ColorPicker from "./components/ColorPicker";
import OptionPicker from "./components/OptionPicker";
import LoadingOverlay from "./components/LoadingOverlay";

import { CLOTHING_TYPES } from "./utils/clothingTypesData";
import { seasonPalettes, getSeasonKey } from './utils/seasonPalettesData';
import { toggleCloset, loadCloset } from "./utils/closetHelpers";

const LooksScreen = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [season, setSeason] = useState("");
    const [clothingType, setClothingType] = useState("sweater");
    const [selectedDropdownColors, setSelectedDropdownColors] = useState([]);
    const [savedIds, setSavedIds] = useState(new Set());
    const [openPicker, setOpenPicker] = useState(null);
    const [searching, setSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        const loadSeason = async () => {
            const savedSeason = await AsyncStorage.getItem("season");

            if (savedSeason) {
                setSeason(savedSeason);
                setSelectedDropdownColors([]);
            }
        };

        loadSeason();
    }, []);

    async function handleSearch(colorArr, clothingType) {
        if (!colorArr.length) {
            return;
        }

        setSearching(true);
        setHasSearched(true);
        try {
            let allProducts = [];

            for (const color of colorArr) {
                const results = await searchProducts(color + " " + clothingType);
                allProducts.push(...results);
            }
            const uniqueProducts = Array.from(
                new Map(
                    allProducts.map(item => [item.id, item])
                ).values()
            );
            setProducts(uniqueProducts);
        } finally {
            setSearching(false);
        }
    }

    useEffect(() => {
        async function loadSaved() {
            const closet = await loadCloset();

            setSavedIds(
                new Set(closet.map(item => item.id))
            );
        }

        loadSaved();
    }, []);

    async function handleToggleSave(product, clothingType) {
        const isNowSaved = await toggleCloset(product, clothingType);

        setSavedIds(previous => {
            const next = new Set(previous);

            if (isNowSaved) {
                next.add(product.id);
            } else {
                next.delete(product.id);
            }

            return next;
        });
    }

    const canSearch = selectedDropdownColors.length > 0 && !searching;

    return (
        <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
            <LoadingOverlay visible={searching} message="Finding looks…" />

            <View style={styles.heading}>
                <Text style={styles.headingText}>Find your looks</Text>
                <Text style={styles.headingSubtext}>
                    Search pieces that match your seasonal palette
                </Text>
            </View>

            <View style={styles.screenContent}>
                {!season ? (
                    <View style={styles.emptyState}>
                        <Ionicons
                            name="sparkles-outline"
                            size={36}
                            color={theme.colors.textDim}
                            style={{ marginBottom: theme.spacing.md }}
                        />
                        <Text style={styles.emptyStateTitle}>Palette required</Text>
                        <Text style={styles.emptyStateText}>
                            Analyze your colors on Home first so we can suggest matching clothes.
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
                ) : (
                    <>
                        <Text style={styles.sectionLabel}>Colors</Text>
                        <ColorPicker
                            palette={seasonPalettes[getSeasonKey(season)]}
                            selectedColors={selectedDropdownColors}
                            setSelectedColors={setSelectedDropdownColors}
                            open={openPicker === "colors"}
                            onOpenChange={(isOpen) => setOpenPicker(isOpen ? "colors" : null)}
                        />

                        <Text style={[styles.sectionLabel, { marginTop: theme.spacing.lg }]}>
                            Clothing type
                        </Text>
                        <OptionPicker
                            options={CLOTHING_TYPES.filter(type => type.value !== "all")}
                            selectedValue={clothingType}
                            onValueChange={setClothingType}
                            placeholder="Select clothing type"
                            open={openPicker === "clothing"}
                            onOpenChange={(isOpen) => setOpenPicker(isOpen ? "clothing" : null)}
                        />

                        <Pressable
                            style={({ pressed }) => [
                                styles.button,
                                { marginTop: theme.spacing.sm, marginBottom: theme.spacing.md },
                                !canSearch && { opacity: 0.45 },
                                pressed && canSearch && styles.buttonPressed,
                            ]}
                            disabled={!canSearch}
                            onPress={() => {
                                setOpenPicker(null);
                                console.log(
                                    "Search value: ",
                                    selectedDropdownColors.map(c => c.name),
                                    clothingType
                                );
                                handleSearch(
                                    selectedDropdownColors.map(c => c.name),
                                    clothingType
                                );
                            }}
                        >
                            <Text style={styles.buttonText}>
                                {selectedDropdownColors.length
                                    ? `Search ${selectedDropdownColors.length} color${selectedDropdownColors.length > 1 ? "s" : ""}`
                                    : "Select colors to search"}
                            </Text>
                        </Pressable>

                        <View style={styles.divider} />

                        <FlatList
                            data={products}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
                            ListEmptyComponent={
                                <View style={styles.emptyState}>
                                    <Text style={styles.emptyStateTitle}>
                                        {hasSearched ? "No pieces found" : "Ready to search"}
                                    </Text>
                                    <Text style={styles.emptyStateText}>
                                        {hasSearched
                                            ? "Try different colors or another clothing type."
                                            : "Choose one or more colors from your palette, pick a clothing type, then search."}
                                    </Text>
                                </View>
                            }
                            renderItem={({ item }) => (
                                <ProductCard
                                    product={item}
                                    clothingType={clothingType}
                                    saved={savedIds.has(item.id)}
                                    onSave={handleToggleSave}
                                />
                            )}
                        />
                    </>
                )}
            </View>
        </SafeAreaView>
    );
};

export default LooksScreen;
