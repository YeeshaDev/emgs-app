import { View, Text, Image } from 'react-native';
import PageContainer from "@/components/ui/page-container";
import { cn } from '@/lib/cn';
import { useRouter } from 'expo-router';
import CustomButton from '@/components/ui/button';

const OnboardingThree = () => {
    const router = useRouter();
    return (
          <PageContainer step={1} totalSteps={3} title="Your Journey Starts Here">
            <View className='flex flex-col h-screen '>
            <View className={cn("max-h-[50vh] h-full items-center mt-3 mb-6")}>
              <Image
                source={require('../../assets/images/onboard-3.png')}
                className={cn("w-full h-full rounded-3xl")}
                resizeMode="cover"
              />
            </View>
            
            <Text className="text-gray-600 mt-6">
            Whether you're planning for education or new experiences, EMGS is here to guide you every step of the way.
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
  
  export default OnboardingThree;