import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { theme } from "../theme/index";
import { Ionicons } from "@expo/vector-icons";
import { CalendarDaysIcon, MapPinIcon } from "react-native-heroicons/solid";
import { debounce } from "lodash";
import { fetchLocations, fetchWeatherForecast } from "../api/weather";
import { weatherImages } from "../constants";
import * as Progress from 'react-native-progress';


const HomeScreen = () => {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([1,2,3]);
  const [weather,setWeather] = useState({})
  const [loading, setLoading] = useState(true);


  const handleLocation = (loc) => {
    console.log("location", loc);
    setLocations([]);
    fetchWeatherForecast({
      cityName: loc.name,
      days: "7",
    }).then((data) => {
      setWeather(data)
      console.log("got forecast:", data);
    });
  };

  const handleSearch = (value) => {
    //console.log('value:',value);
    //fetch locations
    if (value.length > 2) {
      fetchLocations({ cityName: value }).then((data) => {
        setLocations(data);
      });
    }
  };

  useEffect(()=>{
    fetchMyWeatherData();
  },[]);

  const fetchMyWeatherData = async =>{
    fetchWeatherForecast({
      cityName:'Mumbai',
      days:'7',
    }).then(data=>{
      setWeather(data);
    })    
  }

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);
  const {location,current,astro} = weather;

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <StatusBar style="light" />
      <ImageBackground
        blurRadius={70}
        source={require("../assets/background.jpeg")}
        style={{ position: "absolute", height: "100%", width: "100%" }}
      />
      {/* Search Section */}
      <SafeAreaView style={{ flex: 1, position: "relative" }}>
        <View
          style={{
            height: "7%",
            marginHorizontal: 4,
            zIndex: "50",
            position: "relative",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              width: "95%",
              borderRadius: 100,
              backgroundColor: showSearch
                ? "rgba(255, 255, 255, 0.2)"
                : "transparent",
            }}
          >
            {showSearch ? (
              <TextInput
                onChangeText={handleTextDebounce}
                placeholder="Search city"
                placeholderTextColor="lightgray"
                style={{
                  paddingLeft: 6,
                  height: 20,
                  paddingBottom: 1,
                  flex: 1,
                  fontSize: 14,
                  color: "white",
                }}
              />
            ) : null}

            <TouchableOpacity
              onPress={() => toggleSearch(!showSearch)}
              style={{
                backgroundColor: theme.bgWhite(0),
                borderRadius: 100,
                padding: 6,
                margin: 5,
              }}
            >
              <Ionicons name="search-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
          {locations.length > 0 && showSearch ? (
            <View
              style={{
                position: "absolute",
                width: "100%",
                backgroundColor: "white",
                borderRadius: 20,
                marginBottom: 20,
                marginTop: 60,
                top: "4%",
              }}
            >
              {locations.map((loc, index) => {
                let showBorder = index + 1 != locations.length;
                let borderClass = showBorder
                  ? { borderBottomWidth: 1, borderColor: "gray" }
                  : "";
                return (
                  <TouchableOpacity
                    onPress={() => handleLocation(loc)}
                    key={index}
                    style={{
                      flex: "row",
                      alignItems: "center",
                      borderRadius: 20,
                      marginTop: 10,
                      padding: 2,
                      paddingLeft: 1,
                      flexDirection: "row",
                      margin: 10,
                      ...borderClass,
                    }}
                  >
                    <Ionicons
                      name="location"
                      size={20}
                      color="gray"
                      style={{ paddingRight: 5 }}
                    />
                    <Text
                      style={{ color: "black", fontSize: 18, marginLeft: 2 }}
                    >
                      {loc?.name}, {loc?.country}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
        </View>
        {/* Forecast Section */}
        <View
          style={{
            marginHorizontal: 4,
            justifyContent: "space-around",
            flex: 1,
            marginBottom: 2,
          }}
        >
          {/* Location Section */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 28, fontWeight: "bold" }}>
              {location?.name},
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 20,
                fontWeight: "light",
                color: "lightgray",
                marginTop: 5,
              }}
            >
              {" "+location?.country}
            </Text>
          </View>
          {/* Weather Image */}
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Image
              //source={require("../assets/images/partlycloudy.png")}
              source={weatherImages[current?.condition?.text]}
              style={{ height: 130, width: 130 }}
            />
          </View>
          {/* Temperature Data */}
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 72 }}>
              {current?.temp_c}
            </Text>
            <Text
              style={{ color: "lightgray", fontSize: 20, letterSpacing: 2 }}
            >
              {current?.condition?.text}
            </Text>
          </View>
          {/* Other Stats */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 30,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 2,
              }}
            >
              <Image
                source={require("../assets/icons/wind.png")}
                style={{ width: 24, height: 24 }}
              />
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 16,
                  padding: 6,
                }}
              >
                {current?.wind_kph}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 2,
              }}
            >
              <Image
                source={require("../assets/icons/drop.png")}
                style={{ width: 24, height: 24 }}
              />
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 16,
                  padding: 6,
                }}
              >
                {current?.humidity}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 2,
              }}
            >
              <Image
                source={require("../assets/icons/sun.png")}
                style={{ width: 24, height: 24 }}
              />
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 16,
                  padding: 6,
                }}
              >
                {weather?.forecast?.forecastday[0]?.astro?.sunrise}
              </Text>
            </View>
          </View>

          {/* forecast for upcoming days */}
          <View style={{ marginBottom: 2, marginTop: 2 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                marginHorizontal: 10,
                marginBottom: 10,
              }}
            >
              <CalendarDaysIcon size={22} color="white" />
              <Text style={{ color: "white", fontSize: 16, marginLeft: 2 }}>
                Daily forecast
              </Text>
            </View>
            <ScrollView
              horizontal
              contentContainerStyle={{ paddingHorizontal: 15 }}
              showsHorizontalScrollIndicator={false}
            >
              {weather?.forecast?.forecastday?.map((item,index)=>{
                let date = new Date(item.date);
                let options = {weekday: 'long'};
                let dayName =date.toLocaleDateString('en-US', options);
                dayName = dayName.split(',')[0]
                return(
                  <View
                  key={index}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: 100,
                  paddingVertical: 10,
                  borderRadius: 20,
                  marginRight: 4,
                  backgroundColor: theme.bgWhite(0.15),
                  height: 130,
                }}
              >
                <Image
                  source={weatherImages[item?.day?.condition?.text]}
                  style={{ height: 44, width: 44 }}
                />
                <Text style={{ color: "white", padding: 5 }}>{dayName}</Text>
                <Text
                  style={{ color: "white", fontSize: 20, fontWeight: "500" }}
                >
                  {item?.day?.avgtemp_c}
                </Text>
              </View>
                )
              })}
              
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
