import { BackButton } from "@/components/back-button";
import { Button } from "@/components/buttons";
import { InputField } from "@/components/input-field";
import { signIn } from "@/services/firebase";
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


export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [fieldsError, setFieldsError] = useState({ email: "",password: "",});

    const handleSignIn = async () => {
        try {
            if (!email || !password) {
                setFieldsError({
                    email: !email ? "Email is required" : "",
                    password: !password ? "Password is required" : "",
                });
                return;
            }
            setFieldsError({
                email: "",
                password: "",
            });
            setIsLoading(true);
            const user = await signIn(email, password);
            console.log("user", user);
            router.push("/(home)/homepage");
        } catch {
            Toast.show({
                type: "error",
                text1: "Invalid email or password!",
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
                    <Text style={styles.headerTitle}>Welcome!</Text>
                    <Text style={styles.headerSubtitle}>Login to continue to AutoDex</Text>
                </View>

                <View style={styles.formContainer}>
                    <InputField label="Email" autoCapitalize="none" placeholder="jane_doe@email.com" value={email} onChangeText={setEmail} error={fieldsError.email} />
                    <InputField label="Password" autoCapitalize="none" placeholder="Create a strong password" value={password} onChangeText={setPassword} secureTextEntry error={fieldsError.password} />

                    <Button title="Sign in" type="primary" onPress={handleSignIn} disabled={isLoading} loading={isLoading}/>

                    <View style={styles.footerContainer}>
                        <Text style={styles.footerText}>Dont have an account? </Text>
                        <Link style={styles.footerLink} href="/signup">Sign up</Link>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

