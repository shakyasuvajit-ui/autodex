import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Image as ExpoImage} from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { auth, firestore } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";

type Vehicle = {
    id: string;
    type: "Car" | "Bike";
    brand: string;
    name: string;
    year?: string;
    subtype?: string;
    photoUri: string;
    createdAt: any;
};

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 32,
    },
    // Header
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 8,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "800",
        color: "#FFFFFF",
        letterSpacing: 0.5,
    },
    profilePic: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1.5,
        borderColor: "rgba(255, 255, 255, 0.2)",
        backgroundColor: "#111111",
    },
    // Stats card
    statsCard: {
        marginHorizontal: 20,
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
    statItem: {
        alignItems: "center",
    },
    statNumber: {
        fontSize: 24,
        fontWeight: "700",
        color: "#0356C5",
    },
    statLabel: {
        fontSize: 15,
        fontWeight: "600",
        color: "#FFFFFF",
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 36,
        backgroundColor: "#333333",
    },
    // Section header
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginTop: 36,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    seeAllText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#0356C5",
        letterSpacing: 0.5,
    },
    // Recent vehicle cards row
    recentList: {
        paddingHorizontal: 20,
        gap: 12,
        flexDirection: "row",
    },
    recentCard: {
        width: 150,
        height: 200,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: "#111111",
    },
    recentCardImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    recentCardOverlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    recentCardName: {
        fontSize: 13,
        fontWeight: "400",
        color: "#FFFFFF",
        lineHeight: 18,
    },
    // Empty state
    emptyText: {
        fontSize: 14,
        color: "#666666",
        paddingHorizontal: 20,
        marginTop: 8,
    },
});

// ─── RecentVehicleCard Component ───────────────────────────────────────────────
function RecentVehicleCard({ vehicle }: { vehicle: Vehicle }) {
    const displaySub = vehicle.subtype || vehicle.type;

    return (
        <View style={styles.recentCard}>
            <Image source={{ uri: vehicle.photoUri }} style={styles.recentCardImage} />
            <LinearGradient colors={["transparent", "rgba(0,0,0,0.88)"]} style={styles.recentCardOverlay}>
                <Text style={styles.recentCardName} numberOfLines={2}>
                    {vehicle.brand} {vehicle.name}
                </Text>
            </LinearGradient>
        </View>
    );
}

// ─── Homepage ──────────────────────────────────────────────────────────────────
export default function Homepage() {
    const router = useRouter();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [carCount, setCarCount] = useState(0);
    const [bikeCount, setBikeCount] = useState(0);

    useEffect(() => {
  let unsubscribeVehicles: (() => void) | undefined;

  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    if (!user) { 
        setVehicles([]);
        setTotalCount(0);
        setCarCount(0);
        setBikeCount(0);

      if (unsubscribeVehicles) {
        unsubscribeVehicles();
        unsubscribeVehicles = undefined;
      }

      return;
    }

    const vehiclesRef = collection(firestore, "users", user.uid, "vehicles");
    const q = query(vehiclesRef, orderBy("createdAt", "desc"));

    unsubscribeVehicles = onSnapshot(
      q,
      (snapshot) => {
        const data: Vehicle[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Vehicle, "id">),
        }));

        setVehicles(data);
        setTotalCount(data.length);
        setCarCount(
          data.filter((vehicle) => vehicle.type === "Car").length
        );
        setBikeCount(
          data.filter((vehicle) => vehicle.type === "Bike").length
        );
      },
      (error) => {
        console.error(
          "Homepage Firestore listener error:",
          error
        );
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

    const recentVehicles = vehicles.slice(0, 2);

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* ── Header ── */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Autodex</Text>
                        <TouchableOpacity
                            onPress={() => router.push("/(home)/profile")}
                            activeOpacity={0.8}
                        >
                            <ExpoImage
                                source={require("@/assets/png/pfp.png")}
                                style={styles.profilePic}
                                contentFit="contain"
                            />  
                        </TouchableOpacity>
                    </View>

                    {/* ── Stats Card ── */}
                    <View style={styles.statsCard}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{totalCount}</Text>
                            <Text style={styles.statLabel}>Vehicles</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{bikeCount}</Text>
                            <Text style={styles.statLabel}>Bikes</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{carCount}</Text>
                            <Text style={styles.statLabel}>Cars</Text>
                        </View>
                    </View>

                    {/* ── Recently Added ── */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recently added</Text>
                        <TouchableOpacity
                            onPress={() => router.push("/(home)/collection")}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.seeAllText}>SEE ALL</Text>
                        </TouchableOpacity>
                    </View>

                    {recentVehicles.length > 0 ? (
                        <View style={styles.recentList}>
                            {recentVehicles.map((vehicle) => (
                                <RecentVehicleCard key={vehicle.id} vehicle={vehicle} />
                            ))}
                        </View>
                    ) : (
                        <Text style={styles.emptyText}>No vehicles added yet.</Text>
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
