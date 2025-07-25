import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Linking,
} from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@/context/theme-provider'
import ThemedText from '@/components/ui/theme/ThemedText'
import CustomButton from '@/components/ui/button'

interface Service {
  id: number
  title: string
  description: string
  icon: string
  color: string
  price?: number
  isPurchased?: boolean
}

interface ServiceBottomSheetProps {
  isVisible: boolean
  onClose: () => void
  service: Service | null
  onChatInApp?: () => void
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window')
const MAX_SHEET_HEIGHT = SCREEN_HEIGHT * 0.55
const MIN_SHEET_HEIGHT = SCREEN_HEIGHT * 0.3

const ServiceBottomSheet: React.FC<ServiceBottomSheetProps> = ({
  isVisible,
  onClose,
  service,
  onChatInApp
}) => {
  const insets = useSafeAreaInsets()
  const { colorScheme } = useTheme()
  const isDark = colorScheme === 'dark'
  
  // Dynamic height calculation
  const [contentHeight, setContentHeight] = useState(MIN_SHEET_HEIGHT)
  const [sheetHeight, setSheetHeight] = useState(MIN_SHEET_HEIGHT)

  // Animation values
  const backdropOpacity = useSharedValue(0)
  const sheetTranslateY = useSharedValue(sheetHeight)

  // Calculate dynamic height based on content
  const calculateHeight = () => {
    if (!service) return MIN_SHEET_HEIGHT

    const baseHeight = 120 // Header + padding
    const titleHeight = 60 // Title area
    const descriptionHeight = Math.ceil(service.description.length / 50) * 25 // Rough calculation
    const featuresHeight = getServiceFeatures(service.id).length * 35 // Each feature ~35px
    const actionHeight = service.isPurchased ? 140 : 80 // Action buttons area
    const paddingHeight = 60 // Safe area + extra padding

    const calculatedHeight = baseHeight + titleHeight + descriptionHeight + featuresHeight + actionHeight + paddingHeight

    return Math.min(Math.max(calculatedHeight, MIN_SHEET_HEIGHT), MAX_SHEET_HEIGHT)
  }

  // Update sheet height when service changes
  useEffect(() => {
    const newHeight = calculateHeight()
    setSheetHeight(newHeight)
    if (!isVisible) {
      sheetTranslateY.value = newHeight
    }
  }, [service])

  // Handle close
  const handleClose = () => {
    onClose()
  }

  const handleWhatsAppChat = () => {
    const phoneNumber = '+2348165457532'
    const message = `Hi! I'm interested in the ${service?.title} service.`
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`
    
    Linking.canOpenURL(whatsappUrl).then(supported => {
      if (supported) {
        Linking.openURL(whatsappUrl)
      } else {
        const webWhatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
        Linking.openURL(webWhatsappUrl)
      }
    })
  }

  // Animate sheet visibility
  useEffect(() => {
    if (isVisible) {
      backdropOpacity.value = withTiming(1, { duration: 300 })
      sheetTranslateY.value = withSpring(0, {
        damping: 20,
        stiffness: 100,
      })
    } else {
      backdropOpacity.value = withTiming(0, { duration: 300 })
      sheetTranslateY.value = withSpring(sheetHeight, {
        damping: 20,
        stiffness: 100,
      })
    }
  }, [isVisible, sheetHeight])

  // Animated styles
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }))

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }))

  if (!isVisible || !service) return null

  return (
    <View style={styles.container}>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <TouchableOpacity 
          style={styles.backdropTouchable} 
          activeOpacity={1}
          onPress={handleClose}
        />
      </Animated.View>

      {/* Sheet */}
      <Animated.View style={[
        styles.sheet, 
        { 
          backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
          height: sheetHeight
        },
        sheetStyle, 
        { paddingBottom: insets.bottom + 20 }
      ]}>
        {/* Header with Icon and Close Button */}
        <View style={styles.header}>
          {/* Service Icon */}
          <View 
            style={[
              styles.serviceIcon, 
              { backgroundColor: service.color }
            ]}
          >
            <Ionicons name={service.icon as any} size={32} color="white" />
          </View>
          
          {/* Close Button */}
          <TouchableOpacity 
            style={[styles.closeButton, { 
              backgroundColor: isDark ? '#374151' : '#F3F4F6' 
            }]} 
            onPress={handleClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons 
              name="close" 
              size={24} 
              color={isDark ? '#ffffff' : '#374151'} 
            />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Purchased Tag */}
          {service.isPurchased && (
            <View style={styles.purchasedContainer}>
              <View style={styles.purchasedTag}>
                <ThemedText style={styles.purchasedText}>
                  ✓ Purchased
                </ThemedText>
              </View>
            </View>
          )}

          {/* Title */}
          <ThemedText style={[
            styles.title, 
            { color: isDark ? '#ffffff' : '#111827' }
          ]}>
            {service.title}
          </ThemedText>

          {/* Description */}
          <ThemedText style={[
            styles.description, 
            { color: isDark ? '#9CA3AF' : '#6B7280' }
          ]}>
            {service.description}
          </ThemedText>

          {/* Features */}
          <View style={styles.featuresContainer}>
            {getServiceFeatures(service.id).map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.checkIcon}>
                  <Ionicons name="checkmark" size={14} color="white" />
                </View>
                <ThemedText style={[
                  styles.featureText,
                  { color: isDark ? '#D1D5DB' : '#374151' }
                ]}>
                  {feature}
                </ThemedText>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          {service.isPurchased ? (
            /* Chat Buttons for Purchased Services */
            <View style={styles.chatButtonsContainer}>
              {/* WhatsApp Button */}
              <TouchableOpacity
                onPress={handleWhatsAppChat}
                style={[
                  styles.whatsappButton,
                  { 
                    backgroundColor: isDark ? 'transparent' : '#F0FDF4',
                    borderColor: '#10B981'
                  }
                ]}
                activeOpacity={0.8}
              >
                <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                <ThemedText style={styles.whatsappButtonText}>
                  Chat on WhatsApp
                </ThemedText>
              </TouchableOpacity>

              {/* Chat in App Button - Fixed styling */}
              <TouchableOpacity
                onPress={onChatInApp}
                style={styles.chatInAppButton}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name="chatbubbles" 
                  size={18} 
                  color="white" 
                />
                <ThemedText style={styles.chatInAppButtonText}>
                  Chat in App
                </ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            /* Price and Enroll Button for Unpurchased Services */
            <View style={styles.priceContainer}>
              {/* Price Display */}
              <View style={styles.priceInfo}>
                <ThemedText style={[
                  styles.priceAmount,
                  { color: isDark ? '#ffffff' : '#111827' }
                ]}>
                  ₦{service.price?.toLocaleString()}
                </ThemedText>
                <ThemedText style={[
                  styles.priceLabel,
                  { color: isDark ? '#9CA3AF' : '#6B7280' }
                ]}>
                  / month
                </ThemedText>
              </View>

              {/* Enroll Button */}
              <TouchableOpacity
                onPress={() => {
                  console.log('Enroll pressed for:', service.title)
                  handleClose()
                }}
                style={styles.enrollButton}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name="arrow-forward" 
                  size={18} 
                  color="white" 
                />
                <ThemedText style={styles.enrollButtonText}>
                  Enroll Now
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  )
}

// Helper function to get service features
const getServiceFeatures = (serviceId: number): string[] => {
  const features: Record<number, string[]> = {
    1: [
      'OSCE, CBT, OET Training',
      'NCLEX Coaching & Registration',
      'NMC Verification & License Renewal'
    ],
    2: [
      'Mock interview sessions',
      'Interview preparation materials',
      'Confidence building techniques'
    ],
    3: [
      'Job search assistance',
      'Resume optimization',
      'Application tracking'
    ],
    4: [
      'University application support',
      'Scholarship guidance',
      'Document preparation'
    ],
    5: [
      'Proof of funds documentation',
      'Bank statement analysis',
      'Financial planning guidance'
    ],
    6: [
      'Visa application assistance',
      'Document preparation',
      'Application tracking'
    ],
    7: [
      'Professional CV writing',
      'Cover letter creation',
      'LinkedIn profile optimization'
    ]
  }
  
  return features[serviceId] || ['Professional service delivery', 'Expert guidance', 'Dedicated support']
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouchable: {
    flex: 1,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 25,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  serviceIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  purchasedContainer: {
    marginBottom: 16,
  },
  purchasedTag: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  purchasedText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    lineHeight: 28,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  featureText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  bottomActions: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  chatButtonsContainer: {
    gap: 12,
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  whatsappButtonText: {
    color: '#25D366',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Fixed Chat in App Button
  chatInAppButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#A4081D', // Your primary color
  },
  chatInAppButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  priceInfo: {
    alignItems: 'flex-start',
  },
  priceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  priceLabel: {
    fontSize: 14,
    marginTop: 2,
  },
  // Fixed Enroll Button
  enrollButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#A4081D', // Your primary color
    flex: 1,
  },
  enrollButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
})

export default ServiceBottomSheet