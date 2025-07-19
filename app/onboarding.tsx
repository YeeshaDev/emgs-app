import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StatusBar, 
  Dimensions, 
  ScrollView, 
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
  Pressable
} from 'react-native';

import {useRouter} from 'expo-router'
import AnimatedPagination from '@/components/onboard/list-pagination';
interface OnboardingItem {
  id: number;
  title: string;
  description: string;
  icon: any; 
  
}

const OnboardingScreen: React.FC = () => {
  const router = useRouter();
  const { width, height } = Dimensions.get('window');
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  
  const onboardingItems: OnboardingItem[] = [
    {
      id: 1,
      title: "Explore Endless Opportunities",
      description: "From studying abroad to travel assistance, EMGS connects you with the right resources to make your journey smooth and successful.",
      icon: require('../assets/images/onboard-1.png'),
      
    },
    {
      id: 2,
      title: "Simplified & Hassle-Free Process",
      description: "We take the stress out of applications, approvals, and travel arrangements, so you can focus on what matters most.",
      icon: require('../assets/images/onboard-2.png'),
      
    },
    {
      id: 3,
      title: "Your Journey Starts Here",
      description: "We take the stress out of applications, approvals, and travel arrangements, so you can focus on what matters most.",
      icon: require('../assets/images/onboard-3.png'),
      
    }
  ];

  // Handle scroll events to update the current page
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / width);
    
    if (page !== currentPage) {
      setCurrentPage(page);
      
      // Trigger animations when page changes
      triggerPageAnimation();
    }
  };

  // Play entrance animations for page elements
  const triggerPageAnimation = () => {
    // Reset animation values
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
    
    // Slide up animation
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  React.useEffect(() => {
    triggerPageAnimation();
  }, []);

  const handleContinue = () => {
    if (currentPage < onboardingItems.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (currentPage + 1) * width,
        animated: true,
      });
    } else {
      router.replace('/auth/signup-path');
    }
  };
  
  return (
    <View className="flex-1 bg-white">
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
      >
        {onboardingItems.map((item, index) => (
          <View key={item.id} style={{ width }} className="flex-1">
            <View style={{ height: height * 0.60 }} className="relative bg-primary">
              <Image
                source={require('../assets/images/onboard-bg.png')}
                className="absolute w-full h-full"
                style={{ top: 0, left: 0, right: 0 }}
                resizeMode="cover"
              />
              
              <Animated.View 
                className="flex-1 items-center justify-center pt-16"
                style={{ 
                  opacity: fadeAnim,
                  transform: [{ translateX: slideAnim }]
                }}
              >
                <View className="relative">
                  <Image 
                    source={item.icon} 
                    className={index == 2 ? ('size-[270px] ') : ('size-[320px]')}
                    resizeMode="contain"
                  />
              
                </View>
              </Animated.View>
             {index !== 2  && <Pressable onPress={() => router.push('/auth/register')} className='absolute top-16 right-5'><Text className='text-white font-medium'>Skip</Text></Pressable>}
              
              {/* Pagination dots */}
              <View className="absolute bottom-6 right-6">
  <AnimatedPagination 
    totalItems={onboardingItems.length} 
    currentIndex={currentPage} 
  />
</View>
            </View>
            
         
            <Animated.View 
              className="flex-1 bg-white px-6 pt-12"
              style={{ 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }}
            >
              <Text className="text-3xl font-bold text-gray-900">
                {item.title}
              </Text>
              
              <Text className="text-gray-600 mt-5 text-base">
                {item.description}
              </Text>
            </Animated.View>
          </View>
        ))}
      </ScrollView>
      
      {/* Fixed button and bottom indicator */}
      <View className="bg-white px-6 pb-8">
        <TouchableOpacity 
          className="bg-primary rounded-md py-4 mb-6"
          onPress={handleContinue}
        >
          <Text className="text-white text-center font-semibold">
            {currentPage === onboardingItems.length - 1 ? 'Get Started' : 'Continue'}
          </Text>
        </TouchableOpacity>
        {currentPage === onboardingItems.length - 1 && (
        <Animated.View style={{ 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }} className="flex-row justify-center transition-all duration-200">
        <Text className="text-grey-1">Already have an account?</Text>
        <Text className="text-primary font-bold ml-1" onPress={() => router.push("/auth/login")}>
          Login
        </Text>
      </Animated.View>
  )}
      </View>
    </View>
  );
};

export default OnboardingScreen;