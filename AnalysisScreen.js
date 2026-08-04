import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, useWindowDimensions } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

import {styles} from "./styles";
import ImageUploadBox from './components/ImageUploadBox';
import determineSeason from './utils/determineSeason';
import {analyzeImage} from "./api/analyzeImage";


const AnalysisScreen = ({ navigation }) => {
    const { width,height } = useWindowDimensions();
    const appWidth = width*.8;

    return (
        
        <SafeAreaView style={styles.container}>
            <View style={styles.heading}>
                <Text style={styles.headingText}>
                    Upload your
                </Text>
                <Text style={styles.headingItalicsText}>
                    image
                </Text>
            </View>
            <View style={styles.container}>
                <ImageUploadBox width={appWidth} height={height*.5} 
                onImageSaved={async (uri)=>{
                    try{
                    const analysis = await analyzeImage(uri);
                    const season = determineSeason(
                        analysis.color.hair_color,
                        analysis.color.eye_color,
                        analysis.color.skin_color
                    );
                    console.log("Season is: ",season);
                    /*
                    const season = determineSeason(
                        response.hair,
                        response.eyes,
                        response.skin
                    );
                    
                    const testResponse = {
                        hair: "#4B2E2B",
                        eyes: "#4F6B45",
                        skin: "#F2C8A5"
                    };
                    const season = determineSeason(
                        testResponse.hair,
                        testResponse.eyes,
                        testResponse.skin
                    );
                    console.log(season);
                    console.log("UPLOAD RESPONSE:", data);*/
                    navigation.navigate("MainTabs", {screen: "Home"});
                    }
                    catch(err){
                        console.error(err);
                    }
                }}/>
            </View>
        </SafeAreaView>
    );
};

export default AnalysisScreen;