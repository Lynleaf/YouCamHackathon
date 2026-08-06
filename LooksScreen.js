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
import { seasonPalettes, getSeasonKey } from './utils/seasonPalettesData';

const LooksScreen = ({ navigation }) => {
    
    const [products, setProducts] = useState([]);
    const [season, setSeason] = useState("");
    const [clothingType, setClothingType] = useState("sweater");
    const [selectedDropdownColors, setSelectedDropdownColors] = useState([]);

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

    return (
        <SafeAreaView>
            <ColorPicker palette={seasonPalettes[getSeasonKey(season)]}
                selectedColors={selectedDropdownColors}
                setSelectedColors={setSelectedDropdownColors}/>
            <Picker
                selectedValue={clothingType}
                onValueChange={(itemValue) => setClothingType(itemValue)}>
                <Picker.Item label="Tops" value="top" />
                <Picker.Item label="Sweaters" value="sweater" />
                <Picker.Item label="Pants" value="pants" />
                <Picker.Item label="Skirts" value="skirt" />
                <Picker.Item label="Shorts" value="shorts" />
                <Picker.Item label="Dresses" value="dress" />
                <Picker.Item label="Jackets" value="jacket" />
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
                    <ProductCard product={item} />
                )}/>
        </SafeAreaView>
        
    );
};
export default LooksScreen;