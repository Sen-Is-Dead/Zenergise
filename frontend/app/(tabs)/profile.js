import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import { useRouter } from 'expo-router';
import styles from '../Styles/Profile.Styles';

const ProfilePage = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editableUserInfo, setEditableUserInfo] = useState({});
  const [errorMessages, setErrorMessages] = useState('');
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);

  useEffect(() => {
    axios.get("http://192.168.0.29:8000/api/user", { withCredentials: true })
      .then(response => {
        setUserInfo(response.data.user);
        setEditableUserInfo(response.data.user);
        setSelectedPlan(response.data.user.workout_plan);
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
      });
    axios.get("http://192.168.0.29:8000/api/workout_plans", { withCredentials: true })
      .then(response => {
        setWorkoutPlans(response.data.map(plan => ({ label: plan.name, value: plan.id })));
      })
      .catch(error => {
        console.error("Error fetching workout plans:", error);
      });
  }, []);

  const handleLogout = () => {
    axios.post("http://192.168.0.29:8000/api/logout", {}, { withCredentials: true })
      .then(response => {
        console.log("Logged out successfully");
        router.replace('/');
      })
      .catch(error => {
        console.error("Logout failed:", error);
      });
  };

  const toggleEditMode = () => {
    if (editMode) {
      setEditableUserInfo(userInfo);
      setSelectedPlan(userInfo.workout_plan);
    }
    setEditMode(!editMode);
  };

  const handleSave = () => {
    axios.get('http://192.168.0.29:8000/api/get_csrf_token/', { withCredentials: true })
      .then(csrfResponse => {
        const csrfToken = csrfResponse.data.csrfToken;

        const updatePayload = {
          ...editableUserInfo,
          workout_plan: selectedPlan,
        };

        axios.put("http://192.168.0.29:8000/api/update_profile/", updatePayload, {
          withCredentials: true,
          headers: {
            'X-CSRFToken': csrfToken,
          }
        })
          .then(response => {
            setUserInfo(response.data);
            setEditMode(false);
            setErrorMessages('');
            setSelectedPlan(response.data.workout_plan);
            console.log(global.needRefresh)
            global.needRefresh = true;
            console.log(global.needRefresh)
          })
          .catch(error => {
            if (error.response && error.response.data) {
              const errorMessages = Object.values(error.response.data)
                .flat()
                .join(', ')
                .replace(/[\[\]'"]/g, '')
              setErrorMessages(errorMessages);
            } else {
              console.error("Profile update failed:", error);
            }
          });
      })
      .catch(error => {
        console.error("Error fetching CSRF token:", error);
      });
  };


  const handleChange = (name, value) => {
    setEditableUserInfo({ ...editableUserInfo, [name]: value });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {editMode ? (
          <>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Email:</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => handleChange('email', text)}
                value={editableUserInfo.email}
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Height (cm):</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => handleChange('height', text)}
                value={`${editableUserInfo.height}`}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Weight (kg):</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => handleChange('weight', text)}
                value={`${editableUserInfo.weight}`}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Body Fat (%):</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => handleChange('body_fat', text)}
                value={`${editableUserInfo.body_fat}`}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Target weight (kg):</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => handleChange('target_weight', text)}
                value={`${editableUserInfo.target_weight}`}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Target Body Fat (%):</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => handleChange('target_body_fat', text)}
                value={`${editableUserInfo.target_body_fat}`}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Workout Plan:</Text>
              <View style={styles.dropView}>
                <DropDownPicker
                  style={styles.dropdown}
                  open={openDropdown}
                  value={selectedPlan}
                  items={workoutPlans}
                  setOpen={setOpenDropdown}
                  setValue={setSelectedPlan}
                  setItems={setWorkoutPlans}
                  zIndex={3000}
                  zIndexInverse={1000}
                  dropDownContainerStyle={styles.dropdownoptions}
                  labelStyle={{ fontSize: 17 }}
                />
              </View>
            </View>
            {editMode && errorMessages ? <Text style={styles.error}>{errorMessages}</Text> : null}
            <View style={styles.buttonContainer}>
              <Pressable style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
              </Pressable>
              <Pressable style={styles.cancelButton} onPress={toggleEditMode}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <View style={styles.textContainer}>
              <Text style={styles.text}>Email: </Text>
              <Text style={styles.textInfo}> {userInfo.email}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.text}>Height: </Text>
              <Text style={styles.textInfo}> {userInfo.height} cm</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.text}>Weight: </Text>
              <Text style={styles.textInfo}> {userInfo.weight} kg</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.text}>Body Fat: </Text>
              <Text style={styles.textInfo}> {userInfo.body_fat} %</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.text}>Target Weight: </Text>
              <Text style={styles.textInfo}> {userInfo.target_weight} kg</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.text}>Target Body Fat: </Text>
              <Text style={styles.textInfo}> {userInfo.target_body_fat} %</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.text}>Workout Plan: </Text>
              <Text style={styles.textInfo}>
                {selectedPlan
                  ? ` ${workoutPlans.find(plan => plan.value === selectedPlan)?.label}`
                  : " Choose a workout plan"}
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <Pressable style={styles.editButton} onPress={() => setEditMode(true)}>
                <Text style={styles.buttonText}>Edit</Text>
              </Pressable>
              <Pressable style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.buttonText}>Log Out</Text>
              </Pressable>
            </View>
          </>
        )}
      </View>
    </TouchableWithoutFeedback >
  );
}

export default ProfilePage;