import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from '@react-navigation/native';

// create separate variable for storing total fees and pass it to 'PaymentScreen'
const TipScreen = () => {
  const [amount, setAmount] = useState(0);
  const navigation = useNavigation();

  const calculateTotal = () => {
    const amountNumeric = parseFloat(amount);
    const tipAmount = amountNumeric / 100;

    // Application fee ($1)
    const applicationFee = 1;

    // Stripe fee (3% + $0.30)
    const stripeFeePercentage = 0.03;
    const stripeFeeFixed = 0.30;
    const stripeFee = (tipAmount * stripeFeePercentage) + stripeFeeFixed;

    // Authorization fee ($0.30)
    const authorizationFee = 0.30;

    // Instant payout fee (1%)
    const instantPayoutPercentage = 0.01;
    const instantPayoutFee = amountNumeric * instantPayoutPercentage;

    // Total Amount of fees only
    const totalFees = applicationFee + stripeFee + authorizationFee + instantPayoutFee;

    // Total Amount
    const totalAmount = amountNumeric + applicationFee + stripeFee + authorizationFee + instantPayoutFee;
    console.log(totalAmount);

    return{
      originalAmount: amountNumeric,
      tip: tipAmount,
      applicationFee,
      stripeFee,
      authorizationFee,
      instantPayoutFee,
      totalFees,
      totalAmount,
    };
  };

  const handlePayPress = () => {
    const breakdown = calculateTotal();

    // Navigate to PaymentScreen and pass totalAmount as a prop
    navigation.navigate('Payment', {
        originalAmount: breakdown.originalAmount.toFixed(2),
        totalAmount: breakdown.totalAmount.toFixed(2),
        totalFees: breakdown.totalFees.toFixed(2),

    });
    // Perform payment logic (placeholder)
    // alert(`Paid: $${breakdown.totalAmount.toFixed(2)}`);
  };

  const handleAmountChange = (text) => {
    // Validate if the entered value is a valid number
    const numericValue = parseFloat(text);
    if (!isNaN(numericValue)) {
      setAmount(numericValue);
    }
  };


  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar backgroundColor="#46A29F" />
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Enter Amount"
          keyboardType="numeric"
          value={amount.toString()}
          onChangeText={handleAmountChange}
        />

        <View style={styles.breakdownContainer}>
          <Text style={styles.breakdownLabel}>Breakdown:</Text>
          <Text style={styles.breakdownText}>{`Tip Amount: $${calculateTotal().originalAmount.toFixed(2)}`}</Text>
          <Text style={styles.breakdownText}>{`Application Fee: $${calculateTotal().applicationFee.toFixed(2)}`}</Text>
          <Text style={styles.breakdownText}>{`Stripe Fee: $${calculateTotal().stripeFee.toFixed(2)}`}</Text>
          <Text style={styles.breakdownText}>{`Authorization Fee: $${calculateTotal().authorizationFee.toFixed(2)}`}</Text>
          <Text style={styles.breakdownText}>{`Instant Payout Fee: $${calculateTotal().instantPayoutFee.toFixed(2)}`}</Text>
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Payment:</Text>
          <Text style={styles.totalAmount}>${calculateTotal().totalAmount.toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.payButton} onPress={handlePayPress}>
          <Text style={styles.payButtonText}>Proceed</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    width: 200,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    textAlign: "center",
  },
  tipButtonsContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  tipButton: {
    backgroundColor: "#46A29F",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  selectedTipButton: {
    backgroundColor: "#204051",
  },
  tipButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  totalContainer: {
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#46A29F",
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

  breakdownContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  breakdownLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  breakdownText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default TipScreen;
