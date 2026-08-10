import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Image, useWindowDimensions } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { styles } from "./styles";

import ColorPalette from "./components/ColorPalette";
import { seasonPalettes, getSeasonKey } from './utils/seasonPalettesData';

const HomeScreen = ({ navigation }) => {
    const { width,height } = useWindowDimensions();
    const appWidth = width*.8;

    const [imageUri, setImageUri] = useState(null);
    const [imageAspectRatio, setImageAspectRatio] = useState(1);
    const [season, setSeason] = useState("");

    //Tries to load saved profile image each time home screen is in focus
    useFocusEffect(
        React.useCallback(() => {
            const loadImage = async () => {
                try {
                    const savedImage = await AsyncStorage.getItem("profileImage");
                    console.log("Loaded image:", savedImage);
                    if (savedImage) {
                        setImageUri(`${savedImage}?t=${Date.now()}`);
                    }
                } catch (error) {
                    console.log("Error loading image:", error);
                }
            };
            loadImage();
        }, [])
    );

    //gets image aspect ratio
    useEffect(() => {
        if (imageUri) {
            Image.getSize(imageUri, (width, height) => {setImageAspectRatio(width / height);});
        }
    }, [imageUri]);

    //Tries to load saved season
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
            <View style={{width:appWidth}}>
            {season && <View>
            <Text style={styles.headingText}>Your season is</Text>
            <Text style={styles.headingItalicsText}>{season}</Text>
            </View>}
            
            {imageUri && <Image
                source={{ uri: imageUri }}
                style={[styles.profileImage,{ aspectRatio: imageAspectRatio }]}
                />}
            
            {season && <View>
            <ColorPalette title="Best Colors" colorData={seasonPalettes[getSeasonKey(season)].mainColors.slice(0,6)}></ColorPalette>
            <ColorPalette title="Neutrals" colorData={seasonPalettes[getSeasonKey(season)].neutrals}></ColorPalette>
            </View>}
            
            <Pressable 
                onPress={() => {
                    navigation.navigate("Analysis");
                    console.log('Button pressed!'); 
                }}
                style={({ pressed }) => [
                    styles.button, 
                    pressed && styles.buttonPressed
            ]}>
                {({ pressed }) => (
                    <Text style={styles.buttonText}>
                        Analyze my color season!
                    </Text>
                )}
            </Pressable>
            </View>
        </ScrollView>
    );
};

export default HomeScreen;