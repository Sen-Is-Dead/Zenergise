import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import styles from '../Styles/Home.Styles';

const HomePage = () => {
  const [profileComplete, setProfileComplete] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [isBreakDay, setIsBreakDay] = useState(false);

  const fetchData = async () => {
    try {
      const profileResponse = await axios.get('http://192.168.0.29:8000/api/check_user_profile/', { withCredentials: true });
      if (profileResponse.data.profile_complete) {
        const workoutResponse = await axios.get('http://192.168.0.29:8000/api/today_workout_details/', { withCredentials: true });
        if (!workoutResponse.data.workout_exists) {
          await triggerDailyWorkoutGeneration();
        }
        fetchWorkoutHistory();
        setProfileComplete(true);
      } else {
        setMessage("Profile page isn't complete. Please update your profile.");
        setProfileComplete(false);
      }
    } catch (error) {
      console.error("Error checking profile completion:", error);
      setMessage("An error occurred while checking profile status.");
      setProfileComplete(false);
    }
  };
  const triggerDailyWorkoutGeneration = async () => {
    try {
      const response = await axios.get('http://192.168.0.29:8000/api/generate_daily_workout/', { withCredentials: true });
      if (response.status !== 201) {
        throw new Error('No workout scheduled for today.');
      }
    } catch (error) {
      console.error("Failed to generate workout:", error);
      setIsBreakDay(true);
    }
  };

  const fetchWorkoutHistory = async () => {
    try {
      const response = await axios.get('http://192.168.0.29:8000/api/user_workout_history/', { withCredentials: true });
      setWorkoutHistory(response.data);
    } catch (error) {
      console.error("Error fetching workout history:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const dateFormatter = (dateString) => {
    const date = new Date(dateString);
    const dayName = date.toLocaleDateString('en-EN', { weekday: 'long' });
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);

    return `${dayName} ${day}/${month}/${year}`;
  };

  return (
    <ScrollView style={styles.container}>
      {profileComplete === null ? (
        <Text>Loading...</Text>
      ) : profileComplete ? (
        <React.Fragment>
          {isBreakDay && (
            <View style={styles.workoutContainer}>
              <Text style={styles.workoutHeader}>Break Day</Text>
              <Text style={styles.dateText}>{dateFormatter(new Date().toISOString())}</Text>
            </View>
          )}
          {workoutHistory.length > 0 ? workoutHistory.map((workout, index) => (
            <View key={index} style={styles.workoutContainer}>
              <Text style={styles.workoutHeader}>{workout.workout_name}</Text>
              <Text style={styles.dateText}>{dateFormatter(workout.date)}</Text>
              {workout.exercises.map((exercise, idx) => (
                <View key={idx}>
                  <Text style={styles.exercise}>{exercise.name}</Text>
                  <Text style={styles.description}>{exercise.description}</Text>
                  <Text style={styles.infoText}>Sets: {exercise.sets}</Text>
                  <Text style={styles.infoText}>Reps: {exercise.reps}</Text>
                  <Text style={styles.infoText}>Weight: {exercise.weight} kg</Text>
                  <View style={styles.divider} />
                </View>
              ))}
            </View>
          )) : !isBreakDay && <Text>{message || "No workouts found. Start by completing your profile and scheduling workouts."}</Text>}
        </React.Fragment>
      ) : (
        <Text style={styles.errorMessage}>{message}</Text>
      )}
    </ScrollView>
  );
};

export default HomePage;