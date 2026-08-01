// styles.js
import { StyleSheet } from "react-native";
import { Alef_400Regular,Alef_700Bold } from '@expo-google-fonts/alef'

export const styles = StyleSheet.create({
    scrollContainer:{
        flex:1,
        backgroundColor: '#22223b',
        alignSelf: 'center',
        width: '100%'
    },
    scrollContent:{
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#22223b',
    },
	container: {
		justifyContent: 'center',
        backgroundColor: '#22223b',
        alignItems: 'center',
        flex:1,
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
        marginVertical: 20,
    },
    buttonPressed: {
        opacity: 0.7,
    },
    profileImage: {
        width:'100%',
    }
});