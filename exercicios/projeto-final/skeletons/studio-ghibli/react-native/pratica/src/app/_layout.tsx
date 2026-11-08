import '@/global.css';

import { ShipporiMinchoB1_600SemiBold } from '@expo-google-fonts/shippori-mincho-b1/600SemiBold';
import { ShipporiMinchoB1_700Bold } from '@expo-google-fonts/shippori-mincho-b1/700Bold';
import { ShipporiMinchoB1_800ExtraBold } from '@expo-google-fonts/shippori-mincho-b1/800ExtraBold';
import { ZenKakuGothicNew_400Regular } from '@expo-google-fonts/zen-kaku-gothic-new/400Regular';
import { ZenKakuGothicNew_500Medium } from '@expo-google-fonts/zen-kaku-gothic-new/500Medium';
import { ZenKakuGothicNew_700Bold } from '@expo-google-fonts/zen-kaku-gothic-new/700Bold';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { useBrandTokens } from '@/components/use-brand-tokens';
import { queryClient } from '@/state/query-client';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const tokens = useBrandTokens();
  const [fontsLoaded, fontError] = useFonts({
    ShipporiMinchoB1_600SemiBold,
    ShipporiMinchoB1_700Bold,
    ShipporiMinchoB1_800ExtraBold,
    ZenKakuGothicNew_400Regular,
    ZenKakuGothicNew_500Medium,
    ZenKakuGothicNew_700Bold,
  });
  const isReady = fontsLoaded || fontError !== null;

  useEffect(() => {
    if (isReady) SplashScreen.hideAsync();
  }, [isReady]);

  if (!isReady) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: tokens.color('canvas') },
          }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
