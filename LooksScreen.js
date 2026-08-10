import React, { useState, useEffect } from 'react';
import { Text, Pressable, ScrollView, Image, FlatList, Button } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

import {styles} from './styles';

import { searchProducts } from "./api/searchProducts";
import ProductCard from "./components/ProductCard";
import ColorPicker from "./components/ColorPicker";

import { CLOTHING_TYPES } from "./utils/clothingTypesData";
import { seasonPalettes, getSeasonKey } from './utils/seasonPalettesData';
import {toggleCloset, loadCloset} from "./utils/closetHelpers";

const LooksScreen = ({ navigation }) => {
    
    const [products, setProducts] = useState([]);
    const [season, setSeason] = useState("");
    const [clothingType, setClothingType] = useState("sweater");
    const [selectedDropdownColors, setSelectedDropdownColors] = useState([]);
    const [savedIds, setSavedIds] = useState(new Set());

    //Tries to load saved season
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

    //Finds clothes of matching color
    async function handleSearch(colorArr,clothingType) {
        let allProducts = [];

        for (const color of colorArr) {
            const results = await searchProducts(color+" "+clothingType);
            allProducts.push(...results);
        }
        const uniqueProducts = Array.from(
            new Map(
                allProducts.map(item => [item.id, item])
            ).values()
        );
        setProducts(uniqueProducts);
    }

    //load saved products 
    useEffect(() => {
        async function loadSaved() {
            const closet = await loadCloset();

            setSavedIds(
                new Set(closet.map(item => item.id))
            );
        }

        loadSaved();
    }, []);

    //use to save/unsave to closet (async storage)
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

    return (
        <SafeAreaView>
            <ColorPicker palette={seasonPalettes[getSeasonKey(season)]}
                selectedColors={selectedDropdownColors}
                setSelectedColors={setSelectedDropdownColors}/>
            <Picker
                selectedValue={clothingType}
                onValueChange={setClothingType}
            >
                {CLOTHING_TYPES.filter(type => type.value !== "all").map(type => (
                    <Picker.Item
                        key={type.value}
                        label={type.label}
                        value={type.value}
                    />
                ))}
            </Picker>
            <Button 
                title="Search"
                onPress={() => {
                    console.log("Search value: ",selectedDropdownColors.map(c => c.name),clothingType);
                    handleSearch(selectedDropdownColors.map(c => c.name),clothingType)}}
            />
            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ProductCard product={item}
                        clothingType={clothingType}
                        saved={savedIds.has(item.id)}
                        onSave={handleToggleSave} />
                )}/>
        </SafeAreaView>
        
    );
};
export default LooksScreen;