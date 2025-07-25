import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import MainHeader from '@/components/(tabs)/main-header'
import ThemedSafeAreaView from '@/components/ui/main/ThemedSafeAreaView'
import ThemedView from '@/components/ui/theme/ThemedView'
import ThemedText from '@/components/ui/theme/ThemedText'
import ServiceItem from '@/components/(tabs)/service-item'
import ServiceBottomSheet from '@/components/ui/theme/ServiceBottomSheet'

interface Service {
  id: number
  title: string
  description: string
  icon: string
  color: string
  price?: number
  isPurchased?: boolean
}

const services: Service[] = [
  {
    id: 1,
    title: 'EMGS CONSULTATION DEPT',
    description: 'Get expert guidance for your educational journey including OSCE, CBT, OET Training, NCLEX coaching, and personalized support.',
    icon: 'chatbubble-ellipses',
    color: '#EF4444',
    price: 35000,
    isPurchased: true // Example: this service is purchased
  },
  {
    id: 2,
    title: 'EMGS INTERVIEW PREPARATION',
    description: 'Prepare for your visa interview with confidence through mock sessions and expert guidance.',
    icon: 'people',
    color: '#10B981',
    price: 25000,
    isPurchased: false
  },
  {
    id: 3,
    title: 'EMGS JOB APPLICATION',
    description: 'Find and apply for jobs in Malaysia with our comprehensive job search support.',
    icon: 'briefcase',
    color: '#06B6D4',
    price: 30000,
    isPurchased: true
  },
  {
    id: 4,
    title: 'EMGS STUDY ABROAD & SCHOLARSHIPS',
    description: 'Explore study opportunities and funding options with our expert guidance.',
    icon: 'school',
    color: '#8B5CF6',
    price: 40000,
    isPurchased: false
  },
  {
    id: 5,
    title: 'EMGS POF',
    description: 'Proof of funds documentation assistance and financial planning guidance.',
    icon: 'document-text',
    color: '#10B981',
    price: 15000,
    isPurchased: false
  },
  {
    id: 6,
    title: 'EMGS VISA APPLICATION DPT',
    description: 'Complete visa application support with document preparation and tracking.',
    icon: 'airplane',
    color: '#84CC16',
    price: 45000,
    isPurchased: true
  },
  {
    id: 7,
    title: 'EMGS CV & SUPPORTING INFORMATION DRAFTING',
    description: 'Professional CV and document preparation services for your applications.',
    icon: 'document',
    color: '#10B981',
    price: 20000,
    isPurchased: false
  }
]

export default function ServicesScreen() {
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false)

  const handleReferPress = () => {
    console.log('Refer & Earn pressed')
  }

  const handleNotificationPress = () => {
    console.log('Notification pressed')
  }

  const handleServicePress = (service: Service) => {
    setSelectedService(service)
    setBottomSheetVisible(true)
  }

  const handleCloseBottomSheet = () => {
    setBottomSheetVisible(false)
    setSelectedService(null)
  }

  const handleChatInApp = () => {
    console.log('Chat in app pressed for:', selectedService?.title)
    // Navigate to in-app chat
    handleCloseBottomSheet()
  }

  return (
    <ThemedSafeAreaView>
      <MainHeader 
        title="Services" 
        onReferPress={handleReferPress}
        onNotificationPress={handleNotificationPress}
      />
      
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Services Header */}
        <ThemedView className="mb-6" variant="default">
          <ThemedText className="text-lg font-semibold mb-2">
            Available Services
          </ThemedText>
          <ThemedText variant="muted" className="text-sm">
            Choose from our comprehensive range of educational services
          </ThemedText>
        </ThemedView>
        
        {/* Services List */}
        <ThemedView variant="default">
          {services.map((service) => (
            <ServiceItem
              key={service.id}
              title={service.title}
              description={service.description}
              icon={service.icon}
              color={service.color}
              onPress={() => handleServicePress(service)}
            />
          ))}
        </ThemedView>
        
        {/* Footer Spacing */}
        <ThemedView className="h-4" variant="default" />
      </ScrollView>

      {/* Service Bottom Sheet */}
      <ServiceBottomSheet
        isVisible={bottomSheetVisible}
        onClose={handleCloseBottomSheet}
        service={selectedService}
        onChatInApp={handleChatInApp}
      />
    </ThemedSafeAreaView>
  )
}