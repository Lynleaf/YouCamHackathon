import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, useWindowDimensions } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

import {styles} from "./styles";
import ImageUploadBox from './components/ImageUploadBox'

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
                onImageSaved={(uri)=>{navigation.navigate("MainTabs", {screen: "Home"});}}/>
            </View>
        </SafeAreaView>
    );
};

export default AnalysisScreen;