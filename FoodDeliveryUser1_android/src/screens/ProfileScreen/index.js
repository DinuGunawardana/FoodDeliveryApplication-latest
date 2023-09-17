import { View, Text, TextInput, StyleSheet, Button, Alert, PermissionsAndroid, Platform} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Auth, DataStore } from "aws-amplify";
import { User } from "../../models";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
//import all the components we are going to use.
import Geolocation from '@react-native-community/geolocation';
import Constants from "expo-constants";

const Profile = () => {
  const { dbUser } = useAuthContext();

  const [name, setName] = useState(dbUser?.name || "");
  const [address, setAddress] = useState(dbUser?.address || "");
  const [telno, setTelno] = useState(dbUser?.telno || "")
  const [updatedAddress, setUpdatedAddress] = useState('...')
  const [pin, setPin] = useState('...');
  const [currentLongitude, setCurrentLongitude] = useState('...');
  const [currentLatitude, setCurrentLatitude] = useState('...');
  const [locationStatus, setLocationStatus] = useState('');

  const { sub, setDbUser } = useAuthContext();

  const navigation = useNavigation();

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getOneTimeLocation();
        subscribeLocationLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            getOneTimeLocation();
            subscribeLocationLocation();
          } else {
            setLocationStatus('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestLocationPermission();
    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);

  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        setLocationStatus('You are Here');

        //getting the Longitude from the location json
        const currentLongitude = 
          JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = 
          JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);
        
        //Setting Longitude state
        setCurrentLatitude(currentLatitude);
      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000
      },
    );
  };

  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      (position) => {
        //Will give you the location on location change
        
        setLocationStatus('You are Here');
        console.log(position);

        //getting the Longitude from the location json        
        const currentLongitude =
          JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = 
          JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Latitude state
        setCurrentLatitude(currentLatitude);
      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000
      },
    );
  };

  const onSave = async () => {
     if (dbUser) {
       await updateUser();
    } else {
       await createUser();
    }
     navigation.goBack();
   };

  const updateUser = async () => {
    const user = await DataStore.save(
      User.copyOf(dbUser, (updated) => {
        updated.name = name;
        updated.address = address;
        updated.telno = telno;
        updated.lat = currentLatitude || parseFloat(pin.latitude);
        updated.lng = currentLongitude || parseFloat(pin.longitude);

        console.log(updated.lat);
        console.log(updated.lng);
        console.log(updated.address);
      })
    );
    setDbUser(user);
  };

  // console.log(pin.latitude);
  // console.log(pin.longitude);

const createUser = async () => {
  try {
    const user = await DataStore.save(
      new User({
        name,
        address,
        telno,
        lat: parseFloat(currentLatitude),
        lng: parseFloat(currentLongitude),
        sub,
      })
    );
    setDbUser(user);
  } catch (e) {
    Alert.alert("Error", e.message);
  }
};

  return (
    <View>
        <View style={{top: Constants.statusBarHeight}}>
          <Text style={{ fontSize: 36, textAlign:'center', color:'orange', fontWeight:'bold'}}>ALI EAT</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Name"
            style={styles.input}
          />
          <TextInput
            value={telno}
            onChangeText={setTelno}
            placeholder="Contact No."
            style={styles.input}
          />
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="Address"
            style={styles.input}
          />
          <View style={{marginTop: 80}}>
                <Button
                  title="Refresh"
                  onPress={getOneTimeLocation}
                />
            </View>
          <Button onPress={onSave} title="Save" />
          <Text
            onPress={() => Auth.signOut()}
            style={{ textAlign: "center", color: "red", margin: 10 }}
          >
            Sign out
          </Text>
          <Text style={{ textAlign: "center" }}>
                {locationStatus}
            </Text>
            <Text style={{ textAlign: "center" }}>
                {currentLatitude} - {currentLongitude}
            </Text>
        </View>
        <View style={styles.searchContainer}>
              <GooglePlacesAutocomplete
                label='origin'
                styles={{ textInput: styles.input1 }}
                placeholder='Search'
                fetchDetails = {true}
                // currentLocation = {true}
                GooglePlacesSearchQuery={{
                  rankby: "distance"
                }}
                onPress={(data, details = null) => {
                  // 'details' is provided when fetchDetails = true 
                  console.log(data, details);
                  setUpdatedAddress(details.formatted_address);
                  setPin({
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                    latitudeDelta: 0.07,
                    longitudeDelta: 0.07
                  })
                }}
                query={{
                  key: 'AIzaSyAu_ux8VIqXTPc15_ATAQGUCkwHuD6Bl0g',
                  language: 'en',
                  components: "country:lk",
                  // types: "food",
                  // radius: 50000
                }}
              />
            </View>
    </View>

    );
};

// const Profile = () => {



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  input: {
    margin: 10,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
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
    top: Constants.statusBarHeight + 260,
    margin: 20
  },
  input1: {
    borderColor: "#888",
    borderWidth: 1,
  },
});

export default Profile;
