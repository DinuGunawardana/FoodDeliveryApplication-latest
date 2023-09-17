import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { DataStore } from 'aws-amplify';
import { User, Restaurant } from '../../models';
import { useEffect, useState } from 'react';

const OrderItem = ({ order }) => {
  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    DataStore.query(User, order.userID).then(setUser);
  }, []);

  useEffect(() => {
    DataStore.query(Restaurant, order.orderRestaurantId).then(setRestaurant);
  });

  return (
      <Pressable 
        style={{
                    flexDirection: 'row', 
                    margin: 10, 
                    borderColor: '#3FC060', 
                    borderWidth: 2, 
                    borderRadius: 12,
                    }}
                    onPress={() => navigation.navigate('OrdersDeliveryScreen', {id: order.id})}
                    >
          <Image 
            source={{uri: restaurant?.image}} 
            style={{
                    width: "25%", 
                    height: '100%', 
                    borderBottomLeftRadius: 10, 
                    borderTopLeftRadius: 10
                  }}
          />
        <View style={{ flex: 1, marginLeft: 10, paddingVertical: 5}}>
          <Text style={{fontSize: 18, fontWeight: '500'}}>
            {restaurant?.name}
          </Text>
          <Text style={{color: 'grey'}}>{restaurant?.address}</Text>
          <Text style={{color: 'grey'}}>{order.total.toFixed(2)}</Text>
          
          <Text style={{marginTop: 10}}>Delivery Details: </Text>
          <Text style={{ color: "grey" }}>{user?.name}</Text>
          <Text style={{ color: "grey" }}>{user?.address}</Text>
        </View>

          <View 
            style={{
              padding: 5,
              backgroundColor: '#3FC060', 
              borderBottomRightRadius: 8, 
              borderTopRightRadius: 8,
              alignItems: 'center',
              justifyContent: 'center'
            }}
            >
            <Entypo 
              name='check' 
              size={30} 
              color="white" 
              style={{marginLeft: 'auto'}}
            />
          </View>    
      </Pressable>
  );
}

export default OrderItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});
