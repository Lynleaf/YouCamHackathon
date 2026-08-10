import * as FileSystem from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const savePermanentImage = async (uri, imageKey) => {
    const permanentUri =
        FileSystem.documentDirectory + `${imageKey}.jpg`;

    const oldImage = await FileSystem.getInfoAsync(permanentUri);

    if (oldImage.exists) {
        await FileSystem.deleteAsync(permanentUri);
    }

    await FileSystem.copyAsync({
        from: uri,
        to: permanentUri,
    });

    await AsyncStorage.setItem(
        imageKey,
        permanentUri
    );
    console.log("Permanent image saved:", permanentUri);
    return permanentUri;
};