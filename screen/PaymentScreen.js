import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert, TouchableOpacity,SafeAreaView } from "react-native";
import { CardField, useConfirmPayment,StripeProvider } from "@stripe/stripe-react-native";
import {keys} from '../keys';

//ADD localhost address of your server
const API_URL = "http://10.0.2.2:3000";


// route object is pass as prop to 'PaymentScreen' component
// Pass the value of total amount of fees
const PaymentScreen = ({route}) => {
  const { totalAmount, totalFees, originalAmount } = route.params;
  const [email, setEmail] = useState();
  const [cardDetails, setCardDetails] = useState();
  const { confirmPayment, loading } = useConfirmPayment();

  const fetchPaymentIntentClientSecret = async (amount,fees, origamount) => {
    try {
      const response = await fetch(`${API_URL}/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount,fees,origamount }), // Send the amount to the server
      });
      const { clientSecret, error } = await response.json();
      return { clientSecret, error };
    } catch (error) {
      console.error("Error fetching payment intent:", error);
      return { error: error.message };
    }
  };

  const handlePayPress = async () => {
    //1.Gather the customer's billing information (e.g., email)
    if (!cardDetails?.complete || !email) {
      Alert.alert("Please enter Complete card details and Email");
      return;
    }
    const billingDetails = {
      email: email,
    };
    //2.Fetch the intent client secret from the backend
    try {
      const { clientSecret, error } = await fetchPaymentIntentClientSecret(totalAmount,totalFees, originalAmount);
      //2. confirm the payment
      if (error) {
        console.log("Unable to process payment");
      } else {
        const { paymentIntent, error } = await confirmPayment(clientSecret, {
          paymentMethodType: "Card",
          billingDetails: billingDetails,
        });
        if (error) {
          alert(`Payment Confirmation Error ${error.message}`);
        } else if (paymentIntent) {
          alert("Payment Successful");
          console.log("Payment successful ", paymentIntent);
        }
      }
    } catch (e) {
      console.log(e);
    }
    //3.Confirm the payment with the card details
  };

  return (
    <StripeProvider publishableKey={keys.public}>
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.container}>
          <Text>{`Total Amount: $${totalAmount}`}</Text>

          <TextInput
            autoCapitalize="none"
            placeholder="E-mail"
            keyboardType="email-address"
            onChange={value => setEmail(value.nativeEvent.text)}
            style={styles.input}
          />
          <CardField
            postalCodeEnabled={true}
            placeholder={{
              number: "4242 4242 4242 4242",
            }}
            cardStyle={styles.card}
            style={styles.cardContainer}
            onCardChange={cardDetails => {
              setCardDetails(cardDetails);
            }}
          />
          

          <TouchableOpacity style={styles.payButton} onPress={handlePayPress} disabled={loading}>
              <Text style={styles.payButtonText}>Pay</Text>
          </TouchableOpacity>

          {/* <Button onPress={handlePayPress} title="Pay" disabled={loading} /> */}
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
    margin: 20
    },

  input: {
    backgroundColor: "#efefefef",
    borderRadius: 5,
    fontSize: 20,
    height: 50,
    padding: 10,
  },
  card: {
    backgroundColor: "#efefefef",
  },
  cardContainer: {
    height: 20,
    marginVertical: 30,
  },
  
  payButton: {
    backgroundColor: "#46A29F",
    padding: 15,
    borderRadius: 8,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});