import React from 'react';
import { View, Text, Modal } from 'react-native';
import { cn } from '@/lib/cn';
import CustomButton from './button';
import { Feather } from '@expo/vector-icons';

interface SuccessModalProps {
  visible: boolean;
  title: string;
  message: string;
  buttonText: string;
  onButtonPress: () => void;
  icon?: React.ReactNode;
}

const SuccessModal = ({ 
  visible, 
  title, 
  message, 
  buttonText, 
  onButtonPress,
  icon
}: SuccessModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent={false}
      //fullScreen
      animationType="slide"
    >
      
        <View className="w-full flex items-center justify-center flex-1 mx-auto  max-w-md rounded-lg p-6 ">
          <View className="size-32 rounded-full bg-green-100 items-center justify-center mb-6">
            {icon || (
              <View className="size-24 rounded-full bg-green-500 items-center justify-center">
                <Feather name="check" size={55} color="white" />
              </View>
            )}
          </View>
          
          <Text className="text-2xl text-primary-dark font-semibold text-center">{title}</Text>
          <Text className="text-gray-600 text-center mt-3 mb-6">{message}</Text>
          
          <CustomButton 
            title={buttonText} 
            onPress={onButtonPress}
            className="w-full mt-20"
          />
        </View>
    </Modal>
  );
};

export default SuccessModal;
