 import { SafeAreaView,View, Image, Dimensions, Text, StyleSheet} from 'react-native'
 import { StatusBar } from 'expo-status-bar';
 export const AuthHeader = () => {
    const { height } = Dimensions.get('window');

    return (
        
        <View className='relative bg-primary' style={{ height: height * 0.30 }} >
             <StatusBar style='light' />
        <Image
          source={require('../../assets/images/auth-bg.png')}
          className="absolute w-full h-full"
          style={{ top: 0, left: 0, right: 0 }}
          resizeMode="cover"
        />
        <SafeAreaView className='py-10  px-5'>
        <View className="flex-row items-center gap-x-3 px-5 pt-8">
            <Image
                source={require('../../assets/images/splash-icon.png')}
                className=" w-12 h-12"
                //style={{ top: 0, left: 0, right: 0 }}
                resizeMode="contain"
            />
             <Text className="text-white leading-tight font-bold max-w-[30%] text-lg">EMGS Learn and Travel</Text>
            </View>
            <View className="px-5 pt-8">
                <Text className="text-white font-bold text-[28px] pt-3">Travel. Learn. Grow. We make it easy.</Text>
                
            </View>
        </SafeAreaView>
        </View>
       
    )
 }
 const styles = StyleSheet.create({
    headerImage: {
      color: '#808080',
      bottom: -90,
      left: -35,
      position: 'absolute',
    },
    titleContainer: {
      flexDirection: 'row',
      gap: 8,
    },
  });
  