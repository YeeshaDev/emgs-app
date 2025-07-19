import { SafeAreaView, StatusBar, StyleSheet, View, ActivityIndicator } from 'react-native'
import StyledText from "./styled-text"

export default function Loader() {
    return (
       <SafeAreaView className='flex-1 bg-white'>
        <StatusBar barStyle="dark-content" />
             <View className="flex-1 flex-col gap-3 items-center justify-center">
                      <ActivityIndicator size="large" color="#B91C1C" />
                      <StyledText>Please wait while we load your content...</StyledText>
                    </View>
                    </SafeAreaView>
           
    )
}

const styles = StyleSheet.create({})
