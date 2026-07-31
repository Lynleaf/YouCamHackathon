import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { styles } from "./styles";

const HomeScreen = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <Text>
                Home screen
            </Text>
            <Pressable 
                onPress={() => {
                    navigation.navigate("Analysis");
                    console.log('Button pressed!'); 
                }
                }
                style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed
                ]}
            >
                {({ pressed }) => (
                    
                    <Text>
                        hjkhjk
                    </Text>
                )}
            </Pressable>
        </View>
    );
};

export default HomeScreen;