
import React, { useEffect } from 'react';
import { View, Image, Text } from 'react-native';
import { cn } from '@/lib/cn';
import * as SplashScreen from 'expo-splash-screen';

// Keep splash screen visible while we initialize the app
SplashScreen.preventAutoHideAsync();

interface CustomSplashScreenProps {
  onComplete: () => void;
}

const CustomSplashScreen = ({ onComplete }: CustomSplashScreenProps) => {
  useEffect(() => {
    const prepare = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Hide splash screen
        await SplashScreen.hideAsync();
        // Tell the app we're ready
        onComplete();
      }
    };

    prepare();
  }, [onComplete]);

  return (
        <View className={cn("flex-1 items-center justify-center bg-black")}>
          <Image
            source={require('../../assets/images/splash-icon.png')}
            className={cn("w-32 h-32")}
            resizeMode="contain"
          />
          <Text className={cn("text-2xl font-bold text-red-700 mt-4")}>EMGS</Text>
          <Text className={cn("text-gray-600 mt-2")}>Your Global Education Partner</Text>
        </View>
     
  );
};

export default CustomSplashScreen;