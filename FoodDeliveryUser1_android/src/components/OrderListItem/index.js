import { View, Text, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Restaurant } from '../../models';
import { DataStore } from 'aws-amplify';

const OrderListItem = ({ order }) => {
  const navigation = useNavigation();
  const [restaurant, setRestaurant] = useState(null);

  const onPress = () => {
    navigation.navigate("Order", { id: order.id },);
  };

  useEffect(() => {
    DataStore.query(Restaurant, order.orderRestaurantId).then(setRestaurant);
  })

  return (
    <Pressable
      onPress={onPress}
      style={{ flexDirection: "row", margin: 10, alignItems: "center" }}
    >
      <Image
        source={{ uri: restaurant?.image }}
        style={{ width: 75, height: 75, marginRight: 5 }}
      />

      <View>
        <Text style={{ fontWeight: "600", fontSize: 16 }}>
          {restaurant?.name}
        </Text>
        <Text style={{ marginVertical: 5 }}>&#8226;</Text>
        <Text> &#8226; {order.status} </Text>
      </View>
    </Pressable>
  );
};

export default OrderListItem;
