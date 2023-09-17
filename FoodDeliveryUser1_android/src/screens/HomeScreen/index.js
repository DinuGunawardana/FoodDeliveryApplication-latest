import { useState, useEffect } from "react";
import { StyleSheet, FlatList, View, Text, TextInput, Pressable } from "react-native";
import RestaurantItem from "../../components/RestaurantItem";
import { DataStore } from "aws-amplify";
import { Restaurant } from "../../models";
import Constants from "expo-constants";
import { useBasketContext } from "../../contexts/BasketContext";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const [restaurants, setRestaurants] = useState([]);
  const { basket, basketDishes } = useBasketContext();

  const navigation = useNavigation();

  useEffect(() => {
    DataStore.query(Restaurant).then(setRestaurants);
  }, []);

  return (
    <View style={styles.page}>
      <Text style={{ fontSize: 36, textAlign:'center', color:'orange', fontWeight:'bold'}}>ALI EAT</Text>
      {/* {basket && (
        <Pressable
          onPress={() => {navigation.navigate("Basket")}}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            Open basket ({basketDishes.length})
          </Text>
        </Pressable>
      )} */}
      <Text style={{ color:'grey', textAlign: "center" }}>Please add menu items from one restaurant and complete the order, before proceeding to another order.</Text>
      <FlatList
        data={restaurants}
        renderItem={({ item }) => <RestaurantItem restaurant={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 10,
    paddingBottom: 80,
    // top: Constants.statusBarHeight,
  },
  button: {
    backgroundColor: "black",
    marginTop: "auto",
    padding: 20,
    alignItems: "center",
    margin: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 18,
  },
});
