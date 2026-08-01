import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, ActivityIndicator,useWindowDimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ImageUploadBox({ width, height,onImageSaved }) {
  const [imageUri, setImageUri] = useState(null);
  const [saving, setSaving] = useState(false);

  //Pick image from gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your photos to upload an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], 
      allowsEditing: true,
      aspect: [Math.round(width), Math.round(height)], 
      quality: 1,
    });

    // Extract the URI safely out of the assets structure
    if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
      setImageUri(selectedUri);
    }
  };

  //Save image to app's local storage
  const saveImage = async (uri) => {
        try {
            setSaving(true);
            // Create permanent location
            const permanentUri =FileSystem.documentDirectory + "profileImage.jpg";
          
            // Check if an old profile image exists 
            const oldImage = await FileSystem.getInfoAsync(permanentUri); 
            // Delete the old image if it exists 
            if (oldImage.exists) { await FileSystem.deleteAsync(permanentUri); }

            // Copy the new image into the same location 
            await FileSystem.copyAsync({ from: uri, to: permanentUri, });
            
            // Save location
            await AsyncStorage.setItem("profileImage",permanentUri);
            console.log("Saved profile image:",permanentUri);
            if (onImageSaved) {
                onImageSaved(permanentUri);
            }
        } catch(error) {
            console.log(error);
            Alert.alert("Error","Could not save image");
        } finally {
            setSaving(false);
        }
    };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.uploadBox,{width,height}]} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.uploadText}>Tap to select an image from your gallery</Text>
          </View>
        )}
      </TouchableOpacity>

      {imageUri && (
        <TouchableOpacity 
          style={[styles.button,{width},saving && styles.buttonDisabled]} 
          onPress={() => saveImage(imageUri)}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save Image</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  uploadBox: {
    backgroundColor: "#4A4e69",
    borderWidth: 2,
    borderColor: '#646678',
    borderStyle: 'dashed',
    borderRadius: 20, 
    margin:20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  placeholderContainer: {
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 16,
    color: '#666',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  button: {
    backgroundColor: '#9a8c98',
    borderRadius: 8,
    margin: 20,
    height: 40
  },
  buttonDisabled: {
    backgroundColor: '#a0c4ff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
