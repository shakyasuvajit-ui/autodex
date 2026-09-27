import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Image, Dimensions, TouchableOpacity, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { firestore, auth } from '@/services/firebase';
import { LinearGradient } from 'expo-linear-gradient';

type Vehicle = {
    id: string;
    type: 'Car' | 'Bike';
    brand: string;
    name: string;
    photoUri: string;
    createdAt: any;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#22252A",
        borderRadius: 24,
        paddingHorizontal: 16,
        height: 48,
        marginBottom: 16,
        width: 322,
        alignSelf: "center",
    },
    searchInput: {
        flex: 1,
        color: "#FFFFFF",
        fontSize: 16,
    },
    totalText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#0356C5",
        alignSelf: "center",
        width: 322,
        marginBottom: 16,
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 24,
    },
    columnWrapper: {
        gap: 12,
        marginBottom: 12,
    },
    card: {
        width: 150,
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#111111',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    cardOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    cardTypeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 4,
    },
    cardTypeText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#0356C5',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    cardName: {
        fontSize: 13,
        fontWeight: '400',
        color: '#FFFFFF',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 80,
        gap: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
    return (
        <View style={styles.card}>
            <Image source={{ uri: vehicle.photoUri }} style={styles.cardImage} />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.cardOverlay} >
                <Text style={styles.cardName} numberOfLines={1}>{vehicle.brand} {vehicle.name} </Text>
            </LinearGradient>
        </View>
    );
}

export default function Collection() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const vehiclesRef = collection(firestore, 'users', user.uid, 'vehicles');
        const q = query(vehiclesRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data: Vehicle[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<Vehicle, 'id'>),
            }));
            setVehicles(data);
        });

        return () => unsubscribe();
    }, []);

    const filteredVehicles = vehicles.filter((v) => {
        const q = searchQuery.toLowerCase();
        return (
            v.name.toLowerCase().includes(q) ||
            v.brand.toLowerCase().includes(q) ||
            v.type.toLowerCase().includes(q)
        );
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchBar}>
                <FontAwesome5 name="search" size={18} color="#cccccc" style={{ paddingRight: 10 }} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search vehicle"
                    placeholderTextColor="#cccccc"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            <Text style={styles.totalText}>
                Total: {filteredVehicles.length}
            </Text>

            {filteredVehicles.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No vehicles found.</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredVehicles}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.listContainer}
                    columnWrapperStyle={styles.columnWrapper}
                    renderItem={({ item }) => <VehicleCard vehicle={item} />}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}
