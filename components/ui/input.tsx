import React from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';
import { cn } from '@/lib/cn';

interface InputProps extends TextInputProps {
  label?: string;
  hasIcon?: boolean;
  icon?: React.ReactNode;
  leftIcon?: React.ReactNode;
}

const FormInput = ({ 
  label, 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry = false,
  className = '',
  hasIcon = false,
  icon = null,
  leftIcon = null,
  ...props
}:InputProps) => {
  return (
   
        <View className={cn("mb-4")}>
          {label && (
            <Text className={cn("text-gray-700 mb-1")}>{label}</Text>
          )}
          <View className={cn("relative")}>
            <TextInput
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              secureTextEntry={secureTextEntry}
              className={cn(`border border-gray-300 placeholder:text-gray-300 rounded-xl p-3 ${hasIcon ? 'pr-10' : ''} ${className}`)}
              {...props}
            />
            {hasIcon && (
              <View className={cn("absolute right-3 top-3")}>
                {icon}
              </View>
            )}

{hasIcon && leftIcon && (
              <View className={cn("absolute left-3 top-3")}>
                {leftIcon}
              </View>
            )}

          </View>
        </View>
    
  );
};

export default FormInput;