import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Link, useRouter } from "expo-router";
import axios from 'axios';
import styles from './Styles/Styling';

const Register = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const submitRegistration = () => {
    if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
    }
    axios.post("http://192.168.0.29:8000/api/register", { email, password, confirm_password: confirmPassword })
        .then(response => {
            router.replace('home')
        })
        .catch(error => {
            if (error.response && error.response.data) {
                const errorMessages = Object.values(error.response.data).flat().join(' ');
                setErrorMessage(errorMessages);
            } else {
                setErrorMessage('Error during registration. Please try again.');
            }
        });
};

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor={'#666'}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor={'#666'}
        secureTextEntry
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        onChangeText={setConfirmPassword}
        placeholder="Confirm Password"
        placeholderTextColor={'#666'}
        secureTextEntry
        autoCapitalize="none"
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Link href={'/'} style={styles.linkText}>Already have an account? Login</Link>
      <Pressable style={styles.button} onPress={submitRegistration}>
        <Text style={styles.buttonText}>Register</Text>
      </Pressable>
    </View>
    </TouchableWithoutFeedback>
  );
};

export default Register;