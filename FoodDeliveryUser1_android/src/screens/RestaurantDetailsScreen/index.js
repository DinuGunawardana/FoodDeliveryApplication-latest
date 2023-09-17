import { useState, useEffect } from "react";
import {
  View,
  FlatList,
  SectionList,
  ActivityIndicator,
  Pressable,
  Text,
  Button,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DishListItem from "../../components/DishListItem";
import Header from "./Header";
import styles from "./styles";
import { useRoute, useNavigation } from "@react-navigation/native";
import { DataStore } from "aws-amplify";
import { Restaurant, Dish } from "../../models";
import { useBasketContext } from "../../contexts/BasketContext";

const RestaurantDetailsPage = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [bcdishes, setBCDishes] = useState([]);
  const [drinks, setDishDrinks] = useState([]);
  const [otherdishes, setOtherDish] = useState([]);
  const [specialdishes, setSpecialDish] = useState([]);

  const route = useRoute();
  const navigation = useNavigation();

  const id = route.params?.id;

  const {
    setRestaurant: setBasketRestaurant,
    basket,
    basketDishes,
  } = useBasketContext();

  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
        // Alert.alert('Refreshed');
        // console.log();
        if (!id) {
          return;
        }
        setBasketRestaurant(null);
        // fetch the restaurant with the id
        DataStore.query(Restaurant, id).then(setRestaurant);
    
        DataStore.query(Dish, (dish) => dish.and(dish => [
          dish.restaurantID.eq(id),
          dish.category.eq("FOODS")
        ])).then(setDishes);
    
        DataStore.query(Dish, (dishbc) => dishbc.and(dishbc => [
          dishbc.restaurantID.eq(id),
          dishbc.category.eq("BUNS_AND_CAKES")
        ])).then(setBCDishes);
    
        DataStore.query(Dish, (dishdrinks) => dishdrinks.and(dishdrinks => [
          dishdrinks.restaurantID.eq(id),
          dishdrinks.category.eq("DRINKS")
        ])).then(setDishDrinks);
    
        DataStore.query(Dish, (others) => others.and(others => [
          others.restaurantID.eq(id),
          others.category.eq("OTHERS")
        ])).then(setOtherDish);
    
        DataStore.query(Dish, (special) => special.and(special => [
          special.restaurantID.eq(id),
          special.category.eq("SPECIAL_OFFERS")
        ])).then(setSpecialDish);
      }, [id]);
    return focusHandler;
  }, [navigation]);

  // useEffect(() => {
  //   if (!id) {
  //     return;
  //   }
  //   setBasketRestaurant(null);
  //   // fetch the restaurant with the id
  //   DataStore.query(Restaurant, id).then(setRestaurant);

  //   DataStore.query(Dish, (dish) => dish.and(dish => [
  //     dish.restaurantID.eq(id),
  //     dish.category.eq("FOODS")
  //   ])).then(setDishes);

  //   DataStore.query(Dish, (dishbc) => dishbc.and(dishbc => [
  //     dishbc.restaurantID.eq(id),
  //     dishbc.category.eq("BUNS_AND_CAKES")
  //   ])).then(setBCDishes);

  //   DataStore.query(Dish, (dishdrinks) => dishdrinks.and(dishdrinks => [
  //     dishdrinks.restaurantID.eq(id),
  //     dishdrinks.category.eq("DRINKS")
  //   ])).then(setDishDrinks);

  //   DataStore.query(Dish, (others) => others.and(others => [
  //     others.restaurantID.eq(id),
  //     others.category.eq("OTHERS")
  //   ])).then(setOtherDish);

  //   DataStore.query(Dish, (special) => special.and(special => [
  //     special.restaurantID.eq(id),
  //     special.category.eq("SPECIAL_OFFERS")
  //   ])).then(setSpecialDish);
  // }, [id]);

  const categoryfood = [{
    title: "FOOD",
    data: dishes
  }];

  const categorybunsandcakes = [{
    title: "BUNS AND CAKES",
    data: bcdishes
  }];

  const categorydrinks = [{
    title: "DRINKS",
    data: drinks
  }];

  const categoryothers = [{
    title: "OTHERS",
    data: otherdishes
  }];

  const categoryspecialoffers = [{
    title: "SPECIAL OFFERS",
    data: specialdishes
  }];

  useEffect(() => {
    setBasketRestaurant(restaurant);
  }, [restaurant]);

  if (!restaurant) {
    return <ActivityIndicator size={"large"} color="gray" />;
  }

  return (
    <View style={styles.page}>
      <SectionList 
        ListHeaderComponent={() => <Header restaurant={restaurant} />}
        sections = {[...categoryfood, ...categorybunsandcakes, ...categorydrinks, ...categoryothers, ...categoryspecialoffers]}
        data={dishes}
        renderSectionHeader={({section})=>(<Text style={styles.taskTitle}>{section.title}</Text>)}
        renderItem={({ item }) => (<DishListItem dish={item} />)}
        keyExtractor={(item) => item.name}
        // stickySectionHeadersEnabled
      />
      <Ionicons
        onPress={() => navigation.goBack()}
        name="arrow-back-circle"
        size={45}
        color="orange"
        style={styles.iconContainer}
      />
      {basket && (
        <Pressable
          onPress={() => {navigation.navigate("Basket")}}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            Open basket ({basketDishes.length})
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default RestaurantDetailsPage;
