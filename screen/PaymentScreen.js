import { useStripe, StripeProvider } from "@stripe/stripe-react-native";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, StyleSheet } from "react-native";
import { keys } from "../keys";

const PaymentScreen = ({ route }) => {

  // Use useEffect for debugging, remove it later if not needed
  useEffect(() => {
    console.log("Route params:", route.params);
  }, [route.params]);

  const { totalAmount, totalFees, originalAmount } = route.params || {};
  
  // Add a check for existence
  if (!totalAmount || !totalFees || !originalAmount) {
    Alert.alert("Missing payment details");
    return null; // or return some error component
  }

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const stripe = useStripe();

  const subscribe = async () => {
    try {
      // sending request
      const response = await fetch("http://10.0.2.2:3000/create-payment-intent", {
        method: "POST",
        body: JSON.stringify({ name, email, amount: totalAmount, fees: totalFees, origamount: originalAmount }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("Server response:", response, data); // Log the server response for debugging

      if (!response.ok) return Alert.alert(data.message);

      const clientSecret = data.clientSecret;

      const initSheet = await stripe.initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Quantum Pulse',
        type: 'Card',
      });

      if (initSheet.error) return Alert.alert(initSheet.error.message);
      const presentSheet = await stripe.presentPaymentSheet({
        clientSecret,
      });

      if (presentSheet.error) return Alert.alert(presentSheet.error.message);
      Alert.alert("Payment complete, thank you!");
      
    } catch (err) {
      console.error(err);
      Alert.alert("Something went wrong, try again later!");
    }
  };

  return (
    <StripeProvider publishableKey={keys.public}>
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.container}>
          <Text style={styles.amountButtonText}>{`Total Amount: $${totalAmount}`}</Text>

          <TextInput
            value={name}
            onChangeText={(text) => setName(text)}
            placeholder="Full Name"
            style={styles.input}
          />

          <TextInput
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder="Email Here.."
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.payButton}
            onPress={subscribe}
          >
            <Text style={styles.payButtonText}>Pay</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </StripeProvider>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 4,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    margin: 20,
  },
  payButton: {
    backgroundColor: "#46A29F",
    padding: 15,
    borderRadius: 8,
    marginTop:20,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  amountButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 30,
  },
  input: {
    width: '100%', // Set the width as a percentage of the parent container
    height: 50,    // Set the height as needed
    fontSize: 18,  // Set the font size
    padding: 5,    // Set the padding
    borderWidth: 1, // Set the border width
    borderColor: '#ccc', // Set the border color
    borderRadius: 8, // Set the border radius for rounded corners
    marginBottom: 10, // Add some margin at the bottom if needed
  }
});
