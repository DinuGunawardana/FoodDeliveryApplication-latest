import { View, Text, FlatList } from "react-native";

import OrderListItem from "../../components/OrderListItem";
import { useOrderContext } from "../../contexts/OrderContext";

const OrderScreen = () => {
  const { orders } = useOrderContext();
  // console.log(orders);

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <Text style={{ fontSize: 36, textAlign:'center', color:'orange', fontWeight:'bold'}}>ALI EAT</Text>
      <FlatList
        data={orders}
        renderItem={({ item }) => <OrderListItem order={item} />}
      />
    </View>
  );
};

export default OrderScreen;
