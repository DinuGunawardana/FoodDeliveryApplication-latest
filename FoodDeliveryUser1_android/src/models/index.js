// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const DishCategory = {
  "FOODS": "FOODS",
  "BUNS_AND_CAKES": "BUNS_AND_CAKES",
  "DRINKS": "DRINKS",
  "OTHERS": "OTHERS",
  "SPECIAL_OFFERS": "SPECIAL_OFFERS"
};

const TransportationModes = {
  "DRIVING": "DRIVING",
  "BICYCLING": "BICYCLING"
};

const OrderStatus = {
  "NEW": "NEW",
  "COOKING": "COOKING",
  "READY_FOR_PICKUP": "READY_FOR_PICKUP",
  "PICKED_UP": "PICKED_UP",
  "COMPLETED": "COMPLETED",
  "ACCEPTED": "ACCEPTED",
  "DECLINED_BY_RESTAURANT": "DECLINED_BY_RESTAURANT"
};

const { Courier, OrderDish, Order, BasketDish, Basket, User, Dish, Restaurant } = initSchema(schema);

export {
  Courier,
  OrderDish,
  Order,
  BasketDish,
  Basket,
  User,
  Dish,
  Restaurant,
  DishCategory,
  TransportationModes,
  OrderStatus
};