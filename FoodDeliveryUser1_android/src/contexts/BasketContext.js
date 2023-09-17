import { createContext, useState, useEffect, useContext, useRef } from "react";
import MapView from "react-native-maps";
import {StyleSheet } from "react-native";
import * as Location from "expo-location";
import Constants from "expo-constants";
import MapViewDirections from "react-native-maps-directions";
import { DataStore } from "aws-amplify";
import { Basket, BasketDish } from "../models";
import { useAuthContext } from "./AuthContext";

const BasketContext = createContext({});

const BasketContextProvider = ({ children }) => {
  const { dbUser } = useAuthContext({lat: 7.290869746171658, lng: 80.63297372458969});
  const [restaurant, setRestaurant] = useState({lat: 7.255869746171658, lng: 79.63297372458969});
  const [basket, setBasket] = useState(null);
  const [basketDishes, setBasketDishes] = useState([]);
  const [userlocation, setuserLocation] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalKm, setTotalKm] = useState(0);

  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (!status === 'granted') {
        console.log('Nonono');
        return;
      }

      let userlocation = await Location.getCurrentPositionAsync({});
      setuserLocation({
            latitude: userlocation.coords.latitude,
            longitude: userlocation.coords.longitude
      });
    })();
  }, []);

  // console.log(userlocation);
  console.log(totalKm);
  console.log(totalMinutes);

  const deliveryFee = restaurant?.deliveryFee * totalKm;

  console.log(deliveryFee);

  const totalPrice = basketDishes.reduce(
    (sum, basketDish) => sum + basketDish.quantity * basketDish.Dish._z?.price,
    50 + deliveryFee
    );
  console.log(totalPrice);

  useEffect(() => {
    DataStore.query(Basket, (b) =>
      b.restaurantID.eq(restaurant.id).userID.eq(dbUser.id)
    ).then((baskets) => setBasket(baskets[0]));
    // DataStore.query(Basket, (b) => b.and(b => [
    //   b.restaurantID.eq(restaurant.id),
    //   b.userID.eq(dbUser.id)
    // ])).then((baskets) => setBasket(baskets[0]));
  }, [dbUser, restaurant]);

  useEffect(() => {
    if (basket) {
      DataStore.query(BasketDish, (bd) => bd.basketID.eq(basket.id)).then(
        setBasketDishes
      );
    }
  }, [basket]);

  const addDishToBasket = async (dish, quantity) => {
    // get the existing basket or create a new one
    let theBasket = basket || (await createNewBasket());

    // create a BasketDish item and save to Datastore
    const newDish = await DataStore.save(
      new BasketDish({ quantity, Dish: dish, basketID: theBasket.id })
    );

    setBasketDishes([...basketDishes, newDish]);
  };

  const createNewBasket = async () => {
    const newBasket = await DataStore.save(
      new Basket({ userID: dbUser.id, restaurantID: restaurant.id })
    );
    setBasket(newBasket);
    return newBasket;
  };

  const restaurantLocation = {
    latitude: restaurant?.lat,
    longitude: restaurant?.lng,
  };
  const deliveryLocation = {
    latitude: dbUser?.lat,
    longitude: dbUser?.lng,
  };

  console.log(restaurantLocation);
  console.log(deliveryLocation);

  return (
      <>
        <BasketContext.Provider
          value={{
            addDishToBasket,
            setRestaurant,
            restaurant,
            basket,
            basketDishes,
            totalPrice,
            deliveryFee,
            totalMinutes,
            totalKm,
            totalMinutes
          }}>
          {children}
        </BasketContext.Provider>
        <MapView
              ref={mapRef}
        >
          <MapViewDirections 
                      origin={restaurantLocation}
                      destination={deliveryLocation}
                      strokeWidth={5}
                      // waypoints={pin}
                      strokeColor="#ffa500"
                      apikey={"AIzaSyAu_ux8VIqXTPc15_ATAQGUCkwHuD6Bl0g"}
                      onReady={(result) => {
                          setTotalMinutes(result.duration);
                          setTotalKm(result.distance);
                      }}
                  />                      
        </MapView>
      </>
              
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    position: "absolute",
    width: "90%",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    borderRadius: 8,
    top: Constants.statusBarHeight,
  },
  input: {
    borderColor: "#888",
    borderWidth: 1,
  },
});

export default BasketContextProvider;

export const useBasketContext = () => useContext(BasketContext);
