import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, Pressable, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import styles from './Styles/FoodModal.Styles';

const AddFoodModal = () => {
  const router = useRouter();

  const { foodName } = useLocalSearchParams();
  const [foodItem, setFoodItem] = useState(null);
  const [selectedMeasure, setSelectedMeasure] = useState('');
  const [servings, setServings] = useState(1);
  const [open, setOpen] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {

    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('http://192.168.0.29:8000/api/get_csrf_token/');
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    const fetchFoodDetails = async () => {
      if (foodName) {
        const foodTypeIndicator = foodName[0];
        const actualFoodName = foodName.substring(1);

        let url = '';
        let data = {};

        if (foodTypeIndicator === '1') {
          url = `http://192.168.0.29:8000/api/nutritionix_search_item/?nix_item_id=${actualFoodName}`;
        } else if (foodTypeIndicator === '2') {
          url = 'http://192.168.0.29:8000/api/nutritionix_nutrients/';
          data = { query: actualFoodName };
        }

        try {
          const method = foodTypeIndicator === '1' ? 'get' : 'post';
          const response = await axios[method](url, data, { withCredentials: false });
          const foodDetails = response.data.foods[0];
          setFoodItem(foodDetails);
          setSelectedMeasure(foodDetails.serving_unit);
          if (foodTypeIndicator === '1') {
            setServings(foodDetails.serving_qty);
          }
        } catch (error) {
          console.error("Error fetching food details:", error);
        }
      }
    };
    fetchFoodDetails();

    fetchCsrfToken();

  }, [foodName]);

  const handleAddFood = async () => {

    const { calories, protein } = calculateNutrients();

    const url = 'http://192.168.0.29:8000/api/add_food/';
    const payload = {
      food_name: foodItem.food_name,
      thumbnail: foodItem.photo.thumb,
      calories: calories,
      protein: protein,
      serving_size: selectedMeasure,
      quantity: servings
    };

    let headers = {};
    if (Platform.OS === 'web') {
      const csrfToken = getCookie('csrftoken');
      headers['X-CSRFToken'] = csrfToken;
    }

    try {
      const response = await axios.post(url, payload, {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrfToken,
        },
      });
      router.replace('nutrition', { refresh: true });
    } catch (error) {
      console.error("Error adding food:", error);
    }
  };

  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  const calculateNutrients = () => {
    if (!foodItem) {
      return {
        calories: 0, protein: 0, carbs: 0, fat: 0,
        saturatedFat: 0, sugars: 0, fiber: 0,
        cholesterol: 0, sodium: 0
      };
    }

    let weightRatio = 1;
    if (foodItem.alt_measures) {
      const measure = foodItem.alt_measures.find(m => m.measure === selectedMeasure) || {};
      weightRatio = servings * measure.serving_weight / foodItem.serving_weight_grams;
    } else {
      const originalServings = foodItem.serving_qty || 1;
      weightRatio = servings / originalServings;
    }

    
    if(selectedMeasure === 'g' || selectedMeasure === 'grams') {
      weightRatio = servings / foodItem.serving_weight_grams;
    }

    return {
      calories: Math.round(weightRatio * foodItem.nf_calories),
      protein: Math.round(weightRatio * foodItem.nf_protein),
      carbs: Math.round(weightRatio * foodItem.nf_total_carbohydrate),
      fat: Math.round(weightRatio * foodItem.nf_total_fat),
      saturatedFat: Math.round(weightRatio * foodItem.nf_saturated_fat),
      sugars: Math.round(weightRatio * foodItem.nf_sugars),
      fiber: Math.round(weightRatio * foodItem.nf_dietary_fiber),
      cholesterol: Math.round(weightRatio * foodItem.nf_cholesterol),
      saturatedFat: Math.round(weightRatio * foodItem.nf_saturated_fat),
      sugars: Math.round(weightRatio * foodItem.nf_sugars),
      fiber: Math.round(weightRatio * foodItem.nf_dietary_fiber),
      cholesterol: Math.round(weightRatio * foodItem.nf_cholesterol),
      sodium: Math.round(weightRatio * foodItem.nf_sodium)
    };
  };

  const nutrientInfo = calculateNutrients();

  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const capitalize = (str) => str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {foodItem && (
          <>
            <View style={styles.headerRow}>
              <Image source={{ uri: foodItem.photo.thumb }} style={styles.image} />
              <Text style={styles.title}>{capitalize(foodItem.food_name)}</Text>
            </View>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                onChangeText={setServings}
                value={servings.toString()}
                keyboardType="numeric"
                placeholder="Enter servings"
              />
              <DropDownPicker
                open={open}
                value={selectedMeasure}
                items={
                  foodItem.alt_measures
                    ? foodItem.alt_measures.map((measure, index) => ({ label: measure.measure, value: measure.measure }))
                    : [{ label: foodItem.serving_unit, value: foodItem.serving_unit }]
                }
                setOpen={setOpen}
                setValue={setSelectedMeasure}
                setItems={() => { }}
                style={styles.picker}
                dropDownContainerStyle={styles.dropDownContainer}
              />
            </View>
            <Text style={styles.nutrientText}>Calories: {nutrientInfo.calories}</Text>
            <Text style={styles.nutrientText}>Protein: {nutrientInfo.protein}g</Text>
            <Text style={styles.nutrientText}>Carbs: {nutrientInfo.carbs}g</Text>
            <Text style={styles.nutrientText}>Fat: {nutrientInfo.fat}g</Text>
            <Text style={styles.nutrientText}>Saturated Fat: {nutrientInfo.saturatedFat}g</Text>
            <Text style={styles.nutrientText}>Sugars: {nutrientInfo.sugars}g</Text>
            <Text style={styles.nutrientText}>Fiber: {nutrientInfo.fiber}g</Text>
            <Text style={styles.nutrientText}>Cholesterol: {nutrientInfo.cholesterol}mg</Text>
            <Text style={styles.nutrientText}>Sodium: {nutrientInfo.sodium}mg</Text>
            <Pressable style={styles.addButton} onPress={handleAddFood}>
              <Text style={styles.addButtonText}>Add Food</Text>
            </Pressable>
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AddFoodModal;