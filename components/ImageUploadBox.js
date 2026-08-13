import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { styles as globalStyles, theme } from "../styles";
import LoadingOverlay from "./LoadingOverlay";

export default function ImageUploadBox({
  width,
  height,
  onImageSaved,
  imageKey = "profileImage",
  displayUri = null,
  compact = false,
  onSavingChange,
  savingMessage = "Saving photo…",
}) {
  const [imageUri, setImageUri] = useState(null);
  const [saving, setSaving] = useState(false);
  const [hasNewImage, setHasNewImage] = useState(false);
  const previousImage = useRef(null);

  const updateSaving = (next) => {
    setSaving(next);
    onSavingChange?.(next);
  };

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

  const pickImage = async () => {
    if (saving) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your photos to upload an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [Math.max(1, Math.round(width)), Math.max(1, Math.round(height))],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedUri = result.assets[0].uri;
      previousImage.current = imageUri;
      setImageUri(selectedUri);
      setHasNewImage(true);
    }
  };

  const saveImage = async (uri) => {
    try {
      updateSaving(true);

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

        const savedImage = await AsyncStorage.getItem(imageKey);

        if (savedImage) {
          setImageUri(`${savedImage}?t=${Date.now()}`);
          previousImage.current = savedImage;
        }
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not save image");
    } finally {
      updateSaving(false);
    }
  };

  const restorePreviousImage = () => {
    if (previousImage.current) {
      setImageUri(previousImage.current);
    }
  };

  useEffect(() => {
    if (displayUri) {
      setImageUri(displayUri);
    }
  }, [displayUri]);

  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      <LoadingOverlay visible={saving && !onSavingChange} message={savingMessage} />

      <TouchableOpacity
        style={[styles.uploadBox, { width, height }]}
        onPress={pickImage}
        activeOpacity={0.85}
        disabled={saving}
      >
        {imageUri ? (
          <>
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
            <View style={styles.changeHint}>
              <Ionicons name="camera-outline" size={14} color="#FFFFFF" />
              <Text style={styles.changeHintText}>Tap to change</Text>
            </View>
          </>
        ) : (
          <View style={styles.placeholderContainer}>
            <Ionicons
              name="image-outline"
              size={28}
              color={theme.colors.textDim}
              style={{ marginBottom: theme.spacing.sm }}
            />
            <Text style={styles.uploadText}>
              Tap to select a photo from your gallery
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {hasNewImage && (
        <TouchableOpacity
          style={[
            globalStyles.button,
            { width, marginTop: theme.spacing.sm },
            saving && styles.buttonDisabled,
          ]}
          onPress={() => saveImage(imageUri)}
          disabled={saving}
          activeOpacity={0.8}
        >
          <Text style={globalStyles.buttonText}>Save Image</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  containerCompact: {
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  uploadBox: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    borderRadius: theme.radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  placeholderContainer: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  uploadText: {
    fontSize: 14,
    color: theme.colors.textMuted,
    fontFamily: theme.fonts.regular,
    textAlign: 'center',
    lineHeight: 21,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  changeHint: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(28, 25, 23, 0.72)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.sm,
  },
  changeHintText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: theme.fonts.regular,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
