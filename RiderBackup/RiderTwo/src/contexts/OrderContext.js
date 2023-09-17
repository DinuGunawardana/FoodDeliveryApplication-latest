import { createContext, useEffect, useState, useContext } from "react";
import { Auth, DataStore } from "aws-amplify";
import { Courier, Order, User, OrderDish, Restaurant } from "../models";
import { useAuthContext } from "./AuthContext";
import { set } from "react-native-reanimated";

const OrderContext = createContext({});

const OrderContextProvider = ({ children }) => {
  const { dbCourier } = useAuthContext();
  const [order, setOrder] = useState();
  const [user, setUser] = useState();
  const [restaurant, setRestaurant] = useState();
  const [dishes, setDishes] = useState();
  const [orderDishes, setOrderDishes] = useState(false);

  const fetchOrder = async (id) => {
    if (!id) {
      setOrder(null);
      return;
    }
    const fetchedOrder = await DataStore.query(Order, id);
    setOrder(fetchedOrder);

    DataStore.query(User, fetchedOrder.userID).then(setUser);

    DataStore.query(Restaurant, fetchedOrder.orderRestaurantId).then(setRestaurant);

    DataStore.query(OrderDish, (od) => od.orderID.eq(fetchedOrder.id)).then((orderd) => (
      setDishes(orderd)
    )
    );
  };

  console.log('-------------a---------------')
  console.log(dishes);

  // if(!dishes) {
  //   {dishes?.map((orderd) => (
  //     setOrderDishes(orderd)
  //   ))}
  // }

  useEffect(() => {
    if (!order) {
      return;
    }

    const subscription = DataStore.observe(Order, order.id).subscribe(
      ({ opType, element }) => {
        if (opType === "UPDATE") {
          fetchOrder(element.id);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [order?.id]);

  const acceptOrder = () => {
    // update the order, and change status, and assign the courier
    DataStore.save(
      Order.copyOf(order, (updated) => {
        updated.status = "ACCEPTED";
        updated.Courier = dbCourier;
      })
    ).then(setOrder);
  };

  const pickUpOrder = () => {
    // update the order, and change status, and assign the courier
    DataStore.save(
      Order.copyOf(order, (updated) => {
        updated.status = "PICKED_UP";
      })
    ).then(setOrder);
  };

  const completeOrder = () => {
    // update the order, and change status, and assign the courier
    DataStore.save(
      Order.copyOf(order, (updated) => {
        updated.status = "COMPLETED";
      })
    ).then(setOrder);
  };

  return (
    <OrderContext.Provider
      value={{
        acceptOrder,
        order,
        user,
        dishes,
        restaurant,
        fetchOrder,
        pickUpOrder,
        completeOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext);
