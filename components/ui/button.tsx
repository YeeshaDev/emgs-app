import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, Image, View, ActivityIndicator } from 'react-native';
import { cn } from '@/lib/cn';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'google';
  fullWidth?: boolean;
  textClassName?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
}

const CustomButton: React.FC<ButtonProps> = ({
  onPress,
  title,
  loading = false,
  disabled = false,
  variant = 'primary',
  fullWidth = true,
  className = '',
  textClassName = '',
  icon,
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-primary',
    secondary: 'bg-white border border-gray-300',
    google: 'bg-primary-google',
  };

  const textStyles = {
    primary: 'text-white',
    secondary: 'text-gray-800',
    google: 'text-white',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={cn(
        `py-4 rounded-lg flex-row items-center justify-center ${
          fullWidth ? 'w-full' : ''
        } ${variantStyles[variant]} ${disabled || loading ? 'opacity-70' : ''}`,
        className
      )}
      {...props}
    >
      {/* Google icon (only if variant is google) */}
      {variant === 'google' && (
        <View className="mr-2 bg-white rounded-lg p-1.5">
          <Image
            source={require('../../assets/images/google.png')}
            className="w-5 h-5 object-contain"
          />
        </View>
      )}

      {/* Optional left icon */}
      {icon && <View className="mr-2">{icon}</View>}

      {/* Loading spinner or Button text */}
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'secondary' ? '#374151' : '#ffffff'}
        />
      ) : (
        <Text
          className={cn(
            `text-center font-medium ${textStyles[variant]}`,
            textClassName
          )}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
