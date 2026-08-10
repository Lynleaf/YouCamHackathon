import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "closet";

export async function toggleCloset(product, clothingType) {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    let closet = existing ? JSON.parse(existing) : [];

    const alreadySaved = closet.some(item => item.id === product.id);

    if (alreadySaved) {
        closet = closet.filter(item => item.id !== product.id);
        console.log("Removed from closet: ",product.title);
    } else {
        closet.push({
            ...product,
            clothingType,
            savedAt: Date.now(),
        });
        console.log("Added to closet: ",product.title);
    }

    await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(closet)
    );

    return !alreadySaved; // true if now saved, false if removed
}

export async function loadCloset() {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    return existing ? JSON.parse(existing) : [];
}