import { Stack } from 'expo-router';

export default function FriendLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[friendId]" />
    </Stack>
  );
}