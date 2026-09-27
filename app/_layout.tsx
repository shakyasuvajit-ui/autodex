import { initializeFirebase } from "@/services/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

const { auth } = initializeFirebase();

export const unstable_settings = {
  anchor: "(home)",
};

export default function RootLayout() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsInitialized(true);
    });

    return unsubscribe;
  }, []);

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000000", }}>
        <ActivityIndicator size="large" color="#0356C5" />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} initialRouteName={user ? "(home)" : "index"} >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="(home)" />
      </Stack>
      <Toast />
    </>
  );
}