import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native';
import {Image} from "expo-image";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/buttons';
import { Link, useRouter } from 'expo-router';

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "black",
        justifyContent: "space-between",
    },
    logoContainer:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: 297,
        height: 297,
    },
    bottomContainer:{
        width: "100%",
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    bottomTextContainer:{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom:29
    },
    loginText:{
        color: "#FFFFFF",
        fontSize: 14,
    },
    loginLink:{
        color: "#0356C5",
        fontSize: 14,
        fontWeight: "600",
        textDecorationLine: "underline",
    }

});
export default function Index() {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={require("@/assets/png/app-logo.png")}
                    style={styles.logo}/>
            </View>
            <SafeAreaView>
                <View style={styles.bottomContainer}>
                    <Button title="Get Started" type="primary" onPress={() => router.push("/signup")}/>
                </View>
                <View style={styles.bottomTextContainer}>
                    <Text style={styles.loginText}>Already have an account? </Text>
                    <Link href="/login" style={styles.loginLink}>Log in</Link>
                </View>
            </SafeAreaView>
        </View>
    )
}