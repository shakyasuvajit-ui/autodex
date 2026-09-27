import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { collection, getDocs } from "firebase/firestore";
import { BackButton } from "@/components/back-button";
import { Button } from "@/components/buttons";
import ProgressModel from "@/components/progress-model";
import { auth, firestore } from "@/services/firebase";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileHeaderContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.2)",
    backgroundColor: "#000000",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 16,
    textAlign: "center",
  },
  profileEmail: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0356C5",
    marginTop: 4,
    textAlign: "center",
  },
  collectionSection: {
    marginTop: 28,
  },
  collectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 16,
  },
  collectionCard: {
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#0356C5",
    paddingVertical: 22,
    paddingHorizontal: 24,
    gap: 12,
    overflow: "hidden",
  },
  collectionItemText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  actionContainer: {
    marginTop: 36,
  },
});

export default function Profile() {
  const router = useRouter();
  const [logoutProgress, setLogoutProgress] = useState(false);

  // --- Live collection counts ---
  const [totalCount, setTotalCount] = useState(0);
  const [carCount, setCarCount] = useState(0);
  const [bikeCount, setBikeCount] = useState(0);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const vehiclesRef = collection(firestore, "users", user.uid, "vehicles");

    getDocs(vehiclesRef).then((snapshot) => {
      const vehicles = snapshot.docs.map((doc) => doc.data() as { type: "Car" | "Bike" });
      setTotalCount(vehicles.length);
      setCarCount(vehicles.filter((v) => v.type === "Car").length);
      setBikeCount(vehicles.filter((v) => v.type === "Bike").length);
    });
  }, []);

  const handleLogout = async () => {
    try {
      setLogoutProgress(true);
      await auth.signOut();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to logout",
      });
    } finally {
      router.push("/login");
      setLogoutProgress(false);
    }
  }


  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <BackButton type="light" />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* header section */}
          <View style={styles.profileHeaderContainer}>
            <Image
              source={require("@/assets/png/pfp.png")}
              style={styles.profileImage}
              contentFit="contain"
            />
            <Text style={styles.profileName}>{auth.currentUser?.displayName ?? 'N/A'}</Text>
            <Text style={styles.profileEmail}>{auth.currentUser?.email ?? 'N/A'}</Text>
          </View>
          {/* collection section */}
          <View style={styles.collectionSection}>
            <Text style={styles.collectionTitle}>My Collection</Text>
            <LinearGradient
              colors={["#0052CC", "#003380", "#001A40", "#000A1A"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.collectionCard}
            >
              <Text style={styles.collectionItemText}>{totalCount} {totalCount === 1 ? "Vehicle" : "Vehicles"}</Text>
              <Text style={styles.collectionItemText}>{carCount} {carCount === 1 ? "Car" : "Cars"}</Text>
              <Text style={styles.collectionItemText}>{bikeCount} {bikeCount === 1 ? "Bike" : "Bikes"}</Text>
            </LinearGradient>
          </View>
          <View style={styles.actionContainer}>
            <Button
              title="Log Out"
              type="outline"
              onPress={handleLogout}
              loading={logoutProgress}
              disabled={logoutProgress}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
      <ProgressModel visible={logoutProgress} />
    </View>
  );
}
