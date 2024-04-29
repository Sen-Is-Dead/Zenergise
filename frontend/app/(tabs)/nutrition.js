import React, { useState, useEffect, useCallback} from 'react';
import { View, Text, TextInput, FlatList, Image, ScrollView, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import styles from '../Styles/Nutrition.Styles';
import { useFocusEffect } from '@react-navigation/native';

const Nutrition = () => {
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState({ common: [], branded: [] });
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [totals, setTotals] = useState({ calories: 0, protein: 0 });
  const [foods, setFoods] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const { refresh: refreshParam } = useLocalSearchParams();
  const [groupedFoods, setGroupedFoods] = useState([]);
  const flatListHeight = Math.min(suggestions.common.length + suggestions.branded.length) * 28;
  const [csrfToken, setCsrfToken] = useState('');
  const [targetCalories, setTargetCalories] = useState(2000);
  const [targetProtein, setTargetProtein] = useState(200);
  const [profileComplete, setProfileComplete] = useState(null);

    const fetchUserTargets = async () => {
      try {
        const response = await axios.get('http://192.168.0.29:8000/api/user', { withCredentials: true });
        console.log(response.data.user.daily_calories_target)
        if (response.data.user.daily_calories_target && response.data.user.daily_protein_target) {
          setTargetCalories(response.data.user.daily_calories_target);
          setTargetProtein(response.data.user.daily_protein_target);
          console.log("targets set to: " + response.data.daily_calorie_target + " " + response.data.daily_protein_target)
        }
      } catch (error) {
        console.error('Error fetching user targets:', error);
      }
    };
    fetchUserTargets();

  useFocusEffect(
    useCallback(() => {
      fetchData();
      fetchUserFoods();
      fetchUserTargets();
    }, [])
  );

  const fetchData = async () => {
    try {
      const profileResponse = await axios.get('http://192.168.0.29:8000/api/check_user_profile/', { withCredentials: true });
      setProfileComplete(profileResponse.data.profile_complete);
    } catch (error) {
      console.error("Error checking profile completion:", error);
      setProfileComplete(false);
    }
  };

  useEffect(() => {
    fetchCsrfToken().then(token => {
      setCsrfToken(token);
    }).catch(error => {
      console.error('Error fetching CSRF token:', error);
    });
    if (refresh) {
      fetchUserFoods();
      setRefresh(false);
    }
  }, [refreshParam]);

  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get('http://192.168.0.29:8000/api/get_csrf_token/', { withCredentials: true });
      return response.data.csrfToken;
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
      throw error;
    }
  };

  const fetchUserFoods = async () => {
    try {

      const response = await axios.get('http://192.168.0.29:8000/api/user_foods/', { withCredentials: true });
      setFoods(response.data);
      groupFoodsByDate(response.data);
      calculateTodayTotals(response.data);
    } catch (error) {
      console.error("Error fetching user's foods:", error);
    }
  };

  const calculateTodayTotals = (foods) => {
    const today = new Date().toISOString().split('T')[0];
    let dailyCalories = 0;
    let dailyProtein = 0;

    foods.forEach(food => {
      if (food.date_added.split('T')[0] === today) {
        dailyCalories += Number(food.calories);
        dailyProtein += Number(food.protein);
      }
    });

    setTotals({ calories: dailyCalories, protein: dailyProtein });
  };

  const groupFoodsByDate = (foods) => {
    const grouped = foods.reduce((acc, food) => {
      const date = food.date_added.split('T')[0];
      acc[date] = acc[date] || [];
      acc[date].push(food);
      return acc;
    }, {});

    setGroupedFoods(grouped);
  };

  const renderFoodItem = ({ item }) => {
    const capitalizeText = text =>
      text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return (
      <View style={styles.foodItem}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        <Text style={styles.boldText}>{capitalizeText(item.food_name)}</Text>
        <View style={styles.nutritionInfo}>
          <Text>{item.calories} kcal</Text>
          <Text>{item.protein}g Protein</Text>
        </View>
      </View>
    );
  };

  const renderFoodGroup = (date, foods) => {
    const totalCalories = foods.reduce((acc, food) => acc + Number(food.calories), 0);
    const totalProtein = foods.reduce((acc, food) => acc + Number(food.protein), 0);

    return (
      <View key={date}>
        <Text style={styles.dateHeader}>{date}</Text>
        {foods.map((item, index) => (
          <FoodItem key={`${date}-${index}`} item={item} />
        ))}
        <Text style={styles.dailyTotal}>Total Calories: {totalCalories.toFixed(2)} kcal</Text>
        <Text style={styles.dailyTotal}>Total Protein: {totalProtein.toFixed(2)} g</Text>
      </View>
    );
  };

  const FoodItem = ({ item }) => {
    const capitalizeText = text =>
      text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    const handleDelete = () => {
      if (!csrfToken) {
        console.error("CSRF token is not available.");
        return;
      }

      axios.delete(`http://192.168.0.29:8000/api/delete_food/${item.id}/`, {
        headers: {
          'X-CSRFToken': csrfToken,
        },
        withCredentials: true
      })
        .then(() => {
          // Logic to remove the item from UI or state
          console.log('Food deleted successfully');
          fetchUserFoods();  // Refresh the list after deletion
        })
        .catch(error => {
          console.error("Error deleting food:", error);
        });
    };
    return (
      <View style={styles.foodItem}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        <Text style={styles.boldText}>{capitalizeText(item.food_name)}</Text>
        <View style={styles.nutritionInfo}>
          <Text>{item.calories} kcal</Text>
          <Text>{item.protein}g Protein</Text>
        </View>
        <Pressable onPress={handleDelete} style={styles.deleteButton}>
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>
    );
  };


  const percentToDegrees = (percent) => {
    return percent * 3.6;
  };

  const renderProgressCircle = (currentValue, targetValue, label, color, shadowColor) => {
    const radius = 50;
    const percentage = Math.min((currentValue / targetValue) * 100, 100);

    // Rotation calculations
    const firstHalfRotation = percentage > 50 ? 180 : percentToDegrees(percentage);
    const secondHalfRotation = percentage > 50 ? ((percentage - 50) * 3.6) : 0;

    return (
      <View style={styles.progressCircleContainer}>
        {/* Background Circle */}
        <View
          style={{
            width: radius * 2,
            height: radius * 2,
            borderRadius: radius,
            backgroundColor: shadowColor,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Overlay Half Circle */}
          <View
            style={{
              position: 'absolute',
              width: radius,
              height: radius * 2,
              backgroundColor: shadowColor,
              borderRadius: radius,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              borderCurve: '100%',
              marginRight: radius,
              left: 0,
              zIndex: 1,
            }}
          />
          {/* First Half Circle */}
          <View
            style={{
              position: 'absolute',
              width: radius,
              height: radius * 2,
              backgroundColor: color,
              borderRadius: radius,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              marginRight: radius,
              left: 0,
              transformOrigin: 'Right',
              transform: [{ rotate: `${firstHalfRotation}deg` }],
              zIndex: 0,
            }}
          />
          {/* Second Half Circle */}
          {percentage > 50 && (
            <View
              style={{
                position: 'absolute',
                width: radius,
                height: radius * 2,
                backgroundColor: color,
                borderRadius: radius,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                marginLeft: radius,
                transformOrigin: 'Left',
                right: 0,
                transform: [{ rotate: `${secondHalfRotation}deg` }],
                zIndex: 2,
              }}
            />
          )}
          {/* Inner Circle */}
          <View
            style={{
              width: (radius - 8) * 2,
              height: (radius - 8) * 2,
              borderRadius: radius - 8,
              backgroundColor: '#fff',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              zIndex: 3,
            }}
          >
            <Text style={{ fontSize: 14 }}>{`${currentValue.toFixed(0)}/${targetValue}`}</Text>
            <Text style={{ fontSize: 12 }}>{label}</Text>
          </View>

          {/* Final Outer Border Circle */}
          <View
            style={{
              width: radius * 2 + 25,
              height: radius * 2 + 25,
              borderRadius: (radius + 25),
              borderWidth: 12.5,
              borderColor: 'white',
              backgroundColor: 'transparent',
              position: 'absolute',
              zIndex: 4,
            }}
          />
        </View>
      </View>
    );
  };

  const fetchAutocomplete = async (text) => {
    setQuery(text);
    if (text.length > 2) {
      try {
        const response = await axios.get(`http://192.168.0.29:8000/api/nutritionix_instant/?query=${text}`);
        setSuggestions({
          common: response.data.common.slice(0, 5),
          branded: response.data.branded.slice(0, 5)
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      setSuggestions({ common: [], branded: [] });
    }
  };

  const passFoodName = (item) => {

    let foodName = '';
    if (item.nix_item_id) {

      foodName = `1${item.nix_item_id}`;
    } else {

      foodName = `2${item.food_name}`;
    }
    router.push({
      pathname: '/addFoodModal',
      params: { foodName: foodName },
    });
  };



  return (
    <View style={styles.container}>
      {profileComplete ? (
        <React.Fragment>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 20 }}>
            {renderProgressCircle(totals.calories, targetCalories, 'kcal', '#3399FF', '#ddd')}
            {renderProgressCircle(totals.protein, targetProtein, 'g Protein', '#34C759', '#ddd')}
          </View>
          <View>
            <TextInput
              style={styles.searchBar}
              placeholder="Search for food..."
              value={query}
              onChangeText={fetchAutocomplete}
              placeholderTextColor={'#666'}
            />
            <FlatList
              style={{ maxHeight: 350, height: flatListHeight }}
              data={[...suggestions.common, ...suggestions.branded]}
              keyExtractor={(item, index) => `${item.food_name}-${index}`}
              renderItem={({ item }) => (
                <Pressable style={styles.itemContainer} onPress={() => passFoodName(item)}>
                  <Image source={{ uri: item.photo.thumb }} style={styles.thumbnail} />
                  <Text style={styles.itemText}>{item.food_name}</Text>
                </Pressable>
              )}
            />
            <FlatList
              data={selectedFoods}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View>
                  <Text>{item.food_name}</Text>
                  <Text>Calories: {item.nf_calories}</Text>
                  <Text>Protein: {item.nf_protein}g</Text>
                </View>
              )}
            />
          </View>
          <ScrollView>

            {Object.entries(groupedFoods).map(([date, foods]) => renderFoodGroup(date, foods))}

          </ScrollView>
        </React.Fragment>
      ) : (
        <Text style={styles.errorMessage}>Please complete your profile to use the nutrition tracker.</Text>
      )}
    </View>
  );
};

export default Nutrition;