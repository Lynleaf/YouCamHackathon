
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';

import AsyncStorage from "@react-native-async-storage/async-storage";

import {styles} from './styles';

import ColorPalette from "./components/ColorPalette";
import { seasonPalettes, getSeasonKey } from './utils/seasonPalettesData';


const PaletteScreen = ({ navigation }) => {
    const [season, setSeason] = useState("");
    useEffect(() => {
        const loadSeason = async () => {
            const savedSeason = await AsyncStorage.getItem("season");
            if (savedSeason) {
                setSeason(savedSeason);
            }
        };
        loadSeason();
    }, []);
    return (
        <ScrollView style={styles.scrollContainer}
                    contentContainerStyle = {styles.scrollContent}
                >
            {season && <View>
            <ColorPalette title="All Best Colors" colorData={seasonPalettes[getSeasonKey(season)].mainColors}></ColorPalette>
            <ColorPalette title="Neutrals" colorData={seasonPalettes[getSeasonKey(season)].neutrals}></ColorPalette>
            </View>}
        </ScrollView>
    );
};

export default PaletteScreen;