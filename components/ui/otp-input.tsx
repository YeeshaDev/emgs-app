import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, Keyboard } from 'react-native';
import { cn } from '@/lib/cn';

interface OTPInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  autoFocus?: boolean;
}

const OTPInput = ({ 
  length = 6, 
  onComplete, 
  autoFocus = true 
}: OTPInputProps) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    // Auto focus on first input when component mounts
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next input if current input is filled
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    const otpValue = newOtp.join('');
    if (otpValue.length === length && onComplete) {
      onComplete(otpValue);
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View className={cn("flex-row items-center gap-x-2")}>
      {Array(length).fill(0).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          className={cn(" border size-14 border-primary-dark shadow-lg rounded-md text-center text-lg")}
          maxLength={1}
          keyboardType="number-pad"
          value={otp[index]}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          selectTextOnFocus
        />
      ))}
    </View>
  );
};

export default OTPInput;
