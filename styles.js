// styles.js
import { StyleSheet } from "react-native";
import { Alef_400Regular,Alef_700Bold } from '@expo-google-fonts/alef'

export const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
        backgroundColor: '#22223b',
        flex:1,
        alignItems: 'center',
	},
    heading:{
        backgroundColor: '#22223b',
        padding: 20,
        paddingBottom:30,
        marginBottom:20,
        alignSelf: 'flex-start',
        
    },
    headingText:{
        color: '#ffffff',
        fontSize: 28,
        fontFamily: "Alef_700Bold",
    },
    headingItalicsText:{
        color: '#9a8c98',
        fontSize: 28,
        fontFamily: "Alef_700Bold",
    },
	button: {
        backgroundColor: '#9a8c98',
        borderRadius: 8,
        margin: 20
    },
    buttonPressed: {
        opacity: 0.7,
    },
});