import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Image, Alert } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/buttons";
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { firestore, auth } from '@/services/firebase';
import Toast from 'react-native-toast-message';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
    },
    headerContainer:{
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        padding:20
    },  
    headerText:{
        fontSize: 20,
        fontWeight: "600",
        color: "#ffffff",
        paddingLeft:24
    },
    cameraContainer:{
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0356C5',
    },
    uploadContainer:{

    },
    imageCapture:{
        height:220,
        width:322,
        borderRadius:20,
        borderWidth:1,
        borderColor:"#0356C5",
        borderStyle:"dashed",
        justifyContent:"center",
        alignItems:"center",
        alignSelf:"center",
        marginTop:20,
        overflow: "hidden",
    },
    capturedImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    uploadText:{
        fontSize: 15,
        fontWeight: "bold",
        color: "#ffffff",
        paddingTop:24
    },
    galleryUpload:{
        borderRadius:26,
        borderWidth:1,
        borderColor:"#0356C5",
        justifyContent:"center",
        alignItems:"center",
        alignSelf:"center",
        flexDirection:"row",
        gap:12, 
        width:322, 
        height:52,
        marginTop:16,
    },
    galleryText:{
        fontSize: 15,
        fontWeight: "600",
        color: "#ffffff"
    },
    dataEntry:{
        marginTop:38,
        width:322,
        alignSelf:"center",
    },
    dataEntryHeader:{
        fontSize: 18,
        fontWeight: "500",
        color: "#ffffff",
    },
    typeSelect:{
        flexDirection: "row",
        gap: 12,
        marginBottom: 16,   
        width: 322,
    },
    selectType:{
        borderRadius:25,
        borderWidth:1,
        borderColor:"#333333",
        justifyContent:"center",
        alignItems:"center",
        flexDirection:"row",
        gap:8,
        flex:1, 
        height:50,
    },
    selectTypeText:{
        fontSize: 15,
        fontWeight: "600",
        color: "#ffffff"
    },
    selectActive:{
        backgroundColor: "#0356C5",
        borderColor: "#0356C5",
    },
    inputLabel:{
        fontSize: 14,
        fontWeight: "600",
        color: "#CCCCCC",
        marginBottom: 6,
    },
    inputWrapper:{
        backgroundColor: "#111111",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#222222",
        marginBottom: 16,
        paddingHorizontal: 14,
        paddingVertical: 4,
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    textInput:{
        color: "#FFFFFF",
        fontSize: 15,
        height: 44,
    },
    buttonRow:{
        flexDirection: "row",
        width: 322,
        alignSelf: "center",
        marginBottom: 40,
    }, 
});

export default function VehicleEntry() {
    const [selectedType, setSelectedType] = useState<"Car" | "Bike">("Car");
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [brand, setBrand] = useState("");
    const [vehicleName, setVehicleName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCameraCapture = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission needed", "Camera permission is required to capture vehicle photos.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setPhotoUri(result.assets[0].uri);
        }
    };

    const handleGalleryPick = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission needed", "Gallery permission is required to select photos.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setPhotoUri(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!photoUri) {
            Alert.alert("Missing Photo", "Please capture or select a vehicle photo.");
            return;
        }
        if (!brand.trim()) {
            Alert.alert("Missing Brand", "Please enter the vehicle brand.");
            return;
        }
        if (!vehicleName.trim()) {
            Alert.alert("Missing Name", "Please enter the vehicle name.");
            return;
        }
        const user = auth.currentUser;
        if (!user) {
            Alert.alert("Not logged in", "Please log in to save vehicles.");
            return;
        }
        setLoading(true);
        try {
            await addDoc(collection(firestore, 'users', user.uid, 'vehicles'), {
                type: selectedType,
                brand: brand.trim(),
                name: vehicleName.trim(),
                photoUri,
                createdAt: serverTimestamp(),
            });
            Toast.show({
                type: 'success',
                text1: 'Vehicle Saved!',
                text2: `${brand.trim()} ${vehicleName.trim()} added to your collection.`,
            });
            setPhotoUri(null);
            setBrand('');
            setVehicleName('');
            setSelectedType('Car');
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to save vehicle. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.headerContainer}>
                    <View style={styles.cameraContainer}>
                        <FontAwesome name="camera" size={24} color="#ffffff"/>
                    </View>
                    <Text style={styles.headerText}>Vehicle Entry</Text>
                </View>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.uploadContainer}>
                        <TouchableOpacity 
                            style={styles.imageCapture}
                            onPress={handleCameraCapture}
                            activeOpacity={0.8}
                        >
                            {photoUri ? (
                                <Image source={{ uri: photoUri }} style={styles.capturedImage} />
                            ) : (
                                <>
                                    <View style={styles.cameraContainer}>
                                        <MaterialCommunityIcons name="camera-control" size={24} color="#ffffff" />                
                                    </View>
                                    <Text style={styles.uploadText}>Click to capture the vehicle</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.galleryUpload}
                            onPress={handleGalleryPick}
                            activeOpacity={0.7}
                        >
                            <FontAwesome5 name="images" size={24} color="#ffffff" />
                            <Text style={styles.galleryText}>Click to add from gallery</Text>
                        </TouchableOpacity>

                        <View style={styles.dataEntry}> 
                            <View style={{marginBottom:16}}>
                                <Text style={styles.dataEntryHeader}>Vehicle Information</Text>
                                <Text style={styles.inputLabel}>Vehicle Type</Text>
                            </View>
                            <View style={styles.typeSelect}>
                                <TouchableOpacity 
                                    style={[styles.selectType, selectedType === "Car" && styles.selectActive]}
                                    onPress={() => setSelectedType("Car")}
                                    activeOpacity={0.7}
                                >
                                    <FontAwesome5 name="car" size={18} color="#ffffff" />
                                    <Text style={styles.selectTypeText}>Car</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.selectType, selectedType === "Bike" && styles.selectActive]}
                                    onPress={() => setSelectedType("Bike")}
                                    activeOpacity={0.7}
                                >
                                    <FontAwesome5 name="motorcycle" size={18} color="#ffffff" />
                                    <Text style={styles.selectTypeText}>Bike</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.inputLabel}>Vehicle Brand</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Enter Vehicle Brand"
                                    placeholderTextColor="#666666"
                                    value={brand}
                                    onChangeText={setBrand}
                                />
                            </View>
                            <Text style={styles.inputLabel}>Vehicle Name</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Enter Vehicle Name"
                                    placeholderTextColor="#666666"
                                    value={vehicleName}
                                    onChangeText={setVehicleName}
                                />
                            </View> 
                        </View>
                    </View>
                    <View style={styles.buttonRow}>
                        <Button title="Save" type="primary" onPress={handleSave} loading={loading} style={{ flex: 1 }} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

