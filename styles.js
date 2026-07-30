// styles.js
import { StyleSheet } from "react-native";
import { Alef_400Regular,Alef_700Bold } from '@expo-google-fonts/alef'

export const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
        backgroundColor: '#F2E9F4',
        flex:1
	},
    heading:{
        alignSelf: "stretch",
        backgroundColor: '#907e8d',
        padding: 30,
        marginBottom:10,
    },
    headingText:{
        color: '#22223b',
        fontSize: 28,
        fontFamily: "Alef_700Bold"
    },
	button: {
        backgroundColor: '#4A4E69',
        padding: 20,
        borderRadius: 8,
    },
    buttonPressed: {
        opacity: 0.7,
        backgroundColor: '#93c7ff',
    },
    imageBox: {
        backgroundColor: '#c0b0bf',
        margin: 10,
        borderWidth: 4,
        borderColor: '#907e8d',
        borderStyle: 'solid',
        borderRadius: 12, 
    }
});