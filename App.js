import HomeScreen from './screen/HomeScreen';
import PaymentScreen from './screen/PaymentScreen';
import TipScreen from './screen/TipScreen';

import {Text} from 'react-native'
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";



// Function Here
function App(){

  const Stack = createStackNavigator();

  return (

      <NavigationContainer>
    
        <Stack.Navigator initialRouteName="Home"> 

          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: true }}
          />

          <Stack.Screen
            name="Tip"
            component={TipScreen}
            options={{
              headerTitle: "Tip Screen",
              headerTitleAlign: "center",
            }}/>

          <Stack.Screen
            name="Payment"
            component={PaymentScreen}
            options={{
              headerTitle: "Payment Screen",
              headerTitleAlign: "center",
            }}/>

        </Stack.Navigator>
      </NavigationContainer>

  );
};

export default App;
