import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './HomeScreen';
import TempScreen from './TempScreen';
import AnalysisScreen from './AnalysisScreen';

import { useFonts } from "expo-font";
import { Alef_400Regular,Alef_700Bold } from "@expo-google-fonts/alef";

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

function HomeStackNavigator() {
	return (
		<HomeStack.Navigator
			screenOptions={{ headerShown: false }}
		>
			<HomeStack.Screen 
				name="Home"
				component={HomeScreen}
			/>
			<HomeStack.Screen 
				name="Analysis"
				component={AnalysisScreen}
			/>
		</HomeStack.Navigator>
	);
}

const App = () => {
	const [fontsLoaded] = useFonts({
		Alef_400Regular,
		Alef_700Bold
	});

	return (
		<NavigationContainer>
			<Tab.Navigator
        screenOptions={{ headerShown: false }}
      >
				<Tab.Screen 
					name="Home" 
					component={HomeStackNavigator} 
				/>
				<Tab.Screen 
					name="Temp" 
					component={TempScreen} 
				/>
			</Tab.Navigator>
		</NavigationContainer>
	);
};

export default App;