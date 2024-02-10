import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import styles from './Register.Styles';

const Register = ({ setEmail, setPassword, setConfirmPassword, submitRegistration, errorMessage }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Register</Text>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        placeholder="Enter email"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        onChangeText={setConfirmPassword}
        placeholder="Confirm Password"
        secureTextEntry
      />
      <Button onPress={submitRegistration} title="Register" />
    </View>
  );
};

export default Register;