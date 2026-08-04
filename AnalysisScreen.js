import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, useWindowDimensions, Alert } from 'react-native';
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
                    
                    navigation.navigate("MainTabs", {screen: "Home"});
                    }
                    catch(err){
                        console.error(err);
                        Alert.alert("Photo Analysis Failed",err.message);
                    }
                }}/>
            </View>
        </SafeAreaView>
    );
};

export default AnalysisScreen;