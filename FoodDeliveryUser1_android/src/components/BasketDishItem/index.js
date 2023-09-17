import { View, Text, StyleSheet, FlatList } from "react-native";
import { useBasketContext } from "../../contexts/BasketContext";

const BasketDishItem = ({ basketDish }) => {
  const { deliveryFee } = useBasketContext();

  console.log(basketDish.Dish);
  // console.log(basketDish.Dish._z);

  return (
    <View style={styles.row}>
      <View style={styles.quantityContainer}>
        <Text>{basketDish.quantity}</Text>
      </View>
      <Text style={{ marginRight: 70, fontWeight: "600" }}>{basketDish.Dish._z?.name}</Text>
      <Text style={{ marginLeft: "auto" }}>Rs. {basketDish.Dish._z?.price}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  column: {
    flexDirection: "column",
    alignItems: "center",
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  quantityContainer: {
    backgroundColor: "lightgray",
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginRight: 10,
    borderRadius: 3,
  },
});

export default BasketDishItem;
