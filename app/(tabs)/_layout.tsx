import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { BookMarked, Compass, Home, Search, User } from '@/ui/icons';

import { useLibraryCounts } from '@/logic/hooks/useLibrary';
import { useThemeColors } from '@/ui/theme/ThemeProvider';
import { iconTokens } from '@/ui/theme/tokens';

interface TabIconProps {
  focused: boolean;
  Icon: typeof Home;
}

function TabIcon({ focused, Icon }: TabIconProps) {
  const colors = useThemeColors();
  return (
    <View
      className={`h-10 w-12 items-center justify-center rounded-full ${
        focused ? 'bg-primary-soft' : 'bg-transparent'
      }`}
    >
      <Icon
        size={iconTokens.size.nav}
        strokeWidth={iconTokens.stroke}
        color={focused ? colors.primary : colors.muted}
      />
    </View>
  );
}

export default function TabsLayout() {
  const colors = useThemeColors();
  const { total } = useLibraryCounts();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingTop: 8,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarAccessibilityLabel: 'Home tab',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={Home} />,
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          title: 'Browse',
          tabBarAccessibilityLabel: 'Browse tab',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={Compass} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarAccessibilityLabel: 'Search tab',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={Search} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarAccessibilityLabel: 'Library tab',
          tabBarBadge: total > 0 ? total : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.primary,
            color: colors.onPrimary,
            fontSize: 10,
            lineHeight: 14,
          },
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={BookMarked} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarAccessibilityLabel: 'Profile tab',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={User} />,
        }}
      />
    </Tabs>
  );
}
