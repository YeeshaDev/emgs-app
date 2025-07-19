import { View, Text, Image } from 'react-native';
import PageContainer from "@/components/ui/page-container";
import { cn } from '@/lib/cn';
import { useRouter } from 'expo-router';
import CustomButton from '@/components/ui/button';

const OnboardingOne = () => {
    const router = useRouter();
    return (
          <PageContainer title="Explore Endless Opportunities">
            <View className='flex flex-col h-screen '>
            <View className={cn("max-h-[50vh] h-full items-center mt-3 mb-6")}>
              <Image
                source={require('../../assets/images/student-image.png')}
                className={cn("w-full h-full rounded-3xl")}
                resizeMode="cover"
              />
            </View>
            
            <Text className="text-gray-600 mt-6">
              From studying abroad to travel assistance, EMGS connects you with the right resources to make your journey smooth and successful.
            </Text>
            
            <View className="mt-10 mb-4">
              <CustomButton 
                title="Sign Up" 
                onPress={() => router.push('/register')} 
                className="mb-4"
              />
              
              <CustomButton 
                title="Login" 
                variant="secondary" 
                onPress={() => router.push('/login')} 
              />
            </View>
            </View>
          </PageContainer>
      
    );
  };
  
  export default OnboardingOne;