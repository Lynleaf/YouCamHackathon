import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Image, useWindowDimensions } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { styles } from "./styles";

const HomeScreen = ({ navigation }) => {
    const { width,height } = useWindowDimensions();
    const appWidth = width*.8;

    const [imageUri, setImageUri] = useState(null);
    const [imageAspectRatio, setImageAspectRatio] = useState(1);

    //Tries to load saved image each time home screen is in focus
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

    return (
        <ScrollView style={styles.scrollContainer}
            contentContainerStyle = {styles.scrollContent}
        >
            <View style={{width:appWidth}}>
            <Text> 
                Home screen
            </Text>
            {imageUri ? (
                <Image
                source={{ uri: imageUri }}
                style={[styles.profileImage,{ aspectRatio: imageAspectRatio }]}
                />
            ) : (
                <Text>No profile image saved</Text>
            )}
            <Text>
                Filler information, put information about color season and examples of color palettes. Could put images of examples.
            </Text>
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
                    <Text>
                        Analyze my color season!
                    </Text>
                )}
            </Pressable>
            </View>
        </ScrollView>
    );
};

export default HomeScreen;