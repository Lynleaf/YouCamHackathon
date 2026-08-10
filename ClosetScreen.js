import React, {useEffect,useState,useCallback} from "react";
import { useWindowDimensions, Alert, Image } from 'react-native';

import { SafeAreaView } from "react-native-safe-area-context";

import ClosetTabs from "./components/ClosetTabs";
import ClosetGrid from "./components/ClosetGrid";
import ImageUploadBox from './components/ImageUploadBox';

import { loadCloset, toggleCloset } from "./utils/closetHelpers";
import { savePermanentImage } from "./utils/savePermanentImage";

import { tryOnClothes } from "./api/tryOnClothes"

import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ClosetScreen() {
    const { width,height } = useWindowDimensions();
    const appWidth = width*.8;

    const [selectedType, setSelectedType] = useState("all");
    const [clothes, setClothes] = useState([]);
    const [tryOnResult, setTryOnResult] = useState(null);

    async function handleToggleFavorite(item) {

        await toggleCloset(item,item.clothingType);
        // remove from current closet display
        setClothes(previous =>previous.filter(clothing =>clothing.id !== item.id));
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
            const bodyImage =
                await AsyncStorage.getItem("bodyImage");

            if (!bodyImage) {
                Alert.alert(
                    "Body Image Required",
                    "Please upload a body image first."
                );
                return;
            }

            const result = await tryOnClothes(
                bodyImage,
                item.image
            );

            console.log("Try-on result:", result);

            setTryOnResult(result);

        } catch (error) {
            console.error("Try-on error:", error);

            Alert.alert(
                "Try-On Failed",
                error.message
            );
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            
            <ImageUploadBox
                width={appWidth}
                height={height * 0.5}
                imageKey="bodyImage"
                displayUri={tryOnResult}
                onImageSaved={async (uri, restorePreviousImage) => {
                    try {
                        //updates permanent uri to the correct body image
                        const permanentUri = await savePermanentImage(uri, "bodyImage");
                        //set tryonresult to be null to prevent previous try on image from being shown
                        setTryOnResult(null);
                    }
                    catch (err) {
                        console.error(err);
                        restorePreviousImage();
                        Alert.alert("Image Save Failed", err.message);
                    }
                }}
                
            />

            <ClosetTabs
                selected={selectedType}
                onChange={setSelectedType}
            />

            <ClosetGrid
                clothes={filteredClothes}
                onRemove={handleToggleFavorite}
                onPress={(item) => {
                    console.log(item.title);
                    handleTryOn(item);
                }}
                
            />

        </SafeAreaView>
    );
}