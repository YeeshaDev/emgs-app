
import { View, Text, TouchableOpacity } from "react-native"
import { useRouter, usePathname } from "expo-router"
import { Feather } from "@expo/vector-icons"
import { cn } from "@/lib/cn"

interface TabBarProps {
  isTutor?: boolean
}

const TabBar = ({ isTutor = false }: TabBarProps) => {
  const router = useRouter()
  const pathname = usePathname()

  const getTabs = () => {
    const baseTabs = [
      {
        name: "Home",
        icon: "home",
        path: "/",
      },
      {
        name: "Course",
        icon: "book-open",
        path: "/course",
      },
    ]

    if (isTutor) {
      baseTabs.push({
        name: "Create",
        icon: "plus-circle",
        path: "/create",
      })
    } else {
      baseTabs.push({
        name: "Services",
        icon: "briefcase",
        path: "/services",
      })
    }

    baseTabs.push({
      name: "Account",
      icon: "user",
      path: "/account",
    })

    return baseTabs
  }

  const tabs = getTabs()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <View className="flex-row justify-between items-center border-t border-gray-200 bg-white mb-3 py-1">
      {tabs.map((tab) => {
        const active = isActive(tab.path)
        return (
          <TouchableOpacity key={tab.name} className="flex-1 py-2 items-center" onPress={() => router.push(tab.path as any)}>
            <Feather name={tab.icon as any} size={24} color={active ? "#B91C1C" : "#6B7280"} />
            <Text className={cn("text-sm mt-1", active ? "text-primary font-medium" : "text-gray-500")}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

export default TabBar

