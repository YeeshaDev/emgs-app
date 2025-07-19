import {
    View,
    Text,
    Dimensions,
    useWindowDimensions,
    ImageURISource,
    StyleSheet,
  } from 'react-native';
  import React from 'react';
  import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
  } from 'react-native-reanimated';
  
  type Props = {
    item: {heading:string; text: string; image: ImageURISource };
    index: number;
    x: Animated.SharedValue<number>;
  };
  
  const ListItem = ({ item, index, x }: Props) => {
    const { height } = Dimensions.get('window');
    const { width: SCREEN_WIDTH } = useWindowDimensions();
    const rnImageStyle = useAnimatedStyle(() => {
      const translateY = interpolate(
        x.value,
        [
          (index - 1) * SCREEN_WIDTH,
          index * SCREEN_WIDTH,
          (index + 1) * SCREEN_WIDTH,
        ],
        [100, 0, 100],
        Extrapolate.CLAMP
      );
      const opacity = interpolate(
        x.value,
        [
          (index - 1) * SCREEN_WIDTH,
          index * SCREEN_WIDTH,
          (index + 1) * SCREEN_WIDTH,
        ],
        [0, 1, 0],
        Extrapolate.CLAMP
      );
      return {
        opacity,
        width: SCREEN_WIDTH * 0.7,
        height: SCREEN_WIDTH * 0.7,
        transform: [{ translateY}],
      };
    }, [index, x]);
  
    const rnTextStyle = useAnimatedStyle(() => {
      const translateY = interpolate(
        x.value,
        [
          (index - 1) * SCREEN_WIDTH,
          index * SCREEN_WIDTH,
          (index + 1) * SCREEN_WIDTH,
        ],
        [100, 0, 100],
        Extrapolate.CLAMP
      );
      const opacity = interpolate(
        x.value,
        [
          (index - 1) * SCREEN_WIDTH,
          index * SCREEN_WIDTH,
          (index + 1) * SCREEN_WIDTH,
        ],
        [0, 1, 0],
        Extrapolate.CLAMP
      );
      return {
        opacity,
        transform: [{ translateY}],
      };
    }, [index, x]);
    return (
      <View className='' style={[{ width: SCREEN_WIDTH }]}>
        <View style={{ height: height * 0.65}} className=' bg-red-500 px-5 flex-row items-center justify-center flex-1 w-full '>
        <Animated.Image
          source={item.image}
          //style={rnImageStyle}
          className={index == 2 ? ('size-[300px] ') : ('!size-[500px]')}
          resizeMode="contain"
        />
</View>
{/* <View className='flex-1 items-center justify-center bg-white mt-10'>
        <Animated.Text style={[styles.textItem, rnTextStyle]}>
          {item.heading}
        </Animated.Text>
        <Animated.Text>{item.text}</Animated.Text>
        </View> */}
      </View>
    );
  };
  
  export default React.memo(ListItem);
  
  const styles = StyleSheet.create({
    itemContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    textItem: {
      fontWeight: '600',
      //color:'#fff',
      lineHeight: 41,
      fontSize: 34,
    },
  });