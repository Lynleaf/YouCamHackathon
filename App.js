import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './HomeScreen';
import TempScreen from './TempScreen';
import AnalysisScreen from './AnalysisScreen';

import { useFonts } from "expo-font";
import {
  Alef_400Regular,
  Alef_700Bold,
} from "@expo-google-fonts/alef";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />
      <Tab.Screen
        name="Temp"
        component={TempScreen}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Alef_400Regular,
    Alef_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
        />

        <Stack.Screen
          name="Analysis"
          component={AnalysisScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}