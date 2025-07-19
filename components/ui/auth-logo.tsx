import { View,Image } from "react-native"
//import { Feather } from "@expo/vector-icons"
import { cn } from "@/lib/cn"

interface LogoProps {
  size?: number
  className?: string
}

const Logo = ({ size = 40, className = "" }: LogoProps) => {
  return (
    <View className={cn(`size-12 `, className)}>
     <Image source={require('../../assets/images/icon.png')} className='size-full' />
    </View>
  )
}

export default Logo

