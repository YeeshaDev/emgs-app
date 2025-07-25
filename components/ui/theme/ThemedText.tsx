import React from 'react'
import { Text, TextProps } from 'react-native'
import { useTheme } from '@/context/theme-provider'
import { cn } from '@/lib/cn'

interface ThemedTextProps extends TextProps {
  children: React.ReactNode
  variant?: 'default' | 'muted' | 'primary' | 'secondary'
  className?: string
}

const ThemedText = ({ 
  children, 
  variant = 'default', 
  className = '', 
  style,
  ...props 
}: ThemedTextProps) => {
  const { colorScheme } = useTheme()
  
  const getTextColor = () => {
    const isDark = colorScheme === 'dark'
    
    switch (variant) {
      case 'primary':
        return 'text-primary'
      case 'secondary':
        return isDark ? 'text-gray-400' : 'text-gray-600'
      case 'muted':
        return isDark ? 'text-gray-500' : 'text-gray-500'
      case 'default':
      default:
        return isDark ? 'text-foreground-dark' : 'text-foreground'
    }
  }
  
  return (
    <Text 
      className={cn(getTextColor(), className)}
      style={style}
      {...props}
    >
      {children}
    </Text>
  )
}

export default ThemedText