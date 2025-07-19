import React from 'react';
import { SafeAreaView, ScrollView, View, Text } from 'react-native';
import { cn } from '@/lib/cn';
import { StatusBar } from 'expo-status-bar';
interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  step?: number;
  scrollable?: boolean
  totalSteps?: number;
}

const PageContainer = ({ 
  children, 
  title, 
  scrollable=true
}: PageContainerProps) => {
  return (
   
        <SafeAreaView className="flex-1 bg-white">
           <StatusBar style='dark' />
          {/* Title */}
          {/* {title && (
            <Text className={cn("text-2xl font-bold px-4 pt-6 pb-4")}>
              {title}
            </Text>
          )} */}
          {scrollable ? (
        <ScrollView
          className={cn("flex-1 px-4")}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
          
          <View className={cn("flex-1 px-5 bg-white")}>
            {children}
          </View>
      )}
        </SafeAreaView>
     
  );
};

export default PageContainer;