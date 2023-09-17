import { View, Text, Image } from "react-native";
import styles from "./styles";
import { useBasketContext } from "../../contexts/BasketContext";

const DEFAULT_IMAGE =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/uber-eats/restaurant1.jpeg";

const RestaurantHeader = ({ restaurant }) => {
  const { totalKm, totalMinutes, deliveryFee, totalPrice } = useBasketContext();

  return (
    <View style={styles.page}>
      <Image
        source={{
          uri: restaurant.image.startsWith("http")
            ? restaurant.image
            : DEFAULT_IMAGE,
        }}
        style={styles.image}
      />

      <View style={styles.container}>
        <Text style={styles.title}>{restaurant.name}</Text>
        <Text style={styles.subtitle}>
          Rs. {deliveryFee.toFixed(2)} &#8226; {totalMinutes.toFixed(2)} minutes
        </Text>
        <Text style={styles.subtitle}>
          Total Price &#8226; Rs. {totalPrice.toFixed(2)}
        </Text>

        <Text style={styles.menuTitle}>Menu</Text>
      </View>
    </View>
  );
};

export default RestaurantHeader;
