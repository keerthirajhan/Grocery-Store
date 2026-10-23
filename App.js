import 'react-native-gesture-handler';
import React from 'react';
import { Platform, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ToastProvider } from './src/components/Toast';
import { AppProvider } from './src/context/AppContext';
import RootNavigator from './src/navigation/RootNavigator';

// On a desktop browser the app is shown as a centred phone-width column.
const webFrame =
  Platform.OS === 'web'
    ? { width: '100%', maxWidth: 440, alignSelf: 'center', overflow: 'hidden', userSelect: 'none', boxShadow: '0 0 60px rgba(40,60,15,0.22)' }
    : {};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#DCE5C6' }}>
      <SafeAreaProvider>
        <View style={[{ flex: 1 }, webFrame]}>
          <AppProvider>
            <ToastProvider>
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
              <StatusBar style="dark" />
            </ToastProvider>
          </AppProvider>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
