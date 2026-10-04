import { BackButton } from "@/components/back-button";
import { Button } from "@/components/buttons";
import { InputField } from "@/components/input-field";
import { signUp } from "@/services/firebase";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
    },
    headerContainer: {
        paddingHorizontal: 18,
        marginTop: 12,
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    headerSubtitle: {
        fontSize: 14,
        fontWeight: "400",
        color: "#8E8E93",
        marginTop: 6,
    },
    formContainer: {
        paddingHorizontal: 18,
        gap: 22,
    },
    footerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
    },
    footerText: {
        color: "#FFFFFF",
        fontSize: 14,
    },
    footerLink: {
        color: "#0356C5",
        fontSize: 14,
        fontWeight: "500",
        textDecorationLine: "underline",
    },
});


export default function Signup() {
    const [fullName,setFullName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [isLoading,setIsLoading]=useState(false);
    const [fieldsError,setFieldsError]=useState({fullName: "",email: "",password: ""});

    const router = useRouter();

    const handleSignUp = async () => {
        try {
            if (!fullName || !email || !password) {
                setFieldsError({
                    fullName: !fullName ? "Full name is required" : "",
                    email: !email ? "Email is required" : "",
                    password: !password ? "Password is required" : "",
                });
                return;
            }
            setFieldsError({
                fullName: "",
                email: "",
                password: "",
            });
            setIsLoading(true);
            await signUp(fullName, email, password);
            router.push("/login");
            Toast.show({
                type: "success",
                text1: "Account created successfully",
            });
        } catch (error) {
            console.log(error);
            Toast.show({
                type: "error",
                text1: typeof error === "string" ? error : "Failed to create account",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <BackButton type="light" />
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>Create Account</Text>
                    <Text style={styles.headerSubtitle}>Sign in to manage your vehicle collection</Text>
                </View>

                <View style={styles.formContainer}>
                    <InputField label="Full Name" placeholder="Jane Doe" value={fullName} onChangeText={setFullName} error={fieldsError.fullName}/>
                    <InputField label="Email" autoCapitalize="none" placeholder="jane_doe@email.com" value={email} onChangeText={setEmail} error={fieldsError.email}/>
                    <InputField label="Password" autoCapitalize="none" placeholder="Create a strong password" value={password} onChangeText={setPassword} secureTextEntry error={fieldsError.password}/>
                    <Button title="Create Account" type="primary" onPress={handleSignUp} disabled={isLoading} loading={isLoading}/>
                    <View style={styles.footerContainer}>
                        <Text style={styles.footerText}>Already have account? </Text>
                        <Link href="/login" style={styles.footerLink}>Log In</Link>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

