import { View, Text, Image } from 'react-native';
import PageContainer from "@/components/ui/page-container";
import { cn } from '@/lib/cn';
import { useRouter } from 'expo-router';
import CustomButton from '@/components/ui/button';
import StyledText from '../ui/styled-text';

const OnboardingTwo = () => {
    const router = useRouter();
    return (
          <PageContainer step={1} totalSteps={3} title="Simplified & Hassle-Free Process">
            <View className='flex flex-col h-screen '>
            <View className={cn("max-h-[50vh] h-full items-center mt-3 mb-6")}>
              <Image
                source={require('../../assets/images/onboard-2.png')}
                className={cn("w-full h-full rounded-3xl")}
                resizeMode="cover"
              />
            </View>
            
            <StyledText className="text-gray-600 mt-6">
            We take the stress out of applications, approvals, and travel arrangements, so you can focus on what matters most.
            </StyledText>
            
            <View className="mt-10 mb-4">
              <CustomButton 
                title="Sign Up" 
                onPress={() => router.push('/auth/register')} 
                className="mb-4"
              />
              
              <CustomButton 
                title="Login" 
                variant="secondary" 
                onPress={() => router.push('/auth/login')} 
              />
            </View>
            </View>
          </PageContainer>
      
    );
  };
  
  export default OnboardingTwo;