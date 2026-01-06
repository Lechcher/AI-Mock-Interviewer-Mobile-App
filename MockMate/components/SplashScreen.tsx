import images from "@/lib/images";
import { StatusBar } from "expo-status-bar";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.logoContainer}>
        <Image source={images.logo} style={styles.logo} resizeMode="contain" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>MOCKMATE</Text>
          <Text style={styles.subtitle}>INTERVIEW PRACTICE MADE EASY.</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 120,
    height: 124,
  },
  textContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  title: {
    fontFamily: "Lexend",
    fontSize: 20,
    fontWeight: "900",
    color: "#0061ff",
    letterSpacing: 2,
    textAlign: "center",
    textTransform: "uppercase",
  },
  subtitle: {
    fontFamily: "Lexend",
    fontSize: 12,
    fontWeight: "500",
    color: "#666876",
    letterSpacing: 1.2,
    lineHeight: 15,
    textAlign: "center",
    textTransform: "uppercase",
    marginTop: 10,
  },
});

export default SplashScreen;
