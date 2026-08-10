import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, ActivityIndicator,useWindowDimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import {styles as globalStyles} from "../styles";

export default function ImageUploadBox({ width, height, onImageSaved, imageKey = "profileImage", displayUri = null }) {
  const [imageUri, setImageUri] = useState(null);
  const [saving, setSaving] = useState(false);
  const [hasNewImage, setHasNewImage] = useState(false);
  const previousImage = useRef(null);

  //load saved previous image
  useFocusEffect(
    React.useCallback(() => {
      const loadPreviousImage = async () => {
        const savedImage = await AsyncStorage.getItem(imageKey);

        if (savedImage) {
          setImageUri(`${savedImage}?t=${Date.now()}`);
          previousImage.current = savedImage;
        }
      };

      loadPreviousImage();

    }, [imageKey])
  );

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

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedUri = result.assets[0].uri;

      //remember the old valid photo
      previousImage.current = imageUri;

      //show new photo 
      setImageUri(selectedUri);

      setHasNewImage(true);
    }
  };

  //Saves image temporarily (before it is successfully analyzed)
  const saveImage = async (uri) => {
    try {
        setSaving(true);

        const temporaryUri =
            FileSystem.documentDirectory + `temp_${Date.now()}.jpg`;

        await FileSystem.copyAsync({
            from: uri,
            to: temporaryUri,
        });

        console.log("Temporary image:", temporaryUri);

        if (onImageSaved) {
          await onImageSaved(
              temporaryUri,
              restorePreviousImage
          );

          setHasNewImage(false);

          // Reload the permanently saved image
          const savedImage = await AsyncStorage.getItem(imageKey);

          if (savedImage) {
              setImageUri(`${savedImage}?t=${Date.now()}`);
              previousImage.current = savedImage;
          }
      }

    } catch(error) {
        console.log(error);
        Alert.alert("Error", "Could not save image");
    } finally {
        setSaving(false);
    }
};

  //restores previous successfully analyzed image
  const restorePreviousImage = () => {
    if (previousImage.current) {
      setImageUri(previousImage.current);
    }
  };

  //displays displayUri image if available
  useEffect(() => {
      if (displayUri) {
          setImageUri(displayUri);
      }
  }, [displayUri]);

  
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

      {hasNewImage && (
        <TouchableOpacity 
          style={[globalStyles.button,{width},saving && styles.buttonDisabled]} 
          onPress={() => saveImage(imageUri)}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={globalStyles.buttonText}>Save Image</Text>
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
  buttonDisabled: {
    backgroundColor: '#a0c4ff',
  },
 
});