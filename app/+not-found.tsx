import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Page Not Found' }} />
      <View className="flex-1 items-center justify-center bg-background p-lg">
        <Text className="text-h1 font-inter-bold text-foreground">Screen doesn't exist.</Text>
        <Link href="/(tabs)" className="mt-md py-sm">
          <Text className="text-body font-inter-semibold text-primary">Go to home screen</Text>
        </Link>
      </View>
    </>
  );
}
