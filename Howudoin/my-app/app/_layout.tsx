import { Stack } from 'expo-router';
import { AuthProvider } from './AuthContext'; 

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        {/* Public routes */}
        <Stack.Screen name="index" options={{ title: "Login" }} />
        <Stack.Screen name="register" options={{ title: "Register" }} />

        {/* Protected routes */}
        <Stack.Screen name="menu" options={{ title: "Menu" }} />
        <Stack.Screen name="friend-list" options={{ title: "Friend List" }} />
        <Stack.Screen name="group-creation" options={{ title: "Create Groups" }} />
        <Stack.Screen name="group-list" options={{ title: "Group-List" }} />

        {/* Nested dynamic routes */}
        <Stack.Screen name="details/[id]" options={{ title: "Details" }} />
        <Stack.Screen name="MemberFolder/[groupid]" options={{ title: "Add Member" }} />
        <Stack.Screen name="groups/[groupid2]" options={{ title: "Group Chat" }} />
      </Stack>
    </AuthProvider>
  );
}

