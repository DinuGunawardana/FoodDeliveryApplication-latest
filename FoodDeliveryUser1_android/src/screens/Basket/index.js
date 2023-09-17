import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import BasketDishItem from "../../components/BasketDishItem";
import { useBasketContext } from "../../contexts/BasketContext";
import { useOrderContext } from "../../contexts/OrderContext";
import { useNavigation } from "@react-navigation/native";

const Basket = () => {
  const { restaurant, basketDishes, totalPrice, deliveryFee } = useBasketContext();

  const { createOrder } = useOrderContext();
  const navigation = useNavigation();

  const onCreateOrder = async () => {
    const newOrder = await createOrder();
    navigation.navigate("OrdersTab", {
      screen: "Order",
      params: { id: newOrder.id },
    });
  };

  return (
    <View style={styles.page}>
      <Text style={styles.name}>{restaurant?.name}</Text>

      <Text style={{ fontWeight: "bold", marginTop: 20, fontSize: 19 }}>
        Your items
      </Text>

      <FlatList
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
        <Text style={{ fontWeight: "600" }}>Total Price</Text>
        <Text style={{ marginLeft: "auto" }}>Rs. {totalPrice}</Text>
      </View>

      <View style={styles.separator} />

      <Pressable onPress={onCreateOrder} style={styles.button}>
        <Text style={styles.buttonText}>
          Create order &#8226; Rs. {totalPrice.toFixed(2)}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: "100%",
    paddingVertical: 40, // temp fix
    padding: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    marginVertical: 10,
  },
  description: {
    color: "gray",
  },
  separator: {
    height: 1,
    backgroundColor: "lightgrey",
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  quantity: {
    fontSize: 25,
    marginHorizontal: 20,
  },
  button: {
    backgroundColor: "black",
    marginTop: "auto",
    padding: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 18,
  },
  quantityContainer: {
    backgroundColor: "lightgray",
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginRight: 10,
    borderRadius: 3,
  },
});

export default Basket;
