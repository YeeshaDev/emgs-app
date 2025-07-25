import React from 'react'
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context'
import { useTheme } from '@/context/theme-provider'
import { cn } from '@/lib/cn'

interface ThemedSafeAreaViewProps extends SafeAreaViewProps {
  children: React.ReactNode
  className?: string
}

const ThemedSafeAreaView = ({ children, className = '', style, ...props }: ThemedSafeAreaViewProps) => {
  const { colorScheme } = useTheme()
  
  return (
    <SafeAreaView 
      className={cn(
        'flex-1',
        colorScheme === 'dark' 
          ? 'bg-background-dark' 
          : 'bg-background',
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </SafeAreaView>
  )
}

export default ThemedSafeAreaView