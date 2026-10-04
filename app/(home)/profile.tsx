import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { collection, onSnapshot } from "firebase/firestore";
import { BackButton } from "@/components/back-button";
import { Button } from "@/components/buttons";
import ProgressModel from "@/components/progress-model";
import { auth, firestore } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";

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
    marginHorizontal: 10,
    marginTop: 24,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#0356C5",
    paddingVertical: 22,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
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
  collectionItem:{
    alignItems: "center",
  },
  collecDivider:{
    width: 1,
    height: 36,
    backgroundColor: "#333333",
  },
  collectionItemText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  collectionNum:{
    fontSize: 24,
    fontWeight: "700",
    color: "#0356C5",
  },
  actionContainer: {
    marginTop: 36,
  },
});

export default function Profile() {
  const router = useRouter();
  const [logoutProgress, setLogoutProgress] = useState(false);

  const [totalCount, setTotalCount] = useState(0);
  const [carCount, setCarCount] = useState(0);
  const [bikeCount, setBikeCount] = useState(0);

  useEffect(() => {
  let unsubscribeVehicles: (() => void) | undefined;

  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    if (!user) {
      setTotalCount(0);
      setCarCount(0);
      setBikeCount(0);

      if (unsubscribeVehicles) {
        unsubscribeVehicles();
        unsubscribeVehicles = undefined;
      }

      return;
    }

    const vehiclesRef = collection(
      firestore,
      "users",
      user.uid,
      "vehicles"
    );

    unsubscribeVehicles = onSnapshot(
      vehiclesRef,
      (snapshot) => {
        const vehicles = snapshot.docs.map((doc)=>doc.data() as { type: "Car" | "Bike" });

        setTotalCount(vehicles.length);

        setCarCount(vehicles.filter((v) => v.type === "Car").length);

        setBikeCount(vehicles.filter((v) => v.type === "Bike").length);
      },
      (error) => {
        console.error("Firestore listener error:",error);
      }
    );
  });

  return () => {
    unsubscribeAuth();

    if (unsubscribeVehicles) {
      unsubscribeVehicles();
    }
  };
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
      setLogoutProgress(false);
      router.replace("/");
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
            <View style={styles.collectionItem}>
                <Text style={styles.collectionNum}>{totalCount}</Text>
                <Text style={styles.collectionItemText}>Vehicles</Text>
            </View>
            <View style={styles.collecDivider} />
            <View style={styles.collectionItem}>
                <Text style={styles.collectionNum}>{bikeCount}</Text>
                <Text style={styles.collectionItemText}>Bikes</Text>
            </View>
            <View style={styles.collecDivider} />
            <View style={styles.collectionItem}>
                <Text style={styles.collectionNum}>{carCount}</Text>
                <Text style={styles.collectionItemText}>Cars</Text>
            </View>
          </View>
          <View style={styles.actionContainer}>
            <Button title="Log Out" type="outline" onPress={handleLogout} loading={logoutProgress} disabled={logoutProgress} />
          </View>
        </ScrollView>
      </SafeAreaView>
      <ProgressModel visible={logoutProgress} />
    </View>
  );
}
