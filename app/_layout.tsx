import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { MD3DarkTheme, MD3LightTheme, PaperProvider, ThemeProvider } from 'react-native-paper';
import { useColorScheme } from "react-native";
import {LightTheme, DarkTheme} from '../constants/Colors';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { initDB } from "@/database/myDBModules";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

import * as Notifications from 'expo-notifications';
import { UserInactivityProvider } from "@/context/UserInactivity";

async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission for notifications is not granted!');
    return;
  }
}

export default function RootLayout() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? {...MD3DarkTheme,colors: DarkTheme} : {...MD3LightTheme, colors: LightTheme};

  const [loaded] = useFonts({
      SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });
  
    useEffect(() => {
      requestNotificationPermissions();
      if (loaded) {
        SplashScreen.hideAsync();
      }
    }, [loaded]);
  
    if (!loaded) {
      return null;
    }

  return (
    <UserInactivityProvider>
      <SQLiteProvider databaseName="dev.db" onInit={initDB}>
      <GestureHandlerRootView>
        <PaperProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'simple_push' }} />
          <Stack.Screen name="(stacks)" options={{ headerShown: false, animation: 'simple_push' }} />
          <Stack.Screen name="(modals)" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
        </SafeAreaProvider>
          </ThemeProvider>
      </PaperProvider>
      </GestureHandlerRootView>
    </SQLiteProvider>
    </UserInactivityProvider>
  );
}
