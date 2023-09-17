import { View, Text, Image, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import BasketDishItem from "../../components/BasketDishItem";
import styles from "./styles";
import { useOrderContext } from "../../contexts/OrderContext";
import { useEffect, useState } from "react";
import { DataStore } from 'aws-amplify';
import { Restaurant } from '../../models';
import { useBasketContext } from "../../contexts/BasketContext";

const OrderDetailsHeader = ({ order }) => {
  const [restaurant, setRestaurant] = useState(null); 

  useEffect(() => {
    DataStore.query(Restaurant, order.orderRestaurantId).then(setRestaurant);
  });

  return (
    <View>
      <View style={styles.page}>
        <Image source={{ uri: restaurant?.image }} style={styles.image} />

        <View style={styles.container}>
          <Text style={{ color: "red", textAlign: "center" }}>Please Call 076 992 4480 to cancel your order</Text>
          <Text style={styles.title}>{restaurant?.name}</Text>
          <Text style={styles.subtitle}>ORDER ID: {order.id}</Text>
          <Text style={styles.subtitle}>{order.status} &#8226; 2 days ago</Text>

          <Text style={styles.menuTitle}>Your orders</Text>
        </View>
      </View>
    </View>
  );
};

const OrderDetails = ({ id }) => {
  const [order, setOrder] = useState();
  const { getOrder } = useOrderContext();
  const { basketDishes, deliveryFee } = useBasketContext();

  useEffect(() => {
    getOrder(id).then(setOrder);
  }, []);

  if (!order) {
    return <ActivityIndicator size={"large"} color="gray" />;
  }

  return (
    <View>
        <FlatList
        ListHeaderComponent={() => <OrderDetailsHeader order={order} />}
        data={basketDishes}
        renderItem={({ item }) => <BasketDishItem basketDish={item} />}
      />

      <View
        style={{
          borderBottomColor: 'black',
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />

      <View style={styles.row}>
         <View style={styles.quantityContainer}>
           <Text>{'$'}</Text>
         </View>
         <Text style={{ fontWeight: "600" }}>Delivery Fee</Text>
       <Text style={{ marginLeft: "auto" }}>Rs. {deliveryFee.toFixed(2)}</Text>
       </View>

       <View
        style={{
          borderBottomColor: 'grey',
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />
      <View style={styles.row}>
        <View style={styles.quantityContainer}>
          <Text>{'$'}</Text>
        </View>
        <Text style={{ fontWeight: "600" }}>PickUp Fee</Text>
        <Text style={{ marginLeft: "auto" }}>Rs. {'50'}</Text>
      </View>

      </View> 
  );
};



export default OrderDetails;
