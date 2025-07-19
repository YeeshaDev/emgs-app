import React, { useEffect } from 'react';
import { View, Animated } from 'react-native';

interface PaginationProps {
  totalItems: number;
  currentIndex: number;
}

const AnimatedPagination: React.FC<PaginationProps> = ({ totalItems, currentIndex }) => {
  
  const dotAnimations = React.useRef(
    Array(totalItems).fill(0).map(() => ({
      width: new Animated.Value(8), 
      opacity: new Animated.Value(0.5) 
    }))
  ).current;

  useEffect(() => {
    // Animate all dots when current index changes
    dotAnimations.forEach((dot, index) => {
      
      Animated.timing(dot.width, {
        toValue: index === currentIndex ? 32 : 8, 
        duration: 300,
        useNativeDriver: false, 
      }).start();
      
     
      Animated.timing(dot.opacity, {
        toValue: index === currentIndex ? 1 : 0.5,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });
  }, [currentIndex, dotAnimations]);

  return (
    <View className="flex-row items-center gap-x-1">
      {dotAnimations.map((dot, index) => (
        <Animated.View
          key={index}
          className="h-2 bg-white rounded-full"
          style={{
            width: dot.width,
            opacity: dot.opacity,
          }}
        />
      ))}
    </View>
  );
};

export default AnimatedPagination;