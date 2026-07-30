import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, useWindowDimensions } from 'react-native';

import {styles} from "./styles";

const AnalysisScreen = ({ navigation }) => {
    const { width } = useWindowDimensions();
    const squareSize = width*.7;

    return (
        <View style={styles.container}>
            <View style={styles.heading}>
                <Text style={styles.headingText}>
                    Color Analysis
                </Text>
            </View>
            <View style={styles.container}>
                <View style={[styles.imageBox, {width:squareSize,height:squareSize}]}>
                    <Text>
                        Drop image here
                    </Text>
                </View>
                <View style={[styles.imageBox, {width:squareSize,height:squareSize}]}>
                    <Text>
                        Drop image here
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default AnalysisScreen;