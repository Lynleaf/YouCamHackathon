
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import ImageUploadBox from './components/ImageUploadBox'

const TempScreen = ({ navigation }) => {

    return (
        <View>
            <Text>
                Temp screen
            </Text>
            <ImageUploadBox>

            </ImageUploadBox>
        </View>
    );
};

export default TempScreen;