import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from './HomeScreen';
import PaletteScreen from './PaletteScreen';
import AnalysisScreen from './AnalysisScreen';
import ClosetScreen from './ClosetScreen';
import LooksScreen from './LooksScreen';
import SeasonCongratsScreen from './SeasonCongratsScreen';

import { useFonts } from "expo-font";
import {
  LibreBaskerville_400Regular,
  LibreBaskerville_400Regular_Italic,
  LibreBaskerville_700Bold,
} from "@expo-google-fonts/libre-baskerville";
import { theme } from './styles';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.background,
    card: theme.colors.surface,
    text: theme.colors.text,
    border: theme.colors.divider,
    primary: theme.colors.accent,
  },
};

const tabIcons = {
  Home: ["home", "home-outline"],
  Looks: ["shirt", "shirt-outline"],
  Closet: ["grid", "grid-outline"],
  "Full Palette": ["color-palette", "color-palette-outline"],
};

function TabNavigator() {
  const insets = useSafeAreaInsets();

  // Edge-to-edge Android can sit the tab bar too close to the system nav;
  // add a small buffer so labels stay clearly above it.
  const bottomInset =
    Platform.OS === "android"
      ? Math.max(insets.bottom, 16) + 12
      : Math.max(insets.bottom, 0);

  return (
    <Tab.Navigator
      safeAreaInsets={{ bottom: bottomInset }}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.divider,
          borderTopWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textDim,
        tabBarAllowFontScaling: false,
        tabBarLabelStyle: {
          fontFamily: theme.fonts.regular,
          fontSize: 10,
          lineHeight: 13,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const [active, inactive] = tabIcons[route.name] || ["ellipse", "ellipse-outline"];
          return (
            <Ionicons
              name={focused ? active : inactive}
              size={size - 2}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />
      <Tab.Screen
        name="Looks"
        component={LooksScreen}
      />
      <Tab.Screen
        name="Closet"
        component={ClosetScreen}
      />
      <Tab.Screen
        name="Full Palette"
        component={PaletteScreen}
        options={{ tabBarLabel: "Palette" }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    LibreBaskerville_400Regular,
    LibreBaskerville_400Regular_Italic,
    LibreBaskerville_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navTheme}>
        <StatusBar style="dark" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: theme.colors.background },
          }}
        >
          <Stack.Screen
            name="MainTabs"
            component={TabNavigator}
          />

          <Stack.Screen
            name="Analysis"
            component={AnalysisScreen}
          />

          <Stack.Screen
            name="SeasonCongrats"
            component={SeasonCongratsScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
