import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import styles from './Login.Styles';

const Login = ({ setEmail, setPassword, submitLogin, errorMessage }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>
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
      <Button onPress={submitLogin} title="Login" />
    </View>
  );
};

export default Login;
