import '@azure/core-asynciterator-polyfill'
import { StatusBar } from "expo-status-bar";
import RootNavigator from "./src/navigation";

import { NavigationContainer } from "@react-navigation/native";
import { Amplify } from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react-native";
import config from "./src/aws-exports";
import AuthContextProvider from "./src/contexts/AuthContext";
import BasketContextProvider from "./src/contexts/BasketContext";
import OrderContextProvider from "./src/contexts/OrderContext";

import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();//Hide all warning notifications on front-end

Amplify.configure({
  ...config,
  Analytics: {
    disabled: true,
  },
});

function App() {
  return (
    <NavigationContainer>
      <AuthContextProvider>
        <BasketContextProvider>
          <OrderContextProvider>
            <RootNavigator />
          </OrderContextProvider>
        </BasketContextProvider>
      </AuthContextProvider>

      <StatusBar style="light" />
    </NavigationContainer>
  );
}

const signUpConfig = {
  header: 'Create new account',
  hideAllDefaults: true,
  defaultCountryCode: '1',
  signUpFields: [
    {
      label: 'User name',
      key: 'name',
      required: true,
      displayOrder: 1,
      type: 'string'
    },
    {
      label: 'Password',
      key: 'password',
      required: true,
      displayOrder: 2,
      type: 'password'
    },
    {
      label: 'PhoneNumber',
      key: 'username',
      required: true,
      displayOrder: 3,
      type: 'string'
    },
    {
      label: 'Email',
      key: 'username',
      required: true,
      displayOrder: 4,
      type: 'string'
    }
  ]
};
const usernameAttributes = 'Email';

export default withAuthenticator(App, {
  signUpConfig,
  usernameAttributes
});
